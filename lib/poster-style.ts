import { PosterFont, PosterTextTone, PosterTheme } from "@/lib/design-spec";

export type ThemePalette = {
  background: string;
  band: string;
  stitch: string;
  month: string;
  day: string;
  year: string;
  time: string;
  artworkA: string;
  artworkB: string;
  firstName: string;
  middleName: string;
  lastName: string;
  hospital: string;
  city: string;
  country: string;
  footprint: string;
  badgeFill: string;
  badgeText: string;
};

export const themePalette: Record<PosterTheme, ThemePalette> = {
  blush_meadow: {
    background: "#ececec",
    band: "#e8b3c8",
    stitch: "#f9f9f9",
    month: "#e6b8c9",
    day: "#dd5a89",
    year: "#e6b8c9",
    time: "#95dca8",
    artworkA: "#95dca8",
    artworkB: "#e8b3c8",
    firstName: "#d95885",
    middleName: "#95dca8",
    lastName: "#ba75bf",
    hospital: "#95dca8",
    city: "#e35f8a",
    country: "#ba75bf",
    footprint: "#e68fb7",
    badgeFill: "#95d6a2",
    badgeText: "#eff8ef"
  },
  warm_peach: {
    background: "#f2efe9",
    band: "#f2c5a4",
    stitch: "#fff8f1",
    month: "#e8b18e",
    day: "#db7c33",
    year: "#dfb69a",
    time: "#8abf9d",
    artworkA: "#8abf9d",
    artworkB: "#f1c49f",
    firstName: "#d96f2b",
    middleName: "#8abf9d",
    lastName: "#b68858",
    hospital: "#8abf9d",
    city: "#d96f2b",
    country: "#b68858",
    footprint: "#e5a070",
    badgeFill: "#8fc8a3",
    badgeText: "#f4fff6"
  },
  powder_blue: {
    background: "#ebf0f5",
    band: "#c3d5ea",
    stitch: "#f6fbff",
    month: "#9fb8d8",
    day: "#4f78aa",
    year: "#a8bdd8",
    time: "#80bbac",
    artworkA: "#80bbac",
    artworkB: "#c3d5ea",
    firstName: "#446d9f",
    middleName: "#80bbac",
    lastName: "#6a78ae",
    hospital: "#80bbac",
    city: "#446d9f",
    country: "#6a78ae",
    footprint: "#91abc8",
    badgeFill: "#80bbac",
    badgeText: "#f1fbf5"
  },
  sage_rose: {
    background: "#edf0e8",
    band: "#dcb4bc",
    stitch: "#f7f6f4",
    month: "#c9a2b0",
    day: "#b9637a",
    year: "#cdb0ba",
    time: "#8fbca3",
    artworkA: "#8fbca3",
    artworkB: "#dcb4bc",
    firstName: "#b55274",
    middleName: "#8fbca3",
    lastName: "#7c5a7a",
    hospital: "#8fbca3",
    city: "#b55274",
    country: "#7c5a7a",
    footprint: "#cf8fa3",
    badgeFill: "#90c6a7",
    badgeText: "#f5fbf6"
  },
  terracotta_sky: {
    background: "#f1ebe5",
    band: "#dca287",
    stitch: "#fbf5ef",
    month: "#b8959f",
    day: "#c4644f",
    year: "#c2a0a8",
    time: "#7ea6b8",
    artworkA: "#7ea6b8",
    artworkB: "#dca287",
    firstName: "#bd5f4f",
    middleName: "#7ea6b8",
    lastName: "#6f7fa7",
    hospital: "#7ea6b8",
    city: "#bd5f4f",
    country: "#6f7fa7",
    footprint: "#cb8b73",
    badgeFill: "#82b5c0",
    badgeText: "#f1f9fb"
  },
  mono_ink: {
    background: "#f3f1ec",
    band: "#d8d4cc",
    stitch: "#fbfaf7",
    month: "#8d8a84",
    day: "#43403b",
    year: "#9a9690",
    time: "#6f8a82",
    artworkA: "#6f8a82",
    artworkB: "#d8d4cc",
    firstName: "#38352f",
    middleName: "#6f8a82",
    lastName: "#55514b",
    hospital: "#6f8a82",
    city: "#38352f",
    country: "#55514b",
    footprint: "#8f8880",
    badgeFill: "#7f9d93",
    badgeText: "#f4faf8"
  },
  red: {
    background: "#ececec",
    band: "#e8b3c8",
    stitch: "#f9f9f9",
    month: "#e6b8c9",
    day: "#dd5a89",
    year: "#e6b8c9",
    time: "#95dca8",
    artworkA: "#95dca8",
    artworkB: "#e8b3c8",
    firstName: "#d95885",
    middleName: "#95dca8",
    lastName: "#ba75bf",
    hospital: "#95dca8",
    city: "#e35f8a",
    country: "#ba75bf",
    footprint: "#e68fb7",
    badgeFill: "#95d6a2",
    badgeText: "#eff8ef"
  },
  orange: {
    background: "#f2efe9",
    band: "#f2c5a4",
    stitch: "#fff8f1",
    month: "#e8b18e",
    day: "#db7c33",
    year: "#dfb69a",
    time: "#8abf9d",
    artworkA: "#8abf9d",
    artworkB: "#f1c49f",
    firstName: "#d96f2b",
    middleName: "#8abf9d",
    lastName: "#b68858",
    hospital: "#8abf9d",
    city: "#d96f2b",
    country: "#b68858",
    footprint: "#e5a070",
    badgeFill: "#8fc8a3",
    badgeText: "#f4fff6"
  },
  blue: {
    background: "#ebf0f5",
    band: "#c3d5ea",
    stitch: "#f6fbff",
    month: "#9fb8d8",
    day: "#4f78aa",
    year: "#a8bdd8",
    time: "#80bbac",
    artworkA: "#80bbac",
    artworkB: "#c3d5ea",
    firstName: "#446d9f",
    middleName: "#80bbac",
    lastName: "#6a78ae",
    hospital: "#80bbac",
    city: "#446d9f",
    country: "#6a78ae",
    footprint: "#91abc8",
    badgeFill: "#80bbac",
    badgeText: "#f1fbf5"
  }
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16)
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
}

function mix(hexA: string, hexB: string, amount: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const t = Math.max(0, Math.min(1, amount));
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
}

export function resolveThemePalette(theme: PosterTheme, textTone: PosterTextTone = "classic"): ThemePalette {
  const base = themePalette[theme];
  if (textTone === "classic") {
    return base;
  }

  const textKeys: Array<keyof ThemePalette> = [
    "month",
    "day",
    "year",
    "time",
    "firstName",
    "middleName",
    "lastName",
    "hospital",
    "city",
    "country"
  ];

  const resolved: ThemePalette = { ...base };
  if (textTone === "soft") {
    for (const key of textKeys) {
      resolved[key] = mix(base[key], base.background, 0.26);
    }
    resolved.badgeText = mix(base.badgeText, "#ffffff", 0.1);
    return resolved;
  }

  for (const key of textKeys) {
    resolved[key] = mix(base[key], "#1f1f1f", 0.2);
  }
  resolved.badgeText = mix(base.badgeText, "#ffffff", 0.2);
  return resolved;
}

export const previewFontFamilies: Record<PosterFont, string> = {
  playfair: "'Playfair Display', serif",
  montserrat: "Montserrat, sans-serif",
  lora: "Lora, serif",
  nunito: "Nunito, sans-serif",
  merriweather: "Merriweather, serif",
  raleway: "Raleway, sans-serif",
  poppins: "Poppins, sans-serif",
  cormorant: "'Cormorant Garamond', serif",
  libre_baskerville: "'Libre Baskerville', serif",
  quicksand: "Quicksand, sans-serif",
  rubik: "Rubik, sans-serif",
  dm_sans: "'DM Sans', sans-serif",
  archivo: "Archivo, sans-serif",
  fira_sans: "'Fira Sans', sans-serif"
};

export const previewFontPrimaryName: Record<PosterFont, string> = {
  playfair: "Playfair Display",
  montserrat: "Montserrat",
  lora: "Lora",
  nunito: "Nunito",
  merriweather: "Merriweather",
  raleway: "Raleway",
  poppins: "Poppins",
  cormorant: "Cormorant Garamond",
  libre_baskerville: "Libre Baskerville",
  quicksand: "Quicksand",
  rubik: "Rubik",
  dm_sans: "DM Sans",
  archivo: "Archivo",
  fira_sans: "Fira Sans"
};

export const printFontFamilies: Record<PosterFont, string> = {
  playfair: "'Playfair Display', serif",
  montserrat: "Montserrat, sans-serif",
  lora: "Lora, serif",
  nunito: "Nunito, sans-serif",
  merriweather: "Merriweather, serif",
  raleway: "Raleway, sans-serif",
  poppins: "Poppins, sans-serif",
  cormorant: "'Cormorant Garamond', serif",
  libre_baskerville: "'Libre Baskerville', serif",
  quicksand: "Quicksand, sans-serif",
  rubik: "Rubik, sans-serif",
  dm_sans: "'DM Sans', sans-serif",
  archivo: "Archivo, sans-serif",
  fira_sans: "'Fira Sans', sans-serif"
};

export const printSize = {
  widthMm: 216,
  heightMm: 303,
  safeInsetMm: 10
};
