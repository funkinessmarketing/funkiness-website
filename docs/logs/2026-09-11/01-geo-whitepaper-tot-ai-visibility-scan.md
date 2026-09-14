# GEO-whitepaper geanalyseerd, nieuwe blogpost/FAQ live, en AI Visibility Scan halverwege gebouwd

**Datum:** 2026-09-11 00:00
**Project:** FUNkiness! (Het Mainframe)

---

## Youvia GEO-whitepaper geanalyseerd en vastgelegd

**Wat:** Daisy uploadde een Nederlandse whitepaper over Google AI-Overviews van concurrent Youvia. Kern, actualiteitscheck (AI Overviews ging live in NL op 9 mei 2025, niet juni zoals de whitepaper zegt; de geciteerde Ahrefs-klikdaling van 34,5% is verouderd, een nieuwere Ahrefs-studie meet inmiddels 58%) en toepassing op FUNkiness! besproken.
**Bestanden:** `reference_youvia_geo_whitepaper.md` (nieuw geheugenbestand).
**Waarom:** Basis voor een concreet stappenplan om FUNkiness!'s eigen vindbaarheid in AI-zoekmachines te verbeteren, en voor content richting klanten.

---

## sameAs-links en nieuwe FAQ-vragen toegevoegd aan de site

**Wat:** `index.html`/`nl/index.html`: lege `sameAs`-array in de Organization-schema gevuld met Instagram/TikTok-links. `faq.html`/`nl/faq.html`: nieuwe categorie "Marketing on Curaçao" met 4 top-of-funnel zoekvragen (hoe kies je een marketingbureau, wat is GEO, hoe krijg je meer boekingen, waarom is marketing hier anders), toegevoegd aan zowel de zichtbare pagina als de FAQPage-schema.
**Bestanden:** `index.html`, `nl/index.html`, `faq.html`, `nl/faq.html`.
**Waarom:** De bestaande FAQ beantwoordde alleen "over ons"-vragen, niet de vragen die een Curaçao-ondernemer daadwerkelijk aan Google/ChatGPT stelt, dat was het concrete GEO-gat uit de whitepaper-analyse.

---

## Nieuwe blogpost, reel en social push over AI-zoeken

**Wat:** Nieuwe blogpost "What ChatGPT, Perplexity and Google actually know about your business" (EN + NL), gepubliceerd en toegevoegd aan `blog.html`/`nl/blog.html` en `sitemap.xml`. Bijbehorende reel gebouwd (Python-renderer, ease-out-back bounce-animatie, headless Chrome + ffmpeg), na feedback dat de eerste versie te statisch/saai was: tweede versie met stempel-effect, tilt en flash-cuts. Social push-tekst (captions Instagram/TikTok/Facebook, geoptimaliseerd voor vindbaarheid) vastgelegd.
**Bestanden:** `blog-ai-search-curacao.html`, `nl/blog-ai-search-curacao.html`, `blog.html`, `nl/blog.html`, `sitemap.xml`, `docs/blog-content-kalender.md`, `docs/social-push-blog-ai-search.md`, `docs/Graphic-Design/social-media-posts/blog-ai-search-curacao-reel.mp4`.
**Waarom:** Post #3 uit de contentkalender vervroegd omdat hij direct aansloot bij de GEO-analyse van vandaag. Litmustest voor bold content ("kan een ander bureau dit ook zeggen") vastgelegd als geldend voor beeld/beweging, niet alleen tekst, na Daisy's correctie.

---

## Social media taalstrategie vastgelegd

**Wat:** Besproken en afgesproken: geen bilinguale captions per post, maar alterneren per post op basis van doelgroep. Nederlands voor lokale Curaçao-content, Engels voor bredere/TikTok-groei content, zelfde logica als de EN-default/NL-submap-opzet van de website.
**Bestanden:** geen wijziging, alleen strategie-inzicht (nog niet vastgelegd in geheugen, aandachtspunt voor volgende sessie).
**Waarom:** Voorkomt dat elke post dubbel gemaakt moet worden, wat niet haalbaar is bij Daisy's huidige solo-capaciteit.

---

## Strategie eerste klant: focus verschoven naar directe outreach via de Scan

**Wat:** Op vraag "hoe kom ik aan mijn eerste klant": Prompt Kit-lancering tijdelijk on hold gezet, focus naar spoor A (lokale klant) via de bestaande gratis Scan + directe persoonlijke outreach naar een shortlist van 5-10 concrete Curaçao-bedrijven, met de GEO-invalshoek als aandachttrekker. Concrete WhatsApp- en e-mailtemplates uitgeschreven.
**Bestanden:** `kennis/strategieplan.md` (nieuwe sectie "Directe outreach voor de eerste klant", update in "Volgorde van werk").
**Waarom:** GEO/SEO-content bouwt vindbaarheid op de lange termijn op, maar levert geen snelle eerste klant. Actieve, persoonlijke outreach is de realistische korte-termijnroute, de bestaande Scan had toch al een verkeersprobleem, geen bouwprobleem.

---

## AI Visibility Scan: nieuwe leadgenerator, ontworpen en grotendeels gebouwd

**Wat:** Op verzoek om "de scan" te bouwen als freebie voor distributie: via de brainstorming-skill een derde scan-variant ontworpen naast de bestaande Social Media Scan en Marketing Strategy Scan. Kern: een website-audit (structured data/Q&A-content, niet zelf na te maken door een AI-vaardige ondernemer) + 5 live AI-zoekvragen via OpenRouter + een concurrentievergelijking (welke bedrijven noemt de AI wél) + een kant-en-klare, plakbare JSON-LD schema-snippet. Make.com-koppeling bewust uitgesteld op Daisy's verzoek.

Spec geschreven, aangescherpt na kritische zelfreview, implementatieplan met 7 taken uitgewerkt (elke stap met volledige code, geen placeholders). Uitgevoerd via subagent-driven-development in een geïsoleerde git worktree (`worktree-ai-visibility-scan`):
- Taak 1 t/m 6 zijn klaar, elk door een aparte implementer-subagent gebouwd en door een aparte reviewer-subagent goedgekeurd (1 fix-ronde nodig bij taak 1, een script-injectierisico in de schema-snippet, opgelost).
- Taak 6 (lokale end-to-end test tegen de echte APIs) is uitgevoerd: een test-rapport voor een fictief hotel kwam terug met écht bestaande concurrenten op Curaçao (Renaissance Wind Creek, Marriott, Baoase), een geldige schema-snippet, en 2 echte testmails verstuurd naar sayhello@funkiness.ai.
- Taak 7 (live deployen) staat te wachten op Daisy's eigen beoordeling van die twee testmails, dat is de expliciete afspraak uit het plan.

**Bestanden (op branch `worktree-ai-visibility-scan`, nog niet gemerged naar main):** `lib/geo-scan-helpers.js` + test, `api/geo-scan.js`, `vercel.json`, `scan.html`, `scan-script.js`, `scripts/test-geo-scan-local.js`. Spec en plan staan wel al op main: `docs/superpowers/specs/2026-09-09-ai-visibility-scan-design.md`, `docs/superpowers/plans/2026-09-09-ai-visibility-scan.md`.
**Waarom:** Directe follow-up op de GEO-strategie van vandaag, en een concreet, onnamaakbaar freebie voor bredere distributie (Make.com), zoals expliciet gevraagd.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| GEO-whitepaper geanalyseerd en vastgelegd | Klaar |
| sameAs-links en 4 nieuwe FAQ-vragen live | Klaar, gepusht naar main |
| Nieuwe blogpost + reel + social push over AI-zoeken | Klaar, gepusht naar main |
| Social media taalstrategie (NL/EN alterneren) | Besproken, nog niet in geheugen vastgelegd |
| Outreach-strategie eerste klant | Klaar, vastgelegd in strategieplan.md |
| AI Visibility Scan: brainstorm, spec, plan | Klaar, gepusht naar main |
| AI Visibility Scan: implementatie (taak 1-6) | Klaar, gereviewd, op aparte worktree-branch |
| AI Visibility Scan: taak 7 (deploy) | Open, wacht op Daisy's beoordeling van de testmails |
