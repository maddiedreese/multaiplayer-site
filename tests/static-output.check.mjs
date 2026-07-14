import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { inlineScriptHashes } from "../scripts/generate-static-headers.mjs";
import { APP_BUNDLE_ID, TEAM_ID_PATTERN } from "../scripts/generate-aasa.mjs";

test("static invitation export carries exact CSP hashes and no capability value", async () => {
  const [html, headers, aasa] = await Promise.all([
    readFile(new URL("../out/invite.html", import.meta.url), "utf8"),
    readFile(new URL("../out/_headers", import.meta.url), "utf8"),
    readFile(new URL("../out/.well-known/apple-app-site-association", import.meta.url), "utf8"),
  ]);
  assert.match(html, /Private invitation/);
  assert.match(html, /__MULTAIPLAYER_PENDING_INVITE__/);
  assert.doesNotMatch(html, /\sstyle=/);
  assert.doesNotMatch(html, /#invite=[A-Za-z0-9_-]+&multaiplayerJoin=[A-Za-z0-9_-]+/);
  for (const hash of inlineScriptHashes(html)) assert.ok(headers.includes(hash), `missing CSP hash ${hash}`);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval/);
  assert.match(headers, /Cache-Control: no-store/);
  const teamId = process.env.MULTAIPLAYER_APPLE_TEAM_ID;
  assert.match(teamId ?? "", TEAM_ID_PATTERN);
  assert.deepEqual(JSON.parse(aasa).applinks.details[0].appIDs, [`${teamId}.${APP_BUNDLE_ID}`]);
});
