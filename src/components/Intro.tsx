// What Igloo Ads does, in one short read. Sits below the full-screen wordmark
// and reveals on scroll. On phones the heading, paragraph and buttons come in
// one after another once the wordmark has started shrinking (see globals.css).
export default function Intro() {
  return (
    <section
      aria-labelledby="intro-title"
      className="intro on-light wrap pt-24 pb-20 max-[900px]:pt-8 max-[900px]:pb-14"
    >
      <div className="intro-grid">
        <h2
          id="intro-title"
          className="headline rv intro-step"
          style={{ fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.08, ["--d" as string]: "0s" }}
        >
          Content people watch. Websites that convert.
        </h2>
        <div className="rv flex flex-col gap-6">
          <p
            className="intro-step m-0 max-w-[420px] text-[17px] leading-[1.47] text-ink-soft"
            style={{ ["--d" as string]: "0.12s" }}
          >
            Igloo Ads is a Coimbatore digital marketing and video production company.
          </p>
          <div className="intro-step flex flex-wrap gap-3" style={{ ["--d" as string]: "0.24s" }}>
            <a
              href="#contact"
              className="btn btn-ink inline-flex min-h-12 items-center rounded-full px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] no-underline"
            >
              GET IN TOUCH <span aria-hidden="true">&nbsp;&rarr;</span>
            </a>
            <a
              href="#work"
              className="btn btn-glass inline-flex min-h-12 items-center rounded-full px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] no-underline"
            >
              SEE OUR WORK
            </a>
          </div>
        </div>
      </div>
      {/* Without JavaScript the phone intro must not wait for a scroll flag. */}
      <noscript>
        <style>{`.intro,.intro .intro-step{opacity:1!important;translate:none!important;pointer-events:auto!important}`}</style>
      </noscript>
    </section>
  );
}
