using System;
using System.Collections;
using System.Collections.Generic;
using Ilarune.Core;
using Ilarune.Shared;
using Ilarune.UI;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace Ilarune.Battle
{
    [DisallowMultipleComponent]
    public sealed class BattleBootstrap : MonoBehaviour
    {
        private static readonly Color BackgroundTop = new Color32(18, 18, 43, 255);
        private static readonly Color BackgroundBottom = new Color32(5, 8, 24, 255);
        private static readonly Color PanelColor = new Color32(31, 34, 66, 238);
        private static readonly Color AccentColor = new Color32(238, 194, 99, 255);
        private static readonly Color MutedColor = new Color32(174, 180, 210, 255);

        private readonly List<Button> _tileButtons = new List<Button>();
        private readonly List<Image> _tileImages = new List<Image>();

        private RectTransform _safeArea;
        private RectTransform _enemyHealthFill;
        private RectTransform _heroHealthFill;
        private RectTransform _manaFill;
        private TextMeshProUGUI _titleText;
        private TextMeshProUGUI _enemyNameText;
        private TextMeshProUGUI _enemyHealthText;
        private TextMeshProUGUI _waveText;
        private TextMeshProUGUI _heroStatsText;
        private TextMeshProUGUI _statusText;
        private TextMeshProUGUI _skillText;
        private TextMeshProUGUI _autoText;
        private TextMeshProUGUI _speedText;
        private Button _skillButton;
        private Button _retryButton;
        private Button _returnButton;
        private Button _autoButton;
        private Button _speedButton;
        private BoardCoordinate? _selected;
        private bool _autoEnabled;
        private int _speedMultiplier = 1;
        private float _nextAutoTurnAt;
        private string _status = "Select two adjacent runes to attack.";
        private int _screenWidth;
        private int _screenHeight;
        private Rect _lastSafeArea;

        public bool IsInitialized { get; private set; }
        public BattleSession Session { get; private set; }
        public int TileButtonCount => _tileButtons.Count;

        private void Awake()
        {
            if (IsInitialized)
            {
                return;
            }

            var sceneName = SceneManager.GetActiveScene().name;
            Session = new BattleSession(BattlePresets.CreateForScene(sceneName));
            Session.Signaled += OnBattleSignal;
            Session.RewardGranted += OnRewardGranted;
            EnsureEventSystem();
            BuildInterface(sceneName);
            ApplySafeArea(true);
            Render();
            IsInitialized = true;
        }

        private void Update()
        {
            ApplySafeArea(false);
            RunAutoTurnIfDue();
        }

        private void OnDestroy()
        {
            if (Session != null)
            {
                Session.Signaled -= OnBattleSignal;
                Session.RewardGranted -= OnRewardGranted;
            }
        }

        public void SimulateTileTap(int x, int y)
        {
            HandleTileTap(new BoardCoordinate(x, y));
        }

        public BattleTurnResult TryUseSkillForDemo()
        {
            var result = Session.TryUseSkill();
            if (!result.Accepted)
            {
                _status = Session.Outcome == BattleOutcome.InProgress
                    ? "Not enough mana for Moonfall."
                    : "Retry to begin another battle.";
            }

            _selected = null;
            Render();
            return result;
        }

        public void RetryBattle()
        {
            Session.Retry();
            _selected = null;
            _status = "Fresh runes, fresh chance. Choose a tile.";
            Render();
        }

        public void ReturnToHub()
        {
            var runtime = CoreRuntimeBootstrap.Instance;
            if (runtime != null && runtime.IsReady)
            {
                runtime.Scenes.Open(SceneIds.Main);
                return;
            }

            SceneManager.LoadScene(SceneIds.Main);
        }

        public void ToggleAutoBattle()
        {
            _autoEnabled = !_autoEnabled && Session.Outcome == BattleOutcome.InProgress;
            _selected = null;
            _nextAutoTurnAt = Time.unscaledTime + 0.2f;
            _status = _autoEnabled ? "Auto battle engaged." : "Auto battle paused.";
            Render();
        }

        public void CycleBattleSpeed()
        {
            _speedMultiplier = _speedMultiplier == 1 ? 2 : _speedMultiplier == 2 ? 4 : 1;
            _nextAutoTurnAt = Time.unscaledTime + 0.2f;
            Render();
        }

        private void RunAutoTurnIfDue()
        {
            if (!_autoEnabled || Session == null || Session.Outcome != BattleOutcome.InProgress
                || Time.unscaledTime < _nextAutoTurnAt)
            {
                return;
            }

            var result = Session.TryAutoTurn();
            _selected = null;
            _nextAutoTurnAt = Time.unscaledTime + 1.1f / _speedMultiplier;
            if (!result.Accepted)
            {
                _autoEnabled = false;
                _status = "Auto battle paused: no valid action.";
            }

            Render();
        }

        private void HandleTileTap(BoardCoordinate coordinate)
        {
            if (Session.Outcome != BattleOutcome.InProgress)
            {
                _status = "The battle is over. Tap Retry to play again.";
                Render();
                return;
            }

            if (!_selected.HasValue)
            {
                _selected = coordinate;
                _status = "Rune selected. Choose an adjacent rune.";
                Render();
                return;
            }

            if (_selected.Value.Equals(coordinate))
            {
                _selected = null;
                _status = "Selection cleared.";
                Render();
                return;
            }

            if (!_selected.Value.IsAdjacentTo(coordinate))
            {
                _selected = coordinate;
                _status = "Selection moved. Choose one of its four neighbors.";
                Render();
                return;
            }

            var result = Session.TrySwap(_selected.Value, coordinate);
            _selected = null;
            if (!result.Accepted)
            {
                _status = result.BoardMove != null && result.BoardMove.WasRolledBack
                    ? "No match — the swap was rolled back."
                    : "That swap is unavailable.";
            }
            else if (result.BoardMove.Resolution.CascadeCount > 0)
            {
                _status = "Cascade x" + (result.BoardMove.Resolution.CascadeCount + 1) + "! " + result.PlayerDamageDealt + " damage.";
            }

            Render();
        }

        private void OnBattleSignal(BattleSignal signal)
        {
            switch (signal.Kind)
            {
                case BattleSignalKind.PlayerAttack:
                    _status = "Runes strike for " + signal.Amount + " damage.";
                    break;
                case BattleSignalKind.EnemyAttack:
                    _status = signal.Message + " for " + signal.Amount + ".";
                    break;
                case BattleSignalKind.SkillUsed:
                    _status = "Moonfall crashes down for " + signal.Amount + "!";
                    break;
                case BattleSignalKind.WaveStarted:
                    _status = "Wave " + signal.Amount + ": " + signal.Message;
                    break;
                case BattleSignalKind.Victory:
                    _autoEnabled = false;
                    _status = "VICTORY — the path ahead is open.";
                    break;
                case BattleSignalKind.Defeat:
                    _autoEnabled = false;
                    _status = "DEFEAT — regroup and try a new opening.";
                    break;
                case BattleSignalKind.RewardGranted:
                    _status = "VICTORY — reward secured: " + signal.Amount + " moon shards.";
                    break;
            }
        }

        private void OnRewardGranted(RewardGrant reward)
        {
            StartCoroutine(GrantRewardWhenRuntimeReady(reward));
        }

        private static void GrantReward(CoreRuntimeBootstrap runtime, RewardGrant reward)
        {
            runtime.Rewards.Grant(reward);
            _ = runtime.Session.SaveAsync();
        }

        private static bool TryGrantReward(RewardGrant reward)
        {
            var runtime = CoreRuntimeBootstrap.Instance;
            if (runtime == null || !runtime.IsReady)
            {
                return false;
            }

            GrantReward(runtime, reward);
            return true;
        }

        private IEnumerator GrantRewardWhenRuntimeReady(RewardGrant reward)
        {
            if (TryGrantReward(reward))
            {
                yield break;
            }

            while (CoreRuntimeBootstrap.Instance == null || !CoreRuntimeBootstrap.Instance.IsReady)
            {
                if (CoreRuntimeBootstrap.Instance != null && CoreRuntimeBootstrap.Instance.InitializationError != null)
                {
                    _status = "Reward created, but local save initialization failed.";
                    Render();
                    yield break;
                }

                yield return null;
            }

            GrantReward(CoreRuntimeBootstrap.Instance, reward);
        }

        private void BuildInterface(string sceneName)
        {
            var canvasObject = new GameObject("BattleCanvas", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            canvasObject.transform.SetParent(transform, false);
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 20;
            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080f, 1920f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            var backdropObject = CreateRectObject("ProceduralBackdrop", canvasObject.transform);
            Stretch(backdropObject.GetComponent<RectTransform>());
            var backdrop = backdropObject.AddComponent<ProceduralBackdropGraphic>();
            backdrop.TopColor = BackgroundTop;
            backdrop.BottomColor = BackgroundBottom;
            backdrop.raycastTarget = false;

            var safeObject = CreateRectObject("SafeArea", canvasObject.transform);
            _safeArea = safeObject.GetComponent<RectTransform>();
            Stretch(_safeArea);

            _autoButton = CreateButton("AutoButton", _safeArea, new Vector2(0.04f, 0.938f), new Vector2(0.24f, 0.988f), new Color32(52, 116, 126, 255));
            _autoText = CreateText("Label", _autoButton.transform, Vector2.zero, Vector2.one, 22, TextAnchor.MiddleCenter, Color.white);
            _autoText.fontStyle = FontStyles.Bold;
            _autoButton.onClick.AddListener(ToggleAutoBattle);

            _titleText = CreateText("ModeTitle", _safeArea, new Vector2(0.25f, 0.935f), new Vector2(0.75f, 0.99f), 34, TextAnchor.MiddleCenter, AccentColor);
            _titleText.fontStyle = FontStyles.Bold;
            _titleText.text = FormatModeTitle(sceneName);

            _speedButton = CreateButton("SpeedButton", _safeArea, new Vector2(0.76f, 0.938f), new Vector2(0.96f, 0.988f), new Color32(84, 78, 141, 255));
            _speedText = CreateText("Label", _speedButton.transform, Vector2.zero, Vector2.one, 22, TextAnchor.MiddleCenter, Color.white);
            _speedText.fontStyle = FontStyles.Bold;
            _speedButton.onClick.AddListener(CycleBattleSpeed);

            var enemyPanel = CreatePanel("EnemyPanel", _safeArea, new Vector2(0.05f, 0.765f), new Vector2(0.95f, 0.925f));
            var sigilObject = CreateRectObject("EnemySigil", enemyPanel);
            Anchor(sigilObject.GetComponent<RectTransform>(), new Vector2(0.03f, 0.18f), new Vector2(0.25f, 0.88f));
            var sigil = sigilObject.AddComponent<ProceduralSigilGraphic>();
            sigil.InnerColor = new Color32(129, 96, 214, 255);
            sigil.OuterColor = new Color32(44, 28, 91, 255);
            sigil.raycastTarget = false;

            _enemyNameText = CreateText("EnemyName", enemyPanel, new Vector2(0.27f, 0.53f), new Vector2(0.95f, 0.90f), 35, TextAnchor.MiddleLeft, Color.white);
            _enemyNameText.fontStyle = FontStyles.Bold;
            _waveText = CreateText("Wave", enemyPanel, new Vector2(0.27f, 0.72f), new Vector2(0.95f, 0.96f), 22, TextAnchor.MiddleRight, MutedColor);
            _enemyHealthText = CreateText("EnemyHealth", enemyPanel, new Vector2(0.27f, 0.29f), new Vector2(0.95f, 0.53f), 22, TextAnchor.MiddleLeft, MutedColor);
            _enemyHealthFill = CreateMeter("EnemyHealthMeter", enemyPanel, new Vector2(0.27f, 0.14f), new Vector2(0.95f, 0.29f), new Color32(221, 77, 105, 255));

            _statusText = CreateText("BattleStatus", _safeArea, new Vector2(0.06f, 0.704f), new Vector2(0.94f, 0.758f), 25, TextAnchor.MiddleCenter, Color.white);

            var boardPanel = CreatePanel("RuneBoard", _safeArea, new Vector2(0.08f, 0.205f), new Vector2(0.92f, 0.698f));
            var gridObject = CreateRectObject("RuneGrid", boardPanel);
            Stretch(gridObject.GetComponent<RectTransform>(), 18f);
            var grid = gridObject.AddComponent<GridLayoutGroup>();
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = Session.Board.Columns;
            grid.cellSize = new Vector2(104f, 104f);
            grid.spacing = new Vector2(8f, 8f);
            grid.childAlignment = TextAnchor.MiddleCenter;
            grid.startCorner = GridLayoutGroup.Corner.UpperLeft;
            grid.startAxis = GridLayoutGroup.Axis.Horizontal;

            for (var displayY = Session.Board.Rows - 1; displayY >= 0; displayY--)
            {
                for (var x = 0; x < Session.Board.Columns; x++)
                {
                    var coordinate = new BoardCoordinate(x, displayY);
                    var button = CreateTileButton(gridObject.transform, coordinate);
                    _tileButtons.Add(button);
                    _tileImages.Add(button.GetComponent<Image>());
                }
            }

            var heroPanel = CreatePanel("HeroPanel", _safeArea, new Vector2(0.05f, 0.105f), new Vector2(0.63f, 0.19f));
            _heroStatsText = CreateText("HeroStats", heroPanel, new Vector2(0.04f, 0.44f), new Vector2(0.96f, 0.96f), 23, TextAnchor.MiddleLeft, Color.white);
            _heroHealthFill = CreateMeter("HeroHealthMeter", heroPanel, new Vector2(0.04f, 0.25f), new Vector2(0.96f, 0.42f), new Color32(76, 205, 137, 255));
            _manaFill = CreateMeter("ManaMeter", heroPanel, new Vector2(0.04f, 0.06f), new Vector2(0.96f, 0.22f), new Color32(91, 151, 244, 255));

            _skillButton = CreateButton("SkillButton", _safeArea, new Vector2(0.66f, 0.105f), new Vector2(0.95f, 0.19f), new Color32(102, 76, 177, 255));
            _skillText = CreateText("Label", _skillButton.transform, Vector2.zero, Vector2.one, 24, TextAnchor.MiddleCenter, Color.white);
            _skillText.fontStyle = FontStyles.Bold;
            _skillButton.onClick.AddListener(() => TryUseSkillForDemo());

            _retryButton = CreateButton("RetryButton", _safeArea, new Vector2(0.05f, 0.02f), new Vector2(0.48f, 0.085f), new Color32(197, 83, 101, 255));
            var retryLabel = CreateText("Label", _retryButton.transform, Vector2.zero, Vector2.one, 27, TextAnchor.MiddleCenter, Color.white);
            retryLabel.fontStyle = FontStyles.Bold;
            retryLabel.text = "RETRY BATTLE";
            _retryButton.onClick.AddListener(RetryBattle);

            _returnButton = CreateButton("ReturnButton", _safeArea, new Vector2(0.52f, 0.02f), new Vector2(0.95f, 0.085f), new Color32(70, 91, 138, 255));
            var returnLabel = CreateText("Label", _returnButton.transform, Vector2.zero, Vector2.one, 27, TextAnchor.MiddleCenter, Color.white);
            returnLabel.fontStyle = FontStyles.Bold;
            returnLabel.text = "RETURN TO HUB";
            _returnButton.onClick.AddListener(ReturnToHub);
        }

        private Button CreateTileButton(Transform parent, BoardCoordinate coordinate)
        {
            var buttonObject = new GameObject("Rune_" + coordinate.X + "_" + coordinate.Y, typeof(RectTransform), typeof(Image), typeof(Button));
            buttonObject.transform.SetParent(parent, false);
            var image = buttonObject.GetComponent<Image>();
            image.color = Color.white;
            var button = buttonObject.GetComponent<Button>();
            var colors = button.colors;
            colors.highlightedColor = new Color(1.14f, 1.14f, 1.14f, 1f);
            colors.pressedColor = new Color(0.75f, 0.75f, 0.75f, 1f);
            colors.selectedColor = AccentColor;
            colors.fadeDuration = 0.08f;
            button.colors = colors;
            button.onClick.AddListener(() => HandleTileTap(coordinate));

            var label = CreateText("Glyph", buttonObject.transform, Vector2.zero, Vector2.one, 25, TextAnchor.MiddleCenter, Color.white);
            label.fontStyle = FontStyles.Bold;
            label.raycastTarget = false;
            return button;
        }

        private void Render()
        {
            if (Session == null || _enemyNameText == null)
            {
                return;
            }

            _enemyNameText.text = Session.CurrentEnemy.DisplayName;
            _waveText.text = "WAVE " + (Session.WaveIndex + 1) + " / " + Session.WaveCount;
            _enemyHealthText.text = "HP  " + Session.CurrentEnemyHealth + " / " + Session.CurrentEnemy.MaxHealth
                + "   •   WEAK: " + Session.CurrentEnemy.Weakness.ToString().ToUpperInvariant();
            SetMeter(_enemyHealthFill, Session.CurrentEnemyHealth, Session.CurrentEnemy.MaxHealth);

            _heroStatsText.text = "ASTRA   HP " + Session.PlayerHealth + "/" + Session.PlayerMaxHealth
                + "   MANA " + Session.Mana + "/" + Session.MaxMana;
            SetMeter(_heroHealthFill, Session.PlayerHealth, Session.PlayerMaxHealth);
            SetMeter(_manaFill, Session.Mana, Session.MaxMana);
            _statusText.text = _status;
            _skillText.text = "MOONFALL\n" + Session.Mana + " / " + Session.SkillManaCost;
            _skillButton.interactable = Session.Outcome == BattleOutcome.InProgress && Session.Mana >= Session.SkillManaCost;
            _autoButton.interactable = Session.Outcome == BattleOutcome.InProgress;
            _autoText.text = _autoEnabled ? "AUTO ON" : "AUTO OFF";
            _speedText.text = _speedMultiplier + "× SPEED";
            _retryButton.gameObject.SetActive(Session.Outcome != BattleOutcome.InProgress);
            _returnButton.gameObject.SetActive(Session.Outcome != BattleOutcome.InProgress);

            var index = 0;
            for (var y = Session.Board.Rows - 1; y >= 0; y--)
            {
                for (var x = 0; x < Session.Board.Columns; x++)
                {
                    var tile = Session.Board.GetTile(x, y);
                    var selected = _selected.HasValue && _selected.Value.X == x && _selected.Value.Y == y;
                    _tileImages[index].color = selected ? Color.Lerp(TileColor(tile.Element), AccentColor, 0.55f) : TileColor(tile.Element);
                    var label = _tileButtons[index].GetComponentInChildren<TextMeshProUGUI>();
                    label.text = TileGlyph(tile);
                    _tileButtons[index].interactable = Session.Outcome == BattleOutcome.InProgress;
                    index++;
                }
            }
        }

        private static string TileGlyph(BoardTile tile)
        {
            var element = tile.Element == TileElement.Fire ? "FIRE"
                : tile.Element == TileElement.Water ? "TIDE"
                : tile.Element == TileElement.Nature ? "GROW"
                : tile.Element == TileElement.Light ? "LUX"
                : "VOID";
            if (tile.Special == TileSpecial.None)
            {
                return element;
            }

            var special = tile.Special == TileSpecial.RowClear ? "↔"
                : tile.Special == TileSpecial.ColumnClear ? "↕"
                : tile.Special == TileSpecial.Burst ? "✦"
                : "ALL";
            return element + "\n" + special;
        }

        private static Color TileColor(TileElement element)
        {
            switch (element)
            {
                case TileElement.Fire:
                    return new Color32(212, 78, 84, 255);
                case TileElement.Water:
                    return new Color32(55, 139, 210, 255);
                case TileElement.Nature:
                    return new Color32(64, 169, 119, 255);
                case TileElement.Light:
                    return new Color32(223, 181, 79, 255);
                default:
                    return new Color32(116, 79, 171, 255);
            }
        }

        private static void SetMeter(RectTransform fill, int value, int maximum)
        {
            var ratio = maximum <= 0 ? 0f : Mathf.Clamp01((float)value / maximum);
            fill.anchorMax = new Vector2(ratio, 1f);
        }

        private void ApplySafeArea(bool force)
        {
            if (_safeArea == null || Screen.width <= 0 || Screen.height <= 0)
            {
                return;
            }

            var safe = Screen.safeArea;
            if (!force && _screenWidth == Screen.width && _screenHeight == Screen.height && safe == _lastSafeArea)
            {
                return;
            }

            _screenWidth = Screen.width;
            _screenHeight = Screen.height;
            _lastSafeArea = safe;
            _safeArea.anchorMin = new Vector2(safe.xMin / Screen.width, safe.yMin / Screen.height);
            _safeArea.anchorMax = new Vector2(safe.xMax / Screen.width, safe.yMax / Screen.height);
            _safeArea.offsetMin = Vector2.zero;
            _safeArea.offsetMax = Vector2.zero;
        }

        private static string FormatModeTitle(string sceneName)
        {
            if (string.Equals(sceneName, "Battle_PvP", StringComparison.OrdinalIgnoreCase))
            {
                return "MOONLIT ARENA";
            }

            if (string.Equals(sceneName, "Battle_ClanBoss", StringComparison.OrdinalIgnoreCase))
            {
                return "CLAN CONSTELLATION RAID";
            }

            return "ILARUNE • ECLIPSE PATH";
        }

        private static RectTransform CreatePanel(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax)
        {
            var panelObject = CreateRectObject(name, parent);
            var rect = panelObject.GetComponent<RectTransform>();
            Anchor(rect, anchorMin, anchorMax);
            var image = panelObject.AddComponent<Image>();
            image.color = PanelColor;
            image.raycastTarget = false;
            return rect;
        }

        private static RectTransform CreateMeter(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax, Color color)
        {
            var meterObject = CreateRectObject(name, parent);
            var meterRect = meterObject.GetComponent<RectTransform>();
            Anchor(meterRect, anchorMin, anchorMax);
            var background = meterObject.AddComponent<Image>();
            background.color = new Color32(9, 11, 26, 230);
            background.raycastTarget = false;

            var fillObject = CreateRectObject("Fill", meterObject.transform);
            var fillRect = fillObject.GetComponent<RectTransform>();
            Stretch(fillRect);
            fillRect.pivot = new Vector2(0f, 0.5f);
            var fill = fillObject.AddComponent<Image>();
            fill.color = color;
            fill.raycastTarget = false;
            return fillRect;
        }

        private static Button CreateButton(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax, Color color)
        {
            var buttonObject = CreateRectObject(name, parent);
            Anchor(buttonObject.GetComponent<RectTransform>(), anchorMin, anchorMax);
            var image = buttonObject.AddComponent<Image>();
            image.color = color;
            var button = buttonObject.AddComponent<Button>();
            button.targetGraphic = image;
            return button;
        }

        private static TextMeshProUGUI CreateText(string name, Transform parent, Vector2 anchorMin, Vector2 anchorMax, int size, TextAnchor alignment, Color color)
        {
            var textObject = CreateRectObject(name, parent);
            Anchor(textObject.GetComponent<RectTransform>(), anchorMin, anchorMax);
            var text = textObject.AddComponent<TextMeshProUGUI>();
            text.font = ProceduralUi.DefaultFont;
            text.fontSize = size;
            text.alignment = ToTmpAlignment(alignment);
            text.color = color;
            text.enableWordWrapping = true;
            text.overflowMode = TextOverflowModes.Ellipsis;
            text.richText = true;
            text.raycastTarget = false;
            return text;
        }

        private static TextAlignmentOptions ToTmpAlignment(TextAnchor alignment)
        {
            switch (alignment)
            {
                case TextAnchor.UpperLeft:
                    return TextAlignmentOptions.TopLeft;
                case TextAnchor.UpperCenter:
                    return TextAlignmentOptions.Top;
                case TextAnchor.UpperRight:
                    return TextAlignmentOptions.TopRight;
                case TextAnchor.MiddleLeft:
                    return TextAlignmentOptions.Left;
                case TextAnchor.MiddleRight:
                    return TextAlignmentOptions.Right;
                case TextAnchor.LowerLeft:
                    return TextAlignmentOptions.BottomLeft;
                case TextAnchor.LowerCenter:
                    return TextAlignmentOptions.Bottom;
                case TextAnchor.LowerRight:
                    return TextAlignmentOptions.BottomRight;
                default:
                    return TextAlignmentOptions.Center;
            }
        }

        private static GameObject CreateRectObject(string name, Transform parent)
        {
            var gameObject = new GameObject(name, typeof(RectTransform));
            gameObject.transform.SetParent(parent, false);
            return gameObject;
        }

        private static void Anchor(RectTransform rect, Vector2 minimum, Vector2 maximum)
        {
            rect.anchorMin = minimum;
            rect.anchorMax = maximum;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void Stretch(RectTransform rect, float inset = 0f)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = new Vector2(inset, inset);
            rect.offsetMax = new Vector2(-inset, -inset);
        }

        private static void EnsureEventSystem()
        {
            if (EventSystem.current != null)
            {
                return;
            }

            var eventSystemObject = new GameObject("EventSystem", typeof(EventSystem), typeof(StandaloneInputModule));
            DontDestroyOnLoad(eventSystemObject);
        }
    }

    internal sealed class ProceduralBackdropGraphic : MaskableGraphic
    {
        public Color TopColor = Color.black;
        public Color BottomColor = Color.black;

        protected override void OnPopulateMesh(VertexHelper vertexHelper)
        {
            vertexHelper.Clear();
            var rect = rectTransform.rect;
            AddVertex(vertexHelper, new Vector2(rect.xMin, rect.yMin), BottomColor);
            AddVertex(vertexHelper, new Vector2(rect.xMin, rect.yMax), TopColor);
            AddVertex(vertexHelper, new Vector2(rect.xMax, rect.yMax), TopColor);
            AddVertex(vertexHelper, new Vector2(rect.xMax, rect.yMin), BottomColor);
            vertexHelper.AddTriangle(0, 1, 2);
            vertexHelper.AddTriangle(0, 2, 3);
        }

        private static void AddVertex(VertexHelper helper, Vector2 position, Color color)
        {
            var vertex = UIVertex.simpleVert;
            vertex.position = position;
            vertex.color = color;
            helper.AddVert(vertex);
        }
    }

    internal sealed class ProceduralSigilGraphic : MaskableGraphic
    {
        private const int Segments = 32;
        public Color InnerColor = Color.white;
        public Color OuterColor = Color.black;

        protected override void OnPopulateMesh(VertexHelper vertexHelper)
        {
            vertexHelper.Clear();
            var rect = rectTransform.rect;
            var center = rect.center;
            var radius = Mathf.Min(rect.width, rect.height) * 0.46f;
            var centerVertex = UIVertex.simpleVert;
            centerVertex.position = center;
            centerVertex.color = InnerColor;
            vertexHelper.AddVert(centerVertex);

            for (var index = 0; index <= Segments; index++)
            {
                var angle = index * Mathf.PI * 2f / Segments;
                var vertex = UIVertex.simpleVert;
                vertex.position = center + new Vector2(Mathf.Cos(angle), Mathf.Sin(angle)) * radius;
                vertex.color = OuterColor;
                vertexHelper.AddVert(vertex);
            }

            for (var index = 1; index <= Segments; index++)
            {
                vertexHelper.AddTriangle(0, index, index + 1);
            }
        }
    }
}
