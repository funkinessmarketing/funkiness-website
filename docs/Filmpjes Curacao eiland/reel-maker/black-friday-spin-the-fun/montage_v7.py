# SPIN THE FUN! v6: vloeiend. Opening touwtrekken met de panter, dezelfde panter in elk shot.
# Vloeiend door: snelheid als zachte curve (geen sprongen), korte overvloeiers op de knippen,
# een langzame "cameraman"-beweging (push-in + drift) over elk shot, en Daisy's eigen stem aan het eind.
# Gebruik: python3 montage_v6.py <res-map>   (gebruikt print_<clip>.mp4 en de 96 fps-cache in <res>/_v3)
import os, sys, json, math, subprocess, shutil, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from build import tekst, plak, back, POP, MARK, INTER, PINK, BRUIN, WIT, ROOT, UIT, MUZIEK

MAP = sys.argv[1]; C = os.path.join(MAP, '_v3'); FPS = 24; HI = 96
POP7 = os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf')
WARM = 'colorbalance=rs=0.05:gs=0.015:bs=-0.07:rm=0.04:bm=-0.04,eq=saturation=1.12:brightness=0.03:contrast=1.04:gamma=1.05'
W = os.path.join(MAP, '_v7'); shutil.rmtree(W, ignore_errors=True); os.makedirs(W)

def hi(c):
    d = os.path.join(C, c + '_96')
    if not os.path.isdir(d) or not os.listdir(d):
        os.makedirs(d, exist_ok=True)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(MAP, f'print_{c}.mp4'), '-vf',
                        f'minterpolate=fps={HI}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,' + WARM, os.path.join(d, '%05d.png')], check=True)
    return sorted(os.listdir(d))

# (clip, bron-begin, bron-eind, snelheidscurve [(brontijd, snelheid)], ondertitel, camera (zoom-start, zoom-eind, drift-x))
SHOTS = [
    ('p_tug',       0.15, 3.95, [(0.15, 1.1), (2.6, 1.0), (3.0, 0.55), (3.5, 0.6), (3.95, 1.0)], 'open',   (1.00, 1.06, -12)),
    ('panter_open', 0.05, 1.0,  [(0.05, 1.0), (1.0, 1.0)],                                        'rad',    (1.15, 1.22, -110)),  # 1 mep, ingezoomd op de panter
    ('p_spin',      0.3,  3.8,  [(0.3, 1.15), (1.5, 1.0), (1.9, 0.5), (2.5, 0.55), (3.0, 1.1), (3.8, 1.2)], 'gratis', (1.00, 1.05, -8)),
    ('p_confetti',  0.2,  3.6,  [(0.2, 1.0), (1.2, 0.8), (1.6, 0.5), (2.4, 0.6), (3.6, 1.0)],       'gift',   (1.05, 1.00, 8)),
    ('p_schrik',    1.05, 3.8,  [(1.05, 1.0), (1.25, 0.55), (1.8, 0.6), (2.2, 1.0), (3.8, 1.0)],   'pas',    (1.00, 1.07, 20)),
    ('p_stop',      1.3,  2.75, [(1.3, 1.0), (2.75, 1.0)],                                          'wins',   (1.06, 1.03, 0)),
    ('p_stop',      2.6,  3.95, [(2.6, 1.0), (3.95, 0.8)],                                          'spin',   (1.03, 1.15, 0)),  # eindbeeld met grote tekst
]
XF = 4            # overvloeier in frames
EIND_T = 3.6

def curve(pts, t):
    for (t0, v0), (t1, v1) in zip(pts, pts[1:]):
        if t0 <= t <= t1:
            x = (t - t0) / (t1 - t0); x = 0.5 - 0.5 * math.cos(math.pi * x); return v0 + (v1 - v0) * x
    return pts[-1][1]

def bronlijst(a, b, pts):
    t, lst = a, []
    while t < b:
        lst.append(t); t += curve(pts, t) / FPS
    return lst

def ondertitel(regel, size=50):
    font = ImageFont.truetype(POP7, size)
    w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    while w > 860: font = ImageFont.truetype(POP7, font.size - 2); w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    im = Image.new('RGBA', (w + 60, font.size + 70), (0, 0, 0, 0))
    sch = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sch).text((30, 30), regel, font=font, fill=(0, 0, 0, 180))
    im.alpha_composite(sch.filter(ImageFilter.GaussianBlur(6))); ImageDraw.Draw(im).text((30, 28), regel, font=font, fill=WIT)
    return im
OT = {'open': [ondertitel('BLACK FRIDAY ON CURAÇAO', 54), ondertitel('EVERYBODY WANTS A SPIN!', 60)],
      'rad': [ondertitel('NO DISCOUNT CODES. A PRIZE WHEEL.')],
      'gratis': [ondertitel('FREE FOR BUSINESSES ON CURAÇAO')],
      'gift': [ondertitel('EVERY SPIN WINS A MARKETING GIFT')], 'pas': [ondertitel('WATCH OUT FOR THE PANTHER!', 58)],
      'wins': [ondertitel('EVERYONE WINS!', 64)], 'spin': [ondertitel('SPIN THE WHEEL!', 96)]}

def rot(c):
    j = os.path.join(MAP, f'print_{c}.mp4.json'); return json.load(open(j))['delta'] if os.path.exists(j) else None

def camera(img, z, dx):
    w, h = int(1080 / z), int(1920 / z)
    x0 = int((1080 - w) / 2 + dx); y0 = int((1920 - h) * 0.45)
    x0 = max(0, min(1080 - w, x0)); return img.crop((x0, y0, x0 + w, y0 + h)).resize((1080, 1920), Image.BICUBIC)

# per shot de frames (pad, ondertitel, leeftijd, camera)
shots = []; tik_rot = []
for clip, a, b, pts, ot, (z0, z1, dx) in SHOTS:
    fl = hi(clip); r = rot(clip); src = bronlijst(a, b, pts); n = len(src); fr = []
    for k, s in enumerate(src):
        x = k / max(1, n - 1); x = 0.5 - 0.5 * math.cos(math.pi * x)
        fr.append((os.path.join(C, clip + '_96', fl[min(len(fl) - 1, int(s * HI))]), ot, k / FPS,
                   (z0 + (z1 - z0) * x, dx * (x - 0.5) * 2)))
        tik_rot.append(abs(r[min(len(r) - 1, int(s * 24))]) * curve(pts, s) if r else 0)
    shots.append((clip, fr, src))

# aaneenrijgen met overvloeiers
seq = []   # lijst van (frameA, frameB of None, mengfactor)
for i, (clip, fr, src) in enumerate(shots):
    if i == 0: seq += [(f, None, 0) for f in fr]; continue
    for k in range(XF):   # laatste XF frames van vorig shot mengen met eerste XF van dit shot
        a_ = seq[-XF + k][0]; seq[-XF + k] = (a_, fr[k], (k + 1) / (XF + 1))
    seq += [(f, None, 0) for f in fr[XF:]]
tik_rot = tik_rot[:len(seq)]
punt_t = len(seq) / FPS

def render(f):
    p, ot, age, (z, dx) = f
    return camera(Image.open(p).convert('RGB'), z, dx), ot, age

OUT = os.path.join(W, 'uit'); os.makedirs(OUT); i = 0
for fa, fb, m in seq:
    A, ot, age = render(fa)
    if fb:
        B, otb, ageb = render(fb); A = Image.blend(A, B, m)
        if m > 0.5: ot, age = otb, ageb
    fr = A.convert('RGBA')
    if ot and age > 0.1:
        rg = OT[ot]
        plak(fr, rg[0], 540, 1300 if len(rg) > 1 else 1330, min(1, 0.9 + (age - 0.1) * 0.5), alpha=min(1, (age - 0.1) / 0.2))
        if len(rg) > 1 and age > 1.2: plak(fr, rg[1], 540, 1405, back((age - 1.2) / 0.3, 2.2), rot=-2)
    fr.convert('RGB').save(os.path.join(OUT, f'{i:05d}.png')); i += 1

logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((340, int(340 * logo.height / logo.width)), Image.LANCZOS)
E = {'e1': tekst('SPIN THE FUN!', POP, 112, WIT, 800), 'e2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
     'e3': tekst('Everyone wins. Until Sunday, Nov 29.', INTER, 48, WIT, 800), 'e5': tekst('Spin online:', INTER, 50, WIT, 600),
     'e4': tekst('funkiness.ai/black-friday', MARK, 74, PINK, 860)}
for k in range(int(EIND_T * FPS)):
    e = k / FPS; fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); yb = 560
    plak(fr, logo, 540, yb - 30, back(e / 0.4) * 0.9); plak(fr, E['e1'], 540, yb + 230, back((e - 0.15) / 0.35, 2.4))
    plak(fr, E['e2'], 540, yb + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3))); plak(fr, E['e3'], 540, yb + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
    plak(fr, E['e5'], 540, yb + 580, 1, alpha=min(1, max(0, (e - 0.75) / 0.3))); plak(fr, E['e4'], 540, yb + 670, back((e - 0.9) / 0.35, 2.2), rot=-2)
    fr.convert('RGB').save(os.path.join(OUT, f'{i:05d}.png')); i += 1; tik_rot.append(0)
DUUR = i / FPS

# geluid: tikkend rad, whooshes op de zwiepen, confetti, klap op de wijzende vinger
SR = 48000; L = int(DUUR * SR) + SR; fx = np.zeros(L); rng = np.random.default_rng(7)
def zet(tt, sig, vol=1.0):
    a = int(tt * SR); b_ = min(L, a + len(sig)); fx[a:b_] += sig[:b_ - a] * vol
def bp(x, lo, hi_):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi_)] = 0; return np.fft.irfft(X, len(x))
def whoosh(d=0.6): n = int(d * SR); return bp(rng.standard_normal(n), 250, 2500) * np.sin(np.linspace(0, math.pi, n)) ** 2 * 0.5
def tik():
    n = int(0.012 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * math.pi * 2600 * tt) * np.exp(-tt * 500) + 0.4 * rng.standard_normal(n) * np.exp(-tt * 900)) * 0.35
def confetti():
    n = int(0.9 * SR); tt = np.arange(n) / SR
    return np.sin(2 * math.pi * 90 * tt) * np.exp(-tt * 18) * 0.9 + bp(rng.standard_normal(n), 2000, 8000) * np.exp(-tt * 12) * 0.3
def boem():
    n = int(0.8 * SR); tt = np.arange(n) / SR
    return np.sin(2 * math.pi * (60 + 40 * np.exp(-tt * 20)) * tt) * np.exp(-tt * 6) + bp(rng.standard_normal(n), 200, 4000) * np.exp(-tt * 25) * 0.4
start = 0.0
for clip, fr, src in shots:
    if clip in ('p_tug', 'p_spin'): zet(start + len(fr) / FPS * 0.62, whoosh(), 0.8)
    if clip == 'panter_open': zet(start + 0.35, whoosh(0.4), 0.7)
    if clip == 'p_confetti': zet(start + 0.1, confetti(), 0.8)
    start += (len(fr) - XF) / FPS
zet(punt_t - 0.05, boem(), 0.8)
acc = 0.0
for k, dg in enumerate(tik_rot):
    if dg <= 0: continue
    acc += dg
    while acc >= 15: acc -= 15; zet(k / FPS + rng.random() / FPS, tik(), 0.6 if dg < 30 else 0.35)
fx = np.clip(fx, -1, 1); wav = os.path.join(W, 'fx.wav')
with wave.open(wav, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((fx * 32000).astype(np.int16).tobytes())

naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-black-friday.mp4')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(OUT, '%05d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-i', wav,
                '-filter_complex',
                f'[1:a]afade=t=in:st=0:d=0.2,afade=t=out:st={DUUR - 1.5}:d=1.5,volume=0.85[m];[2:a]aformat=channel_layouts=stereo[f];'
                f'[m][f]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                '-map', '0:v', '-map', '[a]', '-vf', 'vibrance=intensity=0.35,eq=saturation=1.08:contrast=1.05', '-c:v', 'libx264',
                '-pix_fmt', 'yuv420p', '-crf', '17', '-r', str(FPS),
                '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(W)
print(naam, round(DUUR, 1))
