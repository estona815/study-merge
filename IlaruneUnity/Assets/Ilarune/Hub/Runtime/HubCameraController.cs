using System;
using UnityEngine;
using UnityEngine.EventSystems;

namespace Ilarune.Hub
{
    /// <summary>Portrait orthographic pan, tap selection, focus zoom, and subtle camera float.</summary>
    [DisallowMultipleComponent]
    public sealed class HubCameraController : MonoBehaviour
    {
        private Camera worldCamera;
        private Action<HubBuildingView> selectionChanged;
        private HubBuildingView focusedBuilding;
        private Vector3 freePosition;
        private Vector3 targetPosition;
        private Vector3 positionVelocity;
        private Vector2 pointerStart;
        private Vector2 pointerLast;
        private bool pointerDown;
        private bool pointerBlocked;
        private float normalSize = 10.8f;
        private float focusSize = 5.8f;
        private readonly RaycastHit2D[] selectionHits = new RaycastHit2D[16];

        public HubBuildingView FocusedBuilding => focusedBuilding;

        public void Configure(Camera camera, Action<HubBuildingView> onSelectionChanged)
        {
            worldCamera = camera;
            selectionChanged = onSelectionChanged;
            freePosition = new Vector3(0f, -0.4f, -10f);
            targetPosition = freePosition;
            if (worldCamera != null)
            {
                worldCamera.orthographic = true;
                worldCamera.orthographicSize = normalSize;
                worldCamera.transform.position = targetPosition;
            }
        }

        public void Focus(HubBuildingView building)
        {
            if (building == null)
            {
                ClearFocus();
                return;
            }

            if (focusedBuilding != null && focusedBuilding != building)
            {
                focusedBuilding.SetFocused(false);
            }

            focusedBuilding = building;
            focusedBuilding.SetFocused(true);
            Vector3 focus = building.FocusWorldPosition;
            targetPosition = new Vector3(focus.x, focus.y - 0.15f, -10f);
            selectionChanged?.Invoke(building);
        }

        public void ClearFocus()
        {
            if (focusedBuilding == null)
            {
                return;
            }

            focusedBuilding.SetFocused(false);
            focusedBuilding = null;
            targetPosition = freePosition;
            selectionChanged?.Invoke(null);
        }

        private void Update()
        {
            if (worldCamera == null)
            {
                return;
            }

            if (Input.GetKeyDown(KeyCode.Escape) && focusedBuilding != null)
            {
                ClearFocus();
            }

            if (Input.touchCount > 0)
            {
                HandleTouch(Input.GetTouch(0));
            }
            else
            {
                HandleMouse();
            }
        }

        private void LateUpdate()
        {
            if (worldCamera == null)
            {
                return;
            }

            float desiredSize = focusedBuilding == null ? normalSize : focusSize;
            worldCamera.orthographicSize = Mathf.Lerp(
                worldCamera.orthographicSize,
                desiredSize,
                1f - Mathf.Exp(-7f * Time.unscaledDeltaTime));

            float floatX = Mathf.Sin(Time.unscaledTime * 0.23f) * 0.035f;
            float floatY = Mathf.Sin((Time.unscaledTime * 0.31f) + 1.7f) * 0.045f;
            Vector3 desiredPosition = targetPosition + new Vector3(floatX, floatY, 0f);
            worldCamera.transform.position = Vector3.SmoothDamp(
                worldCamera.transform.position,
                desiredPosition,
                ref positionVelocity,
                0.18f,
                Mathf.Infinity,
                Time.unscaledDeltaTime);
        }

        private void HandleTouch(Touch touch)
        {
            switch (touch.phase)
            {
                case TouchPhase.Began:
                    BeginPointer(touch.position, touch.fingerId);
                    break;
                case TouchPhase.Moved:
                case TouchPhase.Stationary:
                    MovePointer(touch.position);
                    break;
                case TouchPhase.Ended:
                case TouchPhase.Canceled:
                    EndPointer(touch.position);
                    break;
            }
        }

        private void HandleMouse()
        {
            Vector2 position = Input.mousePosition;
            if (Input.GetMouseButtonDown(0))
            {
                BeginPointer(position, -1);
            }
            else if (Input.GetMouseButton(0))
            {
                MovePointer(position);
            }
            else if (Input.GetMouseButtonUp(0))
            {
                EndPointer(position);
            }

            if (focusedBuilding == null && Mathf.Abs(Input.mouseScrollDelta.y) > 0.01f)
            {
                normalSize = Mathf.Clamp(normalSize - (Input.mouseScrollDelta.y * 0.35f), 9.5f, 12f);
            }
        }

        private void BeginPointer(Vector2 position, int pointerId)
        {
            pointerDown = true;
            pointerStart = position;
            pointerLast = position;
            pointerBlocked = EventSystem.current != null &&
                             (pointerId >= 0
                                 ? EventSystem.current.IsPointerOverGameObject(pointerId)
                                 : EventSystem.current.IsPointerOverGameObject());
        }

        private void MovePointer(Vector2 position)
        {
            if (!pointerDown || pointerBlocked || focusedBuilding != null)
            {
                pointerLast = position;
                return;
            }

            Vector2 delta = position - pointerLast;
            pointerLast = position;
            float unitsPerPixel = (worldCamera.orthographicSize * 2f) / Mathf.Max(1f, Screen.height);
            freePosition -= new Vector3(delta.x * unitsPerPixel, delta.y * unitsPerPixel, 0f);
            freePosition.x = Mathf.Clamp(freePosition.x, -1.15f, 1.15f);
            freePosition.y = Mathf.Clamp(freePosition.y, -2.8f, 2.8f);
            freePosition.z = -10f;
            targetPosition = freePosition;
        }

        private void EndPointer(Vector2 position)
        {
            if (!pointerDown)
            {
                return;
            }

            pointerDown = false;
            float travel = Vector2.Distance(pointerStart, position);
            if (!pointerBlocked && travel <= 32f)
            {
                TrySelect(position);
            }

            pointerBlocked = false;
        }

        private void TrySelect(Vector2 screenPosition)
        {
            Ray ray = worldCamera.ScreenPointToRay(screenPosition);
            int hitCount = Physics2D.GetRayIntersectionNonAlloc(ray, selectionHits, Mathf.Infinity);
            HubBuildingView selected = null;
            int selectedOrder = int.MinValue;
            for (int i = 0; i < hitCount; i++)
            {
                Collider2D collider = selectionHits[i].collider;
                HubBuildingView candidate = collider == null
                    ? null
                    : collider.GetComponentInParent<HubBuildingView>();
                if (candidate != null && candidate.VisualOrder > selectedOrder)
                {
                    selected = candidate;
                    selectedOrder = candidate.VisualOrder;
                }
            }

            if (selected == null)
            {
                if (focusedBuilding != null)
                {
                    ClearFocus();
                }

                return;
            }

            Focus(selected);
        }
    }
}
