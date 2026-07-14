import manifestJson from "../public/releases/latest.json";

interface ManifestMacDownload {
  url: string;
  name: string;
  architecture: "arm64";
  digest?: string;
}

interface ReleaseManifest {
  version: string;
  url: string;
  notes: string;
  security: boolean;
  supported: boolean;
  downloads: { macos?: ManifestMacDownload };
}

export const releaseManifest = manifestJson as ReleaseManifest;
export const supportedMacDownload =
  releaseManifest.supported && releaseManifest.downloads.macos?.architecture === "arm64"
    ? { ...releaseManifest.downloads.macos, version: releaseManifest.version }
    : null;
