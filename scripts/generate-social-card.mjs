import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { parseReleaseManifest } from "../lib/release-contract.mjs";

const outputUrl = new URL("../public/og.png", import.meta.url);

export function socialCardSvg(manifest = { supported: false, version: "0.0.0" }) {
  const releaseLabel = manifest.supported ? `ALPHA ${manifest.version} AVAILABLE` : "SIGNED ALPHA PENDING";
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#11110f"/><stop offset="1" stop-color="#1d1910"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="#b99a48" stop-opacity=".24"/><stop offset="1" stop-color="#b99a48" stop-opacity="0"/></radialGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="22" stdDeviation="28" flood-opacity=".45"/></filter>
    <style>
      text{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;fill:#f3f0e8}.muted{fill:#aaa59a}.tiny{font-size:10px}.small{font-size:13px}.label{font-size:11px;letter-spacing:2px}.strong{font-weight:700}.line{stroke:#35322b;stroke-width:1}.panel{fill:#171815}.chip{fill:#25251f;stroke:#393830}.gold{fill:#d1ad58}.green{fill:#6aa176}
    </style>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <path d="M0 80H1200M0 160H1200M0 240H1200M0 320H1200M0 400H1200M0 480H1200M0 560H1200M80 0V630M160 0V630M240 0V630M320 0V630M400 0V630M480 0V630M560 0V630M640 0V630M720 0V630M800 0V630M880 0V630M960 0V630M1040 0V630M1120 0V630" stroke="#fff" stroke-opacity=".035"/>
  <circle cx="830" cy="320" r="430" fill="url(#glow)"/>

  <g transform="translate(54 58)">
    <rect width="58" height="58" rx="14" fill="#292a27" stroke="#5a574f"/>
    <path d="M18 16l14 13-14 13M34 42h9" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="76" y="26" font-size="27" class="strong">multAIplayer</text>
    <text x="76" y="47" class="small muted">group chat for Codex</text>
  </g>
  <text x="54" y="205" font-size="58" class="strong">Build with</text>
  <text x="54" y="267" font-size="58" class="strong">Codex.</text>
  <text x="54" y="329" font-size="58" class="strong muted">Together.</text>
  <text x="57" y="372" font-size="18" class="muted">A free, open-source room for teams</text>
  <text x="57" y="398" font-size="18" class="muted">working with Codex on one shared project.</text>
  <rect x="56" y="436" width="308" height="52" rx="8" fill="none" stroke="#b99a48"/>
  <circle cx="80" cy="462" r="5" class="gold"/>
  <text x="97" y="467" class="label gold strong">${releaseLabel}</text>
  <text x="57" y="526" class="small strong">APPLE SILICON</text><text x="173" y="526" class="small muted">· macOS 11 or later</text>
  <text x="57" y="558" class="small muted">multaiplayer.com</text>

  <g transform="translate(444 72)" filter="url(#shadow)">
    <rect width="710" height="486" rx="14" fill="#10110f" stroke="#4a463d"/>
    <rect width="710" height="38" rx="14" fill="#1b1a17"/><path d="M0 38H710" class="line"/>
    <circle cx="20" cy="19" r="4" fill="#6d685e"/><circle cx="34" cy="19" r="4" fill="#6d685e"/><circle cx="48" cy="19" r="4" fill="#6d685e"/>
    <text x="322" y="23" class="tiny muted">multAIplayer</text><circle cx="631" cy="19" r="4" class="green"/><text x="642" y="23" class="tiny muted">encrypted room</text>

    <rect y="38" width="154" height="448" class="panel"/><path d="M154 38V486M554 38V486" class="line"/>
    <text x="18" y="70" class="small strong">›_  multAIplayer</text>
    <rect x="16" y="88" width="122" height="32" rx="5" class="chip"/><circle cx="29" cy="104" r="4" class="green"/><text x="39" y="108" class="tiny muted">Signed in · casey</text>
    <text x="18" y="151" class="tiny muted">LAUNCH TEAM</text>
    <rect x="14" y="165" width="126" height="48" rx="6" class="chip"/><circle cx="29" cy="181" r="4" class="gold"/><text x="40" y="185" class="tiny strong">Desktop launch</text><text x="40" y="200" class="tiny muted">4 members</text>
    <circle cx="29" cy="235" r="4" fill="none" stroke="#777"/><text x="40" y="239" class="tiny muted">Relay operations</text>

    <text x="176" y="71" class="tiny muted">Launch Team</text><text x="176" y="91" class="small strong">Desktop launch</text>
    <rect x="279" y="54" width="184" height="35" rx="7" class="chip"/><text x="296" y="76" class="tiny strong">Chat</text><text x="342" y="76" class="tiny muted">Files</text><text x="386" y="76" class="tiny muted">Terminal</text><text x="441" y="76" class="tiny muted">Room</text>
    <rect x="172" y="111" width="374" height="48" rx="6" class="chip"/><circle cx="192" cy="135" r="11" fill="#2c2c27"/><text x="188" y="139" class="tiny gold">◇</text><text x="211" y="130" class="tiny strong">The host reviews local actions.</text><text x="211" y="145" class="tiny muted">Shared Codex activity stays visible to the room.</text>
    <circle cx="188" cy="188" r="13" fill="#292a27"/><text x="184" y="192" class="tiny">C</text><text x="211" y="184" class="tiny strong">Casey</text><text x="211" y="201" class="tiny muted">Let’s trace the failing workspace test first.</text>
    <circle cx="188" cy="234" r="13" fill="#292a27"/><text x="184" y="238" class="tiny">R</text><text x="211" y="230" class="tiny strong">Rowan</text><text x="211" y="247" class="tiny muted">I reproduced it and added a focused fixture.</text>
    <circle cx="188" cy="284" r="13" fill="#26231b"/><text x="182" y="288" class="small gold">✣</text><text x="211" y="280" class="tiny strong">Codex</text>
    <rect x="211" y="291" width="319" height="105" rx="6" class="panel" stroke="#34342f"/><text x="227" y="313" class="tiny strong">Debugging plan</text><text x="227" y="334" class="tiny muted">1. Reproduce the parser failure</text><text x="227" y="352" class="tiny muted">2. Inspect the smallest input boundary</text><text x="227" y="370" class="tiny muted">3. Run the focused regression test</text>
    <rect x="172" y="425" width="374" height="42" rx="6" class="chip"/><text x="188" y="451" class="tiny muted">Message the room, or type @Codex…</text>

    <text x="571" y="70" class="tiny muted">CONTEXT</text><text x="671" y="70" class="tiny strong">Files</text>
    <rect x="570" y="91" width="124" height="112" rx="6" class="panel" stroke="#34342f"/><text x="583" y="111" class="tiny muted">PROJECT</text><text x="583" y="135" class="small strong">northstar</text><text x="583" y="153" class="tiny muted">~/Projects/northstar</text><rect x="582" y="169" width="100" height="22" rx="4" fill="#eceee8"/><text x="616" y="184" class="tiny" fill="#111">Attached</text>
    <rect x="570" y="220" width="124" height="181" rx="6" class="panel" stroke="#34342f"/><text x="583" y="241" class="tiny muted">PROJECT FILES</text><text x="583" y="270" class="tiny">src/App.tsx</text><text x="583" y="299" class="tiny">src/relay.ts</text><text x="583" y="328" class="tiny">docs/release.md</text><text x="583" y="357" class="tiny">README.md</text>
  </g>
</svg>`;
}

export async function writeSocialCard() {
  const rawManifest = JSON.parse(await readFile(new URL("../public/releases/latest.json", import.meta.url), "utf8"));
  const manifest = parseReleaseManifest(rawManifest);
  const png = await sharp(Buffer.from(socialCardSvg(manifest))).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(outputUrl, png);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  writeSocialCard().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
