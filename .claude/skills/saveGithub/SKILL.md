---
description: Commit en push alle wijzigingen naar GitHub met automatische beschrijving
---

# /saveGithub - Opslaan naar GitHub

Commit en push alle wijzigingen naar GitHub.

## Trigger
- /saveGithub - Commit alles met automatisch gegenereerde message
- /saveGithub [message] - Commit met aangepaste message

## Instructies

### 1. Check Status
git status --short
Als er geen wijzigingen zijn: Meld "Geen wijzigingen om op te slaan." en stop.

### 2. Toon Overzicht
Toon een compact overzicht van wat er opgeslagen wordt.

### 3. Stage Bestanden
Stage alle relevante bestanden. NOOIT .env* bestanden committen.

### 4. Genereer Commit Message
Analyseer de staged changes en genereer een Nederlandse commit message.
Kort en bondig (max 1 zin). Als de gebruiker een custom message meegeeft: gebruik die.

### 5. Commit en Push
Commit met Co-Authored-By: Claude en push naar GitHub.

### 6. Bevestig
Toon: branch, aantal bestanden, message en commit hash.

### Wat NOOIT Committen
- .env* bestanden
- Credentials/tokens
- node_modules/
