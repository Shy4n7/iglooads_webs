"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ENQUIRY_ENDPOINT } from "@/lib/content";
import { ENQUIRE_EVENT } from "@/lib/enquire";
import VisitingCard from "./VisitingCard";

type Status = { kind: "idle" | "sending" | "sent" | "error"; text: string };

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", required: false },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: false },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization", required: false },
] as const;

/**
 * Enquiry form (name, e-mail, phone, organisation, project) with underlined
 * fields whose labels float up when used, then the studio's visiting card.
 * Enquiries are posted to FormSubmit, which forwards them to EMAIL.
 */
export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });
  const projectRef = useRef<HTMLTextAreaElement>(null);

  // A service picked in What we do lands here as the first line of the
  // project field, replacing an earlier pick but keeping anything typed.
  useEffect(() => {
    const onEnquire = (e: Event) => {
      const field = projectRef.current;
      if (!field) return;
      const line = `Interested in: ${(e as CustomEvent<string>).detail}`;
      const rest = field.value.replace(/^Interested in: .*\n?/, "");
      field.value = rest ? `${line}\n${rest}` : `${line}\n`;
      window.setTimeout(() => field.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(ENQUIRE_EVENT, onEnquire);
    return () => window.removeEventListener(ENQUIRE_EVENT, onEnquire);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data._honey) return;
    if (!data.email?.trim() && !data.phone?.trim()) {
      setStatus({ kind: "error", text: "Add an e-mail or a phone number so we can get back to you." });
      (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      return;
    }
    setStatus({ kind: "sending", text: "Sending..." });
    try {
      const res = await fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `New enquiry from ${data.name || "the website"}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || String(json.success) !== "true") throw new Error("not sent");
      form.reset();
      setStatus({ kind: "sent", text: "Thanks! Your message is with us. We usually reply within a day." });
    } catch {
      setStatus({ kind: "error", text: "That did not go through. Please try again, or reach us on WhatsApp." });
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-indigo py-[88px] text-cream">
      <div className="wrap">
        <h2 id="contact-title" className="label rv mb-3 text-center text-cream">
          CONTACT
        </h2>
        <p
          className="giant rv m-0 text-center font-bebas text-cream"
          style={{ fontSize: "clamp(56px, 10vw, 150px)", lineHeight: 0.9 }}
        >
          LET&apos;S MAKE IT VIRAL
        </p>

        <form className="enq rv" onSubmit={onSubmit}>
          {FIELDS.map((f) => (
            <label key={f.name} className="enq-field">
              <input
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                required={f.required}
                placeholder=" "
              />
              <span>{f.label}</span>
            </label>
          ))}
          <label className="enq-field enq-wide">
            <textarea ref={projectRef} name="message" rows={3} required placeholder=" " />
            <span>Tell us about your project</span>
          </label>
          {/* Spam trap: people never see or fill this. */}
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="enq-wide flex flex-col items-center gap-4">
            <button type="submit" className="enq-send" disabled={status.kind === "sending"}>
              {status.kind === "sending" ? "Sending..." : "Send Message"}
            </button>
            <p
              role="status"
              className={`m-0 min-h-[1.5em] text-center text-sm ${status.kind === "error" ? "text-amber" : "text-cream-soft"}`}
            >
              {status.kind === "sending" ? "" : status.text}
            </p>
          </div>
        </form>

        <VisitingCard />
      </div>
    </section>
  );
}
