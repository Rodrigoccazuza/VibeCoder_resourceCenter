import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCoder Resource Center — Rodrigo Cazuza",
  description: "A curated library of design, AI, Figma, inspiration, typography, motion, UI libraries and front-end resources.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "VibeCoder Resource Center — Rodrigo Cazuza",
    description: "A searchable resource center for designers, developers and AI-assisted creative workflows.",
    type: "website",
    siteName: "VibeCoder Resource Center",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeCoder Resource Center — Rodrigo Cazuza",
    description: "A searchable resource center for designers, developers and AI-assisted creative workflows.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
