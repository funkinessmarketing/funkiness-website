# Scan e-mailflow gerepareerd: SMTP-server, JSON-crash en vangnet-logging

**Datum:** 2026-07-24 09:35
**Project:** Het Mainframe (FUNkiness! website)

---

## Aanleiding

Daisy testte als "testklant" de Social Media Scan en Marketing Strategy Scan en ontving geen rapportmail, en er kwam ook geen leadmail binnen op sayhello@funkiness.ai. Dit bleek uiteindelijk een combinatie van drie losstaande problemen.

---

## Probleem 1: Fragiele JSON-extractie uit Claude's antwoord

**Wat:** `api/scan.js` en `api/marketing-scan.js` lieten Claude vrije tekst genereren en visten daar met een regex een JSON-blok uit, gevolgd door `JSON.parse()`. Zodra Claude's output een ongeëscapete quote bevatte, crashte de hele aanvraag met een 500-error, nog vóór de mailer werd aangeroepen.
**Bestanden:** api/scan.js, api/marketing-scan.js - omgebouwd naar Claude tool-use met een verplicht JSON-schema (`submit_scan_report` tool, `tool_choice` geforceerd). Bij een eerste poging bleek een geneste schema-vorm (`platforms: {feedback}`) door Haiku soms als platte string te worden teruggegeven, dit is opgelost door het schema plat te trekken (`platforms_feedback` etc.) en de structuur in code op te bouwen.
**Waarom:** Garandeert altijd geldige, correct gestructureerde output, geen crash-kans meer op dit punt.

---

## Probleem 2: Verkeerde SMTP-servernaam

**Wat:** De mailer in alle drie de API's (`api/scan.js`, `api/marketing-scan.js`, `api/archetype-quiz.js`) verbond met `smtp.titan.email`, wat consequent een `535 5.7.8 authentication failed` gaf, ook met een correct wachtwoord (bevestigd via succesvolle Titan-webmail login). Uitgebreid getest en uitgesloten: ontbrekende environment variables (stonden al goed in Vercel), verlopen wachtwoord (webmail-login werkte), Microsoft 365 (Outlook herkende het adres niet), GoDaddy's "SMTP Authentication inschakelen" actie (geen effect, ook niet na 48 uur wachten).
**Root cause:** GoDaddy-supportmedewerker gaf uiteindelijk de juiste servernaam: `smtpout.secureserver.net` (het klassieke GoDaddy Workspace Email-platform, niet de Titan-servers, ondanks de "Professional Email powered by Titan"-branding).
**Bestanden:** api/scan.js, api/marketing-scan.js, api/archetype-quiz.js - `host` gewijzigd van `smtp.titan.email` naar `smtpout.secureserver.net`. Bevestigd met een losstaand nodemailer-testscript dat authenticatie op zowel poort 587 (STARTTLS) als 465 (SSL) slaagt.
**Waarom:** Dit was de daadwerkelijke oorzaak dat er nooit mail werd verstuurd, onafhankelijk van probleem 1.

---

## Probleem 3: Geen enkele opslag van scan-aanvragen

**Wat:** Er was geen database of logging, alleen de twee uitgaande e-mails. Tijdens de periode dat mail kapot was, waren eventuele echte klant-aanvragen onherroepelijk verloren (Vercel bewaart function-logs maar zeer kort).
**Oplossing:** Een Google Sheet ("Funkiness! Scan aanvragen") met een Apps Script Web App als webhook-endpoint. Elke scan-aanvraag wordt nu direct na validatie (vóór de AI-call en vóór de mailer) fire-and-forget naar deze sheet gelogd, onafhankelijk van of de rest van de flow slaagt.
**Bestanden:** api/scan.js, api/marketing-scan.js - `GSHEET_WEBHOOK_URL` env var toegevoegd (Vercel, alle environments), fetch-call toegevoegd direct na input-validatie.
**Waarom:** Structureel vangnet zodat toekomstige aanvragen nooit meer spoorloos verdwijnen, ongeacht e-mailproblemen.

---

## Extra: spam-waarschuwing op de website

**Wat:** De rapportmail bleek na de SMTP-fix technisch te worden geaccepteerd en verstuurd, maar landde in de spamfolder (SPF/DKIM van funkiness.ai zijn nog niet uitgelijnd met de nieuwe verzendserver).
**Bestanden:** scan-script.js - tekst onder het rapport aangepast van "We also sent a copy to {email}." naar "We also sent a copy to {email}. Don't see it? Check your spam folder."
**Waarom:** Directe, snelle verbetering voor gebruikers terwijl de structurele fix (Resend, zie hieronder) nog niet is afgerond.

---

## Openstaand: Resend voor structurele deliverability-fix

**Status:** In uitvoering, gepauzeerd. Resend-account aangemaakt, domein `funkiness.ai` toegevoegd, API key gegenereerd en opgeslagen (nog niet in Vercel/code verwerkt), DNS-records (TXT `resend._domainkey`, MX `send`, TXT `send`) opgehaald maar nog niet toegevoegd bij GoDaddy DNS (liep vast op verkeerd ingelogd GoDaddy-account, "SA"-account in plaats van het account bij klantnummer 705800971).
**Volgende stap:** Inloggen bij GoDaddy met het juiste account, DNS-records toevoegen, daarna `api/scan.js` en `api/marketing-scan.js` ombouwen van nodemailer/SMTP naar de Resend API.
**Waarom nog niet afgerond:** Daisy was op na een lange GoDaddy-troubleshootsessie, bewust gepauzeerd voor een volgende sessie.

---

## Tooling-notitie

Voor dit debugtraject is de Vercel CLI lokaal geïnstalleerd en ingelogd (via een tijdelijke npm-cache om een corrupte globale cache te omzeilen), gebruikt voor: environment variables beheren, deployments triggeren, en live function-logs uitlezen tijdens troubleshooting. Ook is een eenmalige geplande cloud-taak (`trig_01GSMwuykicEnSD5AcAWzqsX`, inmiddels afgerond/`run_once_fired`) ingezet om automatisch te checken of een GoDaddy-fix was doorgevoerd.

---

## Sessie Samenvatting

| Taak | Status |
|------|--------|
| JSON-crash in Claude-output oplossen (tool-use schema) | Klaar |
| Root cause SMTP-fout vinden en fixen (smtpout.secureserver.net) | Klaar |
| Vangnet-logging naar Google Sheet toevoegen | Klaar |
| End-to-end testen (rapportmail + leadmail) | Klaar, beide komen aan (in spam) |
| Spam-waarschuwing toevoegen op scan-resultaatpagina | Klaar |
| Resend opzetten voor structurele deliverability-fix | Gepauzeerd, DNS-records nog toe te voegen bij GoDaddy |
| GoDaddy klantnummer gecorrigeerd in geheugen | Klaar (705800971, niet 718684879) |
