// Apps Script achter de Google Sheet "Funkiness! Scan aanvragen".
// Plakken via Extensies > Apps Script, daarna Implementeren > Implementaties beheren > Nieuwe versie.
// De website stuurt per scan twee berichten met hetzelfde id:
//   1. de aanvraag (contactgegevens), direct bij het versturen van het formulier
//   2. actie 'rapport' (score + rapport + opvolgteksten) of actie 'fout' (foutmelding), na de AI-analyse
// Bij stap 2 stuurt dit script zelf een melding via Gmail, los van de mailserver van funkiness.ai.
//
// Opvolging:
//   - elke ochtend zet maakOpvolgConcepten() op dag 3 en dag 8 een mailconcept klaar in Gmail,
//     zolang "Gereageerd" niet is aangevinkt en er geen bezoek gepland staat
//   - menu FUNkiness! > Stuur bezoekuitnodiging: stuurt de klant een agenda-uitnodiging (iCal)
//     voor het bezoek op de geselecteerde rij
//   Concepten en uitnodigingen gaan vanuit VAN. Dat adres moet in Gmail als "Verzenden als" zijn toegevoegd.
//   Eenmalig: voer zetDagelijkseTrigger() uit (Uitvoeren-knop) en geef toestemming.

const KOPPEN = ['Datum', 'Type', 'Bedrijf', 'Sector', 'Naam', 'Functie', 'Email',
  'Telefoon CW', 'Telefoon NL', 'Instagram', 'Archetype', 'Score', 'Status', 'Rapport', 'ID', 'Website', 'Locatie',
  'Opvolging WhatsApp', 'Opvolging dag 3', 'Opvolging dag 8', 'Gereageerd', 'Opvolging status', 'Bezoek', 'Bezoekadres'];
const MELDING_AAN = 'funkinessmarketing@gmail.com';
const VAN = 'sayhello@funkiness.ai';
const VAN_NAAM = 'Daisy from FUNkiness!';
const BEZOEK_MINUTEN = 60;
const KOLOM_SCORE = 12;
const KOLOM_ID = 15;
const kolom = naam => KOPPEN.indexOf(naam) + 1;

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (d.type === 'nieuwsbrief') {
      nieuwsbriefInschrijving(d);
      return ContentService.createTextOutput('ok-v2');
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    zorgVoorKoppen(sheet);

    if (d.actie === 'rapport' || d.actie === 'fout') {
      const rij = zoekRij(sheet, d.id);
      const status = d.actie === 'fout' ? 'MISLUKT: ' + (d.fout || '') : 'Rapport verstuurd';
      const waarden = [[d.score === undefined ? '' : d.score, status, d.rapport || '']];
      if (rij) {
        sheet.getRange(rij, KOLOM_SCORE, 1, 3).setValues(waarden);
        if (d.opvolging) {
          const o = d.opvolging;
          sheet.getRange(rij, kolom('Opvolging WhatsApp'), 1, 3).setValues([[o.whatsappLink || o.whatsapp || '', o.dag3 || '', o.dag8 || '']]);
          sheet.getRange(rij, kolom('Gereageerd')).insertCheckboxes();
        }
        stuurMelding(sheet, rij, d);
      }
    } else {
      sheet.appendRow([new Date(), d.type || '', d.bedrijf || '', d.sector || '', d.naam || '',
        d.functie || '', d.email || '', alsTekst(d.telefoon), alsTekst(d.telefoon_nl),
        d.instagram || '', d.archetype || '', '', 'Bezig', '', d.id || '', d.website || '', d.locatie || '']);
    }
    return ContentService.createTextOutput('ok-v2');
  } finally {
    lock.releaseLock();
  }
}

// Nieuwsbrief: eigen tabblad, één rij per mailadres. Opnieuw inschrijven werkt taal en datum bij.
const NIEUWSBRIEF_KOPPEN = ['Datum', 'Email', 'Taal', 'Bron', 'Status'];

function nieuwsbriefInschrijving(d) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tab = ss.getSheetByName('Nieuwsbrief') || ss.insertSheet('Nieuwsbrief');
  if (tab.getRange(1, 1).getValue() !== 'Datum') {
    tab.getRange(1, 1, 1, NIEUWSBRIEF_KOPPEN.length).setValues([NIEUWSBRIEF_KOPPEN]).setFontWeight('bold');
    tab.setFrozenRows(1);
  }
  const email = String(d.email || '').trim().toLowerCase();
  const rij = [new Date(), email, (d.taal || 'en').toUpperCase(), d.bron || '', 'Ingeschreven'];
  const laatste = tab.getLastRow();
  if (laatste > 1) {
    const adressen = tab.getRange(2, 2, laatste - 1, 1).getValues();
    for (let i = 0; i < adressen.length; i++) {
      if (String(adressen[i][0]).toLowerCase() === email) {
        tab.getRange(i + 2, 1, 1, rij.length).setValues([rij]);
        return;
      }
    }
  }
  tab.appendRow(rij);
}

// Telefoonnummers met + worden anders als formule gelezen (#ERROR!)
function alsTekst(v) {
  if (!v) return '';
  return "'" + String(v).replace(/^'/, '');
}

function zoekRij(sheet, id) {
  if (!id) return 0;
  const laatste = sheet.getLastRow();
  if (laatste < 1) return 0;
  const ids = sheet.getRange(1, KOLOM_ID, laatste, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (ids[i][0] === id) return i + 1;
  }
  return 0;
}

function zorgVoorKoppen(sheet) {
  if (sheet.getRange(1, 1).getValue() !== 'Datum') sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, KOPPEN.length).setValues([KOPPEN]).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// Melding met alle contactgegevens en het volledige rapport naar Gmail
function stuurMelding(sheet, rij, d) {
  try {
    const waarden = sheet.getRange(rij, 1, 1, KOPPEN.length).getDisplayValues()[0];
    const veld = naam => waarden[KOPPEN.indexOf(naam)] || '';
    const fout = d.actie === 'fout';
    const onderwerp = (fout ? 'Scan MISLUKT: ' : 'Nieuwe ' + veld('Type') + ' scan: ') + veld('Bedrijf')
      + (fout || d.score === undefined ? '' : ', score ' + d.score + '/100');
    const contact = ['Datum', 'Type', 'Bedrijf', 'Sector', 'Locatie', 'Naam', 'Functie', 'Email',
      'Telefoon CW', 'Telefoon NL', 'Instagram', 'Website', 'Archetype']
      .filter(k => veld(k)).map(k => k + ': ' + veld(k)).join('\n');
    const opvolgen = !fout && d.opvolging
      ? '\n\nOPVOLGEN, stap 1: stuur nu deze WhatsApp\n' + d.opvolging.whatsapp
        + (d.opvolging.whatsappLink ? '\nIn één tik: ' + d.opvolging.whatsappLink : '\n(geen telefoonnummer, kopieer de tekst)')
        + '\nStap 2 en 3: op dag 3 en dag 8 staat er vanzelf een mailconcept klaar, zolang "Gereageerd" niet is aangevinkt.'
      : '';
    const inhoud = fout
      ? 'De klant kreeg een foutmelding en heeft geen rapport gezien. Neem zelf contact op.\n\nFout: ' + (d.fout || '')
      : 'Dit rapport heeft de klant gekregen:\n\n' + (d.rapport || '');
    const opties = {};
    if (veld('Email').includes('@')) opties.replyTo = veld('Email');
    MailApp.sendEmail(MELDING_AAN, onderwerp, contact + opvolgen + '\n\n' + inhoud, opties);
  } catch (err) {
    console.error('Melding mislukt: ' + err.message);
  }
}

// Eenmalig uitvoeren: elke ochtend rond 8 uur de opvolging nalopen
function zetDagelijkseTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'maakOpvolgConcepten')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('maakOpvolgConcepten').timeBased().everyDays(1).atHour(8).create();
}

// Dag 3 en dag 8: mailconcept klaarzetten (nooit zelf versturen), daarna één seintje naar Daisy
function maakOpvolgConcepten() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  zorgVoorKoppen(sheet);
  const laatste = sheet.getLastRow();
  if (laatste < 2) return;
  const rijen = sheet.getRange(2, 1, laatste - 1, KOPPEN.length).getValues();
  const klaar = [];
  const dag = 24 * 60 * 60 * 1000;

  rijen.forEach((r, i) => {
    const veld = naam => r[KOPPEN.indexOf(naam)];
    const email = String(veld('Email') || '');
    const status = String(veld('Opvolging status') || '');
    if (!email.includes('@') || veld('Gereageerd') === true || veld('Bezoek') || veld('Status') !== 'Rapport verstuurd') return;
    const datum = veld('Datum');
    if (!(datum instanceof Date)) return;
    const dagen = (Date.now() - datum.getTime()) / dag;

    let stap = '';
    if (dagen >= 8 && !status.includes('dag 8')) stap = 'dag 8';
    else if (dagen >= 3 && !status.includes('dag 3')) stap = 'dag 3';
    if (!stap) return;
    const tekst = String(veld('Opvolging ' + stap) || '');
    if (!tekst) return;

    // Heeft de klant al gemaild naar dit Gmail-account? Dan niet verder opvolgen
    if (GmailApp.search('from:' + email + ' after:' + Utilities.formatDate(datum, 'UTC', 'yyyy/MM/dd'), 0, 1).length) {
      sheet.getRange(i + 2, kolom('Gereageerd')).insertCheckboxes().setValue(true);
      sheet.getRange(i + 2, kolom('Opvolging status')).setValue(status + (status ? ', ' : '') + 'klant mailde terug, gestopt');
      return;
    }
    const [onderwerp, ...rest] = tekst.split('\n\n');
    GmailApp.createDraft(email, onderwerp, rest.join('\n\n'), { from: VAN, name: VAN_NAAM });
    const nieuw = status + (status ? ', ' : '') + 'concept ' + stap + ' klaar ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd-M-yyyy');
    sheet.getRange(i + 2, kolom('Opvolging status')).setValue(nieuw);
    klaar.push(stap + ': ' + veld('Bedrijf') + ' (' + email + ')');
  });

  if (klaar.length) {
    MailApp.sendEmail(MELDING_AAN, klaar.length + ' opvolgmail' + (klaar.length === 1 ? '' : 's') + ' klaar in Concepten',
      'Deze concepten staan klaar in Gmail onder Concepten. Lees ze na en druk op Verzenden:\n\n' + klaar.join('\n'));
  }
}

// Menu in de sheet
function onOpen() {
  SpreadsheetApp.getUi().createMenu('FUNkiness!')
    .addItem('Stuur bezoekuitnodiging (geselecteerde rij)', 'stuurBezoekuitnodiging')
    .addToUi();
}

// Agenda-uitnodiging (iCal) voor het bezoek naar de klant, vanuit VAN, met Daisy in de bcc
function stuurBezoekuitnodiging() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const rij = sheet.getActiveRange().getRow();
  if (rij < 2) { ui.alert('Klik eerst op een cel in de rij van de klant.'); return; }
  const r = sheet.getRange(rij, 1, 1, KOPPEN.length).getValues()[0];
  const veld = naam => r[KOPPEN.indexOf(naam)];
  const email = String(veld('Email') || '');
  const start = veld('Bezoek');
  const adres = String(veld('Bezoekadres') || '');
  const bedrijf = String(veld('Bedrijf') || '');
  const naam = String(veld('Naam') || '');
  if (!email.includes('@')) { ui.alert('Deze rij heeft geen e-mailadres.'); return; }
  if (!(start instanceof Date)) { ui.alert('Vul in de kolom "Bezoek" een datum en tijd in, bijvoorbeeld 21-10-2026 10:00.'); return; }
  if (!adres) { ui.alert('Vul in de kolom "Bezoekadres" het adres in.'); return; }

  const eind = new Date(start.getTime() + BEZOEK_MINUTEN * 60000);
  const tijd = Utilities.formatDate(start, Session.getScriptTimeZone(), "EEEE d MMMM yyyy 'at' HH:mm");
  if (ui.alert('Uitnodiging sturen naar ' + email + ' voor ' + tijd + ' op ' + adres + '?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const titel = 'FUNkiness! visit: ' + bedrijf;
  const omschrijving = 'Daisy from FUNkiness! comes by to walk you through your Marketing Scan. Questions? WhatsApp +599 9 675 1737.';
  const ics = maakIcs({ uid: (veld('ID') || Utilities.getUuid()) + '@funkiness.ai', start, eind, titel, omschrijving, adres, email, naam });
  const tekst = (naam ? 'Hi ' + naam : 'Hi there') + ',\n\nLooking forward to it! I\'ll come by ' + bedrijf + ' on ' + tijd + ', at ' + adres
    + '. The invite is attached, so it lands right in your calendar.\n\nAnything changes? Just reply or WhatsApp me.\n\nDaisy\nFUNkiness! AI, Social Media & Marketing, Curaçao\nWhatsApp: +599 9 675 1737';

  GmailApp.sendEmail(email, titel + ', ' + tijd, tekst, {
    from: VAN, name: VAN_NAAM, bcc: VAN,
    attachments: [Utilities.newBlob(ics, 'text/calendar; charset=UTF-8; method=REQUEST', 'invite.ics')]
  });
  sheet.getRange(rij, kolom('Gereageerd')).insertCheckboxes().setValue(true);
  const status = String(veld('Opvolging status') || '');
  sheet.getRange(rij, kolom('Opvolging status')).setValue(status + (status ? ', ' : '') + 'uitnodiging bezoek verstuurd');
  ui.alert('Verstuurd. De klant krijgt de uitnodiging, jij een kopie op ' + VAN + '.');
}

function maakIcs({ uid, start, eind, titel, omschrijving, adres, email, naam }) {
  const utc = d => Utilities.formatDate(d, 'UTC', "yyyyMMdd'T'HHmmss'Z'");
  const esc = t => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FUNkiness!//Scan//EN', 'METHOD:REQUEST', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + utc(new Date()),
    'DTSTART:' + utc(start),
    'DTEND:' + utc(eind),
    'SUMMARY:' + esc(titel),
    'DESCRIPTION:' + esc(omschrijving),
    'LOCATION:' + esc(adres),
    'ORGANIZER;CN=' + esc(VAN_NAAM) + ':mailto:' + VAN,
    'ATTENDEE;CN=' + esc(naam || email) + ';ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' + email,
    'STATUS:CONFIRMED', 'SEQUENCE:0',
    'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(titel), 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
}
