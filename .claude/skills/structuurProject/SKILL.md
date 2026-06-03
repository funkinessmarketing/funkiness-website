---
description: Volledige CLAUDE.md sync-check op project niveau. Scant de hele projectstructuur en vergelijkt met CLAUDE.md. Detecteert ontbrekende verwijzingen, dode verwijzingen en weeskinderen.
---

# /structuurProject - Volledige CLAUDE.md Sync

Scant het hele project en checkt of CLAUDE.md nog klopt met de realiteit.

## Drie soorten afwijkingen
1. Ontbrekende verwijzingen: bestand bestaat, CLAUDE.md weet het niet
2. Dode verwijzingen: CLAUDE.md verwijst naar iets dat niet meer bestaat
3. Verplaatste bestanden: CLAUDE.md verwijst naar oude naam

## Instructies

### Stap 1: Lees CLAUDE.md en inventariseer verwijzingen

### Stap 2: Scan de projectstructuur
Scan kennis/, docs/, projecten/, klanten/ maximaal 2 niveaus diep.

### Stap 3: Drie checks
- Dode verwijzingen: bestaat het bestand nog?
- Weeskinderen: bestand bestaat maar niet in CLAUDE.md?
- Inhoudsinspectie: bij vage namen, lees eerste regels

### Stap 4: Schrijf rapport naar docs/structuur-check-YYYY-MM-DD.md

### Stap 5: Voer door en rapporteer

## Gebruik
Typ /structuurProject voor periodiek onderhoud of na hernoemen van bestanden.
