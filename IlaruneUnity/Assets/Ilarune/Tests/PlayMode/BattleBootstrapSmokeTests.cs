using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using UnityEngine.UI;

namespace Ilarune.Battle.Tests
{
    public sealed class BattleBootstrapSmokeTests
    {
        [UnityTest]
        public IEnumerator Bootstrap_BuildsPlayablePortraitInterfaceAndRespondsToTap()
        {
            var host = new GameObject("BattleSmokeHost");
            var bootstrap = host.AddComponent<BattleBootstrap>();
            yield return null;

            Assert.That(bootstrap.IsInitialized, Is.True);
            Assert.That(bootstrap.Session, Is.Not.Null);
            Assert.That(bootstrap.TileButtonCount, Is.EqualTo(
                bootstrap.Session.Board.Columns * bootstrap.Session.Board.Rows));
            Assert.That(host.GetComponentInChildren<Canvas>(), Is.Not.Null);
            Assert.That(host.GetComponentsInChildren<Button>(true).Length, Is.GreaterThan(bootstrap.TileButtonCount));

            bootstrap.SimulateTileTap(0, 0);
            yield return null;

            Assert.That(bootstrap.Session.Outcome, Is.EqualTo(BattleOutcome.InProgress));
            Object.Destroy(host);
            yield return null;
        }
    }
}
