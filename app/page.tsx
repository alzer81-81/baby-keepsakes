import Image from "next/image";
import Link from "next/link";
import heroImage from "../LP_heroimg.png";

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
      title: "Download and Print",
      text: "For now, download complete FREE, until I figure out how to charge people!"
    }
  ];

  return (
    <main className="min-h-screen bg-[#f3eaee] px-6 text-[#1d2436] [font-family:'Nunito','Avenir Next','Avenir','Segoe UI',sans-serif] md:px-10">
      <section className="mx-auto w-full max-w-[1240px] pt-[64px] pb-[12px]">
        <Image src="/logo.png" alt="Baby Keepsakes logo" width={190} height={62} className="h-auto w-[190px]" priority />

        <div className="mt-[28px] grid items-center gap-8 lg:grid-cols-[minmax(0,760px)_minmax(0,1fr)]">
          <div className="max-w-[760px]">
          {/*
            Reference measurements:
            - Hero title: 68px
            - Subtitle: 24px
            - CTA: 250px wide / 24px text
          */}
          <h1 className="text-[68px] leading-[1.06] font-extrabold tracking-[-0.01em] text-[#1b2538] max-md:text-[48px]">
            Build Your Birth Poster Keepsake
          </h1>
          <p className="mt-[32px] max-w-[720px] text-[24px] leading-[1.45] text-[#1f1f25] max-md:text-[20px]">
            Personalize your baby poster in minutes with soft themes, beautiful type, and a live preview.
          </p>
          <Link
            href="/builder"
            className="mt-[40px] inline-flex h-[70px] w-[250px] items-center justify-center rounded-[18px] bg-[#d88aac] text-[24px] font-extrabold leading-none text-white transition hover:brightness-95"
          >
            Get Started
          </Link>
          </div>

          <div className="hidden justify-self-end lg:block">
            <Image src={heroImage} alt="Birth poster preview" className="h-auto w-[430px]" priority />
          </div>
        </div>

        {/*
          Reference card measurements:
          - Card size: ~332x372px
          - Card corner radius: 20px
          - Border: 1px soft pink
        */}
        <div className="mt-[112px] grid gap-[28px] md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="min-h-[372px] rounded-[20px] border border-[#efc8d6] bg-[#f8f7f8] p-[30px]">
              <Image src={card.icon} alt={`${card.title} icon`} width={74} height={74} className="h-[74px] w-[74px] object-contain" />
              <h2 className="mt-[24px] text-[20px] leading-[1.2] font-extrabold text-black">{card.title}</h2>
              <p className="mt-[10px] max-w-[264px] text-[16px] leading-[1.38] text-[#1f1f24]">{card.text}</p>
            </article>
          ))}
        </div>

        <footer className="mt-[28px] pb-[8px]">
          <div className="flex flex-col gap-4 text-[14px] leading-[1.2] text-[#1f1f24] md:flex-row md:items-center md:justify-between">
            <p>© 2026 Baby Keepsakes. Designed for timeless birth memories.</p>
            <div className="flex items-center gap-[40px]">
              <Link href="/builder" className="hover:opacity-75">
                Start Building
              </Link>
              <a href="mailto:alpower242@gmail.com" className="hover:opacity-75">
                Contact Us
              </a>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
