# Visitekaartje print-klaar gemaakt, Berdien-variant ontworpen, Graphic-Design map opgezet

**Datum:** 2026-09-03 12:00
**Project:** FUNkiness! (Het Mainframe)

---

## Visitekaartje (Daisy) print-klaar gemaakt richting drukwerkdeal.nl

**Wat:** Doorlopen van het hele traject om `docs/visitekaartje.html` daadwerkelijk te laten drukken. Contactregels op de achterkant vergroot van 7pt naar 8pt op verzoek, waarbij bleek dat de mailregel ("sayhello@funkiness.ai") daardoor nog maar 1,56mm van de snijlijn stond, onder de vereiste 3mm-veiligheidsmarge van drukwerkdeal. Opgelost met een kleine letter-spacing van -0.4px op de hele contactregel-klasse (onzichtbaar voor het oog, wel genoeg ruimte gewonnen: 3,74mm). Een eerdere poging om dit op te lossen door de labelkolom te versmallen werd teruggedraaid omdat "WhatsApp:" daardoor in het telefoonnummer liep. Bouwtekening-PDF (91x61mm, achtergronden intact dankzij toegevoegde `print-color-adjust: exact`) opnieuw gegenereerd met headless Chrome na de aanpassing.
**Bestanden:** `docs/visitekaartje.html` (nu `docs/Graphic-Design/visitekaartje.html`, zie map-reorganisatie verderop), bouwtekening-PDF.
**Waarom:** Klaarmaken voor een daadwerkelijke bestelling bij drukwerkdeal.nl.

---

## Affinity-traject voor CMYK-conversie doorlopen, uiteindelijk losgelaten

**Wat:** Uitgebreid stappenplan gegeven voor het overzetten van de bouwtekening naar Affinity Publisher (CMYK/8, Coated FOGRA39-profiel, tekst en QR-code handmatig naar puur zwart C0 M0 Y0 K100 i.p.v. rich black, export als PDF/X-4:2008). Onderweg diverse concrete obstakels opgelost: PDF-importinstellingen (DPI, colour space), tekst die na import curves i.p.v. bewerkbare tekst bleek te zijn waardoor de Text tool niet werkte, een regel ("Socials") die door de PDF-import samengevoegd bleek met de WhatsApp-regel in één tekstblok, en een sneltoets-verwarring (T typen i.p.v. tool selecteren omdat de cursor nog in een tekstveld stond).
Uiteindelijk, na herhaalde frustratie ("ik kom er niet uit"), bewust gestopt met de Affinity-route voor dit kaartje: de Chrome-gegenereerde RGB-bouwtekening rechtstreeks naar drukwerkdeal geupload, die zet RGB automatisch om naar CMYK. Enige bewuste risico: het felle FUNkiness!-roze kan iets minder knallend ogen na automatische conversie (fundamentele CMYK-gamut-beperking, geen fout). Daisy heeft besteld en bevestigd: **print is goed gegaan.**
**Bestanden:** geen (proces/beslissing).
**Waarom:** De handmatige Affinity-correctie kostte disproportioneel veel tijd voor een visitekaartje; de praktische route bleek voldoende en is nu de bevestigde werkwijze voor toekomstige kleine drukwerkjes bij drukwerkdeal.

---

## Nieuwe map docs/Graphic-Design/ aangemaakt, alle ontwerpbestanden gereorganiseerd

**Wat:** Op verzoek van Daisy ("anders wordt het een zooitje") een aparte submap gemaakt voor alle visuele ontwerpbestanden, gescheiden van planning/tekst-documentatie in `docs/`. Bewust `Graphic-Design` (met koppelteken) gekozen i.p.v. een spatie, omdat een spatie in de mapnaam de live og:image-URL van de root-marketingpagina zou breken. 18 bestanden/mappen verplaatst via `git mv`: logo's (FunkinessLogo.png/svg, Funkiness Marketing Curacao.png), foto's (daisy-foto.jpg, daisy-foto-cutout.png, beach.jpg), panterprint.png, funkiness-scan-qr.svg, visitekaartje.html + bouwtekening-PDF, de Island Host Prompt Kit HTML + Gumroad-cover + media-map, beide mobile-office previews, strategieplan-printbaar.html en de social-posts-augustus-2026 map.
Alle interne verwijzingen gecontroleerd en gefixt: relatieve paden in visitekaartje.html (`../funkiness-logo.png` en `../panterprint.png` werden `../../...`), relatieve paden in de mobile-office previews (`../Office back.png` werd `../../...`), de drie verwijzingen naar de media-map in de root-marketingpagina `island-host-ai-prompt-kit.html` (og:image, twitter:image, img src), de relatieve link in `docs/island-host-ai-prompt-kit.md`, en vijf paden in `CLAUDE.md`. `docs/island-host-ai-prompt-kit.md` bleef bewust in `docs/` staan (tekstreferentie, geen ontwerp).
**Bestanden:** zie boven, plus `CLAUDE.md`, `docs/island-host-ai-prompt-kit.md`, `docs/social-media-plan-augustus-2026.md`, `island-host-ai-prompt-kit.html` (root).
**Waarom:** Overzicht houden in `docs/` nu het aantal ontwerpbestanden groeit.

---

## Nieuw visitekaartje-ontwerp voor Berdien: blanco voor handgeschreven naam en telefoonnummer

**Wat:** Nieuw bestand `docs/Graphic-Design/visitekaartje-berdien.html` gebouwd op basis van het bestaande visitekaartje-ontwerp. Voorkant ongewijzigd. Achterkant aangepast: geen foto (Berdien woont nog niet op Curaçao, zie [[project_berdien_aankomst]]) en geen voorgedrukte naam, in plaats daarvan blanco ruimte zodat Berdien haar naam en telefoonnummer zelf met een pen kan invullen. Layout-iteratie: eerst per-regel gecentreerd (zag er rommelig uit door ongelijke regellengtes), daarna gecorrigeerd naar een blok dat als geheel gecentreerd staat op de kaart maar intern netjes links uitgelijnd is (labels en dubbele punten op één lijn, zoals het origineel). Een WhatsApp-regel toegevoegd met blanco ruimte voor het nummer. Op verzoek van Daisy zijn de aanvankelijke visuele hulplijnen (een roze lijn voor de naam, een onderstreping voor het nummer) weer verwijderd, gewoon lege ruimte in plaats daarvan. Ruimte geverifieerd: 17mm hoogte voor de naam, ca. 52mm breedte na "WhatsApp:" tot de veilige rand, ruim voldoende voor handschrift.
Bouwtekening-PDF gegenereerd (`docs/Graphic-Design/visitekaartje-berdien-bouwtekening.pdf`, 91x61mm, 2 pagina's), klaar om net als Daisy's kaartje rechtstreeks bij drukwerkdeal.nl te uploaden.
**Bestanden:** `docs/Graphic-Design/visitekaartje-berdien.html` (nieuw), `docs/Graphic-Design/visitekaartje-berdien-bouwtekening.pdf` (nieuw).
**Waarom:** Berdien heeft nog geen foto en geen vast Curaçao-telefoonnummer, maar moet wel een eigen visitekaartje kunnen gebruiken.

---

## Geheugennotitie: sneller antwoorden bij simpele vragen

**Wat:** Vastgelegd dat bij simpele/korte vragen (ook tussendoor tijdens een tool-workflow zoals Affinity) een direct antwoord moet volgen, geen uitgebreide verificatie-pijplijn of lange genummerde lijst. Twee keer gecorrigeerd in deze sessie.
**Bestanden:** `feedback_snelheid_simpele_vragen.md` (nieuw/bijgewerkt), `MEMORY.md`.
**Waarom:** Terugkerend patroon, relevant voor elke toekomstige sessie.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Visitekaartje Daisy: 8pt contactregels zonder marge-overtreding | Klaar |
| Affinity CMYK-traject doorlopen, uiteindelijk losgelaten voor directe RGB-upload | Klaar (besteld, print goed gegaan) |
| docs/Graphic-Design/ map opgezet, 18 bestanden verplaatst, alle verwijzingen gefixt | Klaar |
| Visitekaartje-ontwerp Berdien (blanco naam + telefoonnummer) | Klaar |
| Bouwtekening-PDF Berdien-kaartje | Klaar, nog te bestellen |
| Geheugennotitie snelheid bij simpele vragen | Klaar |
