using System;
using System.Collections.Generic;
using Ilarune.Core;
using Ilarune.UI;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Ilarune.Hub
{
    /// <summary>
    /// Scene entry point for the clean-room portrait hub. Add this component to an empty
    /// GameObject; it creates the camera-ready world, accessible HUD, and ambient simulation.
    /// </summary>
    [DefaultExecutionOrder(-100)]
    [DisallowMultipleComponent]
    public sealed class HubBootstrap : MonoBehaviour
    {
        [SerializeField] private Camera worldCamera;
        [SerializeField] private HubQualityTier qualityTier = HubQualityTier.Auto;
        [SerializeField] private bool buildOnAwake = true;
        [SerializeField] private bool lockPortraitOrientation = true;

        private readonly List<HubBuildingView> buildings = new List<HubBuildingView>();
        private HubCameraController cameraController;
        private HubHudView hud;
        private bool built;

        public event Action<string> BuildingOpened;
        public event Action<string> NavigationRequested;
        public event Action<HubBuildingView> BuildingSelected;

        public Camera WorldCamera => worldCamera;
        public HubQualityProfile ActiveQuality { get; private set; }
        public IReadOnlyList<HubBuildingView> Buildings => buildings;

        private void Awake()
        {
            if (lockPortraitOrientation)
            {
                Screen.orientation = ScreenOrientation.Portrait;
            }

            if (buildOnAwake)
            {
                BuildHub();
            }
        }

        /// <summary>Idempotent runtime construction method for scene builders and tests.</summary>
        public void BuildHub()
        {
            if (built)
            {
                return;
            }

            built = true;
            ActiveQuality = HubQuality.Resolve(ResolveQualityTier());
            worldCamera = ResolveCamera();
            EnsureEventSystem();

            GameObject worldObject = new GameObject("ProceduralHubWorld");
            worldObject.transform.SetParent(transform, false);
            Transform worldRoot = worldObject.transform;

            HubBuildingDefinition[] definitions = CreateBuildingDefinitions();
            CreateTransitPaths(worldRoot, definitions);
            for (int i = 0; i < definitions.Length; i++)
            {
                buildings.Add(HubBuildingView.Create(worldRoot, definitions[i], worldCamera, ActiveQuality));
            }

            GameObject ambienceObject = new GameObject("AmbientSimulation");
            ambienceObject.transform.SetParent(worldRoot, false);
            HubAmbientDirector ambience = ambienceObject.AddComponent<HubAmbientDirector>();
            ambience.Configure(worldCamera, ActiveQuality, buildings);

            GameObject npcObject = new GameObject("NpcPool");
            npcObject.transform.SetParent(worldRoot, false);
            HubNpcPool npcPool = npcObject.AddComponent<HubNpcPool>();
            npcPool.Configure(worldCamera, CreateWaypoints(), ActiveQuality);

            cameraController = GetComponent<HubCameraController>();
            if (cameraController == null)
            {
                cameraController = gameObject.AddComponent<HubCameraController>();
            }

            cameraController.Configure(worldCamera, HandleSelectionChanged);

            hud = HubHudView.Create(transform);
            hud.SetPlayer("Astra", 12);
            hud.SetResources(4200, 180, 24, 30);
            hud.NavigationRequested += HandleNavigation;
            for (int i = 0; i < buildings.Count; i++)
            {
                HubBuildingView building = buildings[i];
                hud.CreateWorldLabel(
                    building.DisplayName,
                    worldCamera,
                    building.transform,
                    building.LabelWorldOffset,
                    () => cameraController.Focus(building));
            }

            HubCoreBinding coreBinding = GetComponent<HubCoreBinding>();
            if (coreBinding == null)
            {
                coreBinding = gameObject.AddComponent<HubCoreBinding>();
            }

            coreBinding.Configure(this, hud, buildings);
        }

        public void FocusBuilding(string buildingId)
        {
            for (int i = 0; i < buildings.Count; i++)
            {
                if (string.Equals(buildings[i].Id, buildingId, StringComparison.Ordinal))
                {
                    cameraController.Focus(buildings[i]);
                    return;
                }
            }
        }

        public void Back()
        {
            if (cameraController != null)
            {
                cameraController.ClearFocus();
            }
        }

        public void SetResourceValues(int softCurrency, int premiumCurrency, int energy, int energyCap)
        {
            if (hud != null)
            {
                hud.SetResources(softCurrency, premiumCurrency, energy, energyCap);
            }
        }

        private Camera ResolveCamera()
        {
            Camera camera = worldCamera != null ? worldCamera : Camera.main;
            if (camera == null)
            {
                GameObject cameraObject = new GameObject("HubCamera", typeof(Camera));
                cameraObject.transform.SetParent(transform, false);
                camera = cameraObject.GetComponent<Camera>();
                cameraObject.tag = "MainCamera";
            }

            camera.orthographic = true;
            camera.orthographicSize = 10.8f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = ProceduralHubArt.DeepSky;
            camera.nearClipPlane = 0.1f;
            camera.farClipPlane = 100f;
            camera.transform.position = new Vector3(0f, -0.4f, -10f);
            camera.transform.rotation = Quaternion.identity;
            return camera;
        }

        private void EnsureEventSystem()
        {
            if (EventSystem.current != null)
            {
                return;
            }

            GameObject eventSystemObject = new GameObject(
                "HubEventSystem",
                typeof(EventSystem),
                typeof(StandaloneInputModule));
            eventSystemObject.transform.SetParent(transform, false);
        }

        private void HandleSelectionChanged(HubBuildingView building)
        {
            if (building == null)
            {
                hud.HideBuilding();
                BuildingSelected?.Invoke(null);
                return;
            }

            hud.ShowBuilding(
                building.DisplayName,
                building.Level,
                building.Description,
                () => HandleBuildingOpen(building),
                () => cameraController.ClearFocus());
            BuildingSelected?.Invoke(building);
        }

        private void HandleBuildingOpen(HubBuildingView building)
        {
            BuildingOpened?.Invoke(building.Id);
            Debug.Log("[Ilarune.Hub] Open requested: " + building.Id, this);
        }

        private void HandleNavigation(string destination)
        {
            NavigationRequested?.Invoke(destination);
            Debug.Log("[Ilarune.Hub] Navigation requested: " + destination, this);
        }

        private HubQualityTier ResolveQualityTier()
        {
            if (qualityTier != HubQualityTier.Auto)
            {
                return qualityTier;
            }

            CoreRuntimeBootstrap runtime = CoreRuntimeBootstrap.Instance;
            MobileQualityProfile profile = runtime?.Quality?.CurrentProfile;
            if (profile == null)
            {
                return HubQualityTier.Auto;
            }

            switch (profile.tier)
            {
                case MobileQualityTier.Low:
                    return HubQualityTier.Low;
                case MobileQualityTier.High:
                    return HubQualityTier.High;
                default:
                    return HubQualityTier.Medium;
            }
        }

        private static HubBuildingDefinition[] CreateBuildingDefinitions()
        {
            return new[]
            {
                new HubBuildingDefinition(
                    "sky-observatory", "Sky Observatory", "Chart drifting constellations",
                    new Vector2(-2.35f, 7.2f), HubBuildingStyle.Observatory, ProceduralHubArt.Aqua, 1),
                new HubBuildingDefinition(
                    "ember-foundry", "Ember Foundry", "Refine expedition materials",
                    new Vector2(2.2f, 5.75f), HubBuildingStyle.Foundry, ProceduralHubArt.Ember, 1),
                new HubBuildingDefinition(
                    "lumina-garden", "Lumina Garden", "Nurture restorative blooms",
                    new Vector2(-0.85f, 3.75f), HubBuildingStyle.Conservatory, new Color32(135, 241, 170, 255), 1),
                new HubBuildingDefinition(
                    "signal-atelier", "Signal Atelier", "Tune messages from afar",
                    new Vector2(2.75f, 1.35f), HubBuildingStyle.Atelier, ProceduralHubArt.Orchid, 1),
                new HubBuildingDefinition(
                    "moonglass-archive", "Moonglass Archive", "Review discoveries and lore",
                    new Vector2(-3f, 0.2f), HubBuildingStyle.Archive, new Color32(137, 165, 255, 255), 1),
                new HubBuildingDefinition(
                    "aether-exchange", "Aether Exchange", "Trade motes with travelers",
                    new Vector2(0.15f, -2.15f), HubBuildingStyle.Exchange, ProceduralHubArt.Aqua, 1),
                new HubBuildingDefinition(
                    "wayfinder-dock", "Wayfinder Dock", "Dispatch crews across the veil",
                    new Vector2(3f, -4.65f), HubBuildingStyle.Dock, ProceduralHubArt.Orchid, 1),
                new HubBuildingDefinition(
                    "hearth-workshop", "Hearth Workshop", "Craft charms and field gear",
                    new Vector2(-2.5f, -5.6f), HubBuildingStyle.Workshop, ProceduralHubArt.Ember, 1),
                new HubBuildingDefinition(
                    "expedition-gate", "Expedition Gate", "Begin the next journey",
                    new Vector2(0.35f, -8.15f), HubBuildingStyle.Gate, new Color32(116, 235, 216, 255), 1)
            };
        }

        private static List<Vector3> CreateWaypoints()
        {
            // Twelve shared nodes keep all eight-plus active NPCs on coherent, cheap routes.
            return new List<Vector3>
            {
                new Vector3(-2.6f, 6.1f, 0f),
                new Vector3(0f, 6.2f, 0f),
                new Vector3(2.25f, 4.55f, 0f),
                new Vector3(1.4f, 2.35f, 0f),
                new Vector3(-1.35f, 2.15f, 0f),
                new Vector3(-2.4f, -0.85f, 0f),
                new Vector3(-0.35f, -1.1f, 0f),
                new Vector3(2f, -1.25f, 0f),
                new Vector3(2.35f, -3.55f, 0f),
                new Vector3(0.4f, -4.1f, 0f),
                new Vector3(-1.95f, -4.35f, 0f),
                new Vector3(0.1f, -6.95f, 0f)
            };
        }

        private static void CreateTransitPaths(Transform parent, IReadOnlyList<HubBuildingDefinition> definitions)
        {
            GameObject pathRootObject = new GameObject("TransitPaths");
            pathRootObject.transform.SetParent(parent, false);
            Transform pathRoot = pathRootObject.transform;
            int[,] links =
            {
                { 0, 2 }, { 1, 2 }, { 2, 3 }, { 2, 4 }, { 3, 5 }, { 4, 5 },
                { 5, 6 }, { 5, 7 }, { 6, 8 }, { 7, 8 }
            };

            for (int i = 0; i < links.GetLength(0); i++)
            {
                Vector2 from = definitions[links[i, 0]].Position;
                Vector2 to = definitions[links[i, 1]].Position;
                Vector2 delta = to - from;
                float angle = Mathf.Atan2(delta.y, delta.x) * Mathf.Rad2Deg;
                SpriteRenderer bridge = ProceduralHubArt.CreateRenderer(
                    pathRoot,
                    "Bridge_" + i,
                    HubShape.Capsule,
                    new Color32(133, 120, 158, 210),
                    new Vector3((from.x + to.x) * 0.5f, (from.y + to.y) * 0.5f, 0f),
                    new Vector2(delta.magnitude, 0.16f),
                    -105);
                bridge.transform.localRotation = Quaternion.Euler(0f, 0f, angle);

                ProceduralHubArt.CreateRenderer(
                    bridge.transform,
                    "EnergyRail",
                    HubShape.Capsule,
                    new Color(0.38f, 0.95f, 0.86f, 0.42f),
                    Vector3.zero,
                    new Vector2(1f, 0.22f),
                    -104);
            }
        }
    }
}
