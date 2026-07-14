import assert from "node:assert/strict";
import test from "node:test";
import { APP_BUNDLE_ID, buildAasa } from "../scripts/generate-aasa.mjs";

test("generates an exact invitation-only association", () => {
  assert.deepEqual(buildAasa("TESTTEAM01"), {
    applinks: {
      apps: [],
      details: [{
        appIDs: [`TESTTEAM01.${APP_BUNDLE_ID}`],
        components: [
          { "/": "/invite", comment: "Opens a private multAIplayer invitation." },
          { "/": "/invite/", comment: "Opens a normalized private multAIplayer invitation." },
        ],
      }],
    },
  });
});

test("rejects missing, placeholder-shaped, lowercase, and malformed team IDs", () => {
  for (const value of [undefined, "", "TEAMID", "testteam01", "TOO-LONG-001", "SHORT1234"]) {
    assert.throws(() => buildAasa(value), /exactly 10 uppercase/);
  }
});
