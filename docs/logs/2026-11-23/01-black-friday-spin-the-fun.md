# 23-11-2026: Black Friday SPIN THE FUN!

Branch: `black-friday` (niet gemerged, niet live). Spec van Daisy: campagne "BLACK FRIDAY JUST GOT FUNKY!", actie "SPIN THE FUN!", 23 t/m 29 nov, hoofdprijstrekking 30 nov.

## Gebouwd
- `black-friday.html` + `black-friday.js`: landingspagina, rad (SVG, vakbreedte = winkans), formulier, uitslag, FAQ + JSON-LD, tellers, pixel-haak.
- `api/spin.js`: validatie (Curaçao-nummer +599 9, kanaal verplicht, vinkjes), loting via sheet-webhook, prijsmail via Brevo (terugval Titan), Meta CAPI `Lead` alleen met cookietoestemming en zonder e-mail/telefoon.
- `api/bf-event.js`: telt bezoek en start formulier zonder persoonsgegevens.
- `api/_bf-prijzen.js`: prijsnamen, teksten, downloadlinks (map `gifts/bf26-226dada8e958/`, noindex + robots Disallow). `SOS_TERMIJN` staat op voorstel "by Friday, December 11, 2026" (OPEN).
- `docs/google-sheet-scan-script.gs`: `bfSpin` (loting onder lock, dubbelcheck op e-mail/telefoon/bedrijf/kanaal/KvK, SOS max 5 totaal en max 1 per dag), `bfEvent`, `bfTrekHoofdprijs` (menu, vanaf 30-11, één keer, verslag met SHA-256-vingerafdruk), `bfVerwijderTests` (menu + webhook `bf-opruimen`), status TEST telt nergens mee.
- `black-friday-terms.html`: concept-voorwaarden, noindex, OPEN-punten geel.
- Cadeaus: `docs/black-friday-2026/cadeaus.py` (inhoud) + `maak_cadeaus.py` (PDF via headless Chrome, fonts ingebed) > 5 PDF's in `gifts/bf26-226dada8e958/`.
- `cookie-consent.js`: Meta- en TikTok-pixel laden na 'accepted'; ID's leeg = niets geladen en banner ongewijzigd.
- Advertentie: `docs/Graphic-Design/social-media-posts/ad-EN-black-friday-just-got-funky-9x16.mp4`, `-4x5.mp4`, `-cover.png` (13 sec, tumba-track, script `reel-maker/black-friday-spin-the-fun/build.py`).
- `docs/black-friday-2026/campagneplan.md`: Meta-opzet, teksten, UTM-links, budgetadvies, organisch schema, video-shotlist, fasen.
- Sitemap + llms.txt: pagina toegevoegd.

## Getest
- 600 nepdraaien over 6 dagen: precies 5 SOS, 1 per dag. Dubbel op e-mail, bedrijf (andere schrijfwijze), kanaal-URL, telefoon: geweigerd. Voor opening/na sluiting: dicht.
- `api/spin.js` met nagebootste sheet/Brevo/Meta: alle paden goed (ok, dubbel, gesloten, foute velden, honeypot, CAPI alleen met toestemming).
- Nog niet getest tegen de echte sheet: het sheet-script staat nog niet in Google.

## Clasp
- Geïnstalleerd in `~/.funkiness-tools` (globale npm-map is van root). Ingelogd als funkinessmarketing@gmail.com.
- Scan-sheet: "Funkiness! Scan aanvragen" (eigenaar funkinessmarketing@gmail.com). Het ID `1qkiJjDa…` in de repo is de inhaakkalender, niet de scan-sheet.
- Script-ID van het gebonden script is niet via API/Drive te vinden; Daisy moet één keer het adres uit Extensies > Apps Script plakken. Daarna: `clasp clone`, remote vergelijken met `git show 5f91373:docs/google-sheet-scan-script.gs`, pas dan push en `clasp deploy -i <deployment-id uit GSHEET_WEBHOOK_URL>` (zelfde URL blijft).

## Open (Daisy)
- Script-adres plakken (zie hierboven).
- Goedkeuren: winkansen 18/18/18/18/18/10 + SOS max 1 per dag; SOS-termijn 11 dec; Mystery = 5-Minute Marketing Fix; gele punten in voorwaarden; cadeau-PDF's.
- Meta Pixel-ID + Conversions API-token; TikTok-locatiecheck.
- Juridische check (LOK / Curaçao Gaming Authority).
- Video: zegt Daisy "Spin the wheel!" zelf of via stemkopie.
- Privacybeleid aanvullen (SPIN THE FUN! + advertentiepixels), bewaartermijn deelnamegegevens.
