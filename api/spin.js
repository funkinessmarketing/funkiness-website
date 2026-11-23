// Black Friday 2026, SPIN THE FUN!: registratie + draai.
// 1. controleert het formulier, 2. laat het sheet-script de prijs trekken (onder lock, met dubbelcheck),
// 3. stuurt de prijsmail via Brevo (terugval: eigen mailserver), 4. geeft de prijs terug aan het rad.
import nodemailer from 'nodemailer';
import { PRIJZEN, SOS_TERMIJN } from './_bf-prijzen.js';

const SITE = 'https://www.funkiness.ai';
const VOORWAARDEN = SITE + '/black-friday-terms';

const mailer = nodemailer.createTransport({
  host: 'smtpout.secureserver.net', port: 587, secure: false,
  connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
  auth: { user: 'sayhello@funkiness.ai', pass: process.env.TITAN_PASSWORD }
});

const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const schoon = (v, max) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

// Curaçao-nummer: +599 9 + 7 cijfers. Lokaal getypt (9xxx xxxx) mag ook.
export function curacaoNummer(v) {
  let c = String(v || '').replace(/\D/g, '');
  if (c.startsWith('00')) c = c.slice(2);
  if (c.length === 8 && c.startsWith('9')) c = '599' + c;
  return /^5999\d{7}$/.test(c) ? '+' + c : null;
}

export function controleer(b) {
  const fout = [];
  const d = {
    naam: schoon(b.naam, 80), bedrijf: schoon(b.bedrijf, 100), email: schoon(b.email, 200).toLowerCase(),
    whatsapp: curacaoNummer(b.whatsapp), kanaal: schoon(b.kanaal, 200), kvk: schoon(b.kvk, 20),
    bron: schoon(b.bron, 60), campagne: schoon(b.campagne, 60)
  };
  if (d.naam.length < 2) fout.push('naam');
  if (d.bedrijf.length < 2) fout.push('bedrijf');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) fout.push('email');
  if (!d.whatsapp) fout.push('whatsapp');
  if (d.kanaal.length < 3 || !/[a-z0-9]/i.test(d.kanaal)) fout.push('kanaal');
  if (b.curacao !== true) fout.push('curacao');
  if (b.voorwaarden !== true) fout.push('voorwaarden');
  return { d, fout };
}

export function prijsMail(d, id, prijsId) {
  const p = PRIJZEN[prijsId];
  const titel = p.onthulling ? p.naam + ': ' + p.onthulling : p.naam;
  const regels = [
    'Hi ' + d.naam.split(' ')[0] + ',',
    'The wheel has spoken. You won: ' + titel + '.',
    p.kort,
    p.download
      ? 'Download it here:\n' + SITE + p.download
      : 'We will review ' + d.kanaal + ' and send your Marketing SOS ' + SOS_TERMIJN + '. Nothing to do right now. Want us to look at a different website, Instagram or Facebook page? Just reply to this email with the link.',
    'And there is more: you are automatically in the draw for THE ULTIMATE FUNky MAKEOVER, a creative makeover of one of your social media posts or ads. We draw one winner on Monday, November 30, 2026 and email the winner.',
    'Your entry ID: ' + id + '\nTerms: ' + VOORWAARDEN,
    'Boring was never the plan.\nFUNkiness!\n' + SITE
  ];
  const html = regels.map(r => `<p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#3a251b;margin:0 0 16px">${esc(r).replace(/\n/g, '<br>').replace(/(https:\/\/[^\s<]+)/g, '<a href="$1" style="color:#f21b7a">$1</a>')}</p>`).join('');
  return { onderwerp: 'You spun. You won: ' + p.naam, tekst: regels.join('\n\n'), html };
}

async function stuurMail(aan, m) {
  if (process.env.BREVO_API_KEY) {
    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { name: 'FUNkiness!', email: 'sayhello@funkiness.ai' }, to: [{ email: aan }],
          replyTo: { email: 'sayhello@funkiness.ai' }, subject: m.onderwerp,
          textContent: m.tekst, htmlContent: m.html, tags: ['black-friday-2026']
        })
      });
      if (r.ok) return true;
      console.error('Brevo BF-mail', r.status, (await r.text()).slice(0, 200));
    } catch (err) { console.error('Brevo BF-mail', err.message); }
  }
  if (!process.env.TITAN_PASSWORD) return false;
  await mailer.sendMail({ from: '"FUNkiness!" <sayhello@funkiness.ai>', to: aan, subject: m.onderwerp, text: m.tekst, html: m.html });
  return true;
}

// Meta Conversions API: 'Lead' voor een geldige deelname, alleen als de bezoeker cookies accepteerde.
// Geen e-mail of telefoon naar Meta; wel IP, browser en de klik-id, zodat Meta de advertentie kan koppelen.
// event_id = deelname-ID, gelijk aan de pixel in de browser, dus Meta telt hem maar één keer.
// Nodig in Vercel: META_PIXEL_ID en META_CAPI_TOKEN. Zonder die twee gebeurt er niets.
async function metaLead(req, b, id) {
  if (b.toestemming !== true || !process.env.META_PIXEL_ID || !process.env.META_CAPI_TOKEN) return 'uit';
  const user_data = {
    client_ip_address: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: String(req.headers['user-agent'] || '').slice(0, 400) || undefined
  };
  if (/^fb\.\d\.\d+\.[\w-]+$/.test(b.fbc || '')) user_data.fbc = b.fbc;
  if (/^fb\.\d\.\d+\.\d+$/.test(b.fbp || '')) user_data.fbp = b.fbp;
  const r = await fetch(`https://graph.facebook.com/v26.0/${process.env.META_PIXEL_ID}/events?access_token=${encodeURIComponent(process.env.META_CAPI_TOKEN)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [{
      event_name: 'Lead', event_time: Math.floor(Date.now() / 1000), event_id: id,
      action_source: 'website', event_source_url: SITE + '/black-friday', user_data
    }] })
  });
  if (!r.ok) throw new Error('CAPI ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return 'ok';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const b = req.body || {};
  if (b.honeypot) return res.status(400).json({ success: false, error: 'Invalid submission.' });

  const { d, fout } = controleer(b);
  if (fout.length) return res.status(400).json({ success: false, velden: fout });
  if (!process.env.GSHEET_WEBHOOK_URL) return res.status(503).json({ success: false, error: 'Not available.' });

  let uitslag;
  try {
    const r = await fetch(process.env.GSHEET_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bf-spin', ...d })
    });
    uitslag = JSON.parse(await r.text());
  } catch (err) {
    console.error('BF sheet error:', err.message);
    return res.status(502).json({ success: false, error: 'The wheel is stuck. Please try again in a minute.' });
  }

  if (uitslag.status === 'nog-niet' || uitslag.status === 'gesloten') {
    return res.status(200).json({ success: false, status: uitslag.status });
  }
  const p = PRIJZEN[uitslag.prijs];
  if (!p) return res.status(502).json({ success: false, error: 'The wheel is stuck. Please try again in a minute.' });
  const antwoord = { prijs: uitslag.prijs, naam: p.naam, onthulling: p.onthulling || null, kort: p.kort, download: p.download };

  if (uitslag.status === 'dubbel') {
    return res.status(200).json({ success: true, dubbel: true, ...antwoord });
  }

  // Vercel breekt alles af wat na het antwoord nog loopt, dus de mail eerst afwachten
  const [m, capi] = await Promise.allSettled([
    stuurMail(d.email, prijsMail(d, uitslag.id, uitslag.prijs)),
    metaLead(req, b, uitslag.id)
  ]);
  const mail = m.status === 'fulfilled' && m.value;
  if (m.status === 'rejected') console.error('BF mail error:', m.reason?.message);
  if (capi.status === 'rejected') console.error('BF CAPI error:', capi.reason?.message);

  return res.status(200).json({ success: true, id: uitslag.id, mail, ...antwoord });
}
