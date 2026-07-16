using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace Ilarune.Editor
{
    public static class IlaruneBuildAutomation
    {
        private const string DefaultApplicationId = "com.ilarune.demo";

        [MenuItem("Ilarune/Build/Android Development APK")]
        public static void BuildAndroidDevelopment()
        {
            if (!BuildPipeline.IsBuildTargetSupported(BuildTargetGroup.Android, BuildTarget.Android))
            {
                throw new BuildFailedException(
                    "Android Build Support is not installed for this Unity Editor. Install Android SDK/NDK/OpenJDK modules first.");
            }

            IlaruneContentBootstrap.BootstrapDemoContent();
            if (!EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android))
            {
                throw new BuildFailedException("Unity failed to switch the active build target to Android.");
            }

            ConfigureAndroidPlayer();
            var outputPath = ResolveOutputPath();
            var outputDirectory = Path.GetDirectoryName(outputPath);
            if (string.IsNullOrEmpty(outputDirectory))
            {
                throw new BuildFailedException("Unable to determine the Android build output directory.");
            }

            Directory.CreateDirectory(outputDirectory);
            var scenes = EditorBuildSettings.scenes
                .Where(scene => scene.enabled)
                .Select(scene => scene.path)
                .ToArray();
            if (scenes.Length == 0 || scenes.Any(path => !File.Exists(path)))
            {
                throw new BuildFailedException("Build settings contain no usable generated scenes. Run Bootstrap Project first.");
            }

            var options = BuildOptions.Development;
            if (Environment.GetEnvironmentVariable("ILARUNE_ALLOW_SCRIPT_DEBUGGING") == "1")
            {
                options |= BuildOptions.AllowDebugging;
            }

            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = outputPath,
                target = BuildTarget.Android,
                targetGroup = BuildTargetGroup.Android,
                options = options
            });

            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new BuildFailedException(
                    "Android build failed with " + report.summary.totalErrors + " errors. Result: " + report.summary.result);
            }

            Debug.Log("Ilarune Android development APK built: " + outputPath);
        }

        private static void ConfigureAndroidPlayer()
        {
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.allowedAutorotateToPortrait = true;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = false;
            PlayerSettings.allowedAutorotateToLandscapeRight = false;
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.IL2CPP);
            PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARMv7 | AndroidArchitecture.ARM64;
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel26;
            PlayerSettings.SetApplicationIdentifier(
                BuildTargetGroup.Android,
                Environment.GetEnvironmentVariable("ILARUNE_APPLICATION_ID") ?? DefaultApplicationId);
            PlayerSettings.bundleVersion = Environment.GetEnvironmentVariable("ILARUNE_VERSION") ?? "0.1.0-demo";
            PlayerSettings.Android.bundleVersionCode = ParsePositiveInt(
                Environment.GetEnvironmentVariable("ILARUNE_VERSION_CODE"),
                1);
            EditorUserBuildSettings.buildAppBundle = false;

            var defines = new HashSet<string>(
                PlayerSettings.GetScriptingDefineSymbolsForGroup(BuildTargetGroup.Android)
                    .Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries));
            defines.Add("ILARUNE_DEMO");
            defines.Add("ILARUNE_DISABLE_ADS");
            defines.Add("ILARUNE_DISABLE_IAP");
            PlayerSettings.SetScriptingDefineSymbolsForGroup(
                BuildTargetGroup.Android,
                string.Join(";", defines.OrderBy(value => value).ToArray()));
        }

        private static string ResolveOutputPath()
        {
            var configured = Environment.GetEnvironmentVariable("ILARUNE_APK_PATH");
            var path = string.IsNullOrWhiteSpace(configured)
                ? Path.Combine("Builds", "Android", "Ilarune-development.apk")
                : configured;
            return Path.GetFullPath(path);
        }

        private static int ParsePositiveInt(string raw, int fallback)
        {
            if (int.TryParse(raw, out var parsed) && parsed > 0)
            {
                return parsed;
            }

            return fallback;
        }
    }
}
