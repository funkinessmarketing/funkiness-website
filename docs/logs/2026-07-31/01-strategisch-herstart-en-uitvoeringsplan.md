# Strategisch herstart FUNkiness!: basisplan, Spark Plan, site-fixes en agenda

**Datum:** 2026-07-31
**Project:** Het Mainframe (FUNkiness!)

---

## Aanleiding

Daisy wilde een strategische herstart omdat ze door haar ADHD van de hak op de tak sprong en hap-snap ontwikkelde zonder dat het uit een groter plan voortkwam. Doel van de sessie: eerst een heldere strategie neerzetten voordat losse taken worden opgepakt, met focus op online diensten (tools/abonnementen) naast lokaal werk, breder dan de ABC eilanden.

---

## Nieuw basisdocument: kennis/strategieplan.md

**Wat:** Een volledig, levend strategieplan geschreven met wie, wat, waar, hoe en wanneer, dat bij elke sessie meegelezen wordt (toegevoegd aan CLAUDE.md kennisbestanden-lijst).
**Bestanden:** `kennis/strategieplan.md` (nieuw), `CLAUDE.md` (kennis-lijst uitgebreid).
**Belangrijkste besluiten die erin staan:**
- Twee sporen (lokale fullservice dienstverlening + schaalbare online diensten) groeien gelijk mee, geen niche-lock, eilandidentiteit blijft ook bij wereldwijd bereik.
- Volgorde van werk: leadgenerators op orde > The Spark Plan (abonnement) > Prompt Kit eerst live, dan pas een productlijn > eigen content (later verduidelijkt, zie onder).
- **The Spark Plan** uitgewerkt: scope (12-16 posts/maand, 2 platforms, maandelijks strategiegesprek), prijsanker vanaf $750/maand (expliciet niet marktgeverifieerd), pilotdoelgroep vakantiewoningbeheerders (niet individuele hosts), capaciteit 1-2 klanten zolang Daisy alleen werkt (tot november 2026, Berdien's aankomst).
- Marketingexecutieplan: welke content/materialen wanneer nodig zijn (one-pager, outreach-templates, Gumroad-copy), tools per fase (Gumroad, Google Sheets, Cal.com, WhatsApp Business, ManyChat).
- Een "Geparkeerde ideeën"-sectie toegevoegd voor een geopperd idee (online community met eigen app, "Business Innovation Hub") dat qua omvang niet in de huidige capaciteit past, met reden en criterium voor later.
**Waarom:** Daisy vroeg expliciet om een basisplan waar alle toekomstige beslissingen aan getoetst worden, en om niet elk nieuw idee direct uit te voeren maar eerst te toetsen aan de volgorde.

---

## Correctie: aannames klopten niet, alles begint kouder dan gedacht

**Wat:** Tijdens het plannen bleek dat meerdere aannames in het plan (en in bestaande CLAUDE.md-tekst) niet klopten:
- De Gumroad-winkel voor de Island Host AI Prompt Kit staat nog niet live, er zijn dus nog geen kopers.
- FUNkiness! is op Curaçao zelf nog totaal niet bekend, geen netwerk om op te leunen.
- De AI Superpower Quiz stond technisch klaar maar was nergens op de website gelinkt (gecontroleerd in de code: geen enkele href naar quiz.html).
- De AI & Marketing Scan staat wel overal correct gelinkt, maar is tot nu toe 0 keer voltooid, een verkeersprobleem, geen bouw- of vindbaarheidsprobleem.
**Bestanden:** `kennis/strategieplan.md` (nieuwe sectie "Uitgangspositie: start bij nul", productstatus-tabel gecorrigeerd), `CLAUDE.md` (Prompt Kit-sectie gecorrigeerd, verwees ten onrechte naar een lopende Gumroad-verkoop).
**Waarom:** Voorkomen dat toekomstige sessies uitgaan van een bestaand netwerk, bestaande kopers of een werkende leadgen-motor die er niet is.

---

## Site-fix: AI Superpower Quiz overal gelinkt

**Wat:** Quiz-link toegevoegd aan navigatie, mobiel menu en footer op alle pagina's van de site, dit was de enige reden dat de quiz "niet live" aanvoelde: de pagina en backend werkten al, maar er stond nergens een link.
**Bestanden:** `index.html`, `blog.html`, `blog-ai-curacao.html`, `blog-marketing-strategy-curacao.html`, `blog-market-position-curacao.html`, `contact.html`, `faq.html`, `scan.html`, `what-we-do.html` (quiz.html had de link al).
**Waarom:** Snelle, kosteloze fix (geen contentwerk) die meteen een van de twee leadgenerators daadwerkelijk vindbaar maakt.

---

## Kritische zelfreview op verzoek van Daisy

**Wat:** Op expliciet verzoek ("kijk kritisch naar alles") een aantal zwakke plekken benoemd: geen portfolio om Spark Plan te verkopen, $750/maand koud vragen zonder trackrecord is een zware ask, tijd niet verspillen aan 1:1 verkoop van de $27 Prompt Kit, een nog niet ingeloste belofte (shortlist onderzoek), en een niet-geverifieerde aanname over budget bij de pilotdoelgroep.
**Bestanden:** `kennis/strategieplan.md` (todolist opnieuw ingericht op basis van deze punten).
**Waarom:** Past bij de rol die Daisy Claude heeft gegeven: kritische marketingexpert die niet meepraat maar toetst.

---

## Contentstrategie verduidelijkt: eigen kanaal versus content voor klanten

**Wat:** Daisy verduidelijkte dat "content als laatste" alleen sloeg op content die voor klanten gemaakt wordt (de Spark Plan dienstverlening), niet op het eigen FUNkiness-kanaal. Eigen kanaal vullen (TikTok/Instagram) met FUN, bold, grappige en aan het denken zettende content is vanaf nu een vaste parallelle prioriteit, niet iets voor later. Dit lost bovendien het verkeersprobleem van de scan op en levert meteen portfolio-bewijs richting prospects.
**Bestanden:** `kennis/strategieplan.md` (Volgorde van werk punt 4 herschreven, Dagindeling omgebouwd naar 3 vaste lanes: maandag sales & infra, woensdag/donderdag content & advertising, vrijdag outreach), `docs/strategieplan-printbaar.html` (in sync gebracht).
**Waarom:** Voorkomt een schijnbare tegenspraak met eerdere afspraken en maakt de merkstem (Magician x Outlaw, energie en humor verplicht) die al vastlag opnieuw expliciet van toepassing.

---

## Printbare versie en Apple Agenda-export

**Wat:** Een printbare HTML-versie van het volledige strategieplan gemaakt en telkens in sync gehouden met wijzigingen. Daarnaast .ics-kalenderbestanden gegenereerd voor de eerste 2 weken (3 t/m 14 augustus, ma/wo/vr 9.00-13.00 uur) en geopend zodat Apple Agenda een importvenster toont.
**Bestanden:** `docs/strategieplan-printbaar.html` (nieuw), `docs/agenda-augustus-2026.ics` (nieuw, later opnieuw gegenereerd na de driedeling-wijziging), `docs/agenda-correctie-13-augustus.ics` (nieuw, voor het verzetten van woensdag 12 naar donderdag 13 augustus omdat Daisy die dag niet kan werken).
**Openstaand:** Daisy moet de 6 oude agenda-items (met de originele titels, van vóór de driedeling-wijziging) nog zelf verwijderen in Apple Agenda. Een poging om dit via AppleScript/osascript automatisch te doen liep vast (2x timeout, ook met een afgebakende datumrange), waarschijnlijk door een trage gedeelde/geabonneerde agenda tussen haar 13 agenda's. Niet verder geforceerd met langere timeouts.

---

## Memory bijgewerkt

Nieuwe of bijgewerkte memory-bestanden: `project_strategie_schaal_2026` (nieuw, verwijst nu naar het canonieke `kennis/strategieplan.md`), `feedback_strategie_voor_uitvoering` (nieuw: nooit hap-snap, stap voor stap), `feedback_kritische_rol` (bijgewerkt: altijd toetsen aan het strategieplan, niet meepraten), `project_opstartfase` (bijgewerkt: Gumroad nog niet live, geen naamsbekendheid), `user_adhd` (bijgewerkt: concreet voorbeeld van hoe een nieuw groot idee tijdens een lopende stap werd geparkeerd).

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Kritische vragen gesteld en strategische koers bepaald | Klaar |
| kennis/strategieplan.md geschreven (wie/wat/waar/hoe/wanneer) | Klaar |
| The Spark Plan uitgewerkt (scope, prijsanker, pilotdoelgroep) | Klaar, prijs nog definitief te bevestigen door Daisy |
| Marketingexecutieplan en toolsstack toegevoegd | Klaar |
| Aannames gecorrigeerd (Gumroad, quiz, scan, naamsbekendheid) | Klaar |
| Quiz-link toegevoegd op alle pagina's | Klaar |
| Kritische zelfreview uitgevoerd, todolist herzien | Klaar |
| Business Innovation Hub (community + app) geparkeerd | Klaar |
| Contentstrategie verduidelijkt (eigen kanaal vs klantcontent) | Klaar |
| Printbare versie + Apple Agenda .ics gemaakt | Klaar |
| Oude agenda-items automatisch verwijderen via AppleScript | Mislukt (timeout), Daisy moet dit zelf doen |
| Shortlist vakantiewoningbeheerders opzoeken | Openstaand |
| One-pager en outreach-templates schrijven | Openstaand |
| Gumroad-winkel live zetten | Openstaand |
| Eerste eigen contentstuk maken/posten | Openstaand |
