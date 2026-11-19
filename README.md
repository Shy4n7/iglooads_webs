# Igloo Ads website

Website for Igloo Ads, an Instagram ads, reels and UGC agency in Coimbatore.

Built with Next.js (App Router), TypeScript and Tailwind CSS. No animation libraries: motion is CSS
(transitions, keyframes, scroll-driven animations) plus a few small client components.

## Run

Requires Node 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

```bash
npm run start
```

Lint and type check:

```bash
npm run lint
```

```bash
npm run typecheck
```

### Static export

The site is fully static. To produce plain HTML in `out/` for any static host:

```bash
STATIC_EXPORT=1 npm run build
```

In export mode `next/image` serves the images as they are (the photos are already resized by the media
script), and the cache headers in `next.config.ts` are not applied.

## Deploy (Vercel)

1. Merge this work into the branch you want live (usually `main`) and push it to GitHub.
2. Go to vercel.com, sign in with GitHub, choose Add New, Project, and import `iglooads_webs`.
   If the repository is not listed, use Adjust GitHub App Permissions to give Vercel access to it.
3. Keep the detected settings: Framework Preset Next.js, Root Directory `./`, default build and
   output commands. Do not set `STATIC_EXPORT`, so `next/image` can optimize photos and logos.
4. Under Environment Variables add `NEXT_PUBLIC_BOOKING_URL` (and optionally `NEXT_PUBLIC_SITE_URL`).
5. Click Deploy. You get a `*.vercel.app` URL in about a minute.
6. Custom domain: Project Settings, Domains, add your domain and create the DNS records Vercel shows
   at your domain registrar. Then set `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.

After that, every push to the production branch deploys automatically, and other branches get preview
URLs. `NEXT_PUBLIC_*` values are baked in at build time, so redeploy (Deployments, Redeploy) after
changing them.

## Booking link

The CONFIRM ON GOOGLE CALENDAR button opens your Google Calendar appointment schedule.

1. In Google Calendar, create an appointment schedule and copy its booking page link.
2. Set it as `NEXT_PUBLIC_BOOKING_URL`:
   - locally: copy `.env.example` to `.env.local` and fill in the value
   - on Vercel: add it under Environment Variables and redeploy

The value is read at build time, so rebuild after changing it. While it is unset the button links back
to the booking section and a `[YOUR GOOGLE CALENDAR BOOKING LINK]` note is shown under it.

Optional: `NEXT_PUBLIC_SITE_URL` (for example `https://iglooads.in`) sets the base URL for social share
metadata.

## Opening sequence

The first screen is staged like a camera take (`src/components/Hero.tsx`, styles under "Opening
sequence" in `src/app/globals.css`):

1. An indigo viewfinder with corner marks and a blinking amber REC light.
2. Each letter of IGLOO ADS spins through a blurred strip of other letters and locks in place.
3. The REC dot grows into a circle that wipes in the cream page, led by an amber ring.
4. On scroll, the wordmark shrinks into the header logo, and the header slides in.

On phones the wordmark sits on two full-width lines. With reduced motion turned on, the final
cream page shows straight away with no spin, wipe or morph.

## Media

Originals live in `assets/` and are never modified or served. Web copies are generated into
`public/media/` with ffmpeg:

```bash
npm run media
```

To regenerate everything, even files that already exist:

```bash
bash scripts/optimize_media.sh --force
```

Per reel it creates:

| File | Use |
| --- | --- |
| `<name>-card.mp4` | 640px, muted, crf 26, faststart. Autoplaying grid card. |
| `<name>-1080.mp4` | Up to 1080px, with audio, crf 24, faststart. Lightbox. |
| `<name>-poster.jpg` | 480px poster frame. |

It also resizes the stock photos in `assets/stock/` to `service-*.jpg` for the What we do cards, copies
the Open Graph image and makes `icon-192.png`. Which videos are reels is set at the top of
`scripts/optimize_media.sh`. The reel list, brand names and Instagram links are in `REELS` in `src/lib/content.ts`.

The What we do photos are from Unsplash, free for commercial use under the Unsplash License.
Photographer credits are in `assets/stock/CREDITS.md`. To swap one, replace the file in `assets/stock/`
(same name) and run `bash scripts/optimize_media.sh --force`.

Logos are imported straight from `assets/logos/wall/` by `next/image` (files are 2x, shown at half size).

## Project layout

- `src/app/` : layout (fonts, metadata), global styles and design tokens, home page
- `src/components/` : one component per section, plus `SplitLetters` (per-letter type with hover pops
  and the letter spin), `HeroMorph` (wordmark shrinks into the header logo on scroll) and
  `RevealFallback` (scroll reveal for browsers without `animation-timeline`)
- `src/lib/content.ts` : copy, links, reel list and placeholders in one place
- `scripts/optimize_media.sh` : media pipeline
- `design/` : the approved design canvas (`Main.dc.html` desktop, `Mobile.dc.html` 390px). Reference
  only, not deployable.

## Brand

- Indigo `#282B4A`, deep indigo `#1D1F38`, cream `#EEEBDA`, card cream `#F6F4E8`, border `#DCD8C2`,
  amber `#F2B661`, orange `#C9581E` (big type only), mid blue `#4A4F82` and `#5A5FA8`
- Fonts: Bebas Neue (logo, labels), Anton (big type, numbers), Bricolage Grotesque (headings),
  Fraunces (quotes), Poppins (body)

## Placeholders to fill

All in `src/lib/content.ts` unless noted.

- `[INSTAGRAM LINK]` and `[@instagram]`: `INSTAGRAM_URL`, `INSTAGRAM_LABEL`, `INSTAGRAM_HANDLE`
- `[email]`: `EMAIL_URL`, `EMAIL_LABEL`
- `[YOUR GOOGLE CALENDAR BOOKING LINK]`: `NEXT_PUBLIC_BOOKING_URL` env var
- Results `[00M]`, `[0X]`, `[00+]` and their labels: `RESULTS`. Only publish real, verifiable numbers.
- Testimonial and attribution: `TESTIMONIAL`
- Intro paragraph under the hero: `src/components/Intro.tsx`
