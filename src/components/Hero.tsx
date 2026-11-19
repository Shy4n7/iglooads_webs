import SplitLetters from "./SplitLetters";
import { CHIPS } from "@/lib/content";

/**
 * Full-screen opening. Starts all indigo: the wordmark blurs in as cream, then
 * the background fades to cream while the wordmark turns indigo, then the rest
 * of the hero rises in. With reduced motion it renders the final state.
 */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="hero on-light">
      <div className="wrap flex min-h-[100svh] flex-col pt-6 pb-10">
        <div className="hero-word-box flex flex-1 items-center py-6">
          <h1 id="hero-title" aria-label="Igloo Ads" className="giant hero-word font-bebas">
            <SplitLetters lines={[{ text: "IGLOO ADS" }]} enter="blur" delay={0.1} stagger={0.07} />
          </h1>
        </div>
        <div className="hero-grid">
          <ul className="in hd1 m-0 flex list-none flex-wrap gap-2.5 self-start p-0" aria-label="What we make">
            {CHIPS.map((c) => (
              <li key={c} className="chip rounded-full bg-indigo px-4 py-[9px] text-xs font-medium text-cream">
                {c}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-[22px] pb-3">
            <p className="in hd2 headline" style={{ fontSize: "clamp(26px, 3vw, 38px)", lineHeight: 1.1 }}>
              Reels and ads people actually watch, for Coimbatore brands.
            </p>
            <p className="in hd2 m-0 max-w-[440px] text-[15px] leading-[1.7] text-ink-soft">
              We script, shoot, edit and post short-form video that turns scrollers into customers.
            </p>
            <div className="in hd3 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
