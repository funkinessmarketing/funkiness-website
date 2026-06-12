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

const CURACAO_CONTEXT = `
CURAÇAO MARKET CONTEXT. Only use facts from this list. Do not invent statistics. If you reference a number, it must come from here.

PLATFORM BEHAVIOR ON CURAÇAO (structural, verified):
- WhatsApp is the primary communication channel on Curaçao, used by an estimated 90%+ of the population. It is not a social media platform but a trust and conversion channel (GSMA Mobile Economy Caribbean, 2024)
- Instagram is the leading visual discovery platform for tourism and hospitality on the island
- Facebook reaches the 35+ age group most effectively; younger audiences have shifted toward Instagram and TikTok
- TikTok is growing rapidly among 18-34 year olds across the Caribbean region (Kepios Global Digital Report, 2025)
- The majority of social media traffic on Curaçao is mobile. Desktop usage is minimal

CURAÇAO TOURISM (Curaçao Tourist Board, verified):
- Curaçao welcomed over 1.1 million stay-over visitors in 2023, the highest number in the island's history (CTB Annual Report 2023)
- The US, Netherlands and Germany are the top three source markets for stay-over tourism
- Tourism accounts for approximately 30% of Curaçao's GDP

VERIFIED PLATFORM BEHAVIOR (use directional, not specific percentages):
- Instagram's algorithm actively prioritizes Reels over static images in the Explore and Reels feeds. This is confirmed Meta policy, not a benchmark stat
- Instagram Stories disappear after 24 hours but are the most-viewed format daily on the platform (Meta, 2025)
- Carousel posts generate more saves and return visits than single-image posts. Saves are a strong engagement signal in Instagram's current algorithm
- Consistency of posting is a confirmed ranking factor in Instagram's algorithm. Irregular posting reduces reach
- Instagram bio is the only clickable text on a profile. A weak or missing CTA directly costs conversions
- Responding to DMs and comments signals account activity to the algorithm and increases future post visibility (Meta Business Help Center)
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

  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, antwoorden, scores, honeypot } = req.body;

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
    anders:     'local business (sector unknown - do not assume hospitality or tourism)'
  }[sector] || 'local business (sector unknown - do not assume hospitality or tourism)';

  const bioSection = bio && bio.trim()
    ? `Their current Instagram bio (analyze this critically):\n"${bio.trim()}"`
    : 'Instagram bio: not provided';

  const totaalscore = Math.round((scores.platforms + scores.instagram + scores.engagement + scores.content) / 4);
  const lowestCat = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
  const lowestLabel = { platforms: 'Platforms & Reach', instagram: 'Instagram', engagement: 'Engagement', content: 'Content' }[lowestCat];

  const sectorBenchmarks = {
    hotel:      { avg: 54, top: 83, label: 'hotels and resorts on Curaçao' },
    restaurant: { avg: 48, top: 79, label: 'restaurants on Curaçao' },
    makelaar:   { avg: 41, top: 72, label: 'real estate agencies on Curaçao' },
    airbnb:     { avg: 38, top: 70, label: 'vacation rentals on Curaçao' },
    anders:     { avg: 45, top: 75, label: 'local businesses on Curaçao' }
  };
  const benchmark = sectorBenchmarks[sector] || sectorBenchmarks.anders;

  const prompt = `You are a sharp, direct social media expert at FUNkiness!, an AI & marketing agency on Curaçao. You analyze social media performance for businesses on the island.

${CURACAO_CONTEXT}

SECTOR BENCHMARKS (based on FUNkiness! analysis of ${benchmark.label}):
- Average score: ${benchmark.avg}/100
- Top 20% score: ${benchmark.top}/100
- ${bedrijf}'s score: ${totaalscore}/100

THE BUSINESS:
Name: ${bedrijf}
Sector: ${sectorLabel}
Instagram: ${instagram || 'not provided'}
${bioSection}

SCAN RESULTS:
${Object.entries(antwoorden).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

SCORES (0-100):
- Platforms & Reach: ${scores.platforms}
- Instagram: ${scores.instagram}
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

STRUCTURE RULES:
1. WHAT'S WORKING: Find 1 genuine thing ${bedrijf} is doing right. Be specific. Tone: playful and encouraging, like a coach who spotted something good. Not generic.
2. SCORES: 2 sentences per category. Reference a fact from the market context. No invented percentages.
3. BIO (if provided): Name the problem clearly and give 1 directional tip. Do NOT write their new bio for them. Stop at the insight.
4. TOP QUICK WIN: Give exactly 1 strong, concrete, immediately actionable quick win with the source that backs it up. Make it genuinely useful.
5. TEASER WINS: Hint at 2 more wins you spotted but don't explain them. Name the area vaguely. Create curiosity without giving the solution.
6. FOMO (positive): 2 sentences about what the fast movers in their sector on Curaçao are already doing that ${bedrijf} isn't yet. Positive angle, not scary. Make them want to be in that group.
7. DO TODAY: One ultra-specific action they can do in 20 minutes. Make it feel like the first step, not the full solution.
8. DYNAMIC CTA: Personalized to their lowest scoring area (${lowestLabel}). Direct and inviting, not salesy.

Output ONLY valid JSON:
{
  "intro": "2 sharp sentences about ${bedrijf} specifically. Reference their follower range or platform situation. Feel like you looked at their profile.",
  "whats_working": "1-2 sentences in a playful, encouraging tone about the 1 thing they are genuinely doing well. Specific to their answers.",
  "platforms": { "score": ${scores.platforms}, "feedback": "2 sentences. Reference a Curaçao or Caribbean market fact." },
  "instagram": { "score": ${scores.instagram}, "feedback": "2 sentences. Reference a verified Instagram platform behavior." },
  "engagement": { "score": ${scores.engagement}, "feedback": "2 sentences. Reference a fact about DMs, comments or algorithm signals." },
  "content": { "score": ${scores.content}, "feedback": "2 sentences. Reference a verified content behavior (Reels, carousels, Stories)." },
  "bio_feedback": "${bio && bio.trim() ? 'Name the problem clearly. Give 1 directional tip. Do NOT write the new bio. Stop at the insight.' : ''}",
  "top_quickwin": "The single best, fully explained quick win for ${bedrijf}. Include the source. Genuinely useful.",
  "teaser_wins": "We spotted 2 more wins specific to ${bedrijf}. One is about [vague area 1, not explained]. The other touches on [vague area 2, not explained]. Both need a closer look at the account to execute right.",
  "fomo": "2 sentences. What are the fast-moving ${benchmark.label} already doing on social that ${bedrijf} is not yet? Positive framing. Make them want to be in that group.",
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

    // Email to user with key findings
    if (process.env.TITAN_PASSWORD) {
      mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Social Media Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:26px;color:#080403;margin-bottom:8px">Hey ${naam},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">
              Your free Social Media Scan for <strong>${bedrijf}</strong> is done. Here are your key results.
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

    // Lead email to FUNkiness!
    if (process.env.TITAN_PASSWORD) {
      const sectorNaam = {
        hotel: 'Hotel / Resort', restaurant: 'Restaurant / Café',
        makelaar: 'Real Estate', airbnb: 'Vacation Rental', anders: 'Other'
      }[sector] || sector;

      mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        subject: `Nieuwe scan: ${bedrijf}, score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#f21b7a;font-family:sans-serif">Nieuwe Social Media Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin-bottom:24px">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${bedrijf}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${sectorNaam}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${naam || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${functie || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${telefoon || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${telefoon_nl || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Instagram</td><td style="padding:8px;border:1px solid #eee">${instagram || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold;font-size:16px">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:22px;font-weight:bold;color:#f21b7a">${rapport.totaalscore}/100</td></tr>
          </table>
          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Scores</h3>
            <ul style="margin-bottom:20px">
              <li>Platforms & Reach: <strong>${rapport.platforms.score}/100</strong>, ${rapport.platforms.feedback}</li>
              <li>Instagram: <strong>${rapport.instagram.score}/100</strong>, ${rapport.instagram.feedback}</li>
              <li>Engagement: <strong>${rapport.engagement.score}/100</strong>, ${rapport.engagement.feedback}</li>
              <li>Content: <strong>${rapport.content.score}/100</strong>, ${rapport.content.feedback}</li>
            </ul>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Intro (wat de klant ziet)</h3>
            <p style="background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:16px">${rapport.intro}</p>
            <h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">What's working</h3>
            <p style="margin-bottom:16px">${rapport.whats_working}</p>
            ${bio ? `<h3 style="color:#f21b7a;font-size:11px;text-transform:uppercase;letter-spacing:2px">Bio (ingevuld door klant)</h3><p style="background:#f5f5f5;padding:12px;border-radius:8px;font-style:italic;margin-bottom:8px">${bio}</p><p style="margin-bottom:16px">${rapport.bio_feedback || ''}</p>` : ''}
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
      }).catch(err => console.error('Lead email error:', err.message));
    }

    res.json({ success: true, rapport, bedrijf, naam, functie });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scan could not be generated. Please try again.' });
  }
}
