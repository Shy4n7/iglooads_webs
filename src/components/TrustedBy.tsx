import Image, { type StaticImageData } from "next/image";
import audi from "../../assets/logos/wall/audi.png";
import aura from "../../assets/logos/wall/aura.png";
import havells from "../../assets/logos/wall/havells.png";
import hyundai from "../../assets/logos/wall/hyundai.png";
import kia from "../../assets/logos/wall/kia.png";
import royalEnfield from "../../assets/logos/wall/royal-enfield.png";

// Display heights in CSS px. Source files are 2x.
const LOGOS: { alt: string; src: StaticImageData; h: number }[] = [
  { alt: "Audi Coimbatore", src: audi, h: 50 },
  { alt: "Aura", src: aura, h: 59 },
  { alt: "Havells", src: havells, h: 36 },
  { alt: "Hyundai", src: hyundai, h: 64 },
  { alt: "Kia", src: kia, h: 41 },
  { alt: "Royal Enfield", src: royalEnfield, h: 60 },
];

function Logo({ l, dup }: { l: (typeof LOGOS)[number]; dup?: boolean }) {
  const w = Math.round((l.h * l.src.width) / l.src.height);
  return (
    <li className={`m-0 list-none ${dup ? "lg-dup" : ""}`} aria-hidden={dup || undefined}>
      <Image
        className="lg"
        src={l.src}
        alt={dup ? "" : l.alt}
        width={w}
        height={l.h}
        style={{ height: l.h, width: w }}
        loading="lazy"
      />
    </li>
  );
}

export default function TrustedBy() {
  return (
    <section aria-labelledby="trusted-title" className="on-light pt-6 pb-16">
      <div className="wrap">
        <h2 id="trusted-title" className="label mb-3">
          TRUSTED BY
        </h2>
        <p className="headline mb-10 max-w-[640px]" style={{ fontSize: "clamp(28px, 3.6vw, 46px)" }}>
          Brands that already stopped the scroll with us.
        </p>
      </div>
      <div className="marq">
        {/* Each half holds the set twice (wide screens), and the halves are
            identical, so translateX(-50%) loops seamlessly. */}
        <ul className="track m-0 p-0">
          {[0, 1, 2, 3].map((copy) =>
            LOGOS.map((l) => <Logo key={`${l.alt}-${copy}`} l={l} dup={copy > 0} />),
          )}
        </ul>
      </div>
    </section>
  );
}
