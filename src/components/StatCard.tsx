"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix: string;
  label: string;
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function StatCard({ to, suffix, label }: Props) {
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
      <div
        className="font-anton text-[64px] leading-none text-amber"
        aria-label={`${to}${suffix}`}
      >
        <span aria-hidden="true">
          {n}
          {suffix}
        </span>
      </div>
      <span className="stat-rule" aria-hidden="true" />
      <div className="text-sm text-cream">{label}</div>
    </li>
  );
}
