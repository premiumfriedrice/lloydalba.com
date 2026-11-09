from PIL import Image, ImageDraw
import json
body = Image.open("body.bmp").convert("L")
W, H = body.size
# name: (polygon in image px, pivot = where the leg meets the body)
LEGS = {
  "leg-a": ([(1288,690),(1420,690),(1565,760),(1605,1095),(1515,1100),(1488,815),(1392,724),(1288,708)], (1340,694)),
  "leg-b": ([(1594,622),(1652,622),(1652,702),(1594,702)], (1612,624)),
  "leg-c": ([(1745,556),(1872,556),(1872,752),(1745,752)], (1766,560)),
  "leg-d": ([(818,676),(914,676),(904,958),(828,958)], (864,678)),
  "leg-e": ([(676,760),(712,712),(816,688),(828,930),(760,990),(676,905)], (752,702)),
  "tail": ([(912,1175),(1000,980),(1480,980),(1480,1420),(855,1420),(855,1395)], (905,1235)),
}
rest = body.copy(); pr = rest.load(); pb = body.load()
vis = Image.new("RGB", (W, H), (250,250,250)); pv = vis.load()
cols = [(220,40,40),(40,140,220),(40,170,80),(200,120,20),(150,60,200),(0,160,160)]
meta = {}
for i, (name, (poly, pivot)) in enumerate(LEGS.items()):
    m = Image.new("L", (W, H), 0); ImageDraw.Draw(m).polygon(poly, fill=255); pm = m.load()
    leg = Image.new("L", (W, H), 255); pl = leg.load()
    xs, ys = [], []
    for y in range(min(p[1] for p in poly), max(p[1] for p in poly)+1):
        for x in range(min(p[0] for p in poly), max(p[0] for p in poly)+1):
            if pm[x, y] and pb[x, y] == 0:
                pl[x, y] = 0; pr[x, y] = 255; pv[x, y] = cols[i]; xs.append(x); ys.append(y)
    leg.convert("1").save(f"{name}.bmp")
    a = max(abs(max(xs)-pivot[0]), abs(min(xs)-pivot[0])) + 4
    b = max(abs(max(ys)-pivot[1]), abs(min(ys)-pivot[1])) + 4
    meta[name] = {"pivot": pivot, "pad": [pivot[0]-a, pivot[1]-b, 2*a, 2*b]}
for y in range(H):
    for x in range(W):
        if pr[x, y] == 0: pv[x, y] = (23,23,23)
rest.convert("1").save("body-nolegs.bmp")
json.dump(meta, open("legs.json","w"))
vis.crop((550,500,1950,1120)).resize((700,310)).save("legs-cut.png")
vis.crop((600,900,1500,1420)).resize((450,260)).save("tail-cut.png")
