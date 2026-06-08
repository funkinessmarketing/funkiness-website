import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
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

// Rate limiting: max 3 scans per IP per 24 uur
const ipLimiter = new Map(); // ip -> { count, resetAt }
// Email throttle: zelfde email max 1x per 7 dagen
const emailLimiter = new Map(); // email -> expiresAt

// Rapport opslag: token -> { rapport, bedrijf, naam, functie, expiresAt }
const reports = new Map();

function checkRateLimit(ip, email) {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const WEEK = 7 * DAY;

  // IP check
  const ipData = ipLimiter.get(ip);
  if (ipData) {
    if (now < ipData.resetAt && ipData.count >= 3) return 'ip';
    if (now >= ipData.resetAt) ipLimiter.set(ip, { count: 1, resetAt: now + DAY });
    else ipLimiter.set(ip, { count: ipData.count + 1, resetAt: ipData.resetAt });
  } else {
    ipLimiter.set(ip, { count: 1, resetAt: now + DAY });
  }

  // Email check
  const emailExpiry = emailLimiter.get(email.toLowerCase());
  if (emailExpiry && now < emailExpiry) return 'email';
  emailLimiter.set(email.toLowerCase(), now + WEEK);

  return null;
}

app.use(express.json());
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), 'public')));

// Rapport ophalen via token
app.get('/r/:token', (req, res) => {
  res.sendFile(join(dirname(fileURLToPath(import.meta.url)), 'public', 'index.html'));
});

app.get('/api/report/:token', (req, res) => {
  const entry = reports.get(req.params.token);
  if (!entry) return res.status(404).json({ success: false, error: 'Report not found or expired.' });
  if (Date.now() > entry.expiresAt) {
    reports.delete(req.params.token);
    return res.status(410).json({ success: false, error: 'Report has expired.' });
  }
  res.json({ success: true, rapport: entry.rapport, bedrijf: entry.bedrijf, naam: entry.naam, functie: entry.functie });
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

app.post('/api/scan', async (req, res) => {
  const { bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, antwoorden, scores } = req.body;

  // Rate limiting
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const limited = checkRateLimit(ip, email);
  if (limited === 'ip') {
    return res.status(429).json({ success: false, error: 'too_many_ip' });
  }
  if (limited === 'email') {
    return res.status(429).json({ success: false, error: 'too_many_email' });
  }

  const sectorLabel = {
    hotel: 'hotel or resort',
    restaurant: 'restaurant or café',
    makelaar: 'real estate agency',
    airbnb: 'Airbnb or vacation rental',
    anders: 'local business (sector unknown - do not assume hospitality or tourism)'
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
      model: 'claude-sonnet-4-6',
      max_tokens: 2200,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const rapport = JSON.parse(jsonMatch[0]);

    // Token aanmaken en rapport opslaan (7 dagen geldig)
    const token = crypto.randomUUID();
    reports.set(token, {
      rapport, bedrijf, naam, functie,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    });

    const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
    const reportUrl = `${BASE_URL}/r/${token}`;

    // Stuur rapport-link naar de gebruiker
    if (process.env.TITAN_PASSWORD) {
      mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your Social Media Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#F5EDE4;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:28px;color:#1A1A1A;margin-bottom:8px">Hey ${naam},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">
              Your free Social Media Scan for <strong>${bedrijf}</strong> is done. No fluff, no generic advice. Just a real look at where you stand and what to do next.
            </p>
            <div style="text-align:center;margin-bottom:32px">
              <a href="${reportUrl}" style="display:inline-block;background:#E8186D;color:white;padding:16px 36px;border-radius:99px;font-size:16px;font-weight:700;text-decoration:none">
                View your report →
              </a>
            </div>
            <p style="font-size:13px;color:#888;line-height:1.5">
              This link is personal and valid for 7 days. Questions? Just reply to this email or say hello on WhatsApp: <a href="https://wa.me/59996751737" style="color:#E8186D">+5999 675 1737</a>
            </p>
            <p style="font-size:13px;color:#aaa;margin-top:24px">FUNkiness! AI, Social Media & Marketing. Curaçao.</p>
          </div>
        `
      }).catch(err => console.error('Gebruiker email fout:', err.message));
    }

    // Stuur lead email naar FUNkiness!
    if (process.env.TITAN_PASSWORD) {
      const sectorNaam = {
        hotel: 'Hotel / Resort', restaurant: 'Restaurant / Café',
        makelaar: 'Real Estate', airbnb: 'Airbnb / Rental', anders: 'Other'
      }[sector] || sector;

      mailer.sendMail({
        from: '"FUNkiness! Scan" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        subject: `Nieuwe scan: ${bedrijf} , score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#E8186D">Nieuwe Social Media Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${bedrijf}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${sectorNaam}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${naam || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${functie || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${telefoon || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${telefoon_nl || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Instagram</td><td style="padding:8px;border:1px solid #eee">${instagram || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Totaalscore</td><td style="padding:8px;border:1px solid #eee;font-size:18px;font-weight:bold;color:#E8186D">${rapport.totaalscore}/100</td></tr>
          </table>
          <h3 style="margin-top:20px">Ingevulde bio</h3>
          <p style="background:#f5f5f5;padding:12px;border-radius:8px;font-style:italic">${bio || 'niet ingevuld'}</p>
          <h3>Scores per categorie</h3>
          <ul>
            <li>Platforms & Reach: ${rapport.platforms.score}/100 - ${rapport.platforms.feedback}</li>
            <li>Instagram: ${rapport.instagram.score}/100 - ${rapport.instagram.feedback}</li>
            <li>Engagement: ${rapport.engagement.score}/100 - ${rapport.engagement.feedback}</li>
            <li>Content: ${rapport.content.score}/100 - ${rapport.content.feedback}</li>
          </ul>
          ${rapport.bio_feedback ? `<h3>Bio analyse</h3><p>${rapport.bio_feedback}</p>` : ''}
          <h3>What's working</h3>
          <p>${rapport.whats_working || ''}</p>
          <h3>Top quick win</h3>
          <p>${rapport.top_quickwin || ''}</p>
          <h3>Teaser wins</h3>
          <p>${rapport.teaser_wins || ''}</p>
          <h3>FOMO</h3>
          <p>${rapport.fomo || ''}</p>
          <h3>Do today</h3>
          <p>${rapport.do_today}</p>
          <h3>CTA</h3>
          <p><em>${rapport.cta_dynamic || ''}</em></p>
        `
      }).catch(err => console.error('Email fout:', err.message));
    }

    res.json({ success: true, message: 'check_email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scan could not be generated.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`FUNkiness! Scan draait op http://localhost:${PORT}`));
