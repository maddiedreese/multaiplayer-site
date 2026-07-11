import Image from "next/image";

const githubUrl = "https://github.com/maddiedreese/multAIplayer";
const releasesUrl = `${githubUrl}/releases`;

const features = [
  {
    number: "01",
    title: "A room around the work",
    copy: "Chat, project files, diffs, terminals, browser previews, Git, and Codex activity stay together in one project room.",
  },
  {
    number: "02",
    title: "Codex, with a human boundary",
    copy: "Anyone can propose a turn. The active host sees the exact context and approves execution on their machine.",
  },
  {
    number: "03",
    title: "Pick up when a host steps away",
    copy: "Hand off hosting when someone leaves or reaches a usage limit. The next host uses their own machine and Codex access.",
  },
  {
    number: "04",
    title: "From conversation to pull request",
    copy: "Review changes, create a branch, commit, push, open a draft PR, and follow GitHub Actions without losing the room’s context.",
  },
];

const trustItems = [
  "Room messages and attachments are encrypted before they reach the relay.",
  "Codex and OpenAI credentials stay on the active host’s machine.",
  "Project files, terminal output, and browser contents are not stored as relay plaintext.",
  "Terminal, browser, file-write, Git, and Codex actions stay behind host approval.",
];

const faqs = [
  {
    q: "Does multAIplayer replace Codex?",
    a: "No. It gives a team a shared room around the active host’s local Codex session. Each host uses their own Codex access and local project folder.",
  },
  {
    q: "Do I need an OpenAI API key?",
    a: "No project-owned API key is required. multAIplayer connects to the active host’s local Codex app-server and does not proxy or store Codex credentials.",
  },
  {
    q: "Can I self-host the relay?",
    a: "Yes. The relay is open source and can be self-hosted. The official hosted relay is provided for the easiest first run.",
  },
  {
    q: "What platforms are supported?",
    a: "The first public alpha supports macOS. Additional platforms are not available yet.",
  },
  {
    q: "Is it ready for sensitive production work?",
    a: "Not yet. This is a public alpha. Teams should review the threat model and known limitations before using private, regulated, or high-stakes projects.",
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
          <a href="#privacy">Privacy</a>
          <a href="#open-source">Open source</a>
        </nav>
        <a className="header-cta" href={releasesUrl}>Download alpha</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Build with Codex.<br /><span>Together.</span></h1>
          <p className="hero-lede">
            A completely free, open-source team room for the conversation, code, tools, and decisions around a shared Codex session.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={releasesUrl}>Download for macOS <span>↗</span></a>
            <a className="button button-secondary" href={githubUrl}>View on GitHub <span>↗</span></a>
          </div>
          <div className="hero-requirements" aria-label="Account requirements">
            <div><strong>Host a room</strong><span>Codex account + active subscription required</span></div>
            <div><strong>Sign in</strong><span>GitHub account required</span></div>
          </div>
          <p className="hero-note">Built on the open-source Codex app-server · Self-hostable relay · Made by <a href="https://x.com/maddiedreese">@maddiedreese ↗</a></p>
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
            <Image
              src="/product/multaiplayer-dark.jpg"
              alt="A multAIplayer project room showing team chat, Codex activity, project controls, and room members"
              width={1440}
              height={822}
              priority
              sizes="(max-width: 900px) 94vw, 62vw"
            />
          </div>
          <div className="floating-card host-card"><span>Active host</span><strong>Maddie</strong><i>approved</i></div>
          <div className="floating-card event-card"><span className="bot-mark">✣</span><div><strong>Codex is working</strong><small>3 teammates following</small></div></div>
        </div>
      </section>

      <section className="intro section-light" id="how-it-works">
        <div className="section-kicker"><span>01</span> One room, shared momentum</div>
        <div className="intro-heading">
          <h2>Pair programming grew up.<br />Now it has a whole team.</h2>
          <p>multAIplayer keeps the people and the agent in the same loop—without turning your local machine into an invisible shared service.</p>
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
            <Image
              src="/product/multaiplayer-light.jpg"
              alt="The current multAIplayer light interface with room tools, team chat, files, and GitHub workflow context"
              width={1440}
              height={860}
              sizes="(max-width: 1050px) 94vw, 54vw"
            />
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
          <h2>Your relay moves the room.<br />It doesn’t read the work.</h2>
          <p>Room content is encrypted on devices. Powerful local capabilities remain with the host who owns the machine, project, accounts, and approvals.</p>
          <ul>
            {trustItems.map((item) => <li key={item}><span>✓</span>{item}</li>)}
          </ul>
          <a className="text-link" href={`${githubUrl}/blob/main/docs/threat-model.md`}>Read the threat model <span>↗</span></a>
        </div>
        <div className="privacy-visual">
          <div className="privacy-diagram" aria-label="Encrypted relay architecture diagram">
            <div className="diagram-label">ROOM TRAFFIC</div>
            <div className="device-node device-one"><div>M</div><strong>Maddie</strong><small>active host</small></div>
            <div className="device-node device-two"><div>S</div><strong>Sam</strong><small>teammate</small></div>
            <div className="device-node device-three"><div>P</div><strong>Priya</strong><small>teammate</small></div>
            <div className="relay-node"><span>◈</span><strong>relay</strong><small>ciphertext + routing metadata</small></div>
            <div className="route route-a"><i /><i /><i /></div>
            <div className="route route-b"><i /><i /><i /></div>
            <div className="route route-c"><i /><i /><i /></div>
            <p>Plaintext stays on participating devices</p>
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
          <p>Inspect the protocol, crypto boundaries, desktop client, and relay. Self-host for your team or help shape the public alpha in the open.</p>
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
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="cta-orbit orbit-one" /><div className="cta-orbit orbit-two" />
        <Image src="/brand/icon.png" alt="multAIplayer icon" width={72} height={72} />
        <div className="eyebrow"><span className="live-dot" /> Public alpha</div>
        <h2>Bring the whole team<br />into the loop.</h2>
        <p>Download the macOS alpha and start a room around your next build.</p>
        <a className="button button-primary button-large" href={releasesUrl}>Download for macOS <span>↗</span></a>
        <small>Completely free and open source · GitHub account required to sign in</small>
        <small>Hosting requires a Codex account with an active subscription</small>
      </section>

      <footer>
        <div className="footer-brand">
          <a className="wordmark" href="#top"><Image src="/brand/icon.png" alt="" width={34} height={34} /><span><strong>multAIplayer</strong><small>group chat for Codex</small></span></a>
          <p>Build with Codex. Together.</p>
          <p>Made by <a href="https://x.com/maddiedreese">@maddiedreese ↗</a></p>
        </div>
        <div className="footer-links">
          <div><strong>Product</strong><a href="#how-it-works">How it works</a><a href={releasesUrl}>Download</a><a href="#privacy">Privacy</a></div>
          <div><strong>Project</strong><a href={githubUrl}>GitHub</a><a href={`${githubUrl}/blob/main/docs/using-the-app.md`}>Documentation</a><a href={`${githubUrl}/issues`}>Issues</a></div>
          <div><strong>Trust</strong><a href={`${githubUrl}/blob/main/SECURITY.md`}>Security</a><a href={`${githubUrl}/blob/main/docs/alpha-limitations.md`}>Alpha limitations</a><a href={`${githubUrl}/blob/main/LICENSE`}>License</a></div>
        </div>
        <p className="independence-note">multAIplayer is an independent open-source project and is not affiliated with, endorsed by, or sponsored by OpenAI. The OpenAI and Codex names belong to OpenAI.</p>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} multAIplayer</span><span>Open source under Apache-2.0</span><span className="footer-status"><i /> Public alpha</span></div>
      </footer>
    </main>
  );
}
