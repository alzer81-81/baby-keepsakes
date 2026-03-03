import {
  Archivo,
  Cormorant_Garamond,
  DM_Sans,
  Fira_Sans,
  Libre_Baskerville,
  Lora,
  Merriweather,
  Montserrat,
  Nunito,
  Playfair_Display,
  Poppins,
  Quicksand,
  Raleway,
  Rubik
} from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito"
});

export const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["400", "700", "900"]
});

export const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway"
});

export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "700", "800"]
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"]
});

export const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  weight: ["400", "700"]
});

export const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand"
});

export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik"
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans"
});

export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo"
});

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["400", "500", "700", "800"]
});
