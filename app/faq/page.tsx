import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supportedMacDownload } from "../../lib/release-manifest";

const githubUrl = "https://github.com/maddiedreese/multAIplayer";
const docsUrl = `${githubUrl}/blob/main/docs`;
const cliGuideUrl = `${githubUrl}/blob/main/apps/cli/README.md`;

export const metadata: Metadata = {
  title: "FAQ | multAIplayer",
  description: "Short answers and links to multAIplayer's maintained product, security, and operations documentation.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    category: "Product",
    question: "What is multAIplayer?",
    answer: <p>Native macOS desktop and command-line clients where trusted teammates collaborate around one locally hosted Codex session. Both clients share encrypted rooms, conversation, Codex activity, approvals, and explicit host handoff. The desktop also provides files and diffs, shared terminals, browser previews, and Git/GitHub workflows. Read the <a href={`${docsUrl}/using-the-app.md`}>desktop guide</a> or <a href={cliGuideUrl}>CLI guide</a>.</p>,
  },
  {
    category: "Product",
    question: "How do I install and start using the CLI?",
    answer: <><p>On an Apple-silicon Mac, run <code>curl -fsSL https://raw.githubusercontent.com/maddiedreese/multAIplayer/main/apps/cli/install.sh | sh</code>. The signed, notarized CLI installs in your user account without <code>sudo</code> or an administrator password.</p><p>Then run <code>multAIplayer auth login --open</code>. GitHub opens for device authorization, the terminal confirms your account, and the CLI prints a walkthrough covering room creation or joining, encrypted chat, Codex hosting, and host handoff. Replay it with <code>multAIplayer walkthrough</code>. See the <a href={cliGuideUrl}>CLI guide</a> for every command and current limitation.</p></>,
  },
  {
    category: "Product",
    question: "Does host handoff work between desktop and CLI?",
    answer: <p>Yes. Either supported client can hand future host authority to a verified member through the same authenticated room boundary. The incoming host selects its own local project and uses its own credentials and Codex session. Handoff does not transfer filesystem access, credentials, running processes, terminal or browser sessions, or the outgoing host&apos;s Codex session.</p>,
  },
  {
    category: "Product",
    question: "Who controls the host machine?",
    answer: <p>One active host supplies the project, Codex process, tools, credentials, and approval decisions. Teammates can propose actions, but consequential local work crosses host review and native authorization. Approval still carries real risk; see the <a href={`${docsUrl}/threat-model.md`}>threat model</a>.</p>,
  },
  {
    category: "Product",
    question: "Does multAIplayer replace Codex's system or developer instructions?",
    answer: <p>No. The app uses the standard open-source Codex app-server on the active host. For an approved turn, it constructs a bounded ordinary user-turn prompt from attributed room conversation and selected context, with product-authored safety framing that explicitly labels untrusted material.</p>,
  },
  {
    category: "Trust",
    question: "How are rooms encrypted, and has this been audited?",
    answer: <p>The mechanism uses RFC 9420 MLS through <code>mls-rs</code>, with native-client encryption and exporter-derived protection for relevant payloads. The integration has not received an independent professional security audit. The <a href={`${docsUrl}/threat-model.md`}>threat model</a> is the sole normative claims source, and the <a href={`${docsUrl}/alpha-limitations.md`}>alpha limitations</a> summarize practical constraints.</p>,
  },
  {
    category: "Trust",
    question: "What can the relay see and retain?",
    answer: <p>The relay authenticates devices, authorizes access, routes encrypted records, and retains bounded operational state and backlog. Some identity, routing, size, timing, and lifecycle metadata is necessarily visible. The exact inventory, retention, deletion, and compromised-participant boundaries live only in the <a href={`${docsUrl}/threat-model.md`}>threat model</a>.</p>,
  },
  {
    category: "Trust",
    question: "How should I handle an invite link?",
    answer: <p>Treat the complete HTTPS link as a bearer secret. Send it only through a private channel, never logs, issues, or support requests. If it leaks, invalidate it and do not approve an unexpected device. The <a href={`${docsUrl}/using-the-app.md`}>user guide</a> explains the universal-link flow.</p>,
  },
  {
    category: "Operations",
    question: "Can I self-host?",
    answer: <p>Yes. Internet-facing deployments need TLS, exact origins, authentication, persistent SQLite storage, backups, health monitoring, and abuse controls. Official clients pin the hosted relay, so another origin requires a self-built app. Follow the <a href={`${docsUrl}/self-hosting.md`}>self-hosting guide</a>.</p>,
  },
  {
    category: "Operations",
    question: "How are desktop updates protected?",
    answer: <p>Supported releases are Developer ID-signed and notarized. The desktop updater uses the application repository&apos;s pinned <code>update-channel</code> branch and accepts only archives carrying the Tauri release signature. The website&apos;s release manifest drives download links; it is not an updater trust root. This site separately publishes the <Link href="/security/updater-key">pre-committed updater-key fingerprint</Link> so it can be compared outside the GitHub release channel. Releases also publish SHA-256 checksums for manual verification. Follow the <a href={`${docsUrl}/reproducible-builds.md`}>verification guide</a>.</p>,
  },
  {
    category: "Scope",
    question: "What platforms are supported?",
    answer: <p>The public desktop and CLI alphas target Apple-silicon macOS 11 or later. Intel Mac, Windows, and Linux releases are not supported, and Homebrew packages are not currently available. Current Codex compatibility is recorded in the <a href={`${docsUrl}/codex-hosting.md`}>Codex hosting guide</a>; CLI-specific differences are listed in the <a href={`${cliGuideUrl}#compatibility-and-limitations`}>compatibility table</a>.</p>,
  },
  {
    category: "Scope",
    question: "Is the alpha appropriate for private work?",
    answer: <p>Start with a disposable or public repository, trusted collaborators, dummy credentials, a separate branch, and recoverable backups. Read the <a href={`${docsUrl}/threat-model.md`}>threat model</a> and <a href={`${docsUrl}/alpha-limitations.md`}>alpha limitations</a> before introducing sensitive code. High-stakes use should wait for independent review and greater operational maturity.</p>,
  },
];

const categories = ["Product", "Trust", "Operations", "Scope"];

export default function FaqPage() {
  return (
    <main className="faq-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="multAIplayer home">
          <Image src="/brand/icon.png" alt="" width={34} height={34} priority />
          <span><strong>multAIplayer</strong><small>group chat for Codex</small></span>
        </Link>
        <nav aria-label="FAQ navigation"><Link href="/">Home</Link><a href={cliGuideUrl}>CLI</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href={`${githubUrl}/blob/main/README.md`}>Documentation</a></nav>
        {supportedMacDownload ? <a className="header-cta" href={supportedMacDownload.url}>Download alpha</a> : <span className="header-cta release-unavailable" aria-disabled="true">Signed download pending</span>}
      </header>

      <section className="faq-page-intro">
        <div className="section-kicker section-kicker-dark"><span>FAQ</span> Product, trust, and scope</div>
        <h1>Short answers. Maintained sources.</h1>
        <p>This page points to the repository documents that own the details. The threat model and architecture decisions remain authoritative.</p>
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
