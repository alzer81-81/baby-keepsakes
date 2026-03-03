import type { Metadata } from "next";

import "@/app/globals.css";
import {
  archivo,
  cormorant,
  dmSans,
  firaSans,
  libreBaskerville,
  lora,
  merriweather,
  montserrat,
  nunito,
  playfair,
  poppins,
  quicksand,
  raleway,
  rubik
} from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Birth Poster Builder",
  description: "Build custom birth posters and pay securely via Stripe Checkout."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${lora.variable} ${nunito.variable} ${merriweather.variable} ${raleway.variable} ${poppins.variable} ${cormorant.variable} ${libreBaskerville.variable} ${quicksand.variable} ${rubik.variable} ${dmSans.variable} ${archivo.variable} ${firaSans.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
