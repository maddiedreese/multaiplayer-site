export const INVITE_HOSTS: readonly ["open.multaiplayer.com", "multaiplayer.com"];
export const CANONICAL_INVITE_ORIGIN: "https://open.multaiplayer.com";
export const MAX_INVITE_URL_LENGTH: 12288;
export const MAX_INVITE_ID_LENGTH: 160;
export const MAX_JOIN_PAYLOAD_LENGTH: 8192;
export function inspectInviteHref(href: string): { alternateHref: string; scrubbedPath: string } | null;
