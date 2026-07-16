import manifestJson from "../public/releases/latest.json";
import { parseReleaseManifest } from "./release-contract.mjs";

export const releaseManifest = parseReleaseManifest(manifestJson);
export const supportedMacDownload =
  releaseManifest.supported && releaseManifest.downloads.macos?.architecture === "arm64"
    ? { ...releaseManifest.downloads.macos, version: releaseManifest.version }
    : null;
