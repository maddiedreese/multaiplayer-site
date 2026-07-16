import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import sharp from "sharp";
import { socialCardSvg } from "../scripts/generate-social-card.mjs";

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("marketing surfaces use sanitized current product content", async () => {
  const [home, faq, preview, manifest, invite, updaterKey, sitemap, social] = await Promise.all([
    source("app/page.tsx"),
    source("app/faq/page.tsx"),
    source("app/components/ProductRoomPreview.tsx"),
    source("public/releases/latest.json"),
    source("app/invite/InviteLanding.tsx"),
    source("app/security/updater-key/page.tsx"),
    source("app/sitemap.ts"),
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
  assert.match(home, /passphrase-encrypted age archive/);
  assert.match(home, /does not replace Codex’s system or developer instructions/);
  assert.match(faq, /does not replace Codex&apos;s system or developer instructions/);
  assert.match(home, /independent open-source project and is not affiliated/);
  assert.match(updaterKey, /5F97AE260BE16B2F/);
  assert.match(updaterKey, /626f3a15f71fc8c5794c9ce00392a12f782cd05ec47a88ce27858b43ce774673/);
  assert.match(updaterKey, /outside the GitHub release channel/);
  assert.match(sitemap, /\/security\/updater-key/);
  assert.match(home, /deliberately single-node/);
  assert.match(home, /threat model is the sole normative source/);
  assert.match(faq, /threat model and architecture decisions remain authoritative/);
  assert.match(home, /docs\/threat-model\.md/);
  assert.match(faq, /threat-model\.md/);
  assert.doesNotMatch(home, /Plaintext stays on participating devices/);
  assert.match(social, /APPLE SILICON/);
  assert.match(social, /macOS 11 or later/);
  assert.match(manifest, /"version": "0\.0\.0"/);
  assert.match(manifest, /"schemaVersion": 1/);
  assert.match(manifest, /"releaseAssetSet": "macos-arm64-v1"/);
  assert.deepEqual(JSON.parse(manifest), {
    schemaVersion: 1,
    releaseAssetSet: "macos-arm64-v1",
    version: "0.0.0",
    supported: false,
    downloads: {},
  });
});

test("generated social card is the expected share-image size", async () => {
  const metadata = await sharp(fileURLToPath(new URL("../public/og.png", import.meta.url))).metadata();
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
  assert.equal(metadata.format, "png");
});
