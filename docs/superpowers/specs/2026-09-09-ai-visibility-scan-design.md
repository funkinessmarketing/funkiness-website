# AI Visibility Scan, design

Datum: 2026-09-09
Status: goedgekeurd door Daisy, klaar voor implementatieplan

## Doel

Een derde scan-variant naast de bestaande Social Media Scan en Marketing Strategy Scan op `scan.html`, gericht op de vraag: is dit bedrijf al zichtbaar in AI-zoekresultaten (ChatGPT, Perplexity, Google AI Overviews)? Dient als leadgenerator voor de outreach-route naar de eerste klant (zie `kennis/strategieplan.md`, "Directe outreach voor de eerste klant").

**Harde eis van Daisy:** het rapport moet iets opleveren dat een bedrijf dat zelf redelijk AI-vaardig is, niet zelf kan namaken. Puur "vraag het aan ChatGPT" is niet genoeg, dat kan iedereen zelf. De technische website-audit (structured data, Q&A-content) is het onderscheidende onderdeel: dat vereist code, geen prompt.

## Entry point en formulier

Derde keuze-kaart op `scan.html`, zelfde UI-patroon als de bestaande twee. Nieuwe velden t.o.v. de bestaande scans:

| Veld | Verplicht | Nieuw t.o.v. bestaande scans |
|---|---|---|
| Bedrijfsnaam | ja | nee |
| Sector (hotel/restaurant/makelaar/airbnb/anders) | ja | nee |
| Plaats op Curaçao | ja | **ja**, nodig voor realistische AI-zoekvragen |
| Website-URL | nee | **ja** |
| Instagram | nee | nee |
| Naam, functie, email, telefoon | ja/nee zoals nu | nee |
| Honeypot | verborgen | nee |

Zonder website-URL: de audit-sectie vervalt, het rapport valt terug op alleen het AI-zoekvragen-deel plus een aanbeveling om eerst een website te bouwen.

## Backend: `api/geo-scan.js` (nieuwe Vercel serverless function)

Zelfde skelet als `api/scan.js`/`api/marketing-scan.js`: validatie, honeypot-check, Google Sheets-webhook log (vangnet, met `type: 'geo'`), dan de scan-logica, dan Claude-rapportgeneratie, dan twee e-mails.

### Stap 1: technische audit (alleen als URL is opgegeven)

- Fetch de HTML van de opgegeven URL, met timeout (5s) en size-limit, in een try/catch. Fetch-fout of timeout is geen crash: de audit-sectie wordt dan leeg gelaten en het rapport meldt dat de site niet bereikbaar was.
- Checks (elk simpele string/regex-checks op de opgehaalde HTML, geen headless browser nodig):
  1. JSON-LD structured data aanwezig, en bevat het een Organization/LocalBusiness of FAQPage type
  2. Vraag-antwoord-achtige content aanwezig (heuristiek: een `<h2>`/`<h3>`/`<summary>` die eindigt op `?`, gevolgd door tekst)
  3. Meta description aanwezig en van redelijke lengte (50-160 tekens)
  4. Viewport meta tag aanwezig (mobile-signaal)
- Elke check levert true/false op, gebruikt voor scoring en voor de audit-samenvatting die naar Claude gaat voor het rapport.

### Stap 2: live AI-zoekvragen (altijd, 5 vragen)

- 5 klantvragen worden samengesteld uit vaste templates per sector + de opgegeven plaats (geen AI-call nodig om de vragen te bedenken, dat bespaart kosten/tijd). Voorbeeld voor sector "hotel", plaats "Willemstad": "best boutique hotel in Willemstad Curaçao", "where to stay in Willemstad Curaçao", etc. Sjablonen per sector worden vooraf vastgelegd in de code (zelfde stijl als de bestaande `sectorLabel`-mapping in `api/scan.js`).
- Elke vraag gaat naar een websearch-gegrond model via **OpenRouter** (`OPENROUTER_API_KEY` uit `.env`, nooit een directe Perplexity-koppeling, conform de vaste regel). Voorgesteld model: `perplexity/sonar`, instelbaar via een constante bovenin het bestand zodat dit later makkelijk te wijzigen is.
- De 5 calls lopen **parallel** (`Promise.all`), niet na elkaar, om binnen de serverless timeout te blijven.
- Per antwoord: simpele tekst-match of de bedrijfsnaam voorkomt in het AI-antwoord. Resultaat: `mentioned: true/false` per vraag, plus het ruwe antwoord (voor eventuele latere analyse, niet per se getoond in het rapport).
- Een individuele call die faalt (rate limit, timeout) telt als `mentioned: false, error: true` en breekt de rest niet af.

### Stap 3: score

AI Visibility Score /100, altijd deterministisch berekend, nooit door Claude verzonnen:
- Met URL: audit (4 checks x 10 punten = 40) + AI-vermeldingen (5 vragen x 12 punten = 60)
- Zonder URL: AI-vermeldingen (5 vragen x 20 punten = 100)

### Stap 4: rapportgeneratie (Claude API, rechtstreeks, zelfde als bestaande scans)

Tool-calling schema zoals in `api/scan.js`, met verplichte velden:
- `intro`: 2 zinnen, specifiek voor dit bedrijf
- `audit_summary`: samenvatting van de technische bevindingen (leeg/aangepast als er geen URL was)
- `ai_search_summary`: samenvatting van wat er gebeurde bij de 5 zoekvragen, welke platforms/vragen het bedrijf wel/niet noemden
- `action_point_1`, `action_point_2`, `action_point_3`: elk volledig uitgewerkt, concreet uitvoerbaar vandaag, gebaseerd op de echte bevindingen (geen verzonnen adviezen)
- `teaser_more`: 1-2 zinnen, "dit zijn 3 quick wins, er liggen nog meer kansen specifiek voor [bedrijf]"
- `cta_text`: persoonlijke uitnodiging om te praten

Prompt bevat expliciet: gebruik alleen de aangeleverde audit- en zoekresultaten, verzin geen extra statistieken (zelfde regel als de bestaande `CURACAO_CONTEXT`-aanpak).

## E-mail

Zelfde tweeledige patroon als de bestaande scans:
1. **Naar de aanvrager:** rapport met score-gauge, audit-samenvatting, AI-zoeksamenvatting, de 3 actiepunten, de teaser, en een CTA-knop "Plan een gesprek met Daisy" die linkt naar `BOOKING_URL`.
2. **Naar sayhello@funkiness.ai:** volledige lead-email met alle formuliergegevens plus de score, zelfde tabel-opmaak als de bestaande lead-emails. Dit is de "kopie in mijn mailbox"-eis van Daisy, al gedekt door het bestaande patroon.

`BOOKING_URL` is een losse constante bovenin `api/geo-scan.js`. Voorlopig `mailto:sayhello@funkiness.ai`, wordt later een Cal.com-link zodra die bestaat (Daisy legt dit apart uit hoe op te zetten, buiten deze build).

## Kosten en risico's

- **Kosten:** 5 parallelle OpenRouter websearch-calls per scan is duurder dan de bestaande scans (die alleen 1 Claude-tekstcall doen). Geen hard budget afgesproken, wel iets om na livegang in de gaten te houden.
- **Serverless timeout:** fetch + 5 parallelle AI-calls + 1 Claude-rapportcall moet binnen de Vercel functie-timeout passen. `vercel.json` moet mogelijk een hogere `maxDuration` krijgen voor dit endpoint specifiek (te checken tijdens implementatie, huidige Vercel-plan onbekend).
- **Site-fetch kan mislukken:** afgehandeld met graceful fallback, geen crash.
- **OpenRouter-call kan mislukken:** afgehandeld per vraag, telt als "niet gevonden", breekt de rest niet af.

## Niet in scope

- Geen headless browser/crawling van meerdere pagina's, alleen de opgegeven URL zelf.
- Geen NL-versie (scan.html blijft Engelstalig, zelfde regel als de bestaande scans).
- Geen Cal.com-opzet in deze build, dat is een apart, later te bespreken onderwerp.

## Testplan (handmatig, geen bestaande testsuite in dit project)

1. Bedrijf met website die al goede structured data heeft
2. Bedrijf met website zonder structured data
3. Bedrijf zonder website (URL-veld leeg)
4. Bedrijfsnaam die in geen van de 5 AI-antwoorden voorkomt
5. Honeypot ingevuld, wordt geweigerd
6. Ongeldige/ontbrekende verplichte velden, wordt geweigerd
7. Simuleer een OpenRouter-fout (verkeerde key) en bevestig dat het rapport toch afrondt met "niet gevonden" resultaten in plaats van te crashen
