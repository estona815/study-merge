using System;
using System.Collections.Generic;

namespace Ilarune.Battle
{
    public enum TileElement
    {
        Fire,
        Water,
        Nature,
        Light,
        Shadow
    }

    public enum TileSpecial
    {
        None,
        RowClear,
        ColumnClear,
        Burst,
        Prismatic
    }

    public enum SwapFailure
    {
        None,
        OutOfBounds,
        NotAdjacent,
        NoMatch
    }

    public enum BattleOutcome
    {
        InProgress,
        Victory,
        Defeat
    }

    public enum BattleSignalKind
    {
        BattleStarted,
        BoardChanged,
        PlayerAttack,
        ManaChanged,
        SkillUsed,
        EnemyAttack,
        WaveStarted,
        Victory,
        Defeat,
        RewardGranted,
        Retried
    }

    [Serializable]
    public struct BoardCoordinate : IEquatable<BoardCoordinate>
    {
        public int X;
        public int Y;

        public BoardCoordinate(int x, int y)
        {
            X = x;
            Y = y;
        }

        public bool IsAdjacentTo(BoardCoordinate other)
        {
            return Math.Abs(X - other.X) + Math.Abs(Y - other.Y) == 1;
        }

        public bool Equals(BoardCoordinate other)
        {
            return X == other.X && Y == other.Y;
        }

        public override bool Equals(object obj)
        {
            return obj is BoardCoordinate other && Equals(other);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (X * 397) ^ Y;
            }
        }

        public override string ToString()
        {
            return "(" + X + ", " + Y + ")";
        }
    }

    [Serializable]
    public struct BoardTile : IEquatable<BoardTile>
    {
        public TileElement Element;
        public TileSpecial Special;

        public BoardTile(TileElement element, TileSpecial special = TileSpecial.None)
        {
            Element = element;
            Special = special;
        }

        public bool Equals(BoardTile other)
        {
            return Element == other.Element && Special == other.Special;
        }

        public override bool Equals(object obj)
        {
            return obj is BoardTile other && Equals(other);
        }

        public override int GetHashCode()
        {
            return ((int)Element * 397) ^ (int)Special;
        }

        public override string ToString()
        {
            return Special == TileSpecial.None ? Element.ToString() : Element + "/" + Special;
        }
    }

    [Serializable]
    public sealed class BoardConfiguration
    {
        public int Columns = 7;
        public int Rows = 8;
        public int ElementCount = 5;
        public int Seed = 1729;

        public void Validate()
        {
            if (Columns < 3 || Rows < 3)
            {
                throw new ArgumentOutOfRangeException(nameof(Columns), "Match-3 boards must be at least 3x3.");
            }

            if (ElementCount < 3 || ElementCount > Enum.GetValues(typeof(TileElement)).Length)
            {
                throw new ArgumentOutOfRangeException(nameof(ElementCount), "ElementCount must be between 3 and the available element count.");
            }
        }
    }

    public sealed class BoardResolution
    {
        private readonly Dictionary<TileElement, int> _clearedByElement = new Dictionary<TileElement, int>();

        public int ClearedTileCount { get; internal set; }
        public int MatchSteps { get; internal set; }
        public int CascadeCount => Math.Max(0, MatchSteps - 1);
        public int SpecialsCreated { get; internal set; }
        public bool WasReshuffled { get; internal set; }
        public IReadOnlyDictionary<TileElement, int> ClearedByElement => _clearedByElement;

        internal void AddCleared(TileElement element)
        {
            ClearedTileCount++;
            if (!_clearedByElement.ContainsKey(element))
            {
                _clearedByElement[element] = 0;
            }

            _clearedByElement[element]++;
        }
    }

    public sealed class BoardMoveResult
    {
        public bool Accepted { get; internal set; }
        public bool WasRolledBack { get; internal set; }
        public SwapFailure Failure { get; internal set; }
        public BoardResolution Resolution { get; internal set; }
    }

    [Serializable]
    public sealed class EnemyDefinition
    {
        public string Id = "enemy";
        public string DisplayName = "Voidling";
        public int MaxHealth = 260;
        public int Attack = 22;
        public TileElement Weakness = TileElement.Light;

        public EnemyDefinition Clone()
        {
            return (EnemyDefinition)MemberwiseClone();
        }
    }

    [Serializable]
    public sealed class BattleConfiguration
    {
        public BoardConfiguration Board = new BoardConfiguration();
        public int PlayerMaxHealth = 420;
        public int AttackPerTile = 11;
        public int ManaPerTile = 3;
        public int MaxMana = 100;
        public int SkillManaCost = 60;
        public int SkillDamage = 180;
        public int RewardSoftCurrency = 320;
        public int RewardHeroExperience = 75;
        public List<EnemyDefinition> Waves = new List<EnemyDefinition>
        {
            new EnemyDefinition { Id = "thornling", DisplayName = "Thornling", MaxHealth = 220, Attack = 18, Weakness = TileElement.Fire },
            new EnemyDefinition { Id = "tide_wraith", DisplayName = "Tide Wraith", MaxHealth = 310, Attack = 24, Weakness = TileElement.Nature },
            new EnemyDefinition { Id = "eclipse_guard", DisplayName = "Eclipse Guard", MaxHealth = 420, Attack = 31, Weakness = TileElement.Light }
        };

        public void Validate()
        {
            Board.Validate();
            if (PlayerMaxHealth <= 0 || AttackPerTile <= 0 || ManaPerTile < 0 || MaxMana <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(PlayerMaxHealth), "Battle values must be positive.");
            }

            if (SkillManaCost <= 0 || SkillManaCost > MaxMana || SkillDamage <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(SkillManaCost), "Skill values are outside the supported range.");
            }

            if (Waves == null || Waves.Count == 0)
            {
                throw new InvalidOperationException("At least one enemy wave is required.");
            }

            for (var index = 0; index < Waves.Count; index++)
            {
                if (Waves[index] == null || Waves[index].MaxHealth <= 0 || Waves[index].Attack < 0)
                {
                    throw new InvalidOperationException("Every wave must contain a valid enemy definition.");
                }
            }
        }
    }

    public sealed class BattleSignal
    {
        public BattleSignalKind Kind { get; }
        public int Amount { get; }
        public string Message { get; }

        public BattleSignal(BattleSignalKind kind, int amount, string message)
        {
            Kind = kind;
            Amount = amount;
            Message = message ?? string.Empty;
        }
    }

    public sealed class BattleTurnResult
    {
        public bool Accepted { get; internal set; }
        public BoardMoveResult BoardMove { get; internal set; }
        public int PlayerDamageDealt { get; internal set; }
        public int EnemyDamageDealt { get; internal set; }
        public bool WaveAdvanced { get; internal set; }
        public BattleOutcome Outcome { get; internal set; }
    }
}
