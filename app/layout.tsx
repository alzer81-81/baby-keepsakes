import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Birth Poster Builder",
  description: "Build custom birth posters and pay securely via Stripe Checkout."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
