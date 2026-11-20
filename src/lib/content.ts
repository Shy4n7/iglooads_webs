// All site copy and media references in one place.
// Values in [square brackets] are placeholders to be replaced with real content.

export const INSTAGRAM_URL = "https://www.instagram.com/iglooads/";
export const INSTAGRAM_HANDLE = "@iglooads";
export const EMAIL = "iglooads.in@gmail.com";
export const GSTIN = "33JEIPM9440H1Z5";

// Phone numbers as shown and as dialled. The first one also takes WhatsApp.
export const PHONES = [
  { label: "+91 90475 25423", tel: "+919047525423" },
  { label: "+91 93442 77370", tel: "+919344277370" },
];
export const WHATSAPP_URL = `https://wa.me/919047525423?text=${encodeURIComponent(
  "Hi Igloo Ads, I would like to talk about a project.",
)}`;

// Enquiry form: sent through FormSubmit to EMAIL. The first enquiry makes
// FormSubmit email an activation link to that address; click it once.
export const ENQUIRY_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`;

export const NAV = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#team", label: "Team" },
  { href: "#contact", label: "Contact" },
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

export const REVIEWS = [
  {
    title: "Creativity and young energy",
    quote:
      "We really love the energy these guys bring! They\u2019re young, full of fresh ideas and always come up with something different for our brand. Working with Igloo Ads has definitely given our business a fresh identity on social media.",
  },
  {
    title: "Speed and timely delivery",
    quote:
      "One thing we absolutely appreciate is their time management. Shoots, edits and final deliveries are all handled within the promised timelines. No unnecessary follow-ups or delays. That\u2019s something we genuinely value.",
  },
  {
    title: "Understanding and professionalism",
    quote:
      "What makes Igloo Ads different is how well they understand our business. We don\u2019t have to explain everything repeatedly. They understand our requirements, take ownership and make sure the final output is exactly what we expect. Great experience working with them!",
  },
];

// Team, left to right as they stand in the group photo (public/media/team-*,
// built by scripts/team_photo.py). x is each face's centre and from/to the
// edges of the area that highlights them, all as % of the photo's width.
export type Member = {
  id: string;
  name: string;
  role: string;
  line: string;
  handle: string;
  instagram: string;
  x: number;
  from: number;
  to: number;
};

export const TEAM: Member[] = [
  {
    id: "sudhir",
    name: "Sudhir",
    role: "Chief Operating Officer",
    line: "Runs the shoots, schedules and deliveries so nothing ever slips.",
    handle: "@_sudhir.____",
    instagram: "https://www.instagram.com/_sudhir.____/",
    x: 24.1,
    from: 0,
    to: 36,
  },
  {
    id: "suhail",
    name: "Suhail",
    role: "Founder and CEO",
    line: "Started Igloo Ads and sets the direction for every brand we take on.",
    handle: "@moh_suhaill",
    instagram: "https://www.instagram.com/moh_suhaill/",
    x: 50,
    from: 36,
    to: 64,
  },
  {
    id: "ajay",
    name: "Ajay",
    role: "Creative Head and Model",
    line: "Dreams up the concepts, then steps in front of the camera himself.",
    handle: "@_ajayy.13_",
    instagram: "https://www.instagram.com/_ajayy.13_/",
    x: 75.9,
    from: 64,
    to: 100,
  },
];
