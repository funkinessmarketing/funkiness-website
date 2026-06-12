# SEO/GEO headlines, positionering en quiz content rewrite

**Datum:** 2026-06-12
**Project:** FUNkiness! website

---

## Emdash programmatisch gestript uit alle API-bestanden

**Wat:** Em dashes verwijderd uit `api/archetype-quiz.js`, `api/marketing-scan.js`, `api/scan.js` en `CLAUDE.md`. Programmatische strip toegevoegd in `api/archetype-quiz.js` als vangnet na API-generatie.
**Bestanden:** `api/archetype-quiz.js`, `api/marketing-scan.js`, `api/scan.js`, `CLAUDE.md`
**Waarom:** Em dashes blijven terugkomen in gegenereerde content ondanks de regel. Dubbele bescherming: striktere regel in CLAUDE.md én automatische strip na generatie.

---

## ABSOLUTE REGELS blok toegevoegd aan CLAUDE.md

**Wat:** Bovenaan CLAUDE.md een prominente sectie "ABSOLUTE REGELS" toegevoegd met het emdash-verbod als eerste regel. Memory-bestand aangescherpt met context waarom dit de meest herhaalde correctie is.
**Bestanden:** `CLAUDE.md`, `memory/feedback_geen_emdash.md`
**Waarom:** Regel stond al in memory en CLAUDE.md maar werd toch niet gevolgd. Prominentere plaatsing als eerste wat Claude leest.

---

## Word-spacing quiz result tagline verhoogd

**Wat:** `.result-tagline` in `quiz.html` krijgt `word-spacing: 0.08em` en `letter-spacing: 0.01em`.
**Bestanden:** `quiz.html`
**Waarom:** Daisy: tekst "You have stories. AI just needs to help you tell them faster." stond te dicht op elkaar.

---

## Quiz lettertype quick wins vergroot

**Wat:** Nummers (01/02/03) van 24px naar 32px, titels van 16px naar 19px, bodytekst van 14px naar 15px, sectielabels van 11px naar 13px.
**Bestanden:** `quiz.html`
**Waarom:** Daisy vond de tekst te klein in de Quick wins sectie.

---

## Quiz archetype content volledig herschreven

**Wat:** Alle 12 quick wins (3 per archetype) en alle shortTerm/mediumTerm arrays herschreven met concrete stappen, copy-paste prompts en exacte how-to instructies.
**Bestanden:** `quiz-script.js`
**Voorbeelden van verbetering:**
- "Generate 5 captions in one go" → "Turn this week's photos into captions right now" met exacte ChatGPT-prompt
- "Build your ideal customer profile with AI" → met letterlijke prompt om te plakken
- "Set up 5 WhatsApp quick replies today" → inclusief pad in de app (Business Tools > Quick Replies)
**Waarom:** Daisy: "ik vind dit echt geen eye openers en je geeft ook niet goed genoeg aan HOE ze iets moeten doen."

---

## Alle page-level headlines herschreven voor SEO/GEO

**Wat:** H1 en h2 op alle pagina's geauditeerd en herschreven zodat elke headline tenminste één SEO/GEO-signaal bevat (Curaçao, AI, marketing, brand strategy).
**Bestanden:** `index.html`, `what-we-do.html`, `blog.html`, `contact.html`, `scan.html`, `faq.html`, `blog-marketing-strategy-curacao.html`
**Wijzigingen (selectie):**
- "Bold ideas. Zero fluff." → "Marketing, social media and AI for Curaçao businesses."
- "Let's talk." → "Let's build your Curaçao marketing strategy."
- "Your business. No filter." → "Free AI & Marketing Scan for businesses on Curaçao."
- "Everything you want to know about FUNkiness!" → "AI marketing on Curaçao: your questions answered."
**Waarom:** Daisy wil direct gevonden worden via Google en AI-zoekmachines (Perplexity, ChatGPT).

---

## Positionering verschoven van social media bureau naar strategy + AI agency

**Wat:** Teksten die FUNkiness! als social media bureau lieten overkomen herschreven.
**Bestanden:** `what-we-do.html`, alle 10 HTML-bestanden (footer)
**Wijzigingen:**
- Hero tagline: servicelijst vervangen door "Strategy and AI first. Then everything that follows."
- Ticker: "SOCIAL MEDIA" → "BRAND POSITIONING"
- Service card: "Social Media & Content" → "Content & Campaigns" met strategie-eerste tekst
- Footer tagline: "AI, social media and marketing with personality." → "AI-powered marketing strategy. Based on Curaçao." op alle 10 pagina's
**Waarom:** Daisy wil niet het zoveelste social media bureau lijken.

---

## Who We Are sectie meerdere keren bijgesteld

**Wat:** Headline en bodytekst van de "Who We Are" sectie op `what-we-do.html` herschreven na meerdere rondes feedback.
**Eindversie headline:** "Brand strategy and AI, rooted in Curaçao."
**Eindversie P1:** "Daisy and Berdien. Between us: years of brand strategy, campaign management, digital marketing and AI. We built FUNkiness! on Curaçao because this island deserves marketing that actually dares."
**Gecorrigeerde fouten:**
- "Not your average agency" verwijderd (cliché)
- "No filter" verwijderd (slaat nergens op)
- "working for brands and agencies across Europe" verwijderd (verzonnen)
- "We came to Curaçao" verwijderd (Berdien is er nog niet)
- "Every project starts with..." → "Everything starts with..." (impliceert geen track record)
**Bestanden:** `what-we-do.html`

---

## Foto gespiegeld zodat Daisy links staat

**Wat:** `transform: scaleX(-1)` toegevoegd aan de foto in de Who We Are sectie. Alt-tekst bijgewerkt naar "Daisy en Berdien".
**Bestanden:** `what-we-do.html`
**Waarom:** Op de originele foto staat Berdien links en Daisy rechts; tekst noemt Daisy eerst.

---

## Memory bijgewerkt

**Wat:** Drie memory-updates:
- `feedback_geen_emdash.md` aangescherpt met context dat dit de meest herhaalde correctie is
- `feedback_geen_onverifieerbare_claims.md` uitgebreid met concrete verboden ("across Europe", "we came to Curaçao")
- `project_opstartfase.md` nieuw aangemaakt: FUNkiness! heeft nog geen klanten, schrijf aanpak/visie niet track record
**Bestanden:** `memory/feedback_geen_emdash.md`, `memory/feedback_geen_onverifieerbare_claims.md`, `memory/project_opstartfase.md`, `memory/MEMORY.md`

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Emdash programmatisch gestript uit API-bestanden | Klaar |
| ABSOLUTE REGELS blok in CLAUDE.md | Klaar |
| Word-spacing quiz tagline | Klaar |
| Quiz lettertype quick wins vergroot | Klaar |
| Quiz content herschreven met concrete how-to prompts | Klaar |
| Alle page-level headlines SEO/GEO geoptimaliseerd | Klaar |
| Social media bureau positionering weggehaald | Klaar |
| Who We Are tekst gecorrigeerd (meerdere rondes) | Klaar |
| Foto gespiegeld (Daisy links) | Klaar |
| Memory bijgewerkt (3 bestanden) | Klaar |
