import { RESULTS, REVIEWS } from "@/lib/content";
import StatCard from "./StatCard";

// Numbers come from RESULTS in src/lib/content.ts. Keep them real and verifiable.
export default function Results() {
  return (
    <section
      aria-labelledby="results-title"
      className="on-light wrap pt-14 pb-10"
    >
      <h2 id="results-title" className="label rv mb-7">
        RESULTS
      </h2>
      <ul className="g3 stat-list m-0 list-none p-0">
        {RESULTS.map((r) => (
          <StatCard
            key={r.label}
            to={r.to}
            suffix={r.suffix}
            label={r.label}
           
          />
        ))}
      </ul>
      <h3 id="reviews-title" className="label rv mt-14 mb-7">
        WHAT CLIENTS SAY
      </h3>
      <ul aria-labelledby="reviews-title" className="g3 m-0 list-none p-0">
        {REVIEWS.map((r, i) => (
          <li key={r.title} className="rv">
            <figure className="m-0 flex h-full flex-col rounded-[22px] border border-line p-7">
              <span className="font-anton text-[15px] tracking-[0.12em] text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <figcaption className="mt-2 font-bebas text-[26px] leading-none tracking-[0.03em] text-indigo">
                {r.title}
              </figcaption>
              <blockquote
                className="m-0 mt-4 font-fraunces text-[17px] leading-[1.5] text-ink-soft"
                style={{ fontVariationSettings: "'SOFT' 100" }}
              >
                &ldquo;{r.quote}&rdquo;
              </blockquote>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
