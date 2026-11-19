// What Igloo Ads does, in one short read. Sits below the full-screen wordmark
// and reveals on scroll.
export default function Intro() {
  return (
    <section aria-labelledby="intro-title" className="intro on-light wrap pt-24 pb-20 max-[900px]:pt-8 max-[900px]:pb-14">
      <div className="intro-grid">
        <h2
          id="intro-title"
          className="headline rv"
          style={{ fontSize: "clamp(30px, 4.2vw, 56px)", lineHeight: 1.05 }}
        >
          Reels and ads people actually watch, and websites that turn those views into customers.
        </h2>
        <div className="rv flex flex-col gap-6">
          <p className="m-0 max-w-[480px] text-base leading-[1.75] text-ink-soft">
            Igloo Ads is a Coimbatore studio for Instagram reels, UGC ads, brand shoots and
            websites. We script, shoot, edit and post short-form video, then build the fast, mobile-first
            website your new customers land on. One team, from the first hook to the booking.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#book"
              className="btn frost frost-ink inline-flex min-h-12 items-center rounded-xl px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] no-underline"
            >
              GET IN TOUCH <span aria-hidden="true">&nbsp;&rarr;</span>
            </a>
            <a
              href="#work"
              className="btn frost frost-cream inline-flex min-h-12 items-center rounded-xl px-6 py-3.5 font-bebas text-[19px] tracking-[0.06em] no-underline"
            >
              SEE OUR WORK
            </a>
          </div>
        </div>
      </div>
      {/* Without JavaScript the phone intro must not wait for a scroll flag. */}
      <noscript>
        <style>{`.intro{opacity:1!important;translate:none!important;pointer-events:auto!important}`}</style>
      </noscript>
    </section>
  );
}
