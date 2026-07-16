using System;
using Ilarune.Shared;

namespace Ilarune.Core
{
    public sealed class RewardService : IRewardSink
    {
        private const int MaxHeroLevel = 80;
        private readonly GameSessionService session;

        public RewardService(GameSessionService session)
        {
            this.session = session ?? throw new ArgumentNullException(nameof(session));
        }

        public event Action<RewardGrant> RewardGranted;

        public void Grant(RewardGrant reward)
        {
            RewardGrant safeReward = new RewardGrant(
                Math.Max(0, reward.softCurrency),
                Math.Max(0, reward.premiumCurrency),
                Math.Max(0, reward.heroExperience));

            session.Mutate(snapshot =>
            {
                snapshot.softCurrency = SaturatingAdd(snapshot.softCurrency, safeReward.softCurrency);
                snapshot.premiumCurrency = SaturatingAdd(snapshot.premiumCurrency, safeReward.premiumCurrency);

                if (safeReward.heroExperience <= 0)
                {
                    return;
                }

                foreach (HeroState hero in snapshot.heroes)
                {
                    if (hero == null || !hero.inTeam)
                    {
                        continue;
                    }

                    hero.experience = SaturatingAdd(hero.experience, safeReward.heroExperience);
                    ApplyLevelUps(hero);
                }
            });

            RewardGranted?.Invoke(safeReward);
        }

        private static void ApplyLevelUps(HeroState hero)
        {
            while (hero.level < MaxHeroLevel)
            {
                int requiredExperience = Math.Max(100, hero.level * 100);
                if (hero.experience < requiredExperience)
                {
                    return;
                }

                hero.experience -= requiredExperience;
                hero.level++;
            }
        }

        private static int SaturatingAdd(int left, int right)
        {
            long result = (long)left + right;
            return result > int.MaxValue ? int.MaxValue : (int)result;
        }
    }
}
