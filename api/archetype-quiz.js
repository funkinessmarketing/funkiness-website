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

const ARCHETYPE_CONTEXT = {
  T: {
    name: 'The Time Liberator',
    tagline: 'AI gives you back the one thing money can\'t buy.',
    meaning: 'This person is overwhelmed by repetitive tasks and operational work. Their biggest AI opportunity is automation — freeing up time to focus on growth, strategy, and the things only they can do.'
  },
  C: {
    name: 'The Content Machine',
    tagline: 'Your voice is your brand. AI makes sure it never goes quiet.',
    meaning: 'This person struggles with consistent content output. They have stories to tell but not enough time or bandwidth to tell them. Their biggest AI opportunity is content creation, repurposing, and scheduling at scale.'
  },
  G: {
    name: 'The Growth Catalyst',
    tagline: 'The next level isn\'t luck. It\'s leverage.',
    meaning: 'This person is ambitious and growth-focused. They want more customers, more reach, more revenue. Their biggest AI opportunity is using data, smarter targeting, lead generation, and competitive insight to scale.'
  },
  E: {
    name: 'The Experience Architect',
    tagline: 'Great experiences don\'t happen by accident.',
    meaning: 'This person lives for customer relationships and memorable experiences. Their biggest AI opportunity is personalization, smarter customer communication, and freeing up time from admin so they can focus on the moments that matter.'
  }
};

const SECTOR_LABELS = {
  hotel: 'hotel or resort',
  restaurant: 'restaurant or café',
  makelaar: 'real estate agency',
  rental: 'vacation rental or short-term rental',
  retail: 'retail business',
  finance: 'finance or banking',
  anders: 'local business'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { naam, email, bedrijf, sector, archetype, scores, honeypot } = req.body;

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!naam || !email || !archetype) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  if (!email.includes('@') || naam.length > 200 || (bedrijf && bedrijf.length > 200)) {
    return res.status(400).json({ success: false, error: 'Invalid input.' });
  }

  if (!['T', 'C', 'G', 'E'].includes(archetype)) {
    return res.status(400).json({ success: false, error: 'Invalid archetype.' });
  }

  const arch = ARCHETYPE_CONTEXT[archetype];
  const sectorLabel = SECTOR_LABELS[sector] || 'local business';
  const businessRef = bedrijf ? bedrijf : (sector ? `a ${sectorLabel}` : 'their business');

  const prompt = `You are a sharp AI strategist at FUNkiness!, an AI & marketing agency on Curaçao. You write quiz results for the AI Superpower Quiz — a personality quiz that helps business owners discover their biggest AI opportunity.

ARCHETYPE DETERMINED: ${arch.name}
ARCHETYPE TAGLINE: ${arch.tagline}
WHAT THIS ARCHETYPE MEANS: ${arch.meaning}

ABOUT THIS PERSON:
- Name: ${naam}
- Business: ${bedrijf || 'not provided'}
- Sector: ${sectorLabel}

QUIZ SCORES (for context, not to be mentioned directly):
- Time Liberator score: ${scores?.T || 0}/8
- Content Machine score: ${scores?.C || 0}/8
- Growth Catalyst score: ${scores?.G || 0}/8
- Experience Architect score: ${scores?.E || 0}/8

TONE RULES:
- English only
- Bold, direct, energetic. Speak to ${naam} personally.
- Never use an em dash. Never use "premium" or "luxury".
- Positive framing only — AI as opportunity and empowerment, never threat.
- FUNkiness! brand voice: confident, a little cheeky, never corporate.
- Keep sentences tight. No filler. Every word earns its place.

STRUCTURE RULES:
1. headline: One punchy, personalized line that captures what their archetype unlocks for them. Reference their sector or business if provided. Make them feel seen.
2. description: 2 sentences. What does it mean to be ${arch.name}? What does this reveal about how they work and where AI fits in? Personal, direct.
3. ai_superpower: Their single most powerful AI opportunity right now, specific to their archetype and sector. Concrete and actionable enough to be genuinely valuable — but the full implementation is a conversation with FUNkiness!.
4. teaser: Hint at 2 more AI wins specific to their archetype without revealing them. Create real curiosity. Name the area vaguely.
5. cta: A warm, personal invitation to connect. Not a sales pitch. Make ${naam} feel like this is the beginning of something, not a close.

Output ONLY valid JSON:
{
  "headline": "one punchy personalized line",
  "description": "2 sentences about what this archetype means for them",
  "ai_superpower": "their #1 concrete AI opportunity",
  "teaser": "hint at 2 more wins, create curiosity",
  "cta": "personal invitation to connect with FUNkiness!"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const rapport = JSON.parse(jsonMatch[0]);

    // Email to user
    if (process.env.TITAN_PASSWORD) {
      mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your AI Superpower: ${arch.name}`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:24px;color:#080403;margin-bottom:6px">Hey ${naam},</h1>
            <p style="font-size:15px;color:#555;margin-bottom:32px">Your AI Superpower Quiz result is in.</p>

            <div style="background:#080403;border-radius:16px;padding:36px 28px;margin-bottom:28px;text-align:center">
              <div style="font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#f21b7a;margin-bottom:12px">Your AI Superpower</div>
              <div style="font-size:40px;margin-bottom:12px">${arch.name.split(' ')[1] === 'Time' ? '⚡' : arch.name.includes('Content') ? '📡' : arch.name.includes('Growth') ? '🚀' : '✨'}</div>
              <div style="font-size:30px;font-weight:900;color:#fff;line-height:1.1;margin-bottom:10px">${arch.name}</div>
              <p style="font-size:15px;color:rgba(255,255,255,0.6);margin:0">${arch.tagline}</p>
            </div>

            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">What this means for you</div>
              <p style="font-size:16px;font-weight:700;color:#080403;margin:0 0 10px">${rapport.headline}</p>
              <p style="font-size:15px;line-height:1.6;color:#444;margin:0">${rapport.description}</p>
            </div>

            <div style="background:#080403;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Your #1 AI opportunity right now</div>
              <p style="font-size:15px;line-height:1.6;color:rgba(255,255,255,0.85);margin:0">${rapport.ai_superpower}</p>
            </div>

            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:28px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">There's more where that came from</div>
              <p style="font-size:15px;line-height:1.6;color:#444;margin:0">${rapport.teaser}</p>
            </div>

            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:24px">${rapport.cta}</p>

            <div style="text-align:center;margin-bottom:32px">
              <a href="https://wa.me/59996751737" style="display:inline-block;background:#f21b7a;color:white;padding:14px 32px;border-radius:99px;font-size:15px;font-weight:700;text-decoration:none">
                Let's talk on WhatsApp →
              </a>
            </div>

            <p style="font-size:13px;color:#aaa;margin-top:24px;text-align:center">FUNkiness! AI, Social Media & Marketing. Curaçao.<br>Questions? Reply to this email or WhatsApp: +5999 675 1737</p>
          </div>
        `
      }).catch(err => console.error('User email error:', err.message));
    }

    // Lead email to Daisy
    if (process.env.TITAN_PASSWORD) {
      const sectorDisplay = {
        hotel: 'Hotel / Resort', restaurant: 'Restaurant / Café', makelaar: 'Real Estate',
        rental: 'Vacation Rental', retail: 'Retail', finance: 'Finance / Banking', anders: 'Other'
      }[sector] || sector || 'Not specified';

      mailer.sendMail({
        from: '"FUNkiness! Quiz" <sayhello@funkiness.ai>',
        to: 'sayhello@funkiness.ai',
        subject: `Nieuwe AI Quiz lead: ${naam} — ${arch.name}`,
        html: `
          <h2 style="color:#f21b7a;font-family:sans-serif">Nieuwe AI Superpower Quiz Lead</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin-bottom:20px">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${naam}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${bedrijf || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${sectorDisplay}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Archetype</td><td style="padding:8px;border:1px solid #eee;font-size:17px;font-weight:bold;color:#f21b7a">${arch.name}</td></tr>
          </table>

          <h3 style="font-family:sans-serif">Quiz scores</h3>
          <ul style="font-family:sans-serif">
            <li>Time Liberator: ${scores?.T || 0}/8</li>
            <li>Content Machine: ${scores?.C || 0}/8</li>
            <li>Growth Catalyst: ${scores?.G || 0}/8</li>
            <li>Experience Architect: ${scores?.E || 0}/8</li>
          </ul>

          <div style="font-family:sans-serif">
            <h3 style="color:#f21b7a;border-bottom:2px solid #f21b7a;padding-bottom:4px">Gegenereerde content</h3>
            <h4>Headline</h4><p>${rapport.headline}</p>
            <h4>Description</h4><p>${rapport.description}</p>
            <h4>AI Superpower (#1 opportunity)</h4><p>${rapport.ai_superpower}</p>
            <h4>Teaser</h4><p>${rapport.teaser}</p>
            <h4>CTA</h4><p>${rapport.cta}</p>
          </div>
        `
      }).catch(err => console.error('Lead email error:', err.message));
    }

    res.json({ success: true, rapport });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Quiz result could not be generated. Please try again.' });
  }
}
