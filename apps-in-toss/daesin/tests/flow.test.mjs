import assert from "node:assert/strict";
import test from "node:test";
import {
  CRAVING_OPTIONS,
  PLAN_TIMES,
  RESET_ACTIONS,
  canStartCravingGate,
  formatCountdown,
  isValidDetailSelection,
  nextScreenForOption,
  normalizeFood,
} from "../src/flow.mjs";

test("adult confirmation and a food input are required before starting", () => {
  assert.equal(canStartCravingGate({ adultConfirmed: false, food: "치킨" }), false);
  assert.equal(canStartCravingGate({ adultConfirmed: true, food: "   " }), false);
  assert.equal(canStartCravingGate({ adultConfirmed: true, food: "  치킨  " }), true);
  assert.equal(normalizeFood("  매운   떡볶이  "), "매운 떡볶이");
});

test("the craving gate always offers three bounded choices", () => {
  assert.equal(CRAVING_OPTIONS.length, 3);
  assert.deepEqual(CRAVING_OPTIONS.map((option) => option.id), ["delay", "swap", "plan"]);
  assert.equal(new Set(CRAVING_OPTIONS.map((option) => option.icon)).size, 3);
  assert.equal(CRAVING_OPTIONS.some((option) => Object.hasOwn(option, "emoji")), false);
  assert.equal(nextScreenForOption("delay"), "timer");
  assert.equal(nextScreenForOption("swap"), "swap");
  assert.equal(nextScreenForOption("plan"), "plan");
  assert.equal(nextScreenForOption("unknown"), "options");
});

test("swap and plan require a bounded detail choice before completion", () => {
  assert.equal(RESET_ACTIONS.length, 3);
  assert.equal(PLAN_TIMES.length, 3);
  assert.equal(isValidDetailSelection("swap", RESET_ACTIONS[0].id), true);
  assert.equal(isValidDetailSelection("swap", "not-an-action"), false);
  assert.equal(isValidDetailSelection("plan", PLAN_TIMES[1].id), true);
  assert.equal(isValidDetailSelection("plan", "not-a-time"), false);
  assert.equal(isValidDetailSelection("delay", "timer"), true);
});

test("the timer copy is stable at its boundaries", () => {
  assert.equal(formatCountdown(300), "05:00");
  assert.equal(formatCountdown(9), "00:09");
  assert.equal(formatCountdown(-1), "00:00");
  assert.equal(formatCountdown(Number.NaN), "00:00");
});
