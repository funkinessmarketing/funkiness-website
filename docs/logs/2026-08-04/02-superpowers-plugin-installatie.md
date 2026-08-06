# Superpowers-plugin geïnstalleerd via Claude Code CLI

**Datum:** 2026-08-04
**Project:** Het Mainframe (FUNkiness!)

---

## Installatie van de externe plugin "Superpowers" (obra/superpowers-marketplace)

**Wat:** Daisy wilde de gratis, externe plugin "Superpowers" van obra installeren. Deze voegt een gestructureerde workflow toe (`/brainstorm` → plan/bouwplan → `/execute-plan`) zodat ideeën eerst scherp gemaakt en gepland worden voordat er gebouwd wordt.
**Bestanden:** geen wijzigingen aan projectbestanden, de installatie gebeurt op CLI/plugin-niveau, niet in de repo.
**Waarom:** Daisy wil voortaan eerst denken en plannen voordat er gebouwd wordt, in plaats van hap-snap ontwikkelen (zie [[feedback_strategie_voor_uitvoering]]).

---

## Belangrijke ontdekking: /plugin werkt niet in de VSCode-extensie

**Wat:** De eerste poging om `/plugin marketplace add obra/superpowers-marketplace` direct in deze VSCode Claude Code-sessie te draaien mislukte twee keer met "/plugin isn't available in this environment." De VSCode-extensie van Claude Code ondersteunt (nog) geen plugins/marketplace-commando's, alleen de losstaande terminal-CLI doet dat.
**Bestanden:** n.v.t.
**Waarom belangrijk:** Superpowers (en elke andere toekomstige plugin) moet dus altijd via een losse Terminal-sessie met `claude` geïnstalleerd en gebruikt worden, niet via deze VSCode-integratie. De skills/commando's van de plugin (`/brainstorm`, `/write-plan`, `/execute-plan`) draaien daarna ook alleen in die terminal-sessies, niet hier in VSCode.

---

## Stappen die wel werkten (in Terminal.app, niet VSCode)

**Wat:**
1. `claude` gestart in een losse Terminal.app-sessie (bevestigd via `which claude` → `/usr/local/bin/claude`, geen rare alias).
2. `/plugin marketplace add obra/superpowers-marketplace` → gelukt.
3. `/plugin install superpowers@superpowers-marketplace` → geïnstalleerd, "user scope" gekozen (geldt voor alle projecten van Daisy).
4. `/reload-plugins` → 1 plugin, 6 agents, 1 hook geladen.
5. `/brainstorm` getest → werkt, begint direct met het verkennen van de projectcontext.
**Bestanden:** n.v.t.
**Waarom:** Bevestigen dat de installatie geslaagd is voordat Daisy het gesprek verder voert.

---

## Openstaand

Daisy was bezig met een `/brainstorm`-sessie in de terminal (project-context werd verkend) toen de sessie hier werd afgesloten met `/finish`. Dat brainstormgesprek moet ze in de terminal zelf afmaken; de uitkomst (plan/bouwplan) kan ze daarna hier in VSCode plakken om mee verder te werken.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Superpowers-plugin geïnstalleerd (marketplace + install + reload) | Klaar |
| Ontdekt dat /plugin niet werkt in VSCode-extensie, alleen in terminal-CLI | Klaar |
| /brainstorm getest en werkend bevonden in terminal | Klaar |
| Brainstormgesprek over eerste toepassing afmaken | Openstaand, bij Daisy in de terminal |
