using System;
using Ilarune.Shared;

namespace Ilarune.Battle
{
    public sealed class BattleSession
    {
        private readonly BattleConfiguration _configuration;
        private readonly IRewardSink _rewardSink;
        private bool _rewardGranted;

        public event Action<BattleSignal> Signaled;
        public event Action<RewardGrant> RewardGranted;

        public Match3Board Board { get; private set; }
        public int PlayerHealth { get; private set; }
        public int PlayerMaxHealth => _configuration.PlayerMaxHealth;
        public int Mana { get; private set; }
        public int MaxMana => _configuration.MaxMana;
        public int SkillManaCost => _configuration.SkillManaCost;
        public int WaveIndex { get; private set; }
        public int WaveCount => _configuration.Waves.Count;
        public int CurrentEnemyHealth { get; private set; }
        public EnemyDefinition CurrentEnemy => _configuration.Waves[WaveIndex];
        public BattleOutcome Outcome { get; private set; }
        public RewardGrant? LastReward { get; private set; }

        public BattleSession(BattleConfiguration configuration, IRewardSink rewardSink = null)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _configuration.Validate();
            _rewardSink = rewardSink;
            ResetState(false);
        }

        public BattleTurnResult TrySwap(BoardCoordinate first, BoardCoordinate second)
        {
            if (Outcome != BattleOutcome.InProgress)
            {
                return RejectedTurn();
            }

            var boardMove = Board.TrySwap(first, second);
            if (!boardMove.Accepted)
            {
                return new BattleTurnResult
                {
                    Accepted = false,
                    BoardMove = boardMove,
                    Outcome = Outcome
                };
            }

            Emit(BattleSignalKind.BoardChanged, boardMove.Resolution.ClearedTileCount, "Board resolved");
            GainMana(boardMove.Resolution.ClearedTileCount * _configuration.ManaPerTile);

            var playerDamage = CalculateElementDamage(boardMove.Resolution);
            CurrentEnemyHealth = Math.Max(0, CurrentEnemyHealth - playerDamage);
            Emit(BattleSignalKind.PlayerAttack, playerDamage, "Element attack");

            var waveAdvanced = ResolveEnemyDefeat();
            var enemyDamage = 0;
            if (Outcome == BattleOutcome.InProgress && !waveAdvanced)
            {
                enemyDamage = TakeEnemyTurn();
            }

            return new BattleTurnResult
            {
                Accepted = true,
                BoardMove = boardMove,
                PlayerDamageDealt = playerDamage,
                EnemyDamageDealt = enemyDamage,
                WaveAdvanced = waveAdvanced,
                Outcome = Outcome
            };
        }

        public BattleTurnResult TryUseSkill()
        {
            if (Outcome != BattleOutcome.InProgress || Mana < _configuration.SkillManaCost)
            {
                return RejectedTurn();
            }

            Mana -= _configuration.SkillManaCost;
            Emit(BattleSignalKind.ManaChanged, Mana, "Mana spent");
            CurrentEnemyHealth = Math.Max(0, CurrentEnemyHealth - _configuration.SkillDamage);
            Emit(BattleSignalKind.SkillUsed, _configuration.SkillDamage, "Moonfall skill");

            var waveAdvanced = ResolveEnemyDefeat();
            var enemyDamage = 0;
            if (Outcome == BattleOutcome.InProgress && !waveAdvanced)
            {
                enemyDamage = TakeEnemyTurn();
            }

            return new BattleTurnResult
            {
                Accepted = true,
                PlayerDamageDealt = _configuration.SkillDamage,
                EnemyDamageDealt = enemyDamage,
                WaveAdvanced = waveAdvanced,
                Outcome = Outcome
            };
        }

        public BattleTurnResult TryAutoTurn()
        {
            if (Outcome != BattleOutcome.InProgress)
            {
                return RejectedTurn();
            }

            if (Mana >= _configuration.SkillManaCost)
            {
                return TryUseSkill();
            }

            if (Board.TryFindAvailableMove(out var first, out var second))
            {
                return TrySwap(first, second);
            }

            Board.ReshuffleIfDead();
            return Board.TryFindAvailableMove(out first, out second)
                ? TrySwap(first, second)
                : RejectedTurn();
        }

        public void Retry()
        {
            ResetState(true);
        }

        private int CalculateElementDamage(BoardResolution resolution)
        {
            var total = 0;
            foreach (var cleared in resolution.ClearedByElement)
            {
                var damage = cleared.Value * _configuration.AttackPerTile;
                if (cleared.Key == CurrentEnemy.Weakness)
                {
                    damage = damage * 3 / 2;
                }

                total += damage;
            }

            return total;
        }

        private void GainMana(int amount)
        {
            if (amount <= 0)
            {
                return;
            }

            Mana = Math.Min(_configuration.MaxMana, Mana + amount);
            Emit(BattleSignalKind.ManaChanged, Mana, "Mana gained");
        }

        private bool ResolveEnemyDefeat()
        {
            if (CurrentEnemyHealth > 0)
            {
                return false;
            }

            if (WaveIndex + 1 < _configuration.Waves.Count)
            {
                WaveIndex++;
                CurrentEnemyHealth = CurrentEnemy.MaxHealth;
                Emit(BattleSignalKind.WaveStarted, WaveIndex + 1, CurrentEnemy.DisplayName);
                return true;
            }

            Outcome = BattleOutcome.Victory;
            Emit(BattleSignalKind.Victory, 0, "All waves cleared");
            GrantRewardOnce();
            return false;
        }

        private int TakeEnemyTurn()
        {
            var damage = Math.Max(0, CurrentEnemy.Attack);
            PlayerHealth = Math.Max(0, PlayerHealth - damage);
            Emit(BattleSignalKind.EnemyAttack, damage, CurrentEnemy.DisplayName + " attacks");
            if (PlayerHealth == 0)
            {
                Outcome = BattleOutcome.Defeat;
                Emit(BattleSignalKind.Defeat, 0, "Party defeated");
            }

            return damage;
        }

        private void GrantRewardOnce()
        {
            if (_rewardGranted)
            {
                return;
            }

            _rewardGranted = true;
            var reward = new RewardGrant(
                _configuration.RewardSoftCurrency,
                0,
                _configuration.RewardHeroExperience);
            LastReward = reward;
            _rewardSink?.Grant(reward);
            RewardGranted?.Invoke(reward);
            Emit(BattleSignalKind.RewardGranted, reward.softCurrency, "Battle reward");
        }

        private void ResetState(bool retry)
        {
            Board = new Match3Board(_configuration.Board);
            PlayerHealth = _configuration.PlayerMaxHealth;
            Mana = 0;
            WaveIndex = 0;
            CurrentEnemyHealth = CurrentEnemy.MaxHealth;
            Outcome = BattleOutcome.InProgress;
            LastReward = null;
            _rewardGranted = false;
            Emit(retry ? BattleSignalKind.Retried : BattleSignalKind.BattleStarted, 0, retry ? "Battle retried" : "Battle started");
        }

        private BattleTurnResult RejectedTurn()
        {
            return new BattleTurnResult
            {
                Accepted = false,
                Outcome = Outcome
            };
        }

        private void Emit(BattleSignalKind kind, int amount, string message)
        {
            Signaled?.Invoke(new BattleSignal(kind, amount, message));
        }
    }

    public static class BattlePresets
    {
        public static BattleConfiguration CreateForScene(string sceneName)
        {
            var configuration = new BattleConfiguration();
            if (string.Equals(sceneName, "Battle_PvP", StringComparison.OrdinalIgnoreCase))
            {
                configuration.Waves.Clear();
                configuration.Waves.Add(new EnemyDefinition
                {
                    Id = "mirror_champion",
                    DisplayName = "Mirror Champion",
                    MaxHealth = 560,
                    Attack = 34,
                    Weakness = TileElement.Shadow
                });
                configuration.RewardSoftCurrency = 440;
            }
            else if (string.Equals(sceneName, "Battle_ClanBoss", StringComparison.OrdinalIgnoreCase))
            {
                configuration.Waves.Clear();
                configuration.Waves.Add(new EnemyDefinition
                {
                    Id = "astral_leviathan",
                    DisplayName = "Astral Leviathan",
                    MaxHealth = 1200,
                    Attack = 46,
                    Weakness = TileElement.Light
                });
                configuration.PlayerMaxHealth = 620;
                configuration.SkillDamage = 260;
                configuration.RewardSoftCurrency = 900;
                configuration.RewardHeroExperience = 180;
            }

            return configuration;
        }
    }
}
