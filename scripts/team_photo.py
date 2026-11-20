"""Build the team group photo from the originals in assets/team.

Each person is cut out of their background (rembg), scaled so the faces
match, placed side by side and turned black and white. Writes one
transparent layer per person (public/media/team-<name>.webp, all the same
canvas size, so they stack into one picture) and a flattened copy on the
site's deep indigo (public/media/team-group.jpg) for previews and fallbacks.

Needs: pip install "rembg[cpu]" pillow pillow-heif
Run:   python3 scripts/team_photo.py
The originals in assets/team are only read, never changed.
"""

import math
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps
import pillow_heif
from rembg import new_session, remove

pillow_heif.register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "team"
OUT = ROOT / "public" / "media"
DEEP = (29, 31, 56)

# Measured on the photos after they are shrunk to fit 2400px: the eye line,
# the chin and the face centre. Faces are scaled so eye-to-chin matches,
# times scale where a face still reads smaller than the others.
# x: face centre in the row; drop: how far the eyes sit below EYE_Y
# (negative is higher).
PEOPLE = {
    "shyan": dict(file="shyan-3.jpg", eye=372, chin=498, cx=563, scale=1.0, x=330, drop=0),
    "suhail": dict(file="suhail.heic", eye=1130, chin=1250, cx=650, scale=1.06, x=590, drop=-6),
    "sudhir": dict(file="sudhir.jpg", eye=890, chin=998, cx=846, scale=1.0, x=850, drop=0),
    "ajay": dict(file="ajay.heic", eye=1030, chin=1165, cx=1092, scale=1.0, x=1110, drop=4),
}
# Painted back to front, so the founder's shoulders sit in front of his
# neighbours'.
PAINT_ORDER = ["shyan", "ajay", "sudhir", "suhail"]
# Everyone is graded to match this photo's face: its brightness, contrast
# and soft, deep-black look.
REFERENCE = "shyan"
EYE_TO_CHIN = 95
CANVAS = (1440, 760)
EYE_Y = 300
# Final frame: trims the empty space above the tallest head and at the sides.
FRAME = (120, 110, 1320, 720)


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


def layer(im, p):
    e = p["chin"] - p["eye"]
    s = EYE_TO_CHIN * p["scale"] / e
    y0 = max(0, p["eye"] - 3 * e)
    y1 = min(im.height, p["eye"] + 7 * e)
    im = im.crop((0, y0, im.width, y1))
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = round(p["x"] - p["cx"] * s)
    y = round(EYE_Y + p["drop"] - (p["eye"] - y0) * s)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(im, (max(0, x), max(0, y)), (max(0, -x), max(0, -y)))
    return canvas


def face_box(p):
    """The face, from the brows to the chin, on the canvas."""
    e = EYE_TO_CHIN * p["scale"]
    eye = EYE_Y + p["drop"]
    return (round(p["x"] - 0.7 * e), round(eye - 0.3 * e), round(p["x"] + 0.7 * e), round(eye + e))


def stats(grey, alpha, box):
    vals = [g for g, a in zip(grey.crop(box).getdata(), alpha.crop(box).getdata()) if a > 200]
    mean = sum(vals) / len(vals)
    return mean, (sum((v - mean) ** 2 for v in vals) / len(vals)) ** 0.5


# A gentle S-curve: deeper blacks and brighter highlights, mid-tones kept.
S_CURVE = [round(255 * (0.5 + 0.5 * math.tanh(1.8 * (g / 255 - 0.5)) / math.tanh(0.9))) for g in range(256)]


def to_grey(rgba, box, target=None):
    """Black and white. With a target (mean, std), the face is graded to
    match it and polished: a touch of smoothing, the S-curve, then crisp
    detail. Without one, the photo is only turned grey."""
    grey = ImageOps.grayscale(rgba.convert("RGB"))
    alpha = rgba.getchannel("A")
    if target:
        mean, std = stats(grey, alpha, box)
        t_mean, t_std = target
        grey = grey.point(lambda g: max(0, min(255, round(t_mean + (g - mean) * t_std / std))))
        grey = grey.filter(ImageFilter.GaussianBlur(0.6)).point(S_CURVE)
        grey = grey.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=3))
    return Image.merge("RGBA", (grey, grey, grey, alpha)).crop(FRAME)


def main():
    session = new_session("isnet-general-use")
    canvases = {name: layer(cut_out(p, session), p) for name, p in PEOPLE.items()}
    ref = canvases[REFERENCE]
    target = stats(ImageOps.grayscale(ref.convert("RGB")), ref.getchannel("A"), face_box(PEOPLE[REFERENCE]))
    print("reference face", [round(v, 1) for v in target])
    layers = {}
    for name, p in PEOPLE.items():
        layers[name] = to_grey(canvases[name], face_box(p), None if name == REFERENCE else target)
        layers[name].save(OUT / f"team-{name}.webp", quality=82, method=6)
        print("layer", name)
    group = Image.new("RGBA", layers[REFERENCE].size, DEEP + (255,))
    for name in PAINT_ORDER:
        group.alpha_composite(layers[name])
    group.convert("RGB").save(OUT / "team-group.jpg", quality=82, optimize=True, progressive=True)
    print("group", group.size)


if __name__ == "__main__":
    main()
