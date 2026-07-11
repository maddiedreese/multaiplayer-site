# multAIplayer website

The public website for [multAIplayer](https://github.com/maddiedreese/multAIplayer), a private group chat for building with Codex together.

## Local development

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
```

The static export is written to `out/`. Netlify is configured through `netlify.toml` to build and publish that directory.

## Release manifest

The desktop app checks `https://multaiplayer.com/releases/latest.json` for updates. `.github/workflows/update-release-manifest.yml` checks the application repository for the newest non-draft GitHub Release, including prereleases, and commits the generated manifest only when it changes. That commit triggers the normal Netlify deployment.

Run the updater locally with:

```bash
npm run release:manifest
```

Use `--dry-run` to print the manifest without writing it.
