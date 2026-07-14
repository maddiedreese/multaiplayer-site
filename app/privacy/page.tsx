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
        <p>The official relay uses GitHub Device Flow for identity and for the GitHub workflows you request. We receive your numeric GitHub user ID, login, optional display name, avatar URL, and an OAuth access token. The official alpha requests GitHub’s <code>repo</code> scope for public and private repositories, plus <code>read:user</code>. The <code>repo</code> grant is broad read-and-write repository access; multAIplayer uses it for the repository API, draft pull-request, and Actions operations you explicitly initiate.</p>
        <p>When you request a GitHub operation, the relay transiently receives and forwards the repository owner and name and the fields needed for that operation. For a draft pull request, those fields include the title, body, head branch, and base branch; a body can contain private code or project context if you put it there. Actions responses include workflow and run names or titles, branch, commit SHA, event, status, URLs, and timestamps. The relay does not add these proxy request or response bodies to its persistent relay state or logs by design.</p>
        <p>The access token is held by the relay, encrypted at rest with the configured relay session secret, and is not sent to other room members or stored in the desktop app. An essential, secure, HTTP-only session cookie identifies the relay session. Sessions expire after the configured session period. Signing out deletes that relay session and cookie; it does not revoke GitHub’s authorization. You can revoke the grant in GitHub settings.</p>
        <p>GitHub receives the OAuth and API requests necessary to sign you in and perform requested GitHub operations. GitHub applies its own privacy terms. The official relay does not use your repository access to scan repositories, train models, advertise, or sell data.</p>
      </section>

      <section>
        <h2>4. Data held by the official relay</h2>
        <p>The relay does not maintain a separate password or billing account. Your GitHub-linked relay identity and its associated records function as your hosted-service account. Depending on how you use the service, the relay stores or processes:</p>
        <ul>
          <li>GitHub identity metadata, encrypted OAuth sessions, session expiration, and essential session identifiers;</li>
          <li>team and room identifiers and names, membership and ownership roles, active-host state, presence, timestamps, room settings, selected model identifiers, and the selected local project path string, which may expose directory or user names;</li>
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
        <p>Room messages, Codex lifecycle content, and attachments are encrypted on participating devices before relay transport using the app’s MLS-based protocol. Except for content you deliberately place in a GitHub operation field, the relay is designed not to receive plaintext room messages or attachments, project file contents, file diffs, terminal output, browser page contents, room MLS secrets, or Codex or OpenAI credentials. Plaintext GitHub access tokens are used in relay memory for requested GitHub calls but are not written to persistent storage.</p>
        <p>Your selected project, local Git checkout, local encrypted room history, MLS state, Codex session and credentials, browser data, terminal processes, application settings, and diagnostics remain on your Mac unless you deliberately share content with a room, GitHub, a subprocess, a website, or a support channel. Local secrets use macOS Keychain where the implementation specifies it. This is an intended and tested design boundary, not an independently audited guarantee.</p>
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
        <p>Before the official relay enables self-service deletion with restorable backups, its operator must keep a restricted deletion ledger outside the relay database and its backup set. The ledger retains only an HMAC-SHA-256 value derived from the GitHub user ID under a separate secret key, the deletion time, and the last covered backup-expiry date. It is used only to reapply deletions in an isolated restore before traffic resumes and is removed after every covered backup expires; it does not retain the raw GitHub ID, login, token, or deleted-record inventory.</p>
        <p>You can select <strong>Delete hosted account data</strong> in the app’s Profile drawer and enter the required confirmation. Deletion removes your relay sessions, memberships, registered devices and KeyPackages, pending invite artifacts, and unused invites you authored. If you own a team, you must transfer or delete it first; if you are recorded as host of any non-deleted room, you must hand off or delete that room first. These blockers prevent deletion from stranding collaborators or leaving an invalid room owner or host.</p>
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
        <p>We use technical and organizational safeguards appropriate to an experimental service, including transport encryption, encrypted token persistence, MLS ciphertext transport, access controls, rate limits, and data minimization. No system is perfectly secure. Do not use the alpha for regulated, safety-critical, or highly sensitive work unless you have independently assessed it.</p>
        <p>We and our providers may process data in the United States and other locations where they operate. The service is intended for adults and is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
      </section>

      <section>
        <h2>12. Changes</h2>
        <p>This policy is effective {effectiveDate}. We will post revisions here with a new effective date. If a change materially affects the hosted service, we will provide additional notice when reasonably possible.</p>
      </section>
    </LegalPage>
  );
}
