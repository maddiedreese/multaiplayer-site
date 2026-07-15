import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/invite",
    },
    sitemap: "https://multaiplayer.com/sitemap.xml",
    host: "https://multaiplayer.com",
  };
}
