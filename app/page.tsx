import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const cards = [
    {
      icon: "✍︎",
      title: "Add Birth Details",
      text: "Enter your baby name, date, time, place of birth, and weight in a guided form."
    },
    {
      icon: "🎨",
      title: "Style Your Poster",
      text: "Choose theme, typography, text style, and artwork while previewing every change live."
    },
    {
      icon: "🖨",
      title: "Order With Confidence",
      text: "Checkout securely and we generate a print-ready keepsake file for production."
    }
  ];

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f5f2] px-6 py-16 text-stone-800">
      <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-rose-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/3 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center [font-family:var(--font-nunito)]">
        <Image src="/logo.png" alt="Baby Keepsakes logo" width={220} height={84} className="h-auto w-[170px] sm:w-[220px]" priority />
        <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] text-stone-800 sm:text-6xl md:text-7xl">
          Build Your Birth Poster Keepsake
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl">
          Personalize your baby poster in minutes with soft themes, beautiful type, and a live preview.
        </p>
        <Link
          href="/builder"
          className="mt-10 inline-flex rounded-2xl bg-[#f3adc5] px-9 py-4 text-lg font-bold text-stone-800 shadow-lg shadow-rose-200/40 transition hover:bg-[#ee9fbb]"
        >
          Build Your Keepsake Now
        </Link>

        <div className="mt-10 grid w-full gap-3 text-left sm:grid-cols-3 sm:gap-4">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-stone-300/70 bg-white/85 p-4 shadow-sm">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#fbe4ed] text-sm text-stone-700">
                <span aria-hidden>{card.icon}</span>
              </div>
              <h2 className="text-base font-bold text-stone-800">{card.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{card.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
