# Contributing to the multAIplayer website

Thanks for helping improve the public website, invitation landing, or release-download surface. Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities through [SECURITY.md](SECURITY.md), never through a public issue.

## Before opening a pull request

Use Node.js 22 or newer, then run:

```sh
npm ci
npm test
npm run lint
MULTAIPLAYER_APPLE_TEAM_ID=ABCDEFGHIJ npm run build
```

The Team ID above is a format-valid local fixture only. Production builds must use the confirmed public Team ID configured by the operator.

Keep changes focused and include tests for changed claims or contracts. The website is a static export: do not add analytics, telemetry, support widgets, form submissions, or third-party runtime connections. Do not add an invitation capability to HTML, logs, browser storage, cookies, telemetry, analytics, referrers, or tests.

## Repository boundaries

- The application repository’s threat model is the normative source for security properties and residual risks. Website copy should link to it, not invent a parallel guarantee.
- `public/releases/latest.json` is generated from the greatest valid SemVer among complete GitHub Releases, independent of GitHub creation order. It is a download-discovery record, not the desktop updater trust root.
- The invitation route has a stricter no-store, no-referrer, no-connect policy and exact inline-script hashes. Preserve both `/invite` paths and the capture tests.
- Privacy or Terms changes must stay aligned with the deployed relay, authentication scopes, retention, deletion, subprocess, provider, and platform behavior.
- Generated assets should be changed through their scripts. Do not hand-edit `public/og.png` or the generated `_headers` and Apple association files in `out/`.

Use a clear Conventional Commit subject (`fix:`, `docs:`, `feat:`, or `chore:`). Pull requests should explain the user-visible effect, the relevant trust or release boundary, and the checks run.

## Operator changes

The [README](README.md) owns deployment, release-manifest, rollback, and invitation-domain checks. A release-manifest update is safe to publish only after the application release contains the complete versioned asset contract. An incomplete or malformed release must leave the site in its explicit unavailable state.
