# Island Host AI Prompt Kit: product gebouwd van scratch

**Datum:** 2026-06-17 17:00
**Project:** FUNkiness! website / digitaal product

---

## Productconcept bepaald

**Wat:** Besloten om een downloadbaar digitaal product te maken: "The Island Host AI Prompt Kit" - 50 AI-prompts voor vakantieverhuurders op Aruba, Bonaire en Curaçao.
**Waarom:** Daisy wilde op korte termijn naamsbekendheid creëren en geld verdienen met een online product rondom AI. Downloadbaar product op $27 is snelste route: nul ontwikkeltijd, directe revenue, niche (ABC eilanden verhuurders) zonder concurrentie.

---

## Prijsstructuur en upsell bepaald

**Wat:** Basisproduct $27, upsell Video Script Kit voor $19. Verkoop via Gumroad in USD.
**Waarom:** Daisy vond $47 te hoog voor de initiële versie. $27 verlaagt drempel, $19 upsell voor video scripts is logische volgende stap. USD via Gumroad is de makkelijkste betaalroute.

---

## 50 prompts geschreven (markdown)

**Wat:** Alle 50 prompts uitgewerkt in 6 categorieën en opgeslagen als markdown referentiebestand.
**Bestanden:** `docs/island-host-ai-prompt-kit.md` - aangemaakt
**Categorieën:** Listing descriptions (10), review responses (10), social media captions (10), guest emails (10), WhatsApp messages (5), FAQ/host content (5)

---

## HTML product gebouwd (eerste versie)

**Wat:** Professioneel opgemaakte HTML-versie van de prompt kit gebouwd met FUNkiness! branding. Geen Canva nodig - gebruiker opent in browser en slaat op als PDF via Cmd+P.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - aangemaakt
**Design:** Cover pagina (zwart), categorie-header pagina's (zwart), prompt pagina's (crème), back cover (roze). FUNkiness! kleuren, Poppins/Inter/Permanent Marker fonts.

---

## Copy-to-clipboard knop toegevoegd

**Wat:** JavaScript toegevoegd dat automatisch een "Copy prompt" knop toevoegt aan elke prompt card. Één klik kopieert de volledige prompt tekst naar het klembord.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - copy button CSS + JS toegevoegd
**Techniek:** `navigator.clipboard.writeText()` met fallback naar `execCommand('copy')`. Knoppen verdwijnen bij printen via `@media print`.

---

## Booking.com prompt vervangen door Listing Title Optimizer

**Wat:** Prompt 2 was een Booking.com description prompt - onjuist omdat Booking.com anders werkt dan Airbnb. Vervangen door een Listing Title Optimizer die werkt voor alle platforms (Airbnb 50 chars, VRBO 80 chars, direct website).
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - prompt 2 herschreven
**Waarom:** Op Booking.com beslissen gasten op foto's, prijs en reviews. De listing titel is het meest ondergeoptimaliseerde element op alle platforms.

---

## Micazu prompt volledig in het Nederlands herschreven

**Wat:** Prompt 4 (Micazu) volledig omgezet naar Nederlands, inclusief instructies, placeholders en toon-richtlijnen.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - prompt 4 herschreven
**Waarom:** Micazu is een Nederlands platform voor Nederlandse gasten. De prompt moet in het Nederlands zijn voor minimale wrijving bij gebruik.

---

## Permanent Marker regel op alle roze tekst toegepast

**Wat:** Alle roze tekst-elementen in de HTML voorzien van `font-family: 'Permanent Marker', cursive`. Includes: cover title accent, placeholders, categorie labels, inhoudsopgave nummers, brand naam accent.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - CSS bijgewerkt
**Geheugen opgeslagen:** `feedback_permanent_marker_roze.md` - alle roze tekst altijd in Permanent Marker

---

## Volledige herstructurering en verrijking van het product

**Wat:** Volledige herschrijving van de HTML met vier grote verbeteringen:
1. **Property Fact Sheet pagina** (nieuw) - digitaal invulbare pagina die gebruiker eenmalig invult en bij alle prompts gebruikt als referentie
2. **Expert notes** bij elke prompt - echte vakkennis over waarom de prompt zo gebouwd is (bv. "Airbnb toont eerste 140 tekens in zoekresultaten", "een mid-stay check-in vermindert negatieve reviews significant")
3. **Verbeterde "How to Use" pagina** met insider tip over variaties genereren
4. **Specifiekere, professionelere promptteksten** met minder AI-gevoel
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - volledig herschreven
**Waarom:** Daisy wilde dat het product het gevoel geeft dat het niet "even in AI gemaakt" is. Expert notes en de fact sheet tillen het product naar een professioneel niveau.

---

## Gumroad verkooptekst geschreven

**Wat:** Volledige productpagina copy voor Gumroad uitgewerkt: titel, tagline, beschrijving met bulletpoints per categorie, CTA.
**Opgeslagen in:** conversatie (nog niet in bestand)

---

## Marketing strategie ABC eilanden uitgewerkt

**Wat:** 5-staps TikTok/Instagram lancering strategie, WhatsApp aanpak voor lokale groepen, Facebook groepen per eiland, hashtags per eiland (Aruba, Bonaire, Curaçao).
**Opgeslagen in:** conversatie (nog niet in bestand)

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Productconcept en prijsstructuur bepaald | Klaar |
| 50 prompts geschreven | Klaar |
| HTML product gebouwd met FUNkiness! branding | Klaar |
| Copy-to-clipboard functionaliteit | Klaar |
| Booking.com prompt vervangen door Title Optimizer | Klaar |
| Micazu prompt volledig in Nederlands | Klaar |
| Permanent Marker op alle roze tekst | Klaar |
| Property Fact Sheet pagina toegevoegd | Klaar |
| Expert notes bij alle 50 prompts | Klaar |
| Gumroad verkooptekst | Klaar (in conversatie) |
| Marketing strategie ABC eilanden | Klaar (in conversatie) |
| Video Script Kit (upsell $19) | Volgende sessie |
| Gumroad live zetten | Nog te doen (Daisy) |
| TikTok lancering video opnemen | Nog te doen (Daisy) |
