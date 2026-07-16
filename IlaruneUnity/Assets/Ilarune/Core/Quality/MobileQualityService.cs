using System;
using UnityEngine;

namespace Ilarune.Core
{
    public enum MobileQualityTier
    {
        Low = 0,
        Medium = 1,
        High = 2
    }

    public sealed class MobileQualityProfile
    {
        public MobileQualityTier tier;
        public int targetFrameRate;
        public int npcBudget;
        public int airshipBudget;
        public int parallaxLayerBudget;
        public float particleBudgetMultiplier;
        public bool highCostPostEffects;
    }

    public interface IMobileQualityService
    {
        MobileQualityProfile CurrentProfile { get; }
        void Apply(MobileQualityTier tier, bool persist = true);
    }

    public sealed class MobileQualityService : IMobileQualityService
    {
        public const string PlayerPrefsKey = "ilarune.mobile-quality.v1";

        public event Action<MobileQualityProfile> QualityChanged;

        public MobileQualityProfile CurrentProfile { get; private set; }

        public void Apply(MobileQualityTier tier, bool persist = true)
        {
            tier = (MobileQualityTier)Mathf.Clamp((int)tier, 0, 2);
            MobileQualityProfile profile = CreateProfile(tier);

            int qualityLevel = FindQualityLevel(tier);
            if (qualityLevel >= 0)
            {
                QualitySettings.SetQualityLevel(qualityLevel, true);
            }

            QualitySettings.vSyncCount = 0;
            Application.targetFrameRate = profile.targetFrameRate;
            CurrentProfile = profile;

            if (persist)
            {
                PlayerPrefs.SetInt(PlayerPrefsKey, (int)tier);
                PlayerPrefs.Save();
            }

            QualityChanged?.Invoke(profile);
        }

        public void ApplySavedOrRecommended()
        {
            MobileQualityTier tier = PlayerPrefs.HasKey(PlayerPrefsKey)
                ? (MobileQualityTier)PlayerPrefs.GetInt(PlayerPrefsKey, (int)MobileQualityTier.Medium)
                : RecommendForCurrentDevice();
            Apply(tier, false);
        }

        public static MobileQualityTier RecommendForCurrentDevice()
        {
            int memoryMb = SystemInfo.systemMemorySize;
            int graphicsMemoryMb = SystemInfo.graphicsMemorySize;

            if ((memoryMb > 0 && memoryMb < 3000) ||
                (graphicsMemoryMb > 0 && graphicsMemoryMb < 1000))
            {
                return MobileQualityTier.Low;
            }

            if (memoryMb >= 6000 && graphicsMemoryMb >= 2000)
            {
                return MobileQualityTier.High;
            }

            return MobileQualityTier.Medium;
        }

        private static MobileQualityProfile CreateProfile(MobileQualityTier tier)
        {
            switch (tier)
            {
                case MobileQualityTier.Low:
                    return new MobileQualityProfile
                    {
                        tier = tier,
                        targetFrameRate = 30,
                        npcBudget = 4,
                        airshipBudget = 1,
                        parallaxLayerBudget = 2,
                        particleBudgetMultiplier = 0.5f,
                        highCostPostEffects = false
                    };
                case MobileQualityTier.High:
                    return new MobileQualityProfile
                    {
                        tier = tier,
                        targetFrameRate = 60,
                        npcBudget = 12,
                        airshipBudget = 3,
                        parallaxLayerBudget = 4,
                        particleBudgetMultiplier = 1f,
                        highCostPostEffects = true
                    };
                default:
                    return new MobileQualityProfile
                    {
                        tier = MobileQualityTier.Medium,
                        targetFrameRate = 60,
                        npcBudget = 8,
                        airshipBudget = 2,
                        parallaxLayerBudget = 3,
                        particleBudgetMultiplier = 0.75f,
                        highCostPostEffects = false
                    };
            }
        }

        private static int FindQualityLevel(MobileQualityTier tier)
        {
            string qualityName = tier.ToString();
            string[] names = QualitySettings.names;
            for (int index = 0; index < names.Length; index++)
            {
                if (string.Equals(names[index], qualityName, StringComparison.OrdinalIgnoreCase))
                {
                    return index;
                }
            }

            return names.Length == 0 ? -1 : Mathf.Clamp((int)tier, 0, names.Length - 1);
        }
    }
}
