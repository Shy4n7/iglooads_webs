import SplitLetters from "./SplitLetters";

export default function ActNow() {
  return (
    <section aria-label="Call to action" className="wrap pb-[88px]">
      <p
        className="giant rv font-anton"
        style={{ fontSize: "clamp(64px, 12.5vw, 200px)", lineHeight: 0.88, letterSpacing: "-0.01em" }}
      >
        <span className="sr-only">Stop thinking. Let&apos;s act.</span>
        <SplitLetters
          wrapWords
          lines={[
            { text: "STOP THINKING.", style: { color: "#282B4A", ["--pop" as string]: "#C9581E" } },
            { text: "LET'S ACT.", style: { color: "#C9581E", ["--pop" as string]: "#282B4A" } },
          ]}
        />
      </p>
    </section>
  );
}
