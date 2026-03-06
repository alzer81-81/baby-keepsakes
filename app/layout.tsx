import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Baby Keepsakes",
  description: "Build your birth poster keepsake with soft themes, beautiful type, and a live preview.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }]
  },
  openGraph: {
    title: "Baby Keepsakes",
    description: "Build your birth poster keepsake with soft themes, beautiful type, and a live preview.",
    images: [{ url: "/opengraph.png", width: 1200, height: 630, alt: "Baby Keepsakes" }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Baby Keepsakes",
    description: "Build your birth poster keepsake with soft themes, beautiful type, and a live preview.",
    images: ["/opengraph.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
