export const INVITE_HOSTS = Object.freeze(["open.multaiplayer.com", "multaiplayer.com"]);
export const CANONICAL_INVITE_ORIGIN = `https://${INVITE_HOSTS[0]}`;

export const MAX_INVITE_URL_LENGTH = 12_288;
export const MAX_INVITE_ID_LENGTH = 160;
export const MAX_JOIN_PAYLOAD_LENGTH = 8_192;
const INVITE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const JOIN_PAYLOAD_PATTERN = /^[A-Za-z0-9_-]+$/;

export function inspectInviteHref(href) {
  if (typeof href !== "string" || href.length === 0 || href.length > MAX_INVITE_URL_LENGTH) return null;

  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    !INVITE_HOSTS.includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password ||
    !["/invite", "/invite/"].includes(url.pathname) ||
    url.search
  ) return null;

  const rawFragment = url.hash.slice(1);
  if (!rawFragment || rawFragment.includes("%") || rawFragment.includes("+")) return null;
  const pairs = rawFragment.split("&").map((field) => {
    const separator = field.indexOf("=");
    if (separator <= 0 || field.indexOf("=", separator + 1) !== -1) return null;
    return [field.slice(0, separator), field.slice(separator + 1)];
  });
  if (pairs.some((pair) => pair === null)) return null;
  const fields = new Map(pairs);
  if (pairs.length !== 3 || fields.size !== 3 || !fields.has("invite") || !fields.has("multaiplayerJoin") || !fields.has("approval")) return null;
  const inviteId = fields.get("invite");
  if (!inviteId || inviteId.length > MAX_INVITE_ID_LENGTH || !INVITE_ID_PATTERN.test(inviteId)) return null;

  const joinPayload = fields.get("multaiplayerJoin");
  const approval = fields.get("approval");
  if (
    !joinPayload ||
    joinPayload.length > MAX_JOIN_PAYLOAD_LENGTH ||
    !JOIN_PAYLOAD_PATTERN.test(joinPayload) ||
    approval !== "request"
  ) return null;

  const alternateHost = url.hostname === INVITE_HOSTS[0] ? INVITE_HOSTS[1] : INVITE_HOSTS[0];
  const alternateUrl = new URL(url.toString());
  alternateUrl.hostname = alternateHost;
  alternateUrl.pathname = "/invite";

  return {
    alternateHref: alternateUrl.toString(),
    scrubbedPath: "/invite",
  };
}
