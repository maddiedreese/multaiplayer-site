import assert from "node:assert/strict";
import test from "node:test";
import { manifestFromReleases } from "../scripts/update-release-manifest.mjs";

const diskImage = {
  name: "multAIplayer_0.1.0_aarch64.dmg",
  browser_download_url: "https://github.com/maddiedreese/multAIplayer/releases/download/v0.1.0-alpha.0/multAIplayer_0.1.0_aarch64.dmg",
  digest: `sha256:${"a".repeat(64)}`,
};
const trustedAssets = [
  diskImage,
  ...[
    "multAIplayer-macos-arm64-app.zip",
    "SHA256SUMS.txt",
    "multaiplayer.spdx.json",
    "SHA256SUMS.txt.sigstore.json",
    "multaiplayer.spdx.json.sigstore.json",
  ].map((name) => ({ name })),
];

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
      assets: trustedAssets,
    },
  ]);

  assert.deepEqual(manifest, {
    version: "0.1.0-alpha.0",
    url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.1.0-alpha.0",
    notes: "A focused first release.",
    security: false,
    supported: true,
    downloads: { macos: { url: diskImage.browser_download_url, name: diskImage.name, architecture: "arm64", digest: diskImage.digest } },
  });
});

test("does not publish an incomplete artifact set or imply that it was a supported release", () => {
  const manifest = manifestFromReleases([{
    draft: false,
    tag_name: "v0.1.0-alpha.0",
    name: "Scaffold",
    body: "Unsigned scaffold.",
    html_url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.1.0-alpha.0",
    assets: [diskImage],
  }]);
  assert.deepEqual(manifest, {
    version: "0.0.0",
    url: "https://multaiplayer.com",
    notes: "No supported desktop release has been published.",
    security: false,
    supported: false,
    downloads: {},
  });
});

test("keeps the newest complete trusted release while a newer release is incomplete", () => {
  const manifest = manifestFromReleases([
    {
      draft: false,
      tag_name: "v0.3.0-alpha.0",
      name: "Uploading",
      body: "Assets are incomplete.",
      html_url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.3.0-alpha.0",
      assets: [diskImage],
    },
    {
      draft: false,
      tag_name: "v0.2.0-alpha.0",
      name: "Supported alpha",
      body: "Signed and notarized alpha.",
      html_url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.2.0-alpha.0",
      assets: [
        { ...diskImage, browser_download_url: diskImage.browser_download_url.replace("v0.1.0-alpha.0", "v0.2.0-alpha.0") },
        ...trustedAssets.slice(1),
      ],
    },
  ]);
  assert.equal(manifest.version, "0.2.0-alpha.0");
  assert.equal(manifest.supported, true);
});

test("marks security releases from release copy", () => {
  const manifest = manifestFromReleases([{
    draft: false,
    tag_name: "v0.1.1-alpha.0",
    name: "Room trust update",
    body: "Strengthens room trust handling.\n\nSecurity update: true",
    html_url: "https://example.com/release",
    assets: [
      { ...diskImage, browser_download_url: diskImage.browser_download_url.replace("v0.1.0-alpha.0", "v0.1.1-alpha.0") },
      ...trustedAssets.slice(1),
    ],
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
    assets: trustedAssets,
  }]);
  assert.equal(manifest.security, false);
});

test("returns a neutral no-release manifest when no trusted release exists", () => {
  const expected = {
    version: "0.0.0",
    url: "https://multaiplayer.com",
    notes: "No supported desktop release has been published.",
    security: false,
    supported: false,
    downloads: {},
  };
  assert.deepEqual(manifestFromReleases([]), expected);
  assert.deepEqual(manifestFromReleases([{ draft: false, tag_name: "latest" }]), expected);
});

test("requires the complete trusted workflow asset set and official download origin", () => {
  const release = { draft: false, tag_name: "v0.1.0", html_url: "https://example.com", assets: [] };
  assert.equal(manifestFromReleases([release]).supported, false);
  assert.equal(manifestFromReleases([{ ...release, assets: [diskImage, diskImage, ...trustedAssets.slice(1)] }]).supported, false);
  assert.throws(
    () => manifestFromReleases([{ ...release, assets: [{ ...diskImage, browser_download_url: "https://evil.example/app.dmg" }, ...trustedAssets.slice(1)] }]),
    /official GitHub/
  );
});
