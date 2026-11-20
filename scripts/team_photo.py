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

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageEnhance, ImageOps
import pillow_heif
from rembg import new_session, remove

pillow_heif.register_heif_opener()

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "team"
OUT = ROOT / "public" / "media"
DEEP = (29, 31, 56)

# Measured on the photos after they are shrunk to fit 2400px: the eye line,
# the chin and the face centre. Faces are scaled so eye-to-chin matches.
PEOPLE = {
    "shyan": dict(file="shyan.jpg", eye=309, chin=428, cx=214, scale=0.95, x=300, lift=16),
    "suhail": dict(file="suhail.heic", eye=1130, chin=1250, cx=650, scale=1.0, x=525, lift=0),
    "sudhir": dict(file="sudhir.jpg", eye=890, chin=998, cx=846, scale=1.0, x=840, lift=0),
    "ajay": dict(file="ajay.heic", eye=1030, chin=1165, cx=1092, scale=1.0, x=1150, lift=0),
}
# Painted back to front: Shyan stands just behind Suhail, whose shoulder
# hides the edge of Shyan's photo where another person was standing.
PAINT_ORDER = ["shyan", "ajay", "sudhir", "suhail"]
EYE_TO_CHIN = 95
TONE_MEAN, TONE_STD = 112, 58
CANVAS = (1440, 720)
EYE_Y = 300
# Final frame: trims the empty space above the tallest head and at the sides.
FRAME = (125, 120, 1345, 720)


def cut_out(name, p, session):
    im = Image.open(SRC / p["file"]).convert("RGB")
    im.thumbnail((2400, 2400))
    im = remove(im, session=session).convert("RGBA")
    if name == "shyan":
        # Drop the other people in this photo, and fade the left edge where
        # the original frame cuts through his arm.
        keep = Image.new("L", im.size, 0)
        ImageDraw.Draw(keep).polygon(
            [(0, 0), (416, 0), (416, 505), (385, 505), (330, 560), (300, 620), (276, 700),
             (252, 800), (226, 880), (232, 960), (150, 995), (150, 1280), (0, 1280)],
            fill=255,
        )
        ramp = Image.linear_gradient("L").rotate(90).resize((60, im.height))
        edge = ImageChops.multiply(keep.crop((0, 0, 60, im.height)), ramp)
        keep.paste(edge, (0, 0))
        alpha = Image.composite(im.getchannel("A"), Image.new("L", im.size, 0), keep)
        im.putalpha(alpha)
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
    y = round(EYE_Y - p["lift"] - (p["eye"] - y0) * s)
    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    canvas.alpha_composite(im, (max(0, x), max(0, y)), (max(0, -x), max(0, -y)))
    return canvas


def to_grey(rgba):
    grey = ImageOps.grayscale(rgba.convert("RGB"))
    # Match the tones: shift and stretch each person's greys so all four
    # share the same brightness and contrast, whatever light they were shot in.
    alpha = rgba.getchannel("A")
    solid = [g for g, a in zip(grey.getdata(), alpha.getdata()) if a > 200]
    mean = sum(solid) / len(solid)
    std = (sum((g - mean) ** 2 for g in solid) / len(solid)) ** 0.5
    grey = grey.point(lambda g: max(0, min(255, round(TONE_MEAN + (g - mean) * TONE_STD / std))))
    grey = grey.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
    out = Image.merge("RGBA", (grey, grey, grey, rgba.getchannel("A")))
    return out.crop(FRAME)


def main():
    session = new_session("isnet-general-use")
    layers = {}
    for name, p in PEOPLE.items():
        layers[name] = to_grey(layer(cut_out(name, p, session), p))
        layers[name].save(OUT / f"team-{name}.webp", quality=82, method=6)
        print("layer", name)
    group = Image.new("RGBA", layers["shyan"].size, DEEP + (255,))
    for name in PAINT_ORDER:
        group.alpha_composite(layers[name])
    group.convert("RGB").save(OUT / "team-group.jpg", quality=82, optimize=True, progressive=True)
    print("group", group.size)


if __name__ == "__main__":
    main()
