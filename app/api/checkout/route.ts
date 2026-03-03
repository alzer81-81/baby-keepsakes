import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { PosterDesignSpec, sanitizeDesignSpec } from "@/lib/design-spec";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const rawSpec = (await request.json()) as PosterDesignSpec;
    const spec = sanitizeDesignSpec(rawSpec);

    if (!spec.baby.firstName || !spec.baby.lastName) {
      return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        status: "PENDING_PAYMENT",
        designJson: JSON.stringify(spec),
        theme: spec.theme,
        firstName: spec.baby.firstName,
        lastName: spec.baby.lastName
      }
    });

    const stripe = getStripeClient();
    const headerStore = await headers();
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ??
      headerStore.get("origin") ??
      `http://${headerStore.get("host") ?? "localhost:3000"}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: 2900,
            product_data: {
              name: "Birth Poster Print",
              description: `${spec.baby.firstName} ${spec.baby.lastName} custom print`
            }
          }
        }
      ],
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "IE",
          "GB",
          "CA",
          "AU",
          "NZ",
          "FR",
          "DE",
          "ES",
          "IT",
          "NL",
          "BE",
          "SE",
          "NO",
          "DK"
        ]
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/builder?canceled=1`,
      metadata: {
        orderId: String(order.id)
      },
      client_reference_id: String(order.id)
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout session error", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
