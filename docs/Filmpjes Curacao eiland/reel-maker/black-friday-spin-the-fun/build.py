# SPIN THE FUN! (Black Friday 2026): animatie van het prijzenrad als eerste advertentie.
# Geen AI-credits, alles getekend. Twee formaten: 9:16 (Reels/Stories/TikTok) en 4:5 (feed).
# Gebruik: python3 build.py   (vanuit deze map)
# Uitvoer: docs/Graphic-Design/social-media-posts/ad-EN-black-friday-just-got-funky-9x16.mp4 / -4x5.mp4 / -cover.png
import math, os, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HIER = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HIER, '..', '..', '..', '..'))
UIT = os.path.join(ROOT, 'docs', 'Graphic-Design', 'social-media-posts')
MUZIEK = os.path.join(UIT, 'muziek', 'funkiness-tumba-curacao-lyria.mp3')
TMP = os.path.join(HIER, '_frames')
FONTS = os.path.expanduser('~/Library/Fonts')
POP = os.path.join(FONTS, 'Poppins-Black.ttf')
MARK = os.path.join(FONTS, 'PermanentMarker-Regular.ttf')
INTER = os.path.join(FONTS, 'Inter-SemiBold.ttf')

PINK = (242, 27, 122); BRUIN = (58, 37, 27); CREME = (247, 239, 231); ZACHT = (246, 180, 166); WIT = (255, 255, 255)
FPS = 30; DUUR = 13.0
VAKKEN = [('10 Killer Hooks', 18, PINK, WIT), ('AI Power Pack', 18, BRUIN, WIT), ('Content Rescue Kit', 18, CREME, BRUIN),
          ('30 Days of Ideas', 18, PINK, WIT), ('Mystery FUNky Gift', 18, BRUIN, WIT), ('Marketing SOS', 10, ZACHT, BRUIN)]
WINNAAR = 4  # het rad stopt op Mystery FUNky Gift

f = lambda pad, s: ImageFont.truetype(pad, s)
ease_out = lambda x: 1 - (1 - x) ** 3
def back(x, s=1.9):
    x = max(0, min(1, x)); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2

def maak_wiel(D):
    S = 2; R = D * S // 2
    im = Image.new('RGBA', (D * S, D * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    hoek = -90; midden = []
    for label, kans, bg, fg in VAKKEN:
        b = kans / 100 * 360
        d.pieslice([0, 0, 2 * R - 1, 2 * R - 1], hoek, hoek + b, fill=bg, outline=WIT, width=6 * S)
        midden.append(hoek + b / 2 + 90); hoek += b
    d.ellipse([0, 0, 2 * R - 1, 2 * R - 1], outline=BRUIN, width=10 * S)
    for (label, kans, bg, fg), m in zip(VAKKEN, midden):
        # past tussen de naaf (0.30R) en de rand (0.93R)
        fs = int(D * 0.05) * S; font = f(POP, fs); w = d.textlength(label, font=font)
        while w > R * 0.6 and fs > 10:
            fs -= 2; font = f(POP, fs); w = d.textlength(label, font=font)
        t = Image.new('RGBA', (int(w) + 20, fs + 30), (0, 0, 0, 0))
        ImageDraw.Draw(t).text((10, 8), label, font=font, fill=fg)
        rechts = m <= 180
        rot = (90 - m) if rechts else (270 - m)
        t = t.rotate(rot, expand=True, resample=Image.BICUBIC)
        a = math.radians(m); rr = R * 0.615
        cx, cy = R + rr * math.sin(a), R - rr * math.cos(a)
        im.alpha_composite(t, (int(cx - t.width / 2), int(cy - t.height / 2)))
    return im.resize((D, D), Image.LANCZOS), midden

def naaf(D):
    r = int(D * 0.11); im = Image.new('RGBA', (2 * r + 24, 2 * r + 24), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse([0, 0, 2 * r + 23, 2 * r + 23], fill=CREME); d.ellipse([12, 12, 2 * r + 11, 2 * r + 11], fill=BRUIN)
    font = f(MARK, int(r * 0.42))
    for i, regel in enumerate(['SPIN', 'ME']):
        w = d.textlength(regel, font=font); d.text((r + 12 - w / 2, r + 12 - r * 0.48 + i * r * 0.5), regel, font=font, fill=WIT)
    return im

def wijzer(D):
    w, h = int(D * 0.08), int(D * 0.11); im = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.polygon([(4 + w / 2, h + 4), (4, 4 + w * .4), (4 + w / 2, 4), (4 + w, 4 + w * .4)], fill=PINK, outline=WIT, width=5)
    return im

def tekst(regel, pad, size, kleur, breed):
    font = f(pad, size)
    while ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font) > breed and size > 20:
        size -= 2; font = f(pad, size)
    w = ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font)
    im = Image.new('RGBA', (int(w) + 40, int(size * 1.45)), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((20, int(size * .12)), regel, font=font, fill=kleur)
    return im

def plak(frame, laag, cx, cy, schaal=1.0, rot=0, alpha=1.0):
    if schaal <= 0.01 or alpha <= 0: return
    l = laag
    if schaal != 1: l = l.resize((max(1, int(l.width * schaal)), max(1, int(l.height * schaal))), Image.BICUBIC)
    if rot: l = l.rotate(rot, expand=True, resample=Image.BICUBIC)
    if alpha < 1: l = l.copy(); l.putalpha(l.getchannel('A').point(lambda v: int(v * alpha)))
    frame.alpha_composite(l, (int(cx - l.width / 2), int(cy - l.height / 2)))

def rotatie(t, midden):
    # 2.0-2.6s rad komt binnen, 2.6-7.6s draaien, net voor het einde een 'twijfel'-tik terug (de verrassing)
    doel = -midden[WINNAAR] + 360 * 7
    if t < 2.6: return 0, 0
    x = min(1, (t - 2.6) / 4.6)
    r = doel * ease_out(x) + 9 * math.sin(min(1, max(0, (t - 6.6) / 0.6)) * math.pi)  # wiebel vlak voor stilstand
    snel = doel * 3 * (1 - x) ** 2 / 4.6 / FPS
    return r, snel

def render(W, H, naam):
    is916 = H > 1500
    D = 780 if is916 else 620
    WC = (540, 965 if is916 else 650)          # middelpunt rad
    TOP = 385 if is916 else 120                 # tekst boven het rad
    ONDER = 1418 if is916 else 1080              # tekst onder het rad
    wiel, midden = maak_wiel(D); hub = naaf(D); pijl = wijzer(D)
    logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((320, int(320 * logo.height / logo.width)), Image.LANCZOS)
    L = {
        'bf': tekst('BLACK FRIDAY', POP, 120, BRUIN, 780),
        'funky': tekst('JUST GOT FUNKY!', MARK, 104, PINK, 800),
        'r1': tekst('Spin the wheel.', POP, 66, BRUIN, 780),
        'r2': tekst('Win something awesome.', POP, 58, BRUIN, 780),
        'won': tekst('Mystery FUNky Gift!', MARK, 76, PINK, 780),
        'r3': tekst('Everyone wins!', MARK, 84, PINK, 780),
        'eind1': tekst('SPIN THE FUN!', POP, 112, WIT, 800),
        'eind2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
        'eind3': tekst('Until Sunday, November 29', INTER, 50, WIT, 780),
        'eind4': tekst('funkiness.ai/black-friday', MARK, 70, PINK, 800),
    }
    if os.path.isdir(TMP): shutil.rmtree(TMP)
    os.makedirs(TMP)
    N = int(DUUR * FPS)
    for i in range(N):
        t = i / FPS
        fr = Image.new('RGBA', (W, H), CREME + (255,))
        sx = sy = 0
        if t < 9.2:
            # opening: BLACK FRIDAY + slam
            if t < 2.6:
                plak(fr, L['bf'], 540, TOP + (0 if is916 else 0), back(t / 0.35))
                if t > 0.7:
                    plak(fr, L['funky'], 540, TOP + 120, back((t - 0.7) / 0.3, 2.6), rot=4)
                    if t < 1.0: sx, sy = int(14 * math.sin(t * 90)), int(10 * math.cos(t * 70))
            else:
                plak(fr, L['bf'], 540, TOP, 1, alpha=max(0, 1 - (t - 2.6) / 0.3))
                plak(fr, L['funky'], 540, TOP + 120, 1, rot=4, alpha=max(0, 1 - (t - 2.6) / 0.3))
            # rad
            s = back((t - 1.6) / 0.6) if t >= 1.6 else 0
            if s > 0:
                r, snel = rotatie(t, midden)
                if snel > 4:   # bewegingsonscherpte bij hoge snelheid
                    lagen = [wiel.rotate(-(r - k * snel / 4), resample=Image.BICUBIC) for k in range(4)]
                    w = lagen[0]
                    for k, l in enumerate(lagen[1:], 2): w = Image.blend(w, l, 1 / k)
                else:
                    w = wiel.rotate(-r, resample=Image.BICUBIC)
                plak(fr, w, WC[0], WC[1], s)
                plak(fr, hub, WC[0], WC[1], s)
                plak(fr, pijl, WC[0], WC[1] - D * s / 2 - pijl.height * s * .22, s)
            # regels die meelopen met het draaien
            if 2.9 <= t < 5.4: plak(fr, L['r1'], 540, TOP + 10, back((t - 2.9) / 0.3))
            if 5.0 <= t < 7.6: plak(fr, L['r2'], 540, ONDER, back((t - 5.0) / 0.3))
            if t >= 7.6:
                plak(fr, L['won'], 540, TOP + 10, back((t - 7.6) / 0.3, 2.4), rot=-3)
                if t < 7.9: sx, sy = int(16 * math.sin(t * 95)), int(12 * math.cos(t * 80))
            if t >= 8.1:
                plak(fr, L['r3'], 540, ONDER, back((t - 8.1) / 0.3, 2.8), rot=3)
                if t < 8.4: sx, sy = int(18 * math.sin(t * 95)), int(12 * math.cos(t * 80))
        else:
            # eindkaart (bruin), lang genoeg om te lezen
            fr = Image.new('RGBA', (W, H), BRUIN + (255,))
            e = t - 9.2
            y0 = (560 if is916 else 260)
            plak(fr, logo, 540, y0 - 30, back(e / 0.4) * 0.9)
            plak(fr, L['eind1'], 540, y0 + 230, back((e - 0.15) / 0.35, 2.4))
            plak(fr, L['eind2'], 540, y0 + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3)))
            plak(fr, L['eind3'], 540, y0 + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
            plak(fr, L['eind4'], 540, y0 + 600, back((e - 0.8) / 0.35, 2.2), rot=-2)
            if 0.15 < e < 0.4: sx, sy = int(12 * math.sin(t * 95)), int(10 * math.cos(t * 80))
        if sx or sy:
            fr = fr.transform(fr.size, Image.AFFINE, (1, 0, -sx, 0, 1, -sy), fillcolor=(CREME if t < 9.2 else BRUIN) + (255,))
        fr.convert('RGB').save(os.path.join(TMP, f'{i:04d}.png'))
        if i == int(8.6 * FPS) and is916:
            fr.convert('RGB').save(os.path.join(UIT, 'ad-EN-black-friday-just-got-funky-cover.png'))
    uit = os.path.join(UIT, naam)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(TMP, '%04d.png'),
                    '-ss', '0', '-t', str(DUUR), '-i', MUZIEK,
                    '-filter:a', f'afade=t=in:st=0:d=0.3,afade=t=out:st={DUUR - 1.2}:d=1.2,volume=1.0',
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium',
                    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', uit], check=True)
    shutil.rmtree(TMP)
    print(naam)

if __name__ == '__main__':
    render(1080, 1920, 'ad-EN-black-friday-just-got-funky-9x16.mp4')
    render(1080, 1350, 'ad-EN-black-friday-just-got-funky-4x5.mp4')
