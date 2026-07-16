using System;
using System.Collections.Generic;
using NUnit.Framework;

namespace Ilarune.Battle.Tests
{
    public sealed class Match3BoardTests
    {
        [Test]
        public void GeneratedBoard_HasNoMatchesAndHasAvailableMove()
        {
            var board = new Match3Board(TestBoardFactory.Configuration());

            Assert.That(board.HasImmediateMatch(), Is.False);
            Assert.That(board.HasAvailableMove(), Is.True);
            Assert.That(board.TryFindAvailableMove(out var first, out var second), Is.True);
            Assert.That(first.IsAdjacentTo(second), Is.True);
            Assert.That(board.Snapshot(), Has.Length.EqualTo(25));
        }

        [Test]
        public void InvalidAdjacentSwap_RollsBackExactly()
        {
            var board = TestBoardFactory.CreateLoaded(TestBoardFactory.LatinLayout());
            var before = board.Snapshot();

            var result = board.TrySwap(new BoardCoordinate(0, 0), new BoardCoordinate(1, 0));

            Assert.That(result.Accepted, Is.False);
            Assert.That(result.Failure, Is.EqualTo(SwapFailure.NoMatch));
            Assert.That(result.WasRolledBack, Is.True);
            CollectionAssert.AreEqual(before, board.Snapshot());
        }

        [Test]
        public void ExistingHorizontalAndVerticalMatches_AreBothResolved()
        {
            var horizontalLayout = TestBoardFactory.LatinLayout();
            horizontalLayout[TestBoardFactory.Index(0, 0)] = new BoardTile(TileElement.Fire);
            horizontalLayout[TestBoardFactory.Index(1, 0)] = new BoardTile(TileElement.Fire);
            horizontalLayout[TestBoardFactory.Index(2, 0)] = new BoardTile(TileElement.Fire);
            var horizontal = TestBoardFactory.CreateLoaded(horizontalLayout);

            var horizontalResolution = horizontal.ResolveExistingMatches();

            Assert.That(horizontalResolution.ClearedTileCount, Is.GreaterThanOrEqualTo(3));
            Assert.That(horizontal.HasImmediateMatch(), Is.False);

            var verticalLayout = TestBoardFactory.LatinLayout();
            verticalLayout[TestBoardFactory.Index(0, 0)] = new BoardTile(TileElement.Water);
            verticalLayout[TestBoardFactory.Index(0, 1)] = new BoardTile(TileElement.Water);
            verticalLayout[TestBoardFactory.Index(0, 2)] = new BoardTile(TileElement.Water);
            var vertical = TestBoardFactory.CreateLoaded(verticalLayout);

            var verticalResolution = vertical.ResolveExistingMatches();

            Assert.That(verticalResolution.ClearedTileCount, Is.GreaterThanOrEqualTo(3));
            Assert.That(vertical.HasImmediateMatch(), Is.False);
        }

        [Test]
        public void RefillThatMakesAnotherMatch_ReportsCascade()
        {
            var random = new ScriptedRandomSource();
            var board = new Match3Board(TestBoardFactory.Configuration(), random);
            var layout = TestBoardFactory.LatinLayout();
            layout[TestBoardFactory.Index(0, 0)] = new BoardTile(TileElement.Fire);
            layout[TestBoardFactory.Index(1, 0)] = new BoardTile(TileElement.Fire);
            layout[TestBoardFactory.Index(2, 0)] = new BoardTile(TileElement.Fire);
            board.LoadBoard(layout);
            random.Reset(1, 1, 1, 2, 3, 4);

            var resolution = board.ResolveExistingMatches();

            Assert.That(resolution.CascadeCount, Is.GreaterThanOrEqualTo(1));
            Assert.That(resolution.ClearedTileCount, Is.GreaterThanOrEqualTo(6));
            Assert.That(board.HasImmediateMatch(), Is.False);
        }

        [Test]
        public void FourMatch_CreatesSpecialTile()
        {
            var random = new ScriptedRandomSource();
            var board = new Match3Board(TestBoardFactory.Configuration(), random);
            var layout = TestBoardFactory.LatinLayout();
            for (var x = 0; x < 4; x++)
            {
                layout[TestBoardFactory.Index(x, 0)] = new BoardTile(TileElement.Fire);
            }

            board.LoadBoard(layout);
            random.Reset(1, 2, 3, 4, 0, 1);

            var resolution = board.ResolveExistingMatches();

            Assert.That(resolution.SpecialsCreated, Is.GreaterThanOrEqualTo(1));
            Assert.That(Array.Exists(board.Snapshot(), tile => tile.Special != TileSpecial.None), Is.True);
        }

        [Test]
        public void SwappedLineSpecial_ActivatesWithoutOrdinaryMatch()
        {
            var layout = TestBoardFactory.LatinLayout();
            layout[TestBoardFactory.Index(0, 0)] = new BoardTile(TileElement.Fire, TileSpecial.RowClear);
            var board = TestBoardFactory.CreateLoaded(layout);

            var result = board.TrySwap(new BoardCoordinate(0, 0), new BoardCoordinate(1, 0));

            Assert.That(result.Accepted, Is.True);
            Assert.That(result.Resolution.ClearedTileCount, Is.GreaterThanOrEqualTo(board.Columns));
        }

        [Test]
        public void DeadBoard_IsDetectedAndReshuffledToPlayableState()
        {
            var configuration = new BoardConfiguration { Columns = 3, Rows = 3, ElementCount = 3, Seed = 91 };
            var board = new Match3Board(configuration);
            board.LoadBoard(new[]
            {
                new BoardTile(TileElement.Fire), new BoardTile(TileElement.Fire), new BoardTile(TileElement.Water),
                new BoardTile(TileElement.Fire), new BoardTile(TileElement.Fire), new BoardTile(TileElement.Water),
                new BoardTile(TileElement.Water), new BoardTile(TileElement.Nature), new BoardTile(TileElement.Nature)
            });

            Assert.That(board.HasImmediateMatch(), Is.False);
            Assert.That(board.HasAvailableMove(), Is.False);
            Assert.That(board.ReshuffleIfDead(), Is.True);
            Assert.That(board.HasImmediateMatch(), Is.False);
            Assert.That(board.HasAvailableMove(), Is.True);
        }
    }

    internal static class TestBoardFactory
    {
        public const int Size = 5;

        public static BoardConfiguration Configuration()
        {
            return new BoardConfiguration { Columns = Size, Rows = Size, ElementCount = 5, Seed = 177 };
        }

        public static Match3Board CreateLoaded(IReadOnlyList<BoardTile> tiles)
        {
            var board = new Match3Board(Configuration());
            board.LoadBoard(tiles);
            return board;
        }

        public static BoardTile[] LatinLayout()
        {
            var tiles = new BoardTile[Size * Size];
            for (var y = 0; y < Size; y++)
            {
                for (var x = 0; x < Size; x++)
                {
                    tiles[Index(x, y)] = new BoardTile((TileElement)((x + y) % 5));
                }
            }

            return tiles;
        }

        public static BoardTile[] ValidSwapLayout()
        {
            var tiles = LatinLayout();
            tiles[Index(0, 0)] = new BoardTile(TileElement.Fire);
            tiles[Index(1, 0)] = new BoardTile(TileElement.Water);
            tiles[Index(2, 0)] = new BoardTile(TileElement.Fire);
            tiles[Index(1, 1)] = new BoardTile(TileElement.Fire);
            return tiles;
        }

        public static int Index(int x, int y)
        {
            return y * Size + x;
        }
    }

    internal sealed class ScriptedRandomSource : IBoardRandomSource
    {
        private readonly Queue<int> _script = new Queue<int>();
        private int _fallback;

        public void Reset(params int[] values)
        {
            _script.Clear();
            for (var index = 0; index < values.Length; index++)
            {
                _script.Enqueue(values[index]);
            }
        }

        public int Next(int minimumInclusive, int maximumExclusive)
        {
            var range = maximumExclusive - minimumInclusive;
            var raw = _script.Count > 0 ? _script.Dequeue() : _fallback++;
            return minimumInclusive + Math.Abs(raw % range);
        }
    }
}
