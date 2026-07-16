using System;
using System.Collections.Generic;
using UnityEngine;

namespace Ilarune.Hub
{
    /// <summary>
    /// Creates the hub's layered atmosphere: three parallax cloud bands, airships,
    /// flags, steam puffs, and moving energy motes. Every visual uses runtime sprites.
    /// </summary>
    [DisallowMultipleComponent]
    public sealed class HubAmbientDirector : MonoBehaviour
    {
        private bool configured;

        public void Configure(
            Camera worldCamera,
            HubQualityProfile quality,
            IReadOnlyList<HubBuildingView> buildings)
        {
            if (configured)
            {
                return;
            }

            configured = true;
            CreateSky(quality);
            CreateCloudLayers(worldCamera, quality);
            CreateAirships(worldCamera, quality);
            CreateFlags(buildings);
            CreateSteam(worldCamera, quality, buildings);
            CreateEnergyFlow(worldCamera, quality, buildings);
        }

        private void CreateSky(HubQualityProfile quality)
        {
            GameObject skyObject = new GameObject("ProceduralTwilightSky", typeof(SpriteRenderer));
            skyObject.transform.SetParent(transform, false);
            skyObject.transform.localPosition = Vector3.zero;
            skyObject.transform.localScale = new Vector3(34f, 1.82f, 1f);
            SpriteRenderer sky = skyObject.GetComponent<SpriteRenderer>();
            sky.sprite = ProceduralHubArt.SkyGradient;
            sky.sortingOrder = -1000;

            int starCount = quality.Tier == HubQualityTier.Low ? 18 : quality.Tier == HubQualityTier.High ? 38 : 26;
            System.Random random = new System.Random(7103);
            for (int i = 0; i < starCount; i++)
            {
                float x = Mathf.Lerp(-7.2f, 7.2f, (float)random.NextDouble());
                float y = Mathf.Lerp(-11.8f, 11.8f, (float)random.NextDouble());
                float size = Mathf.Lerp(0.025f, 0.085f, (float)random.NextDouble());
                Color color = i % 5 == 0
                    ? new Color(0.67f, 0.98f, 0.93f, 0.72f)
                    : new Color(1f, 0.91f, 0.82f, 0.48f);
                ProceduralHubArt.CreateRenderer(
                    skyObject.transform, "Star_" + i, HubShape.Circle, color,
                    new Vector3(x / 34f, y / 1.82f, 0f), new Vector2(size / 34f, size / 1.82f), -990);
            }
        }

        private void CreateCloudLayers(Camera worldCamera, HubQualityProfile quality)
        {
            float[] follow = { 0.08f, 0.17f, 0.28f };
            float[] speeds = { 0.045f, -0.075f, 0.12f };
            int[] orders = { -850, -620, -220 };
            Color[] colors =
            {
                new Color(0.72f, 0.72f, 0.88f, 0.16f),
                new Color(0.87f, 0.80f, 0.94f, 0.22f),
                new Color(0.95f, 0.88f, 0.92f, 0.28f)
            };

            System.Random random = new System.Random(4421);
            for (int layerIndex = 0; layerIndex < 3; layerIndex++)
            {
                GameObject layerObject = new GameObject("CloudLayer_" + (layerIndex + 1));
                layerObject.transform.SetParent(transform, false);
                List<Transform> clouds = new List<Transform>(quality.CloudCountPerLayer);
                for (int i = 0; i < quality.CloudCountPerLayer; i++)
                {
                    float x = Mathf.Lerp(-7.5f, 7.5f, (float)random.NextDouble());
                    float y = Mathf.Lerp(-11.5f, 11.5f, (float)random.NextDouble());
                    float width = Mathf.Lerp(1.4f, 3.8f, (float)random.NextDouble());
                    float height = width * Mathf.Lerp(0.25f, 0.42f, (float)random.NextDouble());
                    SpriteRenderer cloud = ProceduralHubArt.CreateRenderer(
                        layerObject.transform,
                        "Cloud_" + i,
                        HubShape.SoftCircle,
                        colors[layerIndex],
                        new Vector3(x, y, 0f),
                        new Vector2(width, height),
                        orders[layerIndex]);
                    clouds.Add(cloud.transform);
                }

                HubParallaxCloudLayer layer = layerObject.AddComponent<HubParallaxCloudLayer>();
                layer.Configure(worldCamera, clouds, follow[layerIndex], speeds[layerIndex]);
            }
        }

        private void CreateAirships(Camera worldCamera, HubQualityProfile quality)
        {
            for (int i = 0; i < quality.AirshipCount; i++)
            {
                GameObject airshipObject = new GameObject("Airship_" + (i + 1));
                airshipObject.transform.SetParent(transform, false);
                HubAirshipDrifter airship = airshipObject.AddComponent<HubAirshipDrifter>();
                airship.Configure(i, quality.AirshipCount, worldCamera, quality.OffscreenTickInterval);
            }
        }

        private void CreateFlags(IReadOnlyList<HubBuildingView> buildings)
        {
            for (int i = 0; i < buildings.Count; i += 2)
            {
                GameObject flagObject = new GameObject("Flag_" + buildings[i].Id);
                flagObject.transform.SetParent(buildings[i].transform, false);
                flagObject.transform.localPosition = new Vector3(0.72f, 1.38f, 0f);
                HubFlagWaver flag = flagObject.AddComponent<HubFlagWaver>();
                flag.Configure(i, 132 + i);
            }
        }

        private void CreateSteam(
            Camera worldCamera,
            HubQualityProfile quality,
            IReadOnlyList<HubBuildingView> buildings)
        {
            if (buildings.Count == 0)
            {
                return;
            }

            for (int i = 0; i < quality.SteamCount; i++)
            {
                HubBuildingView source = buildings[(i * 3 + 1) % buildings.Count];
                GameObject puffObject = new GameObject("SteamPuff_" + (i + 1));
                puffObject.transform.SetParent(transform, false);
                HubSteamPuff puff = puffObject.AddComponent<HubSteamPuff>();
                puff.Configure(
                    source.transform,
                    new Vector3(((i & 1) == 0 ? -0.56f : 0.56f), 1.26f, 0f),
                    i / (float)quality.SteamCount,
                    worldCamera,
                    quality.OffscreenTickInterval,
                    145 + i);
            }
        }

        private void CreateEnergyFlow(
            Camera worldCamera,
            HubQualityProfile quality,
            IReadOnlyList<HubBuildingView> buildings)
        {
            if (buildings.Count < 2)
            {
                return;
            }

            for (int i = 0; i < quality.EnergyOrbCount; i++)
            {
                HubBuildingView start = buildings[i % buildings.Count];
                HubBuildingView end = buildings[(i + 2 + (i % 3)) % buildings.Count];
                GameObject orbObject = new GameObject("EnergyFlow_" + (i + 1));
                orbObject.transform.SetParent(transform, false);
                HubEnergyOrb orb = orbObject.AddComponent<HubEnergyOrb>();
                orb.Configure(
                    start.transform,
                    end.transform,
                    i / (float)quality.EnergyOrbCount,
                    worldCamera,
                    quality.OffscreenTickInterval,
                    152 + i);
            }
        }
    }

    internal sealed class HubParallaxCloudLayer : MonoBehaviour
    {
        private Camera worldCamera;
        private List<Transform> clouds;
        private float followFactor;
        private float driftSpeed;

        public void Configure(Camera camera, List<Transform> cloudTransforms, float follow, float speed)
        {
            worldCamera = camera;
            clouds = cloudTransforms;
            followFactor = follow;
            driftSpeed = speed;
        }

        private void Update()
        {
            if (worldCamera == null || clouds == null)
            {
                return;
            }

            Vector3 cameraPosition = worldCamera.transform.position;
            transform.position = new Vector3(cameraPosition.x * followFactor, cameraPosition.y * followFactor, 0f);
            float delta = driftSpeed * Time.unscaledDeltaTime;
            for (int i = 0; i < clouds.Count; i++)
            {
                Vector3 position = clouds[i].localPosition;
                position.x += delta;
                if (position.x > 8.5f)
                {
                    position.x = -8.5f;
                }
                else if (position.x < -8.5f)
                {
                    position.x = 8.5f;
                }

                clouds[i].localPosition = position;
            }
        }
    }

    internal sealed class HubAirshipDrifter : MonoBehaviour
    {
        private Camera worldCamera;
        private float speed;
        private float phase;
        private float baseY;
        private float offscreenInterval;
        private float nextTick;
        private float lastTick;

        public void Configure(int index, int count, Camera camera, float interval)
        {
            worldCamera = camera;
            offscreenInterval = interval;
            speed = 0.14f + (index * 0.035f);
            phase = index * 1.91f;
            float normalized = (index + 0.5f) / Mathf.Max(1, count);
            baseY = Mathf.Lerp(-7.5f, 8.5f, normalized);
            transform.localPosition = new Vector3(Mathf.Lerp(-6.5f, 5.5f, normalized), baseY, 0f);

            int order = -130 + index;
            ProceduralHubArt.CreateRenderer(
                transform, "Envelope", HubShape.Capsule, new Color32(181, 154, 204, 235),
                new Vector3(0f, 0.28f, 0f), new Vector2(1.38f, 0.62f), order);
            ProceduralHubArt.CreateRenderer(
                transform, "EnvelopeStripe", HubShape.Capsule, new Color32(101, 225, 211, 220),
                new Vector3(0f, 0.28f, 0f), new Vector2(0.82f, 0.18f), order + 1);
            ProceduralHubArt.CreateRenderer(
                transform, "Cabin", HubShape.Capsule, new Color32(56, 51, 78, 255),
                new Vector3(0f, -0.2f, 0f), new Vector2(0.72f, 0.3f), order + 2);
            ProceduralHubArt.CreateRenderer(
                transform, "Tail", HubShape.Triangle, new Color32(196, 118, 255, 240),
                new Vector3(-0.82f, 0.2f, 0f), new Vector2(0.42f, 0.48f), order + 1);
            lastTick = Time.unscaledTime;
        }

        private void Update()
        {
            float now = Time.unscaledTime;
            bool visible = HubQuality.IsVisible(worldCamera, transform.position, 0.3f);
            if (!visible && now < nextTick)
            {
                return;
            }

            nextTick = now + (visible ? 0f : offscreenInterval);
            float deltaTime = Mathf.Clamp(now - lastTick, 0f, 0.45f);
            lastTick = now;
            Vector3 position = transform.localPosition;
            position.x += speed * deltaTime;
            if (position.x > 7.4f)
            {
                position.x = -7.4f;
            }

            position.y = baseY + (Mathf.Sin((now * 0.55f) + phase) * 0.16f);
            transform.localPosition = position;
        }
    }

    internal sealed class HubFlagWaver : MonoBehaviour
    {
        private Transform cloth;
        private float phase;

        public void Configure(int index, int sortingOrder)
        {
            phase = index * 0.83f;
            ProceduralHubArt.CreateRenderer(
                transform, "Pole", HubShape.Square, new Color32(169, 156, 186, 255),
                new Vector3(0f, 0f, 0f), new Vector2(0.055f, 0.95f), sortingOrder);
            SpriteRenderer flag = ProceduralHubArt.CreateRenderer(
                transform, "Cloth", HubShape.Square,
                index % 4 == 0 ? ProceduralHubArt.Aqua : ProceduralHubArt.Orchid,
                new Vector3(0.3f, 0.3f, 0f), new Vector2(0.58f, 0.3f), sortingOrder + 1);
            cloth = flag.transform;
        }

        private void Update()
        {
            if (cloth == null)
            {
                return;
            }

            float wave = Mathf.Sin((Time.unscaledTime * 2.3f) + phase);
            cloth.localRotation = Quaternion.Euler(0f, wave * 8f, wave * 5f);
            Vector3 scale = cloth.localScale;
            scale.x = 0.58f * (0.9f + (Mathf.Abs(wave) * 0.1f));
            cloth.localScale = scale;
        }
    }

    internal sealed class HubSteamPuff : MonoBehaviour
    {
        private Transform source;
        private Vector3 offset;
        private Camera worldCamera;
        private SpriteRenderer spriteRenderer;
        private float phase;
        private float offscreenInterval;
        private float nextTick;

        public void Configure(
            Transform origin,
            Vector3 localOffset,
            float startPhase,
            Camera camera,
            float interval,
            int sortingOrder)
        {
            source = origin;
            offset = localOffset;
            phase = startPhase;
            worldCamera = camera;
            offscreenInterval = interval;
            spriteRenderer = ProceduralHubArt.CreateRenderer(
                transform, "Puff", HubShape.SoftCircle, new Color(0.92f, 0.87f, 0.97f, 0.36f),
                Vector3.zero, new Vector2(0.48f, 0.48f), sortingOrder);
        }

        private void Update()
        {
            if (source == null)
            {
                return;
            }

            float now = Time.unscaledTime;
            bool visible = HubQuality.IsVisible(worldCamera, source.position, 0.22f);
            if (!visible && now < nextTick)
            {
                return;
            }

            nextTick = now + (visible ? 0f : offscreenInterval);
            float cycle = Mathf.Repeat((now * 0.23f) + phase, 1f);
            Vector3 basePosition = source.TransformPoint(offset);
            transform.position = basePosition + new Vector3(Mathf.Sin((cycle + phase) * 5.4f) * 0.14f, cycle * 1.45f, 0f);
            float scale = Mathf.Lerp(0.18f, 0.92f, cycle);
            spriteRenderer.transform.localScale = new Vector3(scale, scale, 1f);
            Color color = spriteRenderer.color;
            color.a = Mathf.Sin(cycle * Mathf.PI) * 0.34f;
            spriteRenderer.color = color;
        }
    }

    internal sealed class HubEnergyOrb : MonoBehaviour
    {
        private Transform start;
        private Transform end;
        private Camera worldCamera;
        private SpriteRenderer spriteRenderer;
        private float phase;
        private float offscreenInterval;
        private float nextTick;

        public void Configure(
            Transform from,
            Transform to,
            float startPhase,
            Camera camera,
            float interval,
            int sortingOrder)
        {
            start = from;
            end = to;
            phase = startPhase;
            worldCamera = camera;
            offscreenInterval = interval;
            spriteRenderer = ProceduralHubArt.CreateRenderer(
                transform, "Orb", HubShape.SoftCircle, new Color(0.38f, 1f, 0.88f, 0.8f),
                Vector3.zero, new Vector2(0.34f, 0.34f), sortingOrder);
            ProceduralHubArt.CreateRenderer(
                transform, "Core", HubShape.Circle, Color.white,
                Vector3.zero, new Vector2(0.08f, 0.08f), sortingOrder + 1);
        }

        private void Update()
        {
            if (start == null || end == null)
            {
                return;
            }

            float now = Time.unscaledTime;
            Vector3 midpoint = (start.position + end.position) * 0.5f;
            bool visible = HubQuality.IsVisible(worldCamera, midpoint, 0.35f);
            if (!visible && now < nextTick)
            {
                return;
            }

            nextTick = now + (visible ? 0f : offscreenInterval);
            float t = Mathf.Repeat((now * 0.085f) + phase, 1f);
            Vector3 from = start.position + new Vector3(0f, -0.45f, 0f);
            Vector3 to = end.position + new Vector3(0f, -0.45f, 0f);
            Vector3 position = Vector3.Lerp(from, to, t);
            position.y += Mathf.Sin(t * Mathf.PI) * (0.45f + (Mathf.Abs(to.x - from.x) * 0.06f));
            transform.position = position;
            float pulse = 0.78f + (Mathf.Sin((now * 5f) + phase) * 0.18f);
            spriteRenderer.transform.localScale = new Vector3(0.34f * pulse, 0.34f * pulse, 1f);
        }
    }
}
