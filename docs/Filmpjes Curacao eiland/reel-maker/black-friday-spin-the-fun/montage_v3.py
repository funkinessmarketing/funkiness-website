# SPIN THE FUN! v3: cold open "Yep. That's me.", panter, speed ramps + slow-mo (frame-interpolatie), prijzen op het rad,
# geluid in lagen (muziek, tikkend rad, whoosh, plaatkras, terugspoelen, confetti, Daisy's eigen stem), -14 LUFS, 24 fps.
# Gebruik: python3 montage_v3.py <map met print_*.mp4 en *.json>
import os, sys, json, subprocess, shutil, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from build import tekst, plak, back, POP, MARK, INTER, PINK, BRUIN, WIT, ROOT, UIT, MUZIEK

MAP = sys.argv[1]; FPS = 24; HI = 96
# zonnige, warme look (niet grauw): iets warmer, levendiger, lichte middentonen
WARM = 'colorbalance=rs=0.05:gs=0.015:bs=-0.07:rm=0.04:bm=-0.04,eq=saturation=1.12:brightness=0.03:contrast=1.04:gamma=1.05'
POP7 = os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf')
W = os.path.join(MAP, '_v3'); os.makedirs(W, exist_ok=True)
for oud in ('uit',): shutil.rmtree(os.path.join(W, oud), ignore_errors=True)

def hi(naam):
    """96 fps-versie (bewegingsinterpolatie) voor vloeiende slow-mo."""
    uit = os.path.join(W, naam + '_96')
    if not os.path.isdir(uit):
        os.makedirs(uit)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', os.path.join(MAP, f'print_{naam}.mp4'), '-vf',
                        f'minterpolate=fps={HI}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,' + WARM,
                        os.path.join(uit, '%05d.png')], check=True)
    return uit, sorted(os.listdir(uit))

# (clip, [(van, tot, snelheid), ...], ondertitel)
DEEL = [
    ('doos', [(0.55, 1.15, 1.0)], None),
    ('FREEZE', None, None),
    ('panter_open', [(0.0, 0.9, 0.5), (0.9, 3.6, 1.0)], 'NO DISCOUNT CODES. A PRIZE WHEEL.'),
    ('shot3', [(0.3, 1.5, 1.3), (1.5, 2.3, 0.4), (2.3, 3.6, 1.6)], 'FREE FOR BUSINESSES ON CURAÇAO'),
    ('shot2', [(0.3, 1.2, 1.5), (1.2, 1.7, 0.5), (1.7, 2.6, 1.5)], 'EVERY SPIN WINS A MARKETING GIFT'),
    ('shot4', [(0.3, 2.8, 0.6)], 'EVERY SPIN WINS A MARKETING GIFT'),
    ('doos', [(0.3, 0.85, 1.0), (0.85, 1.5, 0.35), (1.5, 2.4, 1.2)], 'WATCH OUT FOR FLYING GIFTS!'),
    ('shot6', [(1.0, 4.0, 1.0)], 'EVERYONE WINS!'),
    ('panter_eind', [(0.0, 4.7, 1.0)], 'SPIN THE WHEEL!'),
]
FREEZE_T = 2.2; REWIND_T = 0.45; EIND_T = 3.5

def ondertitel(regel, size=50):
    font = ImageFont.truetype(POP7, size)
    w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    while w > 860: font = ImageFont.truetype(POP7, font.size - 2); w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    im = Image.new('RGBA', (w + 60, font.size + 70), (0, 0, 0, 0))
    sch = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sch).text((30, 30), regel, font=font, fill=(0, 0, 0, 180))
    im.alpha_composite(sch.filter(ImageFilter.GaussianBlur(6))); ImageDraw.Draw(im).text((30, 28), regel, font=font, fill=WIT)
    return im

frames = []          # (pad of PIL-image, ondertitel-object, leeftijd ondertitel)
events = []          # (tijd, soort) voor het geluid
rot_per_frame = []   # graden per uitvoerframe (voor tikkende pinnen)
def rotatie(naam):
    j = os.path.join(MAP, f'print_{naam}.mp4.json')
    return json.load(open(j))['delta'] if os.path.exists(j) else None

t_uit = 0.0; ot_cache = {}; vorige_ot = None; ot_start = 0
for clip, stukken, regel in DEEL:
    if clip == 'FREEZE':
        laatste = frames[-1][0]; im = Image.open(laatste).convert('RGB')
        events.append((t_uit, 'kras'))
        for k in range(int(FREEZE_T * FPS)):
            z = 1 + 0.06 * k / (FREEZE_T * FPS)        # langzame push-in op het bevroren beeld
            fr = im.resize((int(1080 * z), int(1920 * z)), Image.LANCZOS); x = (fr.width - 1080) // 2; y = int((fr.height - 1920) * 0.35)
            p = os.path.join(W, f'fz{k:04d}.png'); fr.crop((x, y, x + 1080, y + 1920)).save(p)
            frames.append((p, 'FREEZE', k / FPS)); rot_per_frame.append(0)
        t_uit += FREEZE_T; continue
    if clip == 'REWIND':
        d, fl = hi('doos'); events.append((t_uit, 'rewind'))
        n = int(REWIND_T * FPS)
        for k in range(n):
            src = 1.15 * (1 - k / (n - 1)); idx = min(len(fl) - 1, int(src * HI))
            frames.append((os.path.join(d, fl[idx]), None, 0)); rot_per_frame.append(0)
        t_uit += REWIND_T; continue
    d, fl = hi(clip); rot = rotatie(clip)
    if regel != vorige_ot: ot_start = t_uit; vorige_ot = regel
    for (a, b, v) in stukken:
        n = int(round((b - a) / v * FPS))
        if v < 0.6: events.append((t_uit, 'whoosh_slow'))
        for k in range(n):
            src = a + k * v / FPS; idx = min(len(fl) - 1, int(src * HI))
            frames.append((os.path.join(d, fl[idx]), regel, t_uit + k / FPS - ot_start))
            if rot:
                i24 = min(len(rot) - 1, int(src * 24)); rot_per_frame.append(abs(rot[i24]) * v)
            else: rot_per_frame.append(0)
        t_uit += n / FPS
    if clip in ('shot3', 'shot2'): events.append((t_uit - 2.0, 'whoosh'))
    if clip == 'shot4': events.append((t_uit - 4.0, 'confetti'))
    if clip == 'doos' and regel: events.append((t_uit - 2.6, 'whoosh'))
    if clip == 'panter_eind': stem_t = t_uit - 4.7

# eindkaart
logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((340, int(340 * logo.height / logo.width)), Image.LANCZOS)
E = {'e1': tekst('SPIN THE FUN!', POP, 112, WIT, 800), 'e2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
     'e3': tekst('Everyone wins. Until Sunday, Nov 29.', INTER, 48, WIT, 800), 'e4': tekst('Spin online: funkiness.ai/black-friday', MARK, 62, PINK, 860)}
for k in range(int(EIND_T * FPS)):
    e = k / FPS; fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); yb = 560
    plak(fr, logo, 540, yb - 30, back(e / 0.4) * 0.9); plak(fr, E['e1'], 540, yb + 230, back((e - 0.15) / 0.35, 2.4))
    plak(fr, E['e2'], 540, yb + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3))); plak(fr, E['e3'], 540, yb + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
    plak(fr, E['e4'], 540, yb + 600, back((e - 0.8) / 0.35, 2.2), rot=-2)
    p = os.path.join(W, f'eind{k:04d}.png'); fr.convert('RGB').save(p); frames.append((p, None, 0)); rot_per_frame.append(0)
DUUR = len(frames) / FPS

# beelden met ondertitels + kleurlook wegschrijven
OUT = os.path.join(W, 'uit'); os.makedirs(OUT)
OT = {r: ondertitel(r) for _, r, _ in frames if r and r != 'FREEZE'}
YEP = ondertitel('BLACK FRIDAY ON CURAÇAO', 58); BF = ondertitel('JUST GOT FUNKY!', 74)
for i, (p, r, age) in enumerate(frames):
    fr = Image.open(p).convert('RGBA')
    if r == 'FREEZE':
        plak(fr, YEP, 540, 1250, back(age / 0.25, 2.2))
        if age > 0.6: plak(fr, BF, 540, 1370, back((age - 0.6) / 0.25, 2.4), rot=-3)
    elif r and age > 0.1:
        plak(fr, OT[r], 540, 1330, min(1, 0.9 + (age - 0.1) * 0.5), alpha=min(1, (age - 0.1) / 0.2))
    fr.convert('RGB').save(os.path.join(OUT, f'{i:05d}.png'))

# ---------- geluid (48 kHz, mono effecten)
SR = 48000; L = int(DUUR * SR) + SR
fx = np.zeros(L); rng = np.random.default_rng(7)
def zet(t, sig, vol=1.0):
    i = int(t * SR); j = min(L, i + len(sig)); fx[i:j] += sig[:j - i] * vol
def ruis(n): return rng.standard_normal(n)
def bandpass(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x))
def whoosh(dur=0.55, lo=300, hi=3000):
    n = int(dur * SR); env = np.sin(np.linspace(0, math.pi, n)) ** 2; return bandpass(ruis(n), lo, hi) * env * 0.5
def tik():
    n = int(0.012 * SR); t = np.arange(n) / SR; return (np.sin(2 * math.pi * 2600 * t) * np.exp(-t * 500) + 0.4 * ruis(n) * np.exp(-t * 900)) * 0.35
def kras():
    n = int(0.45 * SR); t = np.arange(n) / SR; f = 1800 * np.exp(-t * 6) + 200
    return (np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.5 + bandpass(ruis(n), 800, 6000) * 0.6) * np.exp(-t * 3)
def rewind():
    n = int(REWIND_T * SR); t = np.arange(n) / SR; f = 400 + 2600 * t / REWIND_T
    return (np.sin(2 * math.pi * np.cumsum(f) / SR) * 0.3 + bandpass(ruis(n), 1500, 7000) * 0.4) * np.sin(np.linspace(0, math.pi, n))
def confetti():
    n = int(0.9 * SR); t = np.arange(n) / SR
    pop = np.sin(2 * math.pi * 90 * t) * np.exp(-t * 18) * 0.9
    knis = bandpass(ruis(n), 3000, 9000) * np.exp(-t * 3) * 0.25 * (rng.random(n) > 0.97)
    return pop + bandpass(ruis(n), 2000, 8000) * np.exp(-t * 12) * 0.3 + knis * 6
for t, soort in events:
    if soort == 'kras': zet(t, kras(), 0.9)
    if soort == 'rewind': zet(t, rewind(), 0.8)
    if soort == 'whoosh': zet(t, whoosh(), 0.8)
    if soort == 'whoosh_slow': zet(t, whoosh(1.2, 150, 1500), 0.7)
    if soort == 'confetti': zet(t, confetti(), 0.8)
# tikkend rad: een tik per pin (15 graden)
acc = 0.0
for i, dg in enumerate(rot_per_frame):
    if dg <= 0: continue
    acc += dg
    while acc >= 15:
        acc -= 15; zet(i / FPS + rng.random() / FPS, tik(), 0.6 if dg < 30 else 0.35)
fx = np.clip(fx, -1, 1)
wav = os.path.join(W, 'fx.wav')
import wave
with wave.open(wav, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((fx * 32000).astype(np.int16).tobytes())

naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-black-friday.mp4')
stem = os.path.expanduser('~/Downloads/IMG_6727.MOV')
mus_uit = DUUR - 1.5
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(OUT, '%05d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-i', wav, '-ss', '2.5', '-t', '4.7', '-i', stem,
                '-filter_complex',
                # muziek valt stil tijdens de freeze (plaatkras), duikt weg onder Daisy's stem
                f'[1:a]afade=t=in:st=0:d=0.2,volume=enable=\'between(t,0.6,{0.6 + FREEZE_T})\':volume=0.15,'
                f'volume=enable=\'between(t,{stem_t},{stem_t + 4.7})\':volume=0.3,afade=t=out:st={mus_uit}:d=1.5,volume=0.8[m];'
                f'[2:a]aformat=channel_layouts=stereo[f];'
                f'[3:a]volume=2.4,adelay=delays={int(stem_t * 1000)}:all=1[v];'
                f'[m][f][v]amix=inputs=3:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-r', str(FPS),
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(os.path.join(W, 'uit'))
print(naam, round(DUUR, 1))
