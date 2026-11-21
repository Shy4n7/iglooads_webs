"""Build the team portrait cards from the originals in assets/team.

Each person is cut out of their background (rembg), scaled so the faces
match, turned black and white, graded to one look and set on the site's
deep indigo with a soft light behind the head. Writes one card per person,
public/media/team-card-<name>.jpg (760 x 950), and the same cut-out on a
clear background, public/media/team-cut-<name>.webp, for the group frame.

Needs: pip install "rembg[cpu]" pillow pillow-heif
Run:   python3 scripts/team_photo.py
The originals in assets/team are only read, never changed.
"""

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps
import pillow_heif
from rembg import new_session, remove

pillow_heif.register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "team"
OUT = ROOT / "public" / "media"
DEEP = (29, 31, 56)
LIGHT = (58, 62, 104)

# Measured on the photos after they are shrunk to fit 2400px: the eye line,
# the chin and the face centre. Faces are scaled so eye-to-chin matches,
# times scale where a face still reads smaller than the others.
PEOPLE = {
    "suhail": dict(file="suhail.heic", eye=1130, chin=1250, cx=650, scale=1.0),
    "sudhir": dict(file="sudhir.jpg", eye=890, chin=998, cx=846, scale=1.0),
    "ajay": dict(file="ajay.heic", eye=1030, chin=1165, cx=1092, scale=1.0),
    "shyan": dict(file="shyan-3.jpg", eye=372, chin=498, cx=563, scale=1.0),
}
# Everyone is graded to match this photo's face: its brightness, contrast
# and soft, deep-black look.
REFERENCE = "shyan"

CARD = (760, 950)
EYE_Y = 360
EYE_TO_CHIN = 168


def cut_out(p, session):
    im = Image.open(SRC / p["file"]).convert("RGB")
    im.thumbnail((2400, 2400))
    im = remove(im, session=session).convert("RGBA")
    # Pull the edge in a little and soften it, so no background colour
    # shows as a light halo around the hair and shoulders.
    # Faint leftovers of the old background are dropped first.
    a = im.getchannel("A").point(lambda v: 0 if v < 60 else v)
    a = a.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    im.putalpha(a)
    return im


def place(im, p):
    """Scale and position the cut-out so the face sits centred on the card."""
    e = p["chin"] - p["eye"]
    s = EYE_TO_CHIN * p["scale"] / e
    y0 = max(0, p["eye"] - 3 * e)
    y1 = min(im.height, p["eye"] + 8 * e)
    im = im.crop((0, y0, im.width, y1))
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = round(CARD[0] / 2 - p["cx"] * s)
    y = round(EYE_Y - (p["eye"] - y0) * s)
    canvas = Image.new("RGBA", CARD, (0, 0, 0, 0))
    canvas.alpha_composite(im, (max(0, x), max(0, y)), (max(0, -x), max(0, -y)))
    return canvas


# The face, from the brows to the chin, on the card.
FACE = (
    round(CARD[0] / 2 - 0.7 * EYE_TO_CHIN),
    round(EYE_Y - 0.3 * EYE_TO_CHIN),
    round(CARD[0] / 2 + 0.7 * EYE_TO_CHIN),
    round(EYE_Y + EYE_TO_CHIN),
)


def stats(grey, alpha):
    vals = [g for g, a in zip(grey.crop(FACE).getdata(), alpha.crop(FACE).getdata()) if a > 200]
    mean = sum(vals) / len(vals)
    return mean, (sum((v - mean) ** 2 for v in vals) / len(vals)) ** 0.5


# A gentle S-curve: deeper blacks and brighter highlights, mid-tones kept.
S_CURVE = [round(255 * (0.5 + 0.5 * math.tanh(1.8 * (g / 255 - 0.5)) / math.tanh(0.9))) for g in range(256)]


def to_grey(rgba, target=None):
    """Black and white. With a target (mean, std), the face is graded to
    match it and polished: a touch of smoothing, the S-curve, then crisp
    detail. Without one, the photo is only turned grey."""
    grey = ImageOps.grayscale(rgba.convert("RGB"))
    alpha = rgba.getchannel("A")
    if target:
        mean, std = stats(grey, alpha)
        t_mean, t_std = target
        grey = grey.point(lambda g: max(0, min(255, round(t_mean + (g - mean) * t_std / std))))
        grey = grey.filter(ImageFilter.GaussianBlur(0.6)).point(S_CURVE)
        grey = grey.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))
    return Image.merge("RGBA", (grey, grey, grey, alpha))


def backdrop():
    """Deep indigo with a soft light behind the head."""
    bg = Image.new("RGB", CARD, DEEP)
    glow = Image.new("L", CARD, 0)
    ImageDraw.Draw(glow).ellipse((CARD[0] * 0.05, CARD[1] * 0.02, CARD[0] * 0.95, CARD[1] * 0.72), fill=120)
    bg.paste(Image.new("RGB", CARD, LIGHT), (0, 0), glow.filter(ImageFilter.GaussianBlur(120)))
    return bg.convert("RGBA")


def main():
    session = new_session("isnet-general-use")
    placed = {name: place(cut_out(p, session), p) for name, p in PEOPLE.items()}
    ref = placed[REFERENCE]
    target = stats(ImageOps.grayscale(ref.convert("RGB")), ref.getchannel("A"))
    for name, im in placed.items():
        card = backdrop()
        card.alpha_composite(to_grey(im, None if name == REFERENCE else target))
        card.convert("RGB").save(OUT / f"team-card-{name}.jpg", quality=86, optimize=True, progressive=True)
        # The same person on a clear background, for the group frame.
        to_grey(im, None if name == REFERENCE else target).save(OUT / f"team-cut-{name}.webp", quality=88, method=6)
        print("card", name)


if __name__ == "__main__":
    main()
