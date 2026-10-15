import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import { berekenScores, SECTOREN, LOCATIES, analyseerWebsite, websiteRegel, contextGeldig, contextAlsTekst, feitenVoor, feitenAlsTekst, antwoordenAlsTekst, REGELS_GEEN_VERZINSELS, feitenBlok, schoonTekst, verzonnenGetallen, controleerRapport, antwoordenSamenvatting, teasers, scoresPerVraag, TIJDZONE } from './_scan-vragen.js';

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

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, locatie, site, antwoorden, context, honeypot } = req.body;
  const scores = berekenScores('marketing', antwoorden, sector);

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !email || !scores || !LOCATIES[locatie] || !contextGeldig(context)) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  if (!email.includes('@') || bedrijf.length > 200 || naam?.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid input.' });
  }

  // Sheets leest '+5999...' als formule (#ERROR!), apostrof maakt het tekst
  const alsTekst = v => v ? `'${v}` : v;
  const br = v => String(v ?? '').replace(/\n/g, '<br>');
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
  const sheetAanvraag = naarSheet({ type: 'marketing', bedrijf, sector, locatie, naam, functie, email, telefoon: alsTekst(telefoon), telefoon_nl: alsTekst(telefoon_nl), website: site })
    .then(r => r?.text?.())
    .then(t => t?.trim() === 'ok-v2')
    .catch(() => false);

  // Homepage van de klant lezen terwijl de sheet-logging loopt
  // Website lezen en objectief doorlichten (één keer ophalen)
  const websiteAnalyse = await analyseerWebsite(site);
  const { inhoud: websiteInhoud, feit: websiteFeit, status: websiteStatus } = websiteAnalyse;

  const sectorInfo = SECTOREN[sector] || SECTOREN.anders;
  const sectorLabel = sectorInfo.prompt;
  const locatieInfo = LOCATIES[locatie];
  const groep = `${sectorInfo.groep} ${locatieInfo.in}`;
  const websitePunten = websiteAnalyse.punten || [];
  const websiteSamenvatting = websiteAnalyse.samenvatting;
  // De code wijst het sterkste contrast aan voor de eye-opener: gemeten verbeterpunt tegenover hun eigen oordeel
  const chatgptDicht = websitePunten.find(p => p.includes('OAI-SearchBot'));
  const eyeHint = chatgptDicht
    ? `EYE-OPENER TO USE: their answer about showing up in ChatGPT is "${antwoorden.ai_visibility}", while our check measured: ${chatgptDicht} [F91].`
    : websitePunten.length
      ? `EYE-OPENER TO USE: their answer about their website is "${antwoorden.website}", while our check measured: ${websitePunten.slice(0, 2).join('; ')} [F91].`
      : '';
  const feiten = [...(websiteFeit ? [websiteFeit] : []), ...feitenVoor('marketing', sector, locatie)];

  const totaalscore = Math.round((scores.brand + scores.audience + scores.channels + scores.strategy) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = {
    brand:    'Brand & Positioning',
    audience: 'Audience & Market',
    channels: 'Channels & Reach',
    strategy: 'Strategy & Execution'
  }[lowestCat];


  const prompt = `You are a sharp, direct marketing strategist at FUNkiness!, an AI, social media & marketing agency based on Curaçao. You write a short marketing strategy scan report for a business based ${locatieInfo.in}.

${REGELS_GEEN_VERZINSELS}

FACTS (shown separately in the report; only choose which ones fit this business in chosen_facts, do not repeat them in your text):
${feitenAlsTekst(feiten)}

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}
Location: ${locatieInfo.naam}
${websiteRegel(site, websiteInhoud, websiteStatus)}
THEIR CONTEXT (use it to make every recommendation fit their goal, audience and capacity; quote their challenge only literally):
${contextAlsTekst(context)}

${websiteFeit ? `MEASURED DATA: fact [F91] contains an objective check of their homepage. In the intro and in Channels (and Brand where it fits), put these measured results next to their own answers, for example their answer about their website or about showing up in ChatGPT, quoting both exactly with [F91]. Where they differ, say so plainly and positively. Only state what was measured; do not claim effects on rankings, traffic or sales. Across the whole report, name at most 2 of the measured points that need attention; never list all checks.\n\n` : ''}${eyeHint ? eyeHint + '\n\n' : ''}THEIR ANSWERS (quote these exactly, never change them):
${antwoordenAlsTekst('marketing', antwoorden)}

SCORES (0-100, calculated from their answers):
- Brand & Positioning: ${scores.brand}
- Audience & Market: ${scores.audience}
- Channels & Reach: ${scores.channels}
- Strategy & Execution: ${scores.strategy}
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
    description: 'Submit the completed marketing strategy scan report.',
    input_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string', description: `3 sharp sentences about ${bedrijf}: what they do (from their website or bio if provided), what their answers show overall, and the biggest gap. Based only on their answers and, if provided, their website.` },
        eye_opener: { type: 'string', description: `The single biggest eye-opener for ${bedrijf}, in 2 short, punchy sentences. Choose in this order: (1) a measured website point from [F91] that contradicts their own answer about their website, quoting both exactly with [F91]; (2) if [F91] says robots.txt blocks OAI-SearchBot, put that next to their answer about showing up in ChatGPT; (3) otherwise their lowest-scoring answer, quoted exactly, next to the FACTS-list fact that relates to it with its [F#]. Never combine two unrelated answers. End with one bold piece of advice. Surprising and positive, never alarming, no promised results.` },
        whats_working: { type: 'string', description: '2 to 3 playful, encouraging sentences about the things they are genuinely doing well, based on their exact answers and, if provided, their website or bio.' },
        brand_feedback: { type: 'string', description: '4 to 6 sentences about positioning, visual consistency and clarity. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' },
        audience_feedback: { type: 'string', description: '4 to 6 sentences about their ideal customer, reviews and knowing where customers come from. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' },
        channels_feedback: { type: 'string', description: '4 to 6 sentences about website, Google Business Profile, AI visibility, WhatsApp/email and ads. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' },
        strategy_feedback: { type: 'string', description: '4 to 6 sentences about plan, budget, tracking and time spent. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' },
        top_quickwin: { type: 'string', description: `The single best quick win for ${bedrijf}, based on their answers. Explain step by step how to do it: 4 to 6 sentences or numbered steps on their own lines, specific to their answers. Genuinely useful.` },
        teaser_wins: { type: 'string', description: `Name two areas from their answers that FUNkiness! would dig into together in a conversation, without explaining them. Never mention a full report or anything they have not received.` },
        campaign_ideas: { type: 'string', description: `Exactly 3 marketing campaign ideas for ${bedrijf}, made for their main goal, their audience and who does their marketing. Each on its own line as "1. [campaign name]: [what to do, on which channel] + the first step". Based only on their answers, website and context. No promised results.` },
        challenge_answer: { type: 'string', description: 'If they described their biggest challenge: 2 to 3 sentences that respond directly to it, quoting it literally, with a concrete first move. If they did not describe one, leave an empty string.' },
        plan_30_days: { type: 'string', description: `A 30-day plan for ${bedrijf}, focused on their lowest scoring areas and their main goal, realistic for who does their marketing, as four lines: "Week 1: ...", "Week 2: ...", "Week 3: ...", "Week 4: ...". Each week one clear focus with 1 or 2 concrete actions, based on their answers. No promised results.` },
        chosen_facts: { type: 'array', items: { type: 'string', enum: feiten.map(f => f.id) }, description: 'The ids of the 2 or 3 facts from the FACTS list that are most relevant for this business, most relevant first.' },
        do_today: { type: 'string', description: `One ultra-specific action ${bedrijf} can take in 20 minutes. It must be a different action than the top quick win.` },
        cta_dynamic: { type: 'string', description: `A personal, direct invitation to talk about their ${lowestLabel} specifically. Not a sales pitch. An open door.` }
      },
      required: ['intro', 'eye_opener', 'whats_working', 'brand_feedback', 'audience_feedback', 'channels_feedback', 'strategy_feedback', 'top_quickwin', 'teaser_wins', 'campaign_ideas', 'challenge_answer', 'plan_30_days', 'chosen_facts', 'do_today', 'cta_dynamic']
    }
  };

  try {
    // Rapport in twee helften tegelijk schrijven: kleiner per aanroep, dus vollediger en sneller
    const alleVelden = Object.keys(reportTool.input_schema.properties);
    const helftA = alleVelden.filter(k => k === 'intro' || k === 'eye_opener' || k === 'whats_working' || k.endsWith('_feedback'));
    const helftB = alleVelden.filter(k => !helftA.includes(k));
    const schrijf = async (velden, extra = '') => {
      const tool = {
        ...reportTool,
        input_schema: {
          type: 'object',
          properties: Object.fromEntries(velden.map(k => [k, reportTool.input_schema.properties[k]])),
          required: velden
        }
      };
      const message = await client.messages.create({
        model: 'claude-haiku-5-5',
        max_tokens: 4000,
        output_config: { effort: 'low' },
        tools: [tool],
        tool_choice: { type: 'tool', name: tool.name },
        messages: [{ role: 'user', content: `${prompt}\n\nThis call writes only these parts of the report: ${velden.join(', ')}. Fill in every one of them.${extra}` }]
      });
      const toolUse = message.content.find(block => block.type === 'tool_use');
      return toolUse ? toolUse.input : {};
    };
    let ruw = Object.assign({}, ...await Promise.all([schrijf(helftA), schrijf(helftB)]));
    // Ontbrekende onderdelen nog één keer opvragen; een rapport met gaten gaat nooit naar buiten
    const verplicht = alleVelden.filter(k => k !== 'chosen_facts');
    let ontbreekt = verplicht.filter(k => typeof ruw[k] !== 'string');
    if (ontbreekt.length) {
      console.warn('Ontbrekende velden, opnieuw:', ontbreekt);
      Object.assign(ruw, await schrijf(ontbreekt));
      ontbreekt = verplicht.filter(k => typeof ruw[k] !== 'string');
      if (ontbreekt.length) throw new Error('Rapport onvolledig: ' + ontbreekt.join(', '));
    }
    // Getallen die nergens vandaan komen gaan mee naar de controleur, die haalt ze weg
    const verzonnen = verzonnenGetallen(ruw, prompt);
    if (verzonnen.length) console.warn('Verdachte getallen:', verzonnen);

    // Strenge controle: elke zin moet uit antwoorden, website of feitenlijst volgen
    ruw = await controleerRapport({
      client, model: 'claude-sonnet-5-5',
      feitenTekst: feitenAlsTekst(feiten), antwoordenTekst: contextAlsTekst(context) + '\n' + antwoordenAlsTekst('marketing', antwoorden),
      websiteInhoud, bio: '', concept: ruw, verdacht: verzonnen
    });

    // Categorie zonder goedgekeurde tekst: samenvatting van hun eigen antwoorden
    for (const cat of ["brand", "audience", "channels", "strategy"]) {
      if (!ruw[`${cat}_feedback`]) ruw[`${cat}_feedback`] = antwoordenSamenvatting('marketing', cat, antwoorden);
    }
    // Geen uitdaging ingevuld: geen blok, ook niet als de AI er toch iets over schrijft
    if (!context.uitdaging?.trim()) ruw.challenge_answer = '';
    const schoon = Object.fromEntries(Object.entries(ruw).map(([k, v]) => [k, typeof v === 'string' ? schoonTekst(v) : v]));
    // Feiten letterlijk uit de bronnenlijst; [F#] in de tekst wordt een bronnummer
    const { items: weetjes, bronnen, velden: out } = feitenBlok(websiteFeit ? ['F91', ...(schoon.chosen_facts || []).filter(id => id !== 'F91')] : schoon.chosen_facts,
      // In het rapport alleen de samenvatting van de website-check; de volledige lijst is voor het gesprek
      feiten.map(f => f.id === 'F91' ? { ...f, tekst: websiteSamenvatting } : f), schoon);
    const rapport = {
      intro: out.intro,
      eye_opener: out.eye_opener,
      whats_working: out.whats_working,
      brand: { score: scores.brand, feedback: out.brand_feedback },
      audience: { score: scores.audience, feedback: out.audience_feedback },
      channels: { score: scores.channels, feedback: out.channels_feedback },
      strategy: { score: scores.strategy, feedback: out.strategy_feedback },
      top_quickwin: out.top_quickwin,
      teaser_wins: out.teaser_wins,
      feiten: weetjes,
      fomo: weetjes.map(w => `${w.tekst} [${w.nr}]`).join(' '),
      campaign_ideas: out.campaign_ideas,
      challenge_answer: out.challenge_answer,
      plan_30_days: out.plan_30_days,
      do_today: out.do_today,
      cta_dynamic: out.cta_dynamic,
      meer: teasers({ websitePunten, aantalVragen: scoresPerVraag('marketing', antwoorden, sector).length }),
      totaalscore,
      bronnen,
      context,
      websiteGemeten: !!websiteFeit
    };

    // Mails afwachten: Vercel stopt de functie zodra het antwoord terug is
    // Volledige analyse alleen voor Daisy (leadmail en sheet)
    const volledigeAnalyse = [...(websitePunten?.length ? ['Website-check, alle punten:', ...websitePunten.map(p => '- ' + p)] : []), 'Punten per vraag:', ...scoresPerVraag('marketing', antwoorden, sector).map(p => '- ' + p)];
    const mails = [];
    if (process.env.TITAN_PASSWORD) {
      mails.push(mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Marketing Strategy Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:26px;color:#3a251b;margin-bottom:8px">Hey ${esc(naam)},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">${br(rapport.intro)}</p>
            <div style="background:#f21b7a;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;opacity:0.9">Your eye-opener</div>
              <p style="font-size:17px;line-height:1.5;font-weight:700;margin:0">${br(rapport.eye_opener)}</p>
            </div>
            <div style="text-align:center;background:#f21b7a;color:white;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="font-size:48px;font-weight:900;line-height:1">${br(rapport.totaalscore)}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.9">Overall Score / 100</div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">What's working</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.whats_working)}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:12px">Your scores, by category</div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Brand &amp; Positioning, ${br(rapport.brand.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.brand.feedback)}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Audience &amp; Market, ${br(rapport.audience.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.audience.feedback)}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Channels &amp; Reach, ${br(rapport.channels.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.channels.feedback)}</p>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700;color:#3a251b">Strategy &amp; Execution, ${br(rapport.strategy.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.strategy.feedback)}</p>
              </div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 Quick Win</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.top_quickwin)}</p>
            </div>
            ${rapport.challenge_answer ? `<div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your challenge</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.challenge_answer)}</p>
            </div>` : ''}
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">3 campaign ideas for you</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.campaign_ideas)}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">2 more wins we spotted</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.teaser_wins)}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Worth knowing</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.fomo)}</p>
            </div>
            <div style="background:#3a251b;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Do this today</div>
              <p style="font-size:15px;line-height:1.6;margin:0;opacity:0.9">${br(rapport.do_today)}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your 30-day plan</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.plan_30_days)}</p>
            </div>
            <div style="background:white;border:2px solid #f21b7a;border-radius:12px;padding:20px 24px;margin-bottom:24px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">We saw more</div>
              <ul style="font-size:15px;line-height:1.6;color:#333;margin:0 0 8px;padding-left:20px">${rapport.meer.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">We walk you through all of it in a free 20-minute call. WhatsApp +599 9 675 1737 or reply to this email.</p>
            </div>
            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:20px">${br(rapport.cta_dynamic)}</p>
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
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Doel</td><td style="padding:8px;border:1px solid #eee">${esc(context.doel)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Publiek</td><td style="padding:8px;border:1px solid #eee">${esc(context.publiek)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Marketing door</td><td style="padding:8px;border:1px solid #eee">${esc(context.wie)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Uitdaging</td><td style="padding:8px;border:1px solid #eee">${esc(context.uitdaging) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Locatie</td><td style="padding:8px;border:1px solid #eee">${esc(locatieInfo.naam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${esc(sectorNaam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${esc(naam) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${esc(functie) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${esc(site) || 'niet opgegeven'}${websiteFeit ? ' (website doorgelicht)' : ''}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon_nl) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:18px;font-weight:bold;color:#f21b7a">${br(rapport.totaalscore)}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;margin-top:24px;margin-bottom:8px;border-bottom:2px solid #f21b7a;padding-bottom:4px">Scores</h3>
            <ul style="line-height:2">
              <li>Brand & Positioning: <strong>${br(rapport.brand.score)}/100</strong>, ${br(rapport.brand.feedback)}</li>
              <li>Audience & Market: <strong>${br(rapport.audience.score)}/100</strong>, ${br(rapport.audience.feedback)}</li>
              <li>Channels & Reach: <strong>${br(rapport.channels.score)}/100</strong>, ${br(rapport.channels.feedback)}</li>
              <li>Strategy & Execution: <strong>${br(rapport.strategy.score)}/100</strong>, ${br(rapport.strategy.feedback)}</li>
            </ul>
            <h3 style="color:#f21b7a;margin-top:20px">Intro</h3>
            <p>${br(rapport.intro)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">What's working</h3>
            <p>${br(rapport.whats_working)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Top quick win</h3>
            <p>${br(rapport.top_quickwin)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Teaser wins</h3>
            <p>${br(rapport.teaser_wins)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Worth knowing</h3>
            <p>${br(rapport.fomo)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">Do today</h3>
            <p>${br(rapport.do_today)}</p>
            <h3 style="color:#f21b7a">Uitdaging (antwoord)</h3>
            <p>${br(rapport.challenge_answer) || '-'}</p>
            <h3 style="color:#f21b7a">3 campagne-ideeën</h3>
            <p>${br(rapport.campaign_ideas)}</p>
            <h3 style="color:#f21b7a">30-dagenplan</h3>
            <p>${br(rapport.plan_30_days)}</p>
            <h3 style="color:#f21b7a;margin-top:20px">CTA</h3>
            <p>${br(rapport.cta_dynamic)}</p>
            <h3 style="color:#f21b7a">Eye-opener</h3>
            <p>${br(rapport.eye_opener)}</p>
            <h3 style="color:#f21b7a">Volledige analyse (alleen voor jou, niet in het klantrapport)</h3>
            <p style="background:#fff4f9;padding:12px;border-radius:8px">${volledigeAnalyse.map(esc).join('<br>')}</p>
            ${rapport.bronnen.length ? `<div style="font-size:12px;color:#888;line-height:1.6;margin-top:16px"><strong>Sources</strong><br>${rapport.bronnen.map(b => `[${b.nr}] <a href="${b.url}" style="color:#888">${esc(b.bron)}</a>`).join('<br>')}</div>` : ''}
          </div>
        `
      }).catch(err => console.error('Lead email error:', err.message)));
    }

    const sheetRapport = sheetAanvraag.then(v2 => v2 && naarSheet({ actie: 'rapport', score: rapport.totaalscore, rapport: rapportAlsTekst(rapport) + '\n\n' + volledigeAnalyse.join('\n') }));
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
    r.context ? `Context: doel ${r.context.doel} | publiek ${r.context.publiek} | marketing door ${r.context.wie}${r.context.uitdaging ? ` | uitdaging: ${r.context.uitdaging}` : ''}` : '',
    `Totaalscore: ${r.totaalscore}/100`,
    r.eye_opener ? `Eye-opener: ${r.eye_opener}` : '',
    ...cats.map(([k, v]) => `${k}: ${v.score}/100. ${v.feedback}`),
    `Intro: ${r.intro}`,
    `What's working: ${r.whats_working}`,
    r.bio_feedback ? `Bio: ${r.bio_feedback}` : '',
    `Quick win: ${r.top_quickwin}`,
    `Teaser wins: ${r.teaser_wins}`,
    `Feiten: ${r.fomo}`,
    `Do today: ${r.do_today}`,
    r.challenge_answer ? `Uitdaging: ${r.challenge_answer}` : '',
    `Campagne-ideeën: ${r.campaign_ideas}`,
    `30-dagenplan: ${r.plan_30_days}`,
    `CTA: ${r.cta_dynamic}`,
    r.bronnen?.length ? `Bronnen: ${r.bronnen.map(b => `[${b.nr}] ${b.bron} ${b.url}`).join(' | ')}` : ''
  ].filter(Boolean).join('\n\n');
}
