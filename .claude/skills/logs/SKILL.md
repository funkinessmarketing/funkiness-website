---
description: Documenteer sessie acties in daily log (werkt in elk project)
---

# /logs - Sessie Documentatie

Analyseer de conversatie en documenteer alle significante acties in een daily log bestand.

## Instructies

### Stap 1: Bepaal Bestandspad

Voer deze Bash commando's uit:

```bash
TODAY=$(date +%Y-%m-%d)
mkdir -p docs/logs/$TODAY
ls docs/logs/$TODAY/ 2>/dev/null | wc -l
```

Volgnummer = count + 1 (geformatteerd als 01, 02, etc.)
Genereer een korte beschrijving (kebab-case) van de sessie focus.
Bestandspad: docs/logs/YYYY-MM-DD/NN-beschrijving.md

### Stap 2: Analyseer Conversatie

Analyseer ZELF de huidige conversatie en identificeer alle significante acties:
- Nieuwe features geimplementeerd
- Bug fixes (met details over symptoom, root cause, oplossing)
- Configuratie wijzigingen
- Database migraties
- Documentatie updates
- Refactoring

Je hebt al alle context, geen sub-agent nodig.

### Stap 3: Schrijf Log Bestand

Schrijf het log bestand met dit format:

# [Beschrijving van sessie]

**Datum:** YYYY-MM-DD HH:MM
**Project:** [project naam]

---

## [Actie 1 titel]

**Wat:** [Korte beschrijving]
**Bestanden:** pad/naar/bestand.ts - [wijziging]
**Waarom:** [Reden voor de wijziging]

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| [Taak 1] | Klaar |

## Gebruik

Voer /logs uit aan het einde van een sessie om alle wijzigingen te documenteren.
