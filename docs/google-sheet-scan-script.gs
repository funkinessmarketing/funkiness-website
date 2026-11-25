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
const MELDING_AAN = 'sayhello@funkiness.ai';
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
    if (d.type === 'bf-spin') {
      return ContentService.createTextOutput(JSON.stringify(bfSpin(d))).setMimeType(ContentService.MimeType.JSON);
    }
    if (d.type === 'bf-opruimen') {
      return ContentService.createTextOutput(JSON.stringify({ verwijderd: bfVerwijderTests() })).setMimeType(ContentService.MimeType.JSON);
    }
    if (d.type === 'bf-event') {
      bfEvent(d);
      return ContentService.createTextOutput('ok-v2');
    }
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
    .addSeparator()
    .addItem('Black Friday: trek de hoofdprijs', 'bfTrekHoofdprijs')
    .addItem('Black Friday: verwijder testdeelnames', 'bfVerwijderTests')
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

// ============================================================
// BLACK FRIDAY 2026: SPIN THE FUN!
// De website (api/spin.js) stuurt type 'bf-spin'. Dit script bepaalt de prijs, onder de lock
// van doPost, zodat twee draaiers tegelijk nooit samen de laatste Marketing SOS krijgen.
// Tabblad "Black Friday": één rij per deelname. Kolom Status: zet op "Ongeldig" om iemand
// uit te sluiten van de hoofdprijstrekking (bv. geen bedrijf op Curaçao).
// Status "TEST": deelname van een test (alleen via de webhook zelf, niet via de site); telt niet mee.
// Tabblad "BF tellers": één rij per stap (bezoek, start formulier), zonder persoonsgegevens.
// Tabblad "BF trekking": het verslag van de hoofdprijstrekking op 30 november.
// ============================================================
const BF_TAB = 'Black Friday';
const BF_KOPPEN = ['Datum', 'ID', 'Naam', 'Bedrijf', 'Email', 'WhatsApp', 'Kanaal', 'KvK',
  'Prijs', 'Status', 'Bron', 'Campagne', 'Sleutel bedrijf', 'Sleutel kanaal', 'Geleverd'];
const BF_TZ = 'America/Curacao';
const BF_OPEN = '2026-11-26';   // eerste dag (Curaçao-tijd)
const BF_DICHT = '2026-11-29';  // laatste dag, t/m 23:59
// Kansen in procenten. Marketing SOS: max 5 in totaal en max 2 per dag (de actie duurt 4 dagen). Is die op,
// dan valt de draai op een van de vijf digitale cadeaus (gelijke kans).
const BF_PRIJZEN = [
  { id: 'hooks', kans: 18 },
  { id: 'ai-pack', kans: 18 },
  { id: 'rescue', kans: 18 },
  { id: 'ideas', kans: 18 },
  { id: 'mystery', kans: 18 },
  { id: 'sos', kans: 10, max: 5, maxPerDag: 2 }
];
const BF_NAMEN = { hooks: '10 Killer Hooks', 'ai-pack': 'AI Power Pack', rescue: 'Content Rescue Kit',
  ideas: '30 Days of Ideas', mystery: 'Mystery FUNky Gift', sos: 'Marketing SOS' };

const bfDag = d => Utilities.formatDate(d, BF_TZ, 'yyyy-MM-dd');
const bfBedrijf = v => String(v || '').toLowerCase()
  .replace(/\b(n\.?v\.?|b\.?v\.?|llc|inc|ltd|v\.?o\.?f\.?|curacao|curaçao)\b/g, '').replace(/[^a-z0-9]/g, '');
// Sleutel van het kanaal. Instagram/Facebook op accountnaam; gedeelde domeinen (linktr.ee, wixsite enz.)
// houden hun eerste padstuk, anders zou elk bedrijf op zo'n domein als hetzelfde gelden.
const BF_GEDEELD = /^(linktr\.ee|linktree\.com|beacons\.ai|taplink\.cc|carrd\.co|wa\.me|wa\.link|bit\.ly|business\.site|[^/]+\.(wixsite|business\.site|godaddysites|mystrikingly|squarespace|weebly|webnode|myshopify|carrd)\.[a-z.]+)$/;
const bfKanaal = v => {
  let t = String(v || '').toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const prof = t.match(/^(?:m\.|web\.|l\.)?facebook\.com\/profile\.php\?id=(\d+)/);
  if (prof) return 'facebook:' + prof[1];
  t = t.replace(/^(?:m\.|web\.|l\.)?(instagram|facebook|fb)\.com\//, '$1:').replace(/^@/, 'instagram:');
  const host = t.split(/[/?#]/)[0];
  if (BF_GEDEELD.test(host)) { const stuk = t.replace(/[?#].*$/, '').split('/').filter(Boolean)[1]; return host + (stuk ? '/' + stuk : ''); }
  return t.replace(/[/?#].*$/, '').replace(/\/+$/, '');
};

function bfTab(naam, koppen) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tab = ss.getSheetByName(naam) || ss.insertSheet(naam);
  if (tab.getRange(1, 1).getValue() !== koppen[0]) {
    tab.getRange(1, 1, 1, koppen.length).setValues([koppen]).setFontWeight('bold');
    tab.setFrozenRows(1);
  }
  return tab;
}

function bfSpin(d) {
  const nu = new Date();
  const vandaag = bfDag(nu);
  if (vandaag < BF_OPEN) return { status: 'nog-niet' };
  if (vandaag > BF_DICHT) return { status: 'gesloten' };

  const tab = bfTab(BF_TAB, BF_KOPPEN);
  const k = naam => BF_KOPPEN.indexOf(naam);
  const email = String(d.email || '').trim().toLowerCase();
  const tel = String(d.whatsapp || '').replace(/\D/g, '');
  const sBedrijf = bfBedrijf(d.bedrijf);
  const sKanaal = bfKanaal(d.kanaal);
  const kvk = String(d.kvk || '').replace(/\D/g, '');

  const rijen = tab.getLastRow() > 1 ? tab.getRange(2, 1, tab.getLastRow() - 1, BF_KOPPEN.length).getValues() : [];
  let sosTotaal = 0, sosVandaag = 0;
  for (const r of rijen) {
    if (r[k('Status')] === 'TEST') continue;   // testdeelnames tellen nergens mee
    const dubbel = (email && String(r[k('Email')]).toLowerCase() === email)
      || (tel && String(r[k('WhatsApp')]).replace(/\D/g, '') === tel)
      || (sBedrijf && r[k('Sleutel bedrijf')] === sBedrijf)
      || (sKanaal && r[k('Sleutel kanaal')] === sKanaal)
      || (kvk && String(r[k('KvK')]).replace(/\D/g, '') === kvk);
    if (dubbel) return { status: 'dubbel', prijs: r[k('Prijs')] };
    if (r[k('Prijs')] === 'sos') {
      sosTotaal++;
      if (bfDag(new Date(r[k('Datum')])) === vandaag) sosVandaag++;
    }
  }

  // Prijs trekken op de server
  const sos = BF_PRIJZEN.find(p => p.id === 'sos');
  const sosBeschikbaar = sosTotaal < sos.max && sosVandaag < sos.maxPerDag;
  const pot = BF_PRIJZEN.filter(p => p.id !== 'sos' || sosBeschikbaar);
  const totaal = pot.reduce((t, p) => t + p.kans, 0);
  let lot = Math.random() * totaal, prijs = pot[pot.length - 1].id;
  for (const p of pot) { if ((lot -= p.kans) < 0) { prijs = p.id; break; } }

  const id = 'BF-' + Utilities.getUuid().slice(0, 8).toUpperCase();
  const rij = [nu, id, d.naam || '', d.bedrijf || '', email, "'" + (d.whatsapp || ''), d.kanaal || '', kvk ? "'" + kvk : '',
    prijs, d.test === true ? 'TEST' : 'Geldig', d.bron || '', d.campagne || '', sBedrijf, sKanaal, ''];
  tab.appendRow(rij);
  const r = tab.getLastRow();
  tab.getRange(r, k('Status') + 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Geldig', 'Ongeldig', 'TEST'], true).build());
  tab.getRange(r, k('Geleverd') + 1).insertCheckboxes();

  if (prijs === 'sos') {
    try {
      MailApp.sendEmail(MELDING_AAN, (d.test === true ? '[TEST] ' : '') + 'Black Friday: Marketing SOS gewonnen door ' + (d.bedrijf || ''),
        'Winnaar ' + (sosTotaal + 1) + ' van 5.\n\nNaam: ' + (d.naam || '') + '\nBedrijf: ' + (d.bedrijf || '')
        + '\nEmail: ' + email + '\nWhatsApp: ' + (d.whatsapp || '') + '\nKanaal om te beoordelen: ' + (d.kanaal || '')
        + '\nID: ' + id + '\n\nMax 20 tot 30 minuten: 1 observatie wat goed werkt, 3 verbeterpunten, 1 aanbeveling. '
        + 'Max 1 A4 of video van max 3 minuten. Vink "Geleverd" aan in het tabblad Black Friday als het verstuurd is.',
        email ? { replyTo: email } : {});
    } catch (err) { console.error('SOS-melding mislukt: ' + err.message); }
  }
  return { status: 'ok', id: id, prijs: prijs, sosOver: sos.max - sosTotaal - (prijs === 'sos' ? 1 : 0) };
}

// Teller per stap van de route, zonder persoonsgegevens
function bfEvent(d) {
  const stappen = ['bezoek', 'start-formulier'];
  if (stappen.indexOf(d.stap) < 0) return;
  bfTab('BF tellers', ['Datum', 'Stap', 'Bron', 'Campagne'])
    .appendRow([new Date(), d.stap, String(d.bron || '').slice(0, 60), String(d.campagne || '').slice(0, 60)]);
}

// Hoofdprijs THE ULTIMATE FUNky MAKEOVER: menu FUNkiness! > Black Friday: trek de hoofdprijs.
// Kan pas vanaf 30 november en maar één keer. Het verslag (aantal deelnemers, vingerafdruk van de
// deelnemerslijst, tijdstip, winnaar) komt in tabblad "BF trekking", zodat de trekking achteraf te controleren is.
// Tip: neem je scherm op tijdens de trekking.
function bfTrekHoofdprijs() {
  const ui = SpreadsheetApp.getUi();
  if (bfDag(new Date()) <= BF_DICHT) { ui.alert('De hoofdprijs wordt pas op maandag 30 november getrokken.'); return; }
  const verslag = bfTab('BF trekking', ['Tijdstip', 'Aantal geldige deelnemers', 'Vingerafdruk lijst (SHA-256)', 'Winnaar ID', 'Bedrijf', 'Naam', 'Email']);
  if (verslag.getLastRow() > 1) { ui.alert('Er is al getrokken. Zie tabblad BF trekking.'); return; }
  const tab = bfTab(BF_TAB, BF_KOPPEN);
  const k = naam => BF_KOPPEN.indexOf(naam);
  const rijen = tab.getLastRow() > 1 ? tab.getRange(2, 1, tab.getLastRow() - 1, BF_KOPPEN.length).getValues() : [];
  const geldig = rijen.filter(r => r[k('Status')] === 'Geldig' && r[k('ID')]);
  if (!geldig.length) { ui.alert('Geen geldige deelnemers.'); return; }
  if (ui.alert('Hoofdprijs trekken uit ' + geldig.length + ' geldige deelnemers?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  const nu = new Date();
  const hex = bytes => bytes.map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
  const lijst = geldig.map(r => r[k('ID')]).join(',');
  const vingerafdruk = hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, lijst));
  const lot = hex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, vingerafdruk + nu.getTime() + Math.random()));
  const w = geldig[parseInt(lot.slice(0, 12), 16) % geldig.length];
  verslag.appendRow([nu, geldig.length, vingerafdruk, w[k('ID')], w[k('Bedrijf')], w[k('Naam')], w[k('Email')]]);
  ui.alert('Winnaar: ' + w[k('Bedrijf')] + ' (' + w[k('Naam')] + ', ' + w[k('Email')] + ')\nID ' + w[k('ID')]);
}

// Haalt alle rijen met Status "TEST" weg uit tabblad Black Friday (ook aan te roepen via de webhook met type 'bf-opruimen').
function bfVerwijderTests() {
  const tab = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BF_TAB);
  if (!tab || tab.getLastRow() < 2) return 0;
  const status = tab.getRange(2, BF_KOPPEN.indexOf('Status') + 1, tab.getLastRow() - 1, 1).getValues();
  let weg = 0;
  for (let i = status.length - 1; i >= 0; i--) if (status[i][0] === 'TEST') { tab.deleteRow(i + 2); weg++; }
  return weg;
}

// Geplaatst met clasp op 24-11-2026 (Black Friday SPIN THE FUN!)
