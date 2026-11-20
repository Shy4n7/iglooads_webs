"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import qr from "../../public/media/whatsapp-qr.svg";
import { EMAIL, GSTIN, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONES, WHATSAPP_URL } from "@/lib/content";

const ICONS = {
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  insta: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6.5h.01",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
};
const Icon = ({ d }: { d: string }) => (
  <svg className="vc3-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * The studio's visiting card in 3D: an indigo brand side and a cream side
 * with every way to reach us and a WhatsApp QR code (scan it from a laptop,
 * tap it on a phone). It turns in once when it comes into view, then sways
 * a little. Drag or swipe to turn it, or use the button; it always settles
 * on a face. The same card on every screen, scaled to fit.
 * With reduced motion it does not sway and turns without animating.
 */
export default function VisitingCard() {
  const boxRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  // Turn state lives outside React: it changes every frame.
  const state = useRef({ ry: -200, rx: 0, target: -200, vel: 0, velX: 0, reduce: false });
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    const box = boxRef.current;
    const scene = sceneRef.current;
    const card = cardRef.current;
    const shadow = shadowRef.current;
    if (!box || !scene || !card || !shadow) return;
    const s = state.current;
    s.reduce = window.matchMedia(REDUCE).matches;
    if (s.reduce) {
      s.ry = 0;
      s.target = 0;
    }

    let frame = 0;
    let visible = false;
    let entered = false;
    let suppressClick = false;
    let drag: { x: number; y: number; ry: number; rx: number; moved: boolean; last: number; t: number; v: number; id: number } | null =
      null;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      const sway = s.reduce || drag ? 0 : 1;
      const y = s.ry + sway * Math.sin(t * 0.8) * 5;
      const x = s.rx + sway * Math.sin(t * 1.1) * 2.5 + 6;
      card.style.setProperty("--ry", `${y.toFixed(2)}deg`);
      card.style.setProperty("--rx", `${x.toFixed(2)}deg`);
      // The sheen slides with the turn; the shadow narrows as it goes side-on.
      const rad = (y * Math.PI) / 180;
      card.style.setProperty("--sx", `${(Math.sin(rad) * 45).toFixed(1)}%`);
      const side = Math.abs(Math.cos(rad));
      shadow.style.setProperty("--sw", (0.35 + side * 0.65).toFixed(3));
      shadow.style.setProperty("--so", (0.45 + side * 0.45).toFixed(3));
      card.dataset.side = Math.cos(rad) < 0 ? "back" : "front";
    };

    const step = (now: number) => {
      frame = 0;
      if (!drag) {
        // Spring towards the face it is settling on.
        s.vel = (s.vel + (s.target - s.ry) * 0.06) * 0.78;
        s.ry += s.vel;
        s.velX = (s.velX + (0 - s.rx) * 0.08) * 0.75;
        s.rx += s.velX;
      }
      render(now);
      if (visible) frame = requestAnimationFrame(step);
    };
    const run = () => {
      if (!frame && visible) frame = requestAnimationFrame(step);
    };

    // Runs only while on screen; the first time, the card turns in.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !entered) {
          entered = true;
          s.target = 0;
        }
        if (visible) run();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(box);
    render(performance.now());
    kick.current = () => {
      if (s.reduce) render(performance.now());
      run();
    };

    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, ry: s.ry, rx: s.rx, moved: false, last: e.clientX, t: performance.now(), v: 0, id: e.pointerId };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) > 6) {
        drag.moved = true;
        scene.setPointerCapture(drag.id);
        scene.classList.add("is-dragging");
      }
      if (!drag.moved) return;
      const now = performance.now();
      drag.v = (e.clientX - drag.last) / Math.max(1, now - drag.t);
      drag.last = e.clientX;
      drag.t = now;
      s.ry = drag.ry + dx * 0.55;
      s.rx = Math.max(-22, Math.min(22, drag.rx - dy * 0.25));
      run();
    };
    const onEnd = () => {
      if (!drag) return;
      if (drag.moved) {
        // A flick carries the turn on; then it settles on a face.
        s.target = Math.round((s.ry + drag.v * 260) / 180) * 180;
        s.vel = 0;
        if (s.reduce) s.ry = s.target;
        suppressClick = true;
        window.setTimeout(() => (suppressClick = false), 0);
      }
      scene.classList.remove("is-dragging");
      drag = null;
      run();
    };
    // A drag that ends over a link must not open it.
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    scene.addEventListener("pointerdown", onDown);
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerup", onEnd);
    scene.addEventListener("pointercancel", onEnd);
    scene.addEventListener("click", onClick, true);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      scene.removeEventListener("pointerdown", onDown);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerup", onEnd);
      scene.removeEventListener("pointercancel", onEnd);
      scene.removeEventListener("click", onClick, true);
    };
  }, []);

  // Turn to a face: the next or a given one (keyboard focus lands on a hidden face).
  const turn = (to?: "front" | "back") => {
    const s = state.current;
    const base = Math.round(s.ry / 180) * 180;
    const onBack = Math.abs(base / 180) % 2 === 1;
    if (to === "front" && !onBack) return;
    if (to === "back" && onBack) return;
    s.target = base + 180;
    if (s.reduce) s.ry = s.target;
    kick.current();
  };

  return (
    <div className="vc3 rv">
      <p className="label mb-5 text-center text-[15px] text-cream-mute">OR REACH US DIRECTLY</p>
      <div ref={boxRef} className="vc3-box">
        <div ref={sceneRef} className="vc3-scene">
          <div ref={cardRef} className="vc3-card">
            <span className="vc3-edge is-l" aria-hidden="true" />
            <span className="vc3-edge is-r" aria-hidden="true" />

            <div className="vc3-face vc3-front" onFocus={() => turn("front")}>
              <span className="vc3-ring" aria-hidden="true" />
              <span className="vc3-ring is-inner" aria-hidden="true" />
              <div className="relative">
                <p className="vc3-tag m-0">CREATIVE STUDIO / COIMBATORE</p>
                <p className="vc3-word m-0" aria-label="Igloo Ads">
                  IGLOO
                  <br />
                  <span>ADS</span>
                </p>
                <p className="vc3-sub m-0">Reels, ads, shoots, events and websites</p>
              </div>
              <div className="vc3-foot">
                <span>{INSTAGRAM_HANDLE.toUpperCase()}</span>
                <b aria-hidden="true">TURN OVER &#8635;</b>
              </div>
              <span className="vc3-sheen" aria-hidden="true" />
            </div>

            <div className="vc3-face vc3-back" onFocus={() => turn("back")}>
              <div>
                <p className="vc3-logo m-0">IGLOO ADS</p>
                <ul className="vc3-list">
                  {PHONES.map((p) => (
                    <li key={p.tel}>
                      <Icon d={ICONS.phone} />
                      <a href={`tel:${p.tel}`}>{p.label}</a>
                    </li>
                  ))}
                  <li>
                    <Icon d={ICONS.mail} />
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </li>
                  <li>
                    <Icon d={ICONS.insta} />
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      {INSTAGRAM_HANDLE}
                    </a>
                  </li>
                  <li>
                    <Icon d={ICONS.pin} />
                    <span>Coimbatore, Tamil Nadu</span>
                  </li>
                </ul>
              </div>
              <div className="vc3-qr">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with Igloo Ads on WhatsApp">
                  <Image src={qr} alt="" width={164} height={164} unoptimized draggable={false} />
                </a>
                <p className="m-0" aria-hidden="true">
                  SCAN OR TAP
                  <br />
                  TO WHATSAPP
                </p>
              </div>
              <p className="vc3-gst m-0">GSTIN {GSTIN}</p>
              <span className="vc3-sheen" aria-hidden="true" />
            </div>
          </div>
          <span ref={shadowRef} className="vc3-shadow" aria-hidden="true" />
        </div>
      </div>
      <div className="vc3-ctrl">
        <button type="button" className="vc3-flip" onClick={() => turn()}>
          FLIP CARD
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="vc3-hint">or drag to turn it</span>
      </div>
    </div>
  );
}
