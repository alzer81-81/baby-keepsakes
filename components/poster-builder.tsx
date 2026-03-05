"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

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
import { previewFontFamilies, resolveThemePalette } from "@/lib/poster-style";

type SectionKey = "baby_date" | "birth" | "stats" | "style";

export function PosterBuilder() {
  const [spec, setSpec] = useState<PosterDesignSpec>(defaultDesignSpec);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [isMobileClient, setIsMobileClient] = useState(false);
  const [isTogglePinned, setIsTogglePinned] = useState(false);
  const [previewMaxHeightPx, setPreviewMaxHeightPx] = useState<number | null>(null);
  const [clearedFields, setClearedFields] = useState<Set<keyof PosterDesignSpec["baby"]>>(new Set());
  const formCardRef = useRef<HTMLDivElement | null>(null);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    baby_date: true,
    birth: false,
    stats: false,
    style: false
  });

  const dateValue = useMemo(() => {
    const monthIndex = MONTH_OPTIONS.findIndex((m) => m === spec.baby.month);
    const month = String((monthIndex >= 0 ? monthIndex : 0) + 1).padStart(2, "0");
    const day = String(spec.baby.day).padStart(2, "0");
    const year = String(spec.baby.year).padStart(4, "0");
    return `${year}-${month}-${day}`;
  }, [spec.baby.month, spec.baby.day, spec.baby.year]);

  const timeInputValue = useMemo(() => {
    const raw = spec.baby.time.trim().toUpperCase();
    const twelveHourMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (twelveHourMatch) {
      const [, hhRaw, mmRaw, period] = twelveHourMatch;
      let hh = Number(hhRaw);
      if (period === "AM" && hh === 12) hh = 0;
      if (period === "PM" && hh !== 12) hh += 12;
      return `${String(hh).padStart(2, "0")}:${mmRaw}`;
    }

    const twentyFourMatch = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (twentyFourMatch) {
      const [, hhRaw, mmRaw] = twentyFourMatch;
      const hh = Math.max(0, Math.min(23, Number(hhRaw)));
      return `${String(hh).padStart(2, "0")}:${mmRaw}`;
    }

    return "04:06";
  }, [spec.baby.time]);
  const formFontFamily = useMemo(() => previewFontFamilies[spec.font], [spec.font]);
  const activePalette = useMemo(() => resolveThemePalette(spec.theme, spec.textTone), [spec.theme, spec.textTone]);

  function patchBaby<K extends keyof PosterDesignSpec["baby"]>(key: K, value: PosterDesignSpec["baby"][K]) {
    setSpec((prev) => ({
      ...prev,
      baby: {
        ...prev.baby,
        [key]: value
      }
    }));
  }

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function formatTimeForPoster(value: string): string {
    const [hhRaw, mmRaw] = value.split(":");
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      return spec.baby.time;
    }

    const period = hh >= 12 ? "PM" : "AM";
    const hour12 = hh % 12 || 12;
    return `${String(hour12).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${period}`;
  }

  function isMobileViewport(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  }

  async function fetchPdfBlob(): Promise<{ blob: Blob; fileName: string }> {
    const res = await fetch("/api/download-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spec)
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Unable to generate PDF.");
    }

    const blob = await res.blob();
    const fileName = `${spec.baby.firstName || "birth"}-${spec.baby.lastName || "poster"}.pdf`;
    return { blob, fileName };
  }

  async function onDownloadPdf() {
    setError(null);

    if (!spec.baby.firstName.trim() || !spec.baby.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setLoading(true);
    try {
      const { blob, fileName } = await fetchPdfBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 15000);
    } catch (downloadError) {
      const message = downloadError instanceof Error ? downloadError.message : "Download failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function onEmailPdfMobile() {
    setError(null);

    if (!spec.baby.firstName.trim() || !spec.baby.lastName.trim()) {
      setError("First and last name are required.");
      return;
    }

    setLoading(true);
    try {
      const { blob, fileName } = await fetchPdfBlob();
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Birth Poster PDF",
          text: "Sharing your birth poster PDF",
          files: [file]
        });
      } else if (navigator.share) {
        const url = URL.createObjectURL(blob);
        await navigator.share({
          title: "Birth Poster PDF",
          text: "Open this PDF and email it to yourself",
          url
        });
        window.setTimeout(() => URL.revokeObjectURL(url), 15000);
      } else {
        throw new Error("Email/Share is not supported on this device.");
      }
    } catch (shareError) {
      const message = shareError instanceof Error ? shareError.message : "Unable to open email/share.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function onPrimaryPdfAction() {
    if (isMobileViewport()) {
      void onEmailPdfMobile();
      return;
    }
    void onDownloadPdf();
  }

  function clearTextFieldOnFirstFocus(key: keyof PosterDesignSpec["baby"]) {
    if (clearedFields.has(key)) return;
    const current = String(spec.baby[key] ?? "");
    if (!current.trim()) return;

    patchBaby(key as never, "" as never);
    setClearedFields((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  function renderSection(title: string, description: string, key: SectionKey, children: ReactNode) {
    const isOpen = openSections[key];

    return (
      <section className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 sm:p-5">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => toggleSection(key)}
          aria-expanded={isOpen}
          aria-controls={`section-${key}`}
        >
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-stone-700">{title}</h2>
            <p className="mt-1 text-xs font-medium text-stone-400">{description}</p>
          </div>
          <span className="text-stone-500" aria-hidden>
            {isOpen ? "−" : "+"}
          </span>
        </button>
        <div id={`section-${key}`} className={`mt-4 space-y-4 ${isOpen ? "block" : "hidden"}`}>
          {children}
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (!formCardRef.current || typeof ResizeObserver === "undefined") return;

    const formEl = formCardRef.current;
    const updateHeight = () => {
      const next = Math.round(formEl.getBoundingClientRect().height);
      setPreviewMaxHeightPx(next > 0 ? next : null);
    };

    updateHeight();
    const observer = new ResizeObserver(() => updateHeight());
    observer.observe(formEl);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  useEffect(() => {
    const setMobile = () => setIsMobileClient(window.matchMedia("(max-width: 1023px)").matches);
    setMobile();
    window.addEventListener("resize", setMobile);
    return () => window.removeEventListener("resize", setMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!window.matchMedia("(max-width: 1023px)").matches) {
        setIsTogglePinned(false);
        return;
      }
      setIsTogglePinned(window.scrollY > 110);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#efedeb] text-stone-900">
      <header className="flex h-20 items-center justify-between border-b border-stone-300/70 bg-[#f4f2f0] px-3 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-stone-700 hover:text-stone-900">
          <span aria-hidden>←</span>
          <span>Back</span>
        </Link>

        <Image src="/logo.png" alt="Baby Keepsakes logo" width={168} height={64} className="h-auto w-[120px] sm:w-[150px]" priority />
      </header>

      <div className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-5 lg:px-6">
        <div
          className={`z-40 mb-2 grid grid-cols-2 gap-2 rounded-xl border border-stone-300 bg-white/95 p-1 shadow-sm backdrop-blur transition-all duration-200 lg:hidden ${
            isTogglePinned ? "fixed left-3 right-3 top-[10px]" : "relative"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileView("edit")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              mobileView === "edit" ? "bg-[#e39ab7] text-stone-900" : "text-stone-700"
            }`}
            aria-pressed={mobileView === "edit"}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setMobileView("preview")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              mobileView === "preview" ? "bg-[#e39ab7] text-stone-900" : "text-stone-700"
            }`}
            aria-pressed={mobileView === "preview"}
          >
            Preview
          </button>
        </div>
        {isTogglePinned ? <div className="mb-2 h-[52px] lg:hidden" /> : null}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,500px)] xl:gap-6">
          <section className={`${mobileView === "preview" ? "block pt-0" : "hidden"} lg:block`}>
            <div className="lg:sticky lg:top-[96px] lg:max-h-[calc(100vh-96px)]">
              <PosterPreview spec={spec} maxHeightPx={previewMaxHeightPx ?? undefined} />
              <div className="mt-3 lg:hidden">
                <button
                  type="button"
                  onClick={onPrimaryPdfAction}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Preparing PDF..." : "Email PDF"}
                </button>
              </div>
            </div>
          </section>

          <section className={`${mobileView === "edit" ? "block" : "hidden"} lg:block`}>
            <div ref={formCardRef} className="rounded-2xl border border-stone-300/80 bg-white p-4 shadow-sm sm:p-6 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto">
              <div className="mb-5 border-b border-stone-200 pb-3">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-600">Build Your Poster</p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {renderSection(
                  "Baby Date Details",
                  "Enter your baby's name, birthday, and birth time.",
                  "baby_date",
                  <div className="grid min-w-0 gap-4 md:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="firstName">
                        First Name <span aria-hidden>*</span>
                      </label>
                      <input
                        id="firstName"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.firstName}
                        onFocus={() => clearTextFieldOnFirstFocus("firstName")}
                        onChange={(e) => patchBaby("firstName", e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="middleName">Middle Name</label>
                      <input
                        id="middleName"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.middleName}
                        onFocus={() => clearTextFieldOnFirstFocus("middleName")}
                        onChange={(e) => patchBaby("middleName", e.target.value)}
                      />
                    </div>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="lastName">
                        Surname <span aria-hidden>*</span>
                      </label>
                      <input
                        id="lastName"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.lastName}
                        onFocus={() => clearTextFieldOnFirstFocus("lastName")}
                        onChange={(e) => patchBaby("lastName", e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="dateOfBirth">Date Of Birth</label>
                      <div className="relative w-full max-w-full overflow-hidden">
                        <input
                          id="dateOfBirth"
                          type="date"
                          className="w-full max-w-full appearance-none pr-10 text-left [text-align-last:left]"
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
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-500" aria-hidden>
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                            <path d="M5.5 7.5 10 12l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="time">Time Of Birth</label>
                      <div className="relative w-full max-w-full overflow-hidden">
                        <input
                          id="time"
                          type="time"
                          inputMode="numeric"
                          step={60}
                          className="w-full max-w-full appearance-none pr-10 text-left [text-align-last:left]"
                          value={timeInputValue}
                          onChange={(e) => patchBaby("time", formatTimeForPoster(e.target.value))}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-500" aria-hidden>
                          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                            <path d="M5.5 7.5 10 12l4.5-4.5" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {renderSection(
                  "Birth Details",
                  "Add location information for where your baby was born.",
                  "birth",
                  <div className="grid min-w-0 gap-4 md:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor="hospital">Hospital</label>
                      <input
                        id="hospital"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.hospital}
                        onFocus={() => clearTextFieldOnFirstFocus("hospital")}
                        onChange={(e) => patchBaby("hospital", e.target.value)}
                      />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.city}
                        onFocus={() => clearTextFieldOnFirstFocus("city")}
                        onChange={(e) => patchBaby("city", e.target.value)}
                      />
                    </div>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="country">Country</label>
                      <input
                        id="country"
                        style={{ fontFamily: formFontFamily }}
                        value={spec.baby.country}
                        onFocus={() => clearTextFieldOnFirstFocus("country")}
                        onChange={(e) => patchBaby("country", e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {renderSection(
                  "Birth Stats",
                  "Record weight details as pounds and ounces.",
                  "stats",
                  <div className="grid min-w-0 gap-4 md:grid-cols-2">
                    <div className="min-w-0">
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
                    <div className="min-w-0">
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
                  "Choose colors, type, and artwork for the poster design.",
                  "style",
                  <div className="grid min-w-0 gap-4 md:grid-cols-2">
                    <div className="min-w-0">
                      <div className="mt-0.5 flex items-center justify-between">
                        <label htmlFor="theme">Theme</label>
                        <span className="flex items-center gap-1.5" aria-hidden>
                          <span className="h-2 w-2 rounded-full border border-stone-300/70" style={{ backgroundColor: activePalette.day }} />
                          <span className="h-2 w-2 rounded-full border border-stone-300/70" style={{ backgroundColor: activePalette.band }} />
                          <span className="h-2 w-2 rounded-full border border-stone-300/70" style={{ backgroundColor: activePalette.time }} />
                        </span>
                      </div>
                      <select id="theme" value={spec.theme} onChange={(e) => setSpec((prev) => ({ ...prev, theme: e.target.value as PosterTheme }))}>
                        <option value="blush_meadow">Blush Meadow</option>
                        <option value="warm_peach">Warm Peach</option>
                        <option value="powder_blue">Powder Blue</option>
                        <option value="sage_rose">Sage Rose</option>
                        <option value="terracotta_sky">Terracotta Sky</option>
                        <option value="mono_ink">Mono Ink</option>
                      </select>
                    </div>
                    <div className="min-w-0">
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
                    <div className="min-w-0">
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
                    <div className="min-w-0">
                      <label htmlFor="artwork">Artwork</label>
                      <select id="artwork" value={spec.artwork} onChange={(e) => setSpec((prev) => ({ ...prev, artwork: e.target.value as PosterArtwork }))}>
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

                {error ? (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
                ) : null}
                <div className="mt-2 pb-2 pt-4 lg:sticky lg:bottom-0 lg:bg-gradient-to-t lg:from-white lg:via-white lg:to-transparent">
                  <button
                    type="button"
                    onClick={onPrimaryPdfAction}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Preparing PDF..." : isMobileClient ? "Email PDF" : "Download High-Res PDF"}
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
