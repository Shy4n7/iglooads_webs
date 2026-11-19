import { NAV } from "@/lib/content";

export default function Header() {
  return (
    <header
      className="on-light sticky top-0 z-50 border-b border-indigo/10 bg-cream/70"
      style={{ WebkitBackdropFilter: "blur(14px)", backdropFilter: "blur(14px)" }}
    >
      <div className="wrap flex h-[68px] items-center justify-between">
        <a
          href="#top"
          className="font-bebas text-[22px] tracking-[0.35em] text-indigo no-underline"
          aria-label="Igloo Ads, back to top"
        >
          IGLOO ADS
        </a>
        <nav aria-label="Primary" className="navlinks flex gap-8 text-sm font-medium">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-deep">
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#book"
          className="btn inline-flex min-h-11 items-center rounded-full bg-amber px-5 py-3 font-bebas text-[17px] tracking-[0.08em] text-indigo no-underline"
        >
          BOOK A CALL
        </a>
      </div>
    </header>
  );
}
