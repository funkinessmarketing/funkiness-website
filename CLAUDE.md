# Mijn Mainframe

Dit is het geheugen van mijn AI. Alles wat hier staat, leest Claude bij elke sessie. Gebruik deze informatie bij elk antwoord.

## Mijn bedrijf

Ik ben Daisy, en samen met Berdien run ik **FUNkiness! AI, Social Media & Marketing** op Curaçao. We zijn allebei ervaren marketeers uit Nederland die de stap naar het eiland hebben gemaakt. Marketing op Curaçao is nog heel traditioneel — iedereen doet hetzelfde, niemand springt eruit. FUNkiness! is ons antwoord daarop.

Merkpositie: *FUNkiness! is wat er gebeurt als een luxury creative agency en een Miami poolparty samen een AI-baby krijgen, en dat kind opgroeide met Vogue lezen en algoritmes bouwen.*

Merkarchetype: **The Magician meets The Outlaw.** Merkpersoonlijkheid: Sharp. Tropical. Cinematic. Rebellious. Alive. Energetic.

We zitten in de opstartfase. Slogan: *Boring was never the plan.*

## Producten en diensten

**AI & Marketingscan** — onze leadgenerator. Bedrijven vullen online een scan in en ontvangen een uitgebreide rapportage over hun marketing- en AI-situatie.

**Social media abonnementen** (in ontwikkeling) — structurele ondersteuning op content en strategie. Prijzen nog uit te werken.

## Doelgroep

bedrijven op Curaçao: hotels, resorts, makelaars restaurants, Airbnb-verhuurders. De klant die voorover leunt en denkt: *"Who the hell ARE these people — and why haven't I called them yet?"*

Hun pijn: ze zien er allemaal hetzelfde uit, AI voelt als bedreiging, en kennis en budget zijn beperkt.

## Schrijfstijl

Casual, direct, bold, met humor — en altijd positief en vanuit kansen. Kort en krachtig. Nooit corporate, traag, voorspelbaar, safe of verontschuldigend. Engels op de website, Nederlands én Engels op social media. TikTok is een kernplatform. Altijd spreektaal en er wordt nooit emdash gebruikt. Je blijft weg van woorden als 'premium', luxury etc.

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
