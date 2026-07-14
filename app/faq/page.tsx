import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supportedMacDownload } from "../../lib/release-manifest";

const githubUrl = "https://github.com/maddiedreese/multAIplayer";
const docsUrl = `${githubUrl}/blob/main/docs`;

export const metadata: Metadata = {
  title: "FAQ | multAIplayer",
  description: "Fact-based answers about multAIplayer, its trust model, supported scope, architecture, and public alpha.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    category: "Positioning",
    question: "How is this different from VS Code Live Share, tmux sharing, or just screen-sharing on a call?",
    answer: <>
      <p>Those tools primarily share an editor, terminal, desktop, or live view. multAIplayer creates a persistent project room around a locally hosted Codex session.</p>
      <p>The room brings together team chat, selected project files, diffs, terminals, browser context, Git workflows, Codex activity, approvals, and host handoff. Teammates can propose Codex turns and local actions without receiving unrestricted remote control of the host’s computer. The active host reviews requests and controls what may execute locally.</p>
      <p>It is not a replacement for every Live Share, tmux, or screen-sharing workflow. It is specifically designed for a team collaborating with an AI coding agent while keeping one person’s machine and credentials behind an explicit authority boundary.</p>
    </>,
  },
  {
    category: "Positioning",
    question: "Who is this actually for?",
    answer: <>
      <p>multAIplayer is for small, trusted teams that want to pair with Codex together.</p>
      <p>That may be two developers working through a feature, a small product team reviewing an agent’s work, or collaborators who want one shared conversation around code, tools, and decisions. It assumes that room members are trusted participants, because admitted members can see shared project context and request actions involving the active host’s project, terminal, browser, Git, GitHub, and Codex session.</p>
      <p>It is not designed as an anonymous public chat service, a large enterprise collaboration platform, or a way to let untrusted users operate someone else’s computer.</p>
    </>,
  },
  {
    category: "Trust and security",
    question: "How does room encryption work, and is it audited?",
    answer: <>
      <p>Protocol v2 uses RFC 9420 Messaging Layer Security concepts through the Rust <code>mls-rs</code> implementation. Devices hold MLS state and secrets locally, publish MLS PrivateMessages through the relay, and use signed KeyPackages, Add commits, and Welcome messages for membership changes.</p>
      <p>The relay routes and persists ciphertext plus the metadata needed for authorization, delivery, replay protection, limits, and operations. It does not receive MLS epoch secrets. Removing a member advances the group epoch so that the removed device cannot decrypt later messages, but it cannot erase content or keys the device already received.</p>
      <p>The multAIplayer integration and product have not been independently audited. Using a maintained MLS implementation reduces custom cryptographic surface but is not a blanket security guarantee. Protocol v2 is intentionally incompatible with legacy pre-v2 rooms and invitations. Read the <a href={`${docsUrl}/cryptography.md`}>cryptography architecture</a> and <a href={`${docsUrl}/threat-model.md`}>threat model</a>.</p>
    </>,
  },
  {
    category: "Trust and security",
    question: "What can the relay see about me and my project?",
    answer: <>
      <p>The relay can see the metadata it needs for authentication, membership, routing, limits, and operations. This includes:</p>
      <ul>
        <li>GitHub user identifiers and basic profile information used for sign-in</li>
        <li>Team and room identifiers and names, membership, roles, host status, and presence</li>
        <li>Device identifiers, registered public keys, and public-key fingerprints</li>
        <li>The selected local project path string, which may reveal directory or user names, selected model identifiers, and certain room configuration values</li>
        <li>Invite identifiers, expiration data, and other invite metadata</li>
        <li>Encrypted event types, sender and device identifiers, timestamps, key epochs, and ciphertext sizes</li>
        <li>Encrypted attachment blobs; plaintext filename, MIME type, size, and routing metadata; and operational counters</li>
        <li>For GitHub operations you request, transient pull-request fields and Actions run metadata that the relay forwards without adding them to persistent relay state or logs</li>
      </ul>
      <p>Your GitHub and device display identity, role, presence, and public device keys are visible to authorized teammates where the roster and room workflow require them. Except for content you deliberately put in a GitHub operation field, the relay is designed not to receive plaintext room messages, attachment contents, project files, file diffs, terminal output, browser contents, Codex credentials, OpenAI credentials, or MLS secrets. GitHub access tokens remain relay-side and are encrypted before persistent storage when the relay has a strong session secret.</p>
      <p>This is an intended and tested architecture boundary, not an independently audited guarantee. The detailed inventory is in the <a href={`${docsUrl}/threat-model.md`}>threat model</a>.</p>
    </>,
  },
  {
    category: "Trust and security",
    question: "If I invite someone to a room, what exactly can they make happen on my machine, and what requires my approval?",
    answer: <>
      <p>An admitted room member can participate in encrypted chat and see the project context intentionally shared with the room. Depending on room state, that can include project structure, bounded file previews, diffs, Git status, Codex activity, terminal snapshots, browser decisions, and workflow events.</p>
      <p>A member can propose a Codex turn, exact terminal command, file save, browser open, or Git and GitHub workflow action. These proposals do not provide direct remote-control access. Codex turns, non-host file saves, terminal commands, browser opens, and Git or GitHub mutations require active-host authorization before touching the host machine.</p>
      <p>Native controls add filesystem containment, command review, secret-pattern redaction, and stronger confirmation for recognized credential access. Approval is still a meaningful security decision. Warnings and secret detection reduce accidental exposure but cannot identify every dangerous command or secret. See <a href={`${docsUrl}/using-the-app.md`}>Using the app</a> and the <a href={`${docsUrl}/alpha-limitations.md`}>alpha limitations</a>.</p>
    </>,
  },
  {
    category: "Trust and security",
    question: "Are invite links safe to paste into Slack or Discord? What happens if one leaks?",
    answer: <>
      <p>Treat a complete invite link as a private bearer secret. It is reasonable to send one through a private direct message or restricted channel whose participants you intend to invite. Do not paste it into public channels, issue trackers, logs, support tickets, or searchable documentation.</p>
      <p>The link does not contain MLS room secrets. It contains a random, single-use capability and a protected binding to the active host, room, invitation, and expiry. Someone with the complete link can submit a device-bound join request, but the device joins only after the active host verifies it, approves it, commits the MLS Add, and returns the resulting Welcome.</p>
      <p>On macOS, selecting the HTTPS link opens an installed signed multAIplayer app. Without the app, it opens a private installation page. That page removes the capability from the address bar immediately, keeps it only in memory, and never stores or submits it. After installation, use the page’s Open in multAIplayer action or select the original invitation again.</p>
      <p>If a link leaks, do not approve an unexpected request. Invalidate the invite and generate a new one. A leaked capability does not reveal existing room content by itself, but it creates an unauthorized opportunity to request access.</p>
    </>,
  },
  {
    category: "Trust and security",
    question: "Has the encryption been audited?",
    answer: <>
      <p>No. The cryptographic protocol and implementation have not received an independent professional security audit.</p>
      <p>The repository includes documented protocol boundaries, canonical encodings, public test vectors, an independent Python vector verifier, property tests, mutation tests, malformed-input tests, key-rotation tests, invite-binding tests, downgrade rejection, and a public threat-model changelog. Those controls improve reviewability and catch regressions. They do not replace an independent audit.</p>
      <p>Cryptographers and protocol reviewers can start with the <a href={`${docsUrl}/external-review-packet.md`}>external review packet</a> and report findings through <a href={`${githubUrl}/security/advisories/new`}>private vulnerability reporting</a>.</p>
    </>,
  },
  {
    category: "Scope and platform",
    question: "Why Codex only? Will you support Claude Code, Aider, or other agents?",
    answer: <>
      <p>The current product is built around the local Codex app-server. Its thread, turn, goal, model, approval, authentication, app, and MCP APIs provide the structured lifecycle that multAIplayer exposes to a room.</p>
      <p>This is deeper than sending prompts to a command-line process. The app tracks Codex threads, reconstructs bounded room context, handles bidirectional approvals, presents model and reasoning controls, records safe lifecycle events, and supports host handoff around that specific contract.</p>
      <p>We are open to exploring Claude Code, Aider, and other agents. There is no committed integration or timeline. Supporting another agent responsibly would require a defined local protocol for turns, approvals, tools, cancellation, activity, authentication, and context handling, plus compatibility fixtures and security tests.</p>
    </>,
  },
  {
    category: "Scope and platform",
    question: "Why is it macOS-only, and when do Windows and Linux land?",
    answer: <>
      <p>An Apple silicon Mac running macOS 11 or later is the sole supported release target for the public alpha. Intel Macs are not supported.</p>
      <p>The native app relies on platform-sensitive behavior including Tauri and WebView integration, Keychain storage, process containment, terminal handling, browser profiles, Developer ID signing, notarization, and Gatekeeper verification. Supporting a platform means validating those security and lifecycle boundaries, not only producing a binary that launches.</p>
      <p>Linux is used as a development and CI compatibility target in parts of the project, but Linux desktop packages are not supported or published. Windows packages are also not configured or published. There is no committed Windows or Linux timeline.</p>
    </>,
  },
  {
    category: "Scope and platform",
    question: "Why do you only support Codex 0.133 through 0.144, and what happens on newer versions?",
    answer: <>
      <p>multAIplayer depends on the Codex app-server protocol, which can change as Codex evolves. The project has generated schema fixtures and compatibility tests for versions 0.133.0, 0.143.0, and 0.144.0, with 0.133.0 through 0.144.0 treated as the supported range.</p>
      <p>Older versions cannot host when required methods or contract shapes are missing. Newer versions are labelled unverified. Contract-sensitive or security-sensitive features fail closed when the app cannot establish compatibility.</p>
      <p>A scheduled job checks the latest Codex CLI and real app-server handshake, but passing does not automatically expand the supported range. Read the <a href={`${docsUrl}/codex-hosting.md`}>Codex hosting guide</a>.</p>
    </>,
  },
  {
    category: "Scope and platform",
    question: "Why GitHub-only sign-in?",
    answer: <>
      <p>GitHub currently serves two related purposes: room identity and the built-in GitHub workflow.</p>
      <p>The relay uses GitHub device-code OAuth to identify users and scope team and room metadata. The official alpha requests access to public and private repositories. The same relay-side session supports repository operations, draft pull request creation, and GitHub Actions status without exposing the access token to desktop clients. Using one provider keeps the alpha’s identity, authorization, PR, and Actions surfaces small enough to review and operate.</p>
      <p>GitHub-only sign-in is an alpha scope decision. Other identity providers and a GitHub App model are possible future directions, but neither is committed for the initial alpha. A private local or LAN relay can explicitly disable authentication, but that mode is not appropriate for an internet-facing relay.</p>
    </>,
  },
  {
    category: "Architecture and operations",
    question: "What happens when the active host goes offline mid-session?",
    answer: <>
      <p>The active host’s local capabilities stop being available. New Codex turns, terminal commands, file saves, browser opens, and Git mutations cannot execute on that machine. In-flight local work may fail or require the original host to reconnect and retry.</p>
      <p>Members with current local MLS state can continue encrypted chat and read locally available history. The relay does not take over the host’s Codex session, project folder, terminal processes, browser state, or credentials.</p>
      <p>Explicit host handoff lets a replacement host use their own machine, Codex access, credentials, and project checkout. There is no transparent machine failover, and an abrupt disconnect may not produce a complete handoff package. Normal Git commits, branches, backups, and clean handoffs remain the reliable continuity path.</p>
    </>,
  },
  {
    category: "Architecture and operations",
    question: "Can I self-host the relay, and why does a custom relay URL require rebuilding the desktop app?",
    answer: <>
      <p>Yes. The relay is open source and can be self-hosted. An internet-facing deployment should use HTTPS and WSS, exact allowed origins, GitHub authentication, persistent SQLite storage, durable session encryption, rate limits, quotas, backups, health checks, monitoring, and the included production-relay doctor.</p>
      <p>Official desktop builds pin hosted relay endpoints and restrict network access through the Tauri application Content Security Policy. They do not permit arbitrary HTTPS or WebSocket destinations. This prevents a compromised setting, injected page, or casual configuration change from redirecting the trusted desktop shell to an unexpected server.</p>
      <p>A custom relay therefore requires a self-built desktop whose allowed origins are included at build time. See the <a href={`${docsUrl}/self-hosting.md`}>self-hosting guide</a>.</p>
    </>,
  },
  {
    category: "Architecture and operations",
    question: "What happens to my data if the hosted relay or the project shuts down?",
    answer: <>
      <p>Your project folder, Git repository, branches, commits, MLS state and secrets, and encrypted local history are not owned by the relay. They remain on the relevant devices.</p>
      <p>The relay holds routing and membership state, encrypted backlog, encrypted attachment blobs, invites, and sessions. Migration recreates teams, rooms, memberships, sessions, and invites. It does not automatically transfer hosted backlog or attachment blobs, and a destination relay cannot reconstruct device-local keys or history.</p>
      <ul>
        <li>Keep normal project and Git backups and push important branches</li>
        <li>Export important conversations to Markdown and save important attachments</li>
        <li>Keep every device that contains needed MLS state and encrypted history</li>
        <li>Test self-hosting before an emergency</li>
      </ul>
      <p>Planned hosted-relay shutdowns provide at least 30 days of public notice when safely possible. Read <a href={`${docsUrl}/if-unmaintained.md`}>If this project goes unmaintained</a> for the complete exit path.</p>
    </>,
  },
  {
    category: "Practical",
    question: "Is this safe to use on a private or work repository yet?",
    answer: <>
      <p>Probably not yet, unless your team has reviewed the risks and decided the current alpha controls are appropriate for that repository.</p>
      <p>The product’s MLS integration is unaudited. Room membership grants access to meaningful project context. Approved Codex turns and terminal commands can affect the host’s files and accounts. Signed-in browser pages, terminal output, private paths, diffs, copied Markdown, and local tools can expose sensitive information.</p>
      <p>Start with a disposable or public test repository with no production secrets. Use a separate branch, keep a clean remote backup, work with trusted people, use dummy credentials, keep browser sessions free of sensitive accounts, and review every approval. Test member removal, key rotation, host handoff, relay restart, and local export before introducing private code. Read the <a href={`${docsUrl}/alpha-limitations.md`}>alpha limitations</a>.</p>
    </>,
  },
  {
    category: "Practical",
    question: "What does alpha mean concretely? What is most likely to break?",
    answer: <>
      <p>Alpha means the core product exists and is tested, but its compatibility, recovery, operations, and multi-device behavior are still being validated under real use.</p>
      <p>Likely failure areas include Codex app-server compatibility, interrupted host-local work, incomplete handoffs, relay and OAuth configuration, local MLS state and history recovery, native browser and terminal differences, local preview tunnels, long-lived relay scaling, manual update transitions, multi-device state races, and warnings that fail to recognize an unusual secret or dangerous command.</p>
      <p>Treat the alpha as security-sensitive development software. Keep recoverable copies of important work, expect occasional manual recovery, and report reproducible problems using dummy data and the project’s bounded diagnostics tools.</p>
    </>,
  },
];

const categories = ["Positioning", "Trust and security", "Scope and platform", "Architecture and operations", "Practical"];

export default function FaqPage() {
  return (
    <main className="faq-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="multAIplayer home">
          <Image src="/brand/icon.png" alt="" width={34} height={34} priority />
          <span><strong>multAIplayer</strong><small>group chat for Codex</small></span>
        </Link>
        <nav aria-label="FAQ navigation"><Link href="/">Home</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href={`${githubUrl}/blob/main/README.md`}>Documentation</a></nav>
        {supportedMacDownload ? <a className="header-cta" href={supportedMacDownload.url}>Download alpha</a> : <span className="header-cta release-unavailable" aria-disabled="true">Signed alpha coming soon</span>}
      </header>

      <section className="faq-page-intro">
        <div className="section-kicker section-kicker-dark"><span>FAQ</span> Product, trust, and scope</div>
        <h1>Good questions deserve direct answers.</h1>
        <p>What multAIplayer is for, what the relay can see, what room members can request, and where the public alpha still has hard limits.</p>
      </section>

      <div className="faq-page-content">
        {categories.map((category) => (
          <section className="faq-group" key={category}>
            <h2>{category}</h2>
            <div className="faq-page-list">
              {faqs.filter((faq) => faq.category === category).map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}<span>+</span></summary>
                  <div className="faq-answer">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="faq-page-footer">
        <Link className="wordmark" href="/"><Image src="/brand/icon.png" alt="" width={34} height={34} /><span><strong>multAIplayer</strong><small>Build with Codex. Together.</small></span></Link>
        <nav aria-label="Footer legal navigation"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link></nav>
        <p>Independent, open source, and not affiliated with or endorsed by OpenAI.</p>
      </footer>
    </main>
  );
}
