using System;
using System.Collections.Generic;
using Ilarune.Shared;

namespace Ilarune.Core
{
    [Serializable]
    public sealed class BuildingStatus
    {
        public string id;
        public int level;
        public int storedAmount;
        public int capacity;
        public int productionPerMinute;
        public int nextUpgradeCost;
        public bool isMaxLevel;
    }

    public sealed class BuildingService
    {
        private readonly GameSessionService session;
        private readonly RewardService rewards;
        private readonly IClock clock;
        private readonly Dictionary<string, BuildingDefinition> definitions;

        public BuildingService(
            GameSessionService session,
            RewardService rewards,
            IClock clock,
            IEnumerable<BuildingDefinition> definitions)
        {
            this.session = session ?? throw new ArgumentNullException(nameof(session));
            this.rewards = rewards ?? throw new ArgumentNullException(nameof(rewards));
            this.clock = clock ?? throw new ArgumentNullException(nameof(clock));
            this.definitions = new Dictionary<string, BuildingDefinition>(StringComparer.Ordinal);

            if (definitions == null)
            {
                return;
            }

            foreach (BuildingDefinition definition in definitions)
            {
                if (definition != null && !string.IsNullOrWhiteSpace(definition.id))
                {
                    this.definitions[definition.id] = definition;
                }
            }
        }

        public BuildingStatus GetStatus(string buildingId)
        {
            BuildingDefinition definition = GetDefinition(buildingId);
            BuildingState state = null;
            session.Mutate(snapshot =>
            {
                state = GetOrCreateState(snapshot, buildingId);
                RefreshProduction(state, definition, clock.UtcNow.ToUnixTimeSeconds());
            });

            return CreateStatus(state, definition);
        }

        public int Collect(string buildingId)
        {
            BuildingDefinition definition = GetDefinition(buildingId);
            int collected = 0;
            session.Mutate(snapshot =>
            {
                BuildingState state = GetOrCreateState(snapshot, buildingId);
                long now = clock.UtcNow.ToUnixTimeSeconds();
                RefreshProduction(state, definition, now);
                collected = state.storedAmount;
                state.storedAmount = 0;
                state.productionStartedUnixSeconds = now;
            });

            if (collected > 0)
            {
                rewards.Grant(new RewardGrant(collected, 0, 0));
            }

            return collected;
        }

        public bool TryUpgrade(string buildingId, out string failureReason)
        {
            BuildingDefinition definition = GetDefinition(buildingId);
            bool upgraded = false;
            string reason = string.Empty;

            session.Mutate(snapshot =>
            {
                BuildingState state = GetOrCreateState(snapshot, buildingId);
                if (state.level >= definition.maxLevel)
                {
                    reason = "Maximum level reached.";
                    return;
                }

                int cost = GetUpgradeCost(definition, state.level);
                if (snapshot.softCurrency < cost)
                {
                    reason = "Not enough soft currency.";
                    return;
                }

                snapshot.softCurrency -= cost;
                state.level++;
                upgraded = true;
            });

            failureReason = reason;
            return upgraded;
        }

        private static BuildingStatus CreateStatus(
            BuildingState state,
            BuildingDefinition definition)
        {
            return new BuildingStatus
            {
                id = state.id,
                level = state.level,
                storedAmount = state.storedAmount,
                capacity = GetCapacity(definition, state.level),
                productionPerMinute = GetProductionPerMinute(definition, state.level),
                nextUpgradeCost = GetUpgradeCost(definition, state.level),
                isMaxLevel = state.level >= definition.maxLevel
            };
        }

        private BuildingDefinition GetDefinition(string buildingId)
        {
            if (string.IsNullOrWhiteSpace(buildingId) || !definitions.TryGetValue(buildingId, out BuildingDefinition definition))
            {
                throw new KeyNotFoundException($"Unknown building definition: {buildingId}");
            }

            return definition;
        }

        private static BuildingState GetOrCreateState(GameSnapshot snapshot, string buildingId)
        {
            foreach (BuildingState state in snapshot.buildings)
            {
                if (state != null && string.Equals(state.id, buildingId, StringComparison.Ordinal))
                {
                    return state;
                }
            }

            BuildingState created = new BuildingState { id = buildingId, level = 1 };
            snapshot.buildings.Add(created);
            return created;
        }

        private static void RefreshProduction(
            BuildingState state,
            BuildingDefinition definition,
            long nowUnixSeconds)
        {
            if (state.productionStartedUnixSeconds <= 0)
            {
                state.productionStartedUnixSeconds = nowUnixSeconds;
                return;
            }

            int capacity = GetCapacity(definition, state.level);
            if (state.storedAmount >= capacity)
            {
                state.storedAmount = capacity;
                state.productionStartedUnixSeconds = nowUnixSeconds;
                return;
            }

            long elapsedSeconds = Math.Max(0L, nowUnixSeconds - state.productionStartedUnixSeconds);
            long completedMinutes = elapsedSeconds / 60L;
            if (completedMinutes <= 0)
            {
                return;
            }

            long produced = completedMinutes * GetProductionPerMinute(definition, state.level);
            state.storedAmount = (int)Math.Min(capacity, state.storedAmount + produced);
            state.productionStartedUnixSeconds += completedMinutes * 60L;

            if (state.storedAmount >= capacity)
            {
                state.productionStartedUnixSeconds = nowUnixSeconds;
            }
        }

        private static int GetCapacity(BuildingDefinition definition, int level)
        {
            long value = definition.baseCapacity +
                         (long)Math.Max(0, level - 1) * definition.capacityPerLevel;
            return ClampToPositiveInt(value);
        }

        private static int GetProductionPerMinute(BuildingDefinition definition, int level)
        {
            long value = definition.baseProductionPerMinute +
                         (long)Math.Max(0, level - 1) * definition.productionPerMinutePerLevel;
            return ClampToPositiveInt(value);
        }

        private static int GetUpgradeCost(BuildingDefinition definition, int currentLevel)
        {
            long value = (long)definition.baseUpgradeCost * Math.Max(1, currentLevel);
            return ClampToPositiveInt(value);
        }

        private static int ClampToPositiveInt(long value)
        {
            return (int)Math.Max(0L, Math.Min(int.MaxValue, value));
        }
    }
}
