# SPIN THE FUN!: oprichtersvideo als verhaal (~28 sec), PROEF zonder AI-credits.
# Daisy uitgeknipt (seg.swift) voor de Breedestraat, Otrobanda. Groot prijzenrad op een paal ACHTER haar,
# met schaduw, dikke rand en pinnen; tijdens het vastpakken draait het exact mee met haar hand (hand.swift).
# Prijskaarten vliegen uit het rad: daarom duikt ze weg.
# Werkmap: S1..S7.mov + f_S*/ (frames), m_S*/ (maskers), hand_S3.json, bgc12.png
# Gebruik: python3 founder_verhaal.py <werkmap>
import math, os, json, subprocess, shutil, sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
from build import maak_wiel, tekst, plak, back, ease_out, POP, MARK, INTER, PINK, BRUIN, WIT, CREME, ZACHT, ROOT, UIT, MUZIEK

WERK = sys.argv[1]
FPS = 30
SEG = [('S1', 6.0), ('S2', 5.0), ('S3', 3.4), ('S4', 3.0), ('S5', 2.3), ('S6', 1.7), ('S7', 2.8)]
START = {}; t0 = 0
for n, d in SEG: START[n] = t0; t0 += d
EIND = t0; DUUR = EIND + 3.5
N = int(round(DUUR * FPS))

# ---------- Rad: plek afgestemd op de hand in clip 6724 (bovenrand onder haar opgestoken hand)
C = (120, 640); R = 530; D = 2 * R
wiel, midden = maak_wiel(D)
peg = Image.new('RGBA', (D + 40, D + 40), (0, 0, 0, 0)); pd = ImageDraw.Draw(peg)
for k in range(24):                               # pinnen op de rand
    a = math.radians(k * 15); px, py = (D + 40) / 2 + (R - 16) * math.sin(a), (D + 40) / 2 - (R - 16) * math.cos(a)
    pd.ellipse([px - 9, py - 9, px + 9, py + 9], fill=(250, 245, 238), outline=(120, 90, 70), width=3)
WIEL = Image.new('RGBA', (D + 40, D + 40), (0, 0, 0, 0)); WIEL.alpha_composite(wiel, (20, 20)); WIEL.alpha_composite(peg)
# naaf
nd = ImageDraw.Draw(WIEL); m0 = (D + 40) / 2
nd.ellipse([m0 - 70, m0 - 70, m0 + 70, m0 + 70], fill=CREME); nd.ellipse([m0 - 58, m0 - 58, m0 + 58, m0 + 58], fill=BRUIN)
nd.ellipse([m0 - 14, m0 - 14, m0 + 14, m0 + 14], fill=(200, 190, 180))
# dikte van de rand (achter het rad, iets verschoven) en slagschaduw op de straat
DIKTE = Image.new('RGBA', (D + 60, D + 60), (0, 0, 0, 0)); ImageDraw.Draw(DIKTE).ellipse([0, 0, D + 20, D + 20], fill=(40, 25, 18, 255))
SCHADUW = Image.new('RGBA', (D + 200, D + 200), (0, 0, 0, 0)); ImageDraw.Draw(SCHADUW).ellipse([100, 100, D + 100, D + 100], fill=(0, 0, 0, 110))
SCHADUW = SCHADUW.filter(ImageFilter.GaussianBlur(30))

def paal(fr, cx):
    d = ImageDraw.Draw(fr)
    d.rounded_rectangle([cx - 20, C[1], cx + 20, 1930], radius=8, fill=(70, 70, 76))
    d.rectangle([cx - 6, C[1], cx + 2, 1930], fill=(140, 140, 150))       # glans
    d.ellipse([cx - 170, 1880, cx + 170, 1960], fill=(55, 55, 60))       # voet

wijzer = Image.new('RGBA', (80, 104), (0, 0, 0, 0))
ImageDraw.Draw(wijzer).polygon([(40, 100), (4, 30), (40, 4), (76, 30)], fill=PINK, outline=WIT, width=6)

# ---------- Rotatie: per frame, met hand-contact in S3
hand3 = json.load(open(os.path.join(WERK, 'hand_S3.json')))
def handpunt(fr):
    best = None
    for h in fr['handen']:
        p = h.get('knokkel') or h.get('midden') or h.get('pols')
        if p and (best is None or p[0] < best[0]): best = p      # de linkerhand in beeld (naar het rad)
    return best
polar = lambda p: math.degrees(math.atan2(p[0] - C[0], -(p[1] - C[1])))

rot = [0.0] * N; xoff = [0.0] * N; v = 0.0; r = 0.0
CONTACT = (START['S3'] + 0.62, START['S3'] + 1.80)
vorige_hoek = None
for i in range(N):
    t = i / FPS
    # S1: rad rolt binnen (2.0-3.3), daarna stil
    if t < 3.3:
        x = min(1, max(0, (t - 2.0) / 1.3)); x = ease_out(x)
        xoff[i] = -900 * (1 - x)
        rot[i] = (900 * x) / R * 180 / math.pi; r = rot[i]; continue     # rollen naar rechts = met de klok mee
    if CONTACT[0] <= t < CONTACT[1]:
        k = min(len(hand3) - 1, int((t - START['S3']) * FPS)); p = handpunt(hand3[k])
        if p and math.dist(p[:2], C) < R * 1.15:
            h = polar(p)
            if vorige_hoek is not None:
                dh = (h - vorige_hoek + 540) % 360 - 180
                r += dh; v = dh * FPS
            vorige_hoek = h
        rot[i] = r; continue
    vorige_hoek = None
    if START['S2'] + 2.6 <= t < START['S2'] + 2.6 + 1 / FPS: v = -760         # zwiep in S2: hand trekt links naar beneden = tegen de klok in
    if t >= CONTACT[1] and t < CONTACT[1] + 1 / FPS: v = -max(abs(v), 1300)  # loslaten in S3: volle vaart dezelfde kant op als haar trek
    if START['S5'] + 1.7 <= t < START['S5'] + 1.7 + 1 / FPS: v = 820         # ineens de andere kant op
    if t < START['S5'] + 1.7: v *= 0.985
    r += v / FPS; rot[i] = r
# laatste stuk: uitremmen tot de winnaar (Mystery FUNky Gift) bovenaan bij de wijzer staat
i_rem = int((START['S5'] + 1.95) * FPS); STOP = START['S6'] + 0.55
r0 = rot[i_rem]; doel = -midden[4]
while doel < r0 + 200: doel += 360
for j in range(i_rem, N):
    t = j / FPS; x = min(1, (t - i_rem / FPS) / (STOP - i_rem / FPS))
    rot[j] = r0 + (doel - r0) * ease_out(x) + (4 * math.sin((t - STOP) * 18) * math.exp(-(t - STOP) * 4) if t > STOP else 0)

# ---------- Teksten (onderin, eigen vlak) en kaarten
def met_vlak(laag, roze):
    laag = laag.crop(laag.getbbox()); pad = 24
    v = Image.new('RGBA', (laag.width + 2 * pad, laag.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(v).rounded_rectangle([0, 0, v.width - 1, v.height - 1], radius=28, fill=(CREME + (242,)) if roze else (BRUIN + (228,)))
    v.alpha_composite(laag, (pad, pad)); return v
T = lambda s, f, z, roze: met_vlak(tekst(s, f, z, PINK if roze else WIT, 820), roze)
TX = {
    'bf': T('BLACK FRIDAY', POP, 92, False), 'funky': T('JUST GOT FUNKY!', MARK, 88, True),
    'geen': T('No discount codes.', POP, 64, False), 'rad': T('We brought a prize wheel!', MARK, 70, True),
    'gratis': T('Free for businesses on Curaçao', POP, 52, False),
    'elke': T('Every spin wins a gift.', POP, 60, False),
    'en1': T('And one business wins', POP, 56, False), 'en2': T('THE ULTIMATE FUNky MAKEOVER', MARK, 62, True),
    'wait': T('Wait. WHAT?', MARK, 96, True), 'wins': T('Everyone wins!', MARK, 104, True),
    'spin': T('SPIN THE WHEEL!', POP, 100, False),
}
def kaart(naam, goud=False):
    lg = tekst(naam, POP, 66 if not goud else 52, BRUIN, 820 if goud else 700)
    lg = lg.crop(lg.getbbox())
    w, h = lg.width + 90, lg.height + (70 if not goud else 90)
    k = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(k)
    d.rounded_rectangle([10, 14, w + 10, h + 14], radius=26, fill=(0, 0, 0, 70))
    d.rounded_rectangle([0, 0, w, h], radius=26, fill=(255, 214, 102) if goud else CREME, outline=PINK, width=8)
    if goud:
        top = tekst('MAIN PRIZE', MARK, 40, PINK, 400); k.alpha_composite(top.crop(top.getbbox()), (36, 10))
    k.alpha_composite(lg, (45, 35 if not goud else 58)); return k
KAART = {n: kaart(n) for n in ['10 Killer Hooks', 'AI Power Pack', 'Content Rescue Kit', '30 Days of Ideas', 'Marketing SOS', 'Mystery FUNky Gift']}
GOUD = kaart('THE ULTIMATE FUNky MAKEOVER', goud=True)
# (start, naam, wachtplek, uitgang). Uitgang 'hoofd' = over haar hoofd, daar duikt ze voor weg.
S2, S3 = START['S2'], START['S3']
# (start, naam, wachtplek, uitgang, wachttijd). Uitgang 'hoofd' = over haar hoofd, op het moment dat ze wegduikt.
VLUCHT = [(S2 + 2.75, '10 Killer Hooks', (560, 1040), 'hoofd', 0.75),     # duik in clip 6722 rond S2 + 3.95
          (S2 + 3.95, 'AI Power Pack', (540, 1060), (1500, 760), 0.75),
          (S2 + 4.95, 'Content Rescue Kit', (540, 1060), (1500, 1250), 0.75),
          (S3 + 1.82, '30 Days of Ideas', (560, 1040), 'hoofd', 0.05),    # duik in clip 6724 rond S3 + 2.1
          (S3 + 2.35, 'Marketing SOS', (540, 1060), (1500, 760), 0.75),
          (S3 + 3.35, 'Mystery FUNky Gift', (540, 1060), (1500, 1250), 0.6)]
BRON_K = (C[0] + 120, C[1] - R + 40)
def vlieg(fr, t):
    for st, naam, wacht, uit, hold in VLUCHT:
        e = t - st
        if e < 0 or e > 0.25 + hold + 0.3: continue
        if e < 0.25: x = ease_out(e / 0.25); pos = (BRON_K[0] + (wacht[0] - BRON_K[0]) * x, BRON_K[1] + (wacht[1] - BRON_K[1]) * x); s = 0.3 + 0.7 * x; rt = 25 * (1 - x)
        elif e < 0.25 + hold: pos = wacht; s = 1.0; rt = -2 + 2 * math.sin(e * 6)
        else:
            x = (e - 0.25 - hold) / 0.3; doel = (900, 260) if uit == 'hoofd' else uit
            pos = (wacht[0] + (doel[0] - wacht[0]) * x * x, wacht[1] + (doel[1] - wacht[1]) * x * x); s = 1 + 0.5 * x; rt = -25 * x
        plak(fr, KAART[naam], pos[0], pos[1], s, rt)

ACHTER = Image.open(os.path.join(WERK, 'bgc12.png')).convert('RGB')
s_ = 2.1; g = ACHTER.resize((int(1080 * s_), int(1920 * s_)), Image.LANCZOS)
x0 = int((g.width - 1080) * 0.25); y0 = int(1125 * s_ - 820)
BG = g.crop((x0, y0, x0 + 1080, y0 + 1920)).filter(ImageFilter.GaussianBlur(4))   # dieptescherpte: straat zachter
BG = ImageEnhance.Brightness(BG).enhance(1.08); BG = ImageEnhance.Color(BG).enhance(1.2).convert('RGBA')
logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((320, int(320 * logo.height / logo.width)), Image.LANCZOS)
EIND_T = {k: tekst(*a) for k, a in {'e1': ('SPIN THE FUN!', POP, 112, WIT, 800), 'e2': ('Free for businesses on Curaçao', INTER, 50, WIT, 780),
          'e3': ('Everyone wins. Until Sunday, Nov 29.', INTER, 48, WIT, 800), 'e4': ('funkiness.ai/black-friday', MARK, 70, PINK, 800)}.items()}
BRON = {n: sorted(os.listdir(os.path.join(WERK, 'f_' + n))) for n, _ in SEG}
LEEG = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))
Y1, Y2 = 1310, 1430

UITF = os.path.join(WERK, 'uit'); shutil.rmtree(UITF, ignore_errors=True); os.makedirs(UITF)
for i in range(N):
    t = i / FPS; sx = sy = 0
    if t < EIND:
        n = [s for s, d in SEG if START[s] <= t < START[s] + d][-1]
        k = min(len(BRON[n]) - 1, int((t - START[n]) * FPS))
        foto = Image.open(os.path.join(WERK, 'f_' + n, BRON[n][k])).convert('RGBA')
        masker = Image.open(os.path.join(WERK, 'm_' + n, BRON[n][k])).convert('L').resize(foto.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
        fr = BG.copy()
        al = 1.0 if t < START['S7'] else max(0, 1 - (t - START['S7']) / 0.3)
        if al > 0:
            cx = C[0] + xoff[i]
            laag = LEEG.copy()
            plak(laag, SCHADUW, cx + 40, C[1] + 55)
            paal(laag, cx)
            plak(laag, DIKTE, cx + 12, C[1] + 12)
            w = WIEL.rotate(-rot[i], resample=Image.BICUBIC); plak(laag, w, cx, C[1])
            # wijzer klikt tegen de pinnen
            fase = (rot[i] % 15) / 15; tik = 14 * max(0, 1 - fase * 5) if abs(rot[i] - rot[max(0, i - 1)]) > 1 else 0
            plak(laag, wijzer.rotate(tik, expand=True, resample=Image.BICUBIC), cx, C[1] - R - 26)
            # schaduw van Daisy op het rad (licht van rechtsboven)
            sch = ImageChops.offset(masker, -34, 26).filter(ImageFilter.GaussianBlur(16))
            sch = ImageChops.multiply(sch, laag.getchannel('A')).point(lambda x: int(x * 0.42))
            donker = Image.new('RGBA', laag.size, (20, 10, 5, 0)); donker.putalpha(sch)
            laag.alpha_composite(donker)
            if al < 1: laag.putalpha(laag.getchannel('A').point(lambda x: int(x * al)))
            fr.alpha_composite(laag)
        fr.alpha_composite(Image.composite(foto, LEEG, masker))
        vlieg(fr, t)
        # gouden kaart (S4): stijgt op uit het rad, Daisy kijkt hem na
        if START['S4'] + 0.6 <= t < START['S5'] + 0.4:
            e = t - START['S4'] - 0.6; x = ease_out(min(1, e / 0.9))
            plak(fr, GOUD, BRON_K[0] + (470 - BRON_K[0]) * x, BRON_K[1] + 300 + (320 - BRON_K[1] - 300) * x, 0.4 + 0.55 * x, 5 * math.sin(e * 3),
                 alpha=1 if t < START['S5'] else max(0, 1 - (t - START['S5']) / 0.4))
        if (START['S2'] + 3.85 <= t < START['S2'] + 4.15) or (START['S3'] + 2.2 <= t < START['S3'] + 2.5) or (START['S5'] + 1.7 <= t < START['S5'] + 2.0):
            sx, sy = int(16 * math.sin(t * 95)), int(12 * math.cos(t * 80))
        # tekst
        def tk(k, y, st, rt=0, sp=1.9): plak(fr, TX[k], 540, y, back((t - st) / 0.3, sp), rt)
        if t < 2.6:
            tk('bf', Y1, 0.0);
            if t > 0.4: tk('funky', Y2, 0.4, 3, 2.4)
        elif t < 6.0:
            if t > 3.0: tk('geen', Y1, 3.0)
            if t > 3.6: tk('rad', Y2, 3.6, -2, 2.4)
        elif t < 11.0:
            if t > 6.3: tk('gratis', Y2, 6.3)
        elif t < 14.4:
            if t > 11.3: tk('elke', Y2, 11.3)
        elif t < 17.4:
            if t > 15.3: tk('en1', Y1, 15.3)
            if t > 15.7: tk('en2', Y2, 15.7, 2, 2.4)
        elif t < 19.7:
            if t > START['S5'] + 1.7: tk('wait', Y2, START['S5'] + 1.7, -4, 2.6)
        elif t < 21.4:
            if t > STOP: tk('wins', Y2, STOP, 3, 2.8)
        else:
            if t > 22.05: tk('spin', Y2, 22.05, 0, 2.4)
    else:
        fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); e = t - EIND; yb = 560
        plak(fr, logo, 540, yb - 30, back(e / 0.4) * 0.9)
        plak(fr, EIND_T['e1'], 540, yb + 230, back((e - 0.15) / 0.35, 2.4))
        plak(fr, EIND_T['e2'], 540, yb + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3)))
        plak(fr, EIND_T['e3'], 540, yb + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
        plak(fr, EIND_T['e4'], 540, yb + 600, back((e - 0.8) / 0.35, 2.2), rot=-2)
    if sx or sy:
        z = 1.04
        fr = fr.transform(fr.size, Image.AFFINE, (1 / z, 0, 540 - 540 / z - sx, 0, 1 / z, 960 - 960 / z - sy), resample=Image.BILINEAR)
    fr.convert('RGB').save(os.path.join(UITF, f'{i:04d}.png'))

naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-founder-PROEF.mp4')
stem = START['S7']
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(UITF, '%04d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-i', os.path.join(WERK, 'S7.mov'),
                '-filter_complex',
                f'[1:a]afade=t=out:st={DUUR - 1.2}:d=1.2,volume=0.85,volume=enable=\'between(t,{stem},{stem + 2.8})\':volume=0.35[m];'
                f'[2:a]volume=2.2,adelay=delays={int(stem * 1000)}:all=1[v];[m][v]amix=inputs=2:duration=first:normalize=0[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                '-c:a', 'aac', '-b:a', '192k', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(UITF)
print(naam, round(DUUR, 2))
