using UnityEditor;
using UnityEditor.Build;

namespace Ilarune.Editor
{
    public static class IlaruneCaptureAutomation
    {
        [MenuItem("Ilarune/Capture/Explain Marketing Capture Prerequisites")]
        public static void RenderMarketingCaptures()
        {
            throw new BuildFailedException(
                "Deterministic in-Editor video capture is not enabled by this dependency-free automation path. "
                + "Build and install the development APK, then run Scripts/capture_video.sh with "
                + "ADB_BIN, FFMPEG_BIN, and FFPROBE_BIN. The device workflow preserves raw/native portrait, "
                + "encodes Captures/Ilarune_Promo_9x16_60fps.mp4, and records the idle segment separately. "
                + "No screenshot or video artifact was created.");
        }
    }
}
