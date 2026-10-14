import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import { berekenScores, SECTOREN, LOCATIES, leesWebsite, feitenVoor, feitenAlsTekst, antwoordenAlsTekst, REGELS_GEEN_VERZINSELS, feitenBlok, schoonTekst, verzonnenGetallen, controleerRapport, extraKanalenGeldig } from './_scan-vragen.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, locatie, site, antwoorden, honeypot } = req.body;
  const scores = berekenScores('social', antwoorden);

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !email || !scores || !LOCATIES[locatie] || !extraKanalenGeldig(antwoorden.other_channels)) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  if (!email.includes('@') || bedrijf.length > 200 || naam?.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid input.' });
  }

  // Sheets leest '+5999...' als formule (#ERROR!), apostrof maakt het tekst
  const alsTekst = v => v ? `'${v}` : v;
  const esc = v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Elke aanvraag krijgt een id; de sheet vult later op dezelfde rij score, status en rapport in
  const scanId = randomUUID();
  const naarSheet = data => process.env.GSHEET_WEBHOOK_URL
    ? fetch(process.env.GSHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: scanId, ...data })
      }).catch(err => console.error('Sheet log error:', err.message))
    : Promise.resolve();
  // Alleen het nieuwe sheetscript antwoordt 'ok-v2'; bij het oude script geen vervolgberichten (die zouden lege rijen geven)
  const sheetAanvraag = naarSheet({ type: 'social', bedrijf, sector, locatie, naam, functie, email, telefoon: alsTekst(telefoon), telefoon_nl: alsTekst(telefoon_nl), instagram, website: site })
    .then(r => r?.text?.())
    .then(t => t?.trim() === 'ok-v2')
    .catch(() => false);

  // Homepage van de klant lezen terwijl de sheet-logging loopt
  const websiteInhoud = await leesWebsite(site);

  const sectorInfo = SECTOREN[sector] || SECTOREN.anders;
  const sectorLabel = sectorInfo.prompt;
  const locatieInfo = LOCATIES[locatie];
  const groep = `${sectorInfo.groep} ${locatieInfo.in}`;
  const feiten = feitenVoor('social', sector, locatie);

  const bioSection = bio && bio.trim()
    ? `Their current profile bio (analyze this critically):\n"${bio.trim()}"`
    : 'Instagram bio: not provided';

  const totaalscore = Math.round((scores.platforms + scores.instagram + scores.engagement + scores.content) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = { platforms: 'Platforms & Reach', instagram: 'Video & Profile', engagement: 'Engagement', content: 'Content' }[lowestCat];


  const prompt = `You are a sharp, direct social media expert at FUNkiness!, an AI, social media & marketing agency based on Curaçao. You write a short social media scan report for a business based ${locatieInfo.in}.

${REGELS_GEEN_VERZINSELS}

FACTS (shown separately in the report; only choose which ones fit this business in chosen_facts, do not repeat them in your text):
${feitenAlsTekst(feiten)}

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}
Location: ${locatieInfo.naam}
Instagram/TikTok handle: ${instagram || 'not provided'}
${bioSection}
${websiteInhoud ? `Their website (homepage text, fetched just now):\n${websiteInhoud}\n` : 'Website: not provided or not reachable\n'}
THEIR ANSWERS (quote these exactly, never change them):
${antwoordenAlsTekst('social', antwoorden)}

SCORES (0-100, calculated from their answers):
- Platforms & Reach: ${scores.platforms}
- Video & Profile: ${scores.instagram}
- Engagement: ${scores.engagement}
- Content: ${scores.content}
- Overall: ${totaalscore}
- Lowest scoring area: ${lowestLabel}
Do not compare these scores to other businesses or invent averages.

TONE:
- English only
- Direct, bold, honest but always positive. Frame everything from opportunity
- Never use "premium" or "luxury"
- FUNkiness! brand voice: confident, a little cheeky, never corporate
- Always mention ${bedrijf} by name
- If their website text is provided, use one concrete detail from it in the intro so it is clear we actually looked. If not, do not mention the website

Call the submit_scan_report tool. Follow the field descriptions exactly.`;

  const reportTool = {
    name: 'submit_scan_report',
    description: 'Submit the completed social media scan report.',
    input_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string', description: `2 sharp sentences about ${bedrijf}, based only on their answers and, if provided, their website or bio.` },
        whats_working: { type: 'string', description: '1-2 playful, encouraging sentences about one thing they are genuinely doing well, based on their answers.' },
        platforms_feedback: { type: 'string', description: '2 sentences about their platforms, posting frequency and audience growth. Based only on their answers, plus advice.' },
        instagram_feedback: { type: 'string', description: '2 sentences about short video, Stories and where their profile sends people. Based only on their answers, plus advice.' },
        engagement_feedback: { type: 'string', description: '2 sentences about engagement rate and reply speed. Based only on their answers, plus advice.' },
        content_feedback: { type: 'string', description: '2 sentences about content type, content plan and whether customers post about them. Based only on their answers, plus advice.' },
        bio_feedback: { type: 'string', description: bio && bio.trim() ? 'Based only on the bio text provided: name the problem clearly and give 1 directional tip. Do NOT write the new bio.' : 'Leave as an empty string, no bio was provided.' },
        top_quickwin: { type: 'string', description: `The single best quick win for ${bedrijf}, based on their answers. Explain it as advice based on their answers. Genuinely useful.` },
        teaser_wins: { type: 'string', description: `Name two areas from their answers that FUNkiness! would dig into together in a conversation, without explaining them. Never mention a full report or anything they have not received.` },
        chosen_facts: { type: 'array', items: { type: 'string', enum: feiten.map(f => f.id) }, maxItems: 3, description: 'The ids of the 2 or 3 facts from the FACTS list that are most relevant for this business, most relevant first.' },
        do_today: { type: 'string', description: `One ultra-specific action ${bedrijf} can take in 20 minutes. It must be a different action than the top quick win.` },
        cta_dynamic: { type: 'string', description: `A personal, direct invitation to talk about their ${lowestLabel} specifically. Not a sales pitch. An open door.` }
      },
      required: ['intro', 'whats_working', 'platforms_feedback', 'instagram_feedback', 'engagement_feedback', 'content_feedback', 'bio_feedback', 'top_quickwin', 'teaser_wins', 'chosen_facts', 'do_today', 'cta_dynamic']
    }
  };

  try {
    // Schrijven, en één keer opnieuw als er getallen in staan die nergens vandaan komen
    const schrijf = async (inhoud) => {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1800,
        tools: [reportTool],
        tool_choice: { type: 'tool', name: 'submit_scan_report' },
        messages: [{ role: 'user', content: inhoud }]
      });
      const toolUse = message.content.find(block => block.type === 'tool_use');
      if (!toolUse) throw new Error('No tool_use block in response');
      return toolUse.input;
    };
    let ruw = await schrijf(prompt);
    const verzonnen = verzonnenGetallen(ruw, prompt);
    if (verzonnen.length) {
      console.warn('Verzonnen getallen, opnieuw:', verzonnen);
      ruw = await schrijf(`${prompt}\n\nIMPORTANT: a previous draft used these numbers that do not appear in their answers, their website or the FACTS list: ${verzonnen.join(', ')}. Do not use them. Only use numbers that appear above.`);
    }

    // Strenge controle: elke zin moet uit antwoorden, website of feitenlijst volgen
    ruw = await controleerRapport({
      client, model: 'claude-sonnet-5-5', reportTool,
      antwoordenTekst: antwoordenAlsTekst('social', antwoorden),
      websiteInhoud, bio: bio, concept: ruw
    });

    const out = Object.fromEntries(Object.entries(ruw).map(([k, v]) => [k, typeof v === 'string' ? schoonTekst(v.replace(/\[F\d+\]/g, '')) : v]));
    // Feiten letterlijk uit de bronnenlijst, niet uit de AI-tekst
    const { items: weetjes, bronnen } = feitenBlok(out.chosen_facts, feiten);
    const rapport = {
      intro: out.intro,
      whats_working: out.whats_working,
      platforms: { score: scores.platforms, feedback: out.platforms_feedback },
      instagram: { score: scores.instagram, feedback: out.instagram_feedback },
      engagement: { score: scores.engagement, feedback: out.engagement_feedback },
      content: { score: scores.content, feedback: out.content_feedback },
      bio_feedback: out.bio_feedback,
      top_quickwin: out.top_quickwin,
      teaser_wins: out.teaser_wins,
      feiten: weetjes,
      fomo: weetjes.map(w => `${w.tekst} [${w.nr}]`).join(' '),
      do_today: out.do_today,
      cta_dynamic: out.cta_dynamic,
      totaalscore,
      bronnen
    };

    // Email to user with key findings
    // Mails afwachten: Vercel stopt de functie zodra het antwoord terug is
    const mails = [];
    if (process.env.TITAN_PASSWORD) {
      mails.push(mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Social Media Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:26px;color:#3a251b;margin-bottom:8px">Hey ${esc(naam)},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">${rapport.intro}</p>
            <div style="text-align:center;background:#f21b7a;color:white;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="font-size:48px;font-weight:900;line-height:1">${rapport.totaalscore}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.9">Overall Score / 100</div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">What's working</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.whats_working}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:12px">Your scores, by category</div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Platforms &amp; Reach, ${rapport.platforms.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.platforms.feedback}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Video &amp; Profile, ${rapport.instagram.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.instagram.feedback}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Engagement, ${rapport.engagement.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.engagement.feedback}</p>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700;color:#3a251b">Content, ${rapport.content.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.content.feedback}</p>
              </div>
            </div>
            ${bio && bio.trim() ? `
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your bio</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.bio_feedback}</p>
            </div>` : ''}
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 Quick Win</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.top_quickwin}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">2 more wins we spotted</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.teaser_wins}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Worth knowing</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.fomo}</p>
            </div>
            <div style="background:#3a251b;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Do this today</div>
              <p style="font-size:15px;line-height:1.6;margin:0;opacity:0.9">${rapport.do_today}</p>
            </div>
            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:20px">${rapport.cta_dynamic}</p>
            ${rapport.bronnen.length ? `<div style="font-size:12px;color:#888;line-height:1.6;margin-top:16px"><strong>Sources</strong><br>${rapport.bronnen.map(b => `[${b.nr}] <a href="${b.url}" style="color:#888">${esc(b.bron)}</a>`).join('<br>')}</div>` : ''}
            <div style="text-align:center;margin-bottom:32px">
              <a href="https://wa.me/59996751737" style="display:inline-block;background:#f21b7a;color:white;padding:14px 32px;border-radius:99px;font-size:15px;font-weight:700;text-decoration:none">
                Say hello on WhatsApp →
              </a>
            </div>
            <p style="font-size:13px;color:#aaa;margin-top:24px;text-align:center">FUNkiness! AI, Social Media & Marketing. Curaçao.<br>Questions? Reply to this email or WhatsApp: +5999 675 1737</p>
          </div>
        `
      }).catch(err => console.error('User email error:', err.message)));
    }

    // Lead email to FUNkiness!
    if (process.env.TITAN_PASSWORD) {
      const sectorNaam = sectorInfo.naam;

      mails.push(mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        replyTo: email,
        subject: `Nieuwe scan: ${bedrijf}, score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#f21b7a;font-family:sans-serif">Nieuwe Social Media Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin-bottom:24px">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${esc(bedrijf)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Locatie</td><td style="padding:8px;border:1px solid #eee">${esc(locatieInfo.naam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${esc(sectorNaam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${esc(naam) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${esc(functie) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${esc(site) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon_nl) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Instagram</td><td style="padding:8px;border:1px solid #eee">${esc(instagram) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;font-size:16px">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:22px;font-weight:bold;color:#f21b7a">${rapport.totaalscore}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Scores</h3>
            <ul style="margin-bottom:20px">
              <li>Platforms & Reach: <strong>${rapport.platforms.score}/100</strong>, ${rapport.platforms.feedback}</li>
              <li>Video &amp; Profile: <strong>${rapport.instagram.score}/100</strong>, ${rapport.instagram.feedback}</li>
              <li>Engagement: <strong>${rapport.engagement.score}/100</strong>, ${rapport.engagement.feedback}</li>
              <li>Content: <strong>${rapport.content.score}/100</strong>, ${rapport.content.feedback}</li>
            </ul>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Intro (wat de klant ziet)</h3>
            <p style="background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:16px">${rapport.intro}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">What's working</h3>
            <p style="margin-bottom:16px">${rapport.whats_working}</p>
            ${bio ? `<h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Bio (ingevuld door klant)</h3><p style="background:#f5f5f5;padding:12px;border-radius:8px;font-style:italic;margin-bottom:8px">${esc(bio)}</p><p style="margin-bottom:16px">${rapport.bio_feedback || ''}</p>` : ''}
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Top quick win</h3>
            <p style="margin-bottom:16px">${rapport.top_quickwin}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Teaser wins</h3>
            <p style="margin-bottom:16px">${rapport.teaser_wins}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Worth knowing</h3>
            <p style="margin-bottom:16px">${rapport.fomo}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Do today</h3>
            <p style="margin-bottom:16px">${rapport.do_today}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">CTA (dynamisch)</h3>
            <p>${rapport.cta_dynamic}</p>
            ${rapport.bronnen.length ? `<div style="font-size:12px;color:#888;line-height:1.6;margin-top:16px"><strong>Sources</strong><br>${rapport.bronnen.map(b => `[${b.nr}] <a href="${b.url}" style="color:#888">${esc(b.bron)}</a>`).join('<br>')}</div>` : ''}
          </div>
        `
      }).catch(err => console.error('Lead email error:', err.message)));
    }

    const sheetRapport = sheetAanvraag.then(v2 => v2 && naarSheet({ actie: 'rapport', score: rapport.totaalscore, rapport: rapportAlsTekst(rapport) }));
    await Promise.allSettled([...mails, sheetRapport]);

    res.json({ success: true, rapport, bedrijf, naam, functie });

  } catch (err) {
    console.error(err);
    const meldingen = [sheetAanvraag.then(v2 => v2 && naarSheet({ actie: 'fout', fout: err.message }))];
    if (process.env.TITAN_PASSWORD) {
      meldingen.push(mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        replyTo: email,
        subject: `Scan MISLUKT: ${bedrijf}, neem zelf contact op`,
        html: `
          <div style="font-family:sans-serif">
            <h2 style="color:#f21b7a">Social Media Scan mislukt</h2>
            <p>De klant kreeg een foutmelding en heeft geen rapport gezien. Contactgegevens:</p>
            <p>Bedrijf: ${esc(bedrijf)}<br>Naam: ${esc(naam)}<br>Functie: ${esc(functie)}<br>Website: ${esc(site)}<br>Email: ${esc(email)}<br>Telefoon (CW): ${esc(telefoon)}<br>Telefoon (NL): ${esc(telefoon_nl)}<br>Instagram: ${esc(instagram)}</p>
            <p style="color:#888">Fout: ${esc(err.message)}</p>
          </div>
        `
      }).catch(e => console.error('Fail email error:', e.message)));
    }
    await Promise.allSettled(meldingen);
    res.status(500).json({ success: false, error: 'Scan could not be generated. Please try again.' });
  }
}

function rapportAlsTekst(r) {
  const cats = Object.entries(r).filter(([, v]) => v && typeof v === 'object' && 'score' in v);
  return [
    `Totaalscore: ${r.totaalscore}/100`,
    ...cats.map(([k, v]) => `${k}: ${v.score}/100. ${v.feedback}`),
    `Intro: ${r.intro}`,
    `What's working: ${r.whats_working}`,
    r.bio_feedback ? `Bio: ${r.bio_feedback}` : '',
    `Quick win: ${r.top_quickwin}`,
    `Teaser wins: ${r.teaser_wins}`,
    `Feiten: ${r.fomo}`,
    `Do today: ${r.do_today}`,
    `CTA: ${r.cta_dynamic}`,
    r.bronnen?.length ? `Bronnen: ${r.bronnen.map(b => `[${b.nr}] ${b.bron} ${b.url}`).join(' | ')}` : ''
  ].filter(Boolean).join('\n\n');
}
