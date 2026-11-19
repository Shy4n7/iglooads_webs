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
  {
    n: "01",
    kicker: "TALK",
    title: "Discovery call",
    body: "We learn your brand, audience and what you want people to do.",
  },
  {
    n: "02",
    kicker: "CREATE",
    title: "Shoot and edit",
    body: "Scripts, a planned shoot day and fast, thumb-stopping edits.",
  },
  {
    n: "03",
    kicker: "GROW",
    title: "Post and grow",
    body: "We post, track views and leads, and double down on what works.",
  },
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

// Booking calendar. Shown as a guide only: the Google Calendar booking page
// is where a slot is actually confirmed, so keep these in step with it.
export const BOOKING = {
  title: "Discovery call",
  host: "Igloo Ads",
  description:
    "A quick call to learn your brand and goals, then map out the reels, ads or website that will move the needle.",
  durationMin: 30,
  // Days of the week that can be booked: 0 Sunday to 6 Saturday.
  workDays: [1, 2, 3, 4, 5],
  // First and last start times, in minutes after midnight IST, and the step.
  firstSlot: 10 * 60,
  lastSlot: 17 * 60 + 30,
  stepMin: 30,
  // How far ahead calls can be booked.
  monthsAhead: 12,
};
