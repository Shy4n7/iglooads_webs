import { STEPS } from "@/lib/content";

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="relative overflow-hidden bg-indigo py-[88px]">
      <div
        aria-hidden="true"
        className="absolute -top-[180px] -right-[140px] h-[520px] w-[520px] rounded-full bg-amber max-[900px]:-top-[150px] max-[900px]:-right-[110px] max-[900px]:h-[220px] max-[900px]:w-[220px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[200px] -left-[120px] h-[420px] w-[420px] rounded-full bg-mid2 max-[900px]:h-[300px] max-[900px]:w-[300px]"
      />
      <div className="wrap relative">
        <h2 id="process-title" className="label rv mb-2 text-cream">
          HOW IT WORKS
        </h2>
        <p className="headline rv mb-9 text-cream" style={{ fontSize: "clamp(30px, 4vw, 52px)" }}>
          Three steps. No guesswork.
        </p>
        <ol className="g3 stack m-0 list-none p-0">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="glass lift rv flex min-h-[220px] flex-col justify-between rounded-3xl px-7 py-[30px]"
            >
              <span className="font-anton text-[56px] leading-none text-amber" aria-hidden="true">
                {s.n}
              </span>
              <div>
                <h3 className="headline mb-1.5 text-2xl text-cream">
                  <span className="sr-only">Step {Number(s.n)}: </span>
                  {s.title}
                </h3>
                <p className="m-0 text-sm leading-[1.6] text-cream-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
