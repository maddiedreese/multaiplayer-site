import type { Metadata } from "next";
import releaseManifest from "../../public/releases/latest.json";
import { INVITE_CAPTURE_SCRIPT } from "../../lib/invite-capture.mjs";
import InviteLanding from "./InviteLanding";
import styles from "./invite.module.css";

export const metadata: Metadata = {
  title: "Private invitation | multAIplayer",
  description: "Open a private multAIplayer workspace invitation.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function InvitePage() {
  const download = releaseManifest.downloads?.macos;

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
        downloadUrl={download?.url ?? releaseManifest.url}
        downloadLabel={download?.architecture === "arm64" ? "Download for Apple silicon" : "Download for macOS"}
        releaseVersion={releaseManifest.version}
      />
      <footer className={styles.footer}>
        <span>Invite capabilities stay on this device.</span>
        <a href="https://github.com/maddiedreese/multAIplayer/blob/main/docs/threat-model.md">Read the threat model</a>
      </footer>
    </main>
  );
}
