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
Beide sturen een rapport-email naar de aanvrager en een volledige lead-email naar sayhello@funkiness.ai via SMTP (smtpout.secureserver.net, sayhello@funkiness.ai, `TITAN_PASSWORD` env var, niet smtp.titan.email). Beveiligd met honeypot en input-validatie. Elke aanvraag wordt daarnaast, onafhankelijk van of de mail lukt, direct gelogd naar een Google Sheet ("Funkiness! Scan aanvragen") via een Apps Script webhook (`GSHEET_WEBHOOK_URL` env var), als vangnet tegen verloren aanvragen. Sinds 2026-10-14: mails en sheet-logging worden afgewacht vóór het antwoord (Vercel breekt anders alles af wat na het antwoord nog loopt), elke aanvraag krijgt een id en de sheet krijgt na de AI-analyse op dezelfde rij score, status en volledig rapport (of MISLUKT + foutmelding), bij een mislukte scan komt er toch een leadmail met contactgegevens, leadmails hebben reply-to naar de klant. De quiz logt ook naar de sheet. Het Apps Script achter de sheet staat in `docs/google-sheet-scan-script.gs`. Vragen en punten per antwoord staan centraal in `api/_scan-vragen.js` (de server rekent de score, data-value's in `scan.html` moeten daar exact mee overeenkomen); daar staan ook de sectoren en `leesWebsite()`, die de homepage van de klant (optioneel veld) leest zodat het rapport één echte observatie bevat. Geen vergelijkingscijfers per sector meer in het rapport: die waren verzonnen. Terugzetten zodra de sheet genoeg echte scores per sector heeft. **Niets verzinnen (sinds 2026-10-14):** de AI schrijft alleen over de antwoorden, website en bio van de klant plus advies; feiten staan als vaste lijst `FEITEN` in `api/_scan-vragen.js` (per locatie Curaçao/Aruba/Bonaire/Nederland/elders en per sector, elk met recent cijfer + bron-URL) en worden door de code letterlijk in het blok "Worth knowing" gezet met genummerde bronnen. Daarna controleert Claude Sonnet elke zin (`controleerRapport`) en vangt `verzonnenGetallen` getallen af die niet uit de antwoorden komen. Klant kiest locatie bij de aanvraag. Feiten bijwerken: altijd eerst de bron openen, nooit uit het hoofd. **Echte Instagram-cijfers (sinds 2026-10-14):** de Social Media Scan haalt via de Instagram Graph API (Business Discovery, v26.0) openbare cijfers op van het opgegeven zakelijke account (`leesInstagram()` in `api/_scan-vragen.js`); de code rekent postfrequentie, Reels-aandeel, engagement rate en Reels-vs-foto uit, het rapport zet die als feit [F90] naast de eigen antwoorden. Meta-app **FUNkiness! Scan** (developers.facebook.com, use case Instagram met Facebook Login, permissies instagram_basic, instagram_manage_insights, pages_show_list, pages_read_engagement, business_management, ads_read). Env vars `IG_USER_ID` (17841435220021371) en `IG_ACCESS_TOKEN` in `.env` en Vercel. **De sleutel verloopt op 13 december 2026**: daarvoor vervangen door een systeemgebruiker-sleutel die niet verloopt. **Website-doorlichting Marketing Scan (sinds 2026-10-15):** `analyseerWebsite()` meet objectief op de homepage (HTTPS, laadtijd, viewport, titel, meta-omschrijving, H1, JSON-LD, og:image, taal, WhatsApp/bel/mail-links, robots.txt voor OAI-SearchBot, sitemap) en levert feit [F91]; sites die automatische bezoekers weigeren worden niet omzeild, het rapport zegt dan eerlijk dat de site niet te lezen was. Marketing Scan gebruikt ook context (doel, publiek, wie, uitdaging), geeft 3 campagne-ideeën, en heeft vragen over social media en (alleen hotel/vakantieverhuur/tours) directe boekingen. Sinds 2026-10-17 vraagt hij of er echt een marketingstrategie is waar alles uit volgt (in plaats van een geschreven marketingplan, dat vindt Daisy niet interessant) en heeft hij twee AI-vragen: AI in de eigen marketing (strategy) en AI voor klantvragen via WhatsApp/chat/mail (channels). Sinds 2026-10-17: elke marketingvraag heeft 'Not sure' (0 punten) tenzij er al een weet-niet-optie is, antwoordopties gaan over één onderwerp, de valuta volgt de vestigingsplaats (`valutaRegel`), en er is een contextvraag 'Where does your business stand?' (`fase`); bij 'Just starting, no customers yet' verbiedt `faseRegel` advies dat uitgaat van bestaande klanten. **Eye-openers en 'We saw more' (sinds 2026-10-15):** elk rapport begint met een eye-opener (grootste verschil tussen eigen antwoord en meting; bij de Marketing Scan wijst de code het contrast aan) en eindigt met 'We saw more': teasers over wat gemeten is maar niet in het rapport staat (overige websitepunten, Instagram-verdieping: beste vorm/dag/dagdeel/post en langste stilte, punten per vraag), met knop naar WhatsApp. De volledige analyse staat alleen in Daisy's leadmail en de sheet. Facebook-paginacijfers vereisen bedrijfsverificatie + App Review (Page Public Content Access); TikTok heeft geen officiële API voor andermans account. **Opvolging, standaard in elke scan (sinds 2026-10-16):** `opvolging()` in `api/_scan-vragen.js` stelt zonder AI (dus niets verzonnen) drie berichten samen uit wat niet in het rapport stond (Marketing Scan: websitepunten 4 en verder plus eerste campagne-idee; Social Media Scan: Instagram-verdieping) en de laagste antwoorden. Een nieuwe scan krijgt dit ook, via `opvolging`, `opvolgingHtml` en `opvolgingVoorSheet`: een WhatsApp voor dag 0 (bovenaan de leadmail en de Gmail-melding, met knop die WhatsApp opent met de tekst ingevuld) en mails voor dag 3 en dag 8 (in de sheet). Altijd uitnodiging voor een persoonlijk bezoek, nooit videocall. Het sheetscript zet elke ochtend om 8 uur op dag 3 en dag 8 een Gmail-concept klaar vanuit sayhello@funkiness.ai (Verzenden als), stopt bij vinkje Gereageerd, ingevuld Bezoek of een mail van de klant, en heeft menu FUNkiness! > Stuur bezoekuitnodiging (iCal-bijlage, kolommen Bezoek en Bezoekadres, 60 minuten, bcc naar sayhello). Werk aan structurele deliverability-fix via Resend loopt nog (DNS-records nog toe te voegen bij GoDaddy).

**AI Visibility Scan (in opbouw, nog niet live)** - derde scan-variant, checkt of een bedrijf al zichtbaar is in AI-zoekresultaten (ChatGPT/Perplexity via OpenRouter) en audit't de eigen website op structured data/Q&A-content, met een kant-en-klare plakbare JSON-LD schema-snippet als onderscheidend, niet-zelf-na-te-maken onderdeel. Spec en implementatieplan: `docs/superpowers/specs/2026-09-09-ai-visibility-scan-design.md` / `docs/superpowers/plans/2026-09-09-ai-visibility-scan.md`. Gebouwd via subagent-driven-development op een aparte git worktree/branch (`worktree-ai-visibility-scan`), taken 1 t/m 6 klaar en gereviewd, taak 7 (live deployen) wacht op Daisy's beoordeling van de test-e-mails.

**AI Superpower Quiz** - leadgenerator #2. "What's Your AI Superpower?", 8 vragen, 4 archetypes (Time Terminator, Content Crusher, Growth Guru, Experience Engine). Resultaat via Claude API, deelbaar via WhatsApp. Bestanden: `quiz.html`, `quiz-script.js`, `api/archetype-quiz.js`. Sinds 2026-10-19 tijdelijk van de site gehaald op verzoek van Daisy: geen links meer in menu, footer, FAQ, schema of sitemap. `quiz.html` en de API bestaan nog, terugzetten kan.

**The Spark Plan** (social media abonnement, in opbouw) - structurele ondersteuning op content en strategie. Scope, prijsanker en pilotdoelgroep staan uitgewerkt in `kennis/strategieplan.md`.

**Island Host AI Prompt Kit** - downloadbaar digitaal product ($27). 12 AI-prompts voor vakantieverhuurders op Aruba, Bonaire en Curaçao, bedoeld voor hosts met maximaal 3 woningen. Focus: zoveel mogelijk boekingen via de platforms. Verdeeld in 2 categorieën: Listing Descriptions (01-08: Airbnb, VRBO, Micazu platform-beschrijvingen + universele tools zoals teaser, rewrite, USP, outdoor, locatie), More Bookings & Reputation (09-12: Airbnb Algorithm Audit, Amenities Maximizer, Listing Photo Brief, Review Response Writer). Geen van de prompts scraped of haalt automatisch data op van boekingsplatformen, alles werkt met gegevens die de host zelf al heeft of zelf invult. Booking.com is bewust buiten scope (dat platform laat geen eigen vrije tekst toe, genereert de beschrijving zelf uit gestructureerde data). Social Media is een aparte upsell (nog te bouwen, teaser al aanwezig in de PDF met een "annulering/rustige periode"-post als eerste voorbeeld, prijs/URL daarvoor bewust nog niet genoemd). Bestanden: `docs/Graphic-Design/island-host-ai-prompt-kit.html` (brontekst/PDF, in browser openen, via Cmd+P opslaan als PDF) en `docs/island-host-ai-prompt-kit.md` (referentie, moet bij wijziging aan de HTML meebijgewerkt worden). Losse marketingpagina op de eigen website: `island-host-ai-prompt-kit.html` in de projectroot, nog niet live/gecommit. Verkoop via Gumroad (product `yfefbu`, $27), account staat op Nederland voor uitbetaling (zie Betaalprovider hieronder), custom landingpagina gepubliceerd via de Gumroad CLI. **Nog geen PDF-bestand geüpload naar Gumroad, dat is de laatste blokkade voor de eerste verkoop.** Zie `kennis/strategieplan.md` voor de actuele status en volgorde.

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
- Espressobruin: `#3a251b` (sinds 11-10-2026 vervangt dit het zwart #080403 op de website, voor vlakken én tekst)
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
- Donkere secties (bruin) voor contrast: footer, ticker, Mobile Office, playlist. Sinds 2026-10-19 zijn blog hero (blogs + FAQ), de "Why FUNkiness!"-band op de dienstenpagina's (`.seo-section--pink`) en Why Us op What We Do roze, zodat elke pagina crème, roze, crème, bruin (footer) leest
- Blob/plas-vormen in roze als decoratief element (zie homepage hero)
- Jeep met panterprint is het centrale visuele merk-icoon
- **Logo:** `funkiness-logo.png` in root. PNG met transparante achtergrond, 999x515px. Gebruikt in navbar op alle pagina's via `.logo-img` (100px mobiel, 120px desktop). Niet vervangen door tekst.

**Aanpak bij nieuwe pagina-elementen:**
Gebruik altijd organische overgangen (SVG-golf of blob) tussen secties met verschillende achtergrondkleuren. Nooit een harde rechte lijn tussen twee kleurvlakken.

**Kleurritme en zigzag (sinds 2026-10-19, op elke pagina):** blokken wisselen af bruin, crème, roze, crème, bruin, enzovoort. Bruin en roze nooit direct tegen elkaar, en ook niet twee keer bruin of twee keer roze met alleen crème ertussen. Opeenvolgende crème secties tellen als één crème blok. Tekst/beeld-blokken zigzaggen: tekst links + beeld rechts, dan in het volgende blok beeld links + tekst rechts. De hero telt niet mee, het zigzaggen begint bij het eerste blok eronder. Blokken zonder foto tellen ook mee (kaarten of formulier = beeldkant); gecentreerde blokken tellen niet. Homepage: diensten tekst links, FUNky Letter rechts, FUNky Ladies links, Mobile Office rechts, Why FUNkiness! links, scan rechts, playlist links. Modifiers: `.feature-split--reverse`, `.why-split--reverse`, `.page-hero--reverse`.

**Eigen vormtaal per pagina (sinds 2026-09-17):** elke pagina krijgt haar eigen blob-vorm-familie (foto-blokken, cirkels en "stat panels" op die pagina delen dezelfde unieke `border-radius`/rotatie) én haar eigen set golfvormen tussen secties, in plaats van sitewide identieke ovalen/golven te hergebruiken. Bij een nieuwe pagina: nieuwe vorm-variant toevoegen, niet een bestaande kopiëren. Zie style.css (`--ai`, `--strategy`, `--branding`, `--content`, `--social`-varianten) voor het patroon.

**CSS architectuur:**
style.css is **mobile-first**. Base styles zijn voor mobiel. Breakpoints: `min-width: 600px`, `700px`, `900px`, `1100px`. Gebruik altijd `min-width`, nooit `max-width`.

**Blog post template:**
Nieuwe blogposts volgen de structuur van bestaande posts (zie `blog-marketing-strategy-curacao.html`):
- `<header class="blog-hero">` met kicker + h1 + `.script-word`
- Direct na `</header>`: een `<div class="wave-divider" style="background:var(--pink)">` met crème SVG-golf (blog hero is roze sinds 2026-10-19)
- `<div class="blog-layout">` met `<aside class="blog-sidebar">` + `<article class="blog-post-body">`
- Minimaal één `.blog-callout` en een `.blog-post-cta` afsluiter
- Wave-divider (crème→zwart) WEL toevoegen vóór de footer
- Bestandsnaam: `blog-[onderwerp]-curacao.html`

**Grafische ontwerpbestanden:** alle visuele ontwerpen (logo's, foto's, panterprint, visitekaartjes, printbare HTML-ontwerpen, social media postbeelden) staan in `docs/Graphic-Design/` (koppelteken, geen spatie i.v.m. een live og:image-URL die daarop leunt). Planning- en tekstdocumenten blijven los in `docs/`. Nieuwe ontwerpbestanden hier toevoegen, niet los in `docs/`.

## Kennisbestanden

Lees deze bestanden voor meer detail:
- kennis/strategieplan.md (basisplan: wie/wat/waar/hoe/wanneer, levend document, altijd meelezen bij prioriteiten of nieuwe producten). Printbare versie: `docs/Graphic-Design/strategieplan-printbaar.html` (openen in browser, printen of Cmd+P naar PDF), moet na elke materiële wijziging aan het strategieplan opnieuw gegenereerd worden.
- kennis/over-mij.md
- kennis/missie-en-visie.md
- kennis/producten.md
- kennis/doelgroep.md
- kennis/schrijfstijl.md
- kennis/concurrenten.md
- kennis/veelgestelde-vragen.md

## Tools en projecten

**Betaalprovider voor online verkoop:** Gumroad, Payoneer, Lemon Squeezy en Fygaro ondersteunen geen uitbetaling naar Curaçao. Gumroad-account staat daarom op land Nederland, uitbetaling naar Daisy's Nederlandse privérekening. MCB Bank Internet Merchant Account wordt nu actief aangevraagd (KvK-inschrijving is rond). Businessplan voor de aanvraag: `docs/mcb-bank-business-plan.html` (bron) / `.md` (referentie) / `.pdf` (kant-en-klaar, altijd door Claude zelf genereren met headless Chrome `--print-to-pdf`, nooit via Daisy's eigen browser-printdialoog, en `@page{margin:2.5cm}` aanhouden, zie `docs/logs/2026-09-22/`). Handtekening: `docs/handtekening-daisy.png`. Volledige beslisboom in `kennis/strategieplan.md`.

**Gumroad CLI** (`gumroad`, via `brew install antiwork/cli/gumroad`, ingelogd via device-code OAuth): voor productbeheer (titel, beschrijving, prijs, custom landingpagina) zonder de browser-UI. Belangrijkste commando's: `gumroad products view <id>`, `gumroad products update <id> --name/--description/...`, `gumroad products page preview/publish <id> ./landing.html` (check altijd het `sanitization_report` voordat je publiceert).

**IndexNow (Bing/ChatGPT-vindbaarheid):** na elke live deploy met nieuwe of gewijzigde pagina's `sh scripts/indexnow.sh` draaien (meldt alle sitemap-URL's aan, verwacht HTTP 200/202). Sleutelbestand `11d8868433074608bc5520a00778147f.txt` in de root nooit verwijderen. ChatGPT zoekt via Bing, dus dit is de snelste route naar AI-zoekresultaten. WhatsApp zakelijk: +599 9 675 1737 (footer, contact, schema).

**funkiness-scan/**, de AI & Marketing Scan webapp (leadgenerator). Multi-step form, gepersonaliseerd rapport via Claude API, radar chart. Draait op Node.js/Express, poort 3001. Start met `node server.js` vanuit de map. Beveiligd met rate limiting (IP + email) en email confirmation flow: rapport is alleen toegankelijk via unieke token-link in de email. Nodemailer via Titan SMTP (smtp.titan.email:587, sayhello@funkiness.ai).

**Mobile office sectie + gratis sessie boeken (live sinds 2026-10-17)** - homepage-sectie "You pick the spot, we bring the office" (`index.html`/`nl/index.html`, `#book`, tussen FUNky Ladies en Jeep-galerij) met Cal.com-kalender (namespace `mo-inline`) die sinds 2026-10-19 ingeklapt zit achter de groene knop `.mo-toggle` en pas laadt na een klik; de Jeep-foto staat ernaast (Daisy vond de open kalender te groot). **Kleurvolgorde homepage (sinds 2026-10-19):** secties wisselen af crème, roze, crème, bruin, crème, roze, crème, bruin (diensten, FUNky Letter, FUNky Ladies, Mobile Office, Instagram, Why FUNkiness!, scan, footer). Nooit bruin en roze direct onder elkaar; bij nieuwe secties dit ritme aanhouden. Booking via **Cal.com** (`cal.com/funkiness/marketing-strategy-session`, gekoppeld aan Apple Agenda via CalDAV, locatie: adres van de klant, nooit videocall). Fel groene boekknop (#2bea5c) is de hoofd-CTA: in de header (Contact is een gewone menulink geworden), naast het hamburgermenu op mobiel, in het mobiele menu, in de cta-band/blog-CTA's en zwevend rechtsonder (niet op scan/quiz). Alles via `book.js` (elke `[data-book]`-link opent de Cal.com-pop-up) en de BOOK-blokken onderaan `style.css`.

**Nieuwsbrief-inschrijving (gebouwd 2026-10-18)** - homepage-sectie `#newsletter` (`index.html`/`nl/index.html`, direct onder What We Do), naam "The FUNky Letter" (NL: "De FUNky Letter"), link "FUNky Letter" in de footer van elke pagina. Taalkeuze EN (standaard) of NL, op de NL-homepage staat NL voorgeselecteerd. `newsletter.js` post naar `api/newsletter.js`: logt naar tabblad "Nieuwsbrief" in de scan-sheet (`nieuwsbriefInschrijving()` in `docs/google-sheet-scan-script.gs`, één rij per adres) en stuurt een welkomstmail in de gekozen taal vanuit sayhello@funkiness.ai (bcc sayhello). Afmelden voorlopig door "stop" te antwoorden; zodra er een nieuwsbriefprogramma (advies: Brevo) is, de lijst daarheen overzetten. Vermeld in het privacybeleid (EN/NL). Ook in de scan (`scan.html`, boven 'Get my scan report'): een vrijwillig, opvallend vinkje 'Yes, keep the tips coming with the FUNky Letter' (Daisy wilde het verplicht maken; afgeraden omdat verplichte toestemming onder de AVG niet geldig is en spammeldingen de deliverability van alle mail schaden). Aangevinkt: `scan-script.js` post naar `/api/newsletter` met bron `scan-social`/`scan-marketing`, taal NL als locatie Nederland is. Woord 'nieuwsbrief/newsletter' niet in zichtbare tekst gebruiken, Daisy vindt dat saai.

**Spotify-playlist (gebouwd 2026-10-19)** - homepage-sectie `#playlist` (`index.html`/`nl/index.html`, bruin, direct boven de footer): Daisy's playlist "Feel Good Funk | Curaçao" (https://open.spotify.com/playlist/3fPoCunEmMHFWb7YDUeOsP, staat op haar eigen account). De Spotify-speler laadt pas na een klik op de groene knop `.pl-toggle`, zodat Spotify geen cookies zet zonder keuze van de bezoeker. Inclusief MusicPlaylist-schema. Stijl: `.playlist-section` / `.pl-*` onderaan `style.css`.

**NFC visitekaartje** - fysiek kaartje met NFC-chip. Tik opent `connect.html` (funkiness.ai/connect). Bestanden: `connect.html` (landingspagina: WhatsApp, Instagram, TikTok, Website), `docs/Graphic-Design/visitekaartje.html` (print-klaar ontwerp Daisy, 85x55mm trim + 3mm bleed, dus 91x61mm paginaformaat, voor- en achterkant) en `docs/Graphic-Design/visitekaartje-berdien.html` (zelfde voorkant, achterkant zonder foto en zonder voorgedrukte naam: Berdien vult haar naam en telefoonnummer zelf met een pen in, blanco ruimte zonder hulplijnen). Panterprint met golvende rand via SVG clipPath. Wordt gedrukt bij **drukwerkdeal.nl** (niet meer Mobilo): Chrome-PDF-export (headless Chrome `--print-to-pdf`, `print-color-adjust: exact` in de CSS zodat achtergronden altijd meeprinten, papierformaat pakt automatisch 91x61mm) wordt **rechtstreeks als PDF geupload** bij "eigen ontwerp aanleveren", geen Affinity-tussenstap. Drukwerkdeal zet RGB automatisch om naar CMYK, dat is bevestigd goed gegaan bij de eerste bestelling. Enige bekende afwijking: het felle FUNkiness!-roze kan iets minder knallend ogen na de automatische conversie (CMYK-gamut-beperking). Zwarte tekst en de QR-code staan bewust op puur `#000` in de bron-HTML.

**Tweetalige website (NL/EN)** - sinds augustus 2026. Elke tweetalige pagina heeft een `nl/`-tegenhanger met dezelfde bestandsnaam (bv. `contact.html` ↔ `nl/contact.html`), gedeelde `style.css`, taalswitcher (🇬🇧/🇳🇱) in de navbar. `quiz.html`, `scan.html` en `island-host-ai-prompt-kit.html` blijven Engels-only. Vertaalgids: `docs/vertaalgids-website.md`. Design-spec: `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md`.

## Social media planning

Maandelijkse social media plannen staan in `docs/`. Huidig plan: `docs/social-media-plan-augustus-2026.md`, TikTok + Instagram + Facebook + YouTube Shorts, 14 posts, 3 t/m 31 augustus 2026, verdeeld over 7 ontwerptypes (elk onderwerp/doelgroep krijgt steeds dezelfde opzet). Scripts, captions per platform, ontwerpspecs per template, CapCut-instructies en kalender staan erin. Ontwerpen zijn vrolijk crème/roze, geen zware zwarte vlakken.

**Kant-en-klare postbeelden:** (de augustus-postbeelden `docs/Graphic-Design/social-posts-augustus-2026/` zijn op 2026-10-19 verwijderd, terug te halen uit git-commit f598cba^) `post-01.png` t/m `post-14.png`, 1080x1920, gerenderd met de echte huisstijlfonts (Poppins/Permanent Marker/Inter, opgehaald bij Google Fonts en lokaal ingebed). Gemaakt door de HTML-ontwerpen per post te bouwen en met headless Chrome (`Google Chrome.app` via CLI) naar PNG te renderen, zonder Canva. Bouwscript en losse HTML-bronbestanden stonden in de scratchpad van de sessie waarin ze gemaakt zijn, niet in de projectmap. Bij een nieuwe maand: hetzelfde recept herhalen (fonts downloaden, per-template Python-renderfuncties, headless Chrome screenshot op 1080x1920). CSV's voor eventueel handmatig Canva-gebruik staan nog in `docs/canva-augustus-2026/` maar zijn niet meer nodig om te posten.

**Kant-en-klare reels (video):** zelfde huisstijl-aanpak als de postbeelden, maar dan bewegend. Losse HTML-frames per animatiebeat gebouwd (pop-in met ease-out-back bounce, tilt, stempel-effect, korte witte flash-cuts tussen scenes), elk frame gerenderd met headless Chrome, daarna met `ffmpeg` (image-sequence naar mp4, 1080x1920) tot een reel samengevoegd. Kant-en-klare reels staan in `docs/Graphic-Design/social-media-posts/`, bestandsnaam verwijst naar de bijbehorende blogpost. Statische tekstkaarten zonder animatie zijn voor dit merk te saai bevonden, altijd kiezen voor de bewegende variant.

**Homepage Instagram-sectie:** `index.html`/`nl/index.html`, `.insta-grid` (3 kolommen, vierkante tegels). Toont alleen bestaande, echt gepubliceerde/bestaande content (nu de 4 jeep-foto's), nooit nog niet gepubliceerde social posts of concepten, ook niet als "voorbeeld". Zie `feedback_geen_ongepubliceerde_content_als_live` in het sessiegeheugen.

**Actieposts (reader-focused hookposts):** losse contentlijn naast de maandplannen en de humor-reels, gestart 2026-09-11. Elke post spreekt één specifieke branche direct aan (makelaar, bank, verhuurder, etc., roterend) met een concreet, direct uitvoerbaar advies/test, hook groot en alleen op het beeld (geen tagline/badge meer), caption in het Nederlands met een zoekwoord-openingszin, max 5 hashtags. Bronfoto's van Daisy en hun AI-bewerkte varianten (jurk naar panterprint/magenta/paars via OpenRouter, `google/gemini-3-pro-image`) staan in `docs/Graphic-Design/social-media-posts/foto's Daisy origineel/`. Opgeleverde posts staan als losse PNG's in `docs/Graphic-Design/social-media-posts/` (bv. `daisy-teach-it-post-04.png`). Volledige regels (eye-opener-lat, crop-veilige tekstmarges, verplichte voor/na-fotocheck) staan in het sessiegeheugen van Claude, niet hier; zie `docs/logs/2026-09-14/` voor de volledige uitleg en aanloop.

Contenttoon: altijd vanuit mogelijkheden en positiviteit (The Magician). Geen roast-content of "hier is wat iedereen fout doet"-aanpak.

**Content Prompt Bank:** `docs/content-prompt-bank.md` bevat een verzameling AI-contentprompts (hooks, captions, content ideeën, reel-scripts, stories, doelgroepprofielen, verkoopcontent, contentkalenders) die de vaste basis vormen voor alle content die voor FUNkiness! gemaakt wordt. Bij elk gebruik: [ ] altijd vervangen door FUNkiness!-eigen info, en de output daarna nog toetsen aan de merkregels in dit bestand. Groeit mee met nieuwe prompts die Daisy aandraagt.

## Sessie logs

Logs staan in docs/logs/YYYY-MM-DD/. Zie de laatste log voor recente acties en openstaande punten.

- 2026-10-14: Scanmail gerepareerd, scans zonder verzinsels (feiten met bron per locatie, controle per zin), Social Media Scan uitgebreid en 3x sneller, echte Instagram-cijfers via Meta-app; open: eigen testscan Daisy, daarna Marketing Scan: docs/logs/2026-10-14/01-scans-mail-bronnen-instagram.md
- 2026-09-22: Website-creativiteitsronde (eigen vormtaal per pagina), social media reel + Realtors-post, MCB-businessplan afgerond en kritisch nagelopen (VS-claim en verouderde toerismecijfers verwijderd, jaar 1-aannames realistischer getimed): docs/logs/2026-09-22/01-website-creativiteit-social-reel-mcb-businessplan.md
- 2026-09-14: Actiepost-format ontwikkeld (branche-per-post, eye-opener-lat, hook-alleen beeldopmaak), Instagram grid-crop-fout gecorrigeerd (horizontaal, niet verticaal), fotobewerkingsfout gevonden (AI verzon sieraad) en verplichte voor/na-check ingevoerd: docs/logs/2026-09-14/01-social-media-posts-actiepost-format.md
- 2026-09-11: Youvia GEO-whitepaper geanalyseerd, sameAs-links en nieuwe FAQ live, GEO-blogpost + reel gepubliceerd, outreach-strategie eerste klant vastgelegd, AI Visibility Scan grotendeels gebouwd (taak 7 wacht op review testmails): docs/logs/2026-09-11/01-geo-whitepaper-tot-ai-visibility-scan.md
- 2026-09-09: Repost/Repurpose/Reinvent-methode (@bizwithlaurelle) vastgelegd, koerscorrectie: augustus-postbeelden staan nog niet live, dat is het openstaande punt: docs/logs/2026-09-09/01-repost-strategie-en-augustus-posts-nog-niet-live.md
- 2026-09-03: Visitekaartje Daisy print-klaar (drukwerkdeal-marge-fix, Affinity losgelaten voor directe RGB-upload, bevestigd goed gedrukt), nieuw Berdien-kaartje (blanco naam/nummer), docs/Graphic-Design/ map opgezet: docs/logs/2026-09-03/01-visitekaartje-berdien-en-graphic-design-map.md
- 2026-08-13: Tweetalige website (NL/EN) gebouwd via subagent-driven-development, merkregel-fixes, servicekaart-overlap opgelost, NL-vertaling losser gemaakt. Open punt: titelgroottes op mobiel nog niet gecheckt: docs/logs/2026-08-13/01-tweetalige-website-nl-en.md
- 2026-08-06: Promptbank opgeslagen (@merelnijman + 20-prompt lijst), harde contentstijl-correctie (niet-commercieel, humor, viral), Higgsfield VFX-experiment: docs/logs/2026-08-06/01-promptbank-en-humor-contentstijl-higgsfield-vfx.md
- 2026-08-04: Visitekaartje print-klaar gemaakt (bleed, aanleverspecs drukwerkdeal, fotofix, Affinity-workflow): docs/logs/2026-08-04/02-visitekaartje-print-ready.md
- 2026-08-04: Prompt Kit lancering, betaalprovider-crisis, Gumroad live, grote kritische contentherziening (12 prompts): docs/logs/2026-08-04/01-prompt-kit-lancering-en-betaalprovider-crisis.md
- 2026-07-31: Strategisch herstart, kennis/strategieplan.md, The Spark Plan, site-fixes en agenda: docs/logs/2026-07-31/01-strategisch-herstart-en-uitvoeringsplan.md
- 2026-07-24: Social media plan augustus 2026, 14 posts over 7 Canva-templates: docs/logs/2026-07-24/02-social-media-plan-augustus-2026.md
- 2026-07-24: Scan e-mailflow gerepareerd (SMTP-server, JSON-crash, vangnet-logging): docs/logs/2026-07-24/01-scan-email-flow-smtp-fix.md
- 2026-06-29: Website updates, logo, NFC visitekaartje — docs/logs/2026-06-29/01-website-logo-visitekaartje.md
- 2026-06-26: Mobile office preview updates — docs/logs/2026-06-26/01-mobile-office-preview-updates.md
