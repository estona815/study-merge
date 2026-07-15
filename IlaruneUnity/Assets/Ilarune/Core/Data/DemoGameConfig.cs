using System;
using System.Collections.Generic;

namespace Ilarune.Core
{
    [Serializable]
    public sealed class GameContentConfig
    {
        public List<HeroDefinition> heroes = new List<HeroDefinition>();
        public List<BuildingDefinition> buildings = new List<BuildingDefinition>();
        public List<StageDefinition> stages = new List<StageDefinition>();

        public static GameContentConfig CreateLocalDemo()
        {
            return new GameContentConfig
            {
                heroes = new List<HeroDefinition>
                {
                    new HeroDefinition("astral_guard", "Astral Guard", 110, 24),
                    new HeroDefinition("mist_weaver", "Mist Weaver", 82, 35),
                    new HeroDefinition("brass_ranger", "Brass Ranger", 96, 29),
                    new HeroDefinition("ember_scholar", "Ember Scholar", 88, 32)
                },
                buildings = new List<BuildingDefinition>
                {
                    new BuildingDefinition("command_spire", "Command Spire", 600, 120, 8, 20, 2, 20),
                    new BuildingDefinition("aether_mine", "Aether Mine", 450, 240, 12, 60, 4, 20),
                    new BuildingDefinition("research_annex", "Research Annex", 700, 90, 5, 20, 1, 15),
                    new BuildingDefinition("sky_foundry", "Sky Foundry", 850, 180, 9, 40, 3, 15)
                },
                stages = new List<StageDefinition>
                {
                    new StageDefinition(1, "Cloudbreak Approach", 3, 180, 40),
                    new StageDefinition(2, "Verdigris Causeway", 3, 240, 55),
                    new StageDefinition(3, "The Hollow Engine", 4, 340, 75)
                }
            };
        }
    }

    [Serializable]
    public sealed class HeroDefinition
    {
        public string id;
        public string displayName;
        public int basePower;
        public int manaCost;

        public HeroDefinition(string id, string displayName, int basePower, int manaCost)
        {
            this.id = id;
            this.displayName = displayName;
            this.basePower = basePower;
            this.manaCost = manaCost;
        }
    }

    [Serializable]
    public sealed class BuildingDefinition
    {
        public string id;
        public string displayName;
        public int baseUpgradeCost;
        public int baseCapacity;
        public int baseProductionPerMinute;
        public int capacityPerLevel;
        public int productionPerMinutePerLevel;
        public int maxLevel;

        public BuildingDefinition(
            string id,
            string displayName,
            int baseUpgradeCost,
            int baseCapacity,
            int baseProductionPerMinute,
            int capacityPerLevel,
            int productionPerMinutePerLevel,
            int maxLevel)
        {
            this.id = id;
            this.displayName = displayName;
            this.baseUpgradeCost = baseUpgradeCost;
            this.baseCapacity = baseCapacity;
            this.baseProductionPerMinute = baseProductionPerMinute;
            this.capacityPerLevel = capacityPerLevel;
            this.productionPerMinutePerLevel = productionPerMinutePerLevel;
            this.maxLevel = maxLevel;
        }
    }

    [Serializable]
    public sealed class StageDefinition
    {
        public int id;
        public string displayName;
        public int waveCount;
        public int softCurrencyReward;
        public int heroExperienceReward;

        public StageDefinition(
            int id,
            string displayName,
            int waveCount,
            int softCurrencyReward,
            int heroExperienceReward)
        {
            this.id = id;
            this.displayName = displayName;
            this.waveCount = waveCount;
            this.softCurrencyReward = softCurrencyReward;
            this.heroExperienceReward = heroExperienceReward;
        }
    }
}
