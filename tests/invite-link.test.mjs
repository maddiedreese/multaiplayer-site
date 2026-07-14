import assert from "node:assert/strict";
import test from "node:test";
import {
  inspectInviteHref,
  MAX_INVITE_ID_LENGTH,
  MAX_INVITE_URL_LENGTH,
  MAX_JOIN_PAYLOAD_LENGTH,
} from "../lib/invite-link.mjs";

function inviteHref({ host = "open.multaiplayer.com", path = "/invite", invite = "invite_123", payload = "Abc_123-xyz", order } = {}) {
  const fields = order ?? [["invite", invite], ["multaiplayerJoin", payload], ["approval", "request"]];
  return `https://${host}${path}#${new URLSearchParams(fields)}`;
}

test("accepts both associated hosts, normalized paths, and any singleton field order", () => {
  const canonical = inspectInviteHref(inviteHref());
  assert.equal(canonical?.scrubbedPath, "/invite");
  assert.match(canonical?.alternateHref ?? "", /^https:\/\/multaiplayer\.com\/invite#/);

  const alternate = inspectInviteHref(inviteHref({
    host: "multaiplayer.com",
    path: "/invite/",
    order: [["approval", "request"], ["multaiplayerJoin", "payload_1"], ["invite", "id-1"]],
  }));
  assert.match(alternate?.alternateHref ?? "", /^https:\/\/open\.multaiplayer\.com\/invite#/);
});

test("enforces exact singleton fragment fields and forbids query material", () => {
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite?invite=id#multaiplayerJoin=cap&approval=request"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=id&invite=again&multaiplayerJoin=cap&approval=request"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=id&multaiplayerJoin=cap&approval=request&extra=1"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=id&multaiplayerJoin=cap&approval=approve"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=%69d&multaiplayerJoin=cap&approval=request"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=id&multaiplayerJoin=%63ap&approval=request"), null);
  assert.equal(inspectInviteHref("https://open.multaiplayer.com/invite#invite=id&multaiplayerJoin=cap+more&approval=request"), null);
});

test("rejects unsafe origins, paths, credentials, and alphabets", () => {
  assert.equal(inspectInviteHref(inviteHref({ host: "evil.example" })), null);
  assert.equal(inspectInviteHref(inviteHref({ path: "/other" })), null);
  assert.equal(inspectInviteHref("https://user@open.multaiplayer.com/invite#invite=id&multaiplayerJoin=cap&approval=request"), null);
  assert.equal(inspectInviteHref(inviteHref({ invite: "not valid" })), null);
  assert.equal(inspectInviteHref(inviteHref({ payload: "not+base64url" })), null);
});

test("accepts exact component bounds and rejects each oversize value", () => {
  assert.ok(inspectInviteHref(inviteHref({ invite: "i".repeat(MAX_INVITE_ID_LENGTH) })));
  assert.equal(inspectInviteHref(inviteHref({ invite: "i".repeat(MAX_INVITE_ID_LENGTH + 1) })), null);
  assert.ok(inspectInviteHref(inviteHref({ payload: "p".repeat(MAX_JOIN_PAYLOAD_LENGTH) })));
  assert.equal(inspectInviteHref(inviteHref({ payload: "p".repeat(MAX_JOIN_PAYLOAD_LENGTH + 1) })), null);

  assert.equal(MAX_INVITE_URL_LENGTH, 12_288);
  const oversizedUrl = `https://open.multaiplayer.com/invite#invite=i&multaiplayerJoin=${"p".repeat(MAX_INVITE_URL_LENGTH)}&approval=request`;
  assert.ok(oversizedUrl.length > MAX_INVITE_URL_LENGTH);
  assert.equal(inspectInviteHref(oversizedUrl), null);
});
