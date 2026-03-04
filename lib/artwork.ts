import { readFile } from "node:fs/promises";
import path from "node:path";

import { PosterArtwork } from "@/lib/design-spec";
import { artworkFileByType } from "@/lib/artwork-map";

export async function getArtworkDataUri(artwork: PosterArtwork): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "artwork", artworkFileByType[artwork]);
    const raw = await readFile(filePath, "utf8");
    return `data:image/svg+xml;base64,${Buffer.from(raw, "utf8").toString("base64")}`;
  } catch {
    return null;
  }
}

export async function getArtworkInlineSvg(artwork: PosterArtwork): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "artwork", artworkFileByType[artwork]);
    const raw = await readFile(filePath, "utf8");
    const cleaned = raw.replace(/<\?xml[\s\S]*?\?>/gi, "").trim();
    const match = cleaned.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
    if (!match) return null;

    const svgAttrs = match[1] ?? "";
    const inner = match[2] ?? "";
    const viewBoxMatch = svgAttrs.match(/viewBox\s*=\s*"([^"]+)"/i);
    const viewBox = viewBoxMatch?.[1] ?? "0 0 96 96";

    return `<svg x="0" y="0" width="96" height="96" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
  } catch {
    return null;
  }
}
