import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

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

async function main() {
  const html = await readFile(new URL("../out/invite.html", import.meta.url), "utf8");
  await writeFile(new URL("../out/_headers", import.meta.url), inviteHeaders(inlineScriptHashes(html)), "utf8");
  console.log("Generated exact invite CSP hashes in out/_headers.");
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
