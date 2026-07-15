using System;
using TMPro;
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.UI;

namespace Ilarune.UI
{
    /// <summary>
    /// Small UGUI factory used by runtime-only screens. All shapes are generated from a
    /// single white rounded sprite and tinted, so the UI does not require licensed art.
    /// </summary>
    public static class ProceduralUi
    {
        private static TMP_FontAsset defaultFont;
        private static bool fontResolutionAttempted;
        private static Sprite roundedSprite;
        private static Sprite circleSprite;

        public static readonly Color Ink = new Color32(27, 24, 43, 255);
        public static readonly Color Paper = new Color32(246, 243, 255, 255);
        public static readonly Color Orchid = new Color32(184, 110, 255, 255);
        public static readonly Color Aqua = new Color32(92, 227, 211, 255);
        public static readonly Color Panel = new Color32(32, 29, 55, 226);

        public static TMP_FontAsset DefaultFont
        {
            get
            {
                if (defaultFont != null || fontResolutionAttempted)
                {
                    return defaultFont;
                }

                fontResolutionAttempted = true;

                // The bundled OFL Noto Sans KR face makes Korean/English coverage deterministic
                // on Android. System and Unity runtime faces remain defensive fallbacks.
                try
                {
                    Font source = Resources.Load<Font>("Fonts/NotoSansKR-Variable");
                    defaultFont = source == null ? null : TMP_FontAsset.CreateFontAsset(source);
                }
                catch (Exception)
                {
                    defaultFont = null;
                }

                if (defaultFont == null)
                {
                    try
                    {
                        Font source = Font.CreateDynamicFontFromOSFont(
                            new[] { "Noto Sans CJK KR", "Noto Sans KR", "Roboto", "Helvetica", "Arial" }, 36);
                        defaultFont = source == null ? null : TMP_FontAsset.CreateFontAsset(source);
                    }
                    catch (Exception)
                    {
                        defaultFont = null;
                    }
                }

                if (defaultFont == null)
                {
                    try
                    {
                        Font source = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                        defaultFont = source == null ? null : TMP_FontAsset.CreateFontAsset(source);
                    }
                    catch (Exception)
                    {
                        // A null font leaves labels non-rendering but avoids a boot failure on
                        // aggressively stripped players. Production builds should retain either
                        // Unity's legacy runtime font or one of the system faces above.
                        defaultFont = null;
                    }
                }

                return defaultFont;
            }
        }

        public static Sprite RoundedSprite
        {
            get
            {
                if (roundedSprite == null)
                {
                    roundedSprite = CreateShapeSprite(64, 18, false);
                }

                return roundedSprite;
            }
        }

        public static Sprite CircleSprite
        {
            get
            {
                if (circleSprite == null)
                {
                    circleSprite = CreateShapeSprite(64, 32, true);
                }

                return circleSprite;
            }
        }

        public static RectTransform CreateRect(
            Transform parent,
            string name,
            Color color,
            Vector2 anchorMin,
            Vector2 anchorMax,
            Vector2 anchoredPosition,
            Vector2 sizeDelta,
            bool rounded = true)
        {
            GameObject gameObject = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(Image));
            RectTransform rect = gameObject.GetComponent<RectTransform>();
            rect.SetParent(parent, false);
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = sizeDelta;

            Image image = gameObject.GetComponent<Image>();
            image.color = color;
            image.sprite = rounded ? RoundedSprite : null;
            image.type = rounded ? Image.Type.Sliced : Image.Type.Simple;
            image.raycastTarget = false;
            return rect;
        }

        public static TextMeshProUGUI CreateText(
            Transform parent,
            string name,
            string value,
            int fontSize,
            Color color,
            TextAnchor alignment,
            Vector2 anchorMin,
            Vector2 anchorMax,
            Vector2 anchoredPosition,
            Vector2 sizeDelta,
            FontStyle style = FontStyle.Normal)
        {
            GameObject gameObject = new GameObject(name, typeof(RectTransform), typeof(CanvasRenderer), typeof(TextMeshProUGUI));
            RectTransform rect = gameObject.GetComponent<RectTransform>();
            rect.SetParent(parent, false);
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = sizeDelta;

            TextMeshProUGUI text = gameObject.GetComponent<TextMeshProUGUI>();
            text.text = value;
            TMP_FontAsset resolvedFont = DefaultFont;
            if (resolvedFont != null)
            {
                text.font = resolvedFont;
            }
            text.fontSize = Mathf.Max(36, fontSize);
            text.color = color;
            text.alignment = ToTmpAlignment(alignment);
            text.fontStyle = style == FontStyle.Bold
                ? FontStyles.Bold
                : style == FontStyle.Italic
                    ? FontStyles.Italic
                    : style == FontStyle.BoldAndItalic
                        ? FontStyles.Bold | FontStyles.Italic
                        : FontStyles.Normal;
            text.enableWordWrapping = true;
            text.overflowMode = TextOverflowModes.Ellipsis;
            text.raycastTarget = false;
            return text;
        }

        public static Button CreateButton(
            Transform parent,
            string name,
            string label,
            Color background,
            Color foreground,
            int fontSize,
            Vector2 anchorMin,
            Vector2 anchorMax,
            Vector2 anchoredPosition,
            Vector2 sizeDelta,
            UnityAction onClick)
        {
            RectTransform rect = CreateRect(
                parent, name, background, anchorMin, anchorMax, anchoredPosition, sizeDelta, true);
            Image image = rect.GetComponent<Image>();
            image.raycastTarget = true;

            Button button = rect.gameObject.AddComponent<Button>();
            ColorBlock colors = button.colors;
            colors.normalColor = Color.white;
            colors.highlightedColor = new Color(1f, 1f, 1f, 0.88f);
            colors.pressedColor = new Color(0.76f, 0.76f, 0.86f, 1f);
            colors.selectedColor = colors.highlightedColor;
            colors.fadeDuration = 0.08f;
            button.colors = colors;
            button.targetGraphic = image;
            if (onClick != null)
            {
                button.onClick.AddListener(onClick);
            }

            CreateText(
                rect, "Label", label, fontSize, foreground, TextAnchor.MiddleCenter,
                Vector2.zero, Vector2.one, Vector2.zero, new Vector2(-18f, -12f), FontStyle.Bold);
            return button;
        }

        private static TextAlignmentOptions ToTmpAlignment(TextAnchor alignment)
        {
            switch (alignment)
            {
                case TextAnchor.UpperLeft: return TextAlignmentOptions.TopLeft;
                case TextAnchor.UpperCenter: return TextAlignmentOptions.Top;
                case TextAnchor.UpperRight: return TextAlignmentOptions.TopRight;
                case TextAnchor.MiddleLeft: return TextAlignmentOptions.Left;
                case TextAnchor.MiddleRight: return TextAlignmentOptions.Right;
                case TextAnchor.LowerLeft: return TextAlignmentOptions.BottomLeft;
                case TextAnchor.LowerCenter: return TextAlignmentOptions.Bottom;
                case TextAnchor.LowerRight: return TextAlignmentOptions.BottomRight;
                default: return TextAlignmentOptions.Center;
            }
        }

        private static Sprite CreateShapeSprite(int size, int radius, bool ellipse)
        {
            Texture2D texture = new Texture2D(size, size, TextureFormat.RGBA32, false, true)
            {
                name = ellipse ? "RuntimeCircle" : "RuntimeRoundedRect",
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp,
                hideFlags = HideFlags.HideAndDontSave
            };

            Color32 clear = new Color32(255, 255, 255, 0);
            Color32 white = new Color32(255, 255, 255, 255);
            float center = (size - 1) * 0.5f;
            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    bool inside;
                    if (ellipse)
                    {
                        float dx = (x - center) / center;
                        float dy = (y - center) / center;
                        inside = (dx * dx) + (dy * dy) <= 1f;
                    }
                    else
                    {
                        float nearestX = Mathf.Clamp(x, radius, size - 1 - radius);
                        float nearestY = Mathf.Clamp(y, radius, size - 1 - radius);
                        float dx = x - nearestX;
                        float dy = y - nearestY;
                        inside = (dx * dx) + (dy * dy) <= radius * radius;
                    }

                    texture.SetPixel(x, y, inside ? white : clear);
                }
            }

            texture.Apply(false, true);
            Vector4 border = ellipse ? Vector4.zero : new Vector4(radius, radius, radius, radius);
            Sprite sprite = Sprite.Create(
                texture,
                new Rect(0f, 0f, size, size),
                new Vector2(0.5f, 0.5f),
                100f,
                0u,
                SpriteMeshType.FullRect,
                border);
            sprite.name = texture.name + "Sprite";
            sprite.hideFlags = HideFlags.HideAndDontSave;
            return sprite;
        }
    }
}
