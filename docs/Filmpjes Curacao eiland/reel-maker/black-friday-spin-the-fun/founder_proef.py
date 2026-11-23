# SPIN THE FUN!: video met de oprichter, PROEF zonder AI-credits.
# Daisy uitgeknipt (macOS Vision, seg.swift) voor de Breedestraat in Otrobanda; het rad staat ACHTER haar
# en draait mee met haar armbeweging. Jurk nog origineel (panterprint volgt na GO).
# Bron: IMG_6720/6724/6726/6719/6727 (23-11-2026) via avconvert naar SDR in WERK: A..E.mov, frames f_X, maskers m_X, bg34.png
# Gebruik: python3 founder_proef.py <werkmap>
import math, os, subprocess, shutil, sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from build import maak_wiel, tekst, plak, back, ease_out, POP, MARK, INTER, PINK, BRUIN, WIT, CREME, ROOT, UIT, MUZIEK

WERK = sys.argv[1]
FPS = 30
SEG = [('A', 2.0), ('B', 3.4), ('C', 2.3), ('D', 1.6), ('E', 2.8)]
START = {}; t0 = 0
for n, d in SEG: START[n] = t0; t0 += d
EIND = t0; DUUR = EIND + 3.5
WIN = 4                              # Mystery FUNky Gift
R = 560; D = 2 * R; WC = (-80, 640)   # groot rad links achter Daisy; bovenrand bij haar opgestoken hand
WIJZER_HOEK = 45                     # wijzer rechtsboven op de rand

# Achtergrond: Breedestraat, Otrobanda (motorkap van de Jeep eruit, horizon op borsthoogte)
bron = Image.open(os.path.join(WERK, 'bgc12.png')).convert('RGB')   # Breedestraat, 30 s in de rit
s = 2.1; groot = bron.resize((int(bron.width * s), int(bron.height * s)), Image.LANCZOS)
x0 = int((groot.width - 1080) * 0.25); y0 = int(1125 * s - 820)
BG = groot.crop((x0, y0, x0 + 1080, y0 + 1920)).filter(ImageFilter.GaussianBlur(2.2))
BG = ImageEnhance.Brightness(BG).enhance(1.08); BG = ImageEnhance.Color(BG).enhance(1.2)
BG = BG.convert('RGBA')

wiel, midden = maak_wiel(D)

# Rotatie (graden met de klok mee), afgestemd op Daisy's armbeweging:
#   2.0-3.6 hand omhoog en vasthouden, 3.6-4.0 trekt ze naar beneden = rad gaat draaien,
#   4.0 duikt ze weg (rad springt naar haar toe), daarna kijkt ze het na, 7.1 draait het ineens terug, 8.45 stil.
def snelheid(t):
    if t < 2.55: return 0
    if t < 3.6: return 6 * math.sin((t - 2.55) * 9)
    if t < 4.0: return 1250 * ((t - 3.6) / 0.4) ** 0.7
    if t < 7.1: return 1250 - 950 * (t - 4.0) / 3.1
    return None
STOP = 8.45
N = int(DUUR * FPS)
rot = {}; r = 0; i = 0
for i in range(N):
    v = snelheid(i / FPS)
    if v is None: break
    rot[i] = r; r += v / FPS
i_los, r0 = i, r
doel = WIJZER_HOEK - midden[WIN]
while doel > r0 - 420: doel -= 360        # terug tegen de klok in, dan stil op de winnaar
for j in range(i_los, N):
    t = j / FPS
    x = min(1, (t - 7.1) / (STOP - 7.1))
    rot[j] = r0 + (doel - r0) * ease_out(x) + (4 * math.sin((t - STOP) * 18) * math.exp(-(t - STOP) * 4) if t > STOP else 0)

# Wijzer op de rand, punt naar het midden
wijzer = Image.new('RGBA', (80, 104), (0, 0, 0, 0))
ImageDraw.Draw(wijzer).polygon([(40, 100), (4, 30), (40, 4), (76, 30)], fill=PINK, outline=WIT, width=6)
wijzer = wijzer.rotate(-WIJZER_HOEK, expand=True, resample=Image.BICUBIC)
a = math.radians(WIJZER_HOEK); WP = (WC[0] + (R + 18) * math.sin(a), WC[1] - (R + 18) * math.cos(a))

L = {
    'bf': tekst('BLACK FRIDAY', POP, 96, WIT, 780),
    'funky': tekst('JUST GOT FUNKY!', MARK, 92, PINK, 800),
    'win': tekst('Win something awesome.', POP, 60, WIT, 800),
    'wait': tekst('Wait. WHAT?', MARK, 96, PINK, 780),
    'wins': tekst('Everyone wins!', MARK, 104, PINK, 780),
    'spin': tekst('SPIN THE WHEEL!', POP, 100, WIT, 800),
    'eind1': tekst('SPIN THE FUN!', POP, 112, WIT, 800),
    'eind2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
    'eind3': tekst('Until Sunday, November 29', INTER, 50, WIT, 780),
    'eind4': tekst('funkiness.ai/black-friday', MARK, 70, PINK, 800),
}
def met_vlak(laag, roze):
    laag = laag.crop(laag.getbbox()); pad = 26
    v = Image.new('RGBA', (laag.width + 2 * pad, laag.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(v).rounded_rectangle([0, 0, v.width - 1, v.height - 1], radius=30, fill=(CREME + (240,)) if roze else (BRUIN + (225,)))
    v.alpha_composite(laag, (pad, pad)); return v
VL = {k: met_vlak(L[k], k in {'funky', 'wait', 'wins'}) for k in ['bf', 'funky', 'win', 'wait', 'wins', 'spin']}
tk = lambda fr, k, cx, cy, s=1.0, rot=0, alpha=1.0: plak(fr, VL[k], cx, cy, s, rot, alpha)

logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((320, int(320 * logo.height / logo.width)), Image.LANCZOS)
BRON = {n: sorted(os.listdir(os.path.join(WERK, 'f_' + n))) for n, _ in SEG}
LEEG = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0))

UITF = os.path.join(WERK, 'uit'); shutil.rmtree(UITF, ignore_errors=True); os.makedirs(UITF)
Y1, Y2 = 1300, 1420
for i in range(N):
    t = i / FPS
    sx = sy = 0
    if t < EIND:
        n = [s for s, d in SEG if START[s] <= t < START[s] + d][-1]
        k = min(len(BRON[n]) - 1, int((t - START[n]) * FPS))
        foto = Image.open(os.path.join(WERK, 'f_' + n, BRON[n][k])).convert('RGBA')
        masker = Image.open(os.path.join(WERK, 'm_' + n, BRON[n][k])).convert('L').resize(foto.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
        fr = BG.copy()
        al = 1.0 if t < START['E'] else max(0, 1 - (t - START['E']) / 0.3)
        sprong = 55 * math.exp(-(t - 4.0) * 5) if t >= 4.0 else 0
        if al > 0:
            plak(fr, wiel.rotate(-rot[i], resample=Image.BICUBIC), WC[0] + sprong, WC[1], 1, alpha=al)
            plak(fr, wijzer, WP[0] + sprong, WP[1], 1, alpha=al)
        fr.alpha_composite(Image.composite(foto, LEEG, masker))
        if 4.0 <= t < 4.3 or 7.1 <= t < 7.4: sx, sy = int(16 * math.sin(t * 95)), int(12 * math.cos(t * 80))
        if t < 2.0:
            tk(fr, 'bf', 540, Y1, back(t / 0.3))
            if t > 0.5: tk(fr, 'funky', 540, Y2, back((t - 0.5) / 0.3, 2.4), rot=3)
        elif t < 5.4:
            if t > 4.2: tk(fr, 'win', 540, Y2, back((t - 4.2) / 0.3))
        elif t < 7.7:
            if t > 7.1: tk(fr, 'wait', 540, Y2, back((t - 7.1) / 0.25, 2.6), rot=-4)
        elif t < 9.3:
            if t > STOP: tk(fr, 'wins', 540, Y2, back((t - STOP) / 0.3, 2.8), rot=3)
        else:
            if t > 9.95: tk(fr, 'spin', 540, Y2, back((t - 9.95) / 0.25, 2.4))
    else:
        fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); e = t - EIND; y0 = 560
        plak(fr, logo, 540, y0 - 30, back(e / 0.4) * 0.9)
        plak(fr, L['eind1'], 540, y0 + 230, back((e - 0.15) / 0.35, 2.4))
        plak(fr, L['eind2'], 540, y0 + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3)))
        plak(fr, L['eind3'], 540, y0 + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
        plak(fr, L['eind4'], 540, y0 + 600, back((e - 0.8) / 0.35, 2.2), rot=-2)
    if sx or sy:
        z = 1.04
        fr = fr.transform(fr.size, Image.AFFINE, (1 / z, 0, 540 - 540 / z - sx, 0, 1 / z, 960 - 960 / z - sy), resample=Image.BILINEAR)
    fr.convert('RGB').save(os.path.join(UITF, f'{i:04d}.png'))

naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-founder-PROEF.mp4')
stem = START['E']
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(UITF, '%04d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-i', os.path.join(WERK, 'E.mov'),
                '-filter_complex',
                f'[1:a]afade=t=out:st={DUUR - 1.2}:d=1.2,volume=0.85,volume=enable=\'between(t,{stem},{stem + 2.8})\':volume=0.35[m];'
                f'[2:a]volume=2.2,adelay=delays={int(stem * 1000)}:all=1[v];[m][v]amix=inputs=2:duration=first:normalize=0[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                '-c:a', 'aac', '-b:a', '192k', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(UITF)
print(naam, DUUR)
