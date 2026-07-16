using UnityEngine;

namespace Ilarune.Hub
{
    public enum HubQualityTier
    {
        Auto,
        Low,
        Medium,
        High
    }

    public readonly struct HubQualityProfile
    {
        public readonly HubQualityTier Tier;
        public readonly int CloudCountPerLayer;
        public readonly int AirshipCount;
        public readonly int NpcCount;
        public readonly int SteamCount;
        public readonly int EnergyOrbCount;
        public readonly float OffscreenTickInterval;

        public HubQualityProfile(
            HubQualityTier tier,
            int cloudCountPerLayer,
            int airshipCount,
            int npcCount,
            int steamCount,
            int energyOrbCount,
            float offscreenTickInterval)
        {
            Tier = tier;
            CloudCountPerLayer = cloudCountPerLayer;
            AirshipCount = airshipCount;
            NpcCount = npcCount;
            SteamCount = steamCount;
            EnergyOrbCount = energyOrbCount;
            OffscreenTickInterval = offscreenTickInterval;
        }
    }

    public static class HubQuality
    {
        public static HubQualityProfile Resolve(HubQualityTier requested)
        {
            HubQualityTier resolved = requested;
            if (resolved == HubQualityTier.Auto)
            {
                bool constrainedMemory = SystemInfo.systemMemorySize > 0 && SystemInfo.systemMemorySize < 3500;
                bool constrainedCpu = SystemInfo.processorCount > 0 && SystemInfo.processorCount <= 4;
                if (constrainedMemory || constrainedCpu)
                {
                    resolved = HubQualityTier.Low;
                }
                else if (SystemInfo.systemMemorySize >= 7000 && SystemInfo.processorCount >= 8)
                {
                    resolved = HubQualityTier.High;
                }
                else
                {
                    resolved = HubQualityTier.Medium;
                }
            }

            switch (resolved)
            {
                case HubQualityTier.Low:
                    return new HubQualityProfile(resolved, 4, 1, 4, 6, 4, 0.34f);
                case HubQualityTier.High:
                    return new HubQualityProfile(resolved, 10, 3, 12, 16, 10, 0.16f);
                default:
                    return new HubQualityProfile(resolved, 7, 2, 8, 10, 7, 0.24f);
            }
        }

        public static bool IsVisible(Camera camera, Vector3 worldPosition, float padding = 0.12f)
        {
            if (camera == null)
            {
                return true;
            }

            Vector3 point = camera.WorldToViewportPoint(worldPosition);
            return point.z > 0f && point.x >= -padding && point.x <= 1f + padding &&
                   point.y >= -padding && point.y <= 1f + padding;
        }
    }
}
