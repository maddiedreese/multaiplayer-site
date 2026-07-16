import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { supportedMacDownload } from "../../lib/release-manifest";

const githubUrl = "https://github.com/maddiedreese/multAIplayer";
const docsUrl = `${githubUrl}/blob/main/docs`;

export const metadata: Metadata = {
  title: "FAQ | multAIplayer",
  description: "Short answers and links to multAIplayer's maintained product, security, and operations documentation.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    category: "Product",
    question: "What is multAIplayer?",
    answer: <p>A macOS desktop room where trusted teammates collaborate around one locally hosted Codex session. It combines discussion, intentionally shared project context, Codex activity, approvals, files and diffs, terminals, browser previews, Git/GitHub workflows, and explicit host handoff. Read the <a href={`${docsUrl}/using-the-app.md`}>user guide</a>.</p>,
  },
  {
    category: "Product",
    question: "Who controls the host machine?",
    answer: <p>One active host supplies the project, Codex process, tools, credentials, and approval decisions. Teammates can propose actions, but consequential local work crosses host review and native authorization. Approval still carries real risk; see the <a href={`${docsUrl}/threat-model.md`}>threat model</a>.</p>,
  },
  {
    category: "Product",
    question: "Does multAIplayer customize Codex's instructions?",
    answer: <p>No. The app uses the standard open-source Codex app-server on the active host and does not replace Codex&apos;s system or developer instructions or ship a custom Codex prompt. Approved room context is sent as ordinary turn input with untrusted material explicitly labeled.</p>,
  },
  {
    category: "Trust",
    question: "How are rooms encrypted, and has this been audited?",
    answer: <p>The mechanism uses RFC 9420 MLS through <code>mls-rs</code>, with native-client encryption and exporter-derived protection for relevant payloads. The integration has not received an independent professional security audit. The <a href={`${docsUrl}/threat-model.md`}>threat model</a> is the sole normative claims source; reviewers can use the <a href={`${docsUrl}/design/external-review-packet.md`}>external review packet</a>.</p>,
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
    answer: <p>Supported releases are Developer ID-signed and notarized. The desktop updater uses the application repository&apos;s pinned <code>update-channel</code> branch and accepts only archives carrying the Tauri release signature. The website&apos;s release manifest drives download links; it is not an updater trust root. This site separately publishes the <Link href="/security/updater-key">pre-committed updater-key fingerprint</Link> so it can be compared outside the GitHub release channel. Releases also publish checksums, Sigstore evidence, an SPDX SBOM, and reproducibility evidence. Follow the <a href={`${docsUrl}/reproducible-builds.md`}>verification guide</a>.</p>,
  },
  {
    category: "Scope",
    question: "What platforms are supported?",
    answer: <p>The public alpha targets Apple-silicon macOS 11 or later. Windows, Linux desktop, and Intel Mac releases are not supported. Current Codex compatibility is recorded in the <a href={`${docsUrl}/codex-hosting.md`}>Codex hosting guide</a>.</p>,
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
        <nav aria-label="FAQ navigation"><Link href="/">Home</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href={`${githubUrl}/blob/main/README.md`}>Documentation</a></nav>
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
