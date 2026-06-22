# Island Host AI Prompt Kit: grote herstructurering en afronden

**Datum:** 2026-06-22 10:00
**Project:** FUNkiness! / Island Host AI Prompt Kit

---

## Island briefing callout toegevoegd aan How To Use

**Wat:** Zwarte callout-box toegevoegd met geografische briefing voor Curaçao, Aruba en Bonaire. Gebruiker plakt dit vóór de Fact Sheet in de AI-chat zodat de output locatiespecifiek klinkt.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - callout ingevoegd na power user tip, vóór toc-grid
**Waarom:** AI-output klinkt generisch zonder geografische context. Deze briefing zorgt ervoor dat het eiland meteen herkenbaar is in elke output.

---

## Geografische claims gecorrigeerd na factcheck

**Wat:** Eerdere versie had Curaçao op "13km van Venezuela" staan (incorrect). Na websearch gecorrigeerd naar "approximately 65km north of the Venezuelan coast". Aruba gecorrigeerd van 33km naar 27km (Paraguana-schiereiland). Bonaire (nationaal marien park 1979) en Eagle Beach (Aruba) geverifieerd als correct.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - island briefing callout teksten
**Waarom:** Daisy's instructie: geen onverifieerbare claims. Alle geografische feiten moeten uit bronnen komen, niet zelf verzinnen.

---

## Emdash én " - " separator verwijderd (99 instanties)

**Wat:** Via Python script 99 instanties van " - " (spatie-koppelteken-spatie als separator) vervangen door kolons, komma's of herschreven zinnen. Structurele labels zoals "01 - Airbnb Listing Description" werden "01: Airbnb Listing Description". Output labels zoals "Output 1 - Dutch market" werden "Output 1: Dutch market".
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - globale vervanging
**Waarom:** Daisy's instructie: zowel emdash als " - " als separator zijn verboden. Eén resterende instantie handmatig gecorrigeerd via Edit.

---

## SEO-regels toegevoegd aan listing description outputs

**Wat:** Aan alle Airbnb outputs (Dutch, American, Canadian) en VRBO outputs een korte SEO-instructieregel toegevoegd: schrijf voor de gast eerst, verwerk zoektermen (eilandnaam, woningtype, topkenmerken) vanzelfsprekend.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - promptteksten bijgewerkt per output
**Waarom:** Daisy wilde weten of SEO in de outputs moest. Besloten: ja, maar compact. Niet een apart hoofdstuk, gewoon één zin per output.

---

## Airbnb pad in expert note bijgewerkt

**Wat:** Stap-voor-stap pad bijgewerkt naar: "Airbnb > Listings > select your listing > Listing details > Description > Translated descriptions, click 'Add a translation'".
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - expert note Prompt 01
**Waarom:** Eerdere versie was te vaag ("go to your listing settings"). Gebruiker moet exact weten waar te klikken.

---

## Per-platform structuur voor Listing Descriptions

**Wat:** Listing Descriptions sectie volledig hergebouwd per platform: elk platform krijgt een eigen intro-pagina (met platformuitleg en algoritme-tips) gevolgd door de bijbehorende prompts. Volgorde: Airbnb (01-02) + intro, VRBO (03) + intro, Micazu (04) + intro, Universal/All Platforms (05-10) + intro.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - volledige herstructurering listing sectie
**Waarom:** Daisy wilde alles per platform gegroepeerd. Gebruiker die op VRBO verhuurt hoeft niet te zoeken tussen Airbnb-prompts.

---

## Social media differentiatie: SETUP prompt + "only I can say" veld

**Wat:** Twee aanpassingen om te voorkomen dat alle hosts dezelfde social captions krijgen: (1) SETUP prompt card (met zwarte SETUP-badge) die de AI traint op de schrijfstijl van de gebruiker vóór de sociale media prompts. (2) Verplicht veld "The detail only I can say" toegevoegd aan alle 10 social prompts (11-20).
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - SETUP card toegevoegd, veld toegevoegd aan prompts 11-20
**Waarom:** Als iedereen dezelfde prompt gebruikt, lijkt alle content hetzelfde. Voice training + unieke observatie per post lost dit structureel op.

---

## Grote herpositionering: focus op meer boekingen

**Wat:** Guest Emails (prompts 21-30 oud) en WhatsApp Messages (31-35 oud) volledig verwijderd. Vervangen door een nieuwe sectie "More Bookings: Algorithm & Visibility" met 10 nieuwe prompts (21-30). Host Content hernoemd naar "Host Profile" en hernummerd van 36-40 naar 31-35. Totaal: 35 prompts (was 50 of 40, afhankelijk van versie).
**Nieuwe prompts 21-30:**
- 21: Airbnb Algorithm Audit (14+ ranking factors)
- 22: Amenities Maximizer
- 23: Listing Photo Brief
- 24: Inquiry Conversion Reply
- 25: Review Velocity Strategy
- 26: Calendar Gap Campaign
- 27: Price Negotiation Response
- 28: Instant Book Setup
- 29: Superhost Action Plan
- 30: Platform Focus Strategy
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - grote herstructurering via Python script
**Waarom:** Daisy's herpositionering: "het gaat puur om zoveel mogelijk boekingen binnenkrijgen." Emails en WhatsApp zijn geen visibiliteitstool. Algoritme begrijpen is dat wel.

---

## Cover pagina bijgewerkt naar 35 prompts

**Wat:** Cover-eyebrow, cover-n (groot getal in achtergrond) en cover-tags bijgewerkt. "40" vervangen door "35". Tags "WhatsApp" en "Guest emails" verwijderd, vervangen door "More Bookings" en "Host Profile".
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - cover pagina
**Waarom:** Cover vermeldde nog de oude count en categorieën.

---

## CLAUDE.md bijgewerkt met actuele productstructuur

**Wat:** Island Host AI Prompt Kit beschrijving in CLAUDE.md volledig herschreven: 50 prompts -> 35 prompts, oude categorieën vervangen door huidige structuur, guest emails en WhatsApp verwijderd uit beschrijving, platformorganisatie en differentiatiestrategie gedocumenteerd.
**Bestanden:** `CLAUDE.md` - productsectie bijgewerkt
**Waarom:** CLAUDE.md had nog de beschrijving van de originele 50-prompt versie. Toekomstige sessies moeten de juiste structuur kennen.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Island briefing callout (Curaçao, Aruba, Bonaire) | Klaar |
| Geografische claims gefactcheckt en gecorrigeerd | Klaar |
| 99x " - " separator verwijderd | Klaar |
| SEO-regels in listing outputs | Klaar |
| Airbnb pad bijgewerkt in expert note | Klaar |
| Per-platform structuur listing descriptions | Klaar |
| SETUP voice-training prompt social media | Klaar |
| "Only I can say" veld prompts 11-20 | Klaar |
| Guest Emails en WhatsApp verwijderd | Klaar |
| More Bookings sectie (10 nieuwe prompts 21-30) | Klaar |
| Host Profile hernummerd 31-35 | Klaar |
| Cover bijgewerkt naar 35 prompts | Klaar |
| CLAUDE.md bijgewerkt | Klaar |
| Video Script Kit upsell ($19) | Volgende sessie |
| Gumroad live zetten | Nog te doen (Daisy) |
| TikTok lancering video | Nog te doen (Daisy) |
