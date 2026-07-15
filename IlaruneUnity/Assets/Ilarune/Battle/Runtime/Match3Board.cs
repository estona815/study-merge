using System;
using System.Collections.Generic;

namespace Ilarune.Battle
{
    public interface IBoardRandomSource
    {
        int Next(int minimumInclusive, int maximumExclusive);
    }

    public sealed class SeededBoardRandomSource : IBoardRandomSource
    {
        private readonly Random _random;

        public SeededBoardRandomSource(int seed)
        {
            _random = new Random(seed);
        }

        public int Next(int minimumInclusive, int maximumExclusive)
        {
            return _random.Next(minimumInclusive, maximumExclusive);
        }
    }

    public sealed class Match3Board
    {
        private const int MaximumResolutionSteps = 64;

        private readonly BoardConfiguration _configuration;
        private readonly IBoardRandomSource _random;
        private readonly BoardTile?[] _tiles;

        public int Columns => _configuration.Columns;
        public int Rows => _configuration.Rows;
        public int Version { get; private set; }

        public Match3Board(BoardConfiguration configuration)
            : this(configuration, new SeededBoardRandomSource(configuration == null ? 0 : configuration.Seed))
        {
        }

        public Match3Board(BoardConfiguration configuration, IBoardRandomSource random)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }

            configuration.Validate();
            _configuration = configuration;
            _random = random ?? throw new ArgumentNullException(nameof(random));
            _tiles = new BoardTile?[Columns * Rows];
            GenerateInitialBoard();
        }

        public BoardTile GetTile(int x, int y)
        {
            ValidateCoordinate(new BoardCoordinate(x, y));
            var tile = _tiles[IndexOf(x, y)];
            if (!tile.HasValue)
            {
                throw new InvalidOperationException("The board is resolving and this cell is empty.");
            }

            return tile.Value;
        }

        public BoardTile[] Snapshot()
        {
            var snapshot = new BoardTile[_tiles.Length];
            for (var index = 0; index < _tiles.Length; index++)
            {
                if (!_tiles[index].HasValue)
                {
                    throw new InvalidOperationException("Cannot snapshot an unresolved board.");
                }

                snapshot[index] = _tiles[index].Value;
            }

            return snapshot;
        }

        public void LoadBoard(IReadOnlyList<BoardTile> tiles)
        {
            if (tiles == null)
            {
                throw new ArgumentNullException(nameof(tiles));
            }

            if (tiles.Count != _tiles.Length)
            {
                throw new ArgumentException("Expected exactly " + _tiles.Length + " tiles in row-major order.", nameof(tiles));
            }

            for (var index = 0; index < tiles.Count; index++)
            {
                if ((int)tiles[index].Element >= _configuration.ElementCount)
                {
                    throw new ArgumentException("The layout contains an element disabled by the board configuration.", nameof(tiles));
                }

                _tiles[index] = tiles[index];
            }

            Version++;
        }

        public void GenerateInitialBoard()
        {
            for (var attempt = 0; attempt < 512; attempt++)
            {
                FillWithoutImmediateMatches();
                if (HasAvailableMove() || TryInjectGuaranteedMove())
                {
                    Version++;
                    return;
                }
            }

            throw new InvalidOperationException("Unable to generate a playable board with the supplied random source.");
        }

        public bool HasImmediateMatch()
        {
            return FindMatchGroups().Count > 0;
        }

        public bool HasAvailableMove()
        {
            return TryFindAvailableMove(out _, out _);
        }

        public bool TryFindAvailableMove(out BoardCoordinate first, out BoardCoordinate second)
        {
            for (var y = 0; y < Rows; y++)
            {
                for (var x = 0; x < Columns; x++)
                {
                    var here = new BoardCoordinate(x, y);
                    if (x + 1 < Columns && SwapWouldResolve(here, new BoardCoordinate(x + 1, y)))
                    {
                        first = here;
                        second = new BoardCoordinate(x + 1, y);
                        return true;
                    }

                    if (y + 1 < Rows && SwapWouldResolve(here, new BoardCoordinate(x, y + 1)))
                    {
                        first = here;
                        second = new BoardCoordinate(x, y + 1);
                        return true;
                    }
                }
            }

            first = new BoardCoordinate();
            second = new BoardCoordinate();
            return false;
        }

        public bool ReshuffleIfDead()
        {
            if (HasAvailableMove())
            {
                return false;
            }

            var candidates = Snapshot();
            for (var attempt = 0; attempt < 256; attempt++)
            {
                Shuffle(candidates);
                Assign(candidates);
                if (!HasImmediateMatch() && HasAvailableMove())
                {
                    Version++;
                    return true;
                }
            }

            GenerateInitialBoard();
            return true;
        }

        public BoardMoveResult TrySwap(BoardCoordinate first, BoardCoordinate second)
        {
            if (!IsInside(first) || !IsInside(second))
            {
                return Rejected(SwapFailure.OutOfBounds, false);
            }

            if (!first.IsAdjacentTo(second))
            {
                return Rejected(SwapFailure.NotAdjacent, false);
            }

            var firstTile = GetTile(first.X, first.Y);
            var secondTile = GetTile(second.X, second.Y);
            Swap(first, second);

            var groups = FindMatchGroups();
            var forcedClear = BuildSwapSpecialClear(first, second, firstTile, secondTile);
            if (groups.Count == 0 && forcedClear.Count == 0)
            {
                Swap(first, second);
                return Rejected(SwapFailure.NoMatch, true);
            }

            var resolution = ResolveUntilStable(groups, forcedClear, first, second);
            resolution.WasReshuffled = ReshuffleIfDead();
            Version++;

            return new BoardMoveResult
            {
                Accepted = true,
                Failure = SwapFailure.None,
                Resolution = resolution
            };
        }

        public BoardResolution ResolveExistingMatches()
        {
            var groups = FindMatchGroups();
            var resolution = groups.Count == 0
                ? new BoardResolution()
                : ResolveUntilStable(groups, new HashSet<BoardCoordinate>(), null, null);
            resolution.WasReshuffled = ReshuffleIfDead();
            Version++;
            return resolution;
        }

        private BoardResolution ResolveUntilStable(
            List<MatchGroup> groups,
            HashSet<BoardCoordinate> forcedClear,
            BoardCoordinate? preferredFirst,
            BoardCoordinate? preferredSecond)
        {
            var resolution = new BoardResolution();
            var step = 0;

            while (groups.Count > 0 || forcedClear.Count > 0)
            {
                step++;
                if (step > MaximumResolutionSteps)
                {
                    throw new InvalidOperationException("Board resolution exceeded the cascade safety limit.");
                }

                resolution.MatchSteps++;
                ResolveSingleStep(groups, forcedClear, preferredFirst, preferredSecond, resolution);
                CollapseAndRefill();
                forcedClear = new HashSet<BoardCoordinate>();
                groups = FindMatchGroups();
                preferredFirst = null;
                preferredSecond = null;
            }

            return resolution;
        }

        private void ResolveSingleStep(
            List<MatchGroup> groups,
            HashSet<BoardCoordinate> forcedClear,
            BoardCoordinate? preferredFirst,
            BoardCoordinate? preferredSecond,
            BoardResolution resolution)
        {
            var clear = new HashSet<BoardCoordinate>(forcedClear);
            var groupMembership = new Dictionary<BoardCoordinate, int>();

            for (var groupIndex = 0; groupIndex < groups.Count; groupIndex++)
            {
                var group = groups[groupIndex];
                for (var cellIndex = 0; cellIndex < group.Cells.Count; cellIndex++)
                {
                    var coordinate = group.Cells[cellIndex];
                    clear.Add(coordinate);
                    if (!groupMembership.ContainsKey(coordinate))
                    {
                        groupMembership[coordinate] = 0;
                    }

                    groupMembership[coordinate]++;
                }
            }

            var spawns = new Dictionary<BoardCoordinate, TileSpecial>();
            for (var groupIndex = 0; groupIndex < groups.Count; groupIndex++)
            {
                var group = groups[groupIndex];
                if (group.Cells.Count < 4)
                {
                    continue;
                }

                var spawnAt = SelectSpawnCoordinate(group, preferredFirst, preferredSecond);
                var special = group.Cells.Count >= 5
                    ? TileSpecial.Prismatic
                    : group.Horizontal ? TileSpecial.RowClear : TileSpecial.ColumnClear;
                AddSpawn(spawns, spawnAt, special);
            }

            foreach (var membership in groupMembership)
            {
                if (membership.Value > 1)
                {
                    AddSpawn(spawns, membership.Key, TileSpecial.Burst);
                }
            }

            ExpandTriggeredSpecials(clear);

            var spawnElements = new Dictionary<BoardCoordinate, TileElement>();
            foreach (var spawn in spawns)
            {
                var tile = _tiles[IndexOf(spawn.Key.X, spawn.Key.Y)];
                if (tile.HasValue)
                {
                    spawnElements[spawn.Key] = tile.Value.Element;
                }

                clear.Remove(spawn.Key);
            }

            foreach (var coordinate in clear)
            {
                var index = IndexOf(coordinate.X, coordinate.Y);
                if (!_tiles[index].HasValue)
                {
                    continue;
                }

                resolution.AddCleared(_tiles[index].Value.Element);
                _tiles[index] = null;
            }

            foreach (var spawn in spawns)
            {
                if (spawnElements.TryGetValue(spawn.Key, out var element))
                {
                    _tiles[IndexOf(spawn.Key.X, spawn.Key.Y)] = new BoardTile(element, spawn.Value);
                    resolution.SpecialsCreated++;
                }
            }
        }

        private void ExpandTriggeredSpecials(HashSet<BoardCoordinate> clear)
        {
            var queue = new Queue<BoardCoordinate>(clear);
            var expanded = new HashSet<BoardCoordinate>();

            while (queue.Count > 0)
            {
                var coordinate = queue.Dequeue();
                if (!expanded.Add(coordinate))
                {
                    continue;
                }

                var tile = _tiles[IndexOf(coordinate.X, coordinate.Y)];
                if (!tile.HasValue || tile.Value.Special == TileSpecial.None)
                {
                    continue;
                }

                var footprint = new HashSet<BoardCoordinate>();
                AddSpecialFootprint(coordinate, tile.Value, null, footprint);
                foreach (var affected in footprint)
                {
                    if (clear.Add(affected))
                    {
                        queue.Enqueue(affected);
                    }
                }
            }
        }

        private HashSet<BoardCoordinate> BuildSwapSpecialClear(
            BoardCoordinate first,
            BoardCoordinate second,
            BoardTile originalFirst,
            BoardTile originalSecond)
        {
            var clear = new HashSet<BoardCoordinate>();
            if (originalFirst.Special != TileSpecial.None)
            {
                AddSpecialFootprint(second, originalFirst, originalSecond, clear);
            }

            if (originalSecond.Special != TileSpecial.None)
            {
                AddSpecialFootprint(first, originalSecond, originalFirst, clear);
            }

            return clear;
        }

        private void AddSpecialFootprint(
            BoardCoordinate origin,
            BoardTile tile,
            BoardTile? swappedWith,
            HashSet<BoardCoordinate> footprint)
        {
            footprint.Add(origin);
            switch (tile.Special)
            {
                case TileSpecial.RowClear:
                    for (var x = 0; x < Columns; x++)
                    {
                        footprint.Add(new BoardCoordinate(x, origin.Y));
                    }
                    break;
                case TileSpecial.ColumnClear:
                    for (var y = 0; y < Rows; y++)
                    {
                        footprint.Add(new BoardCoordinate(origin.X, y));
                    }
                    break;
                case TileSpecial.Burst:
                    for (var x = Math.Max(0, origin.X - 1); x <= Math.Min(Columns - 1, origin.X + 1); x++)
                    {
                        for (var y = Math.Max(0, origin.Y - 1); y <= Math.Min(Rows - 1, origin.Y + 1); y++)
                        {
                            footprint.Add(new BoardCoordinate(x, y));
                        }
                    }
                    break;
                case TileSpecial.Prismatic:
                    if (swappedWith.HasValue && swappedWith.Value.Special == TileSpecial.Prismatic)
                    {
                        AddEveryCoordinate(footprint);
                    }
                    else
                    {
                        var targetElement = swappedWith.HasValue ? swappedWith.Value.Element : tile.Element;
                        for (var y = 0; y < Rows; y++)
                        {
                            for (var x = 0; x < Columns; x++)
                            {
                                var candidate = _tiles[IndexOf(x, y)];
                                if (candidate.HasValue && candidate.Value.Element == targetElement)
                                {
                                    footprint.Add(new BoardCoordinate(x, y));
                                }
                            }
                        }
                    }
                    break;
            }
        }

        private void AddEveryCoordinate(HashSet<BoardCoordinate> coordinates)
        {
            for (var y = 0; y < Rows; y++)
            {
                for (var x = 0; x < Columns; x++)
                {
                    coordinates.Add(new BoardCoordinate(x, y));
                }
            }
        }

        private void CollapseAndRefill()
        {
            for (var x = 0; x < Columns; x++)
            {
                var writeY = 0;
                for (var readY = 0; readY < Rows; readY++)
                {
                    var readIndex = IndexOf(x, readY);
                    if (!_tiles[readIndex].HasValue)
                    {
                        continue;
                    }

                    if (readY != writeY)
                    {
                        _tiles[IndexOf(x, writeY)] = _tiles[readIndex];
                        _tiles[readIndex] = null;
                    }

                    writeY++;
                }

                for (var y = writeY; y < Rows; y++)
                {
                    _tiles[IndexOf(x, y)] = new BoardTile(NextElement());
                }
            }
        }

        private void FillWithoutImmediateMatches()
        {
            Array.Clear(_tiles, 0, _tiles.Length);
            for (var y = 0; y < Rows; y++)
            {
                for (var x = 0; x < Columns; x++)
                {
                    var start = NextElementIndex();
                    for (var offset = 0; offset < _configuration.ElementCount; offset++)
                    {
                        var element = (TileElement)((start + offset) % _configuration.ElementCount);
                        if (!WouldCreateImmediateMatch(x, y, element))
                        {
                            _tiles[IndexOf(x, y)] = new BoardTile(element);
                            break;
                        }
                    }

                    if (!_tiles[IndexOf(x, y)].HasValue)
                    {
                        throw new InvalidOperationException("Unable to fill a match-free board cell.");
                    }
                }
            }
        }

        private bool WouldCreateImmediateMatch(int x, int y, TileElement element)
        {
            if (x >= 2)
            {
                var left = _tiles[IndexOf(x - 1, y)];
                var farLeft = _tiles[IndexOf(x - 2, y)];
                if (left.HasValue && farLeft.HasValue && left.Value.Element == element && farLeft.Value.Element == element)
                {
                    return true;
                }
            }

            if (y >= 2)
            {
                var below = _tiles[IndexOf(x, y - 1)];
                var farBelow = _tiles[IndexOf(x, y - 2)];
                if (below.HasValue && farBelow.HasValue && below.Value.Element == element && farBelow.Value.Element == element)
                {
                    return true;
                }
            }

            return false;
        }

        private bool TryInjectGuaranteedMove()
        {
            for (var y = 0; y + 1 < Rows; y++)
            {
                for (var x = 0; x + 2 < Columns; x++)
                {
                    var coordinates = new[]
                    {
                        new BoardCoordinate(x, y),
                        new BoardCoordinate(x + 1, y),
                        new BoardCoordinate(x + 2, y),
                        new BoardCoordinate(x + 1, y + 1)
                    };
                    var originals = new BoardTile[coordinates.Length];
                    for (var index = 0; index < coordinates.Length; index++)
                    {
                        originals[index] = GetTile(coordinates[index].X, coordinates[index].Y);
                    }

                    for (var elementIndex = 0; elementIndex < _configuration.ElementCount; elementIndex++)
                    {
                        for (var blockerIndex = 0; blockerIndex < _configuration.ElementCount; blockerIndex++)
                        {
                            if (elementIndex == blockerIndex)
                            {
                                continue;
                            }

                            var element = (TileElement)elementIndex;
                            _tiles[IndexOf(x, y)] = new BoardTile(element);
                            _tiles[IndexOf(x + 1, y)] = new BoardTile((TileElement)blockerIndex);
                            _tiles[IndexOf(x + 2, y)] = new BoardTile(element);
                            _tiles[IndexOf(x + 1, y + 1)] = new BoardTile(element);

                            if (!HasImmediateMatch())
                            {
                                return true;
                            }
                        }
                    }

                    for (var index = 0; index < coordinates.Length; index++)
                    {
                        _tiles[IndexOf(coordinates[index].X, coordinates[index].Y)] = originals[index];
                    }
                }
            }

            return false;
        }

        private bool SwapWouldResolve(BoardCoordinate first, BoardCoordinate second)
        {
            var firstTile = GetTile(first.X, first.Y);
            var secondTile = GetTile(second.X, second.Y);
            if (firstTile.Special != TileSpecial.None || secondTile.Special != TileSpecial.None)
            {
                return true;
            }

            Swap(first, second);
            var hasMatch = FindMatchGroups().Count > 0;
            Swap(first, second);
            return hasMatch;
        }

        private List<MatchGroup> FindMatchGroups()
        {
            var groups = new List<MatchGroup>();
            for (var y = 0; y < Rows; y++)
            {
                var startX = 0;
                while (startX < Columns)
                {
                    var tile = _tiles[IndexOf(startX, y)];
                    if (!tile.HasValue)
                    {
                        startX++;
                        continue;
                    }

                    var endX = startX + 1;
                    while (endX < Columns)
                    {
                        var candidate = _tiles[IndexOf(endX, y)];
                        if (!candidate.HasValue || candidate.Value.Element != tile.Value.Element)
                        {
                            break;
                        }

                        endX++;
                    }

                    if (endX - startX >= 3)
                    {
                        var group = new MatchGroup(true);
                        for (var x = startX; x < endX; x++)
                        {
                            group.Cells.Add(new BoardCoordinate(x, y));
                        }

                        groups.Add(group);
                    }

                    startX = endX;
                }
            }

            for (var x = 0; x < Columns; x++)
            {
                var startY = 0;
                while (startY < Rows)
                {
                    var tile = _tiles[IndexOf(x, startY)];
                    if (!tile.HasValue)
                    {
                        startY++;
                        continue;
                    }

                    var endY = startY + 1;
                    while (endY < Rows)
                    {
                        var candidate = _tiles[IndexOf(x, endY)];
                        if (!candidate.HasValue || candidate.Value.Element != tile.Value.Element)
                        {
                            break;
                        }

                        endY++;
                    }

                    if (endY - startY >= 3)
                    {
                        var group = new MatchGroup(false);
                        for (var y = startY; y < endY; y++)
                        {
                            group.Cells.Add(new BoardCoordinate(x, y));
                        }

                        groups.Add(group);
                    }

                    startY = endY;
                }
            }

            return groups;
        }

        private BoardCoordinate SelectSpawnCoordinate(
            MatchGroup group,
            BoardCoordinate? preferredFirst,
            BoardCoordinate? preferredSecond)
        {
            if (preferredSecond.HasValue && group.Cells.Contains(preferredSecond.Value))
            {
                return preferredSecond.Value;
            }

            if (preferredFirst.HasValue && group.Cells.Contains(preferredFirst.Value))
            {
                return preferredFirst.Value;
            }

            return group.Cells[group.Cells.Count / 2];
        }

        private static void AddSpawn(
            IDictionary<BoardCoordinate, TileSpecial> spawns,
            BoardCoordinate coordinate,
            TileSpecial special)
        {
            if (!spawns.TryGetValue(coordinate, out var existing))
            {
                spawns[coordinate] = special;
                return;
            }

            if (existing == TileSpecial.Prismatic || special == TileSpecial.Prismatic)
            {
                spawns[coordinate] = TileSpecial.Prismatic;
            }
            else
            {
                spawns[coordinate] = TileSpecial.Burst;
            }
        }

        private void Shuffle(BoardTile[] tiles)
        {
            for (var index = tiles.Length - 1; index > 0; index--)
            {
                var swapWith = _random.Next(0, index + 1);
                if (swapWith < 0 || swapWith > index)
                {
                    throw new InvalidOperationException("The board random source returned an out-of-range value.");
                }

                var temporary = tiles[index];
                tiles[index] = tiles[swapWith];
                tiles[swapWith] = temporary;
            }
        }

        private void Assign(IReadOnlyList<BoardTile> tiles)
        {
            for (var index = 0; index < _tiles.Length; index++)
            {
                _tiles[index] = tiles[index];
            }
        }

        private void Swap(BoardCoordinate first, BoardCoordinate second)
        {
            var firstIndex = IndexOf(first.X, first.Y);
            var secondIndex = IndexOf(second.X, second.Y);
            var temporary = _tiles[firstIndex];
            _tiles[firstIndex] = _tiles[secondIndex];
            _tiles[secondIndex] = temporary;
        }

        private BoardMoveResult Rejected(SwapFailure failure, bool rolledBack)
        {
            return new BoardMoveResult
            {
                Accepted = false,
                WasRolledBack = rolledBack,
                Failure = failure,
                Resolution = new BoardResolution()
            };
        }

        private TileElement NextElement()
        {
            return (TileElement)NextElementIndex();
        }

        private int NextElementIndex()
        {
            var value = _random.Next(0, _configuration.ElementCount);
            if (value < 0 || value >= _configuration.ElementCount)
            {
                throw new InvalidOperationException("The board random source returned an out-of-range value.");
            }

            return value;
        }

        private int IndexOf(int x, int y)
        {
            return y * Columns + x;
        }

        private bool IsInside(BoardCoordinate coordinate)
        {
            return coordinate.X >= 0 && coordinate.X < Columns && coordinate.Y >= 0 && coordinate.Y < Rows;
        }

        private void ValidateCoordinate(BoardCoordinate coordinate)
        {
            if (!IsInside(coordinate))
            {
                throw new ArgumentOutOfRangeException(nameof(coordinate), coordinate, "Coordinate is outside the board.");
            }
        }

        private sealed class MatchGroup
        {
            public readonly bool Horizontal;
            public readonly List<BoardCoordinate> Cells = new List<BoardCoordinate>();

            public MatchGroup(bool horizontal)
            {
                Horizontal = horizontal;
            }
        }
    }
}
