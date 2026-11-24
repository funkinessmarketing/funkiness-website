# Overdracht: FUNkiness! Black Friday commercial "The FUNky Escape"

Stand: 24-11-2026, einde sessie (tijdslimiet). Lees dit volledig voordat je verder gaat.

## Opdracht
Volledige briefing van Daisy: zie het gesprek van 24-11 (commercial "The FUNky Escape", ±30 sec, 1080x1920, 30 fps, H.264/AAC,
bestandsnaam `FUNkiness_BlackFriday_2026_FINAL.mp4`). Kern: de panterprint van de echte Jeep komt tot leven als een echte
gouden, gevlekte panter die door Willemstad gaat en de Black Friday-actie ontdekt. Autonoom werken, geen tussentijdse previews,
alleen het eindbestand opleveren + korte QC-bevestiging + aantal gebruikte Higgsfield-credits.

## Besluiten van Daisy (24-11)
- **Optie A:** AI (Seedance video_edit) op haar shots mag, zoals in de huidige video (gezicht/bewegingen intact, jurk wordt panterprint). Geen nieuwe opnames mogelijk (geen statief).
- **Data:** actie loopt **26 t/m 29 november 2026**, hoofdprijstrekking **30 november**. Website, voorwaarden en sheet-script (`BF_OPEN = '2026-11-23'` in docs/google-sheet-scan-script.gs, teksten in black-friday.html / black-friday-terms.html / api/spin.js / campagneplan) nog aanpassen naar 26 nov vóór livegang, daarna sheet-script opnieuw plaatsen (stappen in CLAUDE.md, "Zelf plaatsen").
- **Budget:** "neem het budget dat nodig is", maar zuinig: goedkoopste model dat de kwaliteit haalt, eerst 1 test, nooit blind herhalen. Saldo begin 24-11 middag: ±2.700 credits (Ultra).
- "Spin the wheel" als tekst, niet haar gesproken shot.

## Storyboard (uit de briefing)
1. 0-4 s: close-up echte panterprint Jeep → match cut naar vacht levende panter → panter bij de Jeep. Tekst: "Black Friday has never been this FUNky!"
2. 4-8 s: dezelfde panter loopt nieuwsgierig door Willemstad.
3. 8-13 s: Daisy draait aan het rad (ritmisch, speed ramps). "ONE SPIN. ONE PRIZE." / "Every spin wins!"
4. 13-17 s: panter ontdekt het draaiende rad (reaction shots mogen).
5. 17-20 s: Daisy's schrikreactie.
6. 20-26 s: prijzen leesbaar (10 Killer Hooks, AI Power Pack, Content Rescue Kit, 30 Days of Ideas, Marketing SOS, Mystery FUNky Gift) + kans op The Ultimate FUNky Makeover. Duidelijk: 1 gegarandeerde prijs per deelnemer, niet alle.
7. 26-30 s: CTA: Free online spin · For businesses on Curaçao · November 26–29, 2026 · Grand prize draw: November 30 · FUNKINESS.AI · "Take a spin. Unleash your FUNky side."

Typografie: koppen DS Marker Felt in magenta #f21b7a (`productie/refs/DSMarkerFelt.ttf`, vrij voor commercieel gebruik), overige tekst Poppins. Geen tekst over gezicht, panter of rad; Reels-veilige zones; geen tekstvlakken.

## Wat er al is (allemaal 1080x1920, prijzen als bedrukking op het rad, effen naaf)
`productie/shots/print_*.mp4` (+ .json met rad-tracking):
- `p_tug` touwtrekken Daisy+panter (hand klopt) · `p_spin` Daisy zwiept, panter duikt weg · `p_confetti` confetti, panter mept · `p_schrik` schrikshot (720p opgeschaald, begin 0-1 s niet gebruiken: hand zweeft) · `p_stop` rad stopt, Daisy+panter kijken in camera · `panter_open` panter mept rad, Daisy kijkt · `panter_eind` panter ligt, Daisy praat (niet meer gebruiken).
- Oude shots zonder panter (shot2/3/4/6, doos): niet gebruiken.
Referenties `productie/refs/`: `panter-ref-crop.png` (DE panter, altijd meegeven), `scene-ref.png` (straat+rad+jurk), `start-jeep.png` (echte Jeep voor gele gevels in Willemstad, 9:16, uit "Marketing Jeep.jpg"), `start-straat.png` + `breedestraat-bron.png` (lege Breedestraat).
Echte Jeep-close-ups ook in `~/Desktop/Launch/Launch.mp4` (720p, 11-13 s panterprint zijkant). Jeep-foto's in de repo-root: jeep-*.jpg.

## Nog te maken (nieuwe AI-shots)
1. Panter bij de Jeep (scène 1): start_image `start-jeep.png`, panter stapt van achter de Jeep tevoorschijn, statische camera zodat belettering niet vervormt. Model kiezen: Kling 3.0 (i2v, start/end frame, geen referentiebeeld → panter kan afwijken) of Seedance 2.5 omni_reference (start_image + `panter-ref-crop.png` als image_reference → zelfde panter). Eerst kosten vergelijken (`estimate_video_cost`), dan 1 test.
2. Panter loopt door de Breedestraat (scène 2): start_image `start-straat.png`, zelfde aanpak.
3. Match cut: zoom op echte Jeep-print (foto of Launch.mp4) → crop van panter-vacht uit shot 1. Geen credits.

## Montage
Basis: `reel-maker/black-friday-spin-the-fun/montage_v7.py` (zachte snelheidscurves, overvloeiers, camerabeweging, rad-tikgeluiden, -14 LUFS, vibrance). Uitvoer moet 30 fps worden (nu 24). 96 fps-cache wordt opnieuw gemaakt uit print_*.mp4.
Verplichte shotcheck (skill video-regie): Daisy beweegt in elk shot, panter volledig zichtbaar, hand klopt met rad, niets staat stil, kleuren vol en zonnig, huid natuurlijk.

## Credits tot nu toe (Black Friday-video, cumulatief ±1.330)
Tests 114 · 6 rad-shots 480 · slotshot ±5 · panter-test 30 · 3 pantershots 240 · 3 pantershots (zelfde panter) 240 · touwtrek 80 · schriktest 30 · overige ±110.

## Daarna (na de commercial)
1. Cadeau-PDF's laten goedkeuren (`gifts/bf26-226dada8e958/`, bron `docs/black-friday-2026/cadeaus.py`).
2. Data naar 26 nov in site/voorwaarden/script, branch `black-friday` mergen en live zetten, echte testdeelname.
3. Daisy herinneren: link in Instagram- en TikTok-bio (UTM-links in campagneplan.md).
