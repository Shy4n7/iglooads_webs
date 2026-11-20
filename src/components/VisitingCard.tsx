"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import qr from "../../public/media/whatsapp-qr.svg";
import { EMAIL, GSTIN, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONES, WHATSAPP_URL } from "@/lib/content";

const ICONS = {
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  chat: "M4 20l1.4-4A8 8 0 1 1 8 18.6L4 20Z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  insta: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6.5h.01",
  pin: "M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
};
const Icon = ({ d }: { d: string }) => (
  <svg className="vc-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * The studio's contact details as a visiting card: cream front with every
 * way to reach us, and an indigo panel with a WhatsApp QR code, so someone
 * on a laptop can carry on the chat on their phone. With a mouse the card
 * tilts towards the pointer and catches the light; touch screens get a
 * WhatsApp button in place of the code.
 */
export default function VisitingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (e.pointerType !== "mouse" || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1100px) rotateX(${((0.5 - y) * 8).toFixed(2)}deg) rotateY(${((x - 0.5) * 10).toFixed(2)}deg)`;
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      el.classList.add("is-tilting");
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.transform = "";
    el.classList.remove("is-tilting");
  };

  return (
    <div className="vc-wrap rv">
      <p className="label mb-5 text-center text-[15px] text-cream-mute">OR REACH US DIRECTLY</p>
      <div ref={ref} className="vc" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="vc-front">
          <div>
            <p className="vc-logo m-0">IGLOO ADS</p>
            <p className="m-0 mt-1.5 text-[12px] text-ink-mute">Reels, ads, shoots, events and websites</p>
          </div>

          <ul className="vc-list">
            <li>
              <Icon d={ICONS.phone} />
              <span>
                {PHONES.map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 && <span className="vc-sep" aria-hidden="true"> / </span>}
                    <a href={`tel:${p.tel}`}>{p.label}</a>
                  </span>
                ))}
              </span>
            </li>
            <li>
              <Icon d={ICONS.chat} />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp {PHONES[0].label}
              </a>
            </li>
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

          <p className="vc-gst m-0">GSTIN {GSTIN}</p>
        </div>

        <div className="vc-back">
          <div className="vc-qr">
            <Image src={qr} alt="QR code that opens a WhatsApp chat with Igloo Ads" width={164} height={164} unoptimized />
          </div>
          <p className="vc-qr-label m-0">SCAN TO CHAT ON WHATSAPP</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="vc-wa">
            CHAT ON WHATSAPP <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
        <span className="vc-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
