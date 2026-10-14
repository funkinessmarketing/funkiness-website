// Apps Script achter de Google Sheet "Funkiness! Scan aanvragen".
// Plakken via Extensies > Apps Script, daarna Implementeren > Implementaties beheren > Nieuwe versie.
// De website stuurt per scan twee berichten met hetzelfde id:
//   1. de aanvraag (contactgegevens), direct bij het versturen van het formulier
//   2. actie 'rapport' (score + rapport) of actie 'fout' (foutmelding), na de AI-analyse
// Bij stap 2 stuurt dit script zelf een melding via Gmail, los van de mailserver van funkiness.ai.

const KOPPEN = ['Datum', 'Type', 'Bedrijf', 'Sector', 'Naam', 'Functie', 'Email',
  'Telefoon CW', 'Telefoon NL', 'Instagram', 'Archetype', 'Score', 'Status', 'Rapport', 'ID', 'Website', 'Locatie'];
const MELDING_AAN = 'funkinessmarketing@gmail.com';
const KOLOM_SCORE = 12;
const KOLOM_ID = 15;

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    zorgVoorKoppen(sheet);

    if (d.actie === 'rapport' || d.actie === 'fout') {
      const rij = zoekRij(sheet, d.id);
      const status = d.actie === 'fout' ? 'MISLUKT: ' + (d.fout || '') : 'Rapport verstuurd';
      const waarden = [[d.score === undefined ? '' : d.score, status, d.rapport || '']];
      if (rij) {
        sheet.getRange(rij, KOLOM_SCORE, 1, 3).setValues(waarden);
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
    const inhoud = fout
      ? 'De klant kreeg een foutmelding en heeft geen rapport gezien. Neem zelf contact op.\n\nFout: ' + (d.fout || '')
      : 'Dit rapport heeft de klant gekregen:\n\n' + (d.rapport || '');
    const opties = {};
    if (veld('Email').includes('@')) opties.replyTo = veld('Email');
    MailApp.sendEmail(MELDING_AAN, onderwerp, contact + '\n\n' + inhoud, opties);
  } catch (err) {
    console.error('Melding mislukt: ' + err.message);
  }
}
