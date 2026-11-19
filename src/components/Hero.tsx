import HeroMorph from "./HeroMorph";
import SplitLetters from "./SplitLetters";

const WORD = [{ text: "IGLOO ADS" }];
const SPIN = { enter: "spin" as const, delay: 0.25, stagger: 0.09 };

/**
 * Full-screen opening with only the wordmark, staged like a camera take.
 *
 * Two identical layers sit on top of each other: a dark take (indigo, cream
 * letters, viewfinder and REC light) and the final light page (cream, indigo
 * letters). Both spin their letters in sync. Then the REC dot grows into a
 * circle that wipes the light layer in, led by a thin amber ring.
 * On scroll the wordmark shrinks into the header logo (HeroMorph).
 * With reduced motion only the light layer is shown, with no morph.
 */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="hero on-light">
      <div className="hero-stage">
        <div className="hero-take" aria-hidden="true">
          <div className="wrap hero-word-box flex min-h-[100svh] items-center">
            <div className="giant hero-word font-bebas">
              <SplitLetters lines={WORD} {...SPIN} />
            </div>
          </div>
          <div className="viewfinder">
            <span className="vf-corner vf-tl" />
            <span className="vf-corner vf-tr" />
            <span className="vf-corner vf-bl" />
            <span className="vf-corner vf-br" />
            <span className="vf-rec">
              <span className="vf-dot" />
              REC
            </span>
            <span className="vf-meta vf-meta-l">TAKE 01</span>
            <span className="vf-meta vf-meta-r">COIMBATORE &middot; IST</span>
          </div>
        </div>
        <div className="hero-ring" aria-hidden="true" />
        <div className="hero-final">
          <div className="wrap hero-word-box flex min-h-[100svh] items-center">
            <h1 id="hero-title" aria-label="Igloo Ads" className="giant hero-word font-bebas">
              <SplitLetters lines={WORD} {...SPIN} />
            </h1>
          </div>
        </div>
      </div>
      <HeroMorph />
    </section>
  );
}
