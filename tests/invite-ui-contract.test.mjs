import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("keeps the landing alive while the direct disk image opens separately", async () => {
  const source = await readFile(new URL("../app/invite/InviteLanding.tsx", import.meta.url), "utf8");
  assert.match(source, /href=\{downloadUrl\} target="_blank" rel="noopener noreferrer"/);
  assert.match(source, /Signed alpha not yet available/);
  assert.match(source, /Do not install the old scaffold release/);
});
