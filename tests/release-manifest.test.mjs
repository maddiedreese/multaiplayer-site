import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { assertCanonicalAssetContract, manifestFromReleases } from "../scripts/update-release-manifest.mjs";
import { parseReleaseManifest } from "../lib/release-contract.mjs";

const contract = { schemaVersion: 1, releaseAssetSet: "macos-arm64-v1" };

const diskImage = {
  name: "multAIplayer_0.1.0_aarch64.dmg",
  browser_download_url: "https://github.com/maddiedreese/multAIplayer/releases/download/v0.1.0-alpha.0/multAIplayer_0.1.0_aarch64.dmg",
  digest: `sha256:${"a".repeat(64)}`,
};
const trustedAssets = [
  diskImage,
  ...[
    "multAIplayer-macos-arm64.app.tar.gz",
    "multAIplayer-macos-arm64.app.tar.gz.sig",
    "latest.json",
    "SHA256SUMS.txt",
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
    ...contract,
    version: "0.1.0-alpha.0",
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
    ...contract,
    version: "0.0.0",
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

test("selects the greatest complete SemVer instead of the most recently created release", () => {
  const release = (version) => ({
    draft: false,
    tag_name: `v${version}`,
    assets: [
      {
        ...diskImage,
        name: `multAIplayer_${version}_aarch64.dmg`,
        browser_download_url: `https://github.com/maddiedreese/multAIplayer/releases/download/v${version}/multAIplayer_${version}_aarch64.dmg`,
      },
      ...trustedAssets.slice(1),
    ],
  });

  const manifest = manifestFromReleases([
    release("0.8.0"), // Created later, so GitHub returns it first.
    release("1.0.0-alpha.10"),
    release("1.0.0-alpha.2"),
  ]);

  assert.equal(manifest.version, "1.0.0-alpha.10");
  assert.match(manifest.downloads.macos.url, /v1\.0\.0-alpha\.10/);
});

test("ignores complete releases with invalid SemVer tags", () => {
  const invalid = {
    draft: false,
    tag_name: "v01.0.0",
    assets: trustedAssets.map((asset) => ({
      ...asset,
      browser_download_url: asset.browser_download_url?.replace("v0.1.0-alpha.0", "v01.0.0"),
    })),
  };
  assert.equal(manifestFromReleases([invalid]).supported, false);
});

test("returns a neutral no-release manifest when no trusted release exists", () => {
  const expected = {
    ...contract,
    version: "0.0.0",
    supported: false,
    downloads: {},
  };
  assert.deepEqual(manifestFromReleases([]), expected);
  assert.deepEqual(manifestFromReleases([{ draft: false, tag_name: "latest" }]), expected);
});

test("rejects malformed, mismatched, and untrusted manifest data at runtime", () => {
  const unavailable = { ...contract, version: "0.0.0", supported: false, downloads: {} };
  assert.equal(parseReleaseManifest(unavailable), unavailable);
  assert.throws(() => parseReleaseManifest({ ...unavailable, schemaVersion: 2 }), /schema/);
  assert.throws(() => parseReleaseManifest({ ...unavailable, releaseAssetSet: "unknown" }), /asset contract/);
  assert.throws(() => parseReleaseManifest({ ...unavailable, downloads: { macos: diskImage } }), /invalid release data/);
  const supported = {
    ...unavailable,
    supported: true,
    version: "1.0.0",
    downloads: { macos: { name: "multAIplayer_1.0.0_aarch64.dmg", url: "https://github.com/maddiedreese/multAIplayer/releases/download/v1.0.0/multAIplayer_1.0.0_aarch64.dmg", digest: `sha256:${"a".repeat(64)}`, architecture: "arm64" } },
  };
  assert.equal(parseReleaseManifest(supported), supported);
  assert.throws(() => parseReleaseManifest({ ...supported, downloads: { macos: { ...supported.downloads.macos, url: "https://evil.example/app.dmg" } } }), /origin/);
  assert.throws(() => parseReleaseManifest({ ...supported, downloads: { macos: { ...supported.downloads.macos, url: "https://github.com/other/maddiedreese/multAIplayer/releases/download/v1.0.0/multAIplayer_1.0.0_aarch64.dmg" } } }), /origin/);
});

test("requires the signed release files and official download origin", () => {
  const release = { draft: false, tag_name: "v0.1.0", html_url: "https://example.com", assets: [] };
  assert.equal(manifestFromReleases([release]).supported, false);
  assert.equal(manifestFromReleases([{ ...release, assets: [diskImage, diskImage, ...trustedAssets.slice(1)] }]).supported, false);
  for (const requiredAsset of trustedAssets.slice(1)) {
    const withoutRequiredAsset = trustedAssets.filter((asset) => asset !== requiredAsset);
    assert.equal(
      manifestFromReleases([{ ...release, assets: withoutRequiredAsset }]).supported,
      false,
      `release must include ${requiredAsset.name}`,
    );
    assert.equal(
      manifestFromReleases([{ ...release, assets: [...trustedAssets, requiredAsset] }]).supported,
      false,
      `release must include exactly one ${requiredAsset.name}`,
    );
  }
  assert.throws(
    () => manifestFromReleases([{ ...release, assets: [{ ...diskImage, browser_download_url: "https://evil.example/app.dmg" }, ...trustedAssets.slice(1)] }]),
    /official GitHub/
  );
});

test("pins the application repository's versioned release asset contract", async () => {
  const vendored = JSON.parse(await readFile(new URL("../release-assets.v1.json", import.meta.url), "utf8"));
  assert.doesNotThrow(() => assertCanonicalAssetContract(structuredClone(vendored), vendored));
  assert.throws(
    () => assertCanonicalAssetContract({ ...vendored, requiredExactNames: vendored.requiredExactNames.slice(1) }, vendored),
    /does not match/,
  );
});
