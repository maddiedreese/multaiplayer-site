# multAIplayer website

The public website for [multAIplayer](https://github.com/maddiedreese/multAIplayer), a private group chat for building with Codex together.

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

Before releasing a desktop build, verify that both live association files contain `<APPLE_TEAM_ID>.com.multaiplayer.desktop`, that the signed app contains both associated-domain entitlements, and that cold-start and already-running universal-link journeys pass.

## Release manifest

The desktop app checks `https://multaiplayer.com/releases/latest.json` for updates. `.github/workflows/update-release-manifest.yml` checks the application repository for the newest non-draft GitHub Release, including prereleases, and commits the generated manifest only when it changes. That commit triggers the normal Netlify deployment.

Run the updater locally with:

```bash
npm run release:manifest
```

Use `--dry-run` to print the manifest without writing it.
The scheduled workflow also uses `--allow-missing`, which leaves the launch placeholder intact until the first GitHub Release exists.
Each published release must contain exactly one official `.dmg`; its direct URL, architecture, and available SHA-256 digest are included in the manifest for the invitation landing.
To trigger the desktop app’s stronger security-update banner, prefix the release name with `[Security]` or add `Security update: true` on its own line in the release body.
