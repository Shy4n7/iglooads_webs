// All site copy and media references in one place.
// Values in [square brackets] are placeholders to be replaced with real content.

export const INSTAGRAM_URL = "#"; // [INSTAGRAM LINK]
export const INSTAGRAM_LABEL = "[INSTAGRAM LINK]";
export const INSTAGRAM_HANDLE = "[@instagram]"; // e.g. @iglooads
export const EMAIL_LABEL = "[email]";
export const EMAIL_URL = "#"; // [email] e.g. mailto:hello@example.com

export const BOOKING_PLACEHOLDER = "[YOUR GOOGLE CALENDAR BOOKING LINK]";
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "";

export const NAV = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#book", label: "Contact" },
];

export type Reel = { id: string; client: string; instagram: string };

export const REELS: Reel[] = [
  { id: "IMG_7724", client: "Audi Coimbatore", instagram: "https://www.instagram.com/audicoimbatore/" },
  { id: "IMG_7725", client: "Kun Kia Coimbatore", instagram: "https://www.instagram.com/kunkiacoimbatore/" },
  { id: "IMG_7728", client: "Lotus Hyundai", instagram: "https://www.instagram.com/lotushyundai.in/" },
  { id: "IMG_7729", client: "Royal Enfield Pollachi", instagram: "https://www.instagram.com/royalenfieldpollachi/" },
  { id: "IMG_7730", client: "Aura Contrivers", instagram: "https://www.instagram.com/aura_contrivers/" },
  { id: "IMG_7733", client: "Havells India", instagram: "https://www.instagram.com/havells__india/" },
];

export const reelMedia = (id: string) => ({
  card: `/media/${id}-card.mp4`,
  full: `/media/${id}-1080.mp4`,
  poster: `/media/${id}-poster.jpg`,
});

export const STEPS = [
  { n: "01", title: "Discovery call", body: "We learn your brand, audience and what you want people to do." },
  { n: "02", title: "Shoot and edit", body: "Scripts, a planned shoot day and fast, thumb-stopping edits." },
  { n: "03", title: "Post and grow", body: "We post, track views and leads, and double down on what works." },
];

export const RESULTS = [
  { value: "[00M]", label: "[views on one reel]" },
  { value: "[0X]", label: "[growth metric]" },
  { value: "[00+]", label: "[brands served]" },
];

export const TESTIMONIAL = {
  quote: "[CLIENT TESTIMONIAL, one or two lines in their words]",
  by: "[Client name], [Business]",
};

export const SLOTS = ["10:00 am", "11:30 am", "12:00 pm", "2:30 pm", "4:00 pm", "5:30 pm"];
