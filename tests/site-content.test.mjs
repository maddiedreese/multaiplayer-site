import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";

test("generated social card is the expected share-image size", async () => {
  const metadata = await sharp(fileURLToPath(new URL("../public/og.png", import.meta.url))).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "png");
});
