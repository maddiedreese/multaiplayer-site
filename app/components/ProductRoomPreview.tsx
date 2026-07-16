type ProductRoomPreviewProps = {
  theme: "dark" | "light";
  compact?: boolean;
};

const roomNames = ["Desktop launch", "Relay operations"];

export function ProductRoomPreview({ theme, compact = false }: ProductRoomPreviewProps) {
  return (
    <div
      className={`product-preview product-preview-${theme}${compact ? " product-preview-compact" : ""}`}
      role="img"
      aria-label="Illustration of the multAIplayer desktop room with team chat, Codex activity, project files, and host controls"
    >
      <aside className="preview-sidebar">
        <div className="preview-brand"><span aria-hidden="true">›_</span><strong>multAIplayer</strong></div>
        <div className="preview-account"><i /> Signed in as casey</div>
        <div className="preview-search">Search rooms and projects</div>
        <small>LAUNCH TEAM</small>
        {roomNames.map((room, index) => (
          <div className={`preview-room${index === 0 ? " preview-room-active" : ""}`} key={room}>
            <i />
            <span><strong>{room}</strong><small>{index === 0 ? "4 members" : "2 members"}</small></span>
          </div>
        ))}
        <div className="preview-sidebar-spacer" />
        <div className="preview-sidebar-links"><span>Settings</span><span>Profile</span></div>
      </aside>

      <section className="preview-main">
        <header className="preview-room-heading">
          <div><small>Launch Team</small><strong>Desktop launch</strong></div>
          <span><i /> encrypted room</span>
        </header>
        <nav className="preview-tabs" aria-label="Illustrated room tools">
          <strong>Chat</strong><span>Files</span><span>Terminal</span><span>Browser</span><span>Room</span>
        </nav>
        <div className="preview-controls">
          <span className="preview-active-control">Host</span><span>Handoff</span><span>Standard</span><span>Selected model</span>
        </div>
        <div className="preview-boundary"><span>◇</span><p><strong>The host reviews local actions.</strong> Room members can see shared Codex events, diffs, and tool activity.</p><b>Understood</b></div>
        <div className="preview-thread">
          <PreviewMessage initials="C" name="Casey" time="10:14">Let’s trace the failing workspace test before we touch the implementation.</PreviewMessage>
          <PreviewMessage initials="R" name="Rowan" time="10:15">I reproduced it in the parser and added the smallest fixture.</PreviewMessage>
          <PreviewMessage initials="✣" name="Codex" time="10:16" codex>
            <strong>Debugging plan</strong>
            <span>1. Reproduce the parser failure</span>
            <span>2. Inspect the smallest input boundary</span>
            <span>3. Run the focused regression test</span>
          </PreviewMessage>
        </div>
        <div className="preview-composer"><span>Message the room, or type @Codex…</span><b>↗</b></div>
      </section>

      <aside className="preview-context">
        <header><small>CONTEXT</small><strong>Files</strong></header>
        <div className="preview-project">
          <small>PROJECT</small><strong>northstar</strong><span>~/Projects/northstar</span><span className="preview-project-state">Attached</span>
        </div>
        <div className="preview-file-list">
          <small>PROJECT FILES</small>
          <span>src/App.tsx <i>28 KB</i></span>
          <span>src/relay.ts <i>14 KB</i></span>
          <span>docs/release.md <i>8 KB</i></span>
          <span>README.md <i>5 KB</i></span>
        </div>
      </aside>
    </div>
  );
}

function PreviewMessage({
  initials,
  name,
  time,
  codex = false,
  children,
}: {
  initials: string;
  name: string;
  time: string;
  codex?: boolean;
  children: ReactNode;
}) {
  return (
    <article className={`preview-message${codex ? " preview-message-codex" : ""}`}>
      <i>{initials}</i>
      <div><header><strong>{name}</strong><time>{time}</time></header><p>{children}</p></div>
    </article>
  );
}
import type { ReactNode } from "react";
