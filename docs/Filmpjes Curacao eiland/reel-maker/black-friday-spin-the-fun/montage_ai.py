# SPIN THE FUN!: definitieve oprichtersvideo uit de Higgsfield-shots (Seedance 2.5 video_edit op Daisy's echte opnames).
# Stijl zoals ~/Downloads/voorbeeld.mp4: echte scènes, kleine witte ondertitels midden in beeld, geen vlakken of stickers.
# Gebruik: python3 montage_ai.py <map met shot1.mp4..shot7.mp4>
import os, subprocess, sys, shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from build import tekst, plak, back, POP, MARK, INTER, PINK, BRUIN, WIT, ROOT, UIT, MUZIEK

MAP = sys.argv[1]
FPS = 30
# (bestand, begin, duur, ondertitel)
SHOTS = [('shot1.mp4', 0.0, 3.5, 'BLACK FRIDAY JUST GOT FUNKY!'),
         ('shot2.mp4', 0.3, 3.7, 'NO DISCOUNT CODES. A PRIZE WHEEL.'),
         ('shot3.mp4', 0.3, 3.7, 'FREE FOR BUSINESSES ON CURAÇAO'),
         ('shot4.mp4', 0.0, 3.6, 'EVERY SPIN WINS A MARKETING GIFT'),
         ('shot5.mp4', 0.0, 3.5, 'WAIT... WHAT?'),
         ('shot6.mp4', 0.3, 3.5, 'EVERYONE WINS!'),
         ('shot7.mp4', 0.0, 5.0, 'SPIN THE WHEEL!')]
EINDKAART = 3.5
# Kleur gelijktrekken: de Seedance-shots iets warmer en zonniger, het FLUX-slotshot iets rustiger
WARM = 'colorbalance=rs=0.05:gs=0.015:bs=-0.06:rm=0.03:bm=-0.03,eq=saturation=1.1:brightness=0.02:contrast=1.03'
KLEUR = {f'shot{i}.mp4': WARM for i in range(1, 7)}
KLEUR['shot7.mp4'] = 'eq=saturation=0.93'
POP7 = os.path.expanduser('~/Library/Fonts/Poppins-Black.ttf')

def ondertitel(regel):
    font = ImageFont.truetype(POP7, 50)
    w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    while w > 860:
        font = ImageFont.truetype(POP7, font.size - 2); w = int(ImageDraw.Draw(Image.new('L', (1, 1))).textlength(regel, font=font))
    im = Image.new('RGBA', (w + 60, 120), (0, 0, 0, 0))
    sch = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sch).text((30, 30), regel, font=font, fill=(0, 0, 0, 170))
    im.alpha_composite(sch.filter(ImageFilter.GaussianBlur(6)))
    ImageDraw.Draw(im).text((30, 28), regel, font=font, fill=WIT)
    return im

WERK = os.path.join(MAP, '_montage'); shutil.rmtree(WERK, ignore_errors=True); os.makedirs(WERK)
delen = []
for n, (bestand, start, duur, regel) in enumerate(SHOTS):
    d = os.path.join(WERK, f'd{n}'); os.makedirs(d)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-ss', str(start), '-t', str(duur), '-i', os.path.join(MAP, bestand),
                    '-vf', f'scale=1080:1920:flags=lanczos,fps={FPS},' + KLEUR[bestand], os.path.join(d, '%04d.png')], check=True)
    ot = ondertitel(regel)
    beelden = sorted(os.listdir(d))
    for i, f in enumerate(beelden):
        t = i / FPS
        fr = Image.open(os.path.join(d, f)).convert('RGBA')
        if t > 0.15:
            plak(fr, ot, 540, 1330, min(1, 0.9 + (t - 0.15) * 0.5), alpha=min(1, (t - 0.15) / 0.2))
        fr.convert('RGB').save(os.path.join(d, f))
    delen.append((d, len(beelden)))

# eindkaart
d = os.path.join(WERK, 'eind'); os.makedirs(d)
logo = Image.open(os.path.join(ROOT, 'funkiness-logo.png')).convert('RGBA'); logo = logo.resize((340, int(340 * logo.height / logo.width)), Image.LANCZOS)
E = {'e1': tekst('SPIN THE FUN!', POP, 112, WIT, 800), 'e2': tekst('Free for businesses on Curaçao', INTER, 50, WIT, 780),
     'e3': tekst('Everyone wins. Until Sunday, Nov 29.', INTER, 48, WIT, 800), 'e4': tekst('funkiness.ai/black-friday', MARK, 70, PINK, 800)}
for i in range(int(EINDKAART * FPS)):
    e = i / FPS; fr = Image.new('RGBA', (1080, 1920), BRUIN + (255,)); yb = 560
    plak(fr, logo, 540, yb - 30, back(e / 0.4) * 0.9)
    plak(fr, E['e1'], 540, yb + 230, back((e - 0.15) / 0.35, 2.4))
    plak(fr, E['e2'], 540, yb + 380, 1, alpha=min(1, max(0, (e - 0.45) / 0.3)))
    plak(fr, E['e3'], 540, yb + 460, 1, alpha=min(1, max(0, (e - 0.6) / 0.3)))
    plak(fr, E['e4'], 540, yb + 600, back((e - 0.8) / 0.35, 2.2), rot=-2)
    fr.convert('RGB').save(os.path.join(d, f'{i + 1:04d}.png'))
delen.append((d, int(EINDKAART * FPS)))

# alles achter elkaar
alle = os.path.join(WERK, 'alle'); os.makedirs(alle); k = 0
for d, n in delen:
    for f in sorted(os.listdir(d)):
        k += 1; os.rename(os.path.join(d, f), os.path.join(alle, f'{k:05d}.png'))
DUUR = k / FPS
stem_start = sum(s[2] for s in SHOTS[:6])
naam = os.path.join(UIT, 'reel-EN-spin-the-wheel-black-friday.mp4')
stem_bron = os.path.expanduser('~/Downloads/IMG_6727.MOV')     # shot7 = 6727 vanaf 2.5 s, "Spin the wheel" op 4.3-5.6 s
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', os.path.join(alle, '%05d.png'),
                '-t', str(DUUR), '-i', MUZIEK, '-ss', '2.5', '-t', '5', '-i', stem_bron,
                '-filter_complex',
                f'[1:a]afade=t=in:st=0:d=0.3,afade=t=out:st={DUUR - 1.3}:d=1.3,volume=0.85,volume=enable=\'between(t,{stem_start},{stem_start + 5})\':volume=0.35[m];'
                f'[2:a]volume=2.2,adelay=delays={int(stem_start * 1000)}:all=1[v];[m][v]amix=inputs=2:duration=first:normalize=0[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17',
                '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                '-c:a', 'aac', '-b:a', '192k', '-t', str(DUUR), '-movflags', '+faststart', naam], check=True)
shutil.rmtree(WERK)
print(naam, round(DUUR, 1))
