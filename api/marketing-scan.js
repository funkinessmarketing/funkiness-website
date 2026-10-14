import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import { berekenScores, SECTOREN, leesWebsite } from './_scan-vragen.js';

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

const CURACAO_MARKETING_CONTEXT = `
CURAÇAO BUSINESS & MARKETING CONTEXT. Only use facts from this list. Do not invent statistics.

CURAÇAO OVERVIEW:
- Curaçao welcomed 582,409 stay-over visitors in 2023, a record year (Curaçao Tourist Board, January 2024)
- The US, Netherlands and Germany are the top three source markets for stay-over tourism

DIGITAL BEHAVIOR ON CURAÇAO (structural, verified):
- WhatsApp is the primary communication channel on Curaçao
- The majority of web and social traffic is mobile. Desktop usage is minimal
- Word-of-mouth and WhatsApp referrals remain dominant lead sources for most local businesses
- Google Business Profile is widely underused by local businesses, those who optimize it gain a clear visibility advantage
- More people ask AI assistants such as ChatGPT for local recommendations. A website that clearly states what a business does, where, and for whom makes it easier for these assistants to mention that business. Do not claim percentages about this
- Responding to online reviews shows future customers that a business is active and cares

VERIFIED MARKETING BEST PRACTICES:
- Businesses with a documented strategy, even a basic one, are more consistent and waste less budget on reactive spending
- Customer retention is typically more cost-effective than acquisition. Loyalty and follow-up communication are underused on Curaçao
- A consistent visual brand identity builds faster recognition in a small, word-of-mouth driven market like Curaçao
- Mobile-optimized websites are essential given the mobile-first behavior of both local and tourist audiences
- Knowing your ideal customer is the foundation of every effective marketing decision, channel selection, messaging, and budget allocation all depend on it
- Google Business Profile optimization directly impacts local search visibility and is a low-effort, high-impact action

WHAT NOT TO CLAIM:
- Do not cite specific ROI or conversion rate percentages
- Do not make claims about specific competitors on Curaçao
- Do not cite specific ad spend amounts
- Do not cite specific email open rates or engagement benchmarks
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, site, antwoorden, honeypot } = req.body;
  const scores = berekenScores('marketing', antwoorden);

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !email || !scores) {
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
  const sheetAanvraag = naarSheet({ type: 'marketing', bedrijf, sector, naam, functie, email, telefoon: alsTekst(telefoon), telefoon_nl: alsTekst(telefoon_nl), website: site })
    .then(r => r?.text?.())
    .then(t => t?.trim() === 'ok-v2')
    .catch(() => false);

  // Homepage van de klant lezen terwijl de sheet-logging loopt
  const websiteInhoud = await leesWebsite(site);

  const sectorInfo = SECTOREN[sector] || SECTOREN.anders;
  const sectorLabel = sectorInfo.prompt;
  const groep = sectorInfo.groep;

  const totaalscore = Math.round((scores.brand + scores.audience + scores.channels + scores.strategy) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = {
    brand:    'Brand & Positioning',
    audience: 'Audience & Market',
    channels: 'Channels & Reach',
    strategy: 'Strategy & Execution'
  }[lowestCat];


  const prompt = `You are a sharp, direct marketing strategist at FUNkiness!, an AI & marketing agency on Curaçao. You analyze marketing strategy for businesses on the island.

${CURACAO_MARKETING_CONTEXT}

OVERALL SCORE: ${bedrijf} scored ${totaalscore}/100. Do not compare this score to other businesses or invent averages.

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}
${websiteInhoud ? `Their website (homepage text, fetched just now):\n${websiteInhoud}\n` : 'Website: not provided or not reachable\n'}
SCAN RESULTS:
${Object.entries(antwoorden).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

SCORES (0-100):
- Brand & Positioning: ${scores.brand}
- Audience & Market: ${scores.audience}
- Channels & Reach: ${scores.channels}
- Strategy & Execution: ${scores.strategy}
- Lowest scoring area: ${lowestLabel}

INSTRUCTIONS:
Write a sharp, personalized marketing strategy scan report for ${bedrijf}. Follow every rule below exactly.

TONE:
- English only
- Direct, bold, honest but always positive. Frame everything from opportunity
- Never use an em dash. Never use "premium" or "luxury"
- FUNkiness! brand voice: confident, a little cheeky, never corporate
- Always mention ${bedrijf} by name
- If their website text is provided, use one concrete detail from it in the intro so it is clear we actually looked. Never invent details about the website. If no website text is provided, do not mention the website

STRUCTURE RULES:
1. WHAT'S WORKING: Find 1 genuine thing ${bedrijf} is doing right. Be specific. Tone: playful and encouraging. Not generic.
2. SCORES: 2 sentences per category. Reference a fact from the market context. No invented percentages.
3. TOP QUICK WIN: Give exactly 1 strong, concrete, immediately actionable quick win. Explain why it works. Only name a source if it appears in the context above. Genuinely useful but does not replace a strategy session.
4. TEASER WINS: Hint at 2 more wins you spotted but don't explain them. Name the area vaguely. Create curiosity without giving the solution.
5. FOMO (positive): 2 sentences about what the fast-moving ${groep} are already doing that ${bedrijf} isn't yet. Positive angle. Make them want to be in that group.
6. DO TODAY: One ultra-specific action they can do in 20 minutes. The first step, not the full solution.
7. DYNAMIC CTA: Personalized to their lowest scoring area (${lowestLabel}). Direct and inviting, not salesy.

Call the submit_scan_report tool with your completed report, following the structure rules above and the field descriptions in the tool schema.`;

  const reportTool = {
    name: 'submit_scan_report',
    description: 'Submit the completed marketing strategy scan report.',
    input_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string', description: `2 sharp sentences about ${bedrijf} specifically. Reference their sector and scan answers. Feel like you looked at their business.` },
        whats_working: { type: 'string', description: '1-2 sentences in a playful, encouraging tone about the 1 thing they are genuinely doing well.' },
        brand_feedback: { type: 'string', description: '2 sentences. Reference a Curaçao market fact about brand or positioning.' },
        audience_feedback: { type: 'string', description: '2 sentences. Reference a fact about knowing your customer or word-of-mouth.' },
        channels_feedback: { type: 'string', description: '2 sentences. Reference a verified channel behavior (Google, WhatsApp, website, mobile).' },
        strategy_feedback: { type: 'string', description: '2 sentences. Reference a fact about planning, budget or tracking.' },
        top_quickwin: { type: 'string', description: `The single best, fully explained quick win for ${bedrijf}. Explain why it works. Genuinely useful but leaves the strategy work for FUNkiness!.` },
        teaser_wins: { type: 'string', description: `We spotted 2 more wins specific to ${bedrijf}. One is about [vague area 1]. The other touches on [vague area 2]. Both need a closer look to execute right.` },
        fomo: { type: 'string', description: `2 sentences. What are the fast-moving ${groep} already doing that ${bedrijf} is not yet? Positive framing.` },
        do_today: { type: 'string', description: `One ultra-specific action ${bedrijf} can take in 20 minutes. The first step, not the full solution.` },
        cta_dynamic: { type: 'string', description: `A personal, direct invitation to talk about their ${lowestLabel} specifically. Not a sales pitch. An open door.` }
      },
      required: ['intro', 'whats_working', 'brand_feedback', 'audience_feedback', 'channels_feedback', 'strategy_feedback', 'top_quickwin', 'teaser_wins', 'fomo', 'do_today', 'cta_dynamic']
    }
  };

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      tools: [reportTool],
      tool_choice: { type: 'tool', name: 'submit_scan_report' },
      messages: [{ role: 'user', content: prompt }]
    });

    const toolUse = message.content.find(block => block.type === 'tool_use');
    if (!toolUse) throw new Error('No tool_use block in response');

    const out = toolUse.input;
    // Geen emdashes in de output, regel is absoluut
    for (const key of Object.keys(out)) {
      if (typeof out[key] === 'string') out[key] = out[key].replace(/\s*\u2014\s*/g, ', ');
    }
    const rapport = {
      intro: out.intro,
      whats_working: out.whats_working,
      brand: { score: scores.brand, feedback: out.brand_feedback },
      audience: { score: scores.audience, feedback: out.audience_feedback },
      channels: { score: scores.channels, feedback: out.channels_feedback },
      strategy: { score: scores.strategy, feedback: out.strategy_feedback },
      top_quickwin: out.top_quickwin,
      teaser_wins: out.teaser_wins,
      fomo: out.fomo,
      do_today: out.do_today,
      cta_dynamic: out.cta_dynamic,
      totaalscore
    };

    // Mails afwachten: Vercel stopt de functie zodra het antwoord terug is
    const mails = [];
    if (process.env.TITAN_PASSWORD) {
      mails.push(mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Marketing Strategy Scan is ready, ${naam}!`,
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
                <div style="font-size:14px;font-weight:700;color:#3a251b">Brand &amp; Positioning, ${rapport.brand.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.brand.feedback}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Audience &amp; Market, ${rapport.audience.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.audience.feedback}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Channels &amp; Reach, ${rapport.channels.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.channels.feedback}</p>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700;color:#3a251b">Strategy &amp; Execution, ${rapport.strategy.score}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${rapport.strategy.feedback}</p>
              </div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 Quick Win</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.top_quickwin}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">2 more wins we spotted</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.teaser_wins}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">What the fast movers are doing</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.fomo}</p>
            </div>
            <div style="background:#3a251b;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Do this today</div>
              <p style="font-size:15px;line-height:1.6;margin:0;opacity:0.9">${rapport.do_today}</p>
            </div>
            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:20px">${rapport.cta_dynamic}</p>
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

    if (process.env.TITAN_PASSWORD) {
      const sectorNaam = sectorInfo.naam;

      mails.push(mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        replyTo: email,
        subject: `Nieuwe marketing scan: ${bedrijf}, score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#f21b7a">Nieuwe Marketing Strategy Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${esc(bedrijf)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${esc(sectorNaam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${esc(naam) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${esc(functie) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${esc(site) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon_nl) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:18px;font-weight:bold;color:#f21b7a">${rapport.totaalscore}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;margin-top:24px;margin-bottom:8px;border-bottom:2px solid #f21b7a;padding-bottom:4px">Scores</h3>
            <ul style="line-height:2">
              <li>Brand & Positioning: <strong>${rapport.brand.score}/100</strong>, ${rapport.brand.feedback}</li>
              <li>Audience & Market: <strong>${rapport.audience.score}/100</strong>, ${rapport.audience.feedback}</li>
              <li>Channels & Reach: <strong>${rapport.channels.score}/100</strong>, ${rapport.channels.feedback}</li>
              <li>Strategy & Execution: <strong>${rapport.strategy.score}/100</strong>, ${rapport.strategy.feedback}</li>
            </ul>
            <h3 style="color:#f21b7a;margin-top:20px">Intro</h3>
            <p>${rapport.intro}</p>
            <h3 style="color:#f21b7a;margin-top:20px">What's working</h3>
            <p>${rapport.whats_working}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Top quick win</h3>
            <p>${rapport.top_quickwin}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Teaser wins</h3>
            <p>${rapport.teaser_wins}</p>
            <h3 style="color:#f21b7a;margin-top:20px">FOMO</h3>
            <p>${rapport.fomo}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Do today</h3>
            <p>${rapport.do_today}</p>
            <h3 style="color:#f21b7a;margin-top:20px">CTA</h3>
            <p>${rapport.cta_dynamic}</p>
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
            <h2 style="color:#f21b7a">Marketing Strategy Scan mislukt</h2>
            <p>De klant kreeg een foutmelding en heeft geen rapport gezien. Contactgegevens:</p>
            <p>Bedrijf: ${esc(bedrijf)}<br>Naam: ${esc(naam)}<br>Functie: ${esc(functie)}<br>Website: ${esc(site)}<br>Email: ${esc(email)}<br>Telefoon (CW): ${esc(telefoon)}<br>Telefoon (NL): ${esc(telefoon_nl)}</p>
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
    `FOMO: ${r.fomo}`,
    `Do today: ${r.do_today}`,
    `CTA: ${r.cta_dynamic}`
  ].filter(Boolean).join('\n\n');
}
