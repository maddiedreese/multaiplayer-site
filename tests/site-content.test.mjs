import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";
import { socialCardSvg } from "../scripts/generate-social-card.mjs";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("marketing surfaces use sanitized current product content", async () => {
  const [home, preview, manifest, invite, social] = await Promise.all([
    source("app/page.tsx"),
    source("app/components/ProductRoomPreview.tsx"),
    source("public/releases/latest.json"),
    source("app/invite/InviteLanding.tsx"),
    Promise.resolve(socialCardSvg()),
  ]);
  const marketing = `${home}\n${preview}\n${manifest}\n${invite}\n${social}`;
  for (const stale of [
    /GitHub sign-in not configured/i,
    /E2E room/i,
    /maddiedreese\/Documents/i,
    /analytics tracking/i,
    /First public alpha scaffold/i,
    /old scaffold release/i,
  ]) assert.doesNotMatch(marketing, stale);
  assert.match(preview, /Signed in as casey/);
  assert.match(preview, /~\/Projects\/northstar/);
  assert.match(preview, /role="img"/);
  assert.match(preview, /aria-label="Illustration of the multAIplayer desktop room/);
  assert.doesNotMatch(preview, /<(?:a|button|input|select|textarea)\b/);
  assert.match(home, /Monaco Editor/);
  assert.match(home, /xterm\.js/);
  assert.match(home, /Cloudflare Quick Tunnel/);
  assert.match(home, /install cloudflared/);
  assert.match(home, /relay never proxies the preview/);
  assert.match(home, /current Git working tree/);
  assert.match(social, /APPLE SILICON/);
  assert.match(social, /macOS 11 or later/);
  assert.match(manifest, /"version": "0\.0\.0"/);
  assert.match(manifest, /No supported desktop release has been published/);
});

test("generated social card is the expected share-image size", async () => {
  const metadata = await sharp(fileURLToPath(new URL("../public/og.png", import.meta.url))).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "png");
});
