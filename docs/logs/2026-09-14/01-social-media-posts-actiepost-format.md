# Social media postpijplijn opgezet, actiepost-format ontwikkeld, kritieke fotobewerkingsfout gevonden en gecorrigeerd

**Datum:** 2026-09-14 13:00
**Project:** FUNkiness! (Het Mainframe)

---

## Nieuwe productiepijplijn voor social media posts (tekst-overlay + AI-fotobewerking)

**Wat:** Twee gescheiden technieken opgezet voor social media posts met foto's van Daisy: (1) tekst-overlay via HTML/CSS + headless Chrome-rendering (zelfde recept als eerdere postbeelden), gebruikt wanneer alleen tekst wordt toegevoegd, dit verandert de brongfoto geen pixel; (2) AI-fotobewerking via OpenRouter (`google/gemini-3-pro-image`, niet het verouderde `gemini-2.5-flash-image-preview` model-ID) wanneer de jurk van kleur/patroon moet veranderen, met een strikte prompt die gezicht/lichaam/achtergrond expliciet uitsluit van wijziging.
**Bestanden:** `docs/Graphic-Design/social-media-posts/` (nieuwe map), losse helper-script in sessiescratchpad (`gen-post.mjs`, leest `OPENROUTER_API_KEY` uit `.env`).
**Waarom:** Daisy wilde social media posts in de stijl van een getoond voorbeeldbeeld (magazine-editorial met tekst-overlay), met een harde eis dat gezicht/lichaam nooit mogen veranderen. Tekst-overlay op de ongewijzigde foto garandeert dat voor de meeste posts; AI-bewerking is alleen nodig zodra de jurk zelf moet veranderen (panterprint/magenta/paars, zie hieronder).

---

## Vaste kledingregel en fotobewerkingsfout: AI verzon een oorbel

**Wat:** Vastgelegd dat Daisy's kleding op elke bewerkte foto altijd panterprint, magenta of paars moet zijn (logokleuren), nooit een andere kleur. Bij de bewerking van foto 076A2551 (paarse gevel) voegde het AI-model ongevraagd een groene bloem-oorbel toe die in het origineel niet aanwezig was, dit werd pas ontdekt doordat Daisy het zelf zag. Hierop is een verplichte verificatiestap ingevoerd: bij elke fotobewerking eerst een side-by-side crop van gezicht/sieraden tussen origineel en bewerkt maken en zelf beoordelen vóór opleveren, plus een aanscherping van de edit-prompt ("voeg geen sieraden/accessoires toe die niet al aanwezig waren"). De foutieve bestanden zijn verwijderd uit de projectmap.
**Bestanden:** `feedback_kleding_kleuren_fotos.md`, `feedback_fotobewerking_verificatie.md` (nieuwe geheugenbestanden).
**Waarom:** Absolute regel van Daisy (nooit gezicht/lichaam veranderen) werd geschonden door het AI-model zelf; alleen visueel beoordelen bleek niet betrouwbaar genoeg, een expliciete pixel-vergelijkingsstap is nu verplicht voor elke volgende fotobewerking.

---

## Instagram grid-crop: verkeerde aanname gecorrigeerd (horizontaal, niet verticaal)

**Wat:** Eerst werd aangenomen dat Instagram's profielgrid een 4:5-post (1080x1350) bijsnijdt tot een vierkant (1:1) door boven/onder te croppen. Een screenshot van Daisy's eigen grid toonde echter dat tekst aan de RECHTERKANT werd afgesneden. Uitgezocht (bevestigd via cropix.app): Instagram toont een 4:5-post in het grid als 3:4, dus volledige hoogte blijft behouden maar er wordt circa 34px van zowel links als rechts afgesneden (zichtbare zone circa 1012x1350). Regel vastgelegd: alle tekst minimaal 110-120px vrijhouden van linker- én rechterrand, canvasformaat blijft 1080x1350 (niet overstappen naar 1080x1440, want dat wordt door Instagram's feed-limiet van maximaal 4:5 juist weer verticaal teruggesneden bij het posten).
**Bestanden:** `feedback_hookposts_alleen_hook.md` (gecorrigeerd).
**Waarom:** Meerdere iteraties nodig gehad omdat de aanvankelijke technische aanname over hoe Instagram bijsnijdt onjuist bleek; nu vastgelegd met de juiste werking zodat dit niet opnieuw fout gaat.

---

## Vier social media posts opgeleverd

**Wat:**
- **Post 1** (`daisy-marketing-called-post-01.png`): foto bij de kleurrijke trap, tekst "YOUR MARKETING CALLED. IT WANTS MORE FUNK."
- **Post 2** (`daisy-curacao-roar-post-02.png`): zelfde foto, jurk naar panterprint bewerkt, tekst "CURAÇAO'S MARKETING JUST GOT SOME ROAR."
- **Post 3** (`daisy-ai-right-now-post-03.png`): foto bij de magenta muur, panterprint jurk, tekst "YOUR NEXT CUSTOMER IS ASKING AI. RIGHT NOW."
- **Post 4** (`daisy-teach-it-post-04.png`): foto met laptop op roze stoel, panterprint jurk, tekst "AI DOESN'T KNOW YOUR CUSTOMER. TEACH IT." Dit is de eerste post in het nieuwe "alleen de hook"-format (zie hieronder) en meerdere keren bijgesteld op tekstpositie na Daisy's feedback dat tekst wegviel in het grid.
**Bestanden:** `docs/Graphic-Design/social-media-posts/*.png`, bijbehorende bewerkte bronfoto's in `docs/Graphic-Design/social-media-posts/foto's Daisy origineel/`.
**Waarom:** Reeks posts voor de nieuwe "actiepost"-contentlijn, telkens verbeterd op basis van directe feedback (hook-scherpte, beeld-opmaak, crop-veiligheid).

---

## Beeld-opmaakregel: alleen de hook, geen tagline of badge

**Wat:** Op expliciet verzoek van Daisy is het postformat vereenvoudigd: geen tagline ("Boring was never the plan") en geen FUNkiness-badge meer op het beeld, alleen de hook, groot en prominent, ongeveer op ooghoogte. Getest op zowel volledige postgrootte als verkleinde grid-thumbnail.
**Bestanden:** `feedback_hookposts_alleen_hook.md` (nieuw, later aangevuld met de crop-correctie hierboven).
**Waarom:** Daisy's directe instructie: de hook is het belangrijkste element en mag niet concurreren met andere tekst.

---

## Actiepost-format en eye-opener-lat fors aangescherpt

**Wat:** Nieuwe contentlijn vastgelegd naast de bestaande pure-humorlijn: "actieposts" moeten de lezer altijd een direct uitvoerbare actie/test geven (concreet, kopieer-plak-baar), gericht op wat de lezer eraan heeft, niet op FUNkiness zelf. De eye-opener-lat is meerdere keren aangescherpt na Daisy's feedback ("retesaai", "wat suf zeg"): van "verrassend" naar "mensen moeten denken: dit wist ik niet, nooit eerder gehoord". Ook vastgelegd: spreek per post één specifieke branche direct aan (makelaar, bank, verhuurder, etc.) in plaats van generiek voor iedereen te schrijven, en roteer de branche per post.
**Bestanden:** `feedback_actiepost_format.md`, `feedback_captions_eyeopener.md` (beide meerdere keren bijgewerkt).
**Waarom:** Een reeks concepten (AI-ideeën-stresstest, reviews-woorden-mining, decoy-effect-prijzen) werd getoetst en deels afgewezen omdat ze te generiek, te bekend, of niet uitvoerbaar genoeg waren.

---

## Herhaalde correctie: nooit de aangesproken branche zelf afkraken

**Wat:** Tweemaal in dezelfde sessie sloop een impliciete kritiek op de aangesproken doelgroep de caption in ("makelaars praten meestal in makelaarspraat", "makelaars overtuigen meestal met feiten"). Beide keren gecorrigeerd op Daisy's aanwijzing. Vastgelegd met een expliciete checklist-vraag: lees de openingszin alsof je zelf tot de aangesproken branche behoort, voelt het als een verwijt, herschrijven zonder de branche als negatief referentiepunt.
**Bestanden:** `feedback_geen_probleemframe.md` (tweemaal aangevuld).
**Waarom:** Dit patroon ("branche doet nu X, maar hier is iets beters") is verleidelijk als retorische opbouw maar schendt de kernregel om nooit vanuit een probleemframe over de doelgroep te schrijven, dit moest expliciet herhaald worden omdat de eerste correctie niet beklijfde.

---

## Reel-concept voor makelaars afgerond: "A day in the life of this house"

**Wat:** Na meerdere afgewezen "baanbrekende" ideeën (dagindeling-kaartje, koffiemoment, spraakmemo van de verkoper, briefje verstoppen als koper) is in samenwerking met een extern ChatGPT-concept een Reel-script afgerond: in plaats van een huis te tonen, laat een makelaar zien hoe een doodgewone dag in het huis eruitziet (tijdstippen: koffie, zwemmen, lunch, zwembad, diner buiten). Volledige shotlijst, montage-aanwijzingen, Nederlandse caption met keyword-openingszin en 5 hashtags zijn vastgelegd. Bouwen van de bijbehorende HTML-tekst-overlay-templates staat gepland voor morgen (2026-09-15).
**Bestanden:** `project_reel_makelaar_dinsdag.md` (nieuw).
**Waarom:** Meerdere eigen ideeën haalden de door Daisy verhoogde "baanbrekend"-lat niet; dit concept werd wel goedgekeurd omdat het concreet, sfeervol en direct filmbaar is zonder afhankelijk te zijn van de verkoper.

---

## Nieuwe vaste regels vastgelegd deze sessie

- **Max 5 hashtags**, altijd positieve toon, geen clichés (`feedback_hashtags_en_toon_social.md`)
- **Alt-tekst verplicht** bij elke afbeelding, social media en website (`feedback_alt_tekst_afbeeldingen.md`)
- **Eerste zin van elke caption bevat zoekwoorden** (branche + Curaçao) (`feedback_zoekwoorden_eerste_zin.md`)
- **Kritische rol aangescherpt** met concreet voorbeeld: ook eigen net opgeleverd werk blijven testen, niet pas kritisch worden als iemand anders de fout al vond (`feedback_kritische_rol.md`)

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| Tekst-overlay- en AI-fotobewerkingspijplijn opgezet | Klaar |
| Kledingregel (panterprint/magenta/paars) vastgelegd | Klaar |
| Fotobewerkingsfout (verzonnen oorbel) gevonden en verificatieproces ingevoerd | Klaar |
| Instagram grid-crop probleem uitgezocht en gecorrigeerd | Klaar |
| Posts 1 t/m 4 opgeleverd | Klaar |
| Post 5 (makelaars/courtage) | Verwijderd wegens fotofout en onjuiste aanname, niet opnieuw gebouwd |
| Actiepost-format en eye-opener-lat vastgelegd | Klaar |
| Reel-script "dag uit het leven" voor makelaars | Klaar, HTML-templates volgen 2026-09-15 |
