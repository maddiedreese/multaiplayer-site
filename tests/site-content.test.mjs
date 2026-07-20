import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const source = async (path) => readFile(fileURLToPath(new URL(`../${path}`, import.meta.url)), "utf8");

test("generated social card is the expected share-image size", async () => {
  const metadata = await sharp(fileURLToPath(new URL("../public/og.png", import.meta.url))).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "png");
});

test("home and FAQ publish the supported CLI install and onboarding flow", async () => {
  const home = await source("app/page.tsx");
  const faq = await source("app/faq/page.tsx");
  const publicCopy = `${home}\n${faq}`;

  assert.match(publicCopy, /curl -fsSL https:\/\/raw\.githubusercontent\.com\/maddiedreese\/multAIplayer\/main\/apps\/cli\/install\.sh \| sh/);
  assert.match(publicCopy, /multAIplayer auth login --open/);
  assert.match(publicCopy, /multAIplayer walkthrough/);
  assert.match(publicCopy, /host handoff/i);
  assert.match(publicCopy, /same encrypted rooms/i);
});
