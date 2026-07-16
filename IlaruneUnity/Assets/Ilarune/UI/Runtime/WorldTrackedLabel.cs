using System;
using UnityEngine;
using UnityEngine.UI;

namespace Ilarune.UI
{
    /// <summary>Accessible HUD label that follows a world-space building anchor.</summary>
    public sealed class WorldTrackedLabel : MonoBehaviour
    {
        private Camera worldCamera;
        private Transform target;
        private RectTransform labelLayer;
        private RectTransform rectTransform;
        private CanvasGroup visibility;
        private Vector3 worldOffset;

        public void Bind(Camera camera, Transform followTarget, RectTransform layer, Vector3 offset, Action onClick)
        {
            worldCamera = camera;
            target = followTarget;
            labelLayer = layer;
            worldOffset = offset;
            rectTransform = transform as RectTransform;
            visibility = GetComponent<CanvasGroup>();
            if (visibility == null)
            {
                visibility = gameObject.AddComponent<CanvasGroup>();
            }

            Button button = GetComponent<Button>();
            if (button != null && onClick != null)
            {
                button.onClick.AddListener(() => onClick());
            }

            Refresh();
        }

        private void LateUpdate()
        {
            Refresh();
        }

        private void Refresh()
        {
            if (worldCamera == null || target == null || labelLayer == null || rectTransform == null)
            {
                return;
            }

            Vector3 viewport = worldCamera.WorldToViewportPoint(target.position + worldOffset);
            bool visible = viewport.z > 0f && viewport.x > -0.08f && viewport.x < 1.08f &&
                           viewport.y > -0.08f && viewport.y < 1.08f;
            visibility.alpha = visible ? 1f : 0f;
            visibility.interactable = visible;
            visibility.blocksRaycasts = visible;

            if (!visible)
            {
                return;
            }

            Vector2 screen = worldCamera.WorldToScreenPoint(target.position + worldOffset);
            if (RectTransformUtility.ScreenPointToLocalPointInRectangle(labelLayer, screen, null, out Vector2 local))
            {
                rectTransform.anchoredPosition = local;
            }
        }
    }
}
