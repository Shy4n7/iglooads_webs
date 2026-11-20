import Image, { type StaticImageData } from "next/image";
// Unsplash License stock photos, credits in assets/stock/CREDITS.md.
import reels from "../../public/media/service-reels.jpg";
import ugc from "../../public/media/service-ugc.jpg";
import shoots from "../../public/media/service-shoots.jpg";
import websites from "../../public/media/service-websites.jpg";
import social from "../../public/media/service-social.jpg";
import influencer from "../../public/media/service-influencer.jpg";
import video from "../../public/media/service-video.jpg";
import digital from "../../public/media/service-digital.jpg";
import models from "../../public/media/service-models.jpg";
import events from "../../public/media/service-events.jpg";

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
    pos: "45% 35%",
    tag: "REELS",
    title: ["REELS THAT", "GO VIRAL"],
    body: "Hooks, scripts, shoots and edits built for the first three seconds.",
  },
  {
    img: ugc,
    pos: "32% 45%",
    tag: "UGC ADS",
    title: ["UGC ADS", "THAT SELL"],
    body: "Creator-style ads that feel like a customer talking, not a brand.",
  },
  {
    img: social,
    pos: "50% 40%",
    tag: "SOCIAL MEDIA",
    title: ["SOCIAL MEDIA", "MARKETING"],
    body: "Content calendars, posting and community management that keep your page growing every week.",
  },
  {
    img: influencer,
    pos: "50% 50%",
    tag: "INFLUENCERS",
    title: ["INFLUENCER", "MARKETING"],
    body: "Local creators and influencers who put your product in front of the right people.",
  },
  {
    img: video,
    pos: "45% 50%",
    tag: "VIDEO",
    title: ["VIDEO", "PRODUCTION"],
    body: "Ad films, brand films and product videos, from script and casting to the final edit.",
  },
  {
    img: shoots,
    pos: "50% 50%",
    tag: "SHOOTS",
    title: ["BRAND", "SHOOTS"],
    body: "Photos and B-roll for your feed, website and ads in one shoot day.",
  },
  {
    img: models,
    pos: "50% 30%",
    tag: "MODELS",
    title: ["MODELS AND", "TALENT"],
    body: "Models and on-camera talent for your shoots, reels and ads, cast to fit your brand.",
  },
  {
    img: digital,
    pos: "60% 50%",
    tag: "DIGITAL",
    title: ["DIGITAL", "MARKETING"],
    body: "Paid ads, search and performance tracking that turn views into leads you can count.",
  },
  {
    img: websites,
    pos: "55% 50%",
    tag: "WEBSITES",
    title: ["WEBSITES THAT", "CONVERT"],
    body: "Fast, mobile-first sites that turn reel views into calls, bookings and sales.",
  },
  {
    img: events,
    pos: "50% 50%",
    tag: "EVENTS",
    title: ["BRAND", "EVENTS"],
    body: "Launches, store openings and brand events, planned, run and filmed for your socials.",
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
            <div className="cut relative h-[200px] bg-mid">
              <Image
                src={s.img}
                alt=""
                fill
                sizes="(max-width: 600px) 260px, (max-width: 1200px) 50vw, 260px"
                className="object-cover"
                style={{ objectPosition: s.pos }}
              />
            </div>
            <div className="flex flex-1 flex-col items-start px-[22px] pt-2 pb-6">
              <span className="rounded-[5px] bg-indigo px-2.5 py-1 font-bebas text-sm tracking-[0.08em] text-cream">
                {s.tag}
              </span>
              <h3 className="mt-3.5 mb-2.5 font-bebas text-[36px] leading-[0.95] font-normal">
                {s.title[0]}
                <br />
                {s.title[1]}
              </h3>
              <p className="mb-[18px] text-sm leading-[1.65] text-ink-soft">{s.body}</p>
              <a
                href="#contact"
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
