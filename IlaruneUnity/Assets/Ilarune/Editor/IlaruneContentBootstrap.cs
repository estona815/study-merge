using System;
using System.Linq;
using Ilarune.Battle;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Ilarune.Editor
{
    public static class IlaruneContentBootstrap
    {
        public const string MainScenePath = "Assets/Scenes/Main.unity";
        public const string BattleStageScenePath = "Assets/Scenes/Battle_Stage.unity";
        public const string BattlePvpScenePath = "Assets/Scenes/Battle_PvP.unity";
        public const string BattleClanBossScenePath = "Assets/Scenes/Battle_ClanBoss.unity";

        private const string HubBootstrapTypeName = "Ilarune.Hub.HubBootstrap";

        [MenuItem("Ilarune/Bootstrap Project & Demo Content")]
        public static void BootstrapProject()
        {
            GenerateAllScenesAndBuildSettings();
        }

        public static void BootstrapDemoContent()
        {
            GenerateAllScenesAndBuildSettings();
        }

        private static void GenerateAllScenesAndBuildSettings()
        {
            EnsureScenesFolder();
            GenerateMainScene();
            GenerateBattleScene(BattleStageScenePath, "Stage Battle Bootstrap");
            GenerateBattleScene(BattlePvpScenePath, "PvP Battle Bootstrap");
            GenerateBattleScene(BattleClanBossScenePath, "Clan Boss Battle Bootstrap");

            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene(MainScenePath, true),
                new EditorBuildSettingsScene(BattleStageScenePath, true),
                new EditorBuildSettingsScene(BattlePvpScenePath, true),
                new EditorBuildSettingsScene(BattleClanBossScenePath, true)
            };

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("Ilarune demo content bootstrapped: Main plus three battle scenes and deterministic build settings.");
        }

        private static void GenerateMainScene()
        {
            var hubType = ResolveHubBootstrapType();
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            AddDefaultCamera("Hub Camera");
            var root = new GameObject("Ilarune Hub");
            root.AddComponent(hubType);
            SaveSceneOrThrow(scene, MainScenePath);
        }

        private static void GenerateBattleScene(string path, string rootName)
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            AddDefaultCamera("Battle Camera");
            var root = new GameObject(rootName);
            root.AddComponent<BattleBootstrap>();
            SaveSceneOrThrow(scene, path);
        }

        private static Type ResolveHubBootstrapType()
        {
            var exact = TypeCache.GetTypesDerivedFrom<MonoBehaviour>()
                .FirstOrDefault(type => string.Equals(type.FullName, HubBootstrapTypeName, StringComparison.Ordinal));
            if (exact == null)
            {
                throw new InvalidOperationException(
                    "Required runtime type " + HubBootstrapTypeName
                    + " was not compiled. Fix Hub/runtime compile errors before bootstrapping scenes.");
            }

            return exact;
        }

        private static void AddDefaultCamera(string name)
        {
            var cameraObject = new GameObject(name, typeof(Camera), typeof(AudioListener));
            cameraObject.tag = "MainCamera";
            var camera = cameraObject.GetComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color32(5, 8, 24, 255);
            camera.orthographic = true;
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
        }

        private static void SaveSceneOrThrow(Scene scene, string path)
        {
            if (!EditorSceneManager.SaveScene(scene, path))
            {
                throw new InvalidOperationException("Unity could not save generated scene: " + path);
            }
        }

        private static void EnsureScenesFolder()
        {
            if (!AssetDatabase.IsValidFolder("Assets/Scenes"))
            {
                AssetDatabase.CreateFolder("Assets", "Scenes");
            }
        }
    }
}
