export const RELEASE_MANIFEST_SCHEMA_VERSION: 1;
export const RELEASE_ASSET_SET: "macos-arm64-v1";

export interface ManifestMacDownload {
  url: string;
  name: string;
  architecture: "arm64";
  digest: string;
}

export interface ReleaseManifest {
  schemaVersion: 1;
  releaseAssetSet: "macos-arm64-v1";
  version: string;
  supported: boolean;
  downloads: { macos?: ManifestMacDownload };
}

export function parseReleaseManifest(value: unknown): ReleaseManifest;
