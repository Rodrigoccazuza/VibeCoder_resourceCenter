import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCoder Resource Center — Rodrigo Cazuza",
  description: "A curated library of design, AI, Figma, inspiration, typography and front-end resources.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
