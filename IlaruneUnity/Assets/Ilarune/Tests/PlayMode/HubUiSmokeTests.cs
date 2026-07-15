using System;
using System.Collections;
using Ilarune.Hub;
using Ilarune.UI;
using NUnit.Framework;
using TMPro;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;

namespace Ilarune.Battle.Tests
{
    public sealed class HubUiSmokeTests
    {
        [UnityTest]
        public IEnumerator HubBootstrap_BuildsReadableSafeAreaHudAndRoutesPlaceholderActions()
        {
            var host = new GameObject("HubUiSmokeHost");
            var hub = host.AddComponent<HubBootstrap>();
            yield return null;
            Canvas.ForceUpdateCanvases();

            var canvas = host.GetComponentInChildren<Canvas>();
            var scaler = host.GetComponentInChildren<CanvasScaler>();
            var safeArea = host.GetComponentInChildren<SafeAreaFitter>();
            Assert.That(canvas, Is.Not.Null);
            Assert.That(scaler, Is.Not.Null);
            Assert.That(scaler.uiScaleMode, Is.EqualTo(CanvasScaler.ScaleMode.ScaleWithScreenSize));
            Assert.That(scaler.referenceResolution, Is.EqualTo(new Vector2(1080f, 2400f)));
            Assert.That(safeArea, Is.Not.Null);

            var texts = host.GetComponentsInChildren<TMP_Text>(true);
            Assert.That(texts.Length, Is.GreaterThan(20));
            for (int index = 0; index < texts.Length; index++)
            {
                Assert.That(texts[index].font, Is.Not.Null, texts[index].name + " has no TMP font");
                Assert.That(texts[index].fontSize, Is.GreaterThanOrEqualTo(36f), texts[index].name);
                Assert.That(texts[index].overflowMode, Is.EqualTo(TextOverflowModes.Ellipsis), texts[index].name);
            }

            var buttons = host.GetComponentsInChildren<Button>(true);
            Assert.That(buttons.Length, Is.GreaterThan(20));
            for (int index = 0; index < buttons.Length; index++)
            {
                Rect rect = ((RectTransform)buttons[index].transform).rect;
                Assert.That(rect.width, Is.GreaterThanOrEqualTo(96f), buttons[index].name + " width");
                Assert.That(rect.height, Is.GreaterThanOrEqualTo(96f), buttons[index].name + " height");
            }

            Button heroes = Array.Find(buttons, button => button.name == "Heroes");
            Assert.That(heroes, Is.Not.Null);
            heroes.onClick.Invoke();
            yield return null;

            Transform placeholder = Array.Find(
                host.GetComponentsInChildren<Transform>(true),
                child => child.name == "DevelopmentPlaceholder");
            Assert.That(placeholder, Is.Not.Null);
            Assert.That(placeholder.gameObject.activeSelf, Is.True);

            UnityEngine.Object.Destroy(host);
            yield return null;
        }
    }
}
