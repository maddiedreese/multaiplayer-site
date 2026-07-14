import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const APP_BUNDLE_ID = "com.multaiplayer.desktop";
export const TEAM_ID_PATTERN = /^[A-Z0-9]{10}$/;

export function buildAasa(teamId) {
  if (typeof teamId !== "string" || !TEAM_ID_PATTERN.test(teamId)) {
    throw new Error("MULTAIPLAYER_APPLE_TEAM_ID must be exactly 10 uppercase ASCII letters or digits.");
  }

  return {
    applinks: {
      apps: [],
      details: [{
        appIDs: [`${teamId}.${APP_BUNDLE_ID}`],
        components: [
          { "/": "/invite", comment: "Opens a private multAIplayer invitation." },
          { "/": "/invite/", comment: "Opens a normalized private multAIplayer invitation." },
        ],
      }],
    },
  };
}

export async function writeAasa(teamId = process.env.MULTAIPLAYER_APPLE_TEAM_ID) {
  const outputUrl = new URL("../public/.well-known/apple-app-site-association", import.meta.url);
  await mkdir(new URL(".", outputUrl), { recursive: true });
  await writeFile(outputUrl, `${JSON.stringify(buildAasa(teamId), null, 2)}\n`, "utf8");
  return fileURLToPath(outputUrl);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  writeAasa().then((path) => console.log(`Generated ${path}.`)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
