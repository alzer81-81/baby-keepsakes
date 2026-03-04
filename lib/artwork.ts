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
