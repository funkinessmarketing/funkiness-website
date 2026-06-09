# Mijn Mainframe

Dit is het geheugen van mijn AI. Alles wat hier staat, leest Claude bij elke sessie. Gebruik deze informatie bij elk antwoord.

## Mijn bedrijf

Ik ben Daisy, en samen met Berdien run ik **FUNkiness! AI, Social Media & Marketing** op Curaçao. We zijn allebei ervaren marketeers uit Nederland die de stap naar het eiland hebben gemaakt. Marketing op Curaçao is nog heel traditioneel — iedereen doet hetzelfde, niemand springt eruit. FUNkiness! is ons antwoord daarop.

Merkpositie: *FUNkiness! is wat er gebeurt als een luxury creative agency en een Miami poolparty samen een AI-baby krijgen, en dat kind opgroeide met Vogue lezen en algoritmes bouwen.*

Merkarchetype: **The Magician meets The Outlaw.** Merkpersoonlijkheid: Sharp. Tropical. Cinematic. Rebellious. Alive. Energetic.

We zitten in de opstartfase. Slogan: *Boring was never the plan.*

## Producten en diensten

FUNkiness! is een **fullservice marketingbureau**: strategie, AI-integratie, social media, content en campagnes.

**AI & Marketingscan** - onze leadgenerator. Bedrijven vullen online een scan in en ontvangen een uitgebreide rapportage over hun marketing- en AI-situatie. Scan knop op website linkt naar https://scan.funkiness.ai (apart in te stellen).

**Social media abonnementen** (in ontwikkeling) - structurele ondersteuning op content en strategie. Prijzen nog uit te werken.

## Doelgroep

Alle bedrijven op Curaçao: hotels, resorts, makelaars, restaurants, Airbnb-verhuurders, banken en meer. Budget maakt niet uit: zowel grote bedrijven als kleine verhuurders zijn welkom. Geen vaste pakketten, altijd op maat.

## Schrijfstijl

Casual, direct, bold, met humor. Altijd positief en vanuit eigen kracht. Kort en krachtig. Nooit corporate, traag, voorspelbaar, safe of verontschuldigend. Engels op de website, Nederlands en Engels op social media. TikTok is een kernplatform. Altijd spreektaal.

Verboden: emdash, woorden als 'premium' of 'luxury', negatieve vergelijkingen met anderen of de markt, onverifieerbare claims over concurrenten.

Als een tekst saai klinkt, past hij niet bij FUNkiness!

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

**funkiness-scan/** — de AI & Marketing Scan webapp (leadgenerator). Multi-step form, gepersonaliseerd rapport via Claude API, radar chart. Draait op Node.js/Express, poort 3001. Start met `node server.js` vanuit de map. Beveiligd met rate limiting (IP + email) en email confirmation flow: rapport is alleen toegankelijk via unieke token-link in de email. Nodemailer via Titan SMTP (smtp.titan.email:587, sayhello@funkiness.ai).

## Sessie logs

Logs staan in docs/logs/YYYY-MM-DD/. Zie de laatste log voor recente acties en openstaande punten.
