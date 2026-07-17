import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const effectiveDate = "July 17, 2026";
export const companyName = "Flared Inc.";
export const contactEmail = "maddie@maddiedreese.com";
export const mailingAddress = "2093 Philadelphia Pike #2010, Claymont, DE 19703, United States";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="legal-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="multAIplayer home">
          <Image src="/brand/icon.png" alt="" width={34} height={34} priority />
          <span><strong>multAIplayer</strong><small>group chat for Codex</small></span>
        </Link>
        <nav aria-label="Legal navigation"><Link href="/">Home</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
        <Link className="header-cta" href="/faq">Read the FAQ</Link>
      </header>

      <section className="legal-intro">
        <div className="section-kicker section-kicker-dark"><span>Legal</span> Free and open-source alpha</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <dl className="legal-facts">
          <div><dt>Effective</dt><dd>{effectiveDate}</dd></div>
          <div><dt>Operator</dt><dd>{companyName}</dd></div>
          <div><dt>Contact</dt><dd><a href={`mailto:${contactEmail}`}>{contactEmail}</a></dd></div>
        </dl>
      </section>

      <article className="legal-content">{children}</article>

      <footer className="faq-page-footer legal-footer">
        <Link className="wordmark" href="/"><Image src="/brand/icon.png" alt="" width={34} height={34} /><span><strong>multAIplayer</strong><small>Build with Codex. Together.</small></span></Link>
        <nav aria-label="Footer legal navigation"><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms of Service</Link><a href="https://github.com/maddiedreese/multAIplayer/blob/main/SECURITY.md">Security</a></nav>
        <p>{companyName} · {mailingAddress}</p>
      </footer>
    </main>
  );
}
