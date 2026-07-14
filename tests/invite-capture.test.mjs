import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import { INVITE_CAPTURE_SCRIPT } from "../lib/invite-capture.mjs";

function capture(href) {
  const parsed = new URL(href);
  const replacements = [];
  const context = {
    location: {
      href,
      hash: parsed.hash,
      hostname: parsed.hostname,
      pathname: parsed.pathname,
      protocol: parsed.protocol,
      search: parsed.search,
    },
    history: {
      state: { retained: true },
      replaceState(state, title, path) { replacements.push({ state, title, path }); },
    },
    window: {},
  };
  vm.runInNewContext(INVITE_CAPTURE_SCRIPT, context);
  return { pending: context.window.__MULTAIPLAYER_PENDING_INVITE__, replacements };
}

test("captures a bounded all-fragment invite and scrubs before hydration", () => {
  const href = "https://open.multaiplayer.com/invite#invite=id&multaiplayerJoin=cap&approval=request";
  const result = capture(href);
  assert.equal(result.pending, href);
  assert.deepEqual(result.replacements.map(({ path }) => path), ["/invite"]);
});

test("scrubs query-only, malformed, slash-normalized, and oversized invite URLs without retaining them", () => {
  const cases = [
    "https://open.multaiplayer.com/invite?invite=legacy",
    "https://open.multaiplayer.com/invite#malformed",
    "https://open.multaiplayer.com/invite/#malformed",
    `https://open.multaiplayer.com/invite#${"x".repeat(12_289)}`,
  ];
  for (const href of cases) {
    const result = capture(href);
    assert.equal(result.pending, undefined);
    assert.deepEqual(result.replacements.map(({ path }) => path), ["/invite"]);
  }
});

test("does not touch unrelated paths", () => {
  const result = capture("https://open.multaiplayer.com/faq#invite=private");
  assert.equal(result.pending, undefined);
  assert.deepEqual(result.replacements, []);
});
