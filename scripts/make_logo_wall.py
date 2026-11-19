import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1], sys.argv[2]
SPEC = {  # name: (file, mode, inset)
 'audi':('audi.jpg','tint',0), 'hyundai':('hyundai.jpg','tint',0), 'kia':('kia.jpg','tint',0),
 'royal-enfield':('royal-enfield.jpg','tint',0), 'havells':('havells.png','tint',6), 'aura':('aura.png','flood',0)}
A, MAXW, MAXH, K = 11000, 230, 80, 2
def tint(a):
    d = 255 - a[..., :3].astype(float)
    dist = d.max(axis=2)
    solid = a[..., :3][dist > 150]
    fg = np.median(solid, axis=0)
    v = 255 - fg
    t = np.clip((d @ v) / (v @ v), 0, 1)
    t[t < 0.04] = 0
    rgba = np.zeros(a.shape[:2] + (4,), np.uint8)
    rgba[..., :3] = fg.astype(np.uint8); rgba[..., 3] = (t * 255).round().astype(np.uint8)
    return rgba
def flood(a):
    rgb = a[..., :3].astype(int)
    white = (rgb.min(axis=2) >= 240)
    lab, n = ndi.label(white)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    ext = np.isin(lab, list(border))
    ext = ndi.binary_dilation(ext, iterations=1)
    rgba = np.dstack([a[..., :3], np.full(a.shape[:2], 255, np.uint8)])
    soft = ndi.gaussian_filter(ext.astype(float), 0.8)
    rgba[..., 3] = ((1 - np.clip(soft, 0, 1)) * 255).round().astype(np.uint8)
    return rgba
res = {}
for name, (f, mode, inset) in SPEC.items():
    im0 = Image.open(f'{src}/{f}').convert('RGBA'); im = Image.new('RGB', im0.size, (255,255,255)); im.paste(im0, mask=im0.split()[3])
    if inset: im = im.crop((inset, inset, im.width - inset, im.height - inset))
    a = np.array(im)
    rgba = tint(a) if mode == 'tint' else flood(a)
    al = rgba[..., 3]
    ys, xs = np.where(al > 8)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    img = Image.fromarray(rgba, 'RGBA').crop(box)
    ar = img.width / img.height
    w = (A * ar) ** 0.5; h = w / ar
    if w > MAXW: w = MAXW; h = w / ar
    if h > MAXH: h = MAXH; w = h * ar
    W, H = round(w * K), round(h * K)
    img = img.resize((W, H), Image.LANCZOS)
    img.save(f'{out}/{name}.png', optimize=True)
    res[name] = (W, H, box[2] - box[0])
    print(name, f'{W}x{H}', 'src_trim_w', box[2] - box[0])
