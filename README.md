# multAIplayer website

The public website for [multAIplayer](https://github.com/maddiedreese/multAIplayer), a private group chat for building with Codex together.

The site publishes the service [Privacy Policy](https://multaiplayer.com/privacy) and [Terms of Service](https://multaiplayer.com/terms). Their effective date, operator identity, platform support, hosted-service behavior, and data inventory are contract-tested in `tests/site-policy.test.mjs`. Update the policies whenever the relay, authentication scopes, retention, deletion behavior, subprocess boundaries, infrastructure providers, or supported platform changes.

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

`MULTAIPLAYER_APPLE_TEAM_ID` is the public 10-character Team ID of the Developer ID identity that signs `com.multaiplayer.desktop`. The build fails when it is absent or malformed, then generates the Apple association file for `/invite`. Production must configure the confirmed value in Netlify; do not commit or guess it.

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

The desktop app checks `https://multaiplayer.com/releases/latest.json` for updates. `.github/workflows/update-release-manifest.yml` checks the application repository for a non-draft GitHub Release, including prereleases, that contains the complete trusted release-workflow asset set. It commits the generated manifest only when it changes, which triggers the normal Netlify deployment.

Run the updater locally with:

```bash
npm run release:manifest
```

Use `--dry-run` to print the manifest without writing it.
The scheduled workflow also uses `--allow-missing`. A release is supported only when it contains exactly one SHA-256-digested arm64 `.dmg`, the arm64 app archive, checksum manifest, SPDX SBOM, and both Sigstore bundles emitted after signing/notarization verification. If no release has that complete set, the manifest contains no download and every website surface renders **Signed alpha coming soon** instead of exposing the unsupported scaffold. The direct DMG URL, architecture, and digest appear only for a supported release.
To trigger the desktop app’s stronger security-update banner, prefix the release name with `[Security]` or add `Security update: true` on its own line in the release body.
