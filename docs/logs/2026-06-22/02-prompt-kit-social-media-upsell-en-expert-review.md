# Island Host AI Prompt Kit: Social Media upsell en expert review

**Datum:** 2026-06-22 14:00
**Project:** FUNkiness! / Island Host AI Prompt Kit

---

## Social Media sectie verwijderd: wordt aparte upsell

**Wat:** De volledige Social Media sectie (SETUP prompt + prompts 11-20) uit de kit verwijderd. De kit focust nu puur op platforms en meer boekingen. Social Media wordt een losse upsell.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - social media pagina's en prompts verwijderd via Python script
**Waarom:** Daisy's beslissing: "social media prompts doen we als upsell in een apart document. deze kit is alleen gericht op de platformen."

Hernummering na verwijdering:
- More Bookings: 21-30 werd 11-20
- Host Profile: 31-35 werd 21-25
- Cover bijgewerkt: 35 werd 25 prompts

---

## Cascade bug gefixed in badge nummering

**Wat:** Python script had de Host Profile badges door een cascade-probleem van 31-35 naar 11-15 gezet in plaats van 21-25. De cat-list en page-bar waren wel correct (21-25). Vijf gerichte Edit-calls hebben de badge-nummers gecorrigeerd per prompt-titel.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - badges 11-15 in Host Profile sectie gecorrigeerd naar 21-25
**Waarom:** Python script verving badges in volgorde zonder placeholders, waardoor 31 eerst naar 21 ging en daarna 21 naar 11.

---

## TOC Social Media rij verwijderd

**Wat:** De toc-grid had na het Python script nog een "Social Media" rij staan. Die was niet meegenomen in de bulk-replace omdat de string niet exact overeenkwam. Handmatig verwijderd via Edit.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - toc-grid bijgewerkt naar 3 items

---

## Je/u aanspreekvorm toegevoegd aan Nederlandse outputs

**Wat:** Veld "Aanspreekvorm: [je/jij OF u]" toegevoegd aan alle Nederlandse tekst-outputs: Airbnb Output 1 (Dutch), Airbnb Output 5 (Je accommodatie), VRBO Output 1 (Dutch), Micazu Prompt 04.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - 4 outputs bijgewerkt
**Waarom:** "write in English" is vaag maar English is prima omdat de markt-context het oplost. Je/u is echter een echte inhoudelijke keuze die de AI niet zelf kan maken voor de gebruiker.

---

## Kritische expert review: 4 verbeteringen doorgevoerd

**Wat:** Volledige review van alle 25 prompts als platformexpert. Vier issues geidentificeerd en doorgevoerd:

1. **Fout in expert note Prompt 01**: "Outputs 3 and 4 give you both languages for that field too" was fout. Output 3 is de Canadese beschrijving, niet een Your Space veld. Gecorrigeerd naar "Outputs 4 and 5".

2. **Fotobijschriften toegevoegd aan Prompt 13**: Airbnb ondersteunt captions per foto, zichtbaar in het gallerij-scherm. Bijna geen host gebruikt dit. Expert note uitgebreid met uitleg. Prompt uitgebreid met stap 5: bijschriften voor 6 belangrijkste foto's (max 20 woorden per foto).

3. **Spaans toegevoegd aan Prompts 14 en 17**: Venezolaanse en Colombiaanse gasten op Aruba schrijven vaak in het Spaans. Language-veld bijgewerkt. Daarna teruggedraaid op verzoek van Daisy: zij kan de Spaanse output niet controleren.

4. **Prompt 25 vervangen**: Buurtbeschrijving (voor gasten die al geboekt hebben, overlap met Prompt 10 en 24) vervangen door Review Response. Reviewresponses zijn publiek zichtbaar voor toekomstige gasten, een Airbnb algoritme-signaal en directe conversiefactor. Prompt dekt positieve reviews, licht kritische reviews en onterechte reviews. Inclusief instructie: "Never start with 'Thank you for your review.'"
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - expert note Prompt 01, Prompt 13, Prompt 25 volledig herschreven

---

## Spaans teruggedraaid na Daisy's correctie

**Wat:** Spanish verwijderd uit de language-velden van Prompts 14 en 17. Terug naar Dutch of English.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - 3 language-velden teruggedraaid
**Waarom:** Daisy kan de kwaliteit van Spaanse AI-output niet controleren. Geen unverifiable claims of outputs die buiten haar expertise vallen.

---

## CLAUDE.md bijgewerkt

**Wat:** Productbeschrijving Island Host AI Prompt Kit bijgewerkt: 35 prompts werd 25, Social Media upsell vermeld, categorie-indeling en nummering gecorrigeerd.
**Bestanden:** `CLAUDE.md`

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Social Media verwijderd, wordt upsell | Klaar |
| Hernummering More Bookings 11-20, Host Profile 21-25 | Klaar |
| Cover bijgewerkt naar 25 prompts | Klaar |
| Cascade bug badge-nummering gefixed | Klaar |
| TOC Social Media rij verwijderd | Klaar |
| Je/u aanspreekvorm alle Nederlandse outputs | Klaar |
| Fout expert note Prompt 01 gecorrigeerd | Klaar |
| Fotobijschriften toegevoegd aan Prompt 13 | Klaar |
| Prompt 25: Buurtbeschrijving vervangen door Review Response | Klaar |
| Spaans teruggedraaid op verzoek Daisy | Klaar |
| CLAUDE.md bijgewerkt | Klaar |
| Social Media Prompt Kit bouwen (upsell) | Volgende sessie |
| Video Script Kit bouwen (upsell) | Volgende sessie |
| Gumroad live zetten | Nog te doen (Daisy) |
| TikTok lancering video | Nog te doen (Daisy) |
