using UnityEngine;

namespace Ilarune.UI
{
    /// <summary>Fits a full-stretch RectTransform to the current device safe area.</summary>
    [DisallowMultipleComponent]
    public sealed class SafeAreaFitter : MonoBehaviour
    {
        private RectTransform rectTransform;
        private Rect lastSafeArea;
        private Vector2Int lastScreenSize;

        private void Awake()
        {
            rectTransform = transform as RectTransform;
            Apply();
        }

        private void OnEnable()
        {
            Apply();
        }

        private void Update()
        {
            Vector2Int screenSize = new Vector2Int(Screen.width, Screen.height);
            if (Screen.safeArea != lastSafeArea || screenSize != lastScreenSize)
            {
                Apply();
            }
        }

        public void Apply()
        {
            if (rectTransform == null)
            {
                rectTransform = transform as RectTransform;
            }

            if (rectTransform == null || Screen.width <= 0 || Screen.height <= 0)
            {
                return;
            }

            CalculateAnchors(
                Screen.safeArea,
                new Vector2Int(Screen.width, Screen.height),
                out Vector2 min,
                out Vector2 max);

            rectTransform.anchorMin = min;
            rectTransform.anchorMax = max;
            rectTransform.offsetMin = Vector2.zero;
            rectTransform.offsetMax = Vector2.zero;
            lastSafeArea = Screen.safeArea;
            lastScreenSize = new Vector2Int(Screen.width, Screen.height);
        }

        public static void CalculateAnchors(
            Rect safeArea,
            Vector2Int screenSize,
            out Vector2 anchorMin,
            out Vector2 anchorMax)
        {
            if (screenSize.x <= 0 || screenSize.y <= 0)
            {
                anchorMin = Vector2.zero;
                anchorMax = Vector2.one;
                return;
            }

            Vector2 minimum = safeArea.position;
            Vector2 maximum = safeArea.position + safeArea.size;
            anchorMin = new Vector2(
                Mathf.Clamp01(minimum.x / screenSize.x),
                Mathf.Clamp01(minimum.y / screenSize.y));
            anchorMax = new Vector2(
                Mathf.Clamp01(maximum.x / screenSize.x),
                Mathf.Clamp01(maximum.y / screenSize.y));
        }
    }
}
