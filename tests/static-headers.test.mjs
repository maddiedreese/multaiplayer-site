import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { inlineScriptHashes, inviteHeaders } from "../scripts/generate-static-headers.mjs";

test("hashes inline scripts exactly and produces a closed invitation CSP", () => {
  const hashes = inlineScriptHashes('<script src="/external.js"></script><script>scrub()</script><script>hydrate()</script>');
  assert.equal(hashes.length, 2);
  const headers = inviteHeaders(hashes);
  for (const hash of hashes) assert.match(headers, new RegExp(hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(headers, /Cache-Control: no-store/);
  assert.match(headers, /connect-src 'none'/);
  assert.match(headers, /Referrer-Policy: no-referrer/);
  assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval/);
});

test("refuses to emit a CSP without an inline-script inventory", () => {
  assert.throws(() => inviteHeaders([]), /at least one hashed inline script/);
});

test("site-wide headers cannot override invitation no-referrer policy", async () => {
  const netlifyConfig = await readFile(new URL("../netlify.toml", import.meta.url), "utf8");
  const referrerPolicies = [...netlifyConfig.matchAll(/Referrer-Policy\s*=\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(referrerPolicies.length >= 3);
  assert.deepEqual(new Set(referrerPolicies), new Set(["no-referrer"]));
});
