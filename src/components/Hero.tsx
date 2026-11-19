import SplitLetters from "./SplitLetters";
import { CHIPS } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-light wrap pt-10 pb-[72px]">
      <h1
        id="hero-title"
        aria-label="Igloo Ads"
        className="giant mb-10 font-bebas text-orange"
        style={{ fontSize: "clamp(52px, 14.5vw, 215px)", lineHeight: 0.9, letterSpacing: "0.3em" }}
      >
        <SplitLetters lines={[{ text: "IGLOO ADS" }]} enter delay={0.05} />
      </h1>
      <div className="hero-grid">
        <ul className="in d1 m-0 flex list-none flex-wrap gap-2.5 self-start p-0" aria-label="What we make">
          {CHIPS.map((c) => (
            <li key={c} className="chip rounded-full bg-indigo px-4 py-[9px] text-xs font-medium text-cream">
              {c}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-[22px] pb-3">
          <p className="in d2 headline" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.1 }}>
            Reels and ads people actually watch, for Coimbatore brands.
          </p>
          <p className="in d2 m-0 max-w-[440px] text-[15px] leading-[1.7] text-ink-soft">
            We script, shoot, edit and post short-form video that turns scrollers into customers.
          </p>
          <div className="in d3 flex flex-wrap gap-3">
            <a
              href="#book"
              className="btn inline-flex min-h-12 items-center rounded-xl bg-indigo px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] text-cream no-underline"
            >
              GET IN TOUCH <span aria-hidden="true">&nbsp;&rarr;</span>
            </a>
            <a
              href="#work"
              className="btn inline-flex min-h-12 items-center rounded-xl bg-line px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] text-indigo no-underline"
            >
              SEE OUR WORK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
