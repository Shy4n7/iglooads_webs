import SplitLetters from "./SplitLetters";

/**
 * Full-screen opening with only the wordmark. Starts all indigo: the wordmark
 * blurs in as cream, then the background fades to cream while the wordmark
 * turns indigo. With reduced motion it renders the final state.
 */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="hero on-light">
      <div className="wrap hero-word-box flex min-h-[100svh] items-center">
        <h1 id="hero-title" aria-label="Igloo Ads" className="giant hero-word font-bebas">
          <SplitLetters lines={[{ text: "IGLOO ADS" }]} enter="spin" delay={0.25} stagger={0.09} />
        </h1>
      </div>
    </section>
  );
}
