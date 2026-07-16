import type { Metadata } from "next";
import { supportedMacDownload } from "../../lib/release-manifest";
import { INVITE_CAPTURE_SCRIPT } from "../../lib/invite-capture.mjs";
import InviteLanding from "./InviteLanding";
import styles from "./invite.module.css";

export const metadata: Metadata = {
  title: "Private invitation | multAIplayer",
  description: "Open a private multAIplayer workspace invitation.",
  alternates: { canonical: "/invite" },
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function InvitePage() {
  return (
    <main className={styles.page}>
      <script dangerouslySetInnerHTML={{ __html: INVITE_CAPTURE_SCRIPT }} />
      <header className={styles.header}>
        <a className={styles.wordmark} href="https://multaiplayer.com" aria-label="multAIplayer home">
          <span className={styles.brandIcon} aria-hidden="true" />
          <span><strong>multAIplayer</strong><small>group chat for Codex</small></span>
        </a>
        <span className={styles.privateLabel}>Private invitation</span>
      </header>
      <InviteLanding
        downloadUrl={supportedMacDownload?.url ?? null}
        releaseVersion={supportedMacDownload ? supportedMacDownload.version : null}
      />
      <footer className={styles.footer}>
        <span>This page does not send invite fragments to the website server.</span>
        <a href="https://github.com/maddiedreese/multAIplayer/blob/main/docs/threat-model.md">Read the threat model</a>
        <a href="https://multaiplayer.com/privacy">Privacy</a>
        <a href="https://multaiplayer.com/terms">Terms</a>
      </footer>
    </main>
  );
}
