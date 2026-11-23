# Maakt de vijf cadeau-PDF's van SPIN THE FUN! uit cadeaus.py, in de FUNkiness!-huisstijl.
# Gebruik (vanuit de projectroot): python3 docs/black-friday-2026/maak_cadeaus.py
# Uitvoer: gifts/bf26-<token>/<slug>.pdf (de map uit api/_bf-prijzen.js) + HTML-bron in docs/black-friday-2026/html/
import html, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from cadeaus import ALLE

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MAP = re.search(r"const MAP = '/(gifts/[^']+)/'", open(os.path.join(ROOT, 'api/_bf-prijzen.js')).read()).group(1)
UIT = os.path.join(ROOT, MAP)
HTMLMAP = os.path.join(os.path.dirname(__file__), 'html')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
os.makedirs(UIT, exist_ok=True); os.makedirs(HTMLMAP, exist_ok=True)
import base64
_font = lambda n: 'data:font/woff2;base64,' + base64.b64encode(open(os.path.join(ROOT, 'fonts', n), 'rb').read()).decode()
FONTS = {k: _font(k) for k in ['inter-400-latin.woff2', 'poppins-900-latin.woff2', 'poppins-700-latin.woff2', 'permanent-marker-400-latin.woff2']}
LOGO = 'file://' + os.path.join(ROOT, 'funkiness-logo.webp')

e = lambda t: html.escape(t, quote=False).replace('[', '<span class="fill">[').replace(']', ']</span>')

CSS = f"""
@font-face {{ font-family: Inter; src: url({FONTS['inter-400-latin.woff2']}); }}
@font-face {{ font-family: Poppins; font-weight: 900; src: url({FONTS['poppins-900-latin.woff2']}); }}
@font-face {{ font-family: Poppins; font-weight: 700; src: url({FONTS['poppins-700-latin.woff2']}); }}
@font-face {{ font-family: 'Permanent Marker'; src: url({FONTS['permanent-marker-400-latin.woff2']}); }}
@page {{ size: A4; margin: 16mm 16mm 18mm; background: #f7efe7; }}
* {{ box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
html, body {{ background: #f7efe7; margin: 0; }}
body {{ font-family: Inter, Arial, sans-serif; color: #3a251b; font-size: 11pt; line-height: 1.5; }}
.top {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 8mm; }}
.top img {{ height: 18mm; }}
.kicker {{ font-family: 'Permanent Marker', cursive; color: #f21b7a; font-size: 13pt; transform: rotate(-2deg); }}
h1 {{ font-family: Poppins; font-weight: 900; font-size: 34pt; line-height: 1; margin: 0 0 3mm; letter-spacing: -0.5px; }}
.sub {{ font-size: 13pt; font-weight: 700; margin: 0 0 6mm; }}
.intro {{ background: #fff; border-radius: 6mm; padding: 5mm 6mm; margin-bottom: 7mm; }}
.intro p {{ margin: 0 0 2.5mm; }} .intro p:last-child {{ margin: 0; }}
h2 {{ font-family: Poppins; font-weight: 900; font-size: 17pt; margin: 8mm 0 3mm; }}
.card {{ background: #fff; border-radius: 6mm; padding: 4.5mm 6mm; margin-bottom: 4mm; break-inside: avoid; position: relative; }}
.card h3 {{ font-family: Poppins; font-weight: 900; font-size: 13pt; margin: 0 0 2mm; line-height: 1.25; }}
.num {{ font-family: 'Permanent Marker', cursive; color: #f21b7a; font-size: 20pt; float: left; width: 12mm; line-height: 1; }}
.body {{ margin-left: 12mm; }}
.label {{ font-family: Poppins; font-weight: 700; font-size: 8.5pt; letter-spacing: .6px; text-transform: uppercase; color: rgba(58,37,27,.55); margin: 2mm 0 .5mm; }}
.card p {{ margin: 0; }}
.prompt {{ background: #3a251b; color: #fff; border-radius: 4mm; padding: 3.5mm 4.5mm; font-size: 10pt; margin: 1mm 0 2mm; }}
.prompt .fill {{ color: #f6b4a6; }}
.fill {{ color: #f21b7a; font-family: 'Permanent Marker', cursive; font-size: .95em; }}
.pill {{ display: inline-block; border-radius: 99px; padding: .6mm 3mm; font-family: Poppins; font-weight: 700; font-size: 8pt; letter-spacing: .5px; color: #fff; margin-right: 2mm; vertical-align: middle; }}
.USEFUL {{ background: #3a251b; }} .SELL {{ background: #f21b7a; }} .PERSONAL {{ background: #f6b4a6; color: #3a251b; }}
.ba {{ display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin-top: 2mm; }}
.ba div {{ border-radius: 4mm; padding: 3mm 4mm; font-size: 10pt; }}
.ba .voor {{ background: #f3e3d6; }} .ba .na {{ background: #fde2ec; }}
.check li {{ list-style: none; margin: 0 0 2.5mm; padding-left: 9mm; position: relative; }}
.check li::before {{ content: ''; position: absolute; left: 0; top: .5mm; width: 4.5mm; height: 4.5mm; border: 2px solid #f21b7a; border-radius: 1.5mm; }}
.check {{ padding: 0; }}
.dag {{ display: grid; grid-template-columns: 11mm 1fr; gap: 3mm; background: #fff; border-radius: 4mm; padding: 3mm 4.5mm; margin-bottom: 2.5mm; break-inside: avoid; font-size: 10pt; }}
.dag .d {{ font-family: 'Permanent Marker', cursive; color: #f21b7a; font-size: 15pt; line-height: 1.1; }}
.dag b {{ font-family: Poppins; font-weight: 900; font-size: 11pt; }}
.dag .ex {{ color: rgba(58,37,27,.7); }}
.slot {{ margin-top: 8mm; background: #f21b7a; color: #fff; border-radius: 6mm; padding: 5mm 6mm; break-inside: avoid; }}
.slot p {{ margin: 0 0 3mm; font-weight: 700; }}
.slot .sign {{ font-family: 'Permanent Marker', cursive; font-size: 15pt; margin: 0; }}
.slot .web {{ font-size: 9.5pt; font-weight: 400; margin: 1mm 0 0; }}
"""

def pagina(c, inhoud):
    intro = ''.join(f'<p>{e(p)}</p>' for p in c['intro'])
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{html.escape(c['titel'])} | FUNkiness!</title><style>{CSS}</style></head><body>
<div class="top"><img src="{LOGO}" alt="FUNkiness!"><span class="kicker">{html.escape(c['kicker'])}</span></div>
<h1>{html.escape(c['titel'])}</h1><p class="sub">{html.escape(c['sub'])}</p>
<div class="intro">{intro}</div>
{inhoud}
<div class="slot"><p>{e(c['slot'])}</p><p class="sign">Boring was never the plan.</p><p class="web">FUNkiness! · AI, social media &amp; marketing on Curaçao · funkiness.ai · WhatsApp +599 9 675 1737</p></div>
</body></html>"""

def hooks(c):
    return ''.join(f"""<div class="card"><span class="num">{i:02d}</span><div class="body"><h3>{e(h)}</h3>
<p class="label">Example</p><p>{e(v)}</p><p class="label">Why it works</p><p>{e(w)}</p></div></div>""" for i, (h, v, w) in enumerate(c['items'], 1))

def ai(c):
    uit, n = '', 0
    for groep, prompts in c['groepen']:
        uit += f'<h2>{html.escape(groep)}</h2>'
        for titel, prompt, tip in prompts:
            n += 1
            uit += f"""<div class="card"><span class="num">{n:02d}</span><div class="body"><h3>{html.escape(titel)}</h3>
<div class="prompt">{e(prompt)}</div><p class="label">Tip</p><p>{e(tip)}</p></div></div>"""
    return uit

def rescue(c):
    uit = '<h2>Five problems, five fixes</h2>'
    for i, (probleem, fix, voor, na) in enumerate(c['problemen'], 1):
        uit += f"""<div class="card"><span class="num">{i:02d}</span><div class="body"><h3>{e(probleem)}</h3>
<p class="label">The fix</p><p>{e(fix)}</p><div class="ba"><div class="voor"><p class="label">Before</p>{e(voor)}</div><div class="na"><p class="label">After</p>{e(na)}</div></div></div></div>"""
    uit += '<h2>Checklist for every post</h2><div class="card"><ul class="check">' + ''.join(f'<li>{e(x)}</li>' for x in c['checklist']) + '</ul></div>'
    return uit

def ideas(c):
    return ''.join(f"""<div class="dag"><span class="d">{i}</span><div><span class="pill {t}">{t}</span><b>{e(titel)}</b><br>{e(uitleg)}<br><span class="ex">Example: {e(vb)}</span></div></div>""" for i, (t, titel, uitleg, vb) in enumerate(c['dagen'], 1))

def fix(c):
    uit = ''.join(f"""<div class="card"><span class="num">{i}</span><div class="body"><h3>{e(titel)} <span class="pill PERSONAL">{tijd}</span></h3>
<p>{e(wat)}</p><p class="label">Example</p><p>{e(vb)}</p></div></div>""" for i, (tijd, titel, wat, vb) in enumerate(c['acties'], 1))
    titel, prompt = c['prompt']
    return uit + f'<h2>{html.escape(titel)}</h2><div class="card"><div class="prompt">{e(prompt)}</div><p>Paste it into ChatGPT, Claude or Gemini, pick your favorite and adjust one word to make it sound like you.</p></div>'

BOUW = {'funkiness-10-killer-hooks': hooks, 'funkiness-ai-power-pack': ai, 'funkiness-content-rescue-kit': rescue,
        'funkiness-30-days-of-ideas': ideas, 'funkiness-5-minute-marketing-fix': fix}

for c in ALLE:
    h = os.path.join(HTMLMAP, c['slug'] + '.html')
    open(h, 'w').write(pagina(c, BOUW[c['slug']](c)))
    pdf = os.path.join(UIT, c['slug'] + '.pdf')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer', '--virtual-time-budget=5000',
                    '--print-to-pdf=' + pdf, 'file://' + h], check=True, capture_output=True)
    print(os.path.relpath(pdf, ROOT), os.path.getsize(pdf) // 1024, 'KB')
