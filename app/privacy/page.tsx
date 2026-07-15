import type { Metadata } from "next";
import { LegalPage, companyName, contactEmail, effectiveDate, mailingAddress } from "../legal";

export const metadata: Metadata = {
  title: "Privacy Policy | multAIplayer",
  description: "How multAIplayer and its hosted relay collect, use, protect, retain, and delete data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" description="A fact-based account of what the website, desktop app, and official hosted relay handle—and what stays on your Mac.">
      <p className="legal-summary">This policy applies to multaiplayer.com, the multAIplayer desktop app, and the official relay operated by {companyName}. It does not govern a relay someone else self-hosts. multAIplayer is a free, open-source alpha; its security design has not been independently audited.</p>

      <section>
        <h2>1. Who is responsible</h2>
        <p>{companyName} operates the website and is responsible for the official hosted relay when that service is deployed and available. Contact us at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or by mail at {mailingAddress}.</p>
      </section>

      <section>
        <h2>2. Website data</h2>
        <p>The public website is a static site. We do not use advertising trackers, analytics scripts, contact forms, or marketing cookies. Our hosting infrastructure may necessarily process ordinary request data such as IP address, date and time, requested path, user agent, response status, and security or performance logs. We use that data to deliver and protect the site.</p>
        <p>The invitation landing page is deliberately isolated. An invite capability appears only in the URL fragment, which browsers do not send in an HTTP request. The page removes the fragment from the address bar before hydration, keeps a valid link only in memory, and stores no invite cookie or browser-storage value. Its security policy blocks analytics and third-party connections, sends no referrer, and marks the page no-store and noindex. No website request is designed to contain the fragment. Do not paste a complete invite into support email, an issue, logs, chat with unintended recipients, or diagnostics.</p>
      </section>

      <section>
        <h2>3. GitHub sign-in and repository access</h2>
        <p>The native desktop app uses GitHub Device Flow for identity and for the GitHub workflows you request. It receives your numeric GitHub user ID, login, optional display name, avatar URL, and an OAuth access token. The official alpha requests GitHub’s <code>repo</code> scope for public and private repositories, plus <code>read:user</code>. The <code>repo</code> grant is broad read-and-write repository access; multAIplayer uses it for the repository API, draft pull-request, and Actions operations you explicitly initiate.</p>
        <p>The access token stays behind the native Rust boundary and is stored in macOS Keychain. It is not returned to the app’s webview, written to the relay database, placed in room events, or included in diagnostics by design. Pull-request creation and Actions reads go directly from the native desktop app to <code>api.github.com</code>, so their repository names, pull-request fields, and Actions responses do not pass through the relay.</p>
        <p>At sign-in, the native app sends the token once over TLS to the official relay. The relay calls GitHub’s user endpoint to verify the identity, creates an essential secure HTTP-only relay session, and discards the token instead of storing it in the session. This transient verification means a compromised relay process could observe the token at that moment even though relay persistence and normal room or GitHub operations do not contain it.</p>
        <p>Signing out deletes the local Keychain token and relay session; it does not revoke GitHub’s authorization. You can revoke the grant in GitHub settings. GitHub receives the OAuth, identity-verification, and API requests necessary to provide these features and applies its own privacy terms. We do not use repository access to scan repositories, train models, advertise, or sell data.</p>
      </section>

      <section>
        <h2>4. Data held by the official relay</h2>
        <p>The relay does not maintain a separate password or billing account. Your GitHub-linked relay identity and its associated records function as your hosted-service account. Depending on how you use the service, the relay stores or processes:</p>
        <ul>
          <li>GitHub identity metadata, relay-session expiration, and essential session identifiers—but not the GitHub access token;</li>
          <li>team and room identifiers and names, membership and ownership roles, active-host state, presence, timestamps, and relay-visible approval and browser-policy settings;</li>
          <li>device identifiers, display names, public keys, public-key fingerprints, device-session state, MLS KeyPackages, and key-package hashes;</li>
          <li>invite identifiers, creator, team and room bindings, expiry, approval status, request and response metadata, and acknowledgement receipts—but not the private invite capability from the URL fragment;</li>
          <li>MLS ciphertext envelopes and associated routing data, including sender and device identifiers, room and team identifiers, message identifiers and types, epochs, timestamps, digests, sizes, and delivery or acceptance receipts;</li>
          <li>encrypted attachment blobs and their identifiers, plus plaintext filename, MIME type, size, uploader, room binding, timestamps, and expiry;</li>
          <li>rate-limit and quota counters, connection and health metrics, and bounded operational and security logs.</li>
        </ul>
        <p>Your GitHub login and display identity, device display name, device identifiers, public keys and fingerprints, presence, and team role are shown as needed to authorized teammates in shared room and device-roster views.</p>
        <p>The official relay is designated to run on Railway with persistent storage when the hosted service is available. The website is hosted by Netlify. These providers process infrastructure data on our behalf. We may also use GitHub for source code, releases, authentication, and user-requested repository operations.</p>
      </section>

      <section>
        <h2>5. Data designed to stay off the relay</h2>
        <p>Room messages, Codex lifecycle content, host-local project paths and Codex model configuration, and attachments are encrypted on participating devices before relay transport using the app’s MLS-based protocol. The relay is designed not to receive their plaintext, project file contents, file diffs, terminal output, browser page contents, room MLS secrets, or Codex or OpenAI credentials. A GitHub token is visible to the relay only during the one-time identity-verification request described above and is discarded immediately afterward.</p>
        <p>Your selected project, local Git checkout, local encrypted room history, MLS state, Codex session and credentials, GitHub token, browser data, terminal processes, application settings, and diagnostics remain on your Mac unless you deliberately share content with a room, GitHub, a subprocess, a website, or a support channel. Local secrets use macOS Keychain where the implementation specifies it. This is an intended and tested design boundary, not an independently audited guarantee. Operator backups made before this architecture change can retain the older relay fields until those backups expire; no policy claims retroactive erasure from existing backups.</p>
      </section>

      <section>
        <h2>6. Local actions, subprocesses, and network access</h2>
        <p>The active host may approve Codex turns, terminal commands, file operations, browser opens, Git operations, GitHub operations, and local preview sharing. Approved tools and subprocesses can read permitted local data, modify the selected project, use inherited environment data, create child processes, and make network requests. On macOS, room-requested shell commands run with filesystem confinement intended to limit writes to the selected workspace and allow only documented reads, but this is not complete machine or network isolation.</p>
        <p>Codex and any local tool, command, browser page, Git remote, or third-party integration processes data under its own behavior and terms. Review every approval and avoid repositories or environments containing secrets you are not prepared to expose to the approved process.</p>
      </section>

      <section>
        <h2>7. Diagnostics and support</h2>
        <p>The desktop app keeps bounded diagnostics locally and requires you to save a diagnostic bundle before it can be shared. It applies redaction and excludes room content by design, but automated redaction cannot guarantee removal of every secret. Review any file before sending it. We do not automatically upload desktop diagnostics.</p>
        <p>Support email and public GitHub issues are not secure channels for invite links, credentials, private code, terminal output, or other confidential material. We will never ask you for a complete invite link or fragment. Remove URL fragments and replace private values with dummy data before reporting a problem. If we receive an invite capability accidentally, we will not use it and will delete or redact it promptly; you should revoke that invitation and create a new one. If you send other support material, we process it to answer, diagnose, prevent abuse, and improve the project, and retain it only as long as needed for those purposes and legitimate records.</p>
      </section>

      <section>
        <h2>8. Why we use data and when we disclose it</h2>
        <p>We use data to authenticate users; provide teams, rooms, relay delivery, attachments, GitHub workflows, and support; secure and debug the service; enforce limits and these Terms; meet legal obligations; and maintain the open-source project. We do not sell personal information, share it for cross-context behavioral advertising, or use room content to train models.</p>
        <p>We disclose data to infrastructure and service providers as described above, when you direct an integration, to protect users or the service, during a corporate transaction, or when legally required. Room metadata and encrypted content are also delivered to authorized members as required by the product.</p>
      </section>

      <section>
        <h2>9. Retention, deletion, and continuity</h2>
        <p>Default relay configuration retains MLS backlog and encrypted attachment blobs for up to 30 days and unused invites for up to 7 days; operators may configure bounded periods. Expired data is pruned during relay operation. Authentication sessions persist until logout, deletion, or expiry. Operational logs, provider backups, and security records follow operationally necessary retention and may remain temporarily in backup rotation after deletion.</p>
        <p>The official relay keeps a restricted deletion ledger in a separate Railway object-storage bucket outside the relay database and its backup set. Each immutable entry contains a version, an HMAC-SHA-256 value derived from the GitHub user ID under a separate secret key, a deletion-attempt time, the last covered backup-expiry date, a random entry identifier, and an authentication code. It does not contain the raw GitHub ID, login, token, or deleted-record inventory. A delayed cleanup writes a fresh entry so its protection period also covers backups made after the original request. Entries remain for 90 days—longer than the current 89-day maximum backup retention—and are removed after the backups they protect have expired.</p>
        <p>You can select <strong>Delete hosted account data</strong> in the app’s Profile drawer and enter the required confirmation. The relay records the protected deletion entry before changing its primary database. Successful cleanup removes your relay sessions, memberships, registered devices and KeyPackages, pending invite artifacts, and unused invites you authored. If the primary database cannot commit after the entry is recorded, the relay signs the identity out, reports the request as accepted and pending, and retries cleanup during fail-closed reconciliation before it next accepts traffic. If you own a team, you must transfer or delete it first; if you are recorded as host of any non-deleted room, you must hand off or delete that room first. These blockers prevent deletion from stranding collaborators or leaving an invalid room owner or host.</p>
        <p>Shared team and room records, MLS ciphertext backlog, message and invite receipts, and encrypted attachment blobs may remain until their normal retention or deletion lifecycle to preserve collaborators’ room integrity, prevent replay, and meet security obligations. Copies already delivered to another member’s device, Git repository, GitHub, or a self-hosted relay are not controlled by {companyName}.</p>
        <p>If the official hosted relay is discontinued, we intend to provide at least 30 days’ public notice when safely and reasonably possible. Because this is a free alpha, emergency security, legal, or operational conditions may require shorter notice. Keep ordinary Git and project backups and export anything you need.</p>
      </section>

      <section>
        <h2>10. Your choices and rights</h2>
        <p>You may request access, correction, deletion, or a portable description of personal information we control by emailing <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We may need to verify your GitHub identity and may retain information when required for security, legal compliance, or the rights of other users. You may also sign out, delete hosted account data through the app’s Profile drawer, revoke the OAuth grant through GitHub, leave teams, delete local app data, or use a self-hosted relay.</p>
        <p>Depending on where you live, applicable law may provide additional rights or an appeal or complaint route. We will not discriminate against you for exercising a privacy right.</p>
      </section>

      <section>
        <h2>11. Security, international processing, and children</h2>
        <p>We use technical and organizational safeguards appropriate to an experimental service, including transport encryption, native Keychain token custody, MLS ciphertext transport, access controls, rate limits, and data minimization. No system is perfectly secure. Do not use the alpha for regulated, safety-critical, or highly sensitive work unless you have independently assessed it.</p>
        <p>We and our providers may process data in the United States and other locations where they operate. The service is intended for adults and is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>This policy is effective {effectiveDate}. We will post revisions here with a new effective date. If a change materially affects the hosted service, we will provide additional notice when reasonably possible.</p>
      </section>
    </LegalPage>
  );
}
