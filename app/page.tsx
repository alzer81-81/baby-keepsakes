import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const cards = [
    {
      icon: "/home-1.png",
      title: "Add Birth Details",
      text: "Enter your baby name, date, time, place of birth, and weight in a guided form."
    },
    {
      icon: "/home-2.png",
      title: "Style Your Poster",
      text: "Choose theme, typography, text style, and artwork while previewing every change live."
    },
    {
      icon: "/home-3.png",
      title: "Order With Confidence",
      text: "Checkout securely and we generate a print-ready keepsake file for production."
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f5f2] px-6 py-10 text-stone-800 [font-family:'Nunito','Avenir Next','Avenir','Segoe UI',sans-serif] sm:py-14">
      <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-rose-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-1/3 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/40 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
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
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-3 rounded-2xl border border-stone-300/70 bg-white/75 p-4 text-left shadow-sm sm:grid-cols-3 sm:gap-4 sm:p-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-stone-500">Print Ready</p>
            <p className="mt-1 text-sm text-stone-700">High-resolution PDF output sized for keepsake printing.</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-stone-500">Live Preview</p>
            <p className="mt-1 text-sm text-stone-700">See your edits update instantly as you customize details.</p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-stone-500">Flexible Design</p>
            <p className="mt-1 text-sm text-stone-700">Choose themes, text styles, artwork, and fonts quickly.</p>
          </div>
        </div>

        <div className="mt-10 grid w-full gap-3 text-left sm:grid-cols-3 sm:gap-4">
          {cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-stone-300/70 bg-white/85 p-4 shadow-sm">
              <Image src={card.icon} alt={`${card.title} icon`} width={70} height={70} className="mb-3 h-auto w-full max-w-[70px]" />
              <h2 className="text-base font-bold text-stone-800">{card.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{card.text}</p>
            </article>
          ))}
        </div>

        <footer className="mt-12 rounded-2xl border border-stone-300/70 bg-white/80 px-5 py-6 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Baby Keepsakes. Designed for timeless birth memories.</p>
            <div className="flex items-center gap-5">
              <Link href="/builder" className="font-semibold text-stone-700 transition hover:text-stone-900">
                Start Building
              </Link>
              <a href="mailto:alpower242@gmail.com" className="font-semibold text-stone-700 transition hover:text-stone-900">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
