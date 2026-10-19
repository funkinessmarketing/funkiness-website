import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 587,
  secure: false,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  auth: {
    user: 'sayhello@funkiness.ai',
    pass: process.env.TITAN_PASSWORD
  }
});

// Welkomstmail per taal. Engels is de standaard, Nederlands als de inschrijver dat kiest.
const WELKOM = {
  en: {
    subject: "Welcome to the FUNky Letter",
    tekst: [
      "Hi there,",
      "You're on the FUNky Letter. From now on you get the latest in marketing and AI, no boring allowed, with a tip you can use the same day.",
      "Nothing to do right now. The next edition lands in this inbox.",
      "Rather read it in Dutch? Reply \"NL\". Every edition has an unsubscribe link at the bottom.",
      "Boring was never the plan.\nDaisy, FUNkiness!\nAI, Social Media & Marketing, Curaçao\nhttps://funkiness.ai"
    ]
  },
  nl: {
    subject: 'Welkom bij de FUNky Letter',
    tekst: [
      "Hoi,",
      "Je staat op de FUNky Letter. Vanaf nu krijg je het laatste marketing- en AI-nieuws, zonder saaie stukken, met een tip die je dezelfde dag nog gebruikt.",
      "Je hoeft nu niks te doen. De volgende editie komt vanzelf in deze inbox.",
      "Toch liever in het Engels? Antwoord \"EN\". Onder elke editie staat een afmeldlink.",
      "Boring was never the plan.\nDaisy, FUNkiness!\nAI, Social Media & Marketing, Curaçao\nhttps://funkiness.ai/nl/"
    ]
  }
};

// Brevo: lijst "FUNky Letter" (id 3), velden TAAL (EN/NL) en BRON. Brevo regelt de afmeldlink in elke editie.
const BREVO_LIJST = 3;
const brevo = (pad, body) => fetch('https://api.brevo.com/v3' + pad, {
  method: 'POST',
  headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
  body: JSON.stringify(body)
}).then(async r => { if (!r.ok) throw new Error(pad + ' ' + r.status + ' ' + (await r.text()).slice(0, 200)); return true; });

const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, taal, bron, honeypot } = req.body || {};

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  const adres = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(adres) || adres.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid email.' });
  }

  const lang = taal === 'nl' ? 'nl' : 'en';
  const w = WELKOM[lang];

  // Elke inschrijving in de sheet (tabblad Nieuwsbrief), los van of de mail lukt
  const naarSheet = process.env.GSHEET_WEBHOOK_URL
    ? fetch(process.env.GSHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'nieuwsbrief', email: adres, taal: lang, bron: String(bron || '').slice(0, 100) })
      }).then(r => r.ok)
    : Promise.resolve(false);

  const naarBrevo = process.env.BREVO_API_KEY
    ? brevo('/contacts', {
        email: adres,
        attributes: { TAAL: lang.toUpperCase(), BRON: String(bron || '').slice(0, 100) },
        listIds: [BREVO_LIJST],
        updateEnabled: true
      })
    : Promise.resolve(false);

  const tekst = w.tekst.join('\n\n');
  const html = w.tekst.map(p => `<p style="font-family:Arial,sans-serif;font-size:16px;line-height:1.5;color:#3a251b;margin:0 0 16px">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  // Welkomstmail via Brevo (ondertekend met DKIM van funkiness.ai), anders via de eigen mailserver
  const viaTitan = () => mailer.sendMail({
    from: '"Daisy from FUNkiness!" <sayhello@funkiness.ai>', to: adres, bcc: 'sayhello@funkiness.ai',
    subject: w.subject, text: tekst, html
  });
  const welkom = process.env.BREVO_API_KEY
    ? brevo('/smtp/email', {
        sender: { name: 'Daisy from FUNkiness!', email: 'sayhello@funkiness.ai' },
        to: [{ email: adres }], bcc: [{ email: 'sayhello@funkiness.ai' }],
        replyTo: { email: 'sayhello@funkiness.ai' },
        subject: w.subject, textContent: tekst, htmlContent: html, tags: ['funky-letter-welkom']
      }).catch(err => { console.error('Brevo welkom error:', err.message); return viaTitan(); })
    : viaTitan();

  // Vercel breekt alles af wat na het antwoord nog loopt, dus eerst afwachten
  const [sheet, contact, mail] = await Promise.allSettled([naarSheet, naarBrevo, welkom]);
  if (sheet.status === 'rejected' || sheet.value === false) console.error('Nieuwsbrief sheet error:', sheet.reason?.message || 'geen ok');
  if (contact.status === 'rejected') console.error('Brevo contact error:', contact.reason?.message);
  if (mail.status === 'rejected') console.error('Nieuwsbrief mail error:', mail.reason?.message);

  const opgeslagen = (sheet.status === 'fulfilled' && sheet.value) || (contact.status === 'fulfilled' && contact.value) || mail.status === 'fulfilled';
  if (!opgeslagen) {
    return res.status(500).json({ success: false, error: 'Could not save your signup.' });
  }
  return res.status(200).json({ success: true });
}
