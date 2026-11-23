# Prijzen als "bedrukking" op het AI-rad + effen naaf (geen nep-logo).
# Per frame: rotatie van het rad volgen (kleurring vergelijken), prijsnamen in de vakken tekenen met dezelfde
# draaiing, bewegingsonscherpte bij snelheid, lichte schaduw/belichting van het rad overnemen, en Daisy's
# hand/arm (macOS Vision-masker) blijft vóór het rad.
# Gebruik: python3 rad_bedrukking.py <in.mp4> <uit.mp4> [maskermap]
import os, sys, json, math, subprocess, shutil, tempfile
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

POP = os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf')
BRUIN = (58, 37, 27); WIT = (255, 255, 255)
# 10 vakken (gemeten): kleur en prijs, met de klok mee vanaf de grens op 22.5 graden in het referentieframe
PRIJS = [('10 KILLER', 'HOOKS'), ('AI POWER', 'PACK'), ('CONTENT', 'RESCUE KIT'), ('30 DAYS', 'OF IDEAS'),
         ('MARKETING', 'SOS'), ('MYSTERY', 'FUNKY GIFT'), ('10 KILLER', 'HOOKS'), ('AI POWER', 'PACK'),
         ('CONTENT', 'RESCUE KIT'), ('30 DAYS', 'OF IDEAS')]
N = 720

def vind_rad(im):
    g = cv2.medianBlur(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY), 5)
    c = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, 1.2, 300, param1=120, param2=60, minRadius=300, maxRadius=460)
    best = None
    for x, y, r in (c[0] if c is not None else []):
        if x < 540 and (best is None or r > best[2]): best = (x, y, r)
    return best

def ring(im, cx, cy, R):
    out = []
    for rr in (0.5, 0.62, 0.74):
        a = np.radians(np.arange(N) / 2); xs = (cx + rr * R * np.sin(a)).astype(int); ys = (cy - rr * R * np.cos(a)).astype(int)
        ok = (xs >= 0) & (xs < im.shape[1]) & (ys >= 0) & (ys < im.shape[0])
        v = np.zeros((N, 3)); v[ok] = im[ys[ok], xs[ok]]; out.append((v, ok))
    return out

def labels(seq):
    """seq: kleurstring per halve graad (P/B/C) -> grenshoeken (graden) van de 10 vakken."""
    gr = [i / 2 for i in range(N) if seq[i] != seq[i - 1] and '-' not in (seq[i], seq[i - 1])]
    return gr

def kleurseq(im, cx, cy, R):
    v, ok = ring(im, cx, cy, R)[1]
    hsv = cv2.cvtColor(v.astype(np.uint8)[None], cv2.COLOR_BGR2HSV)[0]
    return ''.join('-' if not o else ('P' if s > 110 and (h > 140 or h < 8) and val > 90 else ('B' if val < 90 else 'C'))
                   for (h, s, val), o in zip(hsv, ok))

def schuif(a, b, zoek=360):
    best, bs = 1e18, 0
    for s in range(-zoek, zoek):
        tot = cnt = 0
        for (va, oa), (vb, ob) in zip(a, b):
            m = oa & np.roll(ob, s); tot += np.abs(va[m] - np.roll(vb, s, axis=0)[m]).sum(); cnt += m.sum()
        e = tot / max(cnt, 1)
        if e < best: best, bs = e, s
    return bs / 2

def vakken(seq):
    """Kleurruns langs de ring -> lijst (midden, breedte, kleur) per vak; dunne runs (<5 graden) zijn scheidingslijnen."""
    runs = []; i0 = 0
    for i in range(1, N + 1):
        if i == N or seq[i] != seq[i0]:
            runs.append([seq[i0], i0 / 2, (i - i0) / 2]); i0 = i
    if len(runs) > 1 and runs[0][0] == runs[-1][0]:   # rond de 0 graden samenvoegen
        runs[0][1] = runs[-1][1]; runs[0][2] += runs[-1][2]; runs.pop()
    vak = [(k, a0, w) for k, a0, w in runs if w >= 5 and k != '-']
    uit = []
    for k, a0, w in vak:   # te brede run = twee vakken van dezelfde kleur met een dun lijntje ertussen
        n = max(1, round(w / 36))
        for j in range(n): uit.append(((a0 + w * (j + 0.5) / n) % 360, w / n, k))
    return uit

def bedrukking(R, vak):
    """Laag (2R x 2R) met de 10 prijsnamen, vak k begint op hoek start + k*36 (graden, met de klok mee vanaf boven)."""
    S = 2; D = int(2 * R * S); laag = Image.new('RGBA', (D, D), (0, 0, 0, 0))
    for k, (mid, breedte, kl) in enumerate(vak):
        r1, r2 = PRIJS[k % len(PRIJS)]
        kleur = BRUIN if kl == 'C' else WIT
        fs = int(R * 0.085 * S * min(1, breedte / 36))
        f = ImageFont.truetype(POP, fs)
        def regel(t):
            w = ImageDraw.Draw(Image.new('L', (1, 1))).textlength(t, font=f); return w
        breed = max(regel(r1), regel(r2)); maxb = R * 0.52 * S
        if breed > maxb: f = ImageFont.truetype(POP, int(fs * maxb / breed)); fs = f.size
        t = Image.new('RGBA', (int(maxb) + 20, int(fs * 2.4)), (0, 0, 0, 0)); d = ImageDraw.Draw(t)
        for j, r in enumerate((r1, r2)):
            w = d.textlength(r, font=f); d.text(((t.width - w) / 2, j * fs * 1.12), r, font=f, fill=kleur + (235,))
        # tekst loopt van binnen naar buiten langs de straal; rechterhelft leesbaar, linkerhelft omgedraaid
        hoek = (90 - mid) if (mid % 360) <= 180 else (270 - mid)
        t = t.rotate(hoek, expand=True, resample=Image.BICUBIC)
        a = math.radians(mid); rr = R * 0.6 * S
        cx, cy = D / 2 + rr * math.sin(a), D / 2 - rr * math.cos(a)
        laag.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
    return laag.resize((int(2 * R), int(2 * R)), Image.LANCZOS)

def naaf(R):
    r = int(R * 0.14); im = Image.new('RGBA', (2 * r + 8, 2 * r + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i in range(r, 0, -1):   # zachte bolling
        t = i / r; c = tuple(int(x * (0.75 + 0.35 * (1 - t))) for x in BRUIN)
        d.ellipse([r + 4 - i, r + 4 - i, r + 4 + i, r + 4 + i], fill=c + (255,))
    d.ellipse([r + 4 - r * 0.22, r + 4 - r * 0.22, r + 4 + r * 0.22, r + 4 + r * 0.22], fill=(150, 140, 135, 255))
    return im.filter(ImageFilter.GaussianBlur(0.8))

def main(inp, uit, maskers=None):
    tmp = tempfile.mkdtemp()
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', inp, '-vf', 'fps=24', f'{tmp}/%04d.png'], check=True)
    fs = sorted(f for f in os.listdir(tmp) if f.endswith('.png'))
    ims = [cv2.imread(f'{tmp}/{f}') for f in fs]
    gevonden = [vind_rad(ims[k]) for k in (len(ims) // 2, 0, len(ims) - 1, len(ims) // 4)]
    cx, cy, R = next(g for g in gevonden if g is not None)
    rings = [ring(im, cx, cy, R) for im in ims]
    delta = [0.0] + [schuif(rings[i], rings[i - 1]) for i in range(1, len(ims))]
    cum = np.cumsum(delta)
    # grenzen bepalen in het rustigste frame (kleinste beweging), daar zijn de vakken scherp
    rust = int(np.argmin([abs(x) for x in delta[1:]]) + 1) if len(delta) > 1 else 0
    seq = kleurseq(ims[rust], cx, cy, R)
    gr = labels(seq)
    vak = vakken(seq)
    print('vakken', [(round(m), round(w), k) for m, w, k in vak])
    lab = bedrukking(R, vak)
    hub = naaf(R)
    for i, f in enumerate(fs):
        fr = Image.open(f'{tmp}/{f}').convert('RGBA')
        rot = cum[i] - cum[rust]; d = abs(delta[i])
        if d > 4:   # bewegingsonscherpte: gemiddelde van een paar tussenstanden
            n = min(8, int(d / 3) + 2); acc = None
            for k in range(n):
                l = lab.rotate(-(rot - delta[i] * k / n), resample=Image.BICUBIC)
                acc = l if acc is None else Image.blend(acc, l, 1 / (k + 1))
            l = acc
        else:
            l = lab.rotate(-rot, resample=Image.BICUBIC)
        # belichting van het rad overnemen: tekst iets donkerder waar het rad donker is
        laag = Image.new('RGBA', fr.size, (0, 0, 0, 0)); laag.alpha_composite(l, (int(cx - R), int(cy - R)))
        if maskers and os.path.exists(os.path.join(maskers, f)):
            m = Image.open(os.path.join(maskers, f)).convert('L').resize(fr.size).filter(ImageFilter.GaussianBlur(1.5))
            laag.putalpha(ImageChops.multiply(laag.getchannel('A'), ImageChops.invert(m)))
        fr.alpha_composite(laag)
        hl = Image.new('RGBA', fr.size, (0, 0, 0, 0)); hl.alpha_composite(hub, (int(cx - hub.width / 2), int(cy - hub.height / 2)))
        if maskers and os.path.exists(os.path.join(maskers, f)):
            hl.putalpha(ImageChops.multiply(hl.getchannel('A'), ImageChops.invert(m)))
        fr.alpha_composite(hl)
        fr.convert('RGB').save(f'{tmp}/{f}')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-framerate', '24', '-i', f'{tmp}/%04d.png', '-c:v', 'libx264', '-crf', '16',
                    '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', uit], check=True)
    json.dump({'cx': float(cx), 'cy': float(cy), 'R': float(R), 'delta': delta}, open(uit + '.json', 'w'))
    shutil.rmtree(tmp)
    print(uit, 'rad', int(cx), int(cy), int(R), 'grenzen', gr[:3])

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
