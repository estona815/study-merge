using System;
using System.Threading;
using System.Threading.Tasks;
using Ilarune.Shared;

namespace Ilarune.Core
{
    public sealed class MockBackendAdapter : IBackendAdapter
    {
        private readonly ILocalSnapshotStore store;
        private readonly Func<GameSnapshot> defaultSnapshotFactory;
        private readonly int simulatedLatencyMilliseconds;

        public MockBackendAdapter(
            ILocalSnapshotStore store,
            Func<GameSnapshot> defaultSnapshotFactory = null,
            int simulatedLatencyMilliseconds = 0)
        {
            this.store = store ?? throw new ArgumentNullException(nameof(store));
            this.defaultSnapshotFactory = defaultSnapshotFactory ?? SnapshotUtility.CreateLocalDemo;
            this.simulatedLatencyMilliseconds = Math.Max(0, simulatedLatencyMilliseconds);
        }

        public bool IsLocalDemo => true;

        public async Task<GameSnapshot> LoadSnapshotAsync(CancellationToken cancellationToken = default)
        {
            await DelayIfRequestedAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();

            if (!store.TryLoad(out GameSnapshot snapshot))
            {
                snapshot = SnapshotUtility.Normalize(defaultSnapshotFactory());
                store.Save(snapshot);
            }

            return SnapshotUtility.Clone(snapshot);
        }

        public async Task SaveSnapshotAsync(
            GameSnapshot snapshot,
            CancellationToken cancellationToken = default)
        {
            if (snapshot == null)
            {
                throw new ArgumentNullException(nameof(snapshot));
            }

            await DelayIfRequestedAsync(cancellationToken);
            cancellationToken.ThrowIfCancellationRequested();
            store.Save(SnapshotUtility.Clone(snapshot));
        }

        private Task DelayIfRequestedAsync(CancellationToken cancellationToken)
        {
            return simulatedLatencyMilliseconds > 0
                ? Task.Delay(simulatedLatencyMilliseconds, cancellationToken)
                : Task.CompletedTask;
        }
    }
}
