# Mijn Mainframe

Dit is het geheugen van mijn AI. Alles wat hier staat, leest Claude bij elke sessie. Gebruik deze informatie bij elk antwoord.

## ABSOLUTE REGELS (nooit negeren)

**EMDASH VERBOD:** Gebruik NOOIT een emdash (—) in welke output dan ook. Niet in teksten, HTML, emails, prompts, code comments, API calls of enig ander bestand. Vervang altijd door een komma, punt, koppelteken (-) of nieuwe zin. Dit geldt ook voor content die Claude genereert namens FUNkiness! via de API. Geen uitzonderingen. Daisy heeft dit tientallen keren gecorrigeerd.

**SEPARATOR VERBOD:** Gebruik NOOIT " - " (spatie-koppelteken-spatie) als separator in labels, titels of output. Vervang door een dubbele punt (": "), komma of nieuwe zin.

**GEEN ONVERIFIEERBARE CLAIMS:** Verzin geen tijdpaden, statistieken, marktposities of claims over concurrenten die Daisy niet zelf kan bevestigen.

## Mijn bedrijf

Ik ben Daisy, en samen met Berdien run ik **FUNkiness! AI, Social Media & Marketing** op Curaçao. We zijn allebei ervaren marketeers uit Nederland die de stap naar het eiland hebben gemaakt. Marketing op Curaçao is nog heel traditioneel, iedereen doet hetzelfde, niemand springt eruit. FUNkiness! is ons antwoord daarop.

Merkpositie: *FUNkiness! is wat er gebeurt als scherpe AI-strategie, Caribische energie en een diep gebrek aan geduld voor saaie content samenkomen op Curaçao.*

Merkarchetype: **The Magician meets The Outlaw.** Merkpersoonlijkheid: Sharp. Tropical. Cinematic. Rebellious. Alive. Energetic.

We zitten in de opstartfase. Slogan: *Boring was never the plan.*

## Producten en diensten

FUNkiness! is een **fullservice marketingbureau**: strategie en AI-integratie eerst, daarna content, campagnes en kanaalmanagement. Positionering is fullservice marketingbureau, NIET 'AI agency' (boring en te beperkt) en NIET social media bureau. Ze zetten AI in als onderdeel van strategie en uitvoering, maar het gaat om marketing in de breedste zin van het woord. Noem FUNkiness! nooit een "AI agency."

**AI & Marketingscan** - leadgenerator #1. Bedrijven vullen online een scan in en ontvangen een uitgebreide rapportage over hun marketing- en AI-situatie. Scan knop op website linkt naar https://scan.funkiness.ai (apart in te stellen). Vercel serverless: `api/marketing-scan.js`.

**AI Superpower Quiz** - leadgenerator #2. "What's Your AI Superpower?", 8 vragen, 4 archetypes (Time Terminator, Content Crusher, Growth Guru, Experience Engine). Resultaat via Claude API, deelbaar via WhatsApp. Bestanden: `quiz.html`, `quiz-script.js`, `api/archetype-quiz.js`.

**Social media abonnementen** (in ontwikkeling) - structurele ondersteuning op content en strategie. Prijzen nog uit te werken.

**Island Host AI Prompt Kit** - downloadbaar digitaal product ($27). 25 AI-prompts + 1 bonusprompt voor vakantieverhuurders op Aruba, Bonaire en Curaçao. Focus: zoveel mogelijk boekingen binnenhalen via de platforms. Verdeeld in 3 categorieën: Listing Descriptions (01-10, per platform), More Bookings/Algorithm (11-20), Host Profile (21-25). Plus 1 bonus: direct booking reply via Instagram DM of WhatsApp. Social Media is een aparte upsell (nog te bouwen). Bestand: `docs/island-host-ai-prompt-kit.html` (in browser openen, via Cmd+P opslaan als PDF). Referentiebestand: `docs/island-host-ai-prompt-kit.md`. Verkoop via Gumroad ($27). Upsell: Social Media Prompt Kit + Video Script Kit (nog te bouwen). Marketing via TikTok demo + WhatsApp groepen ABC eilanden.

Productstructuur: gebruiker vult Property Fact Sheet eenmalig in, kopieert naar ChatGPT/Claude, gebruikt dan prompts zonder property details opnieuw in te typen. Listing Descriptions zijn per platform georganiseerd: Airbnb (01-02), VRBO (03), Micazu (04), Universal tools (05-10). Airbnb Prompt 01 heeft 5 aparte outputs: Dutch (in het Nederlands), American (Engels), Canadian (Engels, winter escape focus), Your Space Engels, Your Space Nederlands. Advies: auto-vertaling Airbnb uitzetten, eigen tekst per taal handmatig invoeren. VRBO heeft geen multi-taal support. More Bookings sectie (11-20) dekt algoritme, foto's, reviews en Superhost strategie. Host Profile (21-25): FAQ, huisregels, bio, lokale tips, review responses. Guest emails, WhatsApp en Social Media zijn niet opgenomen in dit product.

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

## Social media planning

Maandelijkse social media plannen staan in `docs/`. Huidig plan: `docs/social-media-plan-juni-2026.md`, TikTok + Instagram, 10 posts, 11 juni t/m 1 juli 2026. Scripts, captions, CapCut-instructies en kalender staan erin.

Contenttoon: altijd vanuit mogelijkheden en positiviteit (The Magician). Geen roast-content of "hier is wat iedereen fout doet"-aanpak.

## Sessie logs

Logs staan in docs/logs/YYYY-MM-DD/. Zie de laatste log voor recente acties en openstaande punten.
