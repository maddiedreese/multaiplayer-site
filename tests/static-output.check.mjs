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

test("static export publishes privacy and terms and links them from invitation handling", async () => {
  const [privacy, terms, invite, home, faq] = await Promise.all([
    readFile(new URL("../out/privacy.html", import.meta.url), "utf8"),
    readFile(new URL("../out/terms.html", import.meta.url), "utf8"),
    readFile(new URL("../out/invite.html", import.meta.url), "utf8"),
    readFile(new URL("../out/index.html", import.meta.url), "utf8"),
    readFile(new URL("../out/faq.html", import.meta.url), "utf8"),
  ]);
  assert.match(privacy, /Privacy Policy/);
  assert.match(privacy, /Flared Inc\./);
  assert.match(terms, /Terms of Service/);
  assert.match(terms, /California law/);
  assert.match(invite, /https:\/\/multaiplayer\.com\/privacy/);
  assert.match(invite, /https:\/\/multaiplayer\.com\/terms/);
  assert.doesNotMatch(invite, /google-analytics|gtag|segment|mixpanel|amplitude|posthog/i);
  for (const page of [home, faq, invite]) {
    assert.doesNotMatch(page, /releases\/download\/v0\.1\.0-alpha\.0/);
  }
  for (const page of [home, faq]) {
    assert.match(page, /Signed alpha (?:coming soon|not yet available)/);
  }
});
