# Wave-fixes blog posts en Instagram bio

**Datum:** 2026-06-10 16:00
**Project:** FUNkiness! website (funkiness.ai) + Instagram

---

## Blog hero dubbele golf definitief opgelost

**Wat:** CSS `::after` pseudo-element volledig verwijderd van `.blog-hero`. Vervangen door standaard HTML wave-divider direct na `</header>` — consistent met aanpak op alle andere pagina's.
**Bestanden:** `style.css` - `.blog-hero::after` verwijderd; `blog-marketing-strategy-curacao.html`, `blog-ai-curacao.html`, `blog-market-position-curacao.html` - HTML wave-divider hersteld na header
**Waarom:** CSS `::after` met background-image URL rendert inconsistent cross-browser en veroorzaakte een dubbele golf (twee waves zichtbaar). HTML wave-divider is betrouwbaarder en consistent met de rest van de site.

---

## Dunne zwarte lijn wave-dividers — site-breed opgelost

**Wat:** `margin-bottom: -2px` toegevoegd aan `.wave-divider` CSS class (globaal). Ook inline op wave-dividers in index.html en what-we-do.html.
**Bestanden:** `style.css` - `.wave-divider` margin aangepast; `index.html`, `what-we-do.html`, alle 3 blog posts
**Waarom:** Sub-pixel rendering artifact: de zwarte achtergrond van wave-divider elements schemerde 1px door onderaan, zichtbaar als dunne zwarte lijn. De -2px margin-bottom zorgt voor 2px overlap met de volgende sectie, waardoor de gap verdwijnt.

---

## Instagram bio geschreven

**Wat:** Volledige Instagram bio geadviseerd voor FUNkiness!
**Inhoud:**
- Name field: `AI & Marketing Agency Curaçao` (keyword-veld voor discoverability, niet de merknaam)
- Bio: `⚡ Your brand. Impossible to ignore. / AI · Strategy · Social · Content / Boring was never the plan. / ↓ Free AI & Marketing Scan`
- Link: www.funkiness.ai in het Website-veld (niet in de bio-tekst)
- AI creator label: aanzetten (past bij positionering als AI-bureau)
- Pronouns: she/her (optioneel, humaniseert het account)
**Waarom:** Huidige bio had typo ("plans"), begon met "We" (bureau-gericht i.p.v. klantgericht), en miste keyword-optimalisatie in het name field.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Blog hero dubbele golf opgelost (CSS ::after verwijderd) | Klaar |
| Dunne zwarte lijn fix — globaal in CSS | Klaar |
| Wave-audit site-breed uitgevoerd | Klaar |
| Instagram bio + name field geadviseerd | Klaar |
| AI creator label advies | Klaar |
