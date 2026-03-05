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
          <Link href="/builder" className="group mt-10 inline-block">
            <span className="relative inline-flex rounded-2xl bg-[#e887ad] p-[2px]">
              <span className="inline-flex min-w-[240px] items-center justify-center rounded-[14px] bg-[#e39ab7] px-7 py-3 text-base font-extrabold leading-none text-stone-900 transition group-hover:bg-[#dc90ae] sm:min-w-[310px] sm:text-[1.5rem]">
                Build Your Keepsake Now
              </span>
            </span>
          </Link>
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

        <footer className="mt-12 px-2 py-5 sm:px-0">
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
