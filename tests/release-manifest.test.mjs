import assert from "node:assert/strict";
import test from "node:test";
import { manifestFromReleases } from "../scripts/update-release-manifest.mjs";

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
    },
  ]);

  assert.deepEqual(manifest, {
    version: "0.1.0-alpha.0",
    url: "https://github.com/maddiedreese/multAIplayer/releases/tag/v0.1.0-alpha.0",
    notes: "A focused first release.",
    security: false,
  });
});

test("marks security releases from release copy", () => {
  const manifest = manifestFromReleases([{
    draft: false,
    tag_name: "v0.1.1-alpha.0",
    name: "Security update",
    body: "Strengthens room trust handling.",
    html_url: "https://example.com/release",
  }]);
  assert.equal(manifest.security, true);
});

test("rejects missing and malformed release tags", () => {
  assert.throws(() => manifestFromReleases([]), /No published/);
  assert.throws(() => manifestFromReleases([{ draft: false, tag_name: "latest" }]), /Unsupported release tag/);
});
