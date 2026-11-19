import { EMAIL_LABEL, EMAIL_URL, INSTAGRAM_URL } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-deep py-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-5">
        <span className="font-bebas text-[22px] tracking-[0.35em] text-cream">IGLOO ADS</span>
        <div className="flex flex-wrap gap-6 text-[13px]">
          <a href={INSTAGRAM_URL} className="text-cream-soft hover:text-cream">
            [@instagram]
          </a>
          <a href={EMAIL_URL} className="text-cream-soft hover:text-cream">
            {EMAIL_LABEL}
          </a>
          <span className="text-cream-mute">Coimbatore, Tamil Nadu</span>
        </div>
      </div>
      <div className="wrap mt-6 text-xs text-cream-mute">
        &copy; {new Date().getFullYear()} Igloo Ads. Instagram reels, UGC ads and brand shoots.
      </div>
    </footer>
  );
}
