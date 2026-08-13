# Tweetalige website (NL/EN), Engels als default

**Datum:** 2026-08-13
**Status:** Goedgekeurd, klaar voor implementatieplan

## Doel

De FUNkiness!-website is nu volledig Engelstalig. Dit voegt een Nederlandse taalversie toe voor het grootste deel van de site, met Engels als standaardtaal (geen automatische taaldetectie).

## Scope

**Wordt tweetalig (EN + NL):**
- `index.html` (homepage)
- `what-we-do.html`
- `contact.html`
- `faq.html`
- `blog.html`
- `blog-ai-curacao.html`
- `blog-market-position-curacao.html`
- `blog-marketing-strategy-curacao.html`
- `connect.html`

**Blijft alleen Engels (geen wijziging, geen NL-versie):**
- `quiz.html` (AI Superpower Quiz)
- `scan.html` (Social Media Scan / Marketing Strategy Scan)
- `island-host-ai-prompt-kit.html` (Prompt Kit marketingpagina)

## Bestandsstructuur

Statische site zonder build-stap blijft het uitgangspunt. Voor elke tweetalige pagina komt een Nederlandse versie in een nieuwe `nl/` submap, met dezelfde bestandsnaam als het origineel:

```
index.html                              → nl/index.html
what-we-do.html                         → nl/what-we-do.html
contact.html                            → nl/contact.html
faq.html                                → nl/faq.html
blog.html                               → nl/blog.html
blog-ai-curacao.html                    → nl/blog-ai-curacao.html
blog-market-position-curacao.html       → nl/blog-market-position-curacao.html
blog-marketing-strategy-curacao.html    → nl/blog-marketing-strategy-curacao.html
connect.html                            → nl/connect.html
```

Vercel's `cleanUrls: true` zet dit automatisch om naar `funkiness.ai/nl/what-we-do` etc. Geen wijziging aan `vercel.json` nodig. `style.css` blijft gedeeld tussen beide taalversies; er komt geen aparte NL-stylesheet.

## Taalswitcher

Elke tweetalige pagina (EN en NL) krijgt een vlaggetjes-toggle:
- 🇬🇧 / 🇳🇱, geplaatst in de navbar naast het bestaande menu (desktop) en in het mobiele menu, in dezelfde pil/badge-stijl als andere UI-elementen.
- De actieve taal wordt visueel gemarkeerd (bijv. actieve vlag benadrukt, inactieve gedimd).
- Klikken op de andere vlag linkt naar de vertaalde versie van **dezelfde pagina** (bijv. vanaf `/nl/what-we-do` naar `/what-we-do`, niet naar de homepage of `/nl/`).

Navigatielinks naar Scan en Quiz op de NL-pagina's krijgen een klein `(EN)`-label (bijv. "Scan (EN)", "Quiz (EN)") om aan te geven dat die pagina's Engelstalig blijven. Op de Engelse pagina's blijven deze links ongewijzigd, zonder label.

Er is geen automatische taaldetectie op basis van browser- of locatie-instellingen. Iedere bezoeker ziet standaard de Engelse site; wisselen naar Nederlands is altijd een bewuste klik op de vlag.

## SEO

- Elke EN-pagina krijgt in de `<head>`:
  - `<link rel="alternate" hreflang="nl" href="https://www.funkiness.ai/nl/...">`
  - `<link rel="alternate" hreflang="x-default" href="https://www.funkiness.ai/...">` (wijst naar de Engelse versie, want Engels is default)
- Elke NL-pagina krijgt in de `<head>`:
  - `<link rel="alternate" hreflang="en" href="https://www.funkiness.ai/...">`
  - `<link rel="alternate" hreflang="x-default" href="https://www.funkiness.ai/...">`
- Canonical tags blijven per taalversie naar zichzelf wijzen (geen concurrentie tussen EN/NL in zoekresultaten).
- `sitemap.xml` wordt uitgebreid met de 8 nieuwe `/nl/` URLs (dezelfde `changefreq`/`priority` als hun EN-tegenhanger).
- Locatie-keywords (Curaçao, Aruba, Bonaire) en dienst-keywords blijven ook in de Nederlandse teksten staan, conform de bestaande mobile-first + SEO + GEO regel uit `CLAUDE.md`.

## Vertaling & merkstem

De Nederlandse content wordt niet letterlijk vertaald, maar herschreven met dezelfde merkstem als de Engelse copy:
- Bold, energiek, direct, met humor.
- Geen emdash (—), geen " - " (spatie-koppelteken-spatie) als separator.
- Geen "premium"/"luxe" of vergelijkbare verboden woorden.
- Geen onverifieerbare claims over tijdpaden, statistieken of concurrenten.
- Navigatielabels worden ook vertaald (bijv. "What We Do" → "Wat We Doen"). Engelse marketingtermen die breed begrepen worden mogen blijven staan waar dat natuurlijker leest.
- Alle overige merk- en contentregels uit `CLAUDE.md` (Berdien-woont-nog-niet-op-Curaçao, geen probleemframe, content-boldness-litmustest, etc.) gelden onverkort voor de Nederlandse teksten.

## Documentatie-update

Na implementatie wordt `CLAUDE.md` bijgewerkt:
- De regel "Engels op de website, Nederlands en Engels op social media" onder **Schrijfstijl** wordt vervangen door een beschrijving van de tweetalige opzet: Engels is default, Nederlands via de `nl/`-submap, en welke pagina's wel/niet vertaald zijn (zie Scope hierboven).
- Een korte technische notitie over de `nl/`-bestandsstructuur en de taalswitcher wordt toegevoegd, zodat toekomstige content (nieuwe pagina's, blogposts) consistent in beide talen wordt gemaakt.

## Niet in scope

- Geen NL-versies van `quiz.html`, `scan.html`, `island-host-ai-prompt-kit.html`.
- Geen wijziging aan de backend/API-logica (scan-emails, quiz-archetype-generatie blijven Engelstalig zoals nu).
- Geen automatische taaldetectie of geo-redirect.
- Geen apart NL-stylesheet; visuele stijl blijft identiek tussen talen.
