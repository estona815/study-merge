using System;
using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Ilarune.UI
{
    /// <summary>
    /// Portrait hub chrome built from runtime UGUI primitives and TextMeshPro labels.
    /// String/action boundaries keep this assembly independent from hub and core logic.
    /// </summary>
    [DisallowMultipleComponent]
    public sealed class HubHudView : MonoBehaviour
    {
        public event Action<string> NavigationRequested;
        public event Action BackRequested;

        private RectTransform safeRoot;
        private RectTransform labelLayer;
        private RectTransform focusCard;
        private RectTransform developmentOverlay;
        private TMP_Text playerInitialText;
        private TMP_Text playerNameText;
        private TMP_Text playerLevelText;
        private TMP_Text focusTitle;
        private TMP_Text focusSubtitle;
        private TMP_Text softCurrencyText;
        private TMP_Text premiumCurrencyText;
        private TMP_Text energyText;
        private TMP_Text focusPrimaryLabel;
        private TMP_Text focusSecondaryLabel;
        private TMP_Text developmentTitle;
        private TMP_Text developmentBody;
        private Button focusPrimaryButton;
        private Button focusSecondaryButton;
        private Action focusPrimaryAction;
        private Action focusSecondaryAction;
        private Action focusCloseAction;
        private CanvasGroup focusCanvasGroup;
        private Coroutine focusTransition;

        public static HubHudView Create(Transform parent)
        {
            GameObject root = new GameObject(
                "HubHud",
                typeof(RectTransform),
                typeof(Canvas),
                typeof(CanvasScaler),
                typeof(GraphicRaycaster));
            root.transform.SetParent(parent, false);
            HubHudView view = root.AddComponent<HubHudView>();
            view.Build();
            return view;
        }

        public void Build()
        {
            if (safeRoot != null)
            {
                return;
            }

            Canvas canvas = GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 100;

            CanvasScaler scaler = GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080f, 2400f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.72f;
            scaler.referencePixelsPerUnit = 100f;

            safeRoot = ProceduralUi.CreateRect(
                transform, "SafeArea", Color.clear,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero, false);
            safeRoot.gameObject.AddComponent<SafeAreaFitter>();

            labelLayer = ProceduralUi.CreateRect(
                safeRoot, "WorldLabels", Color.clear,
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero, false);
            BuildTopBar();
            BuildSideNavigation();
            BuildBottomNavigation();
            BuildFocusCard();
            BuildDevelopmentOverlay();
        }

        public void SetPlayer(string playerName, int playerLevel)
        {
            string safeName = string.IsNullOrWhiteSpace(playerName) ? "WAYFARER" : playerName.Trim();
            if (playerNameText != null)
            {
                playerNameText.text = safeName.ToUpperInvariant();
            }

            if (playerLevelText != null)
            {
                playerLevelText.text = "LEVEL " + Mathf.Max(1, playerLevel) + "  ·  SKYFARER";
            }

            if (playerInitialText != null)
            {
                playerInitialText.text = safeName.Substring(0, 1).ToUpperInvariant();
            }
        }

        public void SetResources(int softCurrency, int premiumCurrency, int energy, int energyCap)
        {
            if (softCurrencyText != null)
            {
                softCurrencyText.text = Mathf.Max(0, softCurrency).ToString("N0");
            }

            if (premiumCurrencyText != null)
            {
                premiumCurrencyText.text = Mathf.Max(0, premiumCurrency).ToString("N0");
            }

            if (energyText != null)
            {
                energyText.text = Mathf.Max(0, energy) + "/" + Mathf.Max(1, energyCap);
            }
        }

        public WorldTrackedLabel CreateWorldLabel(
            string displayName,
            Camera worldCamera,
            Transform worldTarget,
            Vector3 worldOffset,
            Action onClick)
        {
            Button button = ProceduralUi.CreateButton(
                labelLayer,
                "BuildingLabel_" + displayName,
                displayName,
                new Color32(31, 27, 55, 230),
                ProceduralUi.Paper,
                36,
                new Vector2(0.5f, 0.5f),
                new Vector2(0.5f, 0.5f),
                Vector2.zero,
                new Vector2(336f, 120f),
                null);
            WorldTrackedLabel label = button.gameObject.AddComponent<WorldTrackedLabel>();
            label.Bind(worldCamera, worldTarget, labelLayer, worldOffset, onClick);
            return label;
        }

        public void ShowBuilding(
            string displayName,
            int level,
            string description,
            Action primaryAction,
            Action closeAction)
        {
            ShowBuilding(
                displayName,
                level,
                description,
                "OPEN",
                primaryAction,
                null,
                null,
                closeAction);
        }

        public void ShowBuilding(
            string displayName,
            int level,
            string description,
            string primaryLabel,
            Action primaryAction,
            string secondaryLabel,
            Action secondaryAction,
            Action closeAction)
        {
            focusTitle.text = string.IsNullOrWhiteSpace(displayName) ? "BUILDING" : displayName;
            focusSubtitle.text = "LEVEL " + Mathf.Max(1, level) + "  ·  " + (description ?? string.Empty);
            focusPrimaryAction = primaryAction;
            focusSecondaryAction = secondaryAction;
            focusCloseAction = closeAction;
            ConfigureActionButton(focusPrimaryButton, focusPrimaryLabel, primaryLabel, primaryAction);
            ConfigureActionButton(focusSecondaryButton, focusSecondaryLabel, secondaryLabel, secondaryAction);
            SetFocusVisible(true);
        }

        public void HideBuilding()
        {
            focusPrimaryAction = null;
            focusSecondaryAction = null;
            focusCloseAction = null;
            SetFocusVisible(false);
        }

        public void ShowDevelopmentPlaceholder(string title, string details)
        {
            developmentTitle.text = string.IsNullOrWhiteSpace(title) ? "COMING SOON" : title.ToUpperInvariant();
            developmentBody.text = string.IsNullOrWhiteSpace(details)
                ? "This destination is represented by an explicit local-development screen."
                : details;
            developmentOverlay.gameObject.SetActive(true);
        }

        public void HideDevelopmentPlaceholder()
        {
            if (developmentOverlay != null)
            {
                developmentOverlay.gameObject.SetActive(false);
            }
        }

        private void BuildTopBar()
        {
            RectTransform bar = ProceduralUi.CreateRect(
                safeRoot, "TopStatus", new Color32(25, 22, 46, 238),
                new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(0f, -146f), new Vector2(-48f, 264f));

            Button avatar = ProceduralUi.CreateButton(
                bar, "Profile", "A", new Color32(184, 110, 255, 255), ProceduralUi.Ink, 48,
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(76f, 56f), new Vector2(104f, 104f),
                () => RaiseNavigation("Profile"));
            Image avatarImage = avatar.GetComponent<Image>();
            avatarImage.sprite = ProceduralUi.CircleSprite;
            avatarImage.type = Image.Type.Simple;
            playerInitialText = avatar.GetComponentInChildren<TMP_Text>();

            playerNameText = ProceduralUi.CreateText(
                bar, "PlayerName", "ASTRA", 42, ProceduralUi.Paper, TextAnchor.MiddleLeft,
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(328f, 78f), new Vector2(390f, 56f), FontStyle.Bold);
            playerLevelText = ProceduralUi.CreateText(
                bar, "PlayerLevel", "LEVEL 12  ·  SKYFARER", 30, new Color32(190, 185, 216, 255), TextAnchor.MiddleLeft,
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(328f, 26f), new Vector2(390f, 48f));

            ProceduralUi.CreateButton(
                bar, "Notifications", "!", new Color32(255, 190, 102, 255), ProceduralUi.Ink, 44,
                new Vector2(1f, 0.5f), new Vector2(1f, 0.5f), new Vector2(-66f, 56f), new Vector2(96f, 96f),
                () => RaiseNavigation("Notifications"));

            softCurrencyText = CreateResourcePill(
                bar, "MOTES", "4,200", new Color32(100, 226, 211, 255), 212f);
            premiumCurrencyText = CreateResourcePill(
                bar, "PRISM", "180", new Color32(200, 125, 255, 255), 519f);
            energyText = CreateResourcePill(
                bar, "SPARK", "24/30", new Color32(255, 187, 105, 255), 826f);
        }

        private static TMP_Text CreateResourcePill(
            Transform parent,
            string caption,
            string initialValue,
            Color accent,
            float x)
        {
            RectTransform pill = ProceduralUi.CreateRect(
                parent, caption, new Color32(53, 48, 79, 255),
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(x, -74f), new Vector2(278f, 102f));
            ProceduralUi.CreateRect(
                pill, "Accent", accent,
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(20f, 0f), new Vector2(12f, 62f));
            ProceduralUi.CreateText(
                pill, "Caption", caption, 30, new Color32(191, 187, 214, 255), TextAnchor.UpperLeft,
                Vector2.zero, Vector2.one, new Vector2(22f, -4f), new Vector2(-54f, -12f), FontStyle.Bold);
            return ProceduralUi.CreateText(
                pill, "Value", initialValue, 38, ProceduralUi.Paper, TextAnchor.LowerLeft,
                Vector2.zero, Vector2.one, new Vector2(22f, 4f), new Vector2(-54f, -12f), FontStyle.Bold);
        }

        private void BuildSideNavigation()
        {
            RectTransform leftRail = ProceduralUi.CreateRect(
                safeRoot, "WorldActions", new Color32(24, 21, 44, 205),
                new Vector2(0f, 0.5f), new Vector2(0f, 0.5f), new Vector2(112f, 20f), new Vector2(196f, 760f));
            CreateQuickButton(leftRail, "Journey", "JOURNEY", 280f, new Color32(99, 226, 211, 255));
            CreateQuickButton(leftRail, "Arena", "ARENA", 140f, new Color32(145, 169, 255, 255));
            CreateQuickButton(leftRail, "Clan Boss", "CLAN\nBOSS", 0f, new Color32(200, 125, 255, 255));
            CreateQuickButton(leftRail, "Daily", "DAILY", -140f, new Color32(255, 194, 108, 255));
            CreateQuickButton(leftRail, "Chest", "CHEST", -280f, new Color32(112, 229, 178, 255));

            RectTransform rightRail = ProceduralUi.CreateRect(
                safeRoot, "QuickActions", new Color32(24, 21, 44, 205),
                new Vector2(1f, 0.5f), new Vector2(1f, 0.5f), new Vector2(-112f, 20f), new Vector2(196f, 628f));
            CreateQuickButton(rightRail, "Summon", "SUMMON", 210f, new Color32(196, 120, 255, 255));
            CreateQuickButton(rightRail, "News", "NEWS", 70f, new Color32(96, 224, 211, 255));
            CreateQuickButton(rightRail, "Event", "EVENT", -70f, new Color32(255, 176, 103, 255));
            CreateQuickButton(rightRail, "Login Reward", "LOGIN", -210f, new Color32(255, 214, 120, 255));
        }

        private void CreateQuickButton(Transform rail, string route, string label, float y, Color color)
        {
            ProceduralUi.CreateButton(
                rail, route, label, color, ProceduralUi.Ink, 34,
                new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, y), new Vector2(164f, 116f),
                () => RaiseNavigation(route));
        }

        private void BuildBottomNavigation()
        {
            RectTransform bar = ProceduralUi.CreateRect(
                safeRoot, "BottomNavigation", new Color32(24, 21, 44, 245),
                new Vector2(0f, 0f), new Vector2(1f, 0f), new Vector2(0f, 104f), new Vector2(-48f, 184f));

            string[] destinations = { "World", "Heroes", "Battle", "Clan", "Mail", "Menu" };
            for (int i = 0; i < destinations.Length; i++)
            {
                string destination = destinations[i];
                float normalized = (i + 0.5f) / destinations.Length;
                bool active = i == 0;
                ProceduralUi.CreateButton(
                    bar, destination, destination,
                    active ? new Color32(99, 226, 211, 255) : new Color32(57, 52, 82, 255),
                    active ? ProceduralUi.Ink : ProceduralUi.Paper,
                    32,
                    new Vector2(normalized, 0.5f), new Vector2(normalized, 0.5f),
                    Vector2.zero, new Vector2(154f, 128f),
                    () => RaiseNavigation(destination));
            }
        }

        private void BuildFocusCard()
        {
            focusCard = ProceduralUi.CreateRect(
                safeRoot, "BuildingFocus", new Color32(29, 26, 51, 250),
                new Vector2(0f, 0f), new Vector2(1f, 0f), new Vector2(0f, 357f), new Vector2(-64f, 318f));
            focusCard.GetComponent<Image>().raycastTarget = true;
            focusCanvasGroup = focusCard.gameObject.AddComponent<CanvasGroup>();
            focusCanvasGroup.alpha = 0f;

            focusTitle = ProceduralUi.CreateText(
                focusCard, "Title", "BUILDING", 50, ProceduralUi.Paper, TextAnchor.MiddleLeft,
                new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(-4f, -62f), new Vector2(-170f, 82f), FontStyle.Bold);
            focusSubtitle = ProceduralUi.CreateText(
                focusCard, "Subtitle", "LEVEL 1", 32, new Color32(190, 185, 216, 255), TextAnchor.MiddleLeft,
                new Vector2(0f, 0f), new Vector2(1f, 1f), new Vector2(-4f, 2f), new Vector2(-64f, -118f));

            focusSecondaryButton = ProceduralUi.CreateButton(
                focusCard, "SecondaryAction", "UPGRADE", new Color32(78, 71, 104, 255), ProceduralUi.Paper, 34,
                new Vector2(1f, 0f), new Vector2(1f, 0f), new Vector2(-408f, 68f), new Vector2(274f, 108f),
                () => focusSecondaryAction?.Invoke());
            focusSecondaryLabel = focusSecondaryButton.GetComponentInChildren<TMP_Text>();

            focusPrimaryButton = ProceduralUi.CreateButton(
                focusCard, "PrimaryAction", "OPEN", ProceduralUi.Aqua, ProceduralUi.Ink, 36,
                new Vector2(1f, 0f), new Vector2(1f, 0f), new Vector2(-142f, 68f), new Vector2(238f, 108f),
                () => focusPrimaryAction?.Invoke());
            focusPrimaryLabel = focusPrimaryButton.GetComponentInChildren<TMP_Text>();

            ProceduralUi.CreateButton(
                focusCard, "Close", "×", new Color32(78, 71, 104, 255), ProceduralUi.Paper, 48,
                new Vector2(1f, 1f), new Vector2(1f, 1f), new Vector2(-64f, -58f), new Vector2(104f, 104f),
                CloseFocus);

            focusCard.gameObject.SetActive(false);
        }

        private void BuildDevelopmentOverlay()
        {
            developmentOverlay = ProceduralUi.CreateRect(
                safeRoot, "DevelopmentPlaceholder", new Color32(14, 12, 28, 224),
                Vector2.zero, Vector2.one, Vector2.zero, Vector2.zero, false);
            developmentOverlay.GetComponent<Image>().raycastTarget = true;

            RectTransform panel = ProceduralUi.CreateRect(
                developmentOverlay, "Panel", new Color32(38, 34, 67, 255),
                new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), Vector2.zero, new Vector2(820f, 620f));
            developmentTitle = ProceduralUi.CreateText(
                panel, "Title", "COMING SOON", 54, ProceduralUi.Paper, TextAnchor.MiddleCenter,
                new Vector2(0f, 1f), new Vector2(1f, 1f), new Vector2(0f, -104f), new Vector2(-80f, 100f), FontStyle.Bold);
            developmentBody = ProceduralUi.CreateText(
                panel, "Body", "Development placeholder", 36, new Color32(205, 199, 228, 255), TextAnchor.MiddleCenter,
                new Vector2(0f, 0f), new Vector2(1f, 1f), new Vector2(0f, -6f), new Vector2(-112f, -250f));
            ProceduralUi.CreateButton(
                panel, "Close", "BACK TO SKY CITY", ProceduralUi.Aqua, ProceduralUi.Ink, 38,
                new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 82f), new Vector2(430f, 116f),
                HideDevelopmentPlaceholder);

            developmentOverlay.gameObject.SetActive(false);
        }

        private static void ConfigureActionButton(Button button, TMP_Text label, string caption, Action action)
        {
            bool visible = button != null && action != null && !string.IsNullOrWhiteSpace(caption);
            if (button != null)
            {
                button.gameObject.SetActive(visible);
            }

            if (visible && label != null)
            {
                label.text = caption;
            }
        }

        private void CloseFocus()
        {
            Action callback = focusCloseAction;
            if (callback != null)
            {
                callback.Invoke();
            }
            else
            {
                HideBuilding();
            }

            BackRequested?.Invoke();
        }

        private void SetFocusVisible(bool visible)
        {
            if (focusCard == null)
            {
                return;
            }

            if (focusTransition != null)
            {
                StopCoroutine(focusTransition);
            }

            focusTransition = StartCoroutine(FadeFocus(visible));
        }

        private IEnumerator FadeFocus(bool visible)
        {
            if (visible)
            {
                focusCard.gameObject.SetActive(true);
            }

            float start = focusCanvasGroup.alpha;
            float end = visible ? 1f : 0f;
            float elapsed = 0f;
            const float duration = 0.16f;
            focusCanvasGroup.interactable = visible;
            focusCanvasGroup.blocksRaycasts = visible;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = Mathf.Clamp01(elapsed / duration);
                focusCanvasGroup.alpha = Mathf.Lerp(start, end, 1f - Mathf.Pow(1f - t, 3f));
                yield return null;
            }

            focusCanvasGroup.alpha = end;
            if (!visible)
            {
                focusCard.gameObject.SetActive(false);
            }

            focusTransition = null;
        }

        private void RaiseNavigation(string destination)
        {
            NavigationRequested?.Invoke(destination);
        }
    }
}
