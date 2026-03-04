"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
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

type SectionKey = "baby_date" | "birth" | "stats" | "style";

export function PosterBuilder() {
  const [spec, setSpec] = useState<PosterDesignSpec>(defaultDesignSpec);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [openSection, setOpenSection] = useState<SectionKey>("baby_date");

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

  function renderSection(title: string, key: SectionKey, children: ReactNode) {
    const isOpen = openSection === key;

    return (
      <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 sm:p-5" onFocusCapture={() => setOpenSection(key)}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left lg:cursor-default"
          onClick={() => setOpenSection(key)}
          aria-expanded={isOpen}
          aria-controls={`section-${key}`}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-700">{title}</h2>
          <span className="text-stone-500 lg:hidden" aria-hidden>
            {isOpen ? "−" : "+"}
          </span>
        </button>
        <div id={`section-${key}`} className={`mt-4 space-y-4 ${isOpen ? "block" : "hidden"} lg:block`}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#efedeb] text-stone-900">
      <header className="flex h-20 items-center justify-between border-b border-stone-300/70 bg-[#f4f2f0] px-3 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-stone-700 hover:text-stone-900">
          <span aria-hidden>←</span>
          <span>Back</span>
        </Link>

        <Image src="/logo.png" alt="Baby Keepsakes logo" width={168} height={64} className="h-auto w-[120px] sm:w-[150px]" priority />
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-5 lg:px-6">
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-stone-300 bg-white p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileView("edit")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${mobileView === "edit" ? "bg-stone-900 text-white" : "text-stone-700"}`}
            aria-pressed={mobileView === "edit"}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileView("preview")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              mobileView === "preview" ? "bg-stone-900 text-white" : "text-stone-700"
            }`}
            aria-pressed={mobileView === "preview"}
          >
            Preview
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(420px,520px)] xl:gap-6">
          <section className={`${mobileView === "preview" ? "block" : "hidden"} lg:block`}>
            <div className="lg:sticky lg:top-[96px]">
              <div className="rounded-2xl border border-stone-300/80 bg-[#eceae7] p-3 shadow-sm sm:p-4 lg:max-h-[calc(100vh-96px)]">
                <PosterPreview spec={spec} />
              </div>
            </div>
          </section>

          <section className={`${mobileView === "edit" ? "block" : "hidden"} lg:block`}>
            <div className="rounded-2xl border border-stone-300/80 bg-white p-4 shadow-sm sm:p-6 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto">
              <div className="mb-5 border-b border-stone-200 pb-3">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-600">Build Your Poster</p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {renderSection(
                  "Baby Date Details",
                  "baby_date",
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName">
                        First Name <span aria-hidden>*</span>
                      </label>
                      <input
                        id="firstName"
                        value={spec.baby.firstName}
                        onChange={(e) => patchBaby("firstName", e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <label htmlFor="middleName">Middle Name</label>
                      <input id="middleName" value={spec.baby.middleName} onChange={(e) => patchBaby("middleName", e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="lastName">
                        Surname <span aria-hidden>*</span>
                      </label>
                      <input id="lastName" value={spec.baby.lastName} onChange={(e) => patchBaby("lastName", e.target.value)} required aria-required="true" />
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
                    <div>
                      <label htmlFor="time">Time Of Birth</label>
                      <input id="time" value={spec.baby.time} onChange={(e) => patchBaby("time", e.target.value)} />
                    </div>
                  </div>
                )}

                {renderSection(
                  "Birth Details",
                  "birth",
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="hospital">Hospital</label>
                      <input id="hospital" value={spec.baby.hospital} onChange={(e) => patchBaby("hospital", e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="city">City</label>
                      <input id="city" value={spec.baby.city} onChange={(e) => patchBaby("city", e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="country">Country</label>
                      <input id="country" value={spec.baby.country} onChange={(e) => patchBaby("country", e.target.value)} />
                    </div>
                  </div>
                )}

                {renderSection(
                  "Birth Stats",
                  "stats",
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="weightPounds">Weight (lb)</label>
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
                      <label htmlFor="weightOunces">Weight (oz)</label>
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
                )}

                {renderSection(
                  "Style",
                  "style",
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
                )}

                {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

                <div className="mt-2 pb-2 pt-4 lg:sticky lg:bottom-0 lg:bg-gradient-to-t lg:from-white lg:via-white lg:to-transparent">
                  <button
                    type="button"
                    onClick={onCheckout}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Preparing checkout..." : "Buy Print (€29.00)"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
