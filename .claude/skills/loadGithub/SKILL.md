---
description: Pull de laatste versie van GitHub (git pull)
---

# /loadGithub - Laatste versie ophalen van GitHub

## Trigger
/loadGithub - Pull de laatste wijzigingen van GitHub

## Instructies

### 1. Check Lokale Wijzigingen
Als er uncommitted wijzigingen zijn: Waarschuw en vraag of ze eerst /saveGithub willen draaien.

### 2. Pull van GitHub
git pull origin main

### 3. Resultaat Tonen
Bij nieuwe wijzigingen: Toon aantal bestanden bijgewerkt en laatste commit.
Bij geen wijzigingen: Meld "Alles is up-to-date."
Bij merge conflict: Toon welke bestanden conflicteren.
