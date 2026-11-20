// Start an enquiry about one service: the contact form fills its project
// field with it (see Contact.tsx) and the page scrolls to the form.
export const ENQUIRE_EVENT = "igloo:enquire";

export function enquireAbout(service: string) {
  window.dispatchEvent(new CustomEvent(ENQUIRE_EVENT, { detail: service }));
  const form = document.getElementById("contact");
  if (!form) return;
  const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  form.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
}
