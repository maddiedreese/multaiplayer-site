export const RELEASE_MANIFEST_SCHEMA_VERSION = 1;
export const RELEASE_ASSET_SET = "macos-arm64-v1";

const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const digestPattern = /^sha256:[a-f0-9]{64}$/;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsedHttpsUrl(value, expectedHost) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      (!expectedHost || url.hostname === expectedHost) &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash
      ? url
      : null;
  } catch {
    return null;
  }
}

export function parseReleaseManifest(value) {
  if (!isRecord(value)) throw new Error("Release manifest must be an object.");
  if (value.schemaVersion !== RELEASE_MANIFEST_SCHEMA_VERSION) throw new Error("Unsupported release manifest schema.");
  if (value.releaseAssetSet !== RELEASE_ASSET_SET) throw new Error("Unsupported release asset contract.");
  if (typeof value.supported !== "boolean") throw new Error("Release support flag is invalid.");
  if (typeof value.version !== "string" || !versionPattern.test(value.version)) throw new Error("Release version is invalid.");
  if (!isRecord(value.downloads)) throw new Error("Release downloads must be an object.");

  const macos = value.downloads.macos;
  if (!value.supported) {
    if (value.version !== "0.0.0" || Object.keys(value.downloads).length !== 0) throw new Error("Unavailable release manifest carries invalid release data.");
    return value;
  }
  if (!isRecord(macos) || Object.keys(value.downloads).length !== 1) throw new Error("Supported release must have one macOS download.");
  if (macos.architecture !== "arm64" || typeof macos.name !== "string" || !/(?:aarch64|arm64).*\.dmg$/i.test(macos.name)) throw new Error("macOS download identity is invalid.");
  if (value.version === "0.0.0") throw new Error("Supported release identity is invalid.");
  const downloadUrl = parsedHttpsUrl(macos.url, "github.com");
  if (!downloadUrl || downloadUrl.pathname !== `/maddiedreese/multAIplayer/releases/download/v${value.version}/${macos.name}`) throw new Error("macOS download origin is invalid.");
  if (typeof macos.digest !== "string" || !digestPattern.test(macos.digest)) throw new Error("macOS download digest is invalid.");
  return value;
}
