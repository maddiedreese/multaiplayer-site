import type { Metadata } from "next";
import { LegalPage, companyName, contactEmail, effectiveDate, mailingAddress } from "../legal";

export const metadata: Metadata = {
  title: "Terms of Service | multAIplayer",
  description: "Terms for the free, open-source multAIplayer alpha and official hosted relay.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" description="The rules and limitations for the multAIplayer website and official hosted relay.">
      <p className="legal-summary">These Terms form an agreement between you and {companyName}, {mailingAddress}, when you use the official website or hosted relay, including relay access through the desktop app. If you do not agree, do not use those services. Your rights to download, run, modify, or self-host the open-source software are governed by its open-source and third-party licenses, not by these hosted-service Terms.</p>

      <section>
        <h2>1. The alpha service</h2>
        <p>multAIplayer is free, experimental, open-source collaboration software. The official service consists of a static website and, when deployed and available, GitHub-based sign-in and an official relay designated to run on Railway. The supported public-alpha desktop target is an Apple silicon Mac running macOS 11 or later.</p>
        <p>The alpha may contain bugs, lose or delay encrypted relay data, change protocol or storage formats, become incompatible with older rooms or Codex versions, or require manual recovery. It has not received an independent security audit. It is not designed for emergency, medical, financial, legal, regulated, safety-critical, or other use where failure could cause material harm.</p>
      </section>

      <section>
        <h2>2. Eligibility and responsibility</h2>
        <p>You must be at least 18 years old, able to form a binding contract, and legally permitted to use the service. If you use it for an organization, you represent that you have authority to bind that organization.</p>
        <p>You are responsible for your GitHub and Codex accounts, devices, collaborators, project backups, Git history, credentials, approvals, local commands, repositories, and compliance obligations. Room members are not anonymous spectators: admitted members may receive shared project context and request consequential actions. Invite only people you trust and review every host approval.</p>
      </section>

      <section>
        <h2>3. GitHub, Codex, repositories, and third parties</h2>
        <p>A GitHub account is required for the official relay. The alpha requests GitHub’s broad <code>repo</code> scope for public and private repositories, plus <code>read:user</code>, so the native desktop app can perform repository API, pull-request, and Actions operations you initiate directly with GitHub. Local Git commands and pushes separately use credentials available on the active host. Hosting a Codex room requires your own eligible Codex access. You authorize the app to send the GitHub API requests you select and authorize the relay to verify your GitHub identity once at sign-in.</p>
        <p>You must have permission to access and share every repository, file, account, prompt, attachment, and other material you use. GitHub, OpenAI/Codex, Railway, Netlify, Git remotes, websites, package registries, tunnel providers, and other third parties have their own terms and may change or discontinue their services. multAIplayer is independent and is not affiliated with, endorsed by, or sponsored by OpenAI.</p>
      </section>

      <section>
        <h2>4. Local authority and security boundaries</h2>
        <p>The active host controls a real machine. Approved Codex turns, terminal commands, subprocesses, file operations, browser opens, Git/GitHub operations, and preview tools may read data, change the selected project, use accounts and environment variables, start child processes, and communicate over the network. Filesystem confinement and warnings reduce risk but do not make approved code, collaborators, dependencies, or websites safe.</p>
        <p>You must review proposed actions and use least-privileged test accounts and disposable data where appropriate. Never treat encryption, redaction, sandboxing, secret detection, or host approval as a substitute for backups, access controls, code review, and professional security judgment.</p>
      </section>

      <section>
        <h2>5. Your content and open-source license</h2>
        <p>You retain ownership of your content. You grant {companyName} a limited license to host, transmit, process, reproduce, and delete content only as needed to operate, secure, support, and comply with law for the service. Your instructions and room membership determine which collaborators receive shared material.</p>
        <p>The source code is licensed separately under the Apache License 2.0. These Terms govern the official website and hosted service and do not replace the open-source license for code you download, modify, or self-host. Contributions to project repositories are governed by the repository’s contribution terms and applicable license.</p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <p>You may not use the service to:</p>
        <ul>
          <li>break the law, violate another person’s rights, or access systems, accounts, repositories, or data without authorization;</li>
          <li>distribute malware, exploit code against non-consenting targets, stolen credentials, unlawful content, or material that infringes intellectual-property or privacy rights;</li>
          <li>harass, threaten, defraud, impersonate, dox, or facilitate abuse of another person;</li>
          <li>probe, evade, disable, or overwhelm authentication, rate limits, quotas, security controls, the relay, or its providers except through authorized good-faith security research;</li>
          <li>share invite capabilities publicly, harvest user data, operate unsolicited messaging, or use the service as general-purpose file hosting, proxying, mining, or automated traffic infrastructure;</li>
          <li>interfere with other users or place unreasonable load on a free alpha service.</li>
        </ul>
        <p>Report vulnerabilities privately as directed in the project’s SECURITY.md. Do not include active invite links, real credentials, private code, or personal data in public issues.</p>
      </section>

      <section>
        <h2>7. Privacy and deletion</h2>
        <p>Our <a href="/privacy">Privacy Policy</a> explains what the website, app, and relay handle. There is no separate password or billing account; your GitHub-linked hosted identity functions as the relay account. You may select <strong>Delete hosted account data</strong> in the app’s Profile drawer, subject to first transferring or deleting any team you own and handing off or deleting every non-deleted room you host. Shared encrypted records may remain for their documented retention and integrity purposes.</p>
      </section>

      <section>
        <h2>8. Suspension, termination, and shutdown</h2>
        <p>You may stop using the service, sign out, revoke GitHub authorization, delete your hosted relay identity, and remove local software at any time. We may limit, suspend, or terminate access; remove data; or block traffic when reasonably necessary for abuse, security, legal compliance, provider requirements, operational risk, or a violation of these Terms. When practical, we will provide notice and an opportunity to remedy.</p>
        <p>We may change or discontinue any part of the free alpha. For a planned shutdown of the official relay, we intend to provide at least 30 days’ public notice when safely and reasonably possible. Security incidents, law, provider failure, or other emergencies may require immediate action. You are responsible for keeping project and Git backups and exporting anything you need.</p>
      </section>

      <section>
        <h2>9. No fees or support commitment</h2>
        <p>The official alpha is currently provided without charge. We do not promise that it will remain available, free, or unchanged. We may introduce limits or future paid services only with notice; these Terms do not authorize us to charge you without a separate transaction.</p>
        <p>Support is best-effort through project documentation, GitHub issues, and <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. There is no service-level agreement, guaranteed response time, compatibility commitment, data-recovery service, or obligation to provide maintenance, updates, or security fixes.</p>
      </section>

      <section>
        <h2>10. Disclaimers</h2>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE AND SOFTWARE ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, SECURITY, ACCURACY, AVAILABILITY, OR DATA PRESERVATION. WE DO NOT WARRANT THAT ENCRYPTION, SANDBOXING, REDACTION, APPROVALS, THIRD-PARTY SERVICES, OR THE ALPHA WILL PREVENT LOSS, DISCLOSURE, OR UNAUTHORIZED ACTION.</p>
        <p>Nothing in these Terms excludes a warranty or right that applicable law does not allow us to exclude.</p>
      </section>

      <section>
        <h2>11. Limitation of liability</h2>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, {companyName.toUpperCase()} AND ITS DIRECTORS, OFFICERS, EMPLOYEES, CONTRIBUTORS, AND PROVIDERS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF DATA, CODE, PROFITS, REVENUE, GOODWILL, SECURITY, OR BUSINESS INTERRUPTION, ARISING FROM OR RELATED TO THE SERVICE.</p>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE FREE SERVICE WILL NOT EXCEED US $100. These limits apply regardless of the legal theory and even if a remedy fails of its essential purpose. They do not apply where prohibited by law.</p>
      </section>

      <section>
        <h2>12. Indemnity</h2>
        <p>To the extent permitted by law, you will defend, indemnify, and hold harmless {companyName} and its directors, officers, employees, and agents from third-party claims, liabilities, damages, and reasonable costs arising from your content, your misuse of the service, your violation of these Terms, or your violation of another person’s rights. This does not apply to the extent a claim results from our own unlawful conduct.</p>
      </section>

      <section>
        <h2>13. Governing law and disputes</h2>
        <p>California law governs these Terms, without regard to conflict-of-law rules. State and federal courts located in California will have exclusive jurisdiction over disputes arising from these Terms or the service, and you and {companyName} consent to their jurisdiction and venue. Before filing a claim, please email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and allow 30 days for an informal resolution. This section does not prevent either party from seeking urgent injunctive relief or using a court process that applicable law requires.</p>
      </section>

      <section>
        <h2>14. General terms</h2>
        <p>These Terms and the Privacy Policy are the entire agreement about the official service. If a provision is unenforceable, the remainder stays effective. Our failure to enforce a term is not a waiver. You may not assign these Terms without our consent; we may assign them as part of a reorganization, financing, acquisition, or transfer of the service. No third party is a beneficiary.</p>
        <p>We may update these Terms by posting a revised version and effective date. Material changes will receive additional notice when reasonably possible. Continuing to use the service after revised Terms take effect means you accept them. These Terms are effective {effectiveDate}. Questions may be sent to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
      </section>
    </LegalPage>
  );
}
