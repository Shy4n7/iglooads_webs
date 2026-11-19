import Image, { type StaticImageData } from "next/image";
// Unsplash License stock photos, credits in assets/stock/CREDITS.md.
import reels from "../../public/media/service-reels.jpg";
import ugc from "../../public/media/service-ugc.jpg";
import shoots from "../../public/media/service-shoots.jpg";
import websites from "../../public/media/service-websites.jpg";

type Service = {
  img: StaticImageData;
  pos: string;
  tag: string;
  title: [string, string];
  body: string;
};

const SERVICES: Service[] = [
  {
    img: reels,
    pos: "50% 40%",
    tag: "REELS",
    title: ["REELS THAT", "GO VIRAL"],
    body: "Hooks, scripts, shoots and edits built for the first three seconds.",
  },
  {
    img: ugc,
    pos: "50% 45%",
    tag: "UGC ADS",
    title: ["UGC ADS", "THAT SELL"],
    body: "Creator-style ads that feel like a customer talking, not a brand.",
  },
  {
    img: shoots,
    pos: "50% 55%",
    tag: "SHOOTS",
    title: ["BRAND", "SHOOTS"],
    body: "Photos and B-roll for your feed, website and ads in one shoot day.",
  },
  {
    img: websites,
    pos: "50% 45%",
    tag: "WEBSITES",
    title: ["WEBSITES THAT", "CONVERT"],
    body: "Fast, mobile-first sites that turn reel views into calls, bookings and sales.",
  },
];

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="on-light wrap py-[88px]">
      <div className="rv mb-9">
        <h2 id="services-title" className="label mb-2">
          WHAT WE DO
        </h2>
        <p className="headline max-w-[720px]" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
          Everything your brand needs to show up on the feed, and a site to send them to.
        </p>
      </div>
      <div className="gsvc">
        {SERVICES.map((s) => (
          <article key={s.tag} className="lift rv flex flex-col overflow-hidden rounded-[26px] border border-line bg-card">
            <div className="cut relative h-[240px] bg-mid">
              <Image
                src={s.img}
                alt=""
                fill
                sizes="(max-width: 560px) 260px, (max-width: 1100px) 50vw, 320px"
                className="object-cover"
                style={{ objectPosition: s.pos }}
              />
            </div>
            <div className="flex flex-1 flex-col items-start px-[26px] pt-2 pb-7">
              <span className="rounded-[5px] bg-indigo px-2.5 py-1 font-bebas text-sm tracking-[0.08em] text-cream">
                {s.tag}
              </span>
              <h3 className="mt-3.5 mb-2.5 font-bebas text-[42px] leading-[0.95] font-normal">
                {s.title[0]}
                <br />
                {s.title[1]}
              </h3>
              <p className="mb-[18px] text-sm leading-[1.65] text-ink-soft">{s.body}</p>
              <a
                href="#book"
                className="btn btn-ink mt-auto inline-flex min-h-11 items-center rounded-full px-5 py-2.5 font-bebas text-[17px] tracking-[0.06em] no-underline"
                aria-label={`Know more about ${s.title.join(" ").toLowerCase()}`}
              >
                KNOW MORE <span aria-hidden="true">&nbsp;&rarr;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
