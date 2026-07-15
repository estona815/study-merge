using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Ilarune.Shared
{
    public interface IBackendAdapter
    {
        bool IsLocalDemo { get; }
        Task<GameSnapshot> LoadSnapshotAsync(CancellationToken cancellationToken = default);
        Task SaveSnapshotAsync(GameSnapshot snapshot, CancellationToken cancellationToken = default);
    }

    public interface ISceneNavigator
    {
        string CurrentSceneId { get; }
        void Open(string sceneId);
        void Back();
    }

    public interface IRewardSink
    {
        void Grant(RewardGrant reward);
    }

    public interface IClock
    {
        DateTimeOffset UtcNow { get; }
    }

    [Serializable]
    public sealed class GameSnapshot
    {
        public int schemaVersion = 1;
        public string playerName = "Astra";
        public int playerLevel = 12;
        public int softCurrency = 4200;
        public int premiumCurrency = 180;
        public int energy = 24;
        public int selectedStage = 1;
        public List<HeroState> heroes = new List<HeroState>();
        public List<BuildingState> buildings = new List<BuildingState>();
    }

    [Serializable]
    public sealed class HeroState
    {
        public string id;
        public int level = 1;
        public int experience;
        public bool inTeam;
    }

    [Serializable]
    public sealed class BuildingState
    {
        public string id;
        public int level = 1;
        public int storedAmount;
        public long productionStartedUnixSeconds;
    }

    [Serializable]
    public struct RewardGrant
    {
        public int softCurrency;
        public int premiumCurrency;
        public int heroExperience;

        public RewardGrant(int softCurrency, int premiumCurrency, int heroExperience)
        {
            this.softCurrency = softCurrency;
            this.premiumCurrency = premiumCurrency;
            this.heroExperience = heroExperience;
        }
    }

    public static class SceneIds
    {
        public const string Main = "Main";
        public const string BattleStage = "Battle_Stage";
        public const string BattlePvp = "Battle_PvP";
        public const string BattleClanBoss = "Battle_ClanBoss";
    }
}
