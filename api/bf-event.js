// Black Friday 2026: telt stappen van de route (bezoek, start formulier) zonder persoonsgegevens of cookies.
const STAPPEN = ['bezoek', 'start-formulier'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const b = req.body || {};
  if (!STAPPEN.includes(b.stap) || !process.env.GSHEET_WEBHOOK_URL) return res.status(204).end();
  try {
    await fetch(process.env.GSHEET_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bf-event', stap: b.stap,
        bron: String(b.bron || '').slice(0, 60), campagne: String(b.campagne || '').slice(0, 60) })
    });
  } catch (err) { console.error('BF event:', err.message); }
  return res.status(204).end();
}
