import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";

export function inlineScriptHashes(html) {
  const hashes = [];
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
    if (!match[1]) continue;
    const digest = createHash("sha256").update(match[1], "utf8").digest("base64");
    hashes.push(`'sha256-${digest}'`);
  }
  return [...new Set(hashes)];
}

export function inviteHeaders(hashes) {
  if (!Array.isArray(hashes) || hashes.length === 0) throw new Error("The invite export must contain at least one hashed inline script.");
  const csp = [
    "default-src 'none'",
    `script-src 'self' ${hashes.join(" ")}`,
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'none'",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  const block = (path) => `${path}\n  Cache-Control: no-store\n  Content-Security-Policy: ${csp}\n  Cross-Origin-Opener-Policy: same-origin\n  Cross-Origin-Resource-Policy: same-origin\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  X-Robots-Tag: noindex, nofollow, noarchive`;
  return `${block("/invite")}\n\n${block("/invite/")}\n`;
}

export function siteHeaders(hashes) {
  if (!Array.isArray(hashes) || hashes.length === 0) throw new Error("The static export must contain at least one hashed inline script.");
  const csp = [
    "default-src 'none'",
    `script-src 'self' https://www.googletagmanager.com ${hashes.join(" ")}`,
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src https://www.google-analytics.com https://region1.google-analytics.com",
    "media-src 'none'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "worker-src 'none'",
    "manifest-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  return `/*\n  Content-Security-Policy: ${csp}\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n  Referrer-Policy: no-referrer\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n`;
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
    return entry.isDirectory() ? htmlFiles(url) : entry.name.endsWith(".html") ? [url] : [];
  }));
  return nested.flat();
}

async function main() {
  const output = new URL("../out/", import.meta.url);
  const files = await htmlFiles(output);
  const pages = await Promise.all(files.map((file) => readFile(file, "utf8")));
  const allHashes = [...new Set(pages.flatMap(inlineScriptHashes))];
  const inviteHtml = await readFile(new URL("invite.html", output), "utf8");
  const headers = `${siteHeaders(allHashes)}\n${inviteHeaders(inlineScriptHashes(inviteHtml))}`;
  await writeFile(new URL("_headers", output), headers, "utf8");
  console.log("Generated exact static-export and invitation CSP hashes in out/_headers.");
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
