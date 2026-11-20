import { EMAIL, GSTIN, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONES } from "@/lib/content";
import Year from "./Year";

export default function Footer() {
  return (
    <footer className="bg-deep py-10">
      <div className="wrap flex flex-wrap items-center justify-between gap-5">
        <span className="font-bebas text-[22px] tracking-[0.35em] text-cream">IGLOO ADS</span>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px]">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-cream-soft hover:text-cream">
            {INSTAGRAM_HANDLE}
          </a>
          <a href={`mailto:${EMAIL}`} className="text-cream-soft hover:text-cream">
            {EMAIL}
          </a>
          {PHONES.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="text-cream-soft hover:text-cream">
              {p.label}
            </a>
          ))}
          <span className="text-cream-mute">Coimbatore, Tamil Nadu</span>
        </div>
      </div>
      <div className="wrap mt-6 flex flex-wrap justify-between gap-x-6 gap-y-2 text-xs text-cream-mute">
        <span>
          &copy; <Year /> Igloo Ads. Instagram reels, UGC ads, brand shoots and websites.
        </span>
        <span>GSTIN {GSTIN}</span>
      </div>
    </footer>
  );
}
