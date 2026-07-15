using System.Collections.Generic;
using UnityEngine;

namespace Ilarune.Hub
{
    /// <summary>
    /// Preallocates lightweight waypoint walkers. Agents are toggled instead of instantiated
    /// during play, keeping hub navigation free of allocation spikes.
    /// </summary>
    [DisallowMultipleComponent]
    public sealed class HubNpcPool : MonoBehaviour
    {
        private const int PoolCapacity = 16;
        private readonly List<HubNpcAgent> agents = new List<HubNpcAgent>(PoolCapacity);

        public int ActiveCount { get; private set; }

        public void Configure(
            Camera worldCamera,
            IReadOnlyList<Vector3> waypoints,
            HubQualityProfile quality)
        {
            if (agents.Count == 0)
            {
                for (int i = 0; i < PoolCapacity; i++)
                {
                    GameObject agentObject = new GameObject("WaypointNpc_" + (i + 1));
                    agentObject.transform.SetParent(transform, false);
                    HubNpcAgent agent = agentObject.AddComponent<HubNpcAgent>();
                    agent.Configure(i, worldCamera, waypoints, quality.OffscreenTickInterval);
                    agents.Add(agent);
                }
            }

            SetActiveCount(Mathf.Clamp(quality.NpcCount, 0, PoolCapacity));
        }

        public void SetActiveCount(int count)
        {
            ActiveCount = Mathf.Clamp(count, 0, agents.Count);
            for (int i = 0; i < agents.Count; i++)
            {
                agents[i].gameObject.SetActive(i < ActiveCount);
            }
        }
    }

    internal sealed class HubNpcAgent : MonoBehaviour
    {
        private IReadOnlyList<Vector3> waypoints;
        private Camera worldCamera;
        private SpriteRenderer body;
        private SpriteRenderer head;
        private int targetIndex;
        private int waypointStep;
        private float speed;
        private float offscreenInterval;
        private float nextTick;
        private float lastTick;

        public void Configure(
            int index,
            Camera camera,
            IReadOnlyList<Vector3> waypointList,
            float offscreenTickInterval)
        {
            worldCamera = camera;
            waypoints = waypointList;
            offscreenInterval = offscreenTickInterval;
            waypointStep = 1 + (index % 3);
            speed = 0.42f + ((index % 5) * 0.055f);
            targetIndex = waypointList.Count == 0 ? 0 : index % waypointList.Count;
            transform.localPosition = waypointList.Count == 0 ? Vector3.zero : waypointList[targetIndex];
            targetIndex = waypointList.Count == 0 ? 0 : (targetIndex + waypointStep) % waypointList.Count;

            Color[] clothes =
            {
                new Color32(107, 225, 210, 255),
                new Color32(199, 127, 255, 255),
                new Color32(255, 178, 102, 255),
                new Color32(129, 162, 255, 255)
            };
            int baseOrder = 205;
            ProceduralHubArt.CreateRenderer(
                transform, "Shadow", HubShape.SoftCircle, new Color(0.03f, 0.02f, 0.08f, 0.42f),
                new Vector3(0f, -0.23f, 0f), new Vector2(0.5f, 0.2f), baseOrder - 2);
            body = ProceduralHubArt.CreateRenderer(
                transform, "Body", HubShape.Capsule, clothes[index % clothes.Length],
                new Vector3(0f, 0f, 0f), new Vector2(0.25f, 0.42f), baseOrder);
            head = ProceduralHubArt.CreateRenderer(
                transform, "Head", HubShape.Circle, new Color32(235, 203, 183, 255),
                new Vector3(0f, 0.28f, 0f), new Vector2(0.22f, 0.22f), baseOrder + 1);
            lastTick = Time.unscaledTime;
        }

        private void Update()
        {
            if (waypoints == null || waypoints.Count == 0)
            {
                return;
            }

            float now = Time.unscaledTime;
            bool visible = HubQuality.IsVisible(worldCamera, transform.position, 0.15f);
            if (!visible && now < nextTick)
            {
                return;
            }

            nextTick = now + (visible ? 0f : offscreenInterval);
            float deltaTime = Mathf.Clamp(now - lastTick, 0f, 0.45f);
            lastTick = now;
            Vector3 destination = waypoints[targetIndex];
            Vector3 previous = transform.localPosition;
            transform.localPosition = Vector3.MoveTowards(previous, destination, speed * deltaTime);
            Vector3 direction = destination - previous;
            if (Mathf.Abs(direction.x) > 0.001f)
            {
                Vector3 scale = transform.localScale;
                scale.x = direction.x < 0f ? -1f : 1f;
                transform.localScale = scale;
            }

            if ((transform.localPosition - destination).sqrMagnitude < 0.0025f)
            {
                targetIndex = (targetIndex + waypointStep) % waypoints.Count;
            }

            int sorting = 190 + Mathf.RoundToInt(-transform.position.y * 5f);
            body.sortingOrder = sorting;
            head.sortingOrder = sorting + 1;
        }
    }
}
