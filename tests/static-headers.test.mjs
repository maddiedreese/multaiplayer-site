import assert from "node:assert/strict";
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
