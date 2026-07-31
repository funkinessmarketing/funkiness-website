# Mijn Mainframe

Dit is het geheugen van mijn AI. Alles wat hier staat, leest Claude bij elke sessie. Gebruik deze informatie bij elk antwoord.

## ABSOLUTE REGELS (nooit negeren)

**EMDASH VERBOD:** Gebruik NOOIT een emdash (—) in welke output dan ook. Niet in teksten, HTML, emails, prompts, code comments, API calls of enig ander bestand. Vervang altijd door een komma, punt, koppelteken (-) of nieuwe zin. Dit geldt ook voor content die Claude genereert namens FUNkiness! via de API. Geen uitzonderingen. Daisy heeft dit tientallen keren gecorrigeerd.

**SEPARATOR VERBOD:** Gebruik NOOIT " - " (spatie-koppelteken-spatie) als separator in labels, titels of output. Vervang door een dubbele punt (": "), komma of nieuwe zin.

**GEEN ONVERIFIEERBARE CLAIMS:** Verzin geen tijdpaden, statistieken, marktposities of claims over concurrenten die Daisy niet zelf kan bevestigen.

**WEBSITE LEIDRAAD: MOBILE FIRST + SEO + GEO.** Bij elke wijziging aan websitecopy of HTML: (1) mobile-first CSS, altijd `min-width` breakpoints, nooit `max-width`. (2) SEO: behoud locatie-keywords (Curaçao, Aruba, Bonaire) en dienst-keywords in de tekst, ook na herschrijven. (3) GEO: schrijf voor AI-zoekmachines met locatie + dienst + autoriteit in de copy. Nooit een "on Curaçao" of eilandvermelding weghalen bij herschrijven.

**BERDIEN WOONT NOG NIET OP CURAÇAO.** Berdien sluit eind oktober 2026 aan. Schrijf nooit "we live here", "we are based here" of vergelijkbare formuleringen die impliceren dat beiden op het eiland wonen. Daisy woont er wel. Gebruik "FUNkiness! is based on Curaçao" of "Daisy is based on Curaçao" maar nooit "we" in die context.

**ALTIJD OPENROUTER VOOR ANDERE AI-MODELLEN.** Als gevraagd wordt om een afbeelding te genereren, een video te genereren, of gebruik te maken van een ander AI-model dan Claude (bijvoorbeeld GPT, Gemini, Moonshot, Grok, Kling, Nano Banana, GPT Image), gebruik dan ALTIJD OpenRouter met de `OPENROUTER_API_KEY` uit `.env`. Gebruik NOOIT losse directe koppelingen met OpenAI, Google AI Studio, Anthropic of andere providers, ook niet als ze rechtstreeks beschikbaar zijn. Reden: één sleutel, één kostenoverzicht (openrouter.ai/activity), altijd toegang tot de nieuwste modellen zonder per provider een aparte account te beheren.

## Mijn bedrijf

Ik ben Daisy, en samen met Berdien run ik **FUNkiness! AI, Social Media & Marketing** op Curaçao. We zijn allebei ervaren marketeers uit Nederland die de stap naar het eiland hebben gemaakt. Marketing op Curaçao is nog heel traditioneel, iedereen doet hetzelfde, niemand springt eruit. FUNkiness! is ons antwoord daarop.

Merkpositie: *FUNkiness! is wat er gebeurt als scherpe AI-strategie, Caribische energie en een diep gebrek aan geduld voor saaie content samenkomen op Curaçao.*

Merkarchetype: **The Magician meets The Outlaw.** Merkpersoonlijkheid: Sharp. Tropical. Cinematic. Rebellious. Alive. Energetic.

We zitten in de opstartfase. Slogan: *Boring was never the plan.*

## Producten en diensten

FUNkiness! is een **fullservice marketingbureau**: strategie en AI-integratie eerst, daarna content, campagnes en kanaalmanagement. Positionering is fullservice marketingbureau, NIET 'AI agency' (boring en te beperkt) en NIET social media bureau. Ze zetten AI in als onderdeel van strategie en uitvoering, maar het gaat om marketing in de breedste zin van het woord. Noem FUNkiness! nooit een "AI agency."

**Twee gratis scans** via `scan.html` (keuze op de pagina zelf):
- **Social Media Scan** (leadgenerator #1a): Platforms & Reach, Instagram, Engagement, Content. Vercel serverless: `api/scan.js`.
- **Marketing Strategy Scan** (leadgenerator #1b): Brand & Positioning, Audience & Market, Channels & Reach, Strategy & Execution. Vercel serverless: `api/marketing-scan.js`.
Beide sturen een rapport-email naar de aanvrager en een volledige lead-email naar sayhello@funkiness.ai via SMTP (smtpout.secureserver.net, sayhello@funkiness.ai, `TITAN_PASSWORD` env var, niet smtp.titan.email). Beveiligd met honeypot en input-validatie. Elke aanvraag wordt daarnaast, onafhankelijk van of de mail lukt, direct gelogd naar een Google Sheet ("Funkiness! Scan aanvragen") via een Apps Script webhook (`GSHEET_WEBHOOK_URL` env var), als vangnet tegen verloren aanvragen. Werk aan structurele deliverability-fix via Resend loopt nog (DNS-records nog toe te voegen bij GoDaddy).

**AI Superpower Quiz** - leadgenerator #2. "What's Your AI Superpower?", 8 vragen, 4 archetypes (Time Terminator, Content Crusher, Growth Guru, Experience Engine). Resultaat via Claude API, deelbaar via WhatsApp. Bestanden: `quiz.html`, `quiz-script.js`, `api/archetype-quiz.js`. Sinds 2026-07-31 gelinkt vanuit navigatie, mobiel menu en footer op alle pagina's (stond daarvoor nergens gelinkt).

**The Spark Plan** (social media abonnement, in opbouw) - structurele ondersteuning op content en strategie. Scope, prijsanker en pilotdoelgroep staan uitgewerkt in `kennis/strategieplan.md`.

**Island Host AI Prompt Kit** - downloadbaar digitaal product ($27). 11 AI-prompts voor vakantieverhuurders op Aruba, Bonaire en Curaçao. Focus: zoveel mogelijk boekingen via de platforms. Verdeeld in 2 categorieën: Listing Descriptions (01-08: Airbnb, VRBO, Micazu platform-beschrijvingen + universele tools zoals teaser, rewrite, USP, outdoor, locatie), More Bookings (09-11: Airbnb Algorithm Audit, Amenities Maximizer, Listing Photo Brief). Geen van de prompts scraped of haalt automatisch data op van boekingsplatformen, alles werkt met gegevens die de host zelf al heeft of zelf invult. Social Media is een aparte upsell (nog te bouwen, teaser al aanwezig in de PDF met een "annulering/rustige periode"-post als eerste voorbeeld). Bestanden: `docs/island-host-ai-prompt-kit.html` (in browser openen, via Cmd+P opslaan als PDF) en `docs/island-host-ai-prompt-kit.md` (referentie, moet bij wijziging aan de HTML meebijgewerkt worden). Online op `https://www.funkiness.ai/island-host-ai-prompt-kit`. Verkoop MOET nog via Gumroad ($27), de Gumroad-winkel staat nog niet live, dus er zijn nog geen kopers. Zie `kennis/strategieplan.md` voor de actuele status en volgorde. Marketing via TikTok demo + WhatsApp groepen ABC eilanden is een toekomstig plan, geen lopende activiteit.

Productstructuur: gebruiker vult Property Fact Sheet eenmalig in en selecteert eiland in Quick Fill. Eiland context (Aruba/Bonaire/Curaçao briefing) wordt automatisch ingevuld in alle platform-prompts. Airbnb Prompt 01 heeft 6 aparte outputs: Dutch, American, Canadian, Your Space EN, Your Space NL, title. VRBO Prompt 02 heeft 3 outputs: Dutch/Europees, Noord-Amerikaans, title. Advies: auto-vertaling Airbnb uitzetten, eigen tekst per taal invoeren. VRBO heeft geen multi-taal support. Guest emails, WhatsApp, Social Media en Host Profile zijn niet opgenomen in dit product.

## Doelgroep

Alle bedrijven op Curaçao: hotels, resorts, makelaars, restaurants, vakantieverhuurders en vakantiewoningbeheerders (mensen die verhuren via platforms als Airbnb, Booking.com of Micazu), banken en meer. Budget maakt niet uit: zowel grote bedrijven als kleine verhuurders zijn welkom. Geen vaste pakketten, altijd op maat.

## Schrijfstijl

Casual, direct, bold, met humor. Altijd positief en vanuit eigen kracht. Kort en krachtig. Nooit corporate, traag, voorspelbaar, safe of verontschuldigend. Engels op de website, Nederlands en Engels op social media. TikTok is een kernplatform. Altijd spreektaal.

Verboden: emdash, woorden als 'premium' of 'luxury', negatieve vergelijkingen met anderen of de markt, onverifieerbare claims over concurrenten.

Als een tekst saai klinkt, past hij niet bij FUNkiness!

**ENERGIE EN HUMOR ZIJN VERPLICHT.** Elke tekst moet voelen alsof je hem wil lezen. Schrijf altijd vanuit eigen kracht: nooit vergelijken met andere steden, bureaus of markten. Geen "Not Amsterdam, not New York" of "unlike other agencies" — dat toont zwakte. FUNkiness! heeft geen referentiepunt nodig. Energie, FUN en zelfbewuste humor zijn niet optioneel, ze zijn de toon. Als het niet knalt, is het niet goed genoeg.

## Vormgeving & Designprincipes

**Kernregel: organische vormen, geen rechte vlakken of harde hoeken.** Secties lopen vloeiend in elkaar over via SVG-golven of blob-vormen, niet via strakke rechthoekige blokken.

**Kleuren:**
- Roze: `#f21b7a` (primair, altijd FUNkiness! roze)
- Zwart: `#080403`
- Crème: `#f7efe7` (standaard achtergrond)
- Crème licht: `#fbf6f1`

**Typografie:**
- Poppins 900, alle headings (h1, h2, h3)
- Permanent Marker, **alle roze tekst, altijd**. Elk element met `color: #f21b7a` krijgt ook `font-family: 'Permanent Marker', cursive`. Geen uitzonderingen.
- Inter, broodtekst, navigatie, UI

**Visuele elementen:**
- Roze plusjes `✚` als separator in navigatie, ticker en tags
- Kleine roze streep (4px, 54px breed) als sectie-accent
- Roze pil-badges (zwart of roze, afgerond 999px) voor labels en categorieën
- Cards: border-radius 24-34px, lichte witte achtergrond met subtiele border
- Donkere secties (zwart) voor contrast, Why Us, footer, blog hero
- Blob/plas-vormen in roze als decoratief element (zie homepage hero)
- Jeep met panterprint is het centrale visuele merk-icoon
- **Logo:** `funkiness-logo.png` in root. PNG met transparante achtergrond, 999x515px. Gebruikt in navbar op alle pagina's via `.logo-img` (100px mobiel, 120px desktop). Niet vervangen door tekst.

**Aanpak bij nieuwe pagina-elementen:**
Gebruik altijd organische overgangen (SVG-golf of blob) tussen secties met verschillende achtergrondkleuren. Nooit een harde rechte lijn tussen twee kleurvlakken.

**CSS architectuur:**
style.css is **mobile-first**. Base styles zijn voor mobiel. Breakpoints: `min-width: 600px`, `700px`, `900px`, `1100px`. Gebruik altijd `min-width`, nooit `max-width`.

**Blog post template:**
Nieuwe blogposts volgen de structuur van bestaande posts (zie `blog-marketing-strategy-curacao.html`):
- `<header class="blog-hero">` met kicker + h1 + `.script-word`
- Direct na `</header>`: een `<div class="wave-divider" style="background:var(--black)">` met crème SVG-golf
- `<div class="blog-layout">` met `<aside class="blog-sidebar">` + `<article class="blog-post-body">`
- Minimaal één `.blog-callout` en een `.blog-post-cta` afsluiter
- Wave-divider (crème→zwart) WEL toevoegen vóór de footer
- Bestandsnaam: `blog-[onderwerp]-curacao.html`

## Kennisbestanden

Lees deze bestanden voor meer detail:
- kennis/strategieplan.md (basisplan: wie/wat/waar/hoe/wanneer, levend document, altijd meelezen bij prioriteiten of nieuwe producten). Printbare versie: `docs/strategieplan-printbaar.html` (openen in browser, printen of Cmd+P naar PDF), moet na elke materiële wijziging aan het strategieplan opnieuw gegenereerd worden.
- kennis/over-mij.md
- kennis/missie-en-visie.md
- kennis/producten.md
- kennis/doelgroep.md
- kennis/schrijfstijl.md
- kennis/concurrenten.md
- kennis/veelgestelde-vragen.md

## Tools en projecten

**funkiness-scan/**, de AI & Marketing Scan webapp (leadgenerator). Multi-step form, gepersonaliseerd rapport via Claude API, radar chart. Draait op Node.js/Express, poort 3001. Start met `node server.js` vanuit de map. Beveiligd met rate limiting (IP + email) en email confirmation flow: rapport is alleen toegankelijk via unieke token-link in de email. Nodemailer via Titan SMTP (smtp.titan.email:587, sayhello@funkiness.ai).

**Mobile office sectie** - nieuwe homepage sectie in ontwikkeling voor het "You pick the spot, we bring the office" concept. Preview: `docs/preview-mobile-office-sectie.html`. Booking via **Cal.com** (gratis, werkt met Apple Agenda via CalDAV). Meeting naam: "Marketing Strategy Session". Wacht op Cal.com embed code van Daisy om formulier te vervangen. Nog niet live op `index.html`.

**NFC visitekaartje** - fysiek kaartje met NFC-chip. Tik opent `connect.html` (funkiness.ai/connect). Bestanden: `connect.html` (landingspagina: WhatsApp, Instagram, TikTok, Website), `docs/visitekaartje.html` (printbaar ontwerp 85x55mm, voor- en achterkant). Panterprint met golvende rand via SVG clipPath. Via Mobilo of vergelijkbare leverancier laten drukken.

## Social media planning

Maandelijkse social media plannen staan in `docs/`. Huidig plan: `docs/social-media-plan-augustus-2026.md`, TikTok + Instagram + Facebook + YouTube Shorts, 14 posts, 3 t/m 31 augustus 2026, verdeeld over 7 ontwerptypes (elk onderwerp/doelgroep krijgt steeds dezelfde opzet). Scripts, captions per platform, ontwerpspecs per template, CapCut-instructies en kalender staan erin. Ontwerpen zijn vrolijk crème/roze, geen zware zwarte vlakken.

**Kant-en-klare postbeelden:** `docs/social-posts-augustus-2026/post-01.png` t/m `post-14.png`, 1080x1920, gerenderd met de echte huisstijlfonts (Poppins/Permanent Marker/Inter, opgehaald bij Google Fonts en lokaal ingebed). Gemaakt door de HTML-ontwerpen per post te bouwen en met headless Chrome (`Google Chrome.app` via CLI) naar PNG te renderen, zonder Canva. Bouwscript en losse HTML-bronbestanden stonden in de scratchpad van de sessie waarin ze gemaakt zijn, niet in de projectmap. Bij een nieuwe maand: hetzelfde recept herhalen (fonts downloaden, per-template Python-renderfuncties, headless Chrome screenshot op 1080x1920). CSV's voor eventueel handmatig Canva-gebruik staan nog in `docs/canva-augustus-2026/` maar zijn niet meer nodig om te posten.

Contenttoon: altijd vanuit mogelijkheden en positiviteit (The Magician). Geen roast-content of "hier is wat iedereen fout doet"-aanpak.

## Sessie logs

Logs staan in docs/logs/YYYY-MM-DD/. Zie de laatste log voor recente acties en openstaande punten.

- 2026-07-31: Strategisch herstart, kennis/strategieplan.md, The Spark Plan, site-fixes en agenda: docs/logs/2026-07-31/01-strategisch-herstart-en-uitvoeringsplan.md
- 2026-07-24: Social media plan augustus 2026, 14 posts over 7 Canva-templates: docs/logs/2026-07-24/02-social-media-plan-augustus-2026.md
- 2026-07-24: Scan e-mailflow gerepareerd (SMTP-server, JSON-crash, vangnet-logging): docs/logs/2026-07-24/01-scan-email-flow-smtp-fix.md
- 2026-06-29: Website updates, logo, NFC visitekaartje — docs/logs/2026-06-29/01-website-logo-visitekaartje.md
- 2026-06-26: Mobile office preview updates — docs/logs/2026-06-26/01-mobile-office-preview-updates.md
