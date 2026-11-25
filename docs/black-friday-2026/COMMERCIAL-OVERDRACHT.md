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

## Stand 24-11-2026 (avond): commercial klaar
- Eindbestand: `productie/FUNkiness_BlackFriday_2026_FINAL.mp4` (1080x1920, 30 fps, 27,9 s, BT.709, -13,7 LUFS, piek -1,1 dBFS).
- Nieuw: `print_jeep.mp4` en `print_straat.mp4` (Seedance 2.5 omni_reference, 720p, 4 s, 28 credits per stuk, zelfde panter via `panter-ref-crop.png`), `print_intro.mp4` (push-in op echte Jeep-foto `jeep-side.jpg`).
- Montage: `docs/Filmpjes Curacao eiland/reel-maker/black-friday-spin-the-fun/montage_v8.py` (draaien met het pad naar `productie/shots`).
- Weggelaten na shotcheck: `panter_open` (Daisy staat stil, panter half achter rad), p_tug eerste 2,5 s en p_schrik vanaf 2,7 s (panter verborgen of alles stil).
- Credits deze sessie: 56. Totaal Black Friday-video ±1.386. Saldo na afloop ±2.628.
- Open: Daisy keurt de commercial; ondertitels staan bovenin (niet over panter of gezicht).

## Update 24-11-2026 (late avond): feedback Daisy verwerkt
- Kleur: saturatie overal omlaag (WARM 0,95, vibrance 0,05, eind-eq 0,98), Jeep-shot koeler tegen oranje gloed op de panter.
- Panter draait nu zelf aan het rad, om en om met Daisy: p_spin (Daisy) > draai_C (panter) > p_schrik (Daisy) > draai_A (panter) > p_confetti (Daisy) > p_stop. Nieuwe shots `print_draai_A.mp4` en `print_draai_C.mp4` (Seedance 2.5 omni_reference op `scene-ref.png`, 720p, daarna op 1080 gezet en bedrukt met `rad_bedrukking.py`; prijzen blijven achter de panter via `seg_inst.swift` + `kies_panter.py` in de reel-maker-map). Variant B (panter achter het rad) is verwijderd.
- Credits: +84 (3 x 28). Totaal Black Friday-video ±1.470.
- Lengte 30,5 s, -13,7 LUFS, piek -1,3 dBFS.

## Update 25-11-2026 (ochtend): tweede feedbackronde Daisy verwerkt
- Opening: Jeep-shot te glad/AI (wartaal op het raam). Nu eerst de echte Jeep-foto (push-in, handheld, korrel, titel onderin), daarna de panterwandeling uitgesneden op de panter (raamtekst buiten beeld), korrel + lagere scherpte/contrast.
- Slot: de verbaasde blik in de camera (p_stop na 1,9 s) is weg. Nieuw shot `print_zwaai.mp4` (Seedance 2.5, 28 credits): panter zwaait zoals in de footer van de site, Daisy lacht en zwaait mee. Prijzen als bedrukking (rad_bedrukking.py).
- Actie duidelijker en meer dynamiek: ondertitel "SPIN. STOP. WIN!" en "TAKE YOUR FREE SPIN!", kleine camera-punch bij elke knip, whoosh op elke knip, bel bij het stoppen van het rad.
- Resultaat: 29,5 s (max 30 s, daarna alle shots en eindkaarten ingekort), -14,4 LUFS, piek -1,5 dBFS. Credits +28 (totaal Black Friday-video ±1.498).
- 25-11 later: gezicht op 0:20 klopte niet (zwaai-shot uit referentiebeelden). Zwaai-shot opnieuw gemaakt met een echt frame uit p_stop als beginframe (`refs/start-zwaai.png`, Seedance 2.5 omni_reference start_image, 28 credits). Les: elk shot met Daisy's gezicht vanuit een echt frame van haar eigen opname starten, nooit alleen vanuit scene-ref. Eindstand: 29,7 s, -14,5 LUFS, piek -1,8 dBFS. Credits totaal Black Friday-video ±1.526.
- 25-11 (middag), feedback Daisy verwerkt: (1) intro scherp: push-in nu op de echte hoge-resolutie foto `Marketing Jeep.jpg` (2268x4032) i.p.v. de 900 px jeep-side.jpg; (2) één straat: het Jeep-shot in de gele straat is eruit, panter loopt direct in de Breedestraat (straat-shot) en blijft daar; (3) overgang panter -> rad: ondertitel "WAIT... WHAT'S THAT?", rad tikt al voor de knip (J-cut), whip-pan op de knip; (4) slotshot: Daisy kijkt NIET meer in de camera (vervormt haar gezicht), ze kijkt naar de panter, panter zwaait groot in beeld (`print_zwaai.mp4`, 28 credits extra), geen ondertitel op dat shot; (5) kleur Breedestraat voller (saturatie/vibrance/contrastkromme), niet overdreven. Eindstand 29,1 s, -13,7 LUFS, piek -1,2 dBFS. Credits totaal Black Friday-video ±1.554.

## Harde eis Daisy (25-11-2026): realisme, niet glad en AI-achtig
Elk shot moet eruitzien als een echte opname: echte foto/opname als basis waar het kan, handheld beweging, lichte filmkorrel, niet oververscherpen, geen plastic huid of perfect gladde vacht, natuurlijke (niet oververzadigde) kleuren, geen wartaal-tekst op ramen of borden, echte schaduwen en contact met de grond. Leg elk AI-shot naast een echte opname: valt het op als AI, dan eruit of opnieuw. Dit hoort bij de verplichte shotcheck.

## Marketingcheck 25-11-2026: aanpassingen voor de commercial (nog niet verwerkt)
- Eindkaart "ONE GUARANTEED PRIZE for every spin. Pick yours:" klopt niet, je kiest niet, het rad bepaalt. Wordt "Spin yours:".
- Marketing SOS staat in de lijst als gewone prijs, maar is beperkt (5 totaal, 2 per dag). Zet er "while available" bij of laat SOS uit de lijst.
- Verder kloppen datums (26-29 nov, trekking 30 nov) en slogan.
- Site, voorwaarden en sheet-script zijn op 25-11 aangepast naar 26 nov en SOS max 2 per dag; sheet-script staat live (reageert nu "nog-niet").
- 25-11 (namiddag): Daisy eruit in het slotshot (haar gezicht vervormt zodra ze lacht): zwaai-shot is nu alleen de panter (crop, geen badge). "BLACK FRIDAY" veel duidelijker: grote DS Marker Felt-titel (magenta met witte rand) in de intro, kleine badge bovenin op alle rad-shots, groot op prijskaart en eindkaart. Slotbeeld na de teksten: panter loopt weer weg door de Breedestraat (`print_wegloop.mp4`, start-frame = laatste frame straat-shot, 28 credits) met FUNKINESS.AI en fade-out. Eindstand 29,7 s, -13,7 LUFS, piek -1,0 dBFS. Tussenbestanden `productie/shots/_v3` bewaard zodat een kleine wijziging in minuten rendert. Credits totaal Black Friday-video ±1.582, saldo ±2.432.
- 25-11 (avond): nieuwe volgorde op verzoek van Daisy. Opent nu met de wandelende panter in de Breedestraat + grote "BLACK FRIDAY" titel (hook), dan "WAIT... WHAT'S THAT?", whip-pan naar het rad. De Jeep (scherpe foto Marketing Jeep.jpg, push-in) staat nu vlak voor de eindkaarten als "SPIN AT FUNKINESS.AI" (het raam van de Jeep toont FREE Business Marketing SCAN + www.funkiness.ai). Daarna prijskaart, eindkaart, slotbeeld panter loopt weg.
- Drie verbeteringen uitgevoerd: (1) scherper: straat-, zwaai- en wegloop-shot opgeschaald naar 1080p via Higgsfield upscale_video (bytedance, preset aigc, ±1 credit per shot). Les: upscalen is bijna gratis, altijd doen voor AI-shots. (2) cuts op de beat: muziek 123 bpm, eerste beat 0,65 s, shots worden tot max 0,3 s ingekort zodat elke knip op een beat valt. (3) echte geluiden (Epidemic Sound via Higgsfield, in `productie/refs/sfx/`): rad-draait, panter-spinnen, panter-pootjes; synthetische whoosh/tik/bel/confetti blijven eronder.
- Eindstand 28,7 s, -13,8 LUFS, piek -1,2 dBFS. Montagescript heeft nu hook-titel (`bfwhat`), badge, beat-snap en echte sfx. Tussenbestanden in productie/shots/_v3 bewaard.
- 25-11 (late avond): tekst teruggebracht op verzoek van Daisy (te veel tekst voor de korte tijd). Opening nu direct "BLACK FRIDAY / ON CURAÇAO / SPIN & WIN A FREE MARKETING GIFT!" boven de wandelende panter; badge "BLACK FRIDAY ON CURAÇAO" op de rad-shots. Gift-lijst (6 prijzen) eruit: die staat in de caption en op de site. Prijskaart nu "ONE FREE MARKETING GIFT for every spin + a chance at The Ultimate FUNky Makeover"; eindkaart "BLACK FRIDAY ON CURAÇAO / FREE ONLINE SPIN / November 26-29, 2026 / FUNKINESS.AI". Ondertitels "EVERY SPIN WINS" en "WATCH OUT FOR THE PANTHER" geschrapt. Panter loopt langer weg (2,8 s, iets slowmotion). Eindstand 28,6 s, -13,7 LUFS, piek -1,4 dBFS. Let op voor caption/site: "Grand prize draw: November 30" en "For businesses on Curaçao" staan niet meer in beeld, wel in caption zetten.
