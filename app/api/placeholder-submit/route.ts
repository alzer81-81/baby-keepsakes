import { NextResponse } from "next/server";

import { getArtworkDataUri } from "@/lib/artwork";
import { PosterDesignSpec, sanitizeDesignSpec } from "@/lib/design-spec";
import { sendPlaceholderSubmissionEmail } from "@/lib/email";
import { generatePosterPdf } from "@/lib/pdf";
import { renderPosterSvg } from "@/lib/poster-renderer";

type PlaceholderPayload = {
  spec: PosterDesignSpec;
  customerName: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlaceholderPayload;
    const spec = sanitizeDesignSpec(body.spec);
    const customerName = (body.customerName || "").trim();
    const customerEmail = (body.customerEmail || "").trim();
    const addressLine1 = (body.addressLine1 || "").trim();
    const addressLine2 = (body.addressLine2 || "").trim();
    const city = (body.city || "").trim();
    const postalCode = (body.postalCode || "").trim();
    const country = (body.country || "").trim();

    if (!customerName || !customerEmail || !addressLine1 || !city || !country) {
      return NextResponse.json({ error: "Name, email, address, city, and country are required." }, { status: 400 });
    }

    const address = [addressLine1, addressLine2, city, postalCode, country].filter(Boolean).join(", ");
    const embeddedArtworkDataUri = await getArtworkDataUri(spec.artwork);
    const svg = renderPosterSvg(spec, "print", { embeddedArtworkDataUri: embeddedArtworkDataUri ?? undefined });
    const proofId = Number(`${Date.now()}`.slice(-9));
    const pdfPath = await generatePosterPdf(svg, proofId);

    await sendPlaceholderSubmissionEmail({
      customerName,
      customerEmail,
      address,
      babyName: `${spec.baby.firstName} ${spec.baby.lastName}`.trim(),
      theme: spec.theme,
      pdfPath
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Placeholder submit error", error);
    const message = error instanceof Error ? error.message : "Unable to submit placeholder order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
