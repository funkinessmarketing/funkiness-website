# Prompt Kit lancering: betaalprovider-crisis, Gumroad live, grote kritische contentherziening

**Datum:** 2026-08-04 00:00
**Project:** Het Mainframe (FUNkiness!)

---

## Strategische koerswijziging: Prompt Kit wordt prioriteit 1, Spark Plan geparkeerd

**Wat:** Op verzoek van Daisy ("we willen eerst starten met online producten die we kunnen verkopen") is de volgorde in het strategieplan omgedraaid. De Island Host AI Prompt Kit ($27, eenmalige aankoop) werd prioriteit 1 van spoor B, The Spark Plan (abonnement) is geparkeerd.
**Bestanden:** `kennis/strategieplan.md`, `docs/strategieplan-printbaar.html` (Volgorde van werk, productstatus-tabel, Marketinguitvoeringsplan, dagindeling, open beslispunten allemaal bijgewerkt).
**Waarom:** Een abonnement van $500-750/maand vragen aan een onbekend merk zonder trackrecord is een zware ask. Een eenmalige aankoop van $27 is een veel kleinere vertrouwensdrempel en dient als bewijs (kopers/testimonials) om de Spark Plan-ask later wel te kunnen maken.

---

## Betaalprovider-crisis: Curaçao wordt nergens ondersteund

**Wat:** Bij het instellen van Gumroad bleek Curaçao niet ondersteund voor uitbetaling. Uitgezocht en stuk voor stuk afgevallen: Gumroad (geen bank/PayPal-optie voor CW), Payoneer (niet in Americas-lijst), Lemon Squeezy (ook niet), Fygaro (Caribische betaalgateway, wel legitiem maar geen bevestigde CW-dekking). MCB Bank Internet Merchant Account bleek een reële optie te hebben, maar de Final Review vereist cedula (Daisy ontvangt die pas 12 augustus), KvK-inschrijving (nog niet gestart) en een lopende zakelijke rekening, realistisch pas eind 2026 haalbaar.
**Definitieve oplossing:** Gumroad-account op land Nederland gezet, uitbetaling naar Daisy's Nederlandse privérekening (Knab, EUR). Bewuste, expliciet afgewogen keuze: lokaal ontvangen op Curaçao is in de praktijk niet werkbaar voor dit soort verkoop, en het MCB-traject duurt te lang.
**Bestanden:** `kennis/strategieplan.md` (nieuwe sectie onder Open beslispunten met de volledige beslisboom).
**Openstaand:** administratieve scheiding tussen deze NL-rekening en de Curaçaose boekhouding is nog geen uitgewerkt proces.

---

## Gumroad product live gezet

**Wat:** Bestaand Gumroad-conceptproduct (`yfefbu`, aangemaakt door Daisy) afgemaakt: prijs $27 bevestigd, Payouts-instellingen (NL/IBAN/Individual), custom landingpagina gebouwd en gepubliceerd via de Gumroad CLI (`gumroad products page publish`).
**Bestanden:** `landing.html` (gebouwd in scratchpad, gepubliceerd naar Gumroad, niet in de repo), custom fonts (Permanent Marker, Poppins Black) als base64 ge-inlined voor huisstijl-consistentie zonder externe font-requests in Gumroad's sandbox.
**Technisch obstakel opgelost:** een schijnbaar mobiel layout-probleem (content liep uit beeld) bleek een artefact van de lokale Chrome headless-testtool (forceert minimaal 500px viewportbreedte, ongeacht opgegeven `--window-size`), niet een echte bug. Pagina is desondanks herbouwd met pure handgeschreven CSS in plaats van Tailwind CDN, robuuster in Gumroad's sandboxed iframe waar JS-afhankelijke stylesheets onbetrouwbaar kunnen laden.
**Gumroad CLI geïnstalleerd:** `brew install antiwork/cli/gumroad`, geauthenticeerd via device-code OAuth.

---

## Kritische contentherziening van de Prompt Kit (grootste deel van de sessie)

Op herhaald verzoek van Daisy ("wees heel kritisch", "dit moet niet aanvoelen als iets wat ik zelf ook met AI had kunnen maken") is `docs/island-host-ai-prompt-kit.html` (de brontekst voor de verkochte PDF) meerdere rondes grondig herzien.

**Taalfouten gecorrigeerd:** stray Nederlandse tekst waar Engels hoorde ("Op loopafstand" → "Within walking distance", "Geliefd bij" → "Popular with", "Appartement" → "Apartment", en een aantal opties binnen die velden), plus een telfout ("12 prompts" waar het er op dat moment 11 waren).

**Fact Sheet en Quick Fill samengevoegd tot één systeem:** dit waren twee aparte, deels overlappende invulsystemen (dubbel werk voor de koper). Island en Type stonden bovendien als checkboxes (kon per ongeluk meerdere tegelijk aanvinken) in plaats van radiobuttons. Nu: één Property Fact Sheet, Property name/Island/Type/Aanspreekvorm werken live door in elke prompt op de pagina zodra je ze invult (functioneel getest met een JavaScript-simulatie), de rest van de velden (bedrooms, features, guest profile) voedt de "Copy my property facts"-knop voor de ChatGPT/Claude-workflow. Het losse Quick Fill-paneel is verwijderd, bijbehorende dode CSS opgeruimd.

**Waarde-hiërarchie omgedraaid:** de grijze, cursieve expert-notitie boven elke prompt (platformkennis: tekenlimieten, VRBO's kostenregel van april 2025, Airbnb-ranking factoren) was visueel ondergeschikt aan de prompttekst zelf, terwijl die notitie precies de kennis is die een koper niet zelf uit een generieke AI-prompt krijgt. Notitie kreeg een eigen roze label "What generic AI doesn't know" en prominente styling, de prompttekst zelf is bewust rustiger gemaakt (grijze rand in plaats van roze).

**Cover-tekst herschreven** om het bezwaar "dit had ik zelf ook kunnen typen" direct te weerleggen: "A generic AI prompt doesn't know Airbnb's 295-character preview cutoff, or that VRBO banned fee-mentions in April 2025. These 12 do."

**Nieuwe prompt 12 toegevoegd: Review Response Writer.** Adresseert reageren op reviews, permanent zichtbaar voor toekomstige gasten, met de kernregel dat hosts vaak breken (nooit verontschuldigen voor iets wat niet je fout was). Kit-aantal ging hierdoor van 11 naar 12 prompts, overal consistent bijgewerkt (titel, cover, Gumroad, landingpagina, website, .md).

**Orkaangordel-inzicht toegevoegd** als pro-tip: Aruba/Curaçao liggen buiten de orkaangordel, weinig Noord-Amerikaanse gasten weten dat, als verkoopargument specifiek in te zetten juni t/m november.

**Airbnb Algorithm Audit-prompt echt gefixt na een eigen test van Daisy met ChatGPT.** De prompt vroeg de AI eerder om Instant Book, responssnelheid en kalenderactiviteit te "beoordelen" zonder ergens te vragen die gegevens aan te leveren, ChatGPT antwoordde terecht met "Onbekend, niet zichtbaar voor mij" op precies die punten. Prompt vraagt nu expliciet 5 host-dashboard-cijfers op via losse invulvelden voordat de audit draait.

**Drie "wow"-toevoegingen op verzoek van Daisy:**
- Founder note bovenaan "How to use this kit": "I rent a villa on Curaçao myself..." (waargebeurd, Daisy verhuurt zelf een villa, geen onbewezen ervaringsclaim).
- AI-verwachtingsmanagement bij stap 3: "This kit is built for the version you're already paying for" (impliceert dat een betaald AI-abonnement de moeite waard is, zonder dat letterlijk te beweren).
- Scope-aanduiding: kit is bedoeld voor hosts met maximaal 3 woningen (geen opslag/multi-profiel in de Fact Sheet, bij meer wordt herhaaldelijk invullen te omslachtig).

**Booking.com-uitleg toegevoegd aan "What this is not":** op aangeven van Daisy dat een host op Booking.com sowieso geen eigen vrije tekst kan plaatsen (het platform genereert de beschrijving zelf uit gestructureerde data). Bewust geen aparte Booking.com-prompt gebouwd, geen even hard verifieerbaar feit voorhanden als anker (in tegenstelling tot de Airbnb/VRBO-feiten).

**"What this is not" ontbrak in de PDF zelf:** stond alleen op Gumroad/landingpagina/website, niet in het daadwerkelijke product. Toegevoegd als eigen donkere pagina, zelfde stijl als de categorie-intropagina's, direct na "How to use this kit".

**Bestanden:** `docs/island-host-ai-prompt-kit.html` (alle bovenstaande wijzigingen), `docs/island-host-ai-prompt-kit.md` (volledig gesynchroniseerd na elke wijziging), Gumroad producttitel/beschrijving (bijgewerkt via CLI), Gumroad landingpagina (herhaaldelijk opnieuw gepubliceerd).

---

## Nieuwe website-verkooppagina gebouwd (nog niet live)

**Wat:** `island-host-ai-prompt-kit.html` in de projectroot: een marketingpagina op de eigen huisstijl (echte nav/footer, `.pink-button`, mobile-first) die naar de Gumroad-checkout linkt, zonder de volledige prompt-inhoud gratis prijs te geven. Eerste versie gebruikte Gumroad's officiële `gumroad-button`-embed, die overschreef de eigen roze knopstyling met Gumroad's eigen zwarte widget, vervangen door een gewone link naar de Gumroad-pagina.
**Status:** bewust nog niet gecommit/live gezet, Daisy wil dit later beoordelen.

---

## Openstaande kritieke blokkade

**Er hangt nog geen PDF-bestand aan het Gumroad-product.** `files: []` bij de laatste check. Zonder PDF-upload kan er geen enkele verkoop worden afgerond. Daisy heeft er expliciet voor gekozen dit niet te doen ("pdf pas uploaden als ie echt helemaal goed is") totdat de content-kwaliteit haar volledig overtuigt, dat proces is deze sessie meerdere rondes doorlopen maar nog niet afgerond.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Strategieplan: Prompt Kit prioriteit, Spark Plan geparkeerd | Klaar |
| Betaalprovider-crisis onderzocht en opgelost (Gumroad op NL) | Klaar |
| Gumroad product + custom landingpagina live | Klaar |
| Gumroad CLI geïnstalleerd en geauthenticeerd | Klaar |
| Taalfouten en telfouten in Prompt Kit gecorrigeerd | Klaar |
| Fact Sheet + Quick Fill samengevoegd, functioneel getest | Klaar |
| Waarde-hiërarchie omgedraaid ("What generic AI doesn't know") | Klaar |
| Cover-tekst herschreven tegen "had ik zelf kunnen maken"-bezwaar | Klaar |
| Nieuwe prompt 12: Review Response Writer | Klaar |
| Orkaangordel-inzicht toegevoegd | Klaar |
| Airbnb Algorithm Audit-prompt gefixt (self-report velden) | Klaar |
| Founder note, AI-verwachtingsmanagement, scope (max 3 woningen) | Klaar |
| Booking.com-uitleg toegevoegd, geen aparte prompt gebouwd | Klaar |
| "What this is not" toegevoegd aan de PDF zelf | Klaar |
| Alle wijzigingen gesynchroniseerd (Gumroad, landingpagina, website, .md) | Klaar |
| Nieuwe website-verkooppagina gebouwd | Klaar, bewust nog niet live |
| PDF exporteren en uploaden naar Gumroad | **Openstaand, blokkerend** |
