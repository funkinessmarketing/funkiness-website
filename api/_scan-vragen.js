// Punten per antwoord. De server rekent hiermee, de score uit de browser wordt niet vertrouwd.
// Bestanden die met _ beginnen worden door Vercel niet als losse API-route gepubliceerd.
// Let op: de data-value's in scan.html moeten exact overeenkomen met de sleutels hieronder.

export const VRAGEN = {
  social: {
    main_platform:    { cat: 'platforms', scores: { 'Instagram': 80, 'Facebook': 80, 'TikTok': 90, 'LinkedIn': 80, 'Instagram + Facebook': 90, 'Instagram + TikTok': 100, 'Not really active': 0 } },
    posting_freq:     { cat: 'platforms', scores: { 'Rarely or never': 0, '1-2x per week': 40, '3-4x per week': 75, 'Daily': 100 } },
    growth:           { cat: 'platforms', scores: { 'Not tracked': 10, 'Shrinking': 25, 'About the same': 45, 'Growing slowly': 75, 'Growing fast': 100 } },
    short_video:      { cat: 'instagram', scores: { 'Never': 0, 'Sometimes': 40, 'Regularly': 80, 'It is our main format': 100 } },
    stories:          { cat: 'instagram', scores: { 'Never': 0, 'Sometimes': 30, 'Weekly': 60, 'Daily': 100 } },
    profile_cta:      { cat: 'instagram', scores: { 'Nowhere': 0, 'Website': 50, 'WhatsApp or booking': 80, 'Clear CTA plus WhatsApp or booking': 100 } },
    engagement_rate:  { cat: 'engagement', scores: { 'I have no idea': 10, 'Under 1%': 25, '1-3%': 55, '3-6%': 80, 'Above 6%': 100 } },
    reply_speed:      { cat: 'engagement', scores: { 'Never': 0, 'Eventually': 20, 'Within 24 hours': 70, 'Within 1 hour': 100 } },
    content_type:     { cat: 'content', scores: { 'Stock photos or reposts': 10, 'Own photos only': 40, 'Mix of photos and video': 70, 'Professional video-first': 100 } },
    content_plan:     { cat: 'content', scores: { 'No plan': 0, 'Post when inspired': 20, 'Loose schedule': 55, 'Full content calendar': 100 } },
    customer_content: { cat: 'content', scores: { 'Never': 10, 'Rarely': 30, 'Sometimes': 60, 'Often and we share it': 100 } }
  },
  marketing: {
    positioning:        { cat: 'brand', scores: { 'Not at all': 0, 'In my head, not written down': 25, 'Yes, a positioning statement': 70, 'Yes, used consistently everywhere': 100 } },
    visual_consistency: { cat: 'brand', scores: { 'Very inconsistent': 0, 'Somewhat consistent': 35, 'Mostly consistent': 70, 'Fully consistent everywhere': 100 } },
    clarity:            { cat: 'brand', scores: { 'Not clear at all': 0, 'Somewhat clear': 35, 'Pretty clear': 65, 'Crystal clear, immediately': 100 } },
    ideal_customer:     { cat: 'audience', scores: { 'I serve anyone who needs me': 0, 'I have a rough idea': 30, 'I have a clear customer description': 70, 'Detailed profiles backed by data': 100 } },
    reviews:            { cat: 'audience', scores: { 'No reviews yet': 0, 'Reviews but rarely respond': 30, 'Ask sometimes and respond sometimes': 65, 'Ask after every service and respond to every review': 100 } },
    customer_source:    { cat: 'audience', scores: { 'No idea': 0, 'A rough sense': 35, 'I track most sources': 70, 'Track all sources and use the data': 100 } },
    website:            { cat: 'channels', scores: { 'No website': 0, 'Outdated or not mobile-friendly': 20, 'Basic, reasonably current': 55, 'Optimized and regularly updated': 100 } },
    google_profile:     { cat: 'channels', scores: { 'I do not have one': 0, 'Set up but not managed': 30, 'Active with photos and reviews': 75, 'Fully optimized with regular updates': 100 } },
    ai_visibility:      { cat: 'channels', scores: { 'Never checked': 10, 'No': 25, 'Sometimes': 60, 'Yes, every time': 100 } },
    whatsapp_email:     { cat: 'channels', scores: { 'Neither': 0, 'Occasionally': 35, 'Regularly for one': 65, 'Both actively': 100 } },
    paid_ads:           { cat: 'channels', scores: { 'No': 0, 'Tried without a plan': 25, 'Yes with some targeting': 60, 'Yes with tracking and optimization': 100 } },
    marketing_plan:     { cat: 'strategy', scores: { 'No': 0, 'In my head not written': 20, 'Yes a basic plan': 55, 'Yes detailed with goals and timeline': 100 } },
    budget:             { cat: 'strategy', scores: { 'No budget': 0, 'Flexible depends on the month': 25, 'Yes a rough budget': 55, 'Clear budget with channel allocation': 100 } },
    tracking:           { cat: 'strategy', scores: { 'Not at all': 0, 'Occasionally check social numbers': 25, 'Track some KPIs regularly': 65, 'Track all metrics and optimize': 100 } },
    marketing_time:     { cat: 'strategy', scores: { 'Rarely or never': 0, 'When I have time': 25, 'Planned at least weekly': 65, 'Daily its structured': 100 } }
  }
};

// Geeft { scores } terug, of null als er een vraag ontbreekt of een onbekend antwoord in zit
export function berekenScores(type, antwoorden) {
  const vragen = VRAGEN[type];
  if (!vragen || !antwoorden || typeof antwoorden !== 'object') return null;
  const perCat = {};
  for (const [key, { cat, scores }] of Object.entries(vragen)) {
    const punten = scores[antwoorden[key]];
    if (punten === undefined) return null;
    (perCat[cat] ||= []).push(punten);
  }
  const scores = {};
  for (const [cat, lijst] of Object.entries(perCat)) {
    scores[cat] = Math.round(lijst.reduce((a, b) => a + b, 0) / lijst.length);
  }
  return scores;
}

export const SECTOREN = {
  hotel:      { prompt: 'hotel or resort',                        groep: 'hotels and resorts on Curaçao',       naam: 'Hotel / Resort' },
  restaurant: { prompt: 'restaurant or café',                     groep: 'restaurants on Curaçao',              naam: 'Restaurant / Café' },
  makelaar:   { prompt: 'real estate agency',                     groep: 'real estate agencies on Curaçao',     naam: 'Real Estate' },
  airbnb:     { prompt: 'vacation rental or short-term rental',   groep: 'vacation rentals on Curaçao',         naam: 'Vacation Rental' },
  retail:     { prompt: 'retail business or shop',                groep: 'shops and retailers on Curaçao',      naam: 'Retail / Shop' },
  finance:    { prompt: 'bank or financial services company',     groep: 'banks and financial services on Curaçao', naam: 'Finance / Banking' },
  anders:     { prompt: 'local business (sector unknown, do not assume hospitality or tourism)', groep: 'local businesses on Curaçao', naam: 'Other' }
};

// Leest de homepage van de klant als platte tekst, zodat het rapport iets echts over het bedrijf kan zeggen.
// Faalt stil: geen of een onbereikbare website levert een lege string op.
export async function leesWebsite(invoer) {
  try {
    if (!invoer || typeof invoer !== 'string' || invoer.length > 300) return '';
    const url = new URL(/^https?:\/\//i.test(invoer.trim()) ? invoer.trim() : `https://${invoer.trim()}`);
    if (!['http:', 'https:'].includes(url.protocol)) return '';
    const host = url.hostname.toLowerCase();
    // Geen interne adressen of losse IP-adressen
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || /^[\d.]+$/.test(host) || host.includes(':')) return '';

    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FUNkinessScan/1.0; +https://funkiness.ai/scan)' }
    });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return '';
    const html = (await res.text()).slice(0, 400000);

    const ontcijfer = t => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
    const titel = ontcijfer(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const beschrijving = ontcijfer(html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || '');
    const tekst = ontcijfer(html
      .replace(/<(script|style|noscript|svg|nav|footer)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    return [titel && `Title: ${titel}`, beschrijving && `Meta description: ${beschrijving}`, tekst && `Homepage text: ${tekst}`]
      .filter(Boolean).join('\n');
  } catch {
    return '';
  }
}
