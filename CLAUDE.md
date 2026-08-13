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

**Island Host AI Prompt Kit** - downloadbaar digitaal product ($27). 12 AI-prompts voor vakantieverhuurders op Aruba, Bonaire en Curaçao, bedoeld voor hosts met maximaal 3 woningen. Focus: zoveel mogelijk boekingen via de platforms. Verdeeld in 2 categorieën: Listing Descriptions (01-08: Airbnb, VRBO, Micazu platform-beschrijvingen + universele tools zoals teaser, rewrite, USP, outdoor, locatie), More Bookings & Reputation (09-12: Airbnb Algorithm Audit, Amenities Maximizer, Listing Photo Brief, Review Response Writer). Geen van de prompts scraped of haalt automatisch data op van boekingsplatformen, alles werkt met gegevens die de host zelf al heeft of zelf invult. Booking.com is bewust buiten scope (dat platform laat geen eigen vrije tekst toe, genereert de beschrijving zelf uit gestructureerde data). Social Media is een aparte upsell (nog te bouwen, teaser al aanwezig in de PDF met een "annulering/rustige periode"-post als eerste voorbeeld, prijs/URL daarvoor bewust nog niet genoemd). Bestanden: `docs/island-host-ai-prompt-kit.html` (brontekst/PDF, in browser openen, via Cmd+P opslaan als PDF) en `docs/island-host-ai-prompt-kit.md` (referentie, moet bij wijziging aan de HTML meebijgewerkt worden). Losse marketingpagina op de eigen website: `island-host-ai-prompt-kit.html` in de projectroot, nog niet live/gecommit. Verkoop via Gumroad (product `yfefbu`, $27), account staat op Nederland voor uitbetaling (zie Betaalprovider hieronder), custom landingpagina gepubliceerd via de Gumroad CLI. **Nog geen PDF-bestand geüpload naar Gumroad, dat is de laatste blokkade voor de eerste verkoop.** Zie `kennis/strategieplan.md` voor de actuele status en volgorde.

Productstructuur: gebruiker vult de Property Fact Sheet eenmalig in (Property name, Island, Type en Aanspreekvorm werken live door in elke prompt op de pagina zodra ingevuld, één systeem, geen apart Quick Fill-paneel meer). Eiland context (Aruba/Bonaire/Curaçao briefing) wordt automatisch ingevuld in alle platform-prompts. Airbnb Prompt 01 heeft 6 aparte outputs: Dutch, American, Canadian, Your Space EN, Your Space NL, title. VRBO Prompt 02 heeft 3 outputs: Dutch/Europees, Noord-Amerikaans, title. Advies: auto-vertaling Airbnb uitzetten, eigen tekst per taal invoeren. VRBO heeft geen multi-taal support. Guest emails, WhatsApp, Social Media en Host Profile zijn niet opgenomen in dit product.

## Doelgroep

Alle bedrijven op Curaçao: hotels, resorts, makelaars, restaurants, vakantieverhuurders en vakantiewoningbeheerders (mensen die verhuren via platforms als Airbnb, Booking.com of Micazu), banken en meer. Budget maakt niet uit: zowel grote bedrijven als kleine verhuurders zijn welkom. Geen vaste pakketten, altijd op maat.

## Schrijfstijl

Casual, direct, bold, met humor. Altijd positief en vanuit eigen kracht. Kort en krachtig. Nooit corporate, traag, voorspelbaar, safe of verontschuldigend. De website is sinds augustus 2026 tweetalig: Engels is de default taal, Nederlands staat onder de `nl/` submap (bv. `nl/what-we-do.html`), met een vlaggetjes-taalswitcher in de navbar. Geen automatische taaldetectie. `quiz.html`, `scan.html` en `island-host-ai-prompt-kit.html` blijven Engelstalig, geen NL-versie. Vaste navigatie-/UI-vertalingen staan in `docs/vertaalgids-website.md`. Social media blijft Nederlands en Engels. TikTok is een kernplatform. Altijd spreektaal.

Verboden: emdash, woorden als 'premium', 'luxury' of 'momentum', negatieve vergelijkingen met anderen of de markt, onverifieerbare claims over concurrenten.

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

**Betaalprovider voor online verkoop:** Gumroad, Payoneer, Lemon Squeezy en Fygaro ondersteunen geen uitbetaling naar Curaçao. Gumroad-account staat daarom op land Nederland, uitbetaling naar Daisy's Nederlandse privérekening. MCB Bank Internet Merchant Account is een alternatief voor de langere termijn maar vereist cedula + KvK-inschrijving + zakelijke rekening, niet op korte termijn haalbaar. Volledige beslisboom in `kennis/strategieplan.md`.

**Gumroad CLI** (`gumroad`, via `brew install antiwork/cli/gumroad`, ingelogd via device-code OAuth): voor productbeheer (titel, beschrijving, prijs, custom landingpagina) zonder de browser-UI. Belangrijkste commando's: `gumroad products view <id>`, `gumroad products update <id> --name/--description/...`, `gumroad products page preview/publish <id> ./landing.html` (check altijd het `sanitization_report` voordat je publiceert).

**funkiness-scan/**, de AI & Marketing Scan webapp (leadgenerator). Multi-step form, gepersonaliseerd rapport via Claude API, radar chart. Draait op Node.js/Express, poort 3001. Start met `node server.js` vanuit de map. Beveiligd met rate limiting (IP + email) en email confirmation flow: rapport is alleen toegankelijk via unieke token-link in de email. Nodemailer via Titan SMTP (smtp.titan.email:587, sayhello@funkiness.ai).

**Mobile office sectie** - nieuwe homepage sectie in ontwikkeling voor het "You pick the spot, we bring the office" concept. Preview: `docs/preview-mobile-office-sectie.html`. Booking via **Cal.com** (gratis, werkt met Apple Agenda via CalDAV). Meeting naam: "Marketing Strategy Session". Wacht op Cal.com embed code van Daisy om formulier te vervangen. Nog niet live op `index.html`.

**NFC visitekaartje** - fysiek kaartje met NFC-chip. Tik opent `connect.html` (funkiness.ai/connect). Bestanden: `connect.html` (landingspagina: WhatsApp, Instagram, TikTok, Website), `docs/visitekaartje.html` (print-klaar ontwerp, 85x55mm trim + 3mm bleed, dus 91x61mm paginaformaat, voor- en achterkant). Panterprint met golvende rand via SVG clipPath. Wordt gedrukt bij **drukwerkdeal.nl** (niet meer Mobilo): Chrome-PDF-export (Cmd+P, achtergrondafbeeldingen aan, papierformaat pakt automatisch 91x61mm) dient als bouwtekening, die wordt in Affinity Publisher geplaatst (CMYK, Coated FOGRA39, 3mm bleed) om zuiver te exporteren als PDF/X-4:2008. Zwarte tekst en de QR-code staan bewust op puur `#000` (nooit rich black) volgens drukwerkdeal's aanleverspecs voor kleine/fijne elementen.

**Tweetalige website (NL/EN)** - sinds augustus 2026. Elke tweetalige pagina heeft een `nl/`-tegenhanger met dezelfde bestandsnaam (bv. `contact.html` ↔ `nl/contact.html`), gedeelde `style.css`, taalswitcher (🇬🇧/🇳🇱) in de navbar. `quiz.html`, `scan.html` en `island-host-ai-prompt-kit.html` blijven Engels-only. Vertaalgids: `docs/vertaalgids-website.md`. Design-spec: `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md`.

## Social media planning

Maandelijkse social media plannen staan in `docs/`. Huidig plan: `docs/social-media-plan-augustus-2026.md`, TikTok + Instagram + Facebook + YouTube Shorts, 14 posts, 3 t/m 31 augustus 2026, verdeeld over 7 ontwerptypes (elk onderwerp/doelgroep krijgt steeds dezelfde opzet). Scripts, captions per platform, ontwerpspecs per template, CapCut-instructies en kalender staan erin. Ontwerpen zijn vrolijk crème/roze, geen zware zwarte vlakken.

**Kant-en-klare postbeelden:** `docs/social-posts-augustus-2026/post-01.png` t/m `post-14.png`, 1080x1920, gerenderd met de echte huisstijlfonts (Poppins/Permanent Marker/Inter, opgehaald bij Google Fonts en lokaal ingebed). Gemaakt door de HTML-ontwerpen per post te bouwen en met headless Chrome (`Google Chrome.app` via CLI) naar PNG te renderen, zonder Canva. Bouwscript en losse HTML-bronbestanden stonden in de scratchpad van de sessie waarin ze gemaakt zijn, niet in de projectmap. Bij een nieuwe maand: hetzelfde recept herhalen (fonts downloaden, per-template Python-renderfuncties, headless Chrome screenshot op 1080x1920). CSV's voor eventueel handmatig Canva-gebruik staan nog in `docs/canva-augustus-2026/` maar zijn niet meer nodig om te posten.

Contenttoon: altijd vanuit mogelijkheden en positiviteit (The Magician). Geen roast-content of "hier is wat iedereen fout doet"-aanpak.

**Content Prompt Bank:** `docs/content-prompt-bank.md` bevat een verzameling AI-contentprompts (hooks, captions, content ideeën, reel-scripts, stories, doelgroepprofielen, verkoopcontent, contentkalenders) die de vaste basis vormen voor alle content die voor FUNkiness! gemaakt wordt. Bij elk gebruik: [ ] altijd vervangen door FUNkiness!-eigen info, en de output daarna nog toetsen aan de merkregels in dit bestand. Groeit mee met nieuwe prompts die Daisy aandraagt.

## Sessie logs

Logs staan in docs/logs/YYYY-MM-DD/. Zie de laatste log voor recente acties en openstaande punten.

- 2026-08-13: Tweetalige website (NL/EN) gebouwd via subagent-driven-development, merkregel-fixes, servicekaart-overlap opgelost, NL-vertaling losser gemaakt. Open punt: titelgroottes op mobiel nog niet gecheckt: docs/logs/2026-08-13/01-tweetalige-website-nl-en.md
- 2026-08-06: Promptbank opgeslagen (@merelnijman + 20-prompt lijst), harde contentstijl-correctie (niet-commercieel, humor, viral), Higgsfield VFX-experiment: docs/logs/2026-08-06/01-promptbank-en-humor-contentstijl-higgsfield-vfx.md
- 2026-08-04: Visitekaartje print-klaar gemaakt (bleed, aanleverspecs drukwerkdeal, fotofix, Affinity-workflow): docs/logs/2026-08-04/02-visitekaartje-print-ready.md
- 2026-08-04: Prompt Kit lancering, betaalprovider-crisis, Gumroad live, grote kritische contentherziening (12 prompts): docs/logs/2026-08-04/01-prompt-kit-lancering-en-betaalprovider-crisis.md
- 2026-07-31: Strategisch herstart, kennis/strategieplan.md, The Spark Plan, site-fixes en agenda: docs/logs/2026-07-31/01-strategisch-herstart-en-uitvoeringsplan.md
- 2026-07-24: Social media plan augustus 2026, 14 posts over 7 Canva-templates: docs/logs/2026-07-24/02-social-media-plan-augustus-2026.md
- 2026-07-24: Scan e-mailflow gerepareerd (SMTP-server, JSON-crash, vangnet-logging): docs/logs/2026-07-24/01-scan-email-flow-smtp-fix.md
- 2026-06-29: Website updates, logo, NFC visitekaartje — docs/logs/2026-06-29/01-website-logo-visitekaartje.md
- 2026-06-26: Mobile office preview updates — docs/logs/2026-06-26/01-mobile-office-preview-updates.md
