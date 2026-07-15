using System;
using Ilarune.Shared;
using UnityEngine;

namespace Ilarune.Core
{
    public interface ILocalSnapshotStore
    {
        bool TryLoad(out GameSnapshot snapshot);
        void Save(GameSnapshot snapshot);
        void Delete();
    }

    public sealed class PlayerPrefsJsonSnapshotStore : ILocalSnapshotStore
    {
        public const string DefaultKey = "ilarune.local-demo.snapshot.v1";

        private readonly string key;

        public PlayerPrefsJsonSnapshotStore(string key = DefaultKey)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                throw new ArgumentException("A non-empty PlayerPrefs key is required.", nameof(key));
            }

            this.key = key;
        }

        public bool TryLoad(out GameSnapshot snapshot)
        {
            snapshot = null;
            if (!PlayerPrefs.HasKey(key))
            {
                return false;
            }

            string json = PlayerPrefs.GetString(key, string.Empty);
            if (string.IsNullOrWhiteSpace(json))
            {
                return false;
            }

            try
            {
                GameSnapshot parsed = JsonUtility.FromJson<GameSnapshot>(json);
                if (parsed == null || parsed.schemaVersion <= 0)
                {
                    return false;
                }

                snapshot = SnapshotUtility.Normalize(parsed);
                return true;
            }
            catch (Exception exception)
            {
                Debug.LogWarning($"Ignoring an invalid local snapshot: {exception.Message}");
                return false;
            }
        }

        public void Save(GameSnapshot snapshot)
        {
            if (snapshot == null)
            {
                throw new ArgumentNullException(nameof(snapshot));
            }

            GameSnapshot safeSnapshot = SnapshotUtility.Normalize(SnapshotUtility.Clone(snapshot));
            PlayerPrefs.SetString(key, JsonUtility.ToJson(safeSnapshot));
            PlayerPrefs.Save();
        }

        public void Delete()
        {
            PlayerPrefs.DeleteKey(key);
            PlayerPrefs.Save();
        }
    }
}
