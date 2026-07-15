using System;
using System.Collections.Generic;
using Ilarune.Shared;
using UnityEngine;

namespace Ilarune.Core
{
    public static class SnapshotUtility
    {
        public const int CurrentSchemaVersion = 1;

        public static GameSnapshot CreateLocalDemo()
        {
            return new GameSnapshot
            {
                schemaVersion = CurrentSchemaVersion,
                playerName = "Astra",
                playerLevel = 1,
                softCurrency = 4200,
                premiumCurrency = 180,
                energy = 24,
                selectedStage = 1,
                heroes = new List<HeroState>
                {
                    new HeroState { id = "astral_guard", level = 1, inTeam = true },
                    new HeroState { id = "mist_weaver", level = 1, inTeam = true },
                    new HeroState { id = "brass_ranger", level = 1, inTeam = true },
                    new HeroState { id = "ember_scholar", level = 1, inTeam = true }
                },
                buildings = new List<BuildingState>
                {
                    new BuildingState { id = "command_spire", level = 1 },
                    new BuildingState { id = "aether_mine", level = 1 },
                    new BuildingState { id = "research_annex", level = 1 },
                    new BuildingState { id = "sky_foundry", level = 1 }
                }
            };
        }

        public static GameSnapshot Normalize(GameSnapshot snapshot)
        {
            snapshot = snapshot ?? CreateLocalDemo();
            snapshot.schemaVersion = Math.Max(CurrentSchemaVersion, snapshot.schemaVersion);
            snapshot.playerName = string.IsNullOrWhiteSpace(snapshot.playerName) ? "Astra" : snapshot.playerName.Trim();
            snapshot.playerLevel = Math.Max(1, snapshot.playerLevel);
            snapshot.softCurrency = Math.Max(0, snapshot.softCurrency);
            snapshot.premiumCurrency = Math.Max(0, snapshot.premiumCurrency);
            snapshot.energy = Math.Max(0, snapshot.energy);
            snapshot.selectedStage = Math.Max(1, snapshot.selectedStage);
            snapshot.heroes = snapshot.heroes ?? new List<HeroState>();
            snapshot.buildings = snapshot.buildings ?? new List<BuildingState>();

            foreach (HeroState hero in snapshot.heroes)
            {
                if (hero == null)
                {
                    continue;
                }

                hero.id = hero.id ?? string.Empty;
                hero.level = Math.Max(1, hero.level);
                hero.experience = Math.Max(0, hero.experience);
            }

            foreach (BuildingState building in snapshot.buildings)
            {
                if (building == null)
                {
                    continue;
                }

                building.id = building.id ?? string.Empty;
                building.level = Math.Max(1, building.level);
                building.storedAmount = Math.Max(0, building.storedAmount);
                building.productionStartedUnixSeconds = Math.Max(0L, building.productionStartedUnixSeconds);
            }

            return snapshot;
        }

        public static GameSnapshot Clone(GameSnapshot snapshot)
        {
            if (snapshot == null)
            {
                return null;
            }

            string json = JsonUtility.ToJson(snapshot);
            return Normalize(JsonUtility.FromJson<GameSnapshot>(json));
        }
    }
}
