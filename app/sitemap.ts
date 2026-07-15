import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const publicRoutes = ["", "/faq", "/privacy", "/terms", "/security/updater-key"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `https://multaiplayer.com${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/faq" ? 0.8 : 0.5,
  }));
}
