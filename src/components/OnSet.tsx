import Image from "next/image";
import s1 from "../../public/media/still-set-1.jpg";
import s2 from "../../public/media/still-set-2.jpg";
import s3 from "../../public/media/still-set-3.jpg";
import s4 from "../../public/media/still-set-4.jpg";

// Photos are stills from the reels, standing in until real set photos arrive.
const SETS = [
  { img: s1, pos: "50% 50%" },
  { img: s2, pos: "60% 40%" },
  { img: s3, pos: "50% 30%" },
  { img: s4, pos: "50% 35%" },
];

export default function OnSet() {
  return (
    <section aria-labelledby="set-title" className="on-light pt-12 pb-[88px]">
      <div className="wrap">
        <h2 id="set-title" className="label rv mb-7">
          ON THE SET
        </h2>
        <div className="g4">
          {SETS.map((g, i) => (
            <article key={i} className="lift rv overflow-hidden rounded-[22px] border border-line bg-card">
              <div className="px-5 pt-[22px] pb-2.5">
                <h3
                  className="m-0 font-fraunces text-2xl leading-[1.05] font-extrabold"
                  style={{ fontVariationSettings: "'SOFT' 100" }}
                >
                  [Shoot name]
                </h3>
                <p className="mt-1.5 mb-0 text-xs text-ink-mute">[Location]</p>
              </div>
              <div className="relative h-[200px] bg-mid">
                <Image
                  src={g.img}
                  alt=""
                  fill
                  sizes="(max-width: 560px) 190px, (max-width: 900px) 50vw, 310px"
                  className="object-cover"
                  style={{ objectPosition: g.pos }}
                />
                {/* Hill edge: the card colour dips into the photo. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 40"
                  preserveAspectRatio="none"
                  className="absolute -top-px left-0 h-10 w-full"
                >
                  <path d="M0 0 H200 V12 C160 40 130 36 100 22 S40 2 0 30 Z" fill="#F6F4E8" />
                </svg>
                <span className="photo-tag" style={{ top: "auto", bottom: 12, right: "auto", left: 12 }}>
                  [PHOTO]
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
