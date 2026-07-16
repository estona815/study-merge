using System;
using System.Collections.Generic;
using Ilarune.Battle;
using Ilarune.Shared;

internal static class BattleEngineSmoke
{
    private const int Size = 5;

    public static int Main()
    {
        try
        {
            VerifyGeneratedAndRollbackBoard();
            VerifyValidMoveAndBattleReward();
            VerifyDeadBoardRecovery();
            Console.WriteLine("Battle engine standalone smoke passed.");
            return 0;
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine("Battle engine standalone smoke failed: " + exception);
            return 1;
        }
    }

    private static void VerifyGeneratedAndRollbackBoard()
    {
        var board = new Match3Board(Configuration());
        Require(!board.HasImmediateMatch(), "generated board must be stable");
        Require(board.HasAvailableMove(), "generated board must have a legal move");

        board.LoadBoard(LatinLayout());
        var before = board.Snapshot();
        var rejected = board.TrySwap(new BoardCoordinate(0, 0), new BoardCoordinate(1, 0));
        Require(!rejected.Accepted && rejected.WasRolledBack, "non-matching swap must roll back");
        var after = board.Snapshot();
        for (var index = 0; index < before.Length; index++)
        {
            Require(before[index].Equals(after[index]), "rollback must restore every tile");
        }
    }

    private static void VerifyValidMoveAndBattleReward()
    {
        var rewardSink = new RecordingRewardSink();
        var configuration = new BattleConfiguration
        {
            Board = Configuration(),
            AttackPerTile = 10,
            ManaPerTile = 10,
            RewardSoftCurrency = 123,
            RewardHeroExperience = 45
        };
        configuration.Waves.Clear();
        configuration.Waves.Add(new EnemyDefinition
        {
            Id = "smoke",
            DisplayName = "Smoke Target",
            MaxHealth = 1,
            Attack = 0,
            Weakness = TileElement.Fire
        });

        var session = new BattleSession(configuration, rewardSink);
        session.Board.LoadBoard(ValidSwapLayout());
        var result = session.TrySwap(new BoardCoordinate(1, 0), new BoardCoordinate(1, 1));

        Require(result.Accepted, "known valid swap must resolve");
        Require(result.PlayerDamageDealt >= 45, "weakness attack must apply bonus damage");
        Require(session.Mana >= 30, "cleared runes must generate mana");
        Require(session.Outcome == BattleOutcome.Victory, "final wave must produce victory");
        Require(rewardSink.Grants.Count == 1, "victory reward must be granted exactly once");
        Require(rewardSink.Grants[0].softCurrency == 123, "configured reward must be preserved");
    }

    private static void VerifyDeadBoardRecovery()
    {
        var board = new Match3Board(new BoardConfiguration
        {
            Columns = 3,
            Rows = 3,
            ElementCount = 3,
            Seed = 91
        });
        board.LoadBoard(new[]
        {
            new BoardTile(TileElement.Fire), new BoardTile(TileElement.Fire), new BoardTile(TileElement.Water),
            new BoardTile(TileElement.Fire), new BoardTile(TileElement.Fire), new BoardTile(TileElement.Water),
            new BoardTile(TileElement.Water), new BoardTile(TileElement.Nature), new BoardTile(TileElement.Nature)
        });

        Require(!board.HasAvailableMove(), "fixture must be a dead board");
        Require(board.ReshuffleIfDead(), "dead board must trigger reshuffle");
        Require(!board.HasImmediateMatch() && board.HasAvailableMove(), "reshuffled board must be stable and playable");
    }

    private static BoardConfiguration Configuration()
    {
        return new BoardConfiguration { Columns = Size, Rows = Size, ElementCount = 5, Seed = 177 };
    }

    private static BoardTile[] LatinLayout()
    {
        var tiles = new BoardTile[Size * Size];
        for (var y = 0; y < Size; y++)
        {
            for (var x = 0; x < Size; x++)
            {
                tiles[y * Size + x] = new BoardTile((TileElement)((x + y) % 5));
            }
        }

        return tiles;
    }

    private static BoardTile[] ValidSwapLayout()
    {
        var tiles = LatinLayout();
        tiles[0] = new BoardTile(TileElement.Fire);
        tiles[1] = new BoardTile(TileElement.Water);
        tiles[2] = new BoardTile(TileElement.Fire);
        tiles[Size + 1] = new BoardTile(TileElement.Fire);
        return tiles;
    }

    private static void Require(bool condition, string message)
    {
        if (!condition)
        {
            throw new InvalidOperationException(message);
        }
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
