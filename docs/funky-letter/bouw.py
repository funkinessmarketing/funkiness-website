# Bouwt de FUNky Letter als mail-HTML (EN + NL) uit één inhoudsbestand per editie.
# Gebruik: python3 docs/funky-letter/bouw.py docs/funky-letter/editie-01.json
import json, sys, html, re, pathlib

PINK, BROWN, CREAM, WHITE = '#f21b7a', '#3a251b', '#f7efe7', '#ffffff'
FONT = "Arial, Helvetica, sans-serif"
HEAD = "'Arial Black', Arial, Helvetica, sans-serif"
SITE = 'https://www.funkiness.ai'


def tekst(s):
    # *schuin* en **vet** in de brontekst
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\*(.+?)\*', r'<em>\1</em>', s)
    return s


def p(s, size=16, color=BROWN, extra=''):
    return f'<p style="margin:0 0 14px;font-family:{FONT};font-size:{size}px;line-height:1.55;color:{color};{extra}">{tekst(s)}</p>'


def label(s, bg=PINK):
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px"><tr>'
            f'<td style="background:{bg};border-radius:999px;padding:6px 14px;font-family:{FONT};font-size:11px;'
            f'font-weight:bold;letter-spacing:2px;color:{WHITE};text-transform:uppercase">{html.escape(s)}</td></tr></table>')


def kop(s, size=24):
    return f'<h2 style="margin:0 0 12px;font-family:{HEAD};font-size:{size}px;line-height:1.15;color:{BROWN};font-weight:900">{html.escape(s)}</h2>'


def blok(inner, bg=WHITE, radius='26px 18px 30px 16px'):
    return (f'<tr><td style="padding:0 20px 18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
            f'<tr><td style="background:{bg};border-radius:{radius};padding:26px 24px">{inner}</td></tr></table></td></tr>')


def bouw(d, taal):
    t = d[taal]
    big = t['big']
    quick = ''.join(kop(q['titel'], 19) + ''.join(p(x) for x in q['tekst']) for q in t['quick'])
    tryit = t['try']
    bronnen = ' · '.join(f'<a href="{b["url"]}" style="color:{BROWN}">{html.escape(b["naam"])}</a>' for b in d['bronnen'])
    taalwissel = t['taalwissel']
    return f'''<!doctype html>
<html lang="{taal}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>{html.escape(t['onderwerp'])}</title></head>
<body style="margin:0;padding:0;background:{CREAM}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">{html.escape(t['preheader'])}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{CREAM}"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px">
<tr><td style="padding:18px 20px 0;font-family:{FONT};font-size:12px;color:{BROWN};text-align:right">{taalwissel}</td></tr>
<tr><td align="center" style="padding:14px 20px 10px"><a href="{SITE}"><img src="{SITE}/email-logo.png" width="170" alt="FUNkiness!" style="display:block;border:0;width:170px;height:auto"></a></td></tr>
<tr><td align="center" style="padding:0 20px 6px;font-family:{HEAD};font-size:30px;line-height:1.1;color:{BROWN};font-weight:900">The FUNky Letter</td></tr>
<tr><td align="center" style="padding:0 20px 20px;font-family:{FONT};font-size:13px;letter-spacing:2px;color:{BROWN};text-transform:uppercase">{html.escape(t['ondertitel'])}</td></tr>
<tr><td style="padding:0 20px 22px"><img src="{SITE}/email-panter.jpg" width="560" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:999px"></td></tr>
<tr><td style="padding:0 28px 8px">{p(t['groet'], 17)}{p(t['hook'], 19, BROWN, 'font-weight:bold')}</td></tr>
{blok(label(big['label']) + kop(big['titel'], 26) + ''.join(p(x) for x in big['tekst']) +
      f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:{CREAM};border-left:4px solid {PINK};border-radius:0 14px 14px 0;padding:16px 18px">{p(big["tip"], 16, BROWN, "margin:0")}</td></tr></table>')}
{blok(label(t['quick_label'], BROWN) + quick)}
<tr><td style="padding:0 20px 18px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:{PINK};border-radius:18px 30px 16px 26px;padding:26px 24px">
{label(tryit['label'], BROWN)}<h2 style="margin:0 0 12px;font-family:{HEAD};font-size:24px;line-height:1.15;color:{WHITE};font-weight:900">{html.escape(tryit['titel'])}</h2>
{''.join(p(x, 16, WHITE) for x in tryit['tekst'])}</td></tr></table></td></tr>
<tr><td style="padding:10px 28px 6px">{p(t['afsluiter'], 17, BROWN, 'font-weight:bold')}{p('Boring was never the plan.', 16)}{p('Daisy, FUNkiness!', 16, BROWN, 'margin:0 0 24px')}</td></tr>
<tr><td style="background:{BROWN};padding:26px 28px;border-radius:30px 30px 0 0">
<p style="margin:0 0 10px;font-family:{FONT};font-size:13px;line-height:1.6;color:{CREAM}">FUNkiness! AI, Social Media &amp; Marketing · Curaçao · <a href="{SITE}" style="color:{CREAM}">funkiness.ai</a></p>
<p style="margin:0 0 10px;font-family:{FONT};font-size:12px;line-height:1.6;color:{CREAM};opacity:0.8">{html.escape(t['waarom'])} <a href="{{{{ unsubscribe }}}}" style="color:{CREAM}">{html.escape(t['afmelden'])}</a></p>
<p style="margin:0;font-family:{FONT};font-size:11px;line-height:1.6;color:{CREAM};opacity:0.7">{html.escape(t['bronnen_label'])}: <span style="color:{CREAM}">{bronnen.replace(f'color:{BROWN}', f'color:{CREAM}')}</span></p>
</td></tr>
</table></td></tr></table></body></html>'''


if __name__ == '__main__':
    bron = pathlib.Path(sys.argv[1])
    d = json.loads(bron.read_text())
    for taal in ('en', 'nl'):
        uit = bron.with_name(bron.stem + f'-{taal}.html')
        uit.write_text(bouw(d, taal))
        print(uit)
