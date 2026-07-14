export const INVITE_CAPTURE_SCRIPT = `(() => {
  if (!["/invite", "/invite/"].includes(location.pathname)) return;
  const href = location.href;
  const raw = location.hash.slice(1);
  const pairs = raw.split("&").map((field) => {
    const separator = field.indexOf("=");
    return separator > 0 && field.indexOf("=", separator + 1) === -1 ? [field.slice(0, separator), field.slice(separator + 1)] : null;
  });
  const fields = pairs.every(Boolean) ? new Map(pairs) : new Map();
  const invite = fields.get("invite");
  const capability = fields.get("multaiplayerJoin");
  const eligible = href.length <= 12288 && !location.search && ["open.multaiplayer.com", "multaiplayer.com"].includes(location.hostname) && location.protocol === "https:" && pairs.length === 3 && fields.size === 3 && typeof invite === "string" && invite.length > 0 && invite.length <= 160 && /^[A-Za-z0-9_-]+$/.test(invite) && typeof capability === "string" && capability.length > 0 && capability.length <= 8192 && /^[A-Za-z0-9_-]+$/.test(capability) && fields.get("approval") === "request";
  if (location.pathname !== "/invite" || location.search || location.hash) {
    history.replaceState(history.state, "", "/invite");
  }
  if (!eligible) return;
  Object.defineProperty(window, "__MULTAIPLAYER_PENDING_INVITE__", {
    value: href,
    configurable: true,
    writable: true
  });
})();`;
