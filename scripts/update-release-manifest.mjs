import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repository = process.env.MULTAIPLAYER_RELEASE_REPOSITORY ?? "maddiedreese/multAIplayer";
const apiUrl = process.env.MULTAIPLAYER_RELEASES_API_URL ?? `https://api.github.com/repos/${repository}/releases?per_page=20`;
const outputUrl = new URL("../public/releases/latest.json", import.meta.url);

export function manifestFromReleases(releases) {
  const release = releases.find((candidate) => !candidate.draft);
  if (!release) throw new Error("No published GitHub Release is available.");

  const version = String(release.tag_name ?? "").replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Unsupported release tag: ${release.tag_name ?? "missing"}`);
  }

  const body = String(release.body ?? "").trim();
  const firstParagraph = body.split(/\n\s*\n/).find((paragraph) => paragraph.trim())?.replace(/\s+/g, " ");
  const notes = firstParagraph?.slice(0, 280) || String(release.name ?? `multAIplayer ${version}`);
  const diskImages = Array.isArray(release.assets)
    ? release.assets.filter((asset) => typeof asset?.name === "string" && asset.name.toLowerCase().endsWith(".dmg"))
    : [];
  if (diskImages.length !== 1) throw new Error(`Release ${release.tag_name} must contain exactly one macOS disk image.`);
  const diskImage = diskImages[0];
  const downloadUrl = normalizedReleaseDownloadUrl(diskImage.browser_download_url, repository);
  const digest = typeof diskImage.digest === "string" && /^sha256:[a-f0-9]{64}$/.test(diskImage.digest)
    ? diskImage.digest
    : undefined;
  const architecture = /(?:aarch64|arm64)/i.test(diskImage.name)
    ? "arm64"
    : /(?:universal)/i.test(diskImage.name) ? "universal" : /(?:x64|x86_64)/i.test(diskImage.name) ? "x64" : "macos";

  return {
    version,
    url: release.html_url,
    notes,
    security: /^\[security\]/i.test(String(release.name ?? "").trim()) || /(?:^|\n)Security update:\s*(?:true|yes)(?:\n|$)/i.test(body),
    downloads: {
      macos: {
        url: downloadUrl,
        name: diskImage.name,
        architecture,
        ...(digest ? { digest } : {}),
      },
    },
  };
}

function normalizedReleaseDownloadUrl(value, expectedRepository) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The macOS disk image has an invalid download URL.");
  }
  const expectedPrefix = `/maddiedreese/multAIplayer/releases/download/`;
  if (url.protocol !== "https:" || url.hostname !== "github.com" || !url.pathname.startsWith(expectedPrefix) || expectedRepository !== "maddiedreese/multAIplayer") {
    throw new Error("The macOS disk image must use the official GitHub release download origin.");
  }
  return url.toString();
}

export async function fetchManifest(fetchImpl = fetch) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "multaiplayer-site-release-manifest",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetchImpl(apiUrl, { headers });
  if (!response.ok) throw new Error(`GitHub Releases request failed with ${response.status}.`);
  const releases = await response.json();
  if (!Array.isArray(releases)) throw new Error("GitHub Releases returned an unexpected response.");
  return manifestFromReleases(releases);
}

async function main() {
  let manifest;
  try {
    manifest = await fetchManifest();
  } catch (error) {
    if (process.argv.includes("--allow-missing") && error instanceof Error && /No published GitHub Release/.test(error.message)) {
      console.log("No published app release exists yet; keeping the launch placeholder manifest.");
      return;
    }
    throw error;
  }
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  if (process.argv.includes("--dry-run")) {
    process.stdout.write(serialized);
    return;
  }
  await writeFile(outputUrl, serialized, "utf8");
  console.log(`Updated ${fileURLToPath(outputUrl)} for ${manifest.version}.`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
