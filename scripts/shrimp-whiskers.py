# Tapered whiskers: each is a cubic bezier in image space, rendered as a filled outline that narrows to a point.
# Output is local to the whisker's root (root at 0,0) plus an invisible square centred on the root,
# so CSS `transform-box: fill-box; transform-origin: 50% 50%` rotates it about its root.
import json, math, sys
B = (1848, 345)
WHISKERS = [  # (name, root offset, c1, c2, end, base width)
    ("ant-1", (0, -4), (1990, 170), (2260, 30), (2440, 200), 26),
    ("ant-2", (4, 12), (2100, 340), (2330, 400), (2440, 580), 22),
    ("ant-3", (2, 0), (1700, -140), (1050, -170), (430, 200), 26),
    ("ant-4", (0, -2), (1760, 60), (1480, -110), (1130, 30), 20),
]
def bez(p0, p1, p2, p3, t):
    u = 1 - t
    return tuple(u**3*a + 3*u*u*t*b + 3*u*t*t*c + t**3*d for a, b, c, d in zip(p0, p1, p2, p3))
def dbez(p0, p1, p2, p3, t):
    u = 1 - t
    return tuple(3*u*u*(b-a) + 6*u*t*(c-b) + 3*t*t*(d-c) for a, b, c, d in zip(p0, p1, p2, p3))
out = []
for name, off, c1, c2, end, w0 in WHISKERS:
    p0 = (B[0]+off[0], B[1]+off[1])
    N = 48
    left, right = [], []
    for i in range(N + 1):
        t = i / N
        x, y = bez(p0, c1, c2, end, t)
        dx, dy = dbez(p0, c1, c2, end, t)
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = w0 / 2 * (1 - t) ** 1.15
        left.append((x + nx*w - p0[0], y + ny*w - p0[1]))
        right.append((x - nx*w - p0[0], y - ny*w - p0[1]))
    pts = left + right[::-1][1:]
    d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"
    a = max(max(abs(x) for x, _ in pts), 1)
    b = max(max(abs(y) for _, y in pts), 1)
    out.append({"name": name, "root": p0, "d": d, "pad": [round(-a), round(-b), round(2*a), round(2*b)]})
json.dump(out, open("whiskers.json", "w"))
ys = [y + w["root"][1] for w in out for y in [float(v.split()[1]) for v in w["d"][1:-1].split(" L")]]
print("min y", round(min(ys)), "max y", round(max(ys)))
