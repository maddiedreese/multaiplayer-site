import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const repository = "https://github.com/maddiedreese/multAIplayer";
const fingerprint = "626f3a15f71fc8c5794c9ce00392a12f782cd05ec47a88ce27858b43ce774673";

export const metadata: Metadata = {
  title: "Updater signing key | multAIplayer",
  description: "Independent publication of the multAIplayer desktop updater public-key fingerprint.",
  alternates: { canonical: "/security/updater-key" },
};

export default function UpdaterKeyPage() {
  return (
    <main className="legal-page">
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="multAIplayer home">
          <Image src="/brand/icon.png" alt="" width={34} height={34} priority />
          <span><strong>multAIplayer</strong><small>group chat for Codex</small></span>
        </Link>
        <nav aria-label="Security navigation"><Link href="/">Home</Link><Link href="/faq">FAQ</Link><a href={`${repository}/blob/main/SECURITY.md`}>Report a vulnerability</a></nav>
        <a className="header-cta" href={`${repository}/blob/main/docs/reproducible-builds.md`}>Verification guide</a>
      </header>

      <section className="legal-intro">
        <div className="section-kicker section-kicker-dark"><span>Trust</span> Out-of-band updater anchor</div>
        <h1>Updater signing key.</h1>
        <p>This page publishes the desktop updater public-key fingerprint outside the GitHub release channel. Record and compare it before a first install, key rotation, or compromise recovery.</p>
      </section>

      <article className="legal-content updater-key-content">
        <p className="legal-summary">A matching fingerprint identifies the expected public key. It does not prove that a release, signing workflow, maintainer account, or device is uncompromised.</p>
        <section>
          <h2>Current key</h2>
          <p>Minisign key id: <code>5F97AE260BE16B2F</code></p>
          <p>SHA-256 of the exact <code>apps/desktop/src-tauri/updater-public.key</code> file:</p>
          <pre><code>{fingerprint}</code></pre>
          <p>From a trusted source checkout, run <code>shasum -a 256 apps/desktop/src-tauri/updater-public.key</code>. The output must match this page and the fingerprint recorded in the application repository.</p>
        </section>
        <section>
          <h2>Rotation and suspected compromise</h2>
          <p>Routine rotation requires an old-key-signed bridge release that embeds the new key. The new fingerprint must appear here before that bridge is published.</p>
          <p>If the current key may be compromised, do not trust an updater transition signed only by that key. Stop the update manifest, verify the incident and replacement fingerprint through channels that do not depend on GitHub, and use a manually downloaded recovery build only after verifying its Apple signature, notarization, and published checksum.</p>
        </section>
      </article>

      <footer className="faq-page-footer legal-footer">
        <Link className="wordmark" href="/"><Image src="/brand/icon.png" alt="" width={34} height={34} /><span><strong>multAIplayer</strong><small>Build with Codex. Together.</small></span></Link>
        <nav aria-label="Footer security navigation"><a href={`${repository}/blob/main/docs/reproducible-builds.md`}>Verify releases</a><a href={`${repository}/blob/main/docs/threat-model.md`}>Threat model</a><a href={`${repository}/blob/main/SECURITY.md`}>Security</a></nav>
        <p>Independent open-source project · Not affiliated with or endorsed by OpenAI</p>
      </footer>
    </main>
  );
}
