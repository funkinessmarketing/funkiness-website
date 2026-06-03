import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../.env') });

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), 'public')));

app.post('/api/scan', async (req, res) => {
  const { bedrijf, sector, email, instagram, antwoorden, scores } = req.body;

  const sectorLabel = {
    hotel: 'hotel of resort',
    restaurant: 'restaurant of café',
    makelaar: 'makelaar',
    airbnb: 'Airbnb-verhuurder',
    anders: 'bedrijf'
  }[sector] || 'bedrijf';

  const prompt = `Je bent een scherpe, directe marketingexpert van FUNkiness! — een AI & marketing agency op Curaçao. Je analyseert de marketingsituatie van een bedrijf op basis van een ingevulde scan.

Bedrijf: ${bedrijf}
Sector: ${sectorLabel}
Instagram: ${instagram || 'niet opgegeven'}

Scanresultaten:
${Object.entries(antwoorden).map(([vraag, antwoord]) => `- ${vraag}: ${antwoord}`).join('\n')}

Scores per categorie (0-100):
- Socials: ${scores.socials}
- Content: ${scores.content}
- Branding: ${scores.branding}
- Strategie: ${scores.strategie}
- AI: ${scores.ai}

Schrijf een gepersonaliseerd scanrapport voor ${bedrijf}. Schrijf in het Engels. Stijl: direct, scherp, eerlijk maar positief — vanuit kansen. Geen corporate taal. Nooit een emdash gebruiken. Nooit woorden als 'premium' of 'luxury'.

Geef je output als JSON in dit exacte formaat:
{
  "intro": "1-2 pakkende zinnen die specifiek ingaan op ${bedrijf} als ${sectorLabel}. Noem het bedrijf bij naam.",
  "socials": {
    "score": ${scores.socials},
    "feedback": "2-3 zinnen specifieke feedback over hun social media situatie"
  },
  "content": {
    "score": ${scores.content},
    "feedback": "2-3 zinnen specifieke feedback over hun content"
  },
  "branding": {
    "score": ${scores.branding},
    "feedback": "2-3 zinnen specifieke feedback over hun branding"
  },
  "strategie": {
    "score": ${scores.strategie},
    "feedback": "2-3 zinnen specifieke feedback over hun strategie"
  },
  "ai": {
    "score": ${scores.ai},
    "feedback": "2-3 zinnen specifieke feedback over hun AI gebruik"
  },
  "kansen": [
    "Kans 1: specifiek voor ${bedrijf} als ${sectorLabel}",
    "Kans 2: specifiek voor ${bedrijf} als ${sectorLabel}",
    "Kans 3: specifiek voor ${bedrijf} als ${sectorLabel}"
  ],
  "quickwin": "1 concrete actie die ${bedrijf} deze week kan doen. Specifiek en uitvoerbaar.",
  "totaalscore": ${Math.round((scores.socials + scores.content + scores.branding + scores.strategie + scores.ai) / 5)}
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const rapport = JSON.parse(jsonMatch[0]);
    res.json({ success: true, rapport, bedrijf, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scan kon niet worden gegenereerd.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`FUNkiness! Scan draait op http://localhost:${PORT}`));
