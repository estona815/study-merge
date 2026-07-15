using Ilarune.UI;
using NUnit.Framework;
using UnityEngine;

namespace Ilarune.Battle.Tests
{
    public sealed class UiLayoutPolicyTests
    {
        [TestCase(720, 1600)]
        [TestCase(1080, 1920)]
        [TestCase(1080, 2400)]
        [TestCase(1440, 3200)]
        public void SafeAreaAnchors_AreNormalizedForRequiredPortraitResolutions(int width, int height)
        {
            int topInset = Mathf.RoundToInt(height * 0.04f);
            int bottomInset = Mathf.RoundToInt(height * 0.025f);
            var safeArea = new Rect(0f, bottomInset, width, height - topInset - bottomInset);

            SafeAreaFitter.CalculateAnchors(
                safeArea,
                new Vector2Int(width, height),
                out var minimum,
                out var maximum);

            Assert.That(minimum.x, Is.EqualTo(0f).Within(0.0001f));
            Assert.That(minimum.y, Is.EqualTo((float)bottomInset / height).Within(0.0001f));
            Assert.That(maximum.x, Is.EqualTo(1f).Within(0.0001f));
            Assert.That(maximum.y, Is.EqualTo((float)(height - topInset) / height).Within(0.0001f));
            Assert.That(maximum.x, Is.GreaterThan(minimum.x));
            Assert.That(maximum.y, Is.GreaterThan(minimum.y));
        }
    }
}
