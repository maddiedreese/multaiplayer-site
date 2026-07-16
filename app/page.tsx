import Image from "next/image";
import Link from "next/link";
import { ProductRoomPreview } from "./components/ProductRoomPreview";
import { releaseManifest, supportedMacDownload } from "../lib/release-manifest";

const githubUrl = "https://github.com/maddiedreese/multAIplayer";
const websiteGithubUrl = "https://github.com/maddiedreese/multaiplayer-site";

const features = [
  {
    number: "01",
    title: "Edit together, with Monaco",
    copy: "Browse the host’s project, open bounded previews and diffs, and edit text files in a language-aware Monaco Editor. Host saves are direct; teammate saves wait for host approval.",
  },
  {
    number: "02",
    title: "Room terminals with xterm.js",
    copy: "Named xterm.js terminals connect to a native Rust PTY. The host can run, restart, and inspect them while exact command and input requests stay behind native confirmation.",
  },
  {
    number: "03",
    title: "Preview inside the room",
    copy: "Open approved sites in isolated room browser tabs. To share a localhost build, install cloudflared and start a temporary Cloudflare Quick Tunnel—the relay never proxies the preview.",
  },
  {
    number: "04",
    title: "From Codex to pull request",
    copy: "Follow structured Codex work, review the current Git working tree, create a branch, commit, push, open a draft PR, and watch GitHub Actions without losing the room’s context.",
  },
  {
    number: "05",
    title: "Take the room with you",
    copy: "Export display history as a passphrase-encrypted age archive and reopen it later as a read-only library—even while signed out or disconnected. Live keys and authority are never exported.",
  },
];

const trustItems = [
  { label: "Security boundaries, exclusions, and residual risks", href: `${githubUrl}/blob/main/docs/threat-model.md` },
  { label: "Protocol and key lifecycle mechanics", href: `${githubUrl}/blob/main/docs/cryptography.md` },
  { label: "Known alpha limitations", href: `${githubUrl}/blob/main/docs/alpha-limitations.md` },
  { label: "Updater public-key fingerprint", href: "/security/updater-key" },
  { label: "Private vulnerability reports", href: `${githubUrl}/security/advisories/new` },
];

const faqs = [
  {
    q: "What accounts do I need?",
    a: "A GitHub account is required to sign in. To host a room, you also need a ChatGPT account with Codex access. multAIplayer uses the host’s local Codex session, so no separate OpenAI API key is required; a separate paid ChatGPT plan or subscription may still be required for that access.",
  },
  {
    q: "Is multAIplayer an OpenAI or Codex product?",
    a: "No. multAIplayer is an independent open-source project and is not affiliated with, endorsed by, or sponsored by OpenAI. The OpenAI and Codex names belong to OpenAI.",
  },
  {
    q: "Does multAIplayer replace Codex’s system or developer instructions?",
    a: "No. multAIplayer connects to the standard open-source Codex app-server on the active host. For an approved turn, it constructs a bounded ordinary user-turn prompt from attributed room conversation and selected context, with product-authored safety framing that labels teammate, file, terminal, browser, and tool material as untrusted.",
  },
  {
    q: "Is multAIplayer free and open source?",
    a: "Yes. The multAIplayer desktop app and self-hostable relay are completely free and open source under the Apache-2.0 license. A separate paid ChatGPT plan or subscription may still be required for a host’s Codex access.",
  },
  {
    q: "Can I self-host the relay?",
    a: "Yes. The relay is deliberately single-node: one process owns SQLite and WebSocket fan-out behind a trusted TLS reverse proxy or WAF. Scale by placing complete teams on separate relays, not by running multiple processes against one store. The official alpha has no uptime or continuity guarantee.",
  },
  {
    q: "What platforms are supported?",
    a: "The alpha supports Apple silicon Macs running macOS 11 or later. Intel Macs, Windows, and Linux desktop packages are not supported.",
  },
  {
    q: "Is it ready for sensitive production work?",
    a: "No. This is experimental alpha software. Teams should review the threat model and known limitations before using private, regulated, or high-stakes projects.",
  },
  {
    q: "Who maintains multAIplayer and the hosted relay?",
    a: "multAIplayer is currently maintained by one person, Maddie D. Reese. Releases, security fixes, compatibility, and continued operation of the hosted relay are not guaranteed, so keep normal project and Git backups and review the project’s continuity guidance before depending on the alpha for important work.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="multAIplayer home">
          <Image src="/brand/icon.png" alt="" width={34} height={34} priority />
          <span>
            <strong>multAIplayer</strong>
            <small>group chat for Codex</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#how-it-works">How it works</a>
          <Link href="/privacy">Privacy</Link>
          <a href="#open-source">Open source</a>
          <Link href="/faq">FAQ</Link>
        </nav>
        {supportedMacDownload ? <a className="header-cta" href={supportedMacDownload.url}>Download alpha</a> : <span className="header-cta release-unavailable" aria-disabled="true">Signed download pending</span>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Build with Codex.<br /><span>Together.</span></h1>
          <p className="hero-lede">
            A completely free, open-source team room for the conversation, code, tools, and decisions around a shared Codex session.
          </p>
          <div className="hero-actions">
            {supportedMacDownload ? <a className="button button-primary" href={supportedMacDownload.url}>Download for Apple silicon <span>↗</span></a> : <span className="button button-primary release-unavailable" aria-disabled="true">Signed download not yet published</span>}
            <a className="button button-secondary" href={githubUrl}>View on GitHub <span>↗</span></a>
          </div>
          <div className="hero-requirements" aria-label="Account requirements">
            <div><strong>Host a room</strong><span>ChatGPT account with Codex access required</span></div>
            <div><strong>Sign in</strong><span>GitHub account required</span></div>
          </div>
          <p className="hero-note">Self-hostable relay · Made by <a href="https://x.com/maddiedreese">@maddiedreese ↗</a></p>
          <aside className="hero-disclaimer">
            <strong>Independent open-source project</strong>
            <span>multAIplayer is an independent open-source project and is not affiliated with, endorsed by, or sponsored by OpenAI. The OpenAI and Codex names belong to OpenAI.</span>
          </aside>
        </div>

        <div className="hero-stage" aria-label="multAIplayer desktop app preview">
          <div className="stage-glow" />
          <div className="app-frame">
            <div className="window-bar">
              <div className="traffic-lights"><i /><i /><i /></div>
              <span>multAIplayer</span>
              <span className="window-status"><i /> encrypted room</span>
            </div>
            <ProductRoomPreview theme="dark" />
          </div>
          <div className="floating-card host-card"><span>Active host</span><strong>Casey</strong><i>approved</i></div>
          <div className="floating-card event-card"><span className="bot-mark">✣</span><div><strong>Codex is working</strong><small>3 teammates following</small></div></div>
        </div>
      </section>

      <section className="intro section-light" id="how-it-works">
        <div className="section-kicker"><span>01</span> One room, shared momentum</div>
        <div className="intro-heading">
          <h2>Pair programming grew up.<br />Now it has a whole team.</h2>
          <p>multAIplayer keeps the conversation, Monaco editor, xterm.js terminals, isolated browser previews, Git workflow, and Codex activity in the same room—without turning your local machine into an invisible shared service.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div className={`feature-glyph glyph-${feature.number}`} aria-hidden="true"><i /><i /><i /></div>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section">
        <div className="workflow-visual">
          <div className="workflow-window current-app-window">
            <div className="window-bar">
              <div className="traffic-lights"><i /><i /><i /></div>
              <span>multAIplayer · light</span>
              <span className="window-status"><i /> room live</span>
            </div>
            <ProductRoomPreview theme="light" compact />
          </div>
        </div>
        <div className="workflow-copy">
          <div className="section-kicker section-kicker-dark"><span>02</span> The host stays in control</div>
          <h2>Shared context.<br />Explicit authority.</h2>
          <p>Teammates can ask, inspect, and follow along. The active host reviews what Codex will receive and decides what can touch their machine.</p>
          <ol>
            <li><span>1</span><div><strong>Someone proposes a turn</strong><small>The room sees the request and its place in the queue.</small></div></li>
            <li><span>2</span><div><strong>The host reviews context</strong><small>Project, chat, attachments, terminal, browser, and sandbox are visible before approval.</small></div></li>
            <li><span>3</span><div><strong>Everyone follows the result</strong><small>Room-safe lifecycle events and project changes stay in view.</small></div></li>
          </ol>
        </div>
      </section>

      <section className="privacy section-light" id="privacy">
        <div className="privacy-copy">
          <div className="section-kicker"><span>03</span> Private by design</div>
          <h2>Review the trust boundaries.<br />Then decide what fits.</h2>
          <p>Room cryptography uses RFC 9420 MLS through <code>mls-rs</code>; the multAIplayer integration is unaudited. The repository threat model is the sole normative source for security claims, evidence, exclusions, and residual risks.</p>
          <ul>
            {trustItems.map((item) => <li key={item.href}><span>→</span><a href={item.href}>{item.label}</a></li>)}
          </ul>
        </div>
        <div className="privacy-visual">
          <div className="privacy-diagram" aria-label="Encrypted relay architecture diagram">
            <div className="diagram-label">ROOM TRAFFIC</div>
            <div className="device-node device-one"><div>C</div><strong>Casey</strong><small>active host</small></div>
            <div className="device-node device-two"><div>S</div><strong>Sam</strong><small>teammate</small></div>
            <div className="device-node device-three"><div>P</div><strong>Priya</strong><small>teammate</small></div>
            <div className="relay-node"><span>◈</span><strong>relay</strong><small>ciphertext + routing metadata</small></div>
            <div className="route route-a"><i /><i /><i /></div>
            <div className="route route-b"><i /><i /><i /></div>
            <div className="route route-c"><i /><i /><i /></div>
            <p>Normative data-flow details: threat model</p>
          </div>
          <div className="local-boundary"><span>HOST MACHINE</span><div>Project</div><div>Codex</div><div>Terminal</div><div>Browser</div></div>
        </div>
      </section>

      <section className="open-source" id="open-source">
        <div>
          <div className="section-kicker section-kicker-dark"><span>04</span> Open source, from day one</div>
          <h2>See how the room works.<br />Run the relay yourself.</h2>
        </div>
        <div className="source-copy">
          <p>Inspect the protocol, crypto boundaries, desktop client, and relay. Self-host for your team or help shape the alpha in the open.</p>
          <div className="source-actions">
            <a className="button button-inverse" href={githubUrl}>Explore the repository <span>↗</span></a>
            <a className="button button-dark-ghost" href={`${githubUrl}/blob/main/docs/self-hosting.md`}>Self-hosting guide</a>
          </div>
        </div>
        <div className="code-card" aria-label="Self-hosting command example">
          <div className="code-card-head"><span><i /><i /><i /></span><small>terminal</small><b>Apache-2.0</b></div>
          <pre><span className="prompt">$</span> git clone {githubUrl}.git{"\n"}<span className="prompt">$</span> cd multAIplayer{"\n"}<span className="prompt">$</span> docker build -f apps/relay/Dockerfile .{"\n"}<span className="muted"># Your room. Your relay. Your call.</span></pre>
        </div>
      </section>

      <section className="faq section-light">
        <div className="section-kicker"><span>05</span> Good questions</div>
        <div className="faq-layout">
          <h2>Before you<br />open a room.</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}<span>+</span></summary>
                <p>{faq.a}</p>
              </details>
            ))}
            <Link className="faq-more" href="/faq">Read the complete FAQ <span>↗</span></Link>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-orbit orbit-one" /><div className="cta-orbit orbit-two" />
        <Image src="/brand/icon.png" alt="multAIplayer icon" width={72} height={72} />
        <div className="eyebrow"><span className="live-dot" /> {supportedMacDownload ? `Alpha ${supportedMacDownload.version} available` : "Alpha release pending"}</div>
        <h2>Bring the whole team<br />into the loop.</h2>
        <p>{supportedMacDownload ? "Download the signed alpha for an Apple silicon Mac running macOS 11 or later." : "The first signed download for Apple silicon Macs running macOS 11 or later has not been published yet."}</p>
        {supportedMacDownload ? <a className="button button-primary button-large" href={supportedMacDownload.url}>Download for Apple silicon <span>↗</span></a> : <span className="button button-primary button-large release-unavailable" aria-disabled="true">Signed download not yet published</span>}
        <small>Completely free and open source · GitHub account required to sign in</small>
        <small>Hosting requires a ChatGPT account with Codex access</small>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="wordmark" href="#top"><Image src="/brand/icon.png" alt="" width={34} height={34} /><span><strong>multAIplayer</strong><small>group chat for Codex</small></span></a>
          <p>Build with Codex. Together.</p>
          <p>Made by <a href="https://x.com/maddiedreese">@maddiedreese ↗</a></p>
        </div>
        <div className="footer-links">
          <div><strong>Product</strong><a href="#how-it-works">How it works</a><Link href="/faq">FAQ</Link>{supportedMacDownload ? <a href={supportedMacDownload.url}>Download</a> : <span className="release-unavailable">Signed download pending</span>}<Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          <div><strong>Project</strong><a href={githubUrl}>Application source</a><a href={websiteGithubUrl}>Website source</a><a href={`${githubUrl}/blob/main/docs/using-the-app.md`}>Documentation</a><a href={`${githubUrl}/issues`}>Issues</a></div>
          <div><strong>Trust</strong><a href={`${githubUrl}/blob/main/SECURITY.md`}>Security</a><Link href="/security/updater-key">Updater key</Link><a href={`${githubUrl}/blob/main/docs/alpha-limitations.md`}>Alpha limitations</a><a href={`${githubUrl}/blob/main/docs/if-unmaintained.md`}>Project continuity</a><a href={`${githubUrl}/blob/main/LICENSE`}>License</a></div>
        </div>
        <p className="independence-note">multAIplayer is an independent open-source project and is not affiliated with, endorsed by, or sponsored by OpenAI. The OpenAI and Codex names belong to OpenAI.</p>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} multAIplayer</span><span>Open source under Apache-2.0</span><span className="footer-status"><i /> {releaseManifest.supported ? `Alpha ${releaseManifest.version} available` : "Alpha release pending"}</span></div>
      </footer>
    </main>
  );
}
