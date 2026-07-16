using System;
using System.Collections.Generic;
using Ilarune.Core;
using Ilarune.Shared;
using Ilarune.UI;
using UnityEngine;

namespace Ilarune.Hub
{
    /// <summary>
    /// Scene-local composition boundary between the procedural hub and persistent Core services.
    /// It waits for asynchronous Core initialization, guards snapshot-event re-entry, and never
    /// forwards an unvalidated visual building id into BuildingService.
    /// </summary>
    [DisallowMultipleComponent]
    public sealed class HubCoreBinding : MonoBehaviour
    {
        private const int DemoEnergyCap = 30;

        private static readonly Dictionary<string, string> CoreBuildingIds =
            new Dictionary<string, string>(StringComparer.Ordinal)
            {
                { "sky-observatory", "research_annex" },
                { "ember-foundry", "sky_foundry" },
                { "lumina-garden", "aether_mine" },
                { "signal-atelier", "command_spire" }
            };

        private HubBootstrap hub;
        private HubHudView hud;
        private IReadOnlyList<HubBuildingView> buildings;
        private HubBuildingView selectedBuilding;
        private CoreRuntimeBootstrap core;
        private GameSessionService session;
        private bool configured;
        private bool hubSubscribed;
        private bool readySubscribed;
        private bool refreshing;

        public void Configure(
            HubBootstrap hubBootstrap,
            HubHudView hubHud,
            IReadOnlyList<HubBuildingView> buildingViews)
        {
            if (hubBootstrap == null)
            {
                throw new ArgumentNullException(nameof(hubBootstrap));
            }

            if (hubHud == null)
            {
                throw new ArgumentNullException(nameof(hubHud));
            }

            hub = hubBootstrap;
            hud = hubHud;
            buildings = buildingViews ?? throw new ArgumentNullException(nameof(buildingViews));
            configured = true;
            SubscribeHub();
            TryAttachCore();
        }

        private void OnEnable()
        {
            if (!configured)
            {
                return;
            }

            SubscribeHub();
            TryAttachCore();
        }

        private void Update()
        {
            if (configured && session == null)
            {
                TryAttachCore();
            }
        }

        private void OnDisable()
        {
            UnsubscribeHub();
            DetachCore();
        }

        private void SubscribeHub()
        {
            if (hubSubscribed || hub == null)
            {
                return;
            }

            hub.BuildingSelected += HandleBuildingSelected;
            hub.BuildingOpened += HandleBuildingOpened;
            hub.NavigationRequested += HandleNavigation;
            hubSubscribed = true;
        }

        private void UnsubscribeHub()
        {
            if (!hubSubscribed || hub == null)
            {
                return;
            }

            hub.BuildingSelected -= HandleBuildingSelected;
            hub.BuildingOpened -= HandleBuildingOpened;
            hub.NavigationRequested -= HandleNavigation;
            hubSubscribed = false;
        }

        private void TryAttachCore()
        {
            CoreRuntimeBootstrap candidate = CoreRuntimeBootstrap.Instance;
            if (candidate == null)
            {
                return;
            }

            if (core != candidate)
            {
                DetachCore();
                core = candidate;
            }

            if (!core.IsReady)
            {
                if (!readySubscribed)
                {
                    core.Ready += HandleCoreReady;
                    readySubscribed = true;
                }

                return;
            }

            CompleteCoreAttachment();
        }

        private void HandleCoreReady()
        {
            CompleteCoreAttachment();
        }

        private void CompleteCoreAttachment()
        {
            if (core == null || !core.IsReady || core.Session == null)
            {
                return;
            }

            if (readySubscribed)
            {
                core.Ready -= HandleCoreReady;
                readySubscribed = false;
            }

            if (session != core.Session)
            {
                if (session != null)
                {
                    session.SnapshotChanged -= HandleSnapshotChanged;
                }

                session = core.Session;
                session.SnapshotChanged += HandleSnapshotChanged;
            }

            RefreshFromSnapshot(session.Snapshot, true);
        }

        private void DetachCore()
        {
            if (core != null && readySubscribed)
            {
                core.Ready -= HandleCoreReady;
            }

            if (session != null)
            {
                session.SnapshotChanged -= HandleSnapshotChanged;
            }

            readySubscribed = false;
            session = null;
            core = null;
        }

        private void HandleSnapshotChanged(GameSnapshot snapshot)
        {
            if (refreshing)
            {
                return;
            }

            RefreshFromSnapshot(snapshot, true);
        }

        private void RefreshFromSnapshot(GameSnapshot snapshot, bool refreshSelectedPanel)
        {
            if (snapshot == null || hud == null)
            {
                return;
            }

            bool previousRefreshing = refreshing;
            refreshing = true;
            try
            {
                hud.SetPlayer(snapshot.playerName, snapshot.playerLevel);
                hud.SetResources(
                    snapshot.softCurrency,
                    snapshot.premiumCurrency,
                    snapshot.energy,
                    DemoEnergyCap);

                for (int i = 0; i < buildings.Count; i++)
                {
                    HubBuildingView building = buildings[i];
                    if (building == null || !CoreBuildingIds.TryGetValue(building.Id, out string coreId))
                    {
                        continue;
                    }

                    building.SetLevel(FindBuildingLevel(snapshot, coreId));
                }

                if (refreshSelectedPanel && selectedBuilding != null)
                {
                    PresentBuilding(selectedBuilding);
                }
            }
            finally
            {
                refreshing = previousRefreshing;
            }
        }

        private void HandleBuildingSelected(HubBuildingView building)
        {
            selectedBuilding = building;
            if (building != null)
            {
                PresentBuilding(building);
            }
        }

        private void HandleBuildingOpened(string visualBuildingId)
        {
            HubBuildingView building = FindBuilding(visualBuildingId);
            if (building == null)
            {
                ShowPlaceholder(
                    "Unknown Building",
                    "This visual building has no registered local-demo destination.",
                    false);
                return;
            }

            selectedBuilding = building;
            PresentBuilding(building);
        }

        private void PresentBuilding(HubBuildingView building)
        {
            if (TryResolveBuildingScene(building.Id, out string sceneId))
            {
                hud.ShowBuilding(
                    building.DisplayName,
                    building.Level,
                    building.Description + "  ·  Offline battle route ready",
                    "ENTER",
                    () => OpenScene(sceneId),
                    null,
                    null,
                    () => hub.Back());
                return;
            }

            if (!CoreBuildingIds.TryGetValue(building.Id, out string coreBuildingId))
            {
                hud.ShowBuilding(
                    building.DisplayName,
                    building.Level,
                    building.Description + "  ·  Local preview",
                    "DETAILS",
                    () => ShowBuildingPlaceholder(building),
                    null,
                    null,
                    () => hub.Back());
                return;
            }

            if (!IsCoreReady())
            {
                hud.ShowBuilding(
                    building.DisplayName,
                    building.Level,
                    building.Description + "  ·  Loading local profile",
                    "STATUS",
                    () => ShowPlaceholder(
                        "Core Loading",
                        "The offline profile is still initializing. Building actions will unlock automatically.",
                        false),
                    null,
                    null,
                    () => hub.Back());
                return;
            }

            if (!HasCoreBuildingDefinition(coreBuildingId))
            {
                hud.ShowBuilding(
                    building.DisplayName,
                    building.Level,
                    building.Description,
                    "DETAILS",
                    () => ShowPlaceholder(
                        "Content Mapping Missing",
                        "The clean local content table does not contain the mapped building id. No Core call was made.",
                        false),
                    null,
                    null,
                    () => hub.Back());
                return;
            }

            BuildingStatus status = GetBuildingStatus(coreBuildingId);
            building.SetLevel(status.level);
            string details = building.Description
                             + "  ·  " + status.storedAmount.ToString("N0") + "/" + status.capacity.ToString("N0") + " stored"
                             + "  ·  " + status.productionPerMinute.ToString("N0") + "/min";
            string upgradeLabel = status.isMaxLevel
                ? null
                : "UPGRADE " + status.nextUpgradeCost.ToString("N0");
            Action upgradeAction = null;
            if (!status.isMaxLevel)
            {
                upgradeAction = () => UpgradeBuilding(building, coreBuildingId);
            }

            hud.ShowBuilding(
                building.DisplayName,
                status.level,
                details,
                "COLLECT",
                () => CollectBuilding(building, coreBuildingId),
                upgradeLabel,
                upgradeAction,
                () => hub.Back());
        }

        private BuildingStatus GetBuildingStatus(string coreBuildingId)
        {
            bool previousRefreshing = refreshing;
            refreshing = true;
            try
            {
                return core.Buildings.GetStatus(coreBuildingId);
            }
            finally
            {
                refreshing = previousRefreshing;
            }
        }

        private void CollectBuilding(HubBuildingView building, string coreBuildingId)
        {
            if (!IsCoreReady() || !HasCoreBuildingDefinition(coreBuildingId))
            {
                ShowPlaceholder(
                    "Building Unavailable",
                    "The local building service is not ready. No currency was changed.",
                    false);
                return;
            }

            int collected;
            bool previousRefreshing = refreshing;
            refreshing = true;
            try
            {
                collected = core.Buildings.Collect(coreBuildingId);
            }
            finally
            {
                refreshing = previousRefreshing;
            }

            RefreshFromSnapshot(session.Snapshot, false);
            PresentBuilding(building);
            ShowPlaceholder(
                collected > 0 ? "Production Collected" : "Storage Empty",
                collected > 0
                    ? collected.ToString("N0") + " motes were added to the offline profile."
                    : "No completed production is waiting yet. The local timer continues while the app is open or paused.",
                false);
        }

        private void UpgradeBuilding(HubBuildingView building, string coreBuildingId)
        {
            if (!IsCoreReady() || !HasCoreBuildingDefinition(coreBuildingId))
            {
                ShowPlaceholder(
                    "Building Unavailable",
                    "The local building service is not ready. No currency was changed.",
                    false);
                return;
            }

            bool upgraded;
            string failureReason;
            bool previousRefreshing = refreshing;
            refreshing = true;
            try
            {
                upgraded = core.Buildings.TryUpgrade(coreBuildingId, out failureReason);
            }
            finally
            {
                refreshing = previousRefreshing;
            }

            RefreshFromSnapshot(session.Snapshot, false);
            PresentBuilding(building);
            if (!upgraded)
            {
                ShowPlaceholder(
                    "Upgrade Not Applied",
                    string.IsNullOrWhiteSpace(failureReason)
                        ? "The local upgrade rules rejected this action."
                        : failureReason,
                    false);
            }
        }

        private void HandleNavigation(string destination)
        {
            switch (destination)
            {
                case "World":
                case "Hub":
                    hud.HideDevelopmentPlaceholder();
                    hub.Back();
                    return;
                case "Journey":
                case "Battle":
                case "Explore":
                    OpenScene(SceneIds.BattleStage);
                    return;
                case "Arena":
                case "PvP":
                case "Raid":
                    OpenScene(SceneIds.BattlePvp);
                    return;
                case "Clan Boss":
                case "Clan":
                case "Guild":
                    OpenScene(SceneIds.BattleClanBoss);
                    return;
                default:
                    ShowPlaceholder(
                        destination,
                        destination + " is an explicit offline-development placeholder. "
                        + "No production server, account, payment, mail, or inventory API is called.",
                        true);
                    return;
            }
        }

        private void OpenScene(string sceneId)
        {
            if (!IsCoreReady() || core.Scenes == null)
            {
                ShowPlaceholder(
                    "Scene Loading Unavailable",
                    "The offline scene navigator is still initializing. No network request was attempted.",
                    true);
                return;
            }

            if (!Application.CanStreamedLevelBeLoaded(sceneId))
            {
                ShowPlaceholder(
                    "Scene Not In Build",
                    sceneId + " is not available in the current Build Settings. Run the project content bootstrap before capture.",
                    true);
                return;
            }

            hud.HideDevelopmentPlaceholder();
            hub.Back();
            core.Scenes.Open(sceneId);
        }

        private void ShowBuildingPlaceholder(HubBuildingView building)
        {
            ShowPlaceholder(
                building.DisplayName,
                building.Description + ". This feature has a visible local-development boundary and requires its future domain/UI adapter.",
                false);
        }

        private void ShowPlaceholder(string title, string details, bool clearBuildingFocus)
        {
            if (clearBuildingFocus)
            {
                hub.Back();
            }

            hud.ShowDevelopmentPlaceholder(title, details);
        }

        private bool IsCoreReady()
        {
            return core != null && core.IsReady && session != null && core.Buildings != null;
        }

        private bool HasCoreBuildingDefinition(string coreBuildingId)
        {
            if (core?.Content?.buildings == null || string.IsNullOrWhiteSpace(coreBuildingId))
            {
                return false;
            }

            for (int i = 0; i < core.Content.buildings.Count; i++)
            {
                BuildingDefinition definition = core.Content.buildings[i];
                if (definition != null && string.Equals(definition.id, coreBuildingId, StringComparison.Ordinal))
                {
                    return true;
                }
            }

            return false;
        }

        private HubBuildingView FindBuilding(string visualBuildingId)
        {
            for (int i = 0; i < buildings.Count; i++)
            {
                HubBuildingView building = buildings[i];
                if (building != null && string.Equals(building.Id, visualBuildingId, StringComparison.Ordinal))
                {
                    return building;
                }
            }

            return null;
        }

        private static int FindBuildingLevel(GameSnapshot snapshot, string coreBuildingId)
        {
            if (snapshot.buildings == null)
            {
                return 1;
            }

            for (int i = 0; i < snapshot.buildings.Count; i++)
            {
                BuildingState state = snapshot.buildings[i];
                if (state != null && string.Equals(state.id, coreBuildingId, StringComparison.Ordinal))
                {
                    return Mathf.Max(1, state.level);
                }
            }

            return 1;
        }

        private static bool TryResolveBuildingScene(string visualBuildingId, out string sceneId)
        {
            switch (visualBuildingId)
            {
                case "wayfinder-dock":
                case "expedition-gate":
                    sceneId = SceneIds.BattleStage;
                    return true;
                default:
                    sceneId = null;
                    return false;
            }
        }
    }
}
