using System.Collections.Generic;
using UnityEngine;

namespace Ilarune.Hub
{
    internal enum HubShape
    {
        Square,
        Circle,
        Capsule,
        Diamond,
        SoftCircle,
        Triangle
    }

    /// <summary>Runtime-only sprite source. No image, font, or shader asset is imported.</summary>
    internal static class ProceduralHubArt
    {
        private const int TextureSize = 64;
        private static readonly Dictionary<HubShape, Sprite> Sprites = new Dictionary<HubShape, Sprite>();
        private static Sprite skyGradient;

        public static readonly Color DeepSky = new Color32(31, 29, 66, 255);
        public static readonly Color Twilight = new Color32(91, 72, 137, 255);
        public static readonly Color Mist = new Color32(192, 187, 228, 255);
        public static readonly Color IslandDark = new Color32(48, 45, 67, 255);
        public static readonly Color IslandLight = new Color32(116, 105, 143, 255);
        public static readonly Color Aqua = new Color32(91, 230, 212, 255);
        public static readonly Color Orchid = new Color32(194, 116, 255, 255);
        public static readonly Color Ember = new Color32(255, 170, 91, 255);

        public static Sprite Get(HubShape shape)
        {
            if (Sprites.TryGetValue(shape, out Sprite sprite) && sprite != null)
            {
                return sprite;
            }

            Texture2D texture = new Texture2D(TextureSize, TextureSize, TextureFormat.RGBA32, false, true)
            {
                name = "HubRuntime_" + shape,
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp,
                hideFlags = HideFlags.HideAndDontSave
            };

            Color32[] pixels = new Color32[TextureSize * TextureSize];
            float center = (TextureSize - 1) * 0.5f;
            for (int y = 0; y < TextureSize; y++)
            {
                for (int x = 0; x < TextureSize; x++)
                {
                    float nx = (x - center) / center;
                    float ny = (y - center) / center;
                    float distance = Mathf.Sqrt((nx * nx) + (ny * ny));
                    float alpha = ShapeAlpha(shape, nx, ny, distance);
                    pixels[(y * TextureSize) + x] = new Color32(255, 255, 255, (byte)Mathf.RoundToInt(alpha * 255f));
                }
            }

            texture.SetPixels32(pixels);
            texture.Apply(false, true);
            sprite = Sprite.Create(
                texture,
                new Rect(0f, 0f, TextureSize, TextureSize),
                new Vector2(0.5f, 0.5f),
                TextureSize,
                0u,
                SpriteMeshType.FullRect);
            sprite.name = texture.name + "Sprite";
            sprite.hideFlags = HideFlags.HideAndDontSave;
            Sprites[shape] = sprite;
            return sprite;
        }

        public static Sprite SkyGradient
        {
            get
            {
                if (skyGradient == null)
                {
                    const int width = 8;
                    const int height = 256;
                    Texture2D texture = new Texture2D(width, height, TextureFormat.RGBA32, false, true)
                    {
                        name = "HubRuntime_SkyGradient",
                        filterMode = FilterMode.Bilinear,
                        wrapMode = TextureWrapMode.Clamp,
                        hideFlags = HideFlags.HideAndDontSave
                    };

                    for (int y = 0; y < height; y++)
                    {
                        float t = y / (height - 1f);
                        Color color;
                        if (t < 0.55f)
                        {
                            color = Color.Lerp(DeepSky, Twilight, t / 0.55f);
                        }
                        else
                        {
                            color = Color.Lerp(Twilight, new Color32(244, 179, 185, 255), (t - 0.55f) / 0.45f);
                        }

                        for (int x = 0; x < width; x++)
                        {
                            texture.SetPixel(x, y, color);
                        }
                    }

                    texture.Apply(false, true);
                    skyGradient = Sprite.Create(
                        texture, new Rect(0f, 0f, width, height), new Vector2(0.5f, 0.5f), 16f, 0u, SpriteMeshType.FullRect);
                    skyGradient.name = "HubRuntime_SkyGradientSprite";
                    skyGradient.hideFlags = HideFlags.HideAndDontSave;
                }

                return skyGradient;
            }
        }

        public static SpriteRenderer CreateRenderer(
            Transform parent,
            string name,
            HubShape shape,
            Color color,
            Vector3 localPosition,
            Vector2 localScale,
            int sortingOrder)
        {
            GameObject gameObject = new GameObject(name, typeof(SpriteRenderer));
            Transform child = gameObject.transform;
            child.SetParent(parent, false);
            child.localPosition = localPosition;
            child.localScale = new Vector3(localScale.x, localScale.y, 1f);
            SpriteRenderer renderer = gameObject.GetComponent<SpriteRenderer>();
            renderer.sprite = Get(shape);
            renderer.color = color;
            renderer.sortingOrder = sortingOrder;
            return renderer;
        }

        private static float ShapeAlpha(HubShape shape, float x, float y, float radialDistance)
        {
            switch (shape)
            {
                case HubShape.Circle:
                    return radialDistance <= 0.96f ? 1f : 0f;
                case HubShape.SoftCircle:
                    return Mathf.Clamp01(1f - Mathf.InverseLerp(0.12f, 1f, radialDistance));
                case HubShape.Capsule:
                {
                    float clampedX = Mathf.Clamp(x, -0.48f, 0.48f);
                    float dx = x - clampedX;
                    return ((dx * dx) + (y * y)) <= 0.92f ? 1f : 0f;
                }
                case HubShape.Diamond:
                    return Mathf.Abs(x) + Mathf.Abs(y) <= 0.96f ? 1f : 0f;
                case HubShape.Triangle:
                    return y >= -0.9f && y <= 0.9f && Mathf.Abs(x) <= (0.9f - y) * 0.55f ? 1f : 0f;
                default:
                    return Mathf.Abs(x) <= 0.96f && Mathf.Abs(y) <= 0.96f ? 1f : 0f;
            }
        }
    }
}
