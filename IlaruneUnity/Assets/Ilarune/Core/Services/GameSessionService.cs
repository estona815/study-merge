using System;
using System.Threading;
using System.Threading.Tasks;
using Ilarune.Shared;

namespace Ilarune.Core
{
    public sealed class GameSessionService
    {
        private readonly IBackendAdapter backend;
        private GameSnapshot snapshot;

        public GameSessionService(IBackendAdapter backend)
        {
            this.backend = backend ?? throw new ArgumentNullException(nameof(backend));
        }

        public event Action<GameSnapshot> SnapshotChanged;

        public bool IsInitialized { get; private set; }
        public bool IsLocalDemo => backend.IsLocalDemo;

        public GameSnapshot Snapshot
        {
            get
            {
                EnsureInitialized();
                return snapshot;
            }
        }

        public async Task<GameSnapshot> InitializeAsync(CancellationToken cancellationToken = default)
        {
            if (IsInitialized)
            {
                return snapshot;
            }

            snapshot = SnapshotUtility.Normalize(
                await backend.LoadSnapshotAsync(cancellationToken));
            IsInitialized = true;
            SnapshotChanged?.Invoke(snapshot);
            return snapshot;
        }

        public void Mutate(Action<GameSnapshot> mutation)
        {
            if (mutation == null)
            {
                throw new ArgumentNullException(nameof(mutation));
            }

            EnsureInitialized();
            mutation(snapshot);
            SnapshotUtility.Normalize(snapshot);
            SnapshotChanged?.Invoke(snapshot);
        }

        public async Task SaveAsync(CancellationToken cancellationToken = default)
        {
            EnsureInitialized();
            await backend.SaveSnapshotAsync(snapshot, cancellationToken);
        }

        private void EnsureInitialized()
        {
            if (!IsInitialized || snapshot == null)
            {
                throw new InvalidOperationException("The game session has not been initialized.");
            }
        }
    }
}
