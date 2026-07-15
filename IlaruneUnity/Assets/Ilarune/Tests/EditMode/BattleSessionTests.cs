using System.Collections.Generic;
using Ilarune.Shared;
using NUnit.Framework;

namespace Ilarune.Battle.Tests
{
    public sealed class BattleSessionTests
    {
        [Test]
        public void ValidElementMatch_DealsWeaknessDamageAndBuildsMana()
        {
            var configuration = CreateConfiguration();
            configuration.ManaPerTile = 10;
            configuration.AttackPerTile = 10;
            configuration.Waves[0].Weakness = TileElement.Fire;
            var session = CreateSessionWithValidSwap(configuration);

            var result = session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

            Assert.That(result.Accepted, Is.True);
            Assert.That(result.PlayerDamageDealt, Is.GreaterThanOrEqualTo(45));
            Assert.That(session.Mana, Is.GreaterThanOrEqualTo(30));
        }

        [Test]
        public void AcceptedMove_GivesEnemyOneTurnWhenWaveSurvives()
        {
            var configuration = CreateConfiguration();
            configuration.PlayerMaxHealth = 100;
            configuration.Waves[0].Attack = 17;
            var session = CreateSessionWithValidSwap(configuration);

            var result = session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

            Assert.That(result.EnemyDamageDealt, Is.EqualTo(17));
            Assert.That(session.PlayerHealth, Is.EqualTo(83));
            Assert.That(session.Outcome, Is.EqualTo(BattleOutcome.InProgress));
        }

        [Test]
        public void LethalEnemyTurn_SignalsDefeatAndRetryResetsState()
        {
            var configuration = CreateConfiguration();
            configuration.PlayerMaxHealth = 50;
            configuration.Waves[0].Attack = 75;
            var session = CreateSessionWithValidSwap(configuration);
            var signals = new List<BattleSignalKind>();
            session.Signaled += signal => signals.Add(signal.Kind);

            session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

            Assert.That(session.Outcome, Is.EqualTo(BattleOutcome.Defeat));
            CollectionAssert.Contains(signals, BattleSignalKind.Defeat);

            session.Retry();

            Assert.That(session.Outcome, Is.EqualTo(BattleOutcome.InProgress));
            Assert.That(session.PlayerHealth, Is.EqualTo(configuration.PlayerMaxHealth));
            Assert.That(session.Mana, Is.Zero);
            CollectionAssert.Contains(signals, BattleSignalKind.Retried);
        }

        [Test]
        public void FilledMana_CastsSkillAndSpendsConfiguredCost()
        {
            var configuration = CreateConfiguration();
            configuration.ManaPerTile = 100;
            configuration.MaxMana = 100;
            configuration.SkillManaCost = 60;
            configuration.SkillDamage = 120;
            configuration.Waves[0].Attack = 0;
            var session = CreateSessionWithValidSwap(configuration);
            session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

            var result = session.TryUseSkill();

            Assert.That(result.Accepted, Is.True);
            Assert.That(result.PlayerDamageDealt, Is.EqualTo(120));
            Assert.That(session.Mana, Is.EqualTo(40));
        }

        [Test]
        public void ClearedWave_AdvancesWithoutImmediateEnemyCounterattack()
        {
            var configuration = CreateConfiguration();
            configuration.Waves[0].MaxHealth = 1;
            configuration.Waves.Add(new EnemyDefinition
            {
                Id = "second",
                DisplayName = "Second Wave",
                MaxHealth = 300,
                Attack = 99,
                Weakness = TileElement.Water
            });
            var session = CreateSessionWithValidSwap(configuration);

            var result = session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

            Assert.That(result.WaveAdvanced, Is.True);
            Assert.That(result.EnemyDamageDealt, Is.Zero);
            Assert.That(session.WaveIndex, Is.EqualTo(1));
            Assert.That(session.CurrentEnemyHealth, Is.EqualTo(300));
        }

        [Test]
        public void FinalWaveVictory_GrantsRewardExactlyOnce()
        {
            var configuration = CreateConfiguration();
            configuration.Waves[0].MaxHealth = 1;
            configuration.RewardSoftCurrency = 321;
            configuration.RewardHeroExperience = 45;
            var sink = new RecordingRewardSink();
            var session = CreateSessionWithValidSwap(configuration, sink);
            var rewardSignals = 0;
            session.RewardGranted += _ => rewardSignals++;

            var result = session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));
            session.TryUseSkill();

            Assert.That(result.Outcome, Is.EqualTo(BattleOutcome.Victory));
            Assert.That(session.Outcome, Is.EqualTo(BattleOutcome.Victory));
            Assert.That(sink.Grants.Count, Is.EqualTo(1));
            Assert.That(rewardSignals, Is.EqualTo(1));
            Assert.That(sink.Grants[0].softCurrency, Is.EqualTo(321));
            Assert.That(sink.Grants[0].heroExperience, Is.EqualTo(45));
        }

        [Test]
        public void AutoTurn_SelectsAValidMoveAndAdvancesBattle()
        {
            var configuration = CreateConfiguration();
            var session = CreateSessionWithValidSwap(configuration);
            var healthBefore = session.CurrentEnemyHealth;

            var result = session.TryAutoTurn();

            Assert.That(result.Accepted, Is.True);
            Assert.That(session.CurrentEnemyHealth, Is.LessThan(healthBefore));
            Assert.That(session.Board.HasImmediateMatch(), Is.False);
        }

        private static BattleConfiguration CreateConfiguration()
        {
            var configuration = new BattleConfiguration
            {
                Board = TestBoardFactory.Configuration(),
                PlayerMaxHealth = 400,
                AttackPerTile = 10,
                ManaPerTile = 3,
                MaxMana = 100,
                SkillManaCost = 60,
                SkillDamage = 100,
                RewardSoftCurrency = 100,
                RewardHeroExperience = 20
            };
            configuration.Waves.Clear();
            configuration.Waves.Add(new EnemyDefinition
            {
                Id = "test_enemy",
                DisplayName = "Test Enemy",
                MaxHealth = 5000,
                Attack = 10,
                Weakness = TileElement.Fire
            });
            return configuration;
        }

        private static BattleSession CreateSessionWithValidSwap(BattleConfiguration configuration, IRewardSink sink = null)
        {
            var session = new BattleSession(configuration, sink);
            session.Board.LoadBoard(TestBoardFactory.ValidSwapLayout());
            return session;
        }

        private sealed class RecordingRewardSink : IRewardSink
        {
            public readonly List<RewardGrant> Grants = new List<RewardGrant>();

            public void Grant(RewardGrant reward)
            {
                Grants.Add(reward);
            }
        }
    }
}
