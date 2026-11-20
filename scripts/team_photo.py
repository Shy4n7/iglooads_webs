"""Build the team photos from the originals in assets/team.

Each person is cut out of their background (rembg), scaled so the faces
match and turned black and white.

- The crew (everyone but the founder) share one group shot: one
  transparent layer per person (public/media/team-<name>.webp, all the same
  size, so they stack into one picture) and a flattened copy on the site's
  deep indigo (public/media/team-group.jpg) for previews and fallbacks.
- The founder gets a portrait of his own (public/media/team-<name>.webp,
  transparent), shown on a separate panel beside the group.

Needs: pip install "rembg[cpu]" pillow pillow-heif
Run:   python3 scripts/team_photo.py
The originals in assets/team are only read, never changed.
"""

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
# fade: source row where the photo's own bottom edge starts to fade out,
# for photos cropped higher than the others.
CREW = {
    "shyan": dict(file="shyan-2.jpg", eye=478, chin=705, cx=655, x=445, lift=6, tilt=4, fade=1020, scale=1.1),
    "sudhir": dict(file="sudhir.jpg", eye=890, chin=998, cx=846, x=720, lift=30, tilt=0),
    "ajay": dict(file="ajay.heic", eye=1030, chin=1165, cx=1092, x=995, lift=0, tilt=-4),
}
# Painted back to front: Sudhir stands in the centre, a little higher and in
# front; the other two lean out towards their own side (tilt in degrees,
# positive leans left).
PAINT_ORDER = ["shyan", "ajay", "sudhir"]
FOUNDER = ("suhail", dict(file="suhail.heic", eye=1130, chin=1250, cx=650))

EYE_TO_CHIN = 95
TONE_MEAN, TONE_STD = 112, 58
# Taller than the final frame, so a leaning body still fills the bottom edge.
CANVAS = (1440, 1000)
EYE_Y = 300
# Final frame: trims the empty space above the tallest head and at the sides.
FRAME = (160, 100, 1280, 720)
# Founder portrait: head and shoulders, a little closer than the group.
PORTRAIT = (600, 720)
PORTRAIT_EYE_Y = 260
PORTRAIT_EYE_TO_CHIN = 118


def cut_out(p, session):
    im = Image.open(SRC / p["file"]).convert("RGB")
    im.thumbnail((2400, 2400))
    im = remove(im, session=session).convert("RGBA")
    # Pull the edge in a little and soften it, so no background colour
    # shows as a light halo around the hair and shoulders.
    # Faint leftovers of the old background are dropped first.
    a = im.getchannel("A").point(lambda v: 0 if v < 60 else v)
    a = a.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
    if p.get("fade"):
        ramp = Image.linear_gradient("L").resize((im.width, im.height - p["fade"]))
        ramp = ImageOps.invert(ramp)
        mask = Image.new("L", im.size, 255)
        mask.paste(ramp, (0, p["fade"]))
        a = Image.composite(a, Image.new("L", im.size, 0), mask)
    im.putalpha(a)
    return im


def place(im, p, canvas_size, eye_y, eye_to_chin, x):
    e = p["chin"] - p["eye"]
    s = eye_to_chin * p.get("scale", 1.0) / e
    y0 = max(0, p["eye"] - 3 * e)
    y1 = min(im.height, p["eye"] + 7 * e)
    im = im.crop((0, y0, im.width, y1))
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left = round(x - p["cx"] * s)
    top = round(eye_y - p.get("lift", 0) - (p["eye"] - y0) * s)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    canvas.alpha_composite(im, (max(0, left), max(0, top)), (max(0, -left), max(0, -top)))
    return canvas


def to_grey(rgba):
    grey = ImageOps.grayscale(rgba.convert("RGB"))
    # Match the tones: shift and stretch each person's greys so everyone
    # shares the same brightness and contrast, whatever light they were shot in.
    alpha = rgba.getchannel("A")
    solid = [g for g, a in zip(grey.getdata(), alpha.getdata()) if a > 200]
    mean = sum(solid) / len(solid)
    std = (sum((g - mean) ** 2 for g in solid) / len(solid)) ** 0.5
    grey = grey.point(lambda g: max(0, min(255, round(TONE_MEAN + (g - mean) * TONE_STD / std))))
    grey = grey.filter(ImageFilter.UnsharpMask(radius=1.6, percent=60, threshold=2))
    return Image.merge("RGBA", (grey, grey, grey, alpha))


def main():
    session = new_session("isnet-general-use")
    layers = {}
    for name, p in CREW.items():
        canvas = place(cut_out(p, session), p, CANVAS, EYE_Y, EYE_TO_CHIN, p["x"])
        if p["tilt"]:
            canvas = canvas.rotate(p["tilt"], Image.BICUBIC, center=(p["x"], FRAME[3]))
        layers[name] = to_grey(canvas).crop(FRAME)
        layers[name].save(OUT / f"team-{name}.webp", quality=82, method=6)
        print("layer", name)
    group = Image.new("RGBA", layers[PAINT_ORDER[0]].size, DEEP + (255,))
    for name in PAINT_ORDER:
        group.alpha_composite(layers[name])
    group.convert("RGB").save(OUT / "team-group.jpg", quality=82, optimize=True, progressive=True)
    print("group", group.size)

    name, p = FOUNDER
    portrait = place(cut_out(p, session), p, PORTRAIT, PORTRAIT_EYE_Y, PORTRAIT_EYE_TO_CHIN, PORTRAIT[0] // 2)
    to_grey(portrait).save(OUT / f"team-{name}.webp", quality=84, method=6)
    print("portrait", name)


if __name__ == "__main__":
    main()
