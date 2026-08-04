# The Island Host AI Prompt Kit
## 12 AI Prompts for Vacation Rental Owners on Aruba, Bonaire & Curaçao

Dit bestand is de tekstreferentie van het live product in [island-host-ai-prompt-kit.html](island-host-ai-prompt-kit.html) (verkocht via Gumroad, $27). Bij een wijziging aan de HTML altijd dit bestand meebijwerken, en andersom.

**Cover-positionering (2026-08-03, kritische herziening):** "A generic AI prompt doesn't know Airbnb's 295-character preview cutoff, or that VRBO banned fee-mentions in April 2025. These 12 do." Elke prompt-note heet nu expliciet "What generic AI doesn't know" en is visueel het meest prominente element op de kaart (roze label + achtergrond), de prompttekst zelf is bewust rustiger gestyled. Doel: nooit het gevoel "dit had ik zelf ook met AI kunnen maken."

**Founder note (nieuw, 2026-08-03, bovenaan "How to use this kit"):** "I rent a villa on Curaçao myself. I got tired of staring at the same blank description field every other host stares at, so I built the prompts I wished existed instead." Waargebeurd (Daisy verhuurt zelf een villa op Curaçao), geen onbewezen claim, geeft vertrouwen zonder ervaring met andere hosts te claimen.

**AI-verwachtingsmanagement (nieuw, 2026-08-03, toegevoegd aan stap 3):** "This kit is built for the version you're already paying for: free tiers can drift past the character limits or miss the nuance, paid tiers don't." Impliceert dat een betaald abonnement de investering waard is, zonder dat letterlijk te beweren.

**Scope (nieuw, 2026-08-03):** kit is bedoeld voor hosts met maximaal 3 woningen (geen opslag/wisselen tussen profielen in de Fact Sheet, bij meer dan 3 wordt herhaaldelijk invullen te omslachtig). Toegevoegd aan de Fact Sheet-intro op de PDF, Gumroad-beschrijving en de website-pagina: "Built for hosts managing up to 3 properties."

**Booking.com bewust buiten scope (nieuw, 2026-08-03):** toegevoegd aan "What this is not" op Gumroad, de Gumroad-landingpagina en de website-pagina: "No Booking.com prompt. Booking.com writes your listing description for you from your structured property data, you can't paste custom text there the way you can on Airbnb or VRBO." Reden: Booking.com laat een host geen eigen vrije tekst plakken zoals Airbnb/VRBO dat wel doen (bevestigd door Daisy), dus een rewrite-prompt zou een tekst opleveren die nergens te plaatsen is. Geen aparte Booking.com-prompt gebouwd, want er is geen even hard verifieerbaar feit (zoals de Airbnb 295-tekens-cutoff of de VRBO-regel van april 2025) om als anker te gebruiken.

**Opgelost, 2026-08-03:** "What this is not" stond nog niet in de PDF zelf. Toegevoegd als eigen donkere pagina (zelfde stijl als de categorie-intropagina's) direct na "How to use this kit" en vóór de Airbnb-prompts, met dezelfde 4 punten als op Gumroad/website.

**How to use:**
1. Vul de Property Fact Sheet in (pagina 2 van de PDF): eigen naam, eiland, woningtype, kenmerken, doelgroep, wat gasten altijd noemen in reviews. Property name, Island, Type en Aanspreekvorm (je/u) werken **live door in elke prompt op de pagina** zodra je ze invult, zelfde data, nergens twee keer intypen. Het losse "Quick Fill"-paneel van vóór 2026-08-03 bestaat niet meer, is opgegaan in de Fact Sheet.
2. Klik "Copy prompt" op elke kaart. Dit kopieert alleen de prompttekst, niet de roze expert-notitie erboven.
3. Plak in chatgpt.com of claude.ai, vervang elke roze [PLACEHOLDER] met eigen gegevens.
4. Verfijn in dezelfde conversatie: "maak het korter", "meer warmte", "andere opening".

**Power user workflow:** plak de "Copy my property facts"-samenvatting als allereerste bericht in een nieuwe ChatGPT/Claude conversatie, gebruik daarna alle 12 prompts in diezelfde conversatie zonder opnieuw gegevens te typen.

**Strategisch inzicht (nieuw, 2026-08-03):** Aruba en Curaçao liggen buiten de orkaangordel, weinig Noord-Amerikaanse gasten weten dat. Dit als verkoopargument inzetten specifiek van juni t/m november (orkaanseizoen), niet jaarrond.

---

## Categorie 1: Listing Descriptions (prompt 01-08)

### Platform 01: Airbnb

Airbnb is het grootste platform wereldwijd en drijft het merendeel van de internationale boekingen op de ABC-eilanden. Beschrijving en "Your Space" veld zijn beide gelimiteerd tot 500 tekens, waarvan alleen de eerste 295 tekens zichtbaar zijn zonder "read more". Zet auto-vertaling uit en vul per taal je eigen tekst in.

#### Prompt 01: Airbnb Listing Description + Title (6 outputs)

Airbnb's automatische vertaling is generiek. Ga naar Airbnb > Listings > je listing > Listing details > Description > Translated descriptions, en plak elke output hieronder in het juiste taalveld.

```
Output 1: Nederlandse markt (upload als Nederlandse vertaling)

Eilandcontext: [selecteer eiland]
Schrijf een Airbnb-advertentiebeschrijving voor mijn vakantiewoning voor de Nederlandse markt. Max 500 tekens. Schrijf in het Nederlands. Geen clichés: geen "paradijs," "parel," "home away from home" of "adembenemend."
Aanspreekvorm: [je/jij (informeel) OF u (formeel)]

500 tekens is weinig. Gebruik ze goed. Begin direct met het sterkste punt van de woning, geen inleiding. Nederlandse lezers prikken door een template heen: schrijf wat concreet en oprecht is aan deze woning. Geen superlatieven. Eindig met 1 regel die de gast laat klikken. Verwerk de eilandnaam en 1-2 topkenmerken als zoektermen. Schrijf eerst voor de gast en als tweede voor het algoritme.
```

```
Output 2: American market (upload as English US translation)

Island context: [select your island]
Write an Airbnb listing description for my property for the American market. Max 500 characters. Write in English. No clichés: no "paradise," "gem," "home away from home," or "stunning."

500 characters is tight. Lead with your single strongest feature, no warm-up. Use second person ("you'll wake up to..."). American guests respond to experience-driven copy: make them feel the island in one sentence, then anchor it to something specific about this property. Every word must earn its place. End with one line that makes them want to see the photos. Include the island name and 1-2 top amenities as natural search terms.
```

```
Output 3: Canadian market (upload as English Canada translation)

Island context: [select your island]
Write an Airbnb listing description for my property for the Canadian market. Max 500 characters. Write in English. No clichés: no "paradise," "gem," "home away from home," or "stunning."

500 characters is tight. Canadian guests are escaping real winters: lead with the contrast between -20°C back home and what it feels like to arrive here. That contrast is the single most emotionally resonant booking trigger for this market. Then anchor it with one specific detail about this property. End with a line that makes booking feel like the obvious decision before winter hits. Include the island name and 1-2 top amenities as natural search terms.
```

```
Output 4: Your Space in English (upload as English translation)

Island context: [select your island]
Write the "Your Space" section for my Airbnb listing. This is a separate field specifically about the physical property. Max 500 characters. Write in English.

Don't try to describe every room. Pick the 2-3 spaces guests will actually remember: most likely the outdoor area, the primary bedroom and one other standout feature. Be specific. "A private pool surrounded by palms with a west-facing sunset view" beats "a lovely outdoor area." Warm and honest tone. No filler sentences.
```

```
Output 5: Je accommodatie in het Nederlands (upload als Nederlandse vertaling)

Eilandcontext: [selecteer eiland]
Schrijf de "Je accommodatie" sectie voor mijn Airbnb listing. Dit is een apart veld specifiek over de fysieke woning. Max 500 tekens. Schrijf in het Nederlands.
Aanspreekvorm: [je/jij (informeel) OF u (formeel)]

Beschrijf niet elke ruimte: kies de 2-3 plekken die een gast zich herinnert. Waarschijnlijk de buitenruimte, de slaapkamer en één ander hoogtepunt. Wees concreet: "een privézwembad met uitzicht op zee en westkant voor de zonsondergang" slaat beter aan dan "een mooie buitenruimte." Warme en eerlijke toon, geen vulzinnen.
```

```
Output 6: Airbnb title (max 50 characters)

Write an optimized Airbnb listing title for my property on [ISLAND]. Max 50 characters. Lead with the most searchable feature, not the property name. Include the property name only if space allows. Guests filter by keywords like pool, ocean view, beachfront and walk to beach. If the keyword is not in your title, the listing does not show up in filtered searches.

Give 2 variations. For each, state in one sentence which keyword you prioritized and why.
```

---

### Platform 02: VRBO

VRBO bereikt vooral Noord-Amerikaanse gezinnen en groepen. Tot 10.000 tekens beschikbaar, veel meer dan Airbnb, maar toont dezelfde tekst aan alle gasten ongeacht taal. Sinds april 2025 verbiedt VRBO het noemen van verplichte kosten (resort fee, tourism tax, parkeerkosten) in de beschrijving zelf, dat hoort alleen in de prijsinstellingen.

#### Prompt 02: VRBO Description + Title (3 outputs)

```
Output 1: Dutch/European market (Nederlands)

Island context: [select your island]
You are a vacation home copywriter specializing in Caribbean vacation rentals. Write a VRBO listing description for my property for the Dutch and European market. Target 600-800 words. Write in Dutch (Nederlands). No clichés: no "paradijs," "parel," "adembenemend" or "home away from home."
Aanspreekvorm: [je/jij (informeel) OF u (formeel)]

Nederlandse lezers vergelijken listings zorgvuldig en prikken meteen door een template heen. Begin met wat specifiek en oprecht is aan deze woning. Benadruk waarde, praktische kwaliteiten en hoe een verblijf hier dag-tot-dag aanvoelt. Geen superlatieven. Geen inspirerende opening. Schrijf voor iemand die vandaag al twintig listings heeft bekeken en een reden zoekt om deze te vertrouwen. VRBO staat maximaal 10.000 tekens toe. Gebruik die ruimte om grondig te zijn en elke vraag te beantwoorden, niet om de tekst op te vullen.

Verwerk vanzelfsprekend als zoektermen in de tekst: de eilandnaam, het type woning en 1-2 topkenmerken (zoals privézwembad, zeezicht of strandzijde). Schrijf eerst voor de gast en als tweede voor het algoritme.
```

```
Output 2: North American market (English)

Island context: [select your island]
You are a vacation home copywriter specializing in Caribbean vacation rentals. Write a VRBO listing description for my property for the North American market. Target 600-800 words. Write in English. No clichés: no "paradise," "gem," "stunning" or "home away from home."

North American readers respond to aspirational, experience-driven copy. Open with a scene-setting sentence (morning coffee by the pool, sunset on the terrace). Use second person throughout: "you'll wake up to..." Include one paragraph on why this island is worth choosing over other Caribbean options. Close with what makes this specific home worth booking over every other option they've seen today. Aspirational but specific. Vague luxury language loses them. VRBO allows up to 10,000 characters. Use the space to build a complete picture, not just list features.

Naturally include these as search terms: island name, property type, and 1-2 top amenities (e.g. private pool, ocean view, beachfront). Write for the guest first, the algorithm second.
```

```
Output 3: VRBO title (max 80 characters)

Write an optimized VRBO listing title for my property on [ISLAND]. Max 80 characters. Lead with the top searchable feature, then add a second benefit or the location. VRBO gives you more room than Airbnb: use it.

Give 2 variations. For each, state in one sentence which keyword you prioritized and why.
```

---

### Platform 03: Micazu

Nederlands vakantieverhuurplatform, sterk vertegenwoordigd op Curaçao, Aruba en Bonaire. Vrijwel alle gasten zijn Nederlandstalig, vergelijken zorgvuldig en willen vertrouwen voelen. Max 5.000 tekens, altijd Nederlands. Een scherpe tekst van 3.000 tekens converteert beter dan een opgevulde tekst van 5.000.

#### Prompt 03: Micazu beschrijving (1 output, Nederlands)

```
Eilandcontext: [selecteer eiland]

Jij bent een copywriter die gespecialiseerd is in de Nederlandse vakantieverhuurmarkt. Je hebt alle basisgegevens van mijn woning al. Schrijf nu een Micazu-beschrijving.

Nog één aanvullende vraag voordat je begint: Wat maakt deze woning anders dan alle andere opties op dit eiland?
[WEES SPECIFIEK: het ene element waarmee jij je onderscheidt van andere verhuurders op het eiland]

Aanspreekvorm: [je/jij (informeel, meest gebruikt) OF u (formeel, bijv. voor luxe of zakelijk publiek)]

Schrijf in het Nederlands. Toon: warm, eerlijk en persoonlijk, met een vleugje avontuur. Klinkt als een host die je kennis laat maken met het eiland, niet als een verhuurbureau.

Structuur:
1. Opening die de sfeer van de woning neerzet (geen vragen, geen superlatieven)
2. De woning zelf (specifieke hoogtepunten, geen kamer-voor-kamer-rondleiding)
3. De buitenruimte (als die er is)
4. De locatie en wat er op loopafstand is
5. Korte afsluiting die uitnodigt zonder te pushen

Vermeld eilandspecifieke elementen die voor Nederlanders relevant zijn, zoals het weer, Nederlandstalige omgeving, nabijheid van populaire stranden of activiteiten. Alleen wat daadwerkelijk van toepassing is op deze woning. Micazu staat max 5000 tekens toe. Gebruik die ruimte goed maar vul ze niet op: een scherpe tekst van 3000 tekens converteert beter dan een opgeblazen tekst van 5000.

Verwerk vanzelfsprekend als zoektermen in de tekst: de eilandnaam, het type woning en de 1-2 kenmerken die jou onderscheiden. Schrijf eerst voor de gast en als tweede voor het algoritme.
```

---

### Universal Listing Tools (werkt op Airbnb, VRBO, Micazu en eigen website)

#### Prompt 04: Short Teaser Description

Deze 2 zinnen verschijnen in de Airbnb linkpreview bij delen via WhatsApp, op de eigen boekingswebsite, in social bio's en Google-snippets.

```
Write 3 versions of a 2-sentence teaser description for my vacation rental. You already have my property details. Each version takes a completely different angle. Sensory language only. No clichés. No questions. No exclamation marks. No "paradise."

Strongest feature: [e.g. private infinity pool facing west for sunsets]
Second feature: [e.g. 4-minute walk to Klein Knip beach]
Vibe: [e.g. relaxed and private / family-friendly / romantic / digital nomad]

Version A: lead with the feeling of arriving here for the first time
Version B: lead with the location and what surrounds the property
Version C: lead with the specific feature that no other rental nearby can match

After the 3 versions, tell me in one sentence which one you'd recommend for an Airbnb link preview and why.
```

#### Prompt 05: Rewrite Existing Description

```
You are a senior hospitality copywriter. Rewrite my vacation rental listing description. Remove every cliché, vague adjective and generic statement that could describe any property anywhere in the world. Every sentence must be specific to this property on [ISLAND].

My current description:
[PASTE YOUR CURRENT DESCRIPTION HERE]

Things I should have included but didn't:
[ADD DETAILS: specific views, local touches, things guests always comment on, unique features you take for granted]

Platform this is for: [AIRBNB / VRBO / MICAZU / DIRECT WEBSITE]

Rules for the rewrite:
- Show, don't tell. Replace "beautiful view" with what makes it beautiful.
- Lead with the strongest sentence. Cut the slow warm-up.
- Keep it the same length or shorter.
- End with a line that makes the reader want to look at the photos next.

After the rewrite, list the 3 specific changes you made and why each one improves conversion.
```

#### Prompt 06: Unique Selling Points

Test: als een andere verhuurder op het eiland hetzelfde kan zeggen, telt het niet.

```
I need help identifying and writing the unique selling points of my vacation rental. You already have my property details. Be brutally honest: if it isn't actually unique, cut it.

Three things I want you to factor in that aren't in my property info:
- Something that surprises guests when they arrive: [THE THING PHOTOS DON'T CAPTURE]
- Price compared to similar properties here: [CHEAPER / SIMILAR / MORE EXPENSIVE]
- Who this property is NOT right for: [BE HONEST]

Deliver:
1. Five bullet points, max 15 words each. Each one must survive this test: "Could another rental on this island say the exact same thing?" If yes, rewrite it.
2. One headline sentence (max 12 words) that captures the total appeal of this property.
3. One honest sentence about who this property is NOT for. (This increases trust and reduces bad-fit bookings.)
```

#### Prompt 07: Pool and Outdoor Space

```
Write a vivid, sensory paragraph (100-150 words) describing the outdoor space of my vacation rental on [ISLAND]. Make the reader feel like they're already there. No clichés. Specific details only.

What my outdoor space includes: [LIST EVERYTHING: pool, sun loungers, outdoor shower, BBQ, terrace, garden, sea view, palm trees, hammock, outdoor dining table]
Orientation: [faces east/west/south / morning sun / afternoon shade / sunset view]
Size and feel: [compact and intimate / spacious / sprawling / private and hidden / open and social]
The detail guests always comment on: [WHAT DO PEOPLE ALWAYS MENTION ABOUT THE OUTDOOR SPACE?]

Write in second person ("you"). Open with the exact moment the reader steps outside. End with the thing they will not want to leave. Do not describe the pool dimensions. Describe the feeling of being in it.
```

#### Prompt 08: Location Description

```
Write a location section for my vacation rental listing that makes [NEIGHBORHOOD] on [ISLAND] feel like a place worth choosing, not just a geographic fact.

Location details:
- Neighborhood name and character: [e.g. "Jan Thiel, quiet and residential with a small marina nearby"]
- What you can reach on foot: [BEACH / RESTAURANTS / SUPERMARKET / TOWN / LIST THEM]
- What's within 10 minutes by car: [LIST 3-4 PLACES WITH WHAT MAKES EACH WORTH VISITING]
- The local spot most tourists never find: [YOUR ACTUAL INSIDER RECOMMENDATION]
- Who loves this location most: [COUPLES / FAMILIES / DIVERS / REMOTE WORKERS / etc.]

Write 2 paragraphs. First: the feel, rhythm and personality of this neighborhood. Make it specific to [ISLAND]. Second: practical proximity with warmth. Never list distances like a real estate brochure. Describe what the walk or drive actually feels like.
```

---

## Categorie 2: More Bookings & Reputation (prompt 09-12)

De platforms belonen hosts die snappen hoe het algoritme werkt: responssnelheid, volledigheid van de listing, aantal foto's, amenities, review-snelheid, Instant Book en Superhost-status. Belangrijk: deze prompts halen geen data automatisch van Airbnb/VRBO/Booking.com op, de host vult zelf in wat hij al weet uit het eigen host-dashboard. Geen scraping, geen platform-koppeling.

#### Prompt 09: Airbnb Algorithm Audit

**2026-08-03 gefixt:** dit vroeg de AI eerder om Instant Book, responssnelheid en kalenderactiviteit te "beoordelen" zonder ergens te vragen die gegevens aan te leveren, met een echte test (Daisy, ChatGPT) kwam dit terug als "Onbekend, niet zichtbaar voor mij" op precies die punten. Nu vraagt de prompt eerst expliciet om 5 host-dashboard-cijfers (Instant Book, responstijd, kalenderupdates, aantal foto's, reviews) via losse invulvelden, de AI gokt niet meer.

```
You are an Airbnb optimization expert. Audit my listing against Airbnb's known ranking factors, using the details below. These come from my host dashboard, not the public listing page, so use exactly what I give you instead of guessing.

Instant Book: [ENABLED / NOT ENABLED]
Typical response time: [WITHIN AN HOUR / A FEW HOURS / A DAY / SLOWER]
Calendar updates: [DAILY / WEEKLY / RARELY]
Photos uploaded: [NUMBER]
Reviews: [RATING AND COUNT]

Evaluate each factor as strong / needs work, based on the numbers above and my property info:
1. Listing completeness: every field filled in?
2. Photo quantity: at or above 20 photos?
3. Amenities: likely amenities I have but haven't listed?
4. Instant Book
5. Response rate and speed
6. Review count and recency
7. Pricing: competitive for my market and dates?
8. Calendar activity

After the audit, give me a numbered action list ranked by expected impact on bookings. Be specific. No vague advice.
```

#### Prompt 10: Amenities Maximizer

```
Based on my property details, help me build a complete amenities list.

Step 1: Generate a comprehensive amenities list based on everything I've described.

Step 2: Flag the amenities most commonly overlooked by ABC island hosts, including: beach chairs, beach umbrella, snorkeling gear, outdoor shower, portable fan, iron and board, beach towels, hair dryer, portable crib, high chair, BBQ or grill, outdoor dining table, sun loungers, smart TV, streaming services, coffee grinder, water purifier, ceiling fans, blackout curtains, luggage storage, first aid kit.

For each overlooked item: ask me if I have it. After I confirm, add it to my list.

Deliver the final formatted amenities list ready to copy into my platform settings.
```

#### Prompt 11: Listing Photo Brief

```
Create a photo shoot brief for my vacation rental on [ISLAND]. A photographer or I should be able to follow this as a shot list.

Property: [NAME] / Type: [VILLA / APARTMENT / GUESTHOUSE / STUDIO]
Stand-out feature: [THE ONE THING THAT LOOKS BEST IN A PHOTO]

Deliver:
1. The hero shot (photo 1): what to show, time of day, angle, and why this works as my search result thumbnail
2. Photo sequence 1-20: each room or outdoor space, in recommended upload order, with notes on framing and best time of day to shoot
3. Three shots most hosts forget but guests always look for
4. Scene-setting shots that sell the island experience, not just the interior
5. Airbnb photo captions: write one caption (max 20 words) for the 6 most important photos. Each caption adds one specific detail the photo cannot show on its own.

End with: 3 things to avoid in vacation rental photography on the ABC islands.
```

#### Prompt 12: Review Response Writer

**Nieuw, 2026-08-03.** Toegevoegd naar aanleiding van de vraag "dit moet echt wow-waarde hebben, niet iets wat je zelf ook met AI had kunnen doen." Een publieke review-reactie is permanent en wordt op de meeste platforms gelezen vóórdat een toekomstige gast de review zelf leest. De belangrijkste regel die hosts breken: je verontschuldigen voor iets wat niet jouw fout was, dat leest als schuld bekennen.

```
You are a hospitality reputation manager. Write a public response to this guest review for my vacation rental on [ISLAND]. This response will be visible to every future guest before they read the review itself, so it matters more than the review does.

Review type: [MINOR COMPLAINT / NEUTRAL / FEELS UNFAIR / LEGITIMATE ISSUE]

What the guest said: [PASTE THE REVIEW OR COMPLAINT]

What actually happened, my side: [YOUR CONTEXT, BE HONEST]

Rules:
- Never apologize for something that wasn't my fault. That reads as guilt to future readers, even when I did nothing wrong.
- Address the specific point the guest raised. No generic template response.
- If a factual claim in the review is inaccurate, correct it politely and specifically, without arguing.
- Warm but brief: one short paragraph, max 80 words.
- End forward-looking, not defensive.
- Never use "we're sorry you feel that way." It is the most recognizably dismissive line in hospitality, and guests spot it instantly.
```

---

## Upsell teaser: Social Media Kit (nog niet gebouwd)

Aan het einde van de PDF staat al een teaser voor een toekomstig los te verkopen Social Media Kit, met een voorbeeldprompt over precies het onderwerp "annulering/rustige periode omzetten in een booking" (NL en EN versie). Dit product bestaat nog niet, alleen de teaser in de PDF. Relevant om te weten bij het bouwen van de Social Media Kit later: dit onderwerp ligt al vast als eerste voorbeeld.

---

*The Island Host AI Prompt Kit, door FUNkiness! AI, Social Media & Marketing*
*funkiness.ai*
