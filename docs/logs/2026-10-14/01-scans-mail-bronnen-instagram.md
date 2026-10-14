# Scans: mailfix, niets verzinnen, bronnen per locatie, echte Instagram-cijfers

**Datum:** 2026-10-14
**Project:** Het Mainframe (FUNkiness! website)

## Aanleiding
Daisy ontving geen melding of rapport bij ingevulde scans. Daarna: kritische ronde over de inhoud van de scans.

## Wat er is gedaan
- **Mail:** mails werden afgebroken omdat Vercel stopt na het antwoord; nu afgewacht. Telefoonnummers met + gaven #ERROR! in de sheet. Inlog SMTP werkt, maar aankomst vanaf Vercel blijft onzeker: Apps Script-melding via Gmail (funkinessmarketing@gmail.com) staat klaar in `docs/google-sheet-scan-script.gs`, **nog niet geplakt door Daisy**.
- **Niets verzinnen:** verzonnen sectorbenchmarks en foute toerismecijfers weg. Vaste feitenlijst met bron-URL per locatie (Curaçao, Aruba, Bonaire, Nederland, elders) in `api/_scan-vragen.js`. Feiten worden letterlijk geciteerd met bronnummer; controle per zin door Claude Sonnet 5.5; verzonnen getallen worden afgevangen.
- **Social Media Scan inhoud:** vragen over locatie, doel, doelgroep, wie de marketing doet, uitdaging, resultaat van social; kanalen incl. LinkedIn, YouTube, WhatsApp Business (X/Threads en Pinterest eruit). Rapport: 3 stappen per categorie, quick win als stappenplan, 30-dagenplan, 3 postideeën, antwoord op de uitdaging, bronnen. Pdf-download met grafiek.
- **Snelheid:** van ~60 naar ~16-24 seconden (Haiku 5.5 schrijft in twee helften tegelijk, Sonnet 5.5 controleert op lage effort in drie delen).
- **Echte Instagram-cijfers:** Meta-app "FUNkiness! Scan" + Business Discovery; live getest. Sleutel in `.env` en Vercel.

## Open punten (morgen verder)
1. Daisy doet een eigen scan met @funkiness.ai en stuurt de pdf: is de Social Media Scan "echt helemaal goed"?
2. Daarna pas: Marketing Strategy Scan (social presence-vraag, context, extra waarde).
3. Apps Script met Gmail-melding plakken in de sheet (account funkinessmarketing@gmail.com).
4. Instagram-sleutel verloopt 13-12-2026: systeemgebruiker-sleutel maken en oude (gelekte) sleutel intrekken via Bedrijfsintegraties.
5. Later: Facebook-cijfers (bedrijfsverificatie + App Review), eventueel TikTok via eigen login.
6. Testregels "TEST Claude" uit de sheet verwijderen.
