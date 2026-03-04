import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getArtworkInlineSvg } from "@/lib/artwork";
import { prisma } from "@/lib/db";
import { PosterDesignSpec } from "@/lib/design-spec";
import { sendAdminOrderEmail } from "@/lib/email";
import { generatePosterPdf } from "@/lib/pdf";
import { renderPosterSvg } from "@/lib/poster-renderer";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const stripe = getStripeClient();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderIdRaw = session.metadata?.orderId ?? session.client_reference_id;
    const orderId = Number(orderIdRaw);

    if (!orderId || Number.isNaN(orderId)) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ received: true });
    }

    if (order.status === "READY_TO_PRINT") {
      return NextResponse.json({ received: true });
    }

    const spec = JSON.parse(order.designJson) as PosterDesignSpec;
    const details = session.customer_details;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        stripeSessionId: session.id,
        status: "PAID",
        customerEmail: details?.email ?? order.customerEmail,
        shippingName: details?.name ?? order.shippingName,
        shippingAddressLine1: details?.address?.line1 ?? order.shippingAddressLine1,
        shippingAddressLine2: details?.address?.line2 ?? order.shippingAddressLine2,
        shippingCity: details?.address?.city ?? order.shippingCity,
        shippingPostalCode: details?.address?.postal_code ?? order.shippingPostalCode,
        shippingCountry: details?.address?.country ?? order.shippingCountry
      }
    });

    try {
      const embeddedArtworkInlineSvg = await getArtworkInlineSvg(spec.artwork);
      const svg = renderPosterSvg(spec, "print", { embeddedArtworkInlineSvg: embeddedArtworkInlineSvg ?? undefined });
      const pdfPath = await generatePosterPdf(svg, orderId);

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "READY_TO_PRINT",
          pdfPath
        }
      });

      await sendAdminOrderEmail({
        orderId,
        customerName: updated.shippingName ?? `${spec.baby.firstName} ${spec.baby.lastName}`,
        customerEmail: updated.customerEmail ?? "n/a",
        country: updated.shippingCountry ?? "n/a",
        theme: updated.theme,
        pdfPath
      });
    } catch (error) {
      console.error("Failed finalization for order", orderId, error);
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID_PDF_ERROR" }
      });
      return NextResponse.json({ error: "Order captured but PDF generation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
