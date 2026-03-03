"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { PosterPreview } from "@/components/poster-preview";
import {
  MONTH_OPTIONS,
  PosterArtwork,
  PosterDesignSpec,
  PosterFont,
  PosterTextTone,
  PosterTheme,
  defaultDesignSpec
} from "@/lib/design-spec";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export function PosterBuilder() {
  const [spec, setSpec] = useState<PosterDesignSpec>(defaultDesignSpec);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fullName = useMemo(() => {
    const middle = spec.baby.middleName?.trim();
    return [spec.baby.firstName, middle, spec.baby.lastName].filter(Boolean).join(" ").trim();
  }, [spec]);

  const dateValue = useMemo(() => {
    const monthIndex = MONTH_OPTIONS.findIndex((m) => m === spec.baby.month);
    const month = String((monthIndex >= 0 ? monthIndex : 0) + 1).padStart(2, "0");
    const day = String(spec.baby.day).padStart(2, "0");
    const year = String(spec.baby.year).padStart(4, "0");
    return `${year}-${month}-${day}`;
  }, [spec.baby.month, spec.baby.day, spec.baby.year]);

  function patchBaby<K extends keyof PosterDesignSpec["baby"]>(key: K, value: PosterDesignSpec["baby"][K]) {
    setSpec((prev) => ({
      ...prev,
      baby: {
        ...prev.baby,
        [key]: value
      }
    }));
  }

  async function onCheckout() {
    setError(null);

    if (!spec.baby.firstName.trim() || !spec.baby.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec)
      });

      if (!res.ok) {
        throw new Error("Unable to create checkout session.");
      }

      const data = (await res.json()) as { sessionId: string; url: string };

      if (stripePromise) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
          return;
        }
      }

      window.location.href = data.url;
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Checkout failed";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#efedeb] text-stone-900">
      <header className="flex h-20 items-center justify-between border-b border-stone-300/70 bg-[#f4f2f0] px-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-stone-700 hover:text-stone-900">
          <span aria-hidden>←</span>
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-stone-600 text-xs font-bold tracking-widest text-stone-700">
            BK
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">Baby Keepsakes</p>
        </div>
      </header>

      <div className="grid lg:h-[calc(100vh-5rem)] lg:grid-cols-[58%_42%]">
        <section className="order-2 bg-[#eceae7] px-4 py-6 sm:px-8 lg:order-1 lg:border-r lg:border-stone-300/60 lg:px-10">
          <div className="mx-auto flex max-w-[760px] flex-col justify-center lg:h-full">
            <PosterPreview spec={spec} />
          </div>
        </section>

        <section className="order-1 bg-white px-4 py-6 sm:px-8 lg:order-2 lg:h-full lg:overflow-y-auto">
          <div className="mx-auto max-w-xl">
            <div className="mb-6 flex items-end justify-between border-b border-stone-300 pb-3">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">Birth Data</p>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">Live Preview</p>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName">First Name *</label>
                  <input id="firstName" value={spec.baby.firstName} onChange={(e) => patchBaby("firstName", e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="middleName">Middle Name</label>
                  <input id="middleName" value={spec.baby.middleName} onChange={(e) => patchBaby("middleName", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="lastName">Surname *</label>
                  <input id="lastName" value={spec.baby.lastName} onChange={(e) => patchBaby("lastName", e.target.value)} required />
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth">Date Of Birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value) return;
                    const [yearStr, monthStr, dayStr] = value.split("-");
                    const year = Number(yearStr);
                    const month = Number(monthStr);
                    const day = Number(dayStr);
                    const monthName = MONTH_OPTIONS[month - 1] ?? MONTH_OPTIONS[0];
                    setSpec((prev) => ({
                      ...prev,
                      baby: {
                        ...prev.baby,
                        month: monthName,
                        day,
                        year
                      }
                    }));
                  }}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="time">Time Of Birth</label>
                  <input id="time" value={spec.baby.time} onChange={(e) => patchBaby("time", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="hospital">Hospital</label>
                  <input id="hospital" value={spec.baby.hospital} onChange={(e) => patchBaby("hospital", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <input id="city" value={spec.baby.city} onChange={(e) => patchBaby("city", e.target.value)} />
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input id="country" value={spec.baby.country} onChange={(e) => patchBaby("country", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="weightPounds">Weight Pounds</label>
                  <input
                    id="weightPounds"
                    type="number"
                    min={0}
                    max={20}
                    value={spec.baby.weightPounds}
                    onChange={(e) => patchBaby("weightPounds", Number(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="weightOunces">Weight Ounces</label>
                  <input
                    id="weightOunces"
                    type="number"
                    min={0}
                    max={15}
                    value={spec.baby.weightOunces}
                    onChange={(e) => patchBaby("weightOunces", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="theme">Theme</label>
                  <select id="theme" value={spec.theme} onChange={(e) => setSpec((prev) => ({ ...prev, theme: e.target.value as PosterTheme }))}>
                    <option value="blush_meadow">Blush Meadow</option>
                    <option value="warm_peach">Warm Peach</option>
                    <option value="powder_blue">Powder Blue</option>
                    <option value="sage_rose">Sage Rose</option>
                    <option value="terracotta_sky">Terracotta Sky</option>
                    <option value="mono_ink">Mono Ink</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="textTone">Text Color Style</label>
                  <select
                    id="textTone"
                    value={spec.textTone}
                    onChange={(e) => setSpec((prev) => ({ ...prev, textTone: e.target.value as PosterTextTone }))}
                  >
                    <option value="classic">Classic</option>
                    <option value="soft">Soft</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="font">Font</label>
                  <select id="font" value={spec.font} onChange={(e) => setSpec((prev) => ({ ...prev, font: e.target.value as PosterFont }))}>
                    <option value="playfair">Playfair Display</option>
                    <option value="montserrat">Montserrat</option>
                    <option value="lora">Lora</option>
                    <option value="nunito">Nunito</option>
                    <option value="merriweather">Merriweather</option>
                    <option value="raleway">Raleway</option>
                    <option value="poppins">Poppins</option>
                    <option value="cormorant">Cormorant Garamond</option>
                    <option value="libre_baskerville">Libre Baskerville</option>
                    <option value="quicksand">Quicksand</option>
                    <option value="rubik">Rubik</option>
                    <option value="dm_sans">DM Sans</option>
                    <option value="archivo">Archivo</option>
                    <option value="fira_sans">Fira Sans</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="artwork">Artwork</label>
                  <select
                    id="artwork"
                    value={spec.artwork}
                    onChange={(e) => setSpec((prev) => ({ ...prev, artwork: e.target.value as PosterArtwork }))}
                  >
                    <option value="lion">Lion</option>
                    <option value="bear">Bear</option>
                    <option value="cat">Cat</option>
                    <option value="panda">Panda</option>
                    <option value="dog">Dog</option>
                    <option value="fox">Fox</option>
                    <option value="bird">Bird</option>
                    <option value="bee">Bee</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-stone-300/70 bg-white/80 p-4 text-sm text-stone-700">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">Poster Title</p>
                <p className="mt-1 text-base font-semibold text-stone-900">{fullName || "Unnamed"}</p>
              </div>

              {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

              <div className="mt-2 -mx-1 px-1 pb-2 pt-5 lg:sticky lg:bottom-0 lg:mt-0 lg:bg-gradient-to-t lg:from-white lg:via-white lg:to-transparent">
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Preparing checkout..." : "Buy Print (€29.00)"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
