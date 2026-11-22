"""Build the team portrait cards from the originals in assets/team.

Each person is cut out of their background (rembg), scaled so the faces
match, turned black and white, graded to one look and set on the site's
deep indigo with a soft light behind the head. Writes one card per person:
public/media/team-card-<name>.jpg (760 x 950).

Needs: pip install "rembg[cpu]" pillow pillow-heif
Run:   python3 scripts/team_photo.py            (every card)
       python3 scripts/team_photo.py shyan      (just one)
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
    # A small, already black and white photo: the left and bottom edges are
    # extended (pad = left, bottom) so the shirt fills the card. cx includes it.
    # raw: no grading, the photo is used as it is.
    "shyan": dict(file="shyan-4.jpg", eye=165, chin=278, cx=265, scale=1.0, pad=(15, 70), raw=True),
}
# Everyone is graded to match the face in this photo: its brightness,
# contrast and soft, deep-black look. It is only measured, never put on a card.
LOOK = dict(file="shyan-3.jpg", eye=372, chin=498, cx=563, scale=1.0)

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
    if "pad" in p:
        im = pad_edges(im, *p["pad"])
    return im


def pad_edges(im, left, bottom):
    """Extend the left and bottom edges by repeating the outermost pixels."""
    w, h = im.size
    out = Image.new("RGBA", (w + left, h + bottom), (0, 0, 0, 0))
    out.paste(im, (left, 0))
    if left:
        out.paste(im.crop((0, 0, 1, h)).resize((left, h), Image.NEAREST), (0, 0))
    if bottom:
        out.paste(out.crop((0, h - 1, w + left, h)).resize((w + left, bottom), Image.NEAREST), (0, h))
        # Soften the join so no band shows where the extension starts.
        seam = 60
        box = (0, h - seam, w + left, h + bottom)
        blurred = out.crop(box).filter(ImageFilter.GaussianBlur(14))
        ramp = Image.linear_gradient("L").resize((w + left, seam))
        mask = Image.new("L", (w + left, seam + bottom), 255)
        mask.paste(ramp, (0, 0))
        out.paste(blurred, box[:2], mask)
    return out


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


def main(only=None):
    session = new_session("isnet-general-use")
    look = place(cut_out(LOOK, session), LOOK)
    target = stats(ImageOps.grayscale(look.convert("RGB")), look.getchannel("A"))
    for name, p in PEOPLE.items():
        if only and name not in only:
            continue
        card = backdrop()
        card.alpha_composite(to_grey(place(cut_out(p, session), p), None if p.get("raw") else target))
        card.convert("RGB").save(OUT / f"team-card-{name}.jpg", quality=86, optimize=True, progressive=True)
        print("card", name)


if __name__ == "__main__":
    import sys

    main(sys.argv[1:])
