import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';
import { berekenScores, SECTOREN, LOCATIES, leesWebsite, websiteRegel, feitenVoor, feitenAlsTekst, antwoordenAlsTekst, REGELS_GEEN_VERZINSELS, valutaRegel, faseRegel, feitenBlok, schoonTekst, verzonnenGetallen, controleerRapport, antwoordenSamenvatting, heeftDrieStappen, controleerCitaten, verwijderFouteZinnen, categorieRegel, categorieRegelsVoorControle, bewaakCategorieen, leesInstagram, extraKanalenGeldig, CONTEXT, contextGeldig, contextAlsTekst, teasers, scoresPerVraag, TIJDZONE, afspraak, opvolging, opvolgingHtml, opvolgingVoorSheet } from './_scan-vragen.js';

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

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, locatie, site, antwoorden, context, honeypot } = req.body;
  const scores = berekenScores('social', antwoorden);

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !email || !scores || !LOCATIES[locatie] || !contextGeldig(context) || !extraKanalenGeldig(antwoorden.other_channels)) {
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
  const sheetAanvraag = naarSheet({ type: 'social', bedrijf, sector, locatie, naam, functie, email, telefoon: alsTekst(telefoon), telefoon_nl: alsTekst(telefoon_nl), instagram, website: site })
    .then(r => r?.text?.())
    .then(t => t?.trim() === 'ok-v2')
    .catch(() => false);

  // Homepage van de klant lezen terwijl de sheet-logging loopt
  // Website en echte Instagram-cijfers tegelijk ophalen
  const [websiteInhoud, instagramFeit] = await Promise.all([leesWebsite(site), leesInstagram(instagram, TIJDZONE[locatie])]);

  const sectorInfo = SECTOREN[sector] || SECTOREN.anders;
  const sectorLabel = sectorInfo.prompt;
  const locatieInfo = LOCATIES[locatie];
  const groep = `${sectorInfo.groep} ${locatieInfo.in}`;
  const feiten = [...(instagramFeit ? [instagramFeit] : []), ...feitenVoor('social', sector, locatie)];

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
${websiteRegel(site, websiteInhoud)}
THEIR CONTEXT (use it to make every recommendation fit their goal, audience and capacity; quote their challenge only literally):
${contextAlsTekst(context)}

${instagramFeit ? `MEASURED DATA: fact [F90] contains their real public Instagram numbers. In the intro and in the categories where it fits, put these measured numbers next to their own answers (for example their stated posting frequency, engagement rate or use of short video), quoting both exactly with [F90]. Where they differ, say so plainly and positively. Do not interpret beyond what the numbers show.\n\n` : ''}THEIR ANSWERS (quote these exactly, never change them):
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
- Never use "premium", "luxury" or "momentum"
${valutaRegel(locatie)}
${faseRegel(context)}- FUNkiness! brand voice: confident, a little cheeky, never corporate
- Always mention ${bedrijf} by name
- If their website text is provided, use one concrete detail from it in the intro so it is clear we actually looked. If not, do not mention the website

Call the submit_scan_report tool. Follow the field descriptions exactly.`;

  const reportTool = {
    name: 'submit_scan_report',
    description: 'Submit the completed social media scan report.',
    input_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string', description: `3 sharp sentences about ${bedrijf}: what they do (from their website or bio if provided), what their answers show overall, and the biggest gap. Based only on their answers and, if provided, their website or bio.` },
        eye_opener: { type: 'string', description: `The single biggest eye-opener for ${bedrijf}, in 2 short, punchy sentences. If MEASURED DATA [F90] is available, use the largest difference between their own answer and what was measured, quoting both exactly with [F90]. Otherwise use their most striking answer, quoted exactly, followed by one bold piece of advice. Surprising and positive, never alarming, no promised results.` },
        whats_working: { type: 'string', description: '2 to 3 playful, encouraging sentences about the things they are genuinely doing well, based on their exact answers and, if provided, their website or bio.' },
        platforms_feedback: { type: 'string', description: '4 to 6 sentences about their platforms, posting frequency and audience growth. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' + ' ' + categorieRegel('social', 'platforms', antwoorden, sector, feiten) },
        instagram_feedback: { type: 'string', description: '4 to 6 sentences about short video, Stories and where their profile sends people. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' + ' ' + categorieRegel('social', 'instagram', antwoorden, sector, feiten) },
        engagement_feedback: { type: 'string', description: '4 to 6 sentences about engagement rate and reply speed. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' + ' ' + categorieRegel('social', 'engagement', antwoorden, sector, feiten) },
        content_feedback: { type: 'string', description: '4 to 6 sentences about content type, content plan and whether customers post about them. First say what their answers show, using their exact answers. If a fact from the FACTS list relates to this, quote it exactly with its [F#] next to their answer. Then give exactly 3 concrete steps they can do this month, each on its own line as "1. ...", "2. ...", "3. ...", specific to their answers.' + ' ' + categorieRegel('social', 'content', antwoorden, sector, feiten) },
        bio_feedback: { type: 'string', description: bio && bio.trim() ? 'Based only on the bio text provided: name the problem clearly and give 1 directional tip. Do NOT write the new bio.' : 'Leave as an empty string, no bio was provided.' },
        top_quickwin: { type: 'string', description: `The single best quick win for ${bedrijf}, based on their answers. Explain step by step how to do it: 4 to 6 sentences or numbered steps on their own lines, specific to their answers. Genuinely useful.` },
        teaser_wins: { type: 'string', description: `Name two areas from their answers that FUNkiness! would dig into together in a conversation, without explaining them. Never mention a full report or anything they have not received.` },
        post_ideas: { type: 'string', description: `Exactly 3 post ideas for ${bedrijf}, made for their main goal, their audience and their main platform. Each idea on its own line as "1. [format, e.g. Reel, carousel or Story]: [the hook, the first line people see] + one sentence on what to show". Based only on their answers, website and bio. No promised results.` },
        challenge_answer: { type: 'string', description: 'If they described their biggest challenge: 2 to 3 sentences that respond directly to it, quoting it literally, with a concrete first move. If they did not describe one, leave an empty string.' },
        plan_30_days: { type: 'string', description: `A 30-day plan for ${bedrijf}, focused on their lowest scoring areas and their main goal, realistic for who does their marketing, as four lines: "Week 1: ...", "Week 2: ...", "Week 3: ...", "Week 4: ...". Each week one clear focus with 1 or 2 concrete actions, based on their answers. No promised results.` },
        chosen_facts: { type: 'array', items: { type: 'string', enum: feiten.map(f => f.id) }, description: 'The ids of the 2 or 3 facts from the FACTS list that are most relevant for this business, most relevant first.' },
        do_today: { type: 'string', description: `One ultra-specific action ${bedrijf} can take in 20 minutes. It must be a different action than the top quick win.` },
        cta_dynamic: { type: 'string', description: `A personal, direct invitation to plan ${afspraak(locatie).kort} with FUNkiness! to go through their ${lowestLabel} together. Not a sales pitch, never a phone call. An open door.` }
      },
      required: ['intro', 'eye_opener', 'whats_working', 'platforms_feedback', 'instagram_feedback', 'engagement_feedback', 'content_feedback', 'bio_feedback', 'top_quickwin', 'teaser_wins', 'post_ideas', 'challenge_answer', 'plan_30_days', 'chosen_facts', 'do_today', 'cta_dynamic']
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
    // Ontbreekt, of een onderdeel zonder drie genummerde stappen: opnieuw
    const onvolledig = k => typeof ruw[k] !== 'string' || (k.endsWith('_feedback') && k !== 'bio_feedback' && !heeftDrieStappen(schoonTekst(ruw[k])));
    let ontbreekt = verplicht.filter(onvolledig);
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
    const concept = ruw;
    ruw = await controleerRapport({
      client, model: 'claude-sonnet-5-5',
      feitenTekst: feitenAlsTekst(feiten), antwoordenTekst: contextAlsTekst(context) + '\n' + antwoordenAlsTekst('social', antwoorden),
      websiteInhoud, bio: bio, concept: ruw, verdacht: verzonnen,
      categorieRegels: categorieRegelsVoorControle('social', antwoorden, sector, feiten)
    });
    // Onderdelen die de controle niet doorkwamen: opnieuw schrijven en controleren. Lukt dat niet, dan geen half rapport naar de klant
    const nietDoor = Object.keys(concept).filter(k => !k.endsWith('_feedback') && (k !== 'challenge_answer' || context.uitdaging?.trim()) && typeof concept[k] === 'string' && concept[k].trim() && !ruw[k]?.trim());
    if (nietDoor.length) {
      console.warn('Opnieuw schrijven na mislukte controle:', nietDoor);
      const opnieuw = await schrijf(nietDoor);
      const herzien = await controleerRapport({
      client, model: 'claude-sonnet-5-5',
      feitenTekst: feitenAlsTekst(feiten), antwoordenTekst: contextAlsTekst(context) + '\n' + antwoordenAlsTekst('social', antwoorden),
      websiteInhoud, bio: bio, concept: Object.fromEntries(nietDoor.map(k => [k, opnieuw[k] || ''])), verdacht: verzonnen,
      categorieRegels: categorieRegelsVoorControle('social', antwoorden, sector, feiten)
      });
      for (const k of nietDoor) ruw[k] = herzien[k] || '';
      const nogLeeg = nietDoor.filter(k => !ruw[k]?.trim());
      if (nogLeeg.length) throw new Error('Controle mislukt voor: ' + nogLeeg.join(', '));
    }
    // Vangnet: zinnen die in een ander onderdeel thuishoren gaan eruit
    ruw = bewaakCategorieen(ruw, 'social', antwoorden, sector);
    // Elk citaat naast de bronnen leggen; wat niet klopt gaat nog één keer langs de controleur, daarna gaat de zin eruit
    const controleBasis = { client, model: 'claude-sonnet-5-5', feitenTekst: feitenAlsTekst(feiten), antwoordenTekst: contextAlsTekst(context) + '\n' + antwoordenAlsTekst('social', antwoorden), websiteInhoud, bio: bio };
    const citaatBronnen = [controleBasis.antwoordenTekst, websiteInhoud, bio, controleBasis.feitenTekst, bedrijf];
    let fouteCitaten = controleerCitaten(ruw, citaatBronnen);
    if (Object.keys(fouteCitaten).length) {
      console.warn('Citaten kloppen niet:', JSON.stringify(fouteCitaten));
      const deel = Object.fromEntries(Object.keys(fouteCitaten).map(k => [k, ruw[k]]));
      const herzien = await controleerRapport({ ...controleBasis, concept: deel, fouteCitaten: [...new Set(Object.values(fouteCitaten).flat())],
        categorieRegels: categorieRegelsVoorControle('social', antwoorden, sector, feiten) });
      for (const k of Object.keys(deel)) if (herzien[k]) ruw[k] = herzien[k];
      ruw = bewaakCategorieen(ruw, 'social', antwoorden, sector);
      fouteCitaten = controleerCitaten(ruw, citaatBronnen);
    }
    ruw = verwijderFouteZinnen(ruw, fouteCitaten, [...Object.values(antwoorden), ...Object.values(context)].filter(v => typeof v === 'string'));

    // Categorie zonder goedgekeurde tekst: samenvatting van hun eigen antwoorden
    for (const cat of ["platforms", "instagram", "engagement", "content"]) {
      if (!ruw[`${cat}_feedback`]) ruw[`${cat}_feedback`] = antwoordenSamenvatting('social', cat, antwoorden);
    }
    // Geen uitdaging ingevuld: geen blok, ook niet als de AI er toch iets over schrijft
    if (!context.uitdaging?.trim()) ruw.challenge_answer = '';
    const schoon = Object.fromEntries(Object.entries(ruw).map(([k, v]) => [k, typeof v === 'string' ? schoonTekst(v) : v]));
    // Feiten letterlijk uit de bronnenlijst; [F#] in de tekst wordt een bronnummer
    const { items: weetjes, bronnen, velden: out } = feitenBlok(instagramFeit ? ['F90', ...(schoon.chosen_facts || []).filter(id => id !== 'F90')] : schoon.chosen_facts, feiten, schoon);
    const rapport = {
      intro: out.intro,
      eye_opener: out.eye_opener,
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
      post_ideas: out.post_ideas,
      challenge_answer: out.challenge_answer,
      plan_30_days: out.plan_30_days,
      do_today: out.do_today,
      cta_dynamic: out.cta_dynamic,
      afspraak: afspraak(locatie),
      meer: teasers({ instagramFeit, aantalVragen: scoresPerVraag('social', antwoorden).length }),
      totaalscore,
      bronnen,
      context
    };

    // Email to user with key findings
    // Mails afwachten: Vercel stopt de functie zodra het antwoord terug is
    // Volledige analyse alleen voor Daisy (leadmail en sheet)
    const volledigeAnalyse = [...(instagramFeit?.extra?.length ? ['Instagram, verdieping:', ...instagramFeit.extra.map(p => '- ' + p)] : []), 'Punten per vraag:', ...scoresPerVraag('social', antwoorden).map(p => '- ' + p)];
    // Kant-en-klare opvolging voor Daisy: WhatsApp nu, mailconcepten op dag 3 en dag 8 via de sheet
    const volg = opvolging({ type: 'social', naam, bedrijf, locatie, sector, antwoorden, instagramFeit,
      laagsteLabel: lowestLabel, laagsteScore: scores[lowestCat], totaalscore, telefoon, telefoon_nl });
    const mails = [];
    if (process.env.TITAN_PASSWORD) {
      mails.push(mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Social Media Scan is ready, ${naam}!`,
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
                <div style="font-size:14px;font-weight:700;color:#3a251b">Platforms &amp; Reach, ${br(rapport.platforms.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.platforms.feedback)}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Video &amp; Profile, ${br(rapport.instagram.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.instagram.feedback)}</p>
              </div>
              <div style="margin-bottom:14px">
                <div style="font-size:14px;font-weight:700;color:#3a251b">Engagement, ${br(rapport.engagement.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.engagement.feedback)}</p>
              </div>
              <div>
                <div style="font-size:14px;font-weight:700;color:#3a251b">Content, ${br(rapport.content.score)}/100</div>
                <p style="font-size:14px;line-height:1.6;color:#444;margin:2px 0 0">${br(rapport.content.feedback)}</p>
              </div>
            </div>
            ${bio && bio.trim() ? `
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your bio</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.bio_feedback)}</p>
            </div>` : ''}
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 Quick Win</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.top_quickwin)}</p>
            </div>
            ${rapport.challenge_answer ? `<div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your challenge</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.challenge_answer)}</p>
            </div>` : ''}
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">3 post ideas for you</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${br(rapport.post_ideas)}</p>
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
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${afspraak(locatie).zin} Plan it via WhatsApp <a href="https://wa.me/59996751737?text=${encodeURIComponent(`Hi FUNkiness! I did the scan for ${bedrijf} (score ${rapport.totaalscore}/100). ${afspraak(locatie).wens} Days and times that suit me: `)}" style="color:#f21b7a;font-weight:700">+599 9 675 1737</a> or reply to this email.</p>
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
          ${opvolgingHtml(volg, esc)}
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin-bottom:24px">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${esc(bedrijf)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Doel</td><td style="padding:8px;border:1px solid #eee">${esc(context.doel)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Publiek</td><td style="padding:8px;border:1px solid #eee">${esc(context.publiek)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Marketing door</td><td style="padding:8px;border:1px solid #eee">${esc(context.wie)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Uitdaging</td><td style="padding:8px;border:1px solid #eee">${esc(context.uitdaging) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Locatie</td><td style="padding:8px;border:1px solid #eee">${esc(locatieInfo.naam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${esc(sectorNaam)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${esc(naam) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${esc(functie) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${esc(site) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${esc(telefoon_nl) || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Instagram</td><td style="padding:8px;border:1px solid #eee">${esc(instagram) || 'niet opgegeven'}${instagramFeit ? ' (echte cijfers opgehaald)' : ''}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;font-size:16px">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:22px;font-weight:bold;color:#f21b7a">${br(rapport.totaalscore)}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Scores</h3>
            <ul style="margin-bottom:20px">
              <li>Platforms & Reach: <strong>${br(rapport.platforms.score)}/100</strong>, ${br(rapport.platforms.feedback)}</li>
              <li>Video &amp; Profile: <strong>${br(rapport.instagram.score)}/100</strong>, ${br(rapport.instagram.feedback)}</li>
              <li>Engagement: <strong>${br(rapport.engagement.score)}/100</strong>, ${br(rapport.engagement.feedback)}</li>
              <li>Content: <strong>${br(rapport.content.score)}/100</strong>, ${br(rapport.content.feedback)}</li>
            </ul>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Intro (wat de klant ziet)</h3>
            <p style="background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:16px">${br(rapport.intro)}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">What's working</h3>
            <p style="margin-bottom:16px">${br(rapport.whats_working)}</p>
            ${bio ? `<h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Bio (ingevuld door klant)</h3><p style="background:#f5f5f5;padding:12px;border-radius:8px;font-style:italic;margin-bottom:8px">${esc(bio)}</p><p style="margin-bottom:16px">${rapport.bio_feedback || ''}</p>` : ''}
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Top quick win</h3>
            <p style="margin-bottom:16px">${br(rapport.top_quickwin)}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Teaser wins</h3>
            <p style="margin-bottom:16px">${br(rapport.teaser_wins)}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Worth knowing</h3>
            <p style="margin-bottom:16px">${br(rapport.fomo)}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Do today</h3>
            <p style="margin-bottom:16px">${br(rapport.do_today)}</p>
            <h3 style="color:#f21b7a">Uitdaging (antwoord)</h3>
            <p>${br(rapport.challenge_answer) || '-'}</p>
            <h3 style="color:#f21b7a">3 postideeën</h3>
            <p>${br(rapport.post_ideas)}</p>
            <h3 style="color:#f21b7a">30-dagenplan</h3>
            <p>${br(rapport.plan_30_days)}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">CTA (dynamisch)</h3>
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

    const sheetRapport = sheetAanvraag.then(v2 => v2 && naarSheet({ actie: 'rapport', score: rapport.totaalscore, rapport: rapportAlsTekst(rapport) + '\n\n' + volledigeAnalyse.join('\n'), opvolging: opvolgingVoorSheet(volg) }));
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
    r.context ? `Context: doel ${r.context.doel} | publiek ${r.context.publiek} | marketing door ${r.context.wie}${r.context.fase ? ` | fase ${r.context.fase}` : ''}${r.context.uitdaging ? ` | uitdaging: ${r.context.uitdaging}` : ''}` : '',
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
    `Postideeën: ${r.post_ideas}`,
    `30-dagenplan: ${r.plan_30_days}`,
    `CTA: ${r.cta_dynamic}`,
    r.bronnen?.length ? `Bronnen: ${r.bronnen.map(b => `[${b.nr}] ${b.bron} ${b.url}`).join(' | ')}` : ''
  ].filter(Boolean).join('\n\n');
}
