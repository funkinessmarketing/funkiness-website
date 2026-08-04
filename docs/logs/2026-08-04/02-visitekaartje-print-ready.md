# Visitekaartje print-klaar gemaakt: bleed, leesbaarheid, fotofix en aanleverspecs

**Datum:** 2026-08-04 12:00
**Project:** Het Mainframe (FUNkiness!)

---

## Bleed en print-paginaformaat toegevoegd

**Wat:** `docs/visitekaartje.html` had geen afloop (bleed) en de `@media print`-instelling stond nog op A4 met marge, terwijl Daisy het kaartje professioneel laat drukken bij drukwerkdeal.nl. Kaart vergroot van 85x55mm (trim) naar 91x61mm (trim + 3mm bleed rondom), met een screen-only dashed "trim-line" hulplijn die de snijlijn toont maar niet meeprint. `@page` staat nu op exact 91x61mm zonder marge in plaats van A4, anders is de bleed in de PDF nutteloos voor de drukker. Alle content (tekst, logo, foto, QR) is met dezelfde 3mm gecompenseerd zodat de relatieve positionering ten opzichte van de oorspronkelijke snijlijn behouden bleef. `border-radius` en de decoratieve `border` op `.card` worden nu ook expliciet uitgeschakeld bij printen, anders zouden de hoeken van de bleed-rechthoek rond geknipt worden.
**Bestanden:** `docs/visitekaartje.html`
**Waarom:** Daisy liet weten dat ze bij drukwerkdeal.nl gaat bestellen; zonder bleed en zonder correct paginaformaat krijg je witranden na het snijden.

---

## Aanleverspecificaties drukwerkdeal doorgenomen en toegepast

**Wat:** Daisy deelde de officiele "Aanleveren - CMYK Drukwerk"-PDF van drukwerkdeal. Gecheckt puntje voor puntje: minimale lettergrootte 6pt (alles stond op 5-5,6pt, nu 7-13pt), lettertypen volledig ingesloten (al zo, base64 embedded), resolutie 300 DPI (logo en panterprint ruim boven, foto ~265 DPI, mag volgens spec vanaf 150 DPI), geen snijtekens (trim-line print niet mee), en het punt over "diep zwart alleen voor grote vlakken, nooit voor kleine tekst/fijne elementen". Twee plekken gebruikten een niet-zuiver zwart (`#080403`, met een lichte kleurzweem): de contactgegevens-tekst en de QR-code path. Beide omgezet naar puur `#000` om kleurschifting bij lichte drukstand-afwijking te voorkomen.
**Bestanden:** `docs/visitekaartje.html`
**Waarom:** Letterlijke eis uit de aanleverspecs, voorkomt een print die er wazig/onscherp uitziet op kleine tekst en de QR-code.

---

## Grote contentherziening op verzoek van Daisy

Meerdere rondes aanpassingen, telkens met een render-en-check-loop (headless Chrome screenshot, crop, visueel beoordelen) in plaats van blind CSS wijzigen:

- **Typografie:** "AI, Social Media & Marketing" van Inter 5pt naar Poppins 900 8pt. "Boring was never the plan" van 8,5pt naar 13pt. "Daisy Kuipers" op de achterkant van Poppins naar Permanent Marker (volgens de merkregel: alle roze tekst in Permanent Marker). Logo op de voorkant van 50mm naar 54mm.
- **Eerste poging te groot:** bij 9pt/15pt/58mm brak de tekst af naar een tweede regel en raakte de tagline de panterprint-band. Teruggebracht naar de huidige waarden na visuele render-check, met `white-space: nowrap` als vangnet.
- **QR-code:** van 11x11mm naar 15x15mm, en op een wit rond blokje (`.qr-plate`, 18x18mm) gezet zodat hij ook dicht tegen de panterprint aan nog scanbaar blijft (een QR-code zonder eigen contrasterende achtergrond leest niet betrouwbaar tegen een druk patroon).
- **Fotofix (grijze waas om het haar):** origineel bronbestand `daisy-foto.jpg` (met de zachte grijze blob-achtergrond) opnieuw uitgesneden met een Python/PIL-script: kleurdecontaminatie tegen de originele achtergrondkleur plus alpha-erosie en een steilere contrastcurve op het randmasker. Resultaat overschrijft `docs/daisy-foto-cutout.png` direct (oude versie tijdelijk als backup bewaard, later op verzoek verwijderd na bevestiging dat de vervanging goed stond).
- **Foto laten doorlopen in de panterprint:** breedte van 32mm naar 34mm, waardoor de kruin/krullen zichtbaar overlappen met de golf bovenaan. `z-index` van de foto boven de panterprint gezet zodat haar silhouet natuurlijk over het patroon heen valt in plaats van dat het patroon haar haar afsnijdt.
- **Mailadres te dicht op de rand:** `.contact-row` gebruikt `white-space: nowrap`, dus de tekstlengte is vast en reageert niet op het wijzigen van de rechtermarge. Opgelost door het hele infoblok 2,5mm dichter naar de foto te schuiven en de labelkolom ("Mail:", "WhatsApp:") 2mm smaller te maken, in plaats van de foto zelf te verplaatsen (die staat bewust tegen de bleed-rand).
- **Tekst voorkant "een tikkeltje omhoog":** onderpadding van de voorkant met 3mm vergroot, waardoor het gecentreerde logo+tekst-blok als geheel iets hoger komt te staan.
- **Telefoonnummer-opmaak:** van `+5999 675 1737` naar `+599 9 675 1737` (twee correctierondes op verzoek van Daisy, landcode los van het nummer).

**Bestanden:** `docs/visitekaartje.html`, `docs/daisy-foto-cutout.png` (vervangen)
**Waarom:** Leesbaarheid en visuele afwerking op verzoek van Daisy, met expliciete check op printformaat (300dpi-render) voor de "is dit straks echt leesbaar"-vraag.

---

## Oude bestanden opgeruimd

**Wat:** `docs/visitekaartje-print.html` en `docs/visitekaartje-print.pdf` (17 juli, losstaande oudere versie) verwijderd na bevestiging van Daisy, dit was het "oude kaartje" dat ze nog in de map zag staan. Zaten in git history, dus terug te halen indien nodig.
**Bestanden:** verwijderd: `docs/visitekaartje-print.html`, `docs/visitekaartje-print.pdf`

---

## Workflow naar Affinity en drukwerkdeal uitgestippeld

**Wat:** Omdat Chrome geen CMYK/PDF-X4 kan exporteren (alleen RGB), maar Daisy wel de volledige prepress-controle wil, is een concreet stappenplan gegeven: Chrome-PDF als bouwtekening plaatsen in een nieuw Affinity Publisher-document (85x55mm + 3mm bleed, CMYK, Coated FOGRA39), zwart handmatig verifieren/corrigeren naar C0 M0 Y0 K100, en exporteren met het ingebouwde PDF/X-4:2008-preset zonder snijtekens. Daarna bestellen bij drukwerkdeal.nl als "eigen ontwerp aanleveren", 85x55mm, dubbelzijdig 4/4.
**Waarom:** Bewuste keuze van Daisy om niet te vertrouwen op drukwerkdeal's automatische RGB-naar-CMYK-conversie, maar zelf de kleuromzetting te controleren.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Bleed 3mm + correct printpaginaformaat (91x61mm) | Klaar |
| Aanleverspecs drukwerkdeal gecheckt en toegepast (lettergrootte, zuiver zwart, resolutie) | Klaar |
| Typografie voorkant vergroot (Poppins/Permanent Marker) en fijngeslepen na overflow-test | Klaar |
| QR-code vergroot, verplaatst, op wit blokje voor contrast | Klaar |
| Grijze waas rond haar op foto opgelost (nieuwe cutout uit origineel) | Klaar |
| Foto laten doorlopen in panterprint via z-index en formaat | Klaar |
| Mailadres-overflow opgelost door tekstblok te verschuiven | Klaar |
| Telefoonnummer-opmaak gecorrigeerd | Klaar |
| Oude losse kaartje-bestanden opgeruimd | Klaar |
| Stappenplan Affinity + drukwerkdeal gegeven | Klaar |
| Daadwerkelijk bestellen bij drukwerkdeal | Openstaand (bij Daisy) |
