"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix: string;
  label: string;
  visual: "views" | "growth" | "brands";
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A small graphic in the card's free corner; it plays once the card is seen. */
function Visual({ kind }: { kind: Props["visual"] }) {
  if (kind === "views") {
    return (
      <svg viewBox="0 0 120 100" className="stat-visual" aria-hidden="true">
        <circle className="stat-ring r2" cx="60" cy="50" r="44" />
        <circle className="stat-ring r1" cx="60" cy="50" r="30" />
        <circle cx="60" cy="50" r="17" fill="var(--color-amber)" />
        <path d="M55 42l14 8-14 8z" fill="var(--color-indigo)" />
      </svg>
    );
  }
  if (kind === "growth") {
    return (
      <svg viewBox="0 0 120 100" className="stat-visual" aria-hidden="true">
        <path className="stat-grid" d="M6 92H116M6 62H116M6 32H116" />
        <path
          className="stat-line draw"
          d="M6 84L30 68L52 74L78 42L98 48L114 14"
          pathLength="1"
        />
        <circle className="stat-dot" cx="114" cy="14" r="6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 100" className="stat-visual" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle
          key={i}
          className="stat-brand"
          style={{ ["--i" as string]: i }}
          cx={24 + (i % 3) * 36}
          cy={30 + Math.floor(i / 3) * 40}
          r="13"
        />
      ))}
    </svg>
  );
}

export default function StatCard({ to, suffix, label, visual }: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const [n, setN] = useState(to); // the real number until the animation takes over

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let frame = 0;
    el.classList.add("is-armed");
    setN(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.classList.add("is-in");
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1500);
          setN(Math.round(to * ease(t)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <li ref={ref} className="rv lift stat-card rounded-[22px] bg-indigo p-7">
      <div>
        <div
          className="font-anton text-[56px] leading-none text-amber"
          aria-label={`${to}${suffix}`}
        >
          <span aria-hidden="true">
            {n}
            {suffix}
          </span>
        </div>
        <div className="mt-2 text-sm text-cream">{label}</div>
      </div>
      <Visual kind={visual} />
    </li>
  );
}
