# Website updates, logo implementatie en NFC visitekaartje

**Datum:** 2026-06-29 15:00
**Project:** Het Mainframe (FUNkiness! website)

---

## Doelgroeplijst homepage aangepast

**Wat:** Doelgroeplijst in de "What We Do" sectie ingekort en uitgebreid met nieuwe sectoren.
**Bestanden:** index.html - services-text aangepast
**Waarom:** Daisy wilde hospitality, tourism en overheid toevoegen. Na kritische review: lijst was te lang (8 items), "hospitality" en "tourism" als overkoepelende termen zijn redundant naast hotels/resorts. Teruggebracht naar 6 sterke items: hotels, resorts, tourism boards, real estate, vacation rentals, government.

---

## Berdien-tekst gecorrigeerd

**Wat:** "We made Curaçao home" vervangen door tekst die niet impliceert dat Berdien al op Curaçao woont.
**Bestanden:** index.html - funky-ladies-section alinea
**Waarom:** Absolute regel in CLAUDE.md: Berdien woont nog niet op Curaçao (aankomst eind oktober 2026). Nieuwe tekst: "We're Berdien and Daisy, two marketers from the Netherlands who decided Curaçao was the only logical next move."

---

## Twee scans zichtbaar op homepage

**Wat:** Scan-sectie op homepage uitgebreid zodat beide scans (Social Media Scan en Marketing Strategy Scan) zichtbaar en benoemd zijn.
**Bestanden:** index.html - scan-section, style.css - .scan-options en .scan-option CSS toegevoegd
**Waarom:** Bezoekers zagen alleen "Free AI & Marketing Scan" maar er zijn twee aparte scans. Door beide te benoemen daalt de drempel en verbetert SEO/GEO.

---

## Scan email-flow gecontroleerd

**Wat:** Beide scan APIs (api/scan.js en api/marketing-scan.js) gecontroleerd op email-functionaliteit.
**Bestanden:** api/scan.js, api/marketing-scan.js - gelezen, geen wijzigingen
**Waarom:** Daisy wilde weten of aanvragen en rapporten bij haar binnenkomen. Bevestigd: beide sturen (1) rapport-samenvatting naar aanvrager en (2) volledige lead-email met NAW + rapport naar sayhello@funkiness.ai.

---

## FUNkiness! logo geimplementeerd op alle pagina's

**Wat:** Tekst-logo "FUNkiness!" in de navbar vervangen door PNG-logo op alle 10 pagina's.
**Bestanden:** funkiness-logo.png (nieuw, gekopieerd van docs/), index.html, what-we-do.html, blog.html, blog-ai-curacao.html, blog-market-position-curacao.html, blog-marketing-strategy-curacao.html, faq.html, contact.html, scan.html, quiz.html, style.css
**Waarom:** Daisy heeft het illustratieve FUNkiness! logo (met tropische bloemen) aangeleverd als PNG met transparante achtergrond. Logo-grootte na iteratie: 100px mobiel, 120px desktop.

---

## NFC connect-pagina aangemaakt

**Wat:** Nieuwe landingspagina connect.html aangemaakt voor NFC-kaartje.
**Bestanden:** connect.html (nieuw)
**Waarom:** NFC-kaart linkt naar funkiness.ai/connect. Pagina toont logo, WhatsApp als primaire CTA (groen), Instagram, TikTok en website als secundaire links. Zwarte achtergrond, volledig on-brand.

---

## Printbaar NFC-visitekaartje ontworpen

**Wat:** HTML visitekaartje ontwerp aangemaakt (85x55mm, drukklaar).
**Bestanden:** docs/visitekaartje.html (nieuw)
**Waarom:** Daisy wil NFC-kaarten laten drukken. Na meerdere iteraties: voorkant zwart met logo, "AI, Social Media & Marketing", tagline, "Daisy & Berdien"; panterprint onderaan met golvende bovenrand via SVG clipPath. Achterkant crème met golvende panterprint bovenaan, NFC-icoon, contactgegevens.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Doelgroeplijst homepage inkorten en uitbreiden | Klaar |
| Berdien "We made Curaçao home" fout herstellen | Klaar |
| Beide scans zichtbaar op homepage | Klaar |
| Scan email-flow dubbelchecken | Klaar |
| FUNkiness! PNG-logo implementeren op alle pagina's | Klaar |
| Logo-grootte itereren naar juiste formaat | Klaar |
| NFC concept uitleggen en beslissen | Klaar |
| connect.html landingspagina aanmaken | Klaar |
| Printbaar visitekaartje ontwerpen met panterprint | Klaar (in iteratie, golf nog niet definitief) |
