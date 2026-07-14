"use client";

import { useRef, useSyncExternalStore } from "react";
import { inspectInviteHref } from "../../lib/invite-link.mjs";
import styles from "./invite.module.css";

declare global {
  interface Window { __MULTAIPLAYER_PENDING_INVITE__?: string }
}

type InviteState = "checking" | "ready" | "invalid";
const subscribe = () => () => {};

export default function InviteLanding({
  downloadUrl,
  downloadLabel,
  releaseVersion,
}: {
  downloadUrl: string;
  downloadLabel: string;
  releaseVersion: string;
}) {
  const alternateHref = useRef<string | null>(null);
  const clientState = useRef<Exclude<InviteState, "checking"> | undefined>(undefined);
  const state = useSyncExternalStore(
    subscribe,
    () => {
      if (clientState.current) return clientState.current;
      const capturedHref = window.__MULTAIPLAYER_PENDING_INVITE__;
      delete window.__MULTAIPLAYER_PENDING_INVITE__;
      const inspected = capturedHref ? inspectInviteHref(capturedHref) : null;
      alternateHref.current = inspected?.alternateHref ?? null;
      clientState.current = inspected ? "ready" : "invalid";
      return clientState.current;
    },
    () => "checking",
  );

  function openInstalledApp() {
    const href = alternateHref.current;
    if (href) window.location.assign(href);
  }

  if (state === "checking") {
    return <section className={styles.card} aria-live="polite"><p className={styles.eyebrow}>Checking invitation</p><h1>Preparing a private invitation…</h1></section>;
  }

  if (state === "invalid") {
    return (
      <section className={styles.card} aria-labelledby="invalid-title">
        <p className={styles.eyebrow}>Invitation unavailable</p>
        <h1 id="invalid-title">This invitation link is incomplete.</h1>
        <p className={styles.lede}>Ask the workspace host for a fresh link. For your safety, do not reconstruct or edit an invitation manually.</p>
        <a className={styles.secondaryButton} href="https://multaiplayer.com">Return to multAIplayer.com</a>
      </section>
    );
  }

  return (
    <section className={styles.card} aria-labelledby="invite-title">
      <p className={styles.eyebrow}><span className={styles.statusDot} /> Invitation ready</p>
      <h1 id="invite-title">You’ve been invited to work together.</h1>
      <p className={styles.lede}>Open multAIplayer to verify the host and request access. The host must approve this device before any room content becomes available.</p>

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="button" onClick={openInstalledApp}>Open in multAIplayer</button>
        <a className={styles.secondaryButton} href={downloadUrl} target="_blank" rel="noopener noreferrer">{downloadLabel}</a>
      </div>

      <div className={styles.steps} aria-label="Installation instructions">
        <div><span>1</span><p><strong>Already installed?</strong> Select <em>Open in multAIplayer</em>. macOS will hand the private link to the signed app.</p></div>
        <div><span>2</span><p><strong>Need the app?</strong> Download version {releaseVersion}, install it in Applications, then return to this tab and select <em>Open in multAIplayer</em>.</p></div>
        <div><span>3</span><p><strong>Still in the browser?</strong> Return to the original private message and select the invitation again.</p></div>
      </div>

      <aside className={styles.securityNote}>
        <strong>Keep this invitation private.</strong>
        <span>It contains a one-time capability. This page removes it from the address bar, never stores it, and sends it only when you choose to open the app.</span>
      </aside>
    </section>
  );
}
