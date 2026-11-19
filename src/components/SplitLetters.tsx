import { Fragment, type CSSProperties } from "react";

type Line = { text: string; className?: string; style?: CSSProperties };

type Props = {
  lines: Line[];
  /** Entrance on load: "rise" slides letters up from a mask, "blur" fades them in from a blur. */
  enter?: false | "rise" | "blur";
  /** Base delay in seconds and per-letter stagger. */
  delay?: number;
  stagger?: number;
  /** Let words wrap onto new lines on narrow screens. */
  wrapWords?: boolean;
};

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
                const d = delay + k++ * stagger;
                const letter = <span className="ltr">{ch}</span>;
                return (
                  <span className="cell" key={ci}>
                    {enter ? (
                      <span className={`${enter === "blur" ? "blur-in" : "enter"} inline-block`} style={{ animationDelay: `${d.toFixed(3)}s` }}>
                        {letter}
                      </span>
                    ) : (
                      letter
                    )}
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? wrapWords ? " " : <span className="space" /> : null}
          </Fragment>
        ));
        const inner = (
          <span className={`${wrapWords ? "line-wrap" : "line"} ${line.className ?? ""}`} style={line.style}>
            {content}
          </span>
        );
        return enter === "rise" ? (
          <span className="mask" aria-hidden="true" key={li}>
            {inner}
          </span>
        ) : (
          <span aria-hidden="true" key={li} className="block">
            {inner}
          </span>
        );
      })}
    </>
  );
}
