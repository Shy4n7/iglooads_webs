import { STEPS } from "@/lib/content";

// Three numbered steps joined by amber lines. The list reveals as one piece so the
// circles and lines always stay lined up.
export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="process relative overflow-hidden bg-indigo py-[96px]"
    >
      <div aria-hidden="true" className="process-glow process-glow-a" />
      <div aria-hidden="true" className="process-glow process-glow-b" />
      <div className="wrap relative">
        <div className="rv mb-14 flex flex-wrap items-end justify-between gap-6 max-[900px]:mb-10">
          <div>
            <h2 id="process-title" className="label mb-2 text-cream">
              HOW IT WORKS
            </h2>
            <p className="headline text-cream" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
              Three steps. No guesswork.
            </p>
          </div>
          <p className="m-0 max-w-[340px] text-sm leading-[1.7] text-cream-soft">
            From the first call to a feed that keeps growing, one team runs the whole loop.
          </p>
        </div>

        <ol className="steps rv m-0 list-none p-0">
          {STEPS.map((s) => (
            <li key={s.n} className="step">
              <span className="step-node" aria-hidden="true">
                {s.n}
              </span>
              {/* Line to the next step's circle. */}
              <span className="step-link" aria-hidden="true" />
              {/* data-n draws the large outlined number behind the card text. */}
              <div className="step-card glass lift" data-n={s.n}>
                <span className="font-bebas text-[15px] tracking-[0.25em] text-amber">{s.kicker}</span>
                <h3 className="headline mt-2 mb-2 text-2xl text-cream">
                  <span className="sr-only">Step {Number(s.n)}: </span>
                  {s.title}
                </h3>
                <p className="m-0 max-w-[300px] text-sm leading-[1.65] text-cream-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
