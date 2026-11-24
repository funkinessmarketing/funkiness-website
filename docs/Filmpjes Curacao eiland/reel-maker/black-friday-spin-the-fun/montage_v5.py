# SPIN THE FUN! v5: dezelfde panter in elk shot (Seedance met panter-referentie), opening "Our panther couldn't wait",
# strakkere "Spin the wheel!" (versnelde aanloop, close-up op de zin, muziekaccent, knip op de wijzende vinger).
# Gebruikt de 96 fps-tussenbeelden (met warme look) uit montage_v3 (map <res>/_v3/<clip>_96).
# Gebruik: python3 montage_v4.py <res-map>
import os, sys, json, math, subprocess, shutil, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from build import tekst, plak, back, POP, MARK, INTER, PINK, BRUIN, WIT, ROOT, UIT, MUZIEK

MAP = sys.argv[1]; C = os.path.join(MAP, '_v3'); FPS = 24; HI = 96
POP7 = os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf')
W = os.path.join(MAP, '_v5'); shutil.rmtree(W, ignore_errors=True); os.makedirs(W)
WARM = 'colorbalance=rs=0.05:gs=0.015:bs=-0.07:rm=0.04:bm=-0.04,eq=saturation=1.12:brightness=0.03:contrast=1.04:gamma=1.05'
def hi(c):
    d = os.path.join(C, c + '_96')
    if not os.path.isdir(d) or not os.listdir(d):
        os.makedirs(d, exist_ok=True)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(MAP, f'print_{c}.mp4'), '-vf',
                        f'minterpolate=fps={HI}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,' + WARM, os.path.join(d, '%05d.png')], check=True)
    return sorted(os.listdir(d))
FL = {c: hi(c) for c in ['panter_open', 'p_spin', 'p_confetti', 'p_stop', 'panter_eind']}
def rot(c):
    j = os.path.join(MAP, f'print_{c}.mp4.json'); return json.load(open(j))['delta'] if os.path.exists(j) else None

# (clip, [(van, tot, snelheid)], ondertitel-sleutel, uitsnede (cx, cy, zoom) of None)
DEEL = [
    ('panter_open', [(0.0, 0.9, 0.5), (0.9, 3.4, 1.0)], 'open', None),
    ('p_spin', [(0.1, 1.6, 1.2), (1.6, 2.5, 0.4), (2.5, 3.7, 1.5)], 'gratis', None),     # aai, greep, zwiep: slow-mo als jullie wegduiken
    ('p_confetti', [(0.2, 1.3, 1.0), (1.3, 2.4, 0.45), (2.4, 3.4, 1.0)], 'gift', None), # slow-mo op de poot naar de confetti
    ('p_stop', [(0.8, 3.9, 1.0)], 'wins', None),
    ('panter_eind', [(0.6, 1.6, 1.5)], 'spin', None),
    ('panter_eind', [(1.6, 2.35, 1.0)], 'spin', None),
    ('panter_eind', [(2.35, 3.15, 1.0)], 'spin', (470, 1090, 1.15)),   # lichte push-in, panter blijft in beeld
]
STEM_VAN = 1.6   # vanaf hier loopt panter_eind op normale snelheid met Daisy's eigen stem
EIND_T = 3.6

def ondertitel(regel, size=50):
    font = ImageFont.truetype(POP7, size)
    w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    while w > 860: font = ImageFont.truetype(POP7, font.size - 2); w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    im = Image.new('RGBA', (w + 60, font.size + 70), (0, 0, 0, 0))
    sch = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sch).text((30, 30), regel, font=font, fill=(0, 0, 0, 180))
    im.alpha_composite(sch.filter(ImageFilter.GaussianBlur(6))); ImageDraw.Draw(im).text((30, 28), regel, font=font, fill=WIT)
    return im
OT = {'gratis': [ondertitel('FREE FOR BUSINESSES ON CURAÇAO')], 'gift': [ondertitel('EVERY SPIN WINS A MARKETING GIFT')],
      'wins': [ondertitel('EVERYONE WINS!', 64)], 'spin': [ondertitel('SPIN THE WHEEL!', 64)],
      'open': [ondertitel('BLACK FRIDAY ON CURAÇAO?', 54), ondertitel("OUR PANTHER COULDN'T WAIT.", 54)]}

frames = []; rpf = []; t = 0.0; ot_start = {}; ev = []
for clip, stukken, ot, crop in DEEL:
    ot_start.setdefault(ot, t); r = rot(clip)
    for (a, b, v) in stukken:
        if clip == 'panter_eind' and a == STEM_VAN: stem_t = t
        n = int(round((b - a) / v * FPS))
        if v < 0.6: ev.append((t, 'whoosh_slow'))
        for k in range(n):
            src = a + k * v / FPS; idx = min(len(FL[clip]) - 1, int(src * HI))
            frames.append((os.path.join(C, clip + '_96', FL[clip][idx]), ot, t + k / FPS - ot_start[ot], crop))
            rpf.append(abs(r[min(len(r) - 1, int(src * 24))]) * v if r else 0)
        t += n / FPS
    if clip == 'p_spin': ev.append((t - 2.6, 'whoosh'))
    if clip == 'p_confetti': ev.append((t - 4.3, 'confetti'))
punt_t = t   # knip op de wijzende vinger
ev.append((punt_t - 0.05, 'boem'))

logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((340, int(340 * logo.height / logo.width)), Image.LANCZOS)
E = {'e1': tekst('SPIN THE FUN!', POP, 112, WIT, 800), 'e2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
     'e3': tekst('Everyone wins. Until Sunday, Nov 29.', INTER, 48, WIT, 800), 'e4': tekst('funkiness.ai/black-friday', MARK, 74, PINK, 860), 'e5': tekst('Spin online:', INTER, 50, WIT, 600)}
for k in range(int(EIND_T * FPS)):
    e = k / FPS; fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); yb = 560
    plak(fr, logo, 540, yb - 30, back(e / 0.4) * 0.9); plak(fr, E['e1'], 540, yb + 230, back((e - 0.15) / 0.35, 2.4))
    plak(fr, E['e2'], 540, yb + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3))); plak(fr, E['e3'], 540, yb + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
    plak(fr, E['e5'], 540, yb + 580, 1, alpha=min(1, max(0, (e - 0.75) / 0.3)))
    plak(fr, E['e4'], 540, yb + 670, back((e - 0.9) / 0.35, 2.2), rot=-2)
    p = os.path.join(W, f'eind{k:04d}.png'); fr.convert('RGB').save(p); frames.append((p, None, 0, None)); rpf.append(0)
DUUR = len(frames) / FPS

OUT = os.path.join(W, 'uit'); os.makedirs(OUT)
for i, (p, ot, age, crop) in enumerate(frames):
    fr = Image.open(p).convert('RGB')
    if crop:
        cx, cy, z = crop; w, h = int(1080 / z), int(1920 / z)
        x0 = int(min(max(cx - w / 2, 0), 1080 - w)); y0 = int(min(max(cy - h / 2, 0), 1920 - h))
        fr = fr.crop((x0, y0, x0 + w, y0 + h)).resize((1080, 1920), Image.LANCZOS)
    fr = fr.convert('RGBA')
    if ot and age > 0.1:
        regels = OT[ot]
        plak(fr, regels[0], 540, 1300 if len(regels) > 1 else 1330, min(1, 0.9 + (age - 0.1) * 0.5), alpha=min(1, (age - 0.1) / 0.2))
        if len(regels) > 1 and age > 1.3:
            plak(fr, regels[1], 540, 1400, back((age - 1.3) / 0.25, 2.2))
    fr.convert('RGB').save(os.path.join(OUT, f'{i:05d}.png'))

# ---------- geluid
SR = 48000; L = int(DUUR * SR) + SR; fx = np.zeros(L); rng = np.random.default_rng(7)
def zet(tt, sig, vol=1.0):
    i = int(tt * SR); j = min(L, i + len(sig)); fx[i:j] += sig[:j - i] * vol
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def whoosh(d=0.55, lo=300, hi=3000):
    n = int(d * SR); return bp(rng.standard_normal(n), lo, hi) * np.sin(np.linspace(0, math.pi, n)) ** 2 * 0.5
def tik():
    n = int(0.012 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * math.pi * 2600 * tt) * np.exp(-tt * 500) + 0.4 * rng.standard_normal(n) * np.exp(-tt * 900)) * 0.35
def confetti():
    n = int(0.9 * SR); tt = np.arange(n) / SR
    return np.sin(2 * math.pi * 90 * tt) * np.exp(-tt * 18) * 0.9 + bp(rng.standard_normal(n), 2000, 8000) * np.exp(-tt * 12) * 0.3
def boem():
    n = int(0.8 * SR); tt = np.arange(n) / SR
    return np.sin(2 * math.pi * (60 + 40 * np.exp(-tt * 20)) * tt) * np.exp(-tt * 6) * 1.0 + bp(rng.standard_normal(n), 200, 4000) * np.exp(-tt * 25) * 0.4
for tt, s in ev:
    zet(tt, {'whoosh': whoosh(), 'whoosh_slow': whoosh(1.2, 150, 1500), 'confetti': confetti(), 'boem': boem()}[s], 0.8)
acc = 0.0
for i, dg in enumerate(rpf):
    if dg <= 0: continue
    acc += dg
    while acc >= 15: acc -= 15; zet(i / FPS + rng.random() / FPS, tik(), 0.6 if dg < 30 else 0.35)
fx = np.clip(fx, -1, 1); wav = os.path.join(W, 'fx.wav')
with wave.open(wav, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((fx * 32000).astype(np.int16).tobytes())

naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-black-friday.mp4')
stem_dur = punt_t - stem_t + 0.3
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(OUT, '%05d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-i', wav, '-ss', str(2.5 + STEM_VAN), '-t', str(stem_dur), '-i', os.path.expanduser('~/Downloads/IMG_6727.MOV'),
                '-filter_complex',
                # muziek valt even weg vlak voor de zin (spanning), klap op de vinger, daarna weer vol onder de eindkaart
                f'[1:a]afade=t=in:st=0:d=0.2,volume=enable=\'between(t,{stem_t - 0.2},{punt_t})\':volume=0.12,'
                f'afade=t=out:st={DUUR - 1.5}:d=1.5,volume=0.8[m];[2:a]aformat=channel_layouts=stereo[f];'
                f'[3:a]afade=t=in:st=0:d=0.05,afade=t=out:st={stem_dur - 0.2}:d=0.2,volume=2.4,adelay=delays={int(stem_t * 1000)}:all=1[v];'
                f'[m][f][v]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-r', str(FPS),
                '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(W)
print(naam, round(DUUR, 1), 'stem op', round(stem_t, 2), 'knip op', round(punt_t, 2))
