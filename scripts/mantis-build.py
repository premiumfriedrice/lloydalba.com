"""Build the colour mantis shrimp from a photo on a flat dark background.

Usage: python3 scripts/mantis-build.py <source.png> public/critters   (needs Pillow)

Cuts the shrimp out (flood fill from the border, so dark parts inside it stay), splits the
folded fist arm off so it can strike, fills the gap behind it from the surrounding colours,
and writes mantis-body.png and mantis-arm.png at 288px wide. Prints the size and the arm pivot,
which Mantis.tsx uses.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from collections import deque
import sys
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); W, H = im.size; px = im.load()
BG = (25, 25, 25)
near = lambda c: abs(c[0]-BG[0]) + abs(c[1]-BG[1]) + abs(c[2]-BG[2]) < 42
bg = Image.new("L", (W, H), 0); pb = bg.load(); q = deque()
for x in range(W): q.extend([(x, 0), (x, H-1)])
for y in range(H): q.extend([(0, y), (W-1, y)])
while q:
    x, y = q.popleft()
    if pb[x, y] or not near(px[x, y]): continue
    pb[x, y] = 255
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < W and 0 <= ny < H and not pb[nx, ny]: q.append((nx, ny))
alpha = ImageChops.invert(bg).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
box = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
ARM = [(642,318),(700,310),(745,350),(748,440),(730,485),(690,492),(655,460),(638,400)]
PIVOT = (684, 318)
m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).polygon(ARM, fill=255); m = m.filter(ImageFilter.GaussianBlur(1.2))
# fill the hole behind the arm from its surroundings (normalised blur: blur(img*keep) / blur(keep))
keep = ImageChops.invert(m).point(lambda v: 255 if v > 250 else 0)
num = Image.composite(im, Image.new("RGB", (W, H)), keep).filter(ImageFilter.GaussianBlur(14))
den = keep.filter(ImageFilter.GaussianBlur(14))
pn, pd = num.load(), den.load()
fill = Image.new("RGB", (W, H)); pf = fill.load()
for y in range(H):
    for x in range(W):
        d = pd[x, y]
        if d: pf[x, y] = tuple(min(255, int(v * 255 / d)) for v in pn[x, y])
body_rgb = Image.composite(fill, im, m)
body = body_rgb.copy(); body.putalpha(alpha)
arm = im.copy(); arm.putalpha(ImageChops.multiply(alpha, m))
body = body.crop(box); arm = arm.crop(box)
P = (PIVOT[0] - box[0], PIVOT[1] - box[1])
# web size: 3x the 48px display width, so it stays sharp on phones
scale = 288 / body.width
size = (288, round(body.height * scale))
body.resize(size, Image.LANCZOS).save(f"{out}/mantis-body.png", optimize=True)
arm.resize(size, Image.LANCZOS).save(f"{out}/mantis-arm.png", optimize=True)
print({"w": size[0], "h": size[1], "pivot": [round(P[0]*scale, 1), round(P[1]*scale, 1)], "box": box})
