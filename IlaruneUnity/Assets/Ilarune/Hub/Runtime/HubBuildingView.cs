using System.Collections.Generic;
using UnityEngine;

namespace Ilarune.Hub
{
    internal enum HubBuildingStyle
    {
        Observatory,
        Foundry,
        Conservatory,
        Atelier,
        Archive,
        Exchange,
        Dock,
        Workshop,
        Gate
    }

    internal readonly struct HubBuildingDefinition
    {
        public readonly string Id;
        public readonly string DisplayName;
        public readonly string Description;
        public readonly Vector2 Position;
        public readonly HubBuildingStyle Style;
        public readonly Color Accent;
        public readonly int Level;

        public HubBuildingDefinition(
            string id,
            string displayName,
            string description,
            Vector2 position,
            HubBuildingStyle style,
            Color accent,
            int level)
        {
            Id = id;
            DisplayName = displayName;
            Description = description;
            Position = position;
            Style = style;
            Accent = accent;
            Level = level;
        }
    }

    [DisallowMultipleComponent]
    public sealed class HubBuildingView : MonoBehaviour
    {
        private readonly List<SpriteRenderer> windows = new List<SpriteRenderer>();
        private Camera renderCamera;
        private HubQualityProfile quality;
        private SpriteRenderer crystal;
        private SpriteRenderer glow;
        private Color accent;
        private float nextTick;
        private bool focused;
        private int baseOrder;

        public string Id { get; private set; }
        public string DisplayName { get; private set; }
        public string Description { get; private set; }
        public int Level { get; private set; }
        public int VisualOrder => baseOrder;
        public Vector3 FocusWorldPosition => transform.position + new Vector3(0f, 0.15f, 0f);
        public Vector3 LabelWorldOffset => new Vector3(0f, -1.52f, 0f);
        public Vector3 EffectAnchor => transform.position + new Vector3(0f, 1.5f, 0f);

        internal static HubBuildingView Create(
            Transform parent,
            HubBuildingDefinition definition,
            Camera camera,
            HubQualityProfile profile)
        {
            GameObject gameObject = new GameObject("Building_" + definition.Id);
            gameObject.transform.SetParent(parent, false);
            gameObject.transform.localPosition = new Vector3(definition.Position.x, definition.Position.y, 0f);
            HubBuildingView building = gameObject.AddComponent<HubBuildingView>();
            building.Initialize(definition, camera, profile);
            return building;
        }

        public void SetFocused(bool isFocused)
        {
            focused = isFocused;
        }

        public void SetLevel(int level)
        {
            Level = Mathf.Max(1, level);
        }

        private void Initialize(HubBuildingDefinition definition, Camera camera, HubQualityProfile profile)
        {
            Id = definition.Id;
            DisplayName = definition.DisplayName;
            Description = definition.Description;
            Level = definition.Level;
            accent = definition.Accent;
            renderCamera = camera;
            quality = profile;
            baseOrder = 20 + Mathf.RoundToInt(-definition.Position.y * 10f);

            BuildPlatform();
            BuildArchitecture(definition.Style);
            BuildWindows(definition.Style);

            BoxCollider2D hitArea = gameObject.AddComponent<BoxCollider2D>();
            hitArea.size = new Vector2(3.2f, 2.9f);
            hitArea.offset = new Vector2(0f, 0.1f);
        }

        private void BuildPlatform()
        {
            ProceduralHubArt.CreateRenderer(
                transform, "DropShadow", HubShape.SoftCircle, new Color(0.05f, 0.04f, 0.11f, 0.44f),
                new Vector3(0f, -0.98f, 0f), new Vector2(4.2f, 1.28f), baseOrder - 4);
            ProceduralHubArt.CreateRenderer(
                transform, "IslandUnderside", HubShape.Triangle, ProceduralHubArt.IslandDark,
                new Vector3(0f, -1.16f, 0f), new Vector2(3.3f, 1.5f), baseOrder - 2);
            ProceduralHubArt.CreateRenderer(
                transform, "IslandRim", HubShape.Circle, ProceduralHubArt.IslandLight,
                new Vector3(0f, -0.63f, 0f), new Vector2(3.6f, 1.05f), baseOrder);
            ProceduralHubArt.CreateRenderer(
                transform, "IslandTop", HubShape.Circle, new Color32(72, 68, 99, 255),
                new Vector3(0f, -0.5f, 0f), new Vector2(3.2f, 0.82f), baseOrder + 1);

            glow = ProceduralHubArt.CreateRenderer(
                transform, "CrystalGlow", HubShape.SoftCircle, new Color(accent.r, accent.g, accent.b, 0.34f),
                new Vector3(0f, 0.45f, 0f), new Vector2(2.4f, 2.4f), baseOrder + 2);
        }

        private void BuildArchitecture(HubBuildingStyle style)
        {
            Color body = new Color32(62, 57, 84, 255);
            Color trim = new Color32(158, 144, 183, 255);
            switch (style)
            {
                case HubBuildingStyle.Observatory:
                    Part("Tower", HubShape.Capsule, body, new Vector2(0f, 0.16f), new Vector2(1.05f, 1.75f), 4);
                    Part("Dome", HubShape.Circle, trim, new Vector2(0f, 0.98f), new Vector2(1.58f, 0.92f), 6);
                    Part("Lens", HubShape.Circle, accent, new Vector2(0.25f, 1.02f), new Vector2(0.48f, 0.48f), 7);
                    Part("Antenna", HubShape.Square, trim, new Vector2(0f, 1.68f), new Vector2(0.08f, 0.8f), 5);
                    break;
                case HubBuildingStyle.Foundry:
                    Part("ForgeHall", HubShape.Square, body, new Vector2(0f, 0.05f), new Vector2(1.75f, 1.25f), 4);
                    Part("Roof", HubShape.Triangle, trim, new Vector2(0f, 0.82f), new Vector2(2.05f, 0.75f), 6);
                    Part("StackLeft", HubShape.Capsule, body, new Vector2(-0.62f, 1.12f), new Vector2(0.35f, 1.25f), 5);
                    Part("StackRight", HubShape.Capsule, body, new Vector2(0.62f, 1.08f), new Vector2(0.35f, 1.05f), 5);
                    break;
                case HubBuildingStyle.Conservatory:
                    Part("GardenBase", HubShape.Capsule, body, new Vector2(0f, 0f), new Vector2(2.05f, 1.15f), 4);
                    Part("GlassDome", HubShape.Circle, new Color(accent.r, accent.g, accent.b, 0.62f), new Vector2(0f, 0.72f), new Vector2(1.72f, 1.38f), 6);
                    Part("Canopy", HubShape.Circle, trim, new Vector2(-0.52f, 0.72f), new Vector2(0.55f, 0.55f), 7);
                    Part("Canopy2", HubShape.Circle, trim, new Vector2(0.55f, 0.66f), new Vector2(0.62f, 0.62f), 7);
                    break;
                case HubBuildingStyle.Atelier:
                    Part("Studio", HubShape.Capsule, body, new Vector2(0f, 0.15f), new Vector2(1.62f, 1.55f), 4);
                    Part("Dish", HubShape.Circle, trim, new Vector2(0.15f, 1.08f), new Vector2(1.4f, 0.34f), 6);
                    Part("Signal", HubShape.Diamond, accent, new Vector2(0.15f, 1.48f), new Vector2(0.42f, 0.65f), 7);
                    break;
                case HubBuildingStyle.Archive:
                    Part("Archive", HubShape.Square, body, new Vector2(0f, 0.12f), new Vector2(1.92f, 1.45f), 4);
                    Part("Roof", HubShape.Triangle, trim, new Vector2(0f, 1.05f), new Vector2(2.25f, 0.72f), 6);
                    Part("Seal", HubShape.Diamond, accent, new Vector2(0f, 0.32f), new Vector2(0.52f, 0.72f), 7);
                    break;
                case HubBuildingStyle.Exchange:
                    Part("Hall", HubShape.Capsule, body, new Vector2(0f, 0.12f), new Vector2(2.12f, 1.25f), 4);
                    Part("Ring", HubShape.Circle, trim, new Vector2(0f, 0.68f), new Vector2(1.35f, 1.35f), 6);
                    Part("Core", HubShape.Circle, accent, new Vector2(0f, 0.68f), new Vector2(0.68f, 0.68f), 7);
                    break;
                case HubBuildingStyle.Dock:
                    Part("DockHouse", HubShape.Square, body, new Vector2(-0.25f, 0.05f), new Vector2(1.35f, 1.25f), 4);
                    Part("Mast", HubShape.Square, trim, new Vector2(0.46f, 0.78f), new Vector2(0.1f, 1.8f), 5);
                    Part("Sail", HubShape.Triangle, accent, new Vector2(0.78f, 1.02f), new Vector2(0.82f, 1.08f), 6);
                    break;
                case HubBuildingStyle.Workshop:
                    Part("Workshop", HubShape.Capsule, body, new Vector2(0f, 0.08f), new Vector2(2.05f, 1.3f), 4);
                    Part("Roof", HubShape.Triangle, trim, new Vector2(0f, 0.92f), new Vector2(2.25f, 0.72f), 6);
                    Part("Gear", HubShape.Circle, accent, new Vector2(0.45f, 0.2f), new Vector2(0.65f, 0.65f), 7);
                    break;
                default:
                    Part("GateLeft", HubShape.Capsule, body, new Vector2(-0.62f, 0.38f), new Vector2(0.65f, 2.15f), 4);
                    Part("GateRight", HubShape.Capsule, body, new Vector2(0.62f, 0.38f), new Vector2(0.65f, 2.15f), 4);
                    Part("GateTop", HubShape.Capsule, trim, new Vector2(0f, 1.18f), new Vector2(1.75f, 0.45f), 6);
                    Part("Portal", HubShape.Capsule, new Color(accent.r, accent.g, accent.b, 0.76f), new Vector2(0f, 0.28f), new Vector2(0.72f, 1.48f), 5);
                    break;
            }

            crystal = Part("PulseCrystal", HubShape.Diamond, accent, new Vector2(0f, 1.62f), new Vector2(0.36f, 0.62f), 9);
        }

        private void BuildWindows(HubBuildingStyle style)
        {
            int count = style == HubBuildingStyle.Gate ? 2 : 4;
            for (int i = 0; i < count; i++)
            {
                float x = (i - ((count - 1) * 0.5f)) * 0.36f;
                SpriteRenderer window = Part(
                    "Window_" + i,
                    HubShape.Capsule,
                    new Color32(255, 214, 131, 255),
                    new Vector2(x, 0.18f + ((i & 1) * 0.24f)),
                    new Vector2(0.16f, 0.3f),
                    8);
                windows.Add(window);
            }
        }

        private SpriteRenderer Part(
            string name,
            HubShape shape,
            Color color,
            Vector2 position,
            Vector2 scale,
            int orderOffset)
        {
            return ProceduralHubArt.CreateRenderer(
                transform, name, shape, color, new Vector3(position.x, position.y, 0f), scale, baseOrder + orderOffset);
        }

        private void Update()
        {
            bool visible = HubQuality.IsVisible(renderCamera, transform.position, 0.18f);
            float now = Time.unscaledTime;
            if (!visible && now < nextTick)
            {
                return;
            }

            nextTick = now + (visible ? 0f : quality.OffscreenTickInterval);
            float targetScale = focused ? 1.085f : 1f;
            transform.localScale = Vector3.Lerp(
                transform.localScale,
                new Vector3(targetScale, targetScale, 1f),
                1f - Mathf.Exp(-8f * Time.unscaledDeltaTime));

            float pulse = 1f + (Mathf.Sin((now * 2.4f) + transform.position.x) * 0.12f);
            if (crystal != null)
            {
                crystal.transform.localScale = new Vector3(0.36f * pulse, 0.62f * pulse, 1f);
            }

            if (glow != null)
            {
                Color glowColor = glow.color;
                glowColor.a = (focused ? 0.56f : 0.28f) + (Mathf.Sin(now * 1.8f) * 0.06f);
                glow.color = glowColor;
            }

            for (int i = 0; i < windows.Count; i++)
            {
                float flicker = Mathf.PerlinNoise(i * 3.71f, now * 0.42f);
                Color color = windows[i].color;
                color.a = Mathf.Lerp(0.48f, 1f, flicker);
                windows[i].color = color;
            }
        }
    }
}
