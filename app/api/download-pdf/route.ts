import { NextResponse } from "next/server";

import { PosterDesignSpec, sanitizeDesignSpec } from "@/lib/design-spec";
import { getArtworkDataUri } from "@/lib/artwork";
import { generatePosterPdfBuffer } from "@/lib/pdf";
import { renderPosterSvg } from "@/lib/poster-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as PosterDesignSpec;
    const spec = sanitizeDesignSpec(raw);

    if (!spec.baby.firstName || !spec.baby.lastName) {
      return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
    }

    const embeddedArtworkDataUri = await getArtworkDataUri(spec.artwork);
    const svg = renderPosterSvg(spec, "print", { embeddedArtworkDataUri: embeddedArtworkDataUri ?? undefined });
    const pdf = await generatePosterPdfBuffer(svg);
    const filename = `${spec.baby.firstName}-${spec.baby.lastName}.pdf`.replace(/\s+/g, "-").toLowerCase();

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Download PDF error", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Unable to generate PDF: ${message}` }, { status: 500 });
  }
}
