import { Fragment, type CSSProperties } from "react";

type Line = { text: string; className?: string; style?: CSSProperties };

type Props = {
  lines: Line[];
  /**
   * "spin": each letter scrolls through a blurred strip of other letters,
   * like a feed being flicked, and locks into place with a small bounce.
   */
  enter?: false | "spin";
  /** Base delay in seconds and per-letter stagger. */
  delay?: number;
  stagger?: number;
  /** Let words wrap onto new lines on narrow screens. */
  wrapWords?: boolean;
};

// Letters that flick past before each real letter lands.
const FEED = "REELSUGCHOOKVIRALSHOOTWEB";
const SPIN_COUNT = 7;
const SPIN_DURATION = 1.15;

function strip(seed: number) {
  return Array.from({ length: SPIN_COUNT }, (_, j) => FEED[(seed * 7 + j * 5 + 3) % FEED.length]);
}

/**
 * Renders text one letter per span so each letter can pop on hover.
 * Purely visual: the parent must carry the accessible text (aria-label
 * or a visually hidden copy), so everything here is aria-hidden.
 */
export default function SplitLetters({ lines, enter = false, delay = 0, stagger = 0.045, wrapWords = false }: Props) {
  let k = 0;
  return (
    <>
      {lines.map((line, li) => {
        const words = line.text.split(" ");
        const content = words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="word">
              {word.split("").map((ch, ci) => {
                const i = k++;
                const letter = <span className="ltr">{ch}</span>;
                if (enter !== "spin") {
                  return (
                    <span className="cell" key={ci}>
                      {letter}
                    </span>
                  );
                }
                const start = delay + i * stagger;
                const vars = {
                  "--d": `${start.toFixed(3)}s`,
                  "--end": `${(start + SPIN_DURATION).toFixed(3)}s`,
                  "--n": SPIN_COUNT,
                } as CSSProperties;
                return (
                  <span className="cell spin-clip" key={ci} style={vars}>
                    <span className="spin">
                      <span className="spin-strip">
                        {strip(i).map((f, j) => (
                          <span key={j}>{f}</span>
                        ))}
                      </span>
                      {letter}
                    </span>
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? wrapWords ? " " : <span className="space" /> : null}
          </Fragment>
        ));
        return (
          <span aria-hidden="true" key={li} className="block">
            <span className={`${wrapWords ? "line-wrap" : "line"} ${line.className ?? ""}`} style={line.style}>
              {content}
            </span>
          </span>
        );
      })}
    </>
  );
}
