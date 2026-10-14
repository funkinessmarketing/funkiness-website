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

const CURACAO_CONTEXT = `
CURAÇAO MARKET CONTEXT. Only use facts from this list. Do not invent statistics. If you reference a number, it must come from here.

PLATFORM BEHAVIOR ON CURAÇAO (structural, verified):
- WhatsApp is the primary communication channel on Curaçao. It is not a social media platform but a trust and conversion channel
- Instagram is the leading visual discovery platform for tourism and hospitality on the island
- Facebook reaches the 35+ age group most effectively; younger audiences have shifted toward Instagram and TikTok
- TikTok is growing fast among younger audiences across the Caribbean region
- The majority of social media traffic on Curaçao is mobile. Desktop usage is minimal

CURAÇAO TOURISM (Curaçao Tourist Board, verified):
- Curaçao welcomed 582,409 stay-over visitors in 2023, a record year (Curaçao Tourist Board, January 2024)
- The US, Netherlands and Germany are the top three source markets for stay-over tourism

VERIFIED PLATFORM BEHAVIOR (use directional, not specific percentages):
- Instagram's algorithm actively prioritizes Reels over static images in the Explore and Reels feeds. This is confirmed Meta policy, not a benchmark stat
- Stories disappear after 24 hours and keep a business visible to existing followers between posts
- Carousel posts generate more saves and return visits than single-image posts. Saves are a strong engagement signal in Instagram's current algorithm
- Consistency of posting is a confirmed ranking factor in Instagram's algorithm. Irregular posting reduces reach
- Instagram bio is the only clickable text on a profile. A weak or missing CTA directly costs conversions
- Responding to DMs and comments signals account activity to the algorithm and increases future post visibility
- English-language content reaches a broader international audience; Papiamentu and Dutch perform better for local community engagement

WHAT NOT TO CLAIM:
- Do not cite specific engagement rate percentages (e.g. "3x more reach", "22% more interaction"). These are algorithm-dependent and change constantly
- Do not cite specific optimal posting frequencies as universal rules. These vary by account and niche
- Do not cite specific hashtag counts as optimal. Instagram's own guidance has shifted away from hashtag quantity
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, site, antwoorden, honeypot } = req.body;
  const scores = berekenScores('social', antwoorden);

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
  const sheetAanvraag = naarSheet({ type: 'social', bedrijf, sector, naam, functie, email, telefoon: alsTekst(telefoon), telefoon_nl: alsTekst(telefoon_nl), instagram, website: site })
    .then(r => r?.text?.())
    .then(t => t?.trim() === 'ok-v2')
    .catch(() => false);

  // Homepage van de klant lezen terwijl de sheet-logging loopt
  const websiteInhoud = await leesWebsite(site);

  const sectorInfo = SECTOREN[sector] || SECTOREN.anders;
  const sectorLabel = sectorInfo.prompt;
  const groep = sectorInfo.groep;

  const bioSection = bio && bio.trim()
    ? `Their current profile bio (analyze this critically):\n"${bio.trim()}"`
    : 'Instagram bio: not provided';

  const totaalscore = Math.round((scores.platforms + scores.instagram + scores.engagement + scores.content) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = { platforms: 'Platforms & Reach', instagram: 'Video & Profile', engagement: 'Engagement', content: 'Content' }[lowestCat];


  const prompt = `You are a sharp, direct social media expert at FUNkiness!, an AI & marketing agency on Curaçao. You analyze social media performance for businesses on the island.

${CURACAO_CONTEXT}

OVERALL SCORE: ${bedrijf} scored ${totaalscore}/100. Do not compare this score to other businesses or invent averages.

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}
${websiteInhoud ? `Their website (homepage text, fetched just now):\n${websiteInhoud}\n` : 'Website: not provided or not reachable\n'}Instagram/TikTok handle: ${instagram || 'not provided'}
${bioSection}

SCAN RESULTS:
${Object.entries(antwoorden).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

SCORES (0-100):
- Platforms & Reach: ${scores.platforms}
- Video & Profile: ${scores.instagram}
- Engagement: ${scores.engagement}
- Content: ${scores.content}
- Lowest scoring area: ${lowestLabel}

INSTRUCTIONS:
Write a sharp, personalized social media scan report for ${bedrijf}. Follow every rule below exactly.

TONE:
- English only
- Direct, bold, honest but always positive. Frame everything from opportunity
- Never use an em dash. Never use "premium" or "luxury"
- FUNkiness! brand voice: confident, a little cheeky, never corporate
- Always mention ${bedrijf} by name
- If their website text is provided, use one concrete detail from it in the intro so it is clear we actually looked. Never invent details about the website. If no website text is provided, do not mention the website

STRUCTURE RULES:
1. WHAT'S WORKING: Find 1 genuine thing ${bedrijf} is doing right. Be specific. Tone: playful and encouraging, like a coach who spotted something good. Not generic.
2. SCORES: 2 sentences per category. Reference a fact from the market context. No invented percentages.
3. BIO (if provided): Name the problem clearly and give 1 directional tip. Do NOT write their new bio for them. Stop at the insight.
4. TOP QUICK WIN: Give exactly 1 strong, concrete, immediately actionable quick win. Explain why it works. Only name a source if it appears in the context above. Make it genuinely useful.
5. TEASER WINS: Hint at 2 more wins you spotted but don't explain them. Name the area vaguely. Create curiosity without giving the solution.
6. FOMO (positive): 2 sentences about what the fast movers in their sector on Curaçao are already doing that ${bedrijf} isn't yet. Positive angle, not scary. Make them want to be in that group.
7. DO TODAY: One ultra-specific action they can do in 20 minutes. Make it feel like the first step, not the full solution.
8. DYNAMIC CTA: Personalized to their lowest scoring area (${lowestLabel}). Direct and inviting, not salesy.

Call the submit_scan_report tool with your completed report, following the structure rules above and the field descriptions in the tool schema.`;

  const reportTool = {
    name: 'submit_scan_report',
    description: 'Submit the completed social media scan report.',
    input_schema: {
      type: 'object',
      properties: {
        intro: { type: 'string', description: `2 sharp sentences about ${bedrijf} specifically. Reference their follower range or platform situation. Feel like you looked at their profile.` },
        whats_working: { type: 'string', description: '1-2 sentences in a playful, encouraging tone about the 1 thing they are genuinely doing well. Specific to their answers.' },
        platforms_feedback: { type: 'string', description: '2 sentences. Reference a Curaçao or Caribbean market fact.' },
        instagram_feedback: { type: 'string', description: '2 sentences about short video, Stories and where their profile sends people. Reference a verified platform behavior.' },
        engagement_feedback: { type: 'string', description: '2 sentences. Reference a fact about DMs, comments or algorithm signals.' },
        content_feedback: { type: 'string', description: '2 sentences. Reference a verified content behavior (Reels, carousels, Stories).' },
        bio_feedback: { type: 'string', description: bio && bio.trim() ? 'Name the problem clearly. Give 1 directional tip. Do NOT write the new bio. Stop at the insight.' : 'Leave as an empty string, no bio was provided.' },
        top_quickwin: { type: 'string', description: `The single best, fully explained quick win for ${bedrijf}. Explain why it works. Genuinely useful.` },
        teaser_wins: { type: 'string', description: `We spotted 2 more wins specific to ${bedrijf}. One is about [vague area 1, not explained]. The other touches on [vague area 2, not explained]. Both need a closer look at the account to execute right.` },
        fomo: { type: 'string', description: `2 sentences. What are the fast-moving ${groep} already doing on social that ${bedrijf} is not yet? Positive framing. Make them want to be in that group.` },
        do_today: { type: 'string', description: `One ultra-specific action ${bedrijf} can take in 20 minutes. The first step, not the full solution.` },
        cta_dynamic: { type: 'string', description: `A personal, direct invitation to talk about their ${lowestLabel} specifically. Not a sales pitch. An open door.` }
      },
      required: ['intro', 'whats_working', 'platforms_feedback', 'instagram_feedback', 'engagement_feedback', 'content_feedback', 'bio_feedback', 'top_quickwin', 'teaser_wins', 'fomo', 'do_today', 'cta_dynamic']
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
      platforms: { score: scores.platforms, feedback: out.platforms_feedback },
      instagram: { score: scores.instagram, feedback: out.instagram_feedback },
      engagement: { score: scores.engagement, feedback: out.engagement_feedback },
      content: { score: scores.content, feedback: out.content_feedback },
      bio_feedback: out.bio_feedback,
      top_quickwin: out.top_quickwin,
      teaser_wins: out.teaser_wins,
      fomo: out.fomo,
      do_today: out.do_today,
      cta_dynamic: out.cta_dynamic,
      totaalscore
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
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">FOMO</h3>
            <p style="margin-bottom:16px">${rapport.fomo}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Do today</h3>
            <p style="margin-bottom:16px">${rapport.do_today}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">CTA (dynamisch)</h3>
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
    `FOMO: ${r.fomo}`,
    `Do today: ${r.do_today}`,
    `CTA: ${r.cta_dynamic}`
  ].filter(Boolean).join('\n\n');
}
