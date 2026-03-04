export type PosterTheme =
  | "blush_meadow"
  | "warm_peach"
  | "powder_blue"
  | "sage_rose"
  | "terracotta_sky"
  | "mono_ink"
  | "red"
  | "orange"
  | "blue";
export type PosterTextTone = "classic" | "soft" | "bold";
export type PosterFont =
  | "playfair"
  | "montserrat"
  | "lora"
  | "nunito"
  | "merriweather"
  | "raleway"
  | "poppins"
  | "cormorant"
  | "libre_baskerville"
  | "quicksand"
  | "rubik"
  | "dm_sans"
  | "archivo"
  | "fira_sans";
export type PosterArtwork = "lion" | "bear" | "cat" | "panda" | "dog" | "fox" | "bird" | "bee";

export interface BabyDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  month: string;
  day: number;
  year: number;
  time: string;
  hospital: string;
  city: string;
  country: string;
  weightPounds: number;
  weightOunces: number;
}

export interface PosterDesignSpec {
  theme: PosterTheme;
  textTone: PosterTextTone;
  font: PosterFont;
  artwork: PosterArtwork;
  baby: BabyDetails;
}

export const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

export const defaultDesignSpec: PosterDesignSpec = {
  theme: "blush_meadow",
  textTone: "classic",
  font: "playfair",
  artwork: "lion",
  baby: {
    firstName: "Noah",
    middleName: "James",
    lastName: "Parker",
    month: "August",
    day: 12,
    year: 2024,
    time: "06:42 AM",
    hospital: "City Maternity",
    city: "Boston",
    country: "USA",
    weightPounds: 8,
    weightOunces: 4
  }
};

export function sanitizeDesignSpec(input: PosterDesignSpec): PosterDesignSpec {
  const safeTheme: PosterTheme = [
    "blush_meadow",
    "warm_peach",
    "powder_blue",
    "sage_rose",
    "terracotta_sky",
    "mono_ink",
    "red",
    "orange",
    "blue"
  ].includes(input.theme)
    ? input.theme
    : "blush_meadow";
  const safeTextTone: PosterTextTone = ["classic", "soft", "bold"].includes(input.textTone) ? input.textTone : "classic";
  const safeFont: PosterFont = [
    "playfair",
    "montserrat",
    "lora",
    "nunito",
    "merriweather",
    "raleway",
    "poppins",
    "cormorant",
    "libre_baskerville",
    "quicksand",
    "rubik",
    "dm_sans",
    "archivo",
    "fira_sans"
  ].includes(input.font)
    ? input.font
    : "playfair";
  const safeArtwork: PosterArtwork = ["lion", "bear", "cat", "panda", "dog", "fox", "bird", "bee"].includes(input.artwork)
    ? input.artwork
    : "lion";
  const safeMonth = MONTH_OPTIONS.includes(input.baby.month as (typeof MONTH_OPTIONS)[number])
    ? input.baby.month
    : "January";

  return {
    theme: safeTheme,
    textTone: safeTextTone,
    font: safeFont,
    artwork: safeArtwork,
    baby: {
      firstName: input.baby.firstName.trim().slice(0, 40),
      middleName: (input.baby.middleName ?? "").trim().slice(0, 40),
      lastName: input.baby.lastName.trim().slice(0, 40),
      month: safeMonth,
      day: Math.max(1, Math.min(31, Number(input.baby.day) || 1)),
      year: Math.max(1900, Math.min(2099, Number(input.baby.year) || 2024)),
      time: input.baby.time.trim().slice(0, 20) || "00:00",
      hospital: input.baby.hospital.trim().slice(0, 80),
      city: input.baby.city.trim().slice(0, 80),
      country: input.baby.country.trim().slice(0, 80),
      weightPounds: Math.max(0, Math.min(20, Number(input.baby.weightPounds) || 0)),
      weightOunces: Math.max(0, Math.min(15, Number(input.baby.weightOunces) || 0))
    }
  };
}
