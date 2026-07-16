# multAIplayer website

The public website for [multAIplayer](https://github.com/maddiedreese/multAIplayer), a private group chat for building with Codex together.

The site publishes the service [Privacy Policy](https://multaiplayer.com/privacy) and [Terms of Service](https://multaiplayer.com/terms). Review both whenever the relay, authentication scopes, retention, deletion behavior, subprocess boundaries, infrastructure providers, or supported platform changes. Automated checks cover routing and security behavior; they do not substitute for reviewing public claims and legal text.

The source is licensed under [Apache-2.0](LICENSE). See [CONTRIBUTING.md](CONTRIBUTING.md) for change and verification guidance, [SECURITY.md](SECURITY.md) for private vulnerability reporting, and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations.

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
MULTAIPLAYER_APPLE_TEAM_ID=YOURTEAMID npm run build
```

The static export is written to `out/`. Netlify is configured through `netlify.toml` to build and publish that directory.

`MULTAIPLAYER_APPLE_TEAM_ID` is the public 10-character Team ID of the Developer ID identity that signs `com.multaiplayer.desktop`. The build fails when it is absent or malformed, then generates the Apple association file for `/invite`. Production must configure the confirmed value in Netlify; do not commit or guess it. The build also regenerates the social card from `scripts/generate-social-card.mjs`; edit that source instead of hand-editing the PNG.

## Invitation links

Official invitations use this all-fragment contract:

```text
https://open.multaiplayer.com/invite#invite=<id>&multaiplayerJoin=<capability>&approval=request
```

Both `open.multaiplayer.com` and `multaiplayer.com` must serve this same export and the generated `/.well-known/apple-app-site-association` directly, without redirects. `open.multaiplayer.com` is the canonical sharing host. The apex host is the user-initiated cross-host retry after installation.

The landing captures a bounded invitation before hydration, immediately removes every fragment from `/invite` and `/invite/`, and retains a valid link in memory only until navigation. Both normalized paths are listed explicitly in the association file. It never puts the capability in HTML, storage, cookies, analytics, telemetry, or the clipboard. The exported `_headers` file contains exact SHA-256 hashes for its inline scripts and a no-store, no-referrer invitation policy.

Do not add analytics, telemetry, third-party assets, support widgets, form submission, or outbound connections to the invitation route. A complete invitation must never be copied into logs, diagnostics, issues, or support requests. Any change to capture, rendering, headers, hosting, or redirects must preserve the fragment tests and exact invitation CSP.

Before releasing a desktop build, verify that both live association files contain `<APPLE_TEAM_ID>.com.multaiplayer.desktop`, that the signed app contains both associated-domain entitlements, and that cold-start and already-running universal-link journeys pass.

## Release manifest

The website checks the application repository for non-draft GitHub Releases, including prereleases, and selects the greatest valid SemVer containing the signed updater files, checksums, and exactly one digested Apple-silicon DMG. GitHub creation order cannot make the manifest regress to a lower version. The site publishes `https://multaiplayer.com/releases/latest.json` for website download surfaces. The desktop uses the separately signed Tauri manifest on the application repository's pinned `update-channel` branch; the website manifest is not an updater trust root.

Run the updater locally with:

```bash
npm run release:manifest
```

Use `--dry-run` to print the manifest without writing it.
A release is supported only when it satisfies the application repository’s versioned `docs/release-assets.v1.json` contract: exactly one SHA-256-digested arm64 `.dmg` plus every exact stable artifact in that contract. This repository pins a reviewed copy at `release-assets.v1.json`; the scheduled updater compares it with the application repository before accepting a release. The website’s matching `macos-arm64-v1` parser fails closed on an unknown schema or asset contract. If no release has the complete set, the website manifest uses a neutral `0.0.0` no-release record, contains no download, and every surface derives an unavailable state from that record. The direct DMG URL, architecture, and digest appear only for a supported release.

## Production operation and rollback

Netlify builds `main` with Node.js 22, the confirmed `MULTAIPLAYER_APPLE_TEAM_ID`, and `npm run build`. Both `multaiplayer.com` and `open.multaiplayer.com` must serve the same deploy. After each production deploy, verify the home, FAQ, Privacy, Terms, updater-key, invitation, release-manifest, and Apple association routes; confirm the invitation response is no-store/no-referrer with its generated CSP; and confirm a supported download, when present, points only to the official GitHub release.

The hourly release-manifest workflow commits only a changed generated manifest. A failed fetch, unknown contract, incomplete artifact set, malformed digest, or untrusted download origin must not publish a download. If a site deployment is defective, roll back to the last verified Netlify deploy and revert the responsible commit on `main`; do not patch generated output in the hosting UI. If an application release is defective, mark it draft or remove the incomplete/affected release assets so the next manifest run returns to the previous complete supported release or the explicit unavailable state, then dispatch the workflow and verify the live JSON and all download surfaces.

Before changing either custom domain, preserve HTTPS, HSTS, both universal-link association files, and the exact `/invite` and `/invite/` behavior. DNS, Netlify environment values, GitHub repository settings, and production Team IDs are operator configuration and must not be committed as credentials.
