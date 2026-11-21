"""Cut the three people out of the group photo.

Reads assets/team/group.jpg (never changed), removes the background
(rembg), clears a few leftovers, turns the people black and white with a gentle S-curve, and writes
public/media/team-group-cut.webp with a transparent background (2400 x 1500).

Needs: pip install "rembg[cpu]" pillow
Run:   python3 scripts/team_group.py
"""

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter, ImageOps
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "team" / "group.jpg"
OUT = ROOT / "public" / "media" / "team-group-cut.webp"
SIZE = (2400, 1500)

S_CURVE = [round(255 * (0.5 + 0.5 * math.tanh(1.6 * (v / 255 - 0.5)) / math.tanh(0.8))) for v in range(256)]


def main():
    im = ImageOps.exif_transpose(Image.open(SRC)).convert("RGB")
    w, h = im.size
    ch = round(w / 1.6)
    y0 = min(round(h * 0.03), h - ch)
    im = im.crop((0, y0, w, y0 + ch)).resize(SIZE, Image.LANCZOS)

    cut = remove(im, session=new_session("isnet-general-use")).convert("RGBA")
    alpha = cut.getchannel("A").point(lambda v: 0 if v < 60 else v)
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0))

    # A passer-by behind the left shoulder, and the ragged table legs: clear
    # the first, fade the bottom edge so the people dissolve into the frame.
    alpha.paste(0, (0, 540, 425, 860))
    fade = Image.linear_gradient("L").rotate(180).resize((SIZE[0], 380))
    floor = Image.new("L", SIZE, 255)
    floor.paste(fade, (0, SIZE[1] - 380))
    alpha = ImageChops.multiply(alpha, floor)

    grey = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=0.5).point(S_CURVE)
    grey = grey.filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=3))
    out = Image.merge("RGBA", (grey, grey, grey, alpha))
    out.save(OUT, quality=88, method=6)
    print("wrote", OUT, out.size, alpha.getbbox())


if __name__ == "__main__":
    main()
