import assert from "node:assert/strict";
import test from "node:test";
import { manifestFromReleases } from "../scripts/update-release-manifest.mjs";

const diskImage = {
  name: "multAIplayer_0.1.0_aarch64.dmg",
  browser_download_url: "https://github.com/maddiedreese/multAIplayer/releases/download/v0.1.0-alpha.0/multAIplayer_0.1.0_aarch64.dmg",
  digest: `sha256:${"a".repeat(64)}`,
};

test("selects the newest non-draft release, including prereleases", () => {
  const manifest = manifestFromReleases([
    { draft: true, tag_name: "v9.0.0", html_url: "https://example.com/draft" },
    {
      draft: false,
      prerelease: true,
      tag_name: "v0.1.0-alpha.0",
      name: "First public alpha",
      body: "A focused first release.\n\nMore details follow.",
      html_url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.1.0-alpha.0",
      assets: [diskImage],
    },
  ]);

  assert.deepEqual(manifest, {
    version: "0.1.0-alpha.0",
    url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.1.0-alpha.0",
    notes: "A focused first release.",
    security: false,
    downloads: { macos: { url: diskImage.browser_download_url, name: diskImage.name, architecture: "arm64", digest: diskImage.digest } },
  });
});

test("marks security releases from release copy", () => {
  const manifest = manifestFromReleases([{
    draft: false,
    tag_name: "v0.1.1-alpha.0",
    name: "Room trust update",
    body: "Strengthens room trust handling.\n\nSecurity update: true",
    html_url: "https://example.com/release",
    assets: [diskImage],
  }]);
  assert.equal(manifest.security, true);
});

test("does not mark ordinary releases that discuss security", () => {
  const manifest = manifestFromReleases([{
    draft: false,
    tag_name: "v0.1.0-alpha.0",
    name: "Public alpha",
    body: "Treat this as security-sensitive alpha software.",
    html_url: "https://example.com/release",
    assets: [diskImage],
  }]);
  assert.equal(manifest.security, false);
});

test("rejects missing and malformed release tags", () => {
  assert.throws(() => manifestFromReleases([]), /No published/);
  assert.throws(() => manifestFromReleases([{ draft: false, tag_name: "latest" }]), /Unsupported release tag/);
});

test("rejects missing, ambiguous, and off-origin disk images", () => {
  const release = { draft: false, tag_name: "v0.1.0", html_url: "https://example.com", assets: [] };
  assert.throws(() => manifestFromReleases([release]), /exactly one macOS disk image/);
  assert.throws(() => manifestFromReleases([{ ...release, assets: [diskImage, diskImage] }]), /exactly one/);
  assert.throws(() => manifestFromReleases([{ ...release, assets: [{ ...diskImage, browser_download_url: "https://evil.example/app.dmg" }] }]), /official GitHub/);
});
