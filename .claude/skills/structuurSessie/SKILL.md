---
description: Controleer en update CLAUDE.md op basis van de huidige sessie. Detecteert nieuwe mappen, bestanden, conventies, workflows, processen, projecten of klanten die nog niet in CLAUDE.md staan en voegt verwijzingen toe. Gebruik aan het einde van een sessie waarin iets structureels of belangrijks is veranderd of toegevoegd.
---

# /structuurSessie - CLAUDE.md Synchroniseren

Deze skill houdt CLAUDE.md actueel als wegwijzer-document. Als de gebruiker in een toekomstige sessie iets noemt, moet Claude via CLAUDE.md meteen weten waar de relevante info staat.

CLAUDE.md bevat zelf geen grote lappen tekst. Het bevat verwijzingen naar de juiste bestanden en mappen.

## Kernprincipe

Workflows, processen, projecten, klanten, conventies en kennisbestanden moeten vindbaar zijn via CLAUDE.md. Niet als volledige inhoud, maar als pointer.

## Instructies

### Stap 1: Lees de huidige CLAUDE.md
Lees het bestand CLAUDE.md in de project root. Noteer welke verwijzingen er al zijn.

### Stap 2: Analyseer de sessie
Kijk terug naar wat er in deze sessie is gebeurd. Let op:
- Nieuwe mappen in kennis/, docs/, projecten/, klanten/
- Nieuwe bestanden met een vaste rol
- Nieuwe hooks, skills of automatiseringen
- Nieuw kennisbestand, project of klant
- Nieuwe workflows of processen

### Stap 3: Check op API keys en secrets
KRITIEK: Als er API keys, tokens of credentials buiten .env zijn beland, waarschuw dringend. Voeg ze nooit toe aan CLAUDE.md.

### Stap 4: Vergelijk met CLAUDE.md
Voor elke nieuwe structuur: staat er al een verwijzing in CLAUDE.md?
- Ja: niks doen
- Nee: beoordeel of de toevoeging logisch is

### Stap 5: Doorvoeren of vragen
Voer DIRECT door als het overduidelijk is. Vraag WEL bij twijfel of het tijdelijk vs structureel is.

### Stap 6: Rapporteer
Meld kort wat je hebt doorgevoerd.

## Gebruik
Typ /structuurSessie aan het einde van een sessie waarin iets structureels is veranderd.
