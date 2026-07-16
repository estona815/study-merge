using System;
using Ilarune.Shared;
using UnityEngine;

namespace Ilarune.Core
{
    [DefaultExecutionOrder(-1000)]
    public sealed class CoreRuntimeBootstrap : MonoBehaviour
    {
        public static CoreRuntimeBootstrap Instance { get; private set; }

        public event Action Ready;

        public GameContentConfig Content { get; private set; }
        public IBackendAdapter Backend { get; private set; }
        public IAssetProvider Assets { get; private set; }
        public GameSessionService Session { get; private set; }
        public RewardService Rewards { get; private set; }
        public BuildingService Buildings { get; private set; }
        public ISceneNavigator Scenes { get; private set; }
        public IMobileQualityService Quality { get; private set; }
        public bool IsReady { get; private set; }
        public Exception InitializationError { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        private static void ResetStatics()
        {
            Instance = null;
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void EnsureRuntimeExists()
        {
            if (Instance != null || FindObjectOfType<CoreRuntimeBootstrap>() != null)
            {
                return;
            }

            GameObject runtimeObject = new GameObject("Ilarune Core Runtime");
            runtimeObject.AddComponent<CoreRuntimeBootstrap>();
        }

        private async void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);

            try
            {
                Content = GameContentConfig.CreateLocalDemo();
                Backend = new MockBackendAdapter(new PlayerPrefsJsonSnapshotStore());
                Assets = new LocalResourcesAssetProvider();
                Session = new GameSessionService(Backend);
                Rewards = new RewardService(Session);
                Buildings = new BuildingService(
                    Session,
                    Rewards,
                    new SystemClock(),
                    Content.buildings);
                Scenes = new UnitySceneNavigator();

                MobileQualityService quality = new MobileQualityService();
                Quality = quality;
                quality.ApplySavedOrRecommended();

                await Session.InitializeAsync();
                IsReady = true;
                Ready?.Invoke();
            }
            catch (Exception exception)
            {
                InitializationError = exception;
                Debug.LogException(exception, this);
            }
        }

        private void OnApplicationPause(bool paused)
        {
            if (paused && IsReady)
            {
                _ = Session.SaveAsync();
            }
        }

        private void OnApplicationQuit()
        {
            if (IsReady)
            {
                _ = Session.SaveAsync();
            }
        }
    }
}
