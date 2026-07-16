import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  RELEASE_ASSET_SET,
  RELEASE_MANIFEST_SCHEMA_VERSION,
  parseReleaseManifest,
} from "../lib/release-contract.mjs";

const repository = process.env.MULTAIPLAYER_RELEASE_REPOSITORY ?? "maddiedreese/multAIplayer";
const apiUrl = process.env.MULTAIPLAYER_RELEASES_API_URL ?? `https://api.github.com/repos/${repository}/releases?per_page=100`;
const assetContractUrl = process.env.MULTAIPLAYER_RELEASE_ASSET_CONTRACT_URL ?? "https://raw.githubusercontent.com/maddiedreese/multAIplayer/main/docs/release-assets.v1.json";
const outputUrl = new URL("../public/releases/latest.json", import.meta.url);
const vendoredContractUrl = new URL("../release-assets.v1.json", import.meta.url);
const vendoredAssetContract = JSON.parse(readFileSync(vendoredContractUrl, "utf8"));
const diskImagePatterns = vendoredAssetContract.requiredNamePatterns.map((pattern) => new RegExp(pattern));

export function assertCanonicalAssetContract(canonical, vendored) {
  const relevant = (value) => ({
    schemaVersion: value?.schemaVersion,
    requiredExactNames: value?.requiredExactNames,
    requiredNamePatterns: value?.requiredNamePatterns,
    buildOutputExactNames: value?.buildOutputExactNames,
    publishGeneratedExactNames: value?.publishGeneratedExactNames,
    checksumManifest: value?.checksumManifest,
    artifactSbom: value?.artifactSbom,
  });
  if (JSON.stringify(relevant(canonical)) !== JSON.stringify(relevant(vendored))) {
    throw new Error("The website release asset contract does not match the application repository.");
  }
}

export function manifestFromReleases(releases) {
  const candidates = releases.flatMap((release) => {
    if (release?.draft) return [];
    const version = parseSemVerTag(release?.tag_name);
    const diskImage = trustedReleaseDiskImage(release);
    return version && diskImage ? [{ release, version, diskImage }] : [];
  });
  candidates.sort((left, right) => compareSemVer(right.version, left.version));
  const selected = candidates[0];
  if (!selected) return unavailableManifest();

  const { release, version, diskImage } = selected;

  const downloadUrl = normalizedReleaseDownloadUrl(diskImage.browser_download_url, repository, release.tag_name);
  const digest = typeof diskImage.digest === "string" && /^sha256:[a-f0-9]{64}$/.test(diskImage.digest)
    ? diskImage.digest
    : undefined;
  const architecture = /(?:aarch64|arm64)/i.test(diskImage.name)
    ? "arm64"
    : /(?:universal)/i.test(diskImage.name) ? "universal" : /(?:x64|x86_64)/i.test(diskImage.name) ? "x64" : "macos";

  return parseReleaseManifest({
    schemaVersion: RELEASE_MANIFEST_SCHEMA_VERSION,
    releaseAssetSet: RELEASE_ASSET_SET,
    version: version.raw,
    supported: true,
    downloads: {
      macos: {
        url: downloadUrl,
        name: diskImage.name,
        architecture,
        ...(digest ? { digest } : {}),
      },
    },
  });
}

function parseSemVerTag(value) {
  if (typeof value !== "string") return null;
  const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?$/.exec(value);
  if (!match) return null;
  return {
    raw: value.slice(1),
    core: match.slice(1, 4).map((part) => BigInt(part)),
    prerelease: match[4]?.split(".") ?? [],
  };
}

function compareSemVer(left, right) {
  for (let index = 0; index < left.core.length; index += 1) {
    if (left.core[index] !== right.core[index]) return left.core[index] > right.core[index] ? 1 : -1;
  }
  if (left.prerelease.length === 0 || right.prerelease.length === 0) {
    return left.prerelease.length === right.prerelease.length ? 0 : left.prerelease.length === 0 ? 1 : -1;
  }
  const length = Math.max(left.prerelease.length, right.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = left.prerelease[index];
    const rightPart = right.prerelease[index];
    if (leftPart === undefined || rightPart === undefined) return leftPart === undefined ? -1 : 1;
    if (leftPart === rightPart) continue;
    const leftNumeric = /^\d+$/.test(leftPart);
    const rightNumeric = /^\d+$/.test(rightPart);
    if (leftNumeric && rightNumeric) return BigInt(leftPart) > BigInt(rightPart) ? 1 : -1;
    if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
    return leftPart > rightPart ? 1 : -1;
  }
  return 0;
}

function trustedReleaseDiskImage(release) {
  const assets = Array.isArray(release?.assets) ? release.assets : [];
  if (!vendoredAssetContract.requiredExactNames.every((name) => assets.filter((asset) => asset?.name === name).length === 1)) return null;
  const diskImages = assets.filter((asset) =>
    typeof asset?.name === "string" &&
    diskImagePatterns.some((pattern) => pattern.test(asset.name)) &&
    typeof asset.digest === "string" &&
    /^sha256:[a-f0-9]{64}$/.test(asset.digest)
  );
  return diskImages.length === 1 ? diskImages[0] : null;
}

function unavailableManifest() {
  return parseReleaseManifest({
    schemaVersion: RELEASE_MANIFEST_SCHEMA_VERSION,
    releaseAssetSet: RELEASE_ASSET_SET,
    version: "0.0.0",
    supported: false,
    downloads: {},
  });
}

function normalizedReleaseDownloadUrl(value, expectedRepository, expectedTag) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The macOS disk image has an invalid download URL.");
  }
  const expectedPrefix = `/maddiedreese/multAIplayer/releases/download/${encodeURIComponent(String(expectedTag))}/`;
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

  const [response, contractResponse, vendoredContractText] = await Promise.all([
    fetchImpl(apiUrl, { headers }),
    fetchImpl(assetContractUrl, { headers: { "User-Agent": headers["User-Agent"] } }),
    readFile(vendoredContractUrl, "utf8"),
  ]);
  if (!response.ok) throw new Error(`GitHub Releases request failed with ${response.status}.`);
  if (!contractResponse.ok) throw new Error(`Release asset contract request failed with ${contractResponse.status}.`);
  const releases = await response.json();
  if (!Array.isArray(releases)) throw new Error("GitHub Releases returned an unexpected response.");
  assertCanonicalAssetContract(await contractResponse.json(), JSON.parse(vendoredContractText));
  return manifestFromReleases(releases);
}

async function main() {
  const manifest = await fetchManifest();
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
