import type { Metadata } from "next";
import "./globals.css";
import { releaseManifest } from "../lib/release-manifest";

const releaseDescription = releaseManifest.supported
  ? `Download multAIplayer ${releaseManifest.version} for Apple silicon Macs.`
  : "The first supported signed alpha for Apple silicon Macs has not been published.";

export const metadata: Metadata = {
  metadataBase: new URL("https://multaiplayer.com"),
  title: "multAIplayer | Build with Codex. Together.",
  description: `A free, open-source team room for working with Codex. ${releaseDescription}`,
  applicationName: "multAIplayer",
  keywords: ["Codex", "collaboration", "pair programming", "AI coding", "developer tools"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "multAIplayer | Build with Codex. Together.",
    description: `Free, open-source group chat for coding with Codex. ${releaseDescription}`,
    url: "https://multaiplayer.com",
    siteName: "multAIplayer",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Build with Codex. Together | multAIplayer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "multAIplayer | Build with Codex. Together.",
    description: `Free, open-source group chat for coding with Codex. ${releaseDescription}`,
    images: ["/og.png"],
  },
  icons: {
    icon: "/brand/icon.png",
    apple: "/brand/icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
