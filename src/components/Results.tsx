import { RESULTS, TESTIMONIAL } from "@/lib/content";

// Placeholders only. Replace with real, verifiable numbers before launch.
export default function Results() {
  return (
    <section aria-labelledby="results-title" className="on-light wrap pt-14 pb-10">
      <h2 id="results-title" className="label rv mb-7">
        RESULTS
      </h2>
      <ul className="g3 m-0 list-none p-0">
        {RESULTS.map((r) => (
          <li key={r.label} className="rv lift rounded-[22px] bg-indigo p-7">
            <div className="font-anton text-[56px] leading-none text-amber">{r.value}</div>
            <div className="mt-2 text-sm text-cream">{r.label}</div>
          </li>
        ))}
      </ul>
      <figure className="rv mx-0 mt-5 mb-0 rounded-[22px] border border-line p-8">
        <blockquote
          className="m-0 font-fraunces leading-[1.25] font-extrabold"
          style={{ fontSize: "clamp(22px, 2.6vw, 34px)", fontVariationSettings: "'SOFT' 100" }}
        >
          &ldquo;{TESTIMONIAL.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-3.5 text-[13px] text-ink-mute">{TESTIMONIAL.by}</figcaption>
      </figure>
    </section>
  );
}
