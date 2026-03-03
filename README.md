# Birth Poster Builder (MVP)

Next.js App Router app for building baby birth posters, paying via Stripe Checkout, generating a print-ready PDF, and managing orders in a protected admin page.

## Stack

- Next.js + TypeScript + Tailwind CSS
- Stripe Checkout + Stripe webhooks
- Prisma + SQLite
- Playwright (server-side PDF generation)
- Nodemailer (admin email)

## Features

- `/` poster builder with live SVG preview from a typed design spec
- Theme selector: red, orange, blue
- Font selector: Playfair Display, Montserrat, Lora, Nunito
- Artwork selector: lion, bear, cat, panda (from local SVG assets)
- Checkout button creates Stripe Checkout session (hardcoded EUR 29.00)
- Stripe webhook finalizes order, generates print PDF, stores order, sends admin email
- `/admin` basic-auth protected orders list and PDF download links

## Print spec

- Trim size: A4 portrait `210mm x 297mm`
- Bleed: `3mm` all sides
- Final document size: `216mm x 303mm`
- Safe margins are represented in the SVG layout with internal spacing and visual guides.

## Environment

Copy `.env.example` to `.env` and set values.

Required vars:

- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ADMIN_EMAIL`

If SMTP is not configured, email sending is logged as a stub and processing continues.

## Run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx playwright install chromium
npm run dev
```

In another terminal for Stripe webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Key paths

- Poster builder UI: `app/page.tsx`, `components/poster-builder.tsx`
- Shared SVG renderer: `lib/poster-renderer.ts`
- Stripe checkout API: `app/api/checkout/route.ts`
- Stripe webhook handler: `app/api/stripe/webhook/route.ts`
- Admin page: `app/admin/page.tsx`
- Protected PDF download: `app/api/admin/orders/[id]/pdf/route.ts`
- Prisma model: `prisma/schema.prisma`

## Notes

- Both browser preview and print PDF use the same SVG design generator to keep output consistent.
- PDF rendering imports Google Fonts at render time in Playwright. If unavailable, browser fallback fonts are used.
- Orders and generated PDFs are stored locally (`SQLite` + `storage/orders/*.pdf`).
