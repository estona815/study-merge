using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ilarune.Core;
using Ilarune.Shared;
using NUnit.Framework;
using UnityEngine;

namespace Ilarune.Battle.Tests
{
    public sealed class CoreServiceTests
    {
        [Test]
        public async Task SaveLoadRoundTrip_PreservesMutatedSnapshot()
        {
            var store = new MemorySnapshotStore();
            var firstSession = new GameSessionService(new MockBackendAdapter(store));
            await firstSession.InitializeAsync();
            firstSession.Mutate(snapshot =>
            {
                snapshot.playerName = "Lune";
                snapshot.softCurrency = 7777;
            });
            await firstSession.SaveAsync();

            var restoredSession = new GameSessionService(new MockBackendAdapter(store));
            await restoredSession.InitializeAsync();

            Assert.That(restoredSession.Snapshot.playerName, Is.EqualTo("Lune"));
            Assert.That(restoredSession.Snapshot.softCurrency, Is.EqualTo(7777));
        }

        [Test]
        public void SceneNavigator_OpenAndBack_UsesValidatedHistory()
        {
            var current = SceneIds.Main;
            var loaded = new List<string>();
            var available = new HashSet<string>
            {
                SceneIds.Main,
                SceneIds.BattleStage
            };
            var navigator = new UnitySceneNavigator(
                () => current,
                available.Contains,
                scene =>
                {
                    current = scene;
                    loaded.Add(scene);
                });

            navigator.Open(SceneIds.BattleStage);
            navigator.Back();

            CollectionAssert.AreEqual(new[] { SceneIds.BattleStage, SceneIds.Main }, loaded);
            Assert.That(navigator.CurrentSceneId, Is.EqualTo(SceneIds.Main));
        }

        [Test]
        public async Task MissingLocalAsset_FailsExplicitlyInsteadOfReturningNull()
        {
            var provider = new LocalResourcesAssetProvider();
            InvalidOperationException exception = null;

            try
            {
                await provider.LoadAsync<TextAsset>("__tests__/missing-addressable-boundary");
            }
            catch (InvalidOperationException caught)
            {
                exception = caught;
            }

            Assert.That(exception, Is.Not.Null);
            Assert.That(exception.Message, Does.Contain("was not found"));
        }

        [Test]
        public async Task BuildingProductionCollectAndUpgrade_MutateSharedSession()
        {
            const long now = 1_800_000_000L;
            var store = new MemorySnapshotStore();
            var session = new GameSessionService(new MockBackendAdapter(store));
            await session.InitializeAsync();
            session.Mutate(snapshot =>
            {
                snapshot.softCurrency = 5000;
                snapshot.buildings.Find(building => building.id == "aether_mine")
                    .productionStartedUnixSeconds = now - 120L;
            });
            var rewards = new RewardService(session);
            var buildings = new BuildingService(
                session,
                rewards,
                new FixedClock(DateTimeOffset.FromUnixTimeSeconds(now)),
                GameContentConfig.CreateLocalDemo().buildings);

            var status = buildings.GetStatus("aether_mine");
            var balanceBefore = session.Snapshot.softCurrency;
            var collected = buildings.Collect("aether_mine");
            var upgraded = buildings.TryUpgrade("aether_mine", out var failureReason);

            Assert.That(status.storedAmount, Is.GreaterThan(0));
            Assert.That(collected, Is.EqualTo(status.storedAmount));
            Assert.That(upgraded, Is.True, failureReason);
            Assert.That(session.Snapshot.buildings.Find(building => building.id == "aether_mine").level, Is.EqualTo(2));
            Assert.That(session.Snapshot.softCurrency, Is.EqualTo(balanceBefore + collected - status.nextUpgradeCost));
        }

        private sealed class MemorySnapshotStore : ILocalSnapshotStore
        {
            private GameSnapshot snapshot;

            public bool TryLoad(out GameSnapshot value)
            {
                value = SnapshotUtility.Clone(snapshot);
                return value != null;
            }

            public void Save(GameSnapshot value)
            {
                snapshot = SnapshotUtility.Clone(value);
            }

            public void Delete()
            {
                snapshot = null;
            }
        }

        private sealed class FixedClock : IClock
        {
            public FixedClock(DateTimeOffset utcNow)
            {
                UtcNow = utcNow;
            }

            public DateTimeOffset UtcNow { get; }
        }
    }
}
