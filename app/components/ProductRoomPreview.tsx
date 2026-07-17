import type { ReactNode } from "react";

type ProductRoomPreviewProps = { theme: "dark" | "light"; compact?: boolean };

export function ProductRoomPreview({ theme, compact = false }: ProductRoomPreviewProps) {
  return (
    <div className={`product-preview product-preview-${theme}${compact ? " product-preview-compact" : ""}`} role="img" aria-label="Illustration of the current multAIplayer desktop room with team chat, Codex activity, host controls, and room context">
      <aside className="preview-sidebar">
        <div className="preview-brand"><span aria-hidden="true">›_</span><strong>multAIplayer</strong><small>group chat for Codex</small></div>
        <div className="preview-account"><GitHubMark /><span><strong>Avery</strong><small>@av</small></span><b>Sign out</b></div>
        <div className="preview-search">⌕&nbsp;&nbsp; Search rooms, projects…</div>
        <div className="preview-section-title"><small>Teams</small><span>＋</span></div>
        <div className="preview-team"><strong>⌄&nbsp;&nbsp;Studio</strong><small>3 members</small></div>
        <div className="preview-room preview-room-active"><span><strong>Launch</strong><small>Avery</small></span></div>
      </aside>

      <section className="preview-main">
        <header className="preview-room-heading"><small>Studio⌄</small><strong>Launch</strong><span className="preview-collapse" aria-hidden="true">⌃</span></header>
        <nav className="preview-tabs" aria-label="Illustrated room tools"><span>▤&nbsp; Files</span><span>›_&nbsp; Terminal</span><span>◎&nbsp; Browser</span><strong>♙&nbsp; Room</strong></nav>
        <div className="preview-controls"><strong>Host</strong><span>Handoff</span><span>GPT-5.2 Codex</span><span>High</span><span>Standard</span><span>▣ Markdown</span><span>▣ Share local preview</span><span>▣ Selected</span></div>
        <div className="preview-thread">
          <PreviewMessage initials="M" name="Maya" time="11:42">Ready to hand the project to Jordan after this pass?<small>👍 2</small></PreviewMessage>
          <PreviewMessage initials="✣" name="Codex via Avery" time="11:44" codex>Handoff checks are green. I added device verification and preserved the shared room history.<b>✓&nbsp; Codex worked <i>1 step&nbsp; ›</i></b></PreviewMessage>
        </div>
        <div className="preview-composer"><span>✣</span><p>Message the room, or type @Codex to invoke the active host…</p><b>➤</b></div>
      </section>

      <aside className="preview-context">
        <header><small>Shared work</small><strong>Live with 3 teammates</strong></header>
        <div className="preview-activity"><header><strong>Codex activity</strong><small>1 item</small></header><p><i /> ▧&nbsp; Edited files <small>Completed&nbsp;&nbsp; 11:00 AM</small></p></div>
        <div className="preview-project"><small>Project</small><strong>launch-kit</strong><span>3 files changed · checks passed</span></div>
      </aside>
    </div>
  );
}

function GitHubMark() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" /></svg>;
}

function PreviewMessage({ initials, name, time, codex = false, children }: { initials: string; name: string; time: string; codex?: boolean; children: ReactNode }) {
  return <article className={`preview-message${codex ? " preview-message-codex" : ""}`}><i>{initials}</i><div><header><strong>{name}</strong><time>{time}</time></header><p>{children}</p></div></article>;
}
