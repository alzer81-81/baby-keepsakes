import { NextResponse } from "next/server";

import { PosterDesignSpec, sanitizeDesignSpec } from "@/lib/design-spec";
import { generatePosterPdfBuffer } from "@/lib/pdf";
import { renderPosterSvg } from "@/lib/poster-renderer";

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as PosterDesignSpec;
    const spec = sanitizeDesignSpec(raw);

    if (!spec.baby.firstName || !spec.baby.lastName) {
      return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
    }

    const svg = renderPosterSvg(spec, "print");
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
    return NextResponse.json({ error: "Unable to generate PDF." }, { status: 500 });
  }
}
