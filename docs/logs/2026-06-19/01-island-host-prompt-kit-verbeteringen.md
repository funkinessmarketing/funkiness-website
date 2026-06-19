# Island Host AI Prompt Kit: verbeteringen en kwaliteitsslag

**Datum:** 2026-06-19 10:00
**Project:** FUNkiness! / Island Host AI Prompt Kit

---

## JS copy-output-btn handler toegevoegd

**Wat:** Click handler geschreven voor de `.copy-output-btn` knoppen op multi-output prompt cards. Elke knop kopieert alleen de tekst van zijn eigen output-sectie.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - nieuwe DOMContentLoaded event listener toegevoegd
**Waarom:** Knoppen hadden CSS maar nog geen JS-functionaliteit vanuit vorige sessie.

---

## Multi-output cards slaan "Copy prompt" knop over

**Wat:** De bestaande JS die automatisch een "Copy prompt" knop toevoegt aan elke prompt-header slaat nu `data-multi-output="true"` cards over. Die hebben per output-sectie al een eigen Copy knop.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - bestaande DOMContentLoaded handler aangepast
**Waarom:** Op multi-output cards was de globale "Copy prompt" knop overbodig en verwarrend.

---

## Prompt 03 (VRBO) gesplitst in twee aparte output-secties

**Wat:** VRBO Description prompt omgebouwd naar hetzelfde multi-output formaat als Prompt 01: twee aparte, individueel kopieerbare secties. Property details verwijderd uit de prompttekst.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - prompt 03 volledig herschreven
**Waarom:** Zelfde principe als Prompt 01: gebruiker geeft niet drie opdrachten tegelijk aan de AI, maar kopieert elke output apart.

---

## Nederlandse markt outputs schrijven nu in het Nederlands

**Wat:** Alle "Dutch / European market" outputs (Prompt 01 Output 1, Prompt 03 Output 1) instrueert de AI nu om in het Nederlands te schrijven. No-clichés lijst vertaald naar Nederlands (paradijs, parel, adembenemend). Output labels tonen nu expliciet "(in Dutch)" en "(in English)".
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - promptteksten en labels bijgewerkt
**Waarom:** Daisy's instructie: Dutch market = in het Nederlands schrijven, Noord-Amerikaans = in het Engels.

---

## Kritische expert review: 5 verbeterpunten geidentificeerd en doorgevoerd

**Wat:** Volledige kritische review als marketingexpert. Vijf categorieën verbeteringen doorgevoerd:
1. Property details verwijderd uit Prompts 04, 05, 06, 08 (Fact Sheet dekt dit al)
2. Airbnb ToS waarschuwing toegevoegd aan Prompt 19
3. Taal-noot toegevoegd aan Social Media category header
4. Language-veld toegevoegd aan alle email prompts 31-40
5. Language-veld toegevoegd aan alle WhatsApp prompts 41-45
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - meerdere prompts en headers bijgewerkt

---

## Bonus prompt toegevoegd: Instagram/WhatsApp direct booking reply

**Wat:** Nieuwe bonuspagina toegevoegd na Prompt 50, voor de back cover. Prompt met BONUS-badge voor het beantwoorden van een directe Instagram DM of WhatsApp bericht van een potentiele gast. Inclusief taalveld en regels voor het sluiten van de booking.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - nieuwe page div toegevoegd voor back cover
**Waarom:** De moeilijkste en meest gevraagde situatie voor verhuurders: een warme lead via social die direct contact opneemt. Elke directe boeking bespaart 15-20% platformcommissie.

---

## Airbnb multi-taal functie correct gedocumenteerd in Prompt 01

**Wat:** Expert note van Prompt 01 volledig herschreven. Kern: Airbnb heeft een auto-vertaalfunctie maar die is generiek - zet die uit en voer zelf per taal je eigen tekst in. Outputs hernoemd met upload-instructies ("upload as Dutch translation", "upload as English (US) translation", etc.).
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - expert note prompt 01 herschreven, output labels bijgewerkt
**Waarom:** Dit is een functie die de meeste hosts niet kennen en die directe impact heeft op conversie per markt.

---

## Canadese markt output toegevoegd aan Prompt 01

**Wat:** Output 3 toegevoegd specifiek voor de Canadese markt (Airbnb laat dit apart instellen). Winter escape is de centrale trigger: Canada heeft lange koude winters, dit is het meest concrete en emotioneel resonerende argument voor Canadese gasten. Your Space outputs hernummerd naar 4 (Engels) en 5 (Nederlands).
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - vijfde output-sectie toegevoegd aan Prompt 01
**Waarom:** Airbnb maakt targeting per land mogelijk. Canadezen hebben een ander primair boekingsmotief dan Amerikanen (winter escape vs. lifestyle/aspirational). Alleen verifieerbare claims gebruikt - geen verzonnen generalisaties over Canadese psychologie.

---

## VRBO expert note gecorrigeerd

**Wat:** VRBO expert note verduidelijkt dat VRBO geen aparte taalversies ondersteunt. Gebruiker moet kiezen: Dutch output voor Europees publiek, English output voor Noord-Amerikaans publiek.
**Bestanden:** `docs/island-host-ai-prompt-kit.html` - expert note prompt 03 bijgewerkt

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| JS handler copy-output-btn | Klaar |
| Multi-output cards skip globale copy-knop | Klaar |
| Prompt 03 VRBO gesplitst in aparte outputs | Klaar |
| Nederlandse outputs schrijven in het Nederlands | Klaar |
| Property details verwijderd uit Prompts 04, 05, 06, 08 | Klaar |
| Airbnb ToS waarschuwing Prompt 19 | Klaar |
| Taal-noot Social Media header | Klaar |
| Language-veld email prompts 31-40 | Klaar |
| Language-veld WhatsApp prompts 41-45 | Klaar |
| Bonus prompt direct booking Instagram/WhatsApp | Klaar |
| Airbnb multi-taal functie gedocumenteerd | Klaar |
| Canadese markt output Prompt 01 | Klaar |
| VRBO expert note gecorrigeerd | Klaar |
| Video Script Kit upsell ($19) | Volgende sessie |
| Gumroad live zetten | Nog te doen (Daisy) |
| TikTok lancering video | Nog te doen (Daisy) |
