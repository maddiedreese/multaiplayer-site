import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://multaiplayer.com"),
  title: "multAIplayer — Build with Codex. Together.",
  description: "A private team room for the conversation, code, tools, and decisions around a shared Codex session.",
  applicationName: "multAIplayer",
  keywords: ["Codex", "collaboration", "pair programming", "AI coding", "developer tools"],
  openGraph: {
    title: "multAIplayer — Build with Codex. Together.",
    description: "Private group chat for coding with Codex. Open source.",
    url: "https://multaiplayer.com",
    siteName: "multAIplayer",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Build with Codex. Together — multAIplayer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "multAIplayer — Build with Codex. Together.",
    description: "Private group chat for coding with Codex. Open source.",
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
