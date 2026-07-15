import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("published policies contain the required identity, date, platform, hosting, and account facts", async () => {
  const [privacy, terms, legal] = await Promise.all([
    source("app/privacy/page.tsx"),
    source("app/terms/page.tsx"),
    source("app/legal.tsx"),
  ]);
  const policies = `${privacy}\n${terms}\n${legal}`;
  for (const fact of [
    "July 14, 2026",
    "Flared Inc.",
    "2093 Philadelphia Pike #2010, Claymont, DE 19703, United States",
    "maddie@maddiedreese.com",
    "California law",
    "Apple silicon",
    "macOS 11 or later",
    "Railway",
    "public and private repositories",
  ]) assert.ok(policies.includes(fact), `missing required policy fact: ${fact}`);
  assert.match(privacy, /title, body, head branch, and base branch/);
  assert.match(privacy, /does not add these proxy request or response bodies to its persistent relay state or logs/);
  assert.match(privacy, /shown as needed to authorized teammates/);
  assert.match(privacy, /We will never ask you for a complete invite link or fragment/);
  assert.match(privacy, /separate Railway object-storage bucket outside the relay database and its backup set/);
  assert.match(privacy, /version.*HMAC-SHA-256.*deletion-attempt time.*backup-expiry date.*random entry identifier.*authentication code/);
  assert.match(privacy, /remain for 90 days.*89-day maximum backup retention/);
  assert.match(privacy, /accepted and pending.*fail-closed reconciliation before it next accepts traffic/);
});

test("every public website surface links both policies", async () => {
  const paths = ["app/page.tsx", "app/faq/page.tsx", "app/invite/page.tsx", "app/legal.tsx"];
  for (const path of paths) {
    const contents = await source(path);
    assert.match(contents, /(?:href=|href=\{)["`]?\/?(?:https:\/\/multaiplayer\.com\/)?privacy/);
    assert.match(contents, /(?:href=|href=\{)["`]?\/?(?:https:\/\/multaiplayer\.com\/)?terms/);
  }
});

test("website contains no analytics dependency and invite policy prevents fragment disclosure", async () => {
  const [manifest, inviteScript, headers, readme] = await Promise.all([
    source("package.json"),
    source("lib/invite-capture.mjs"),
    source("scripts/generate-static-headers.mjs"),
    source("README.md"),
  ]);
  assert.doesNotMatch(manifest, /segment|mixpanel|amplitude|posthog|google-analytics|gtag|plausible/i);
  assert.match(inviteScript, /history\.replaceState/);
  assert.doesNotMatch(inviteScript, /fetch\(|sendBeacon|localStorage|sessionStorage|document\.cookie|console\./);
  for (const directive of ["connect-src 'none'", "form-action 'none'", "Referrer-Policy: no-referrer", "Cache-Control: no-store"]) {
    assert.ok(headers.includes(directive), `missing invite control: ${directive}`);
  }
  assert.match(readme, /never puts the capability in HTML, storage, cookies, analytics, telemetry, or the clipboard/i);
});
