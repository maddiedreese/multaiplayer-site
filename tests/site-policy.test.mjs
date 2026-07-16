import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

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
  assert.doesNotMatch(`${await source("app/invite/page.tsx")}\n${await source("app/invite/InviteLanding.tsx")}`, /capabilities stay on this device|sends it only when/i);
});
