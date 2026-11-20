"use client";

import { useState, type FormEvent } from "react";
import { EMAIL, ENQUIRY_ENDPOINT, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONES, WHATSAPP_URL } from "@/lib/content";

type Status = { kind: "idle" | "sending" | "sent" | "error"; text: string };

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", required: false },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: false },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization", required: false },
] as const;

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
    />
  </svg>
);

/**
 * Enquiry form (name, e-mail, phone, organisation, project) with underlined
 * fields whose labels float up when used, plus one-tap WhatsApp, call and
 * e-mail. Enquiries are posted to FormSubmit, which forwards them to EMAIL.
 */
export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle", text: "" });

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
            <textarea name="message" rows={3} required placeholder=" " />
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

        <div className="rv mx-auto mt-10 grid max-w-[820px] gap-4 sm:grid-cols-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="enq-direct enq-wa">
            <WhatsAppIcon />
            <span>
              <strong>Chat on WhatsApp</strong>
              <small>{PHONES[0].label}</small>
            </span>
          </a>
          <div className="enq-direct">
            <span>
              <strong>Call us</strong>
              {PHONES.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`}>
                  {p.label}
                </a>
              ))}
            </span>
          </div>
          <div className="enq-direct">
            <span>
              <strong>Write to us</strong>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                {INSTAGRAM_HANDLE}
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
