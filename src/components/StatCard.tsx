"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  suffix: string;
  label: string;
  line: string;
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export default function StatCard({ to, suffix, label, line }: Props) {
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
      <div className="font-anton text-[64px] leading-none text-amber">
        {/* Screen readers hear the final number, not the count. */}
        <span className="sr-only">
          {to}
          {suffix}
        </span>
        <span aria-hidden="true">
          {n}
          {suffix}
        </span>
      </div>
      <div className="stat-label">{label}</div>
      <p className="stat-line-text">{line}</p>
    </li>
  );
}
