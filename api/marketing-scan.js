import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const mailer = nodemailer.createTransport({
  host: 'smtp.titan.email',
  port: 587,
  secure: false,
  auth: {
    user: 'sayhello@funkiness.ai',
    pass: process.env.TITAN_PASSWORD
  }
});

const CURACAO_MARKETING_CONTEXT = `
CURAÇAO BUSINESS & MARKETING CONTEXT. Only use facts from this list. Do not invent statistics.

CURAÇAO OVERVIEW:
- Curaçao has approximately 160,000 inhabitants
- Tourism accounts for approximately 30% of GDP (Curaçao Tourist Board)
- Curaçao welcomed over 1.1 million stay-over visitors in 2023, the highest in island history (CTB Annual Report 2023)
- The US, Netherlands and Germany are the top three source markets for stay-over tourism

DIGITAL BEHAVIOR ON CURAÇAO (structural, verified):
- WhatsApp is the primary communication channel, used by an estimated 90%+ of the population (GSMA Mobile Economy Caribbean, 2024)
- The majority of web and social traffic is mobile. Desktop usage is minimal
- Word-of-mouth and WhatsApp referrals remain dominant lead sources for most local businesses
- Google Business Profile is widely underused by local businesses — those who optimize it gain a clear visibility advantage

VERIFIED MARKETING BEST PRACTICES:
- Businesses with a documented strategy, even a basic one, are more consistent and waste less budget on reactive spending
- Customer retention is typically more cost-effective than acquisition. Loyalty and follow-up communication are underused on Curaçao
- A consistent visual brand identity builds faster recognition in a small, word-of-mouth driven market like Curaçao
- Mobile-optimized websites are essential given the mobile-first behavior of both local and tourist audiences
- Knowing your ideal customer is the foundation of every effective marketing decision — channel selection, messaging, and budget allocation all depend on it
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

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, antwoorden, scores, honeypot } = req.body;

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !email || !scores || !antwoorden) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  if (!email.includes('@') || bedrijf.length > 200 || naam?.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid input.' });
  }

  const sectorLabel = {
    hotel:      'hotel or resort',
    restaurant: 'restaurant or café',
    makelaar:   'real estate agency',
    airbnb:     'vacation rental or short-term rental',
    anders:     'local business (sector unknown)'
  }[sector] || 'local business (sector unknown)';

  const totaalscore = Math.round((scores.brand + scores.audience + scores.channels + scores.strategy) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = {
    brand:    'Brand & Positioning',
    audience: 'Audience & Market',
    channels: 'Channels & Reach',
    strategy: 'Strategy & Execution'
  }[lowestCat];

  const sectorBenchmarks = {
    hotel:      { avg: 46, top: 76, label: 'hotels and resorts on Curaçao' },
    restaurant: { avg: 40, top: 70, label: 'restaurants on Curaçao' },
    makelaar:   { avg: 36, top: 66, label: 'real estate agencies on Curaçao' },
    airbnb:     { avg: 33, top: 63, label: 'vacation rentals on Curaçao' },
    anders:     { avg: 38, top: 68, label: 'local businesses on Curaçao' }
  };
  const benchmark = sectorBenchmarks[sector] || sectorBenchmarks.anders;

  const prompt = `You are a sharp, direct marketing strategist at FUNkiness!, an AI & marketing agency on Curaçao. You analyze marketing strategy for businesses on the island.

${CURACAO_MARKETING_CONTEXT}

SECTOR BENCHMARKS (based on FUNkiness! analysis of ${benchmark.label}):
- Average score: ${benchmark.avg}/100
- Top 20% score: ${benchmark.top}/100
- ${bedrijf}'s score: ${totaalscore}/100

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}

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

STRUCTURE RULES:
1. WHAT'S WORKING: Find 1 genuine thing ${bedrijf} is doing right. Be specific. Tone: playful and encouraging. Not generic.
2. SCORES: 2 sentences per category. Reference a fact from the market context. No invented percentages.
3. TOP QUICK WIN: Give exactly 1 strong, concrete, immediately actionable quick win with the source that backs it up. Genuinely useful but does not replace a strategy session.
4. TEASER WINS: Hint at 2 more wins you spotted but don't explain them. Name the area vaguely. Create curiosity without giving the solution.
5. FOMO (positive): 2 sentences about what the fast-moving ${benchmark.label} are already doing that ${bedrijf} isn't yet. Positive angle. Make them want to be in that group.
6. DO TODAY: One ultra-specific action they can do in 20 minutes. The first step, not the full solution.
7. DYNAMIC CTA: Personalized to their lowest scoring area (${lowestLabel}). Direct and inviting, not salesy.

Output ONLY valid JSON:
{
  "intro": "2 sharp sentences about ${bedrijf} specifically. Reference their sector and scan answers. Feel like you looked at their business.",
  "whats_working": "1-2 sentences in a playful, encouraging tone about the 1 thing they are genuinely doing well.",
  "brand": { "score": ${scores.brand}, "feedback": "2 sentences. Reference a Curaçao market fact about brand or positioning." },
  "audience": { "score": ${scores.audience}, "feedback": "2 sentences. Reference a fact about knowing your customer or word-of-mouth." },
  "channels": { "score": ${scores.channels}, "feedback": "2 sentences. Reference a verified channel behavior (Google, WhatsApp, website, mobile)." },
  "strategy": { "score": ${scores.strategy}, "feedback": "2 sentences. Reference a fact about planning, budget or tracking." },
  "top_quickwin": "The single best, fully explained quick win for ${bedrijf}. Include the source. Genuinely useful but leaves the strategy work for FUNkiness!.",
  "teaser_wins": "We spotted 2 more wins specific to ${bedrijf}. One is about [vague area 1]. The other touches on [vague area 2]. Both need a closer look to execute right.",
  "fomo": "2 sentences. What are the fast-moving ${benchmark.label} already doing that ${bedrijf} is not yet? Positive framing.",
  "do_today": "One ultra-specific action ${bedrijf} can take in 20 minutes. The first step, not the full solution.",
  "cta_dynamic": "A personal, direct invitation to talk about their ${lowestLabel} specifically. Not a sales pitch. An open door.",
  "totaalscore": ${totaalscore},
  "benchmark_avg": ${benchmark.avg},
  "benchmark_top": ${benchmark.top},
  "benchmark_label": "${benchmark.label}"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const rapport = JSON.parse(jsonMatch[0]);

    if (process.env.TITAN_PASSWORD) {
      mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Marketing Strategy Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:26px;color:#080403;margin-bottom:8px">Hey ${naam},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">
              Your free Marketing Strategy Scan for <strong>${bedrijf}</strong> is done. Here are your key results.
            </p>
            <div style="text-align:center;background:#f21b7a;color:white;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="font-size:48px;font-weight:900;line-height:1">${rapport.totaalscore}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.9">Overall Score / 100</div>
              <div style="font-size:14px;margin-top:8px;opacity:0.85">vs. average ${rapport.benchmark_avg}/100 for ${rapport.benchmark_label}</div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 Quick Win</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.top_quickwin}</p>
            </div>
            <div style="background:#080403;color:white;border-radius:12px;padding:20px 24px;margin-bottom:24px">
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
      }).catch(err => console.error('User email error:', err.message));
    }

    if (process.env.TITAN_PASSWORD) {
      const sectorNaam = {
        hotel: 'Hotel / Resort', restaurant: 'Restaurant / Café',
        makelaar: 'Real Estate', airbnb: 'Vacation Rental', anders: 'Other'
      }[sector] || sector;

      mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        subject: `Nieuwe marketing scan: ${bedrijf}, score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#f21b7a">Nieuwe Marketing Strategy Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${bedrijf}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${sectorNaam}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${naam || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${functie || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${telefoon || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${telefoon_nl || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:18px;font-weight:bold;color:#f21b7a">${rapport.totaalscore}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;margin-top:24px;margin-bottom:8px;border-bottom:2px solid #f21b7a;padding-bottom:4px">Scores</h3>
            <ul style="line-height:2">
              <li>Brand & Positioning: <strong>${rapport.brand.score}/100</strong> — ${rapport.brand.feedback}</li>
              <li>Audience & Market: <strong>${rapport.audience.score}/100</strong> — ${rapport.audience.feedback}</li>
              <li>Channels & Reach: <strong>${rapport.channels.score}/100</strong> — ${rapport.channels.feedback}</li>
              <li>Strategy & Execution: <strong>${rapport.strategy.score}/100</strong> — ${rapport.strategy.feedback}</li>
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
      }).catch(err => console.error('Lead email error:', err.message));
    }

    res.json({ success: true, rapport, bedrijf, naam, functie });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scan could not be generated. Please try again.' });
  }
}
