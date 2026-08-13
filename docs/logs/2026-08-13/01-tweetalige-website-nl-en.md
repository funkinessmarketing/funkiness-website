# Tweetalige website (NL/EN) gebouwd, gereviewd en op merkstem gepolijst

**Datum:** 2026-08-13 14:00
**Project:** FUNkiness! (Het Mainframe)

---

## Website tweetalig gemaakt: Engels default, Nederlands onder /nl/

**Wat:** Op verzoek de hele marketingsite tweetalig gemaakt. Via de superpowers-workflow (brainstorming → spec → implementatieplan → subagent-driven-development) zijn 9 pagina's vertaald: homepage, what-we-do, contact, faq, blog-overzicht + 3 blogposts, en de NFC-landingspagina connect.html. Elke pagina kreeg een vlaggetjes-taalswitcher (🇬🇧/🇳🇱) in de navbar, hreflang-tags voor SEO, en een volledige Nederlandse vertaling. `quiz.html`, `scan.html` en de Prompt Kit-pagina blijven bewust Engels-only.
**Bestanden:** `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md` (spec), `docs/superpowers/plans/2026-08-13-tweetalige-website.md` (implementatieplan, 12 taken), `nl/index.html`, `nl/what-we-do.html`, `nl/contact.html`, `nl/faq.html`, `nl/blog.html`, `nl/blog-ai-curacao.html`, `nl/blog-market-position-curacao.html`, `nl/blog-marketing-strategy-curacao.html`, `nl/connect.html` (alle nieuw), plus hun 9 Engelse tegenhangers (hreflang/switcher toegevoegd), `style.css` (taalswitcher-CSS), `sitemap.xml`, `docs/vertaalgids-website.md` (nieuw), `CLAUDE.md` (bijgewerkt).
**Waarom:** Daisy wilde de site toegankelijk maken voor Nederlandstalige bezoekers, met Engels als standaardtaal voor SEO/internationaal bereik.

---

## Uitvoering via geïsoleerde worktree, 12 taken + eindreview

**Wat:** Elke taak liep via een verse subagent-implementatie + aparte reviewer-subagent, met fix-rondes waar nodig. Tijdens de uitvoering kwamen twee incidenten voor die zijn opgelost:
1. Bij Taak 11 bleek `/faq` nog nooit in `sitemap.xml` te hebben gestaan (bestaande omissie, los van dit werk). Rechtgezet door zowel `/faq` als `/nl/faq` toe te voegen.
2. Bij de eerste poging van Taak 12 committede de subagent per ongeluk naar de hoofdrepo (main) in plaats van de geïsoleerde worktree-branch. Gecorrigeerd met een `git revert` op main (nog niet gepusht, dus veilig) en opnieuw uitgevoerd met een expliciete locatiecontrole vooraf.
**Bestanden:** n.v.t. (proces), zie `docs/superpowers/plans/2026-08-13-tweetalige-website.md` voor de volledige taakstructuur.
**Waarom:** Kwaliteitsborging via onafhankelijke review per taak, en snel herstel toen er iets misging in de uitvoeringsomgeving.

---

## Branch gemerged naar main, twee pre-existing merkregel-overtredingen gevonden en gefixt

**Wat:** Na groen licht van Daisy is de feature-branch lokaal gemerged naar main. Tijdens de reviews kwamen twee bestaande (niet door dit werk veroorzaakte) overtredingen van de merkregels naar boven: "AI Agency"/"AI bureau" in plaats van "fullservice marketingbureau" (what-we-do.html, faq.html, nl-versies), en een " - " separator in de alt-tekst van de jeep-foto op de homepage. Beide gefixt in EN en NL.
**Bestanden:** `what-we-do.html`, `faq.html`, `nl/faq.html`, `index.html`.
**Waarom:** Merkregels zijn absoluut ("nooit AI agency", "geen ' - ' separator"), en deze zaten al langer fout op de live site.

---

## Dubbele service-kaart opgelost (Content & Campaigns vs. Campaigns & Branding)

**Wat:** Op `what-we-do.html` overlapten twee servicekaarten inhoudelijk en in naam. Kaart 3 hernoemd van "Content & Campaigns" naar "Social & Content" (sluit aan bij de homepage en de JSON-LD "Social Media Management"), tekst herschreven zonder campagnetaal. Kaart 4 ("Campaigns & Branding") blijft de enige plek die over campagnes gaat.
**Bestanden:** `what-we-do.html`, `nl/what-we-do.html`.
**Waarom:** Daisy signaleerde de overlap tijdens het zelf doorlopen van de site.

---

## Nederlandse vertaling losser gemaakt: minder letterlijk uit het Engels

**Wat:** Daisy gaf aan dat de NL-vertaling vaak te letterlijk zin-voor-zin uit het Engels vertaald was in plaats van natuurlijk Nederlands. Met haar concrete voorbeelden als ijkpunt is de hele site opnieuw doorlopen (homepage, what-we-do, contact, faq, de blogposts) en zijn stijve/calque-achtige zinnen herschreven naar spreektaal. Losse vervolgcorrecties in dezelfde sessie: een werkwoordstijd-fout ("bouwden" → "bouwen"), een verboden woord ("momentum", nu overal uit de site en het social-mediaplan verwijderd en toegevoegd aan de verboden-woordenlijst in CLAUDE.md), een verkeerde CTA-actie ("Vraag je gratis scan aan" → "Doe de gratis scan", want je vraagt de scan niet aan, je doet hem), een dubbel toerismevoorbeeld in de pakketten-kaart (hotelconcern + vakantieverhuurder → resort + makelaarskantoor), en de scope van de scan-sectie verbreed naar Aruba, Bonaire & Curaçao in plaats van alleen Curaçao.
**Bestanden:** `nl/index.html`, `nl/what-we-do.html`, `nl/contact.html`, `nl/faq.html`, `nl/blog-market-position-curacao.html`, `what-we-do.html`, `index.html`, `quiz.html`, `docs/social-media-plan-augustus-2026.md`, `docs/vertaalgids-website.md`, `CLAUDE.md`.
**Waarom:** Directe, herhaalde feedback van Daisy tijdens het zelf doorlopen van de tweetalige site op de lokale preview-server.

---

## Nieuwe geheugennotitie

**Wat:** Vastgelegd dat bij toekomstig vertaalwerk idee-voor-idee herschreven moet worden in plaats van zin-voor-zin vertaald, met concrete voorbeelden van Daisy als ijkpunt.
**Bestanden:** `feedback_nederlandse_vertaling_niet_letterlijk.md` (nieuw), `MEMORY.md` bijgewerkt.
**Waarom:** Terugkerend patroon dat bij toekomstige vertaal- of contenttaken opnieuw kan optreden.

---

## Openstaand: titelgroottes op mobiel

**Wat:** Daisy vroeg aan het einde van de sessie om titels/koppen nergens "mega groot" te laten zijn en dit mobile-first te checken voor zowel EN als NL. Onderzoek naar de clamp()-waarden in `style.css` (gedeeld tussen beide talen) was net gestart toen de sessie werd afgesloten met `/finish`. **Nog geen wijzigingen doorgevoerd.**
**Bestanden:** n.v.t. (nog geen wijziging).
**Waarom nog open:** Sessie afgesloten voordat de analyse kon worden omgezet in een concrete CSS-aanpassing. Oppakken in de volgende sessie: de clamp()-vloerwaarden voor h1/h2 in `style.css` zijn kandidaat (bv. h1 `clamp(44px, 6vw, 100px)`, `.scan-copy h2 clamp(44px, 6vw, 96px)`), plus de inline clamp() in `what-we-do.html`/`nl/what-we-do.html` regel 117.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Tweetalige website (9 pagina's, EN+NL) | Klaar |
| Merge naar main | Klaar (nog niet gepusht bij start van deze log) |
| Pre-existing merkregel-fixes (AI agency, separator) | Klaar |
| Service-kaart overlap what-we-do.html | Klaar |
| NL-vertaling natuurlijker gemaakt (meerdere rondes) | Klaar |
| Titelgroottes mobiel (EN+NL) | **Open, opnieuw oppakken** |
