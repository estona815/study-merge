using System;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

namespace Ilarune.Core
{
    public interface IAssetProvider
    {
        bool IsLocalDemo { get; }
        Task<T> LoadAsync<T>(string key, CancellationToken cancellationToken = default)
            where T : UnityEngine.Object;
    }

    /// <summary>
    /// Offline-only content boundary for the clean-room demo. A production adapter may wrap
    /// Addressables, but no endpoint or catalog from the audited APK is copied into this project.
    /// </summary>
    public sealed class LocalResourcesAssetProvider : IAssetProvider
    {
        public bool IsLocalDemo => true;

        public async Task<T> LoadAsync<T>(
            string key,
            CancellationToken cancellationToken = default)
            where T : UnityEngine.Object
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentException("A local Resources key is required.", nameof(key));
            }

            cancellationToken.ThrowIfCancellationRequested();
            ResourceRequest request = Resources.LoadAsync<T>(key);
            while (!request.isDone)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Task.Yield();
            }

            cancellationToken.ThrowIfCancellationRequested();
            T asset = request.asset as T;
            if (asset == null)
            {
                throw new InvalidOperationException($"Local demo asset was not found: {key}");
            }

            return asset;
        }
    }
}
