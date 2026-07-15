using System;
using System.Collections.Generic;
using Ilarune.Shared;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Ilarune.Core
{
    public sealed class UnitySceneNavigator : ISceneNavigator
    {
        private readonly Stack<string> history = new Stack<string>();
        private readonly Func<string> currentScene;
        private readonly Func<string, bool> canLoadScene;
        private readonly Action<string> loadScene;
        private readonly string fallbackSceneId;

        public UnitySceneNavigator()
            : this(
                () => SceneManager.GetActiveScene().name,
                Application.CanStreamedLevelBeLoaded,
                sceneId => SceneManager.LoadSceneAsync(sceneId, LoadSceneMode.Single),
                SceneIds.Main)
        {
        }

        public UnitySceneNavigator(
            Func<string> currentScene,
            Func<string, bool> canLoadScene,
            Action<string> loadScene,
            string fallbackSceneId = SceneIds.Main)
        {
            this.currentScene = currentScene ?? throw new ArgumentNullException(nameof(currentScene));
            this.canLoadScene = canLoadScene ?? throw new ArgumentNullException(nameof(canLoadScene));
            this.loadScene = loadScene ?? throw new ArgumentNullException(nameof(loadScene));
            this.fallbackSceneId = fallbackSceneId;
        }

        public event Action<string> SceneOpenRequested;

        public string CurrentSceneId => currentScene() ?? string.Empty;

        public void Open(string sceneId)
        {
            TryOpen(sceneId, true);
        }

        public void Back()
        {
            while (history.Count > 0)
            {
                string previous = history.Pop();
                if (!string.Equals(previous, CurrentSceneId, StringComparison.Ordinal) &&
                    TryOpen(previous, false))
                {
                    return;
                }
            }

            if (!string.IsNullOrWhiteSpace(fallbackSceneId) &&
                !string.Equals(fallbackSceneId, CurrentSceneId, StringComparison.Ordinal))
            {
                TryOpen(fallbackSceneId, false);
            }
        }

        public bool TryOpen(string sceneId, bool recordHistory = true)
        {
            if (string.IsNullOrWhiteSpace(sceneId))
            {
                Debug.LogWarning("Ignoring a scene navigation request with an empty id.");
                return false;
            }

            if (string.Equals(sceneId, CurrentSceneId, StringComparison.Ordinal))
            {
                return true;
            }

            if (!canLoadScene(sceneId))
            {
                Debug.LogWarning($"Scene is not available in this build: {sceneId}");
                return false;
            }

            if (recordHistory && !string.IsNullOrWhiteSpace(CurrentSceneId))
            {
                history.Push(CurrentSceneId);
            }

            SceneOpenRequested?.Invoke(sceneId);
            loadScene(sceneId);
            return true;
        }
    }
}
