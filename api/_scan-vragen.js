// Punten per antwoord. De server rekent hiermee, de score uit de browser wordt niet vertrouwd.
// Bestanden die met _ beginnen worden door Vercel niet als losse API-route gepubliceerd.
// Let op: de data-value's in scan.html moeten exact overeenkomen met de sleutels hieronder.

export const VRAGEN = {
  social: {
    main_platform:    { cat: 'platforms', scores: { 'Instagram': 80, 'Facebook': 80, 'TikTok': 80, 'LinkedIn': 80, 'YouTube': 80, 'WhatsApp Business': 80, 'Not really active': 0 } },
    posting_freq:     { cat: 'platforms', scores: { 'Rarely or never': 0, '1-2x per week': 40, '3-4x per week': 75, 'Daily': 100 } },
    growth:           { cat: 'platforms', scores: { 'Not tracked': 10, 'Shrinking': 25, 'About the same': 45, 'Growing slowly': 75, 'Growing fast': 100 } },
    short_video:      { cat: 'instagram', scores: { 'Never': 0, 'Sometimes': 40, 'Regularly': 80, 'It is our main format': 100 } },
    stories:          { cat: 'instagram', scores: { 'Never': 0, 'Sometimes': 30, 'Weekly': 60, 'Daily': 100 } },
    profile_cta:      { cat: 'instagram', scores: { 'Nowhere': 0, 'Website': 50, 'WhatsApp or booking': 80, 'Clear CTA plus WhatsApp or booking': 100 } },
    engagement_rate:  { cat: 'engagement', scores: { 'I have no idea': 10, 'Under 1%': 25, '1-3%': 55, '3-6%': 80, 'Above 6%': 100 } },
    reply_speed:      { cat: 'engagement', scores: { 'Never': 0, 'Eventually': 20, 'Within 24 hours': 70, 'Within 1 hour': 100 } },
    social_results:   { cat: 'engagement', scores: { 'No idea': 0, 'A rough sense': 35, 'We track it roughly': 70, 'We track it exactly': 100 } },
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
    social_presence:    { cat: 'channels', scores: { 'Not active': 0, 'Occasionally': 30, 'Weekly': 65, 'Several times a week with a plan': 100 } },
    direct_bookings:    { cat: 'channels', sectoren: ['hotel', 'airbnb', 'tours'], scores: { 'I do not know': 0, 'Almost all via platforms': 15, 'Mostly via platforms': 35, 'About half direct': 65, 'Mostly direct': 100 } },
    whatsapp_email:     { cat: 'channels', scores: { 'Neither': 0, 'Occasionally': 35, 'Regularly for one': 65, 'Both actively': 100 } },
    paid_ads:           { cat: 'channels', scores: { 'No': 0, 'Tried without a plan': 25, 'Yes with some targeting': 60, 'Yes with tracking and optimization': 100 } },
    marketing_plan:     { cat: 'strategy', scores: { 'No': 0, 'In my head not written': 20, 'Yes a basic plan': 55, 'Yes detailed with goals and timeline': 100 } },
    budget:             { cat: 'strategy', scores: { 'No budget': 0, 'Flexible depends on the month': 25, 'Yes a rough budget': 55, 'Clear budget with channel allocation': 100 } },
    tracking:           { cat: 'strategy', scores: { 'Not at all': 0, 'Occasionally check social numbers': 25, 'Track some KPIs regularly': 65, 'Track all metrics and optimize': 100 } },
    marketing_time:     { cat: 'strategy', scores: { 'Rarely or never': 0, 'When I have time': 25, 'Planned at least weekly': 65, 'Daily its structured': 100 } }
  }
};

// Geeft { scores } terug, of null als er een vraag ontbreekt of een onbekend antwoord in zit
export function berekenScores(type, antwoorden, sector) {
  const vragen = VRAGEN[type];
  if (!vragen || !antwoorden || typeof antwoorden !== 'object') return null;
  const perCat = {};
  for (const [key, { cat, scores, sectoren }] of Object.entries(vragen)) {
    if (sectoren && !sectoren.includes(sector)) continue;   // vraag geldt niet voor deze sector
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

// Vragen zonder punten: alleen context voor het rapport. Meerdere antwoorden mogelijk.
export const EXTRA_KANALEN = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'WhatsApp Business', 'None'];

export function extraKanalenGeldig(waarde) {
  if (typeof waarde !== 'string' || !waarde) return false;
  return waarde.split(', ').every(k => EXTRA_KANALEN.includes(k));
}

// Context zonder punten: richting voor het rapport
export const CONTEXT = {
  doel:    { vraag: 'Main goal for the next 6 months', opties: ['More customers or bookings', 'Better customers or higher prices', 'Fill quiet periods', 'More brand awareness', 'Grow in a new market'] },
  publiek: { vraag: 'Main audience', opties: ['Mostly locals', 'Mostly tourists and visitors', 'Locals and tourists', 'Other businesses (B2B)'] },
  wie:     { vraag: 'Who does the marketing', opties: ['I do it myself', 'Someone on my team', 'An agency or freelancer', 'Nobody really'] }
};

export function contextGeldig(c) {
  return c && Object.entries(CONTEXT).every(([k, { opties }]) => opties.includes(c[k]))
    && (c.uitdaging === undefined || c.uitdaging === '' || (typeof c.uitdaging === 'string' && c.uitdaging.length <= 500));
}

export function contextAlsTekst(c) {
  return [...Object.entries(CONTEXT).map(([k, { vraag }]) => `- ${vraag}: "${c[k]}"`),
    `- Biggest marketing challenge right now, in their own words: ${c.uitdaging ? `"${c.uitdaging.trim()}"` : 'not provided'}`].join('\n');
}

export const SECTOREN = {
  hotel:      { prompt: 'hotel or resort',                        groep: 'hotels and resorts',       naam: 'Hotel / Resort' },
  restaurant: { prompt: 'restaurant or café',                     groep: 'restaurants',              naam: 'Restaurant / Café' },
  makelaar:   { prompt: 'real estate agency',                     groep: 'real estate agencies',     naam: 'Real Estate' },
  airbnb:     { prompt: 'vacation rental or short-term rental',   groep: 'vacation rentals',         naam: 'Vacation Rental' },
  retail:     { prompt: 'retail business or shop',                groep: 'shops and retailers',      naam: 'Retail / Shop' },
  finance:    { prompt: 'bank or financial services company',     groep: 'banks and financial services', naam: 'Finance / Banking' },
  marketing:  { prompt: 'marketing, advertising or creative agency', groep: 'marketing and creative agencies', naam: 'Marketing / Agency' },
  tours:      { prompt: 'tour, activity, dive or car rental business', groep: 'tour and activity businesses', naam: 'Tours & Activities' },
  beauty:     { prompt: 'beauty, wellness or fitness business',    groep: 'beauty and wellness businesses', naam: 'Beauty & Wellness' },
  diensten:   { prompt: 'professional services firm (legal, accounting, consultancy)', groep: 'professional services firms', naam: 'Professional Services' },
  anders:     { prompt: 'local business (sector unknown, do not assume hospitality or tourism)', groep: 'local businesses', naam: 'Other' }
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

// Vraagtekst zoals de klant hem op scan.html ziet, zodat de AI de vraag niet verkeerd leest
export const VRAAGTEKST = {
  main_platform: 'What is your main social media platform?',
  other_channels: 'Where else are you active? (multiple answers possible)',
  posting_freq: 'How often do you post on your main platform?',
  growth: 'Is your audience growing?',
  short_video: 'Do you post short videos? (Reels, TikTok, Shorts)',
  stories: 'How often do you post Stories?',
  profile_cta: 'Where does your profile send people?',
  engagement_rate: 'What is your average engagement rate? (likes + comments / followers)',
  reply_speed: 'How fast do you reply to comments and DMs?',
  social_results: 'Do you know how many customers or leads social media brings you?',
  content_type: 'What type of content do you mainly post?',
  content_plan: 'Do you work with a content plan?',
  customer_content: 'Do customers post about you or tag you? (content made by customers, not by the business)',
  positioning: 'Do you have a clear description of what makes your business different?',
  visual_consistency: 'How consistent is your visual identity (logo, colors, fonts) across all your channels?',
  clarity: "When someone finds your business, how quickly do they know what you do and who you're for?",
  ideal_customer: 'How well can you describe your ideal customer?',
  reviews: 'How do you handle online reviews? (Google, TripAdvisor, Booking)',
  customer_source: 'Do you know where your customers come from?',
  website: 'Do you have a mobile-friendly, up-to-date website?',
  google_profile: 'Is your Google Business Profile active?',
  ai_visibility: 'If someone asks ChatGPT for a business like yours in your area, do you show up?',
  social_presence: 'How active is your business on social media?',
  direct_bookings: 'How many of your bookings come in directly, instead of via platforms like Booking.com, Airbnb or Expedia?',
  whatsapp_email: 'Do you use WhatsApp or email to stay in touch with existing customers?',
  paid_ads: 'Do you run paid advertising?',
  marketing_plan: 'Do you have a written marketing plan?',
  budget: 'Do you have a dedicated marketing budget?',
  tracking: 'Do you actively track your marketing results?',
  marketing_time: 'How often do you actively work on your marketing?'
};

export function antwoordenAlsTekst(type, antwoorden) {
  return [...(type === 'social' ? ['other_channels'] : []), ...Object.keys(VRAGEN[type])]
    .filter(key => antwoorden[key] !== undefined)
    .map(key => `- Q: ${VRAAGTEKST[key]}\n  A: "${antwoorden[key]}"`)
    .join('\n');
}

// Feiten met herleidbare bron. Alleen deze feiten mag het rapport noemen.
// Bij wijzigen: eerst de bron openen en het nieuwste cijfer overnemen, nooit uit het hoofd.
// voor: 'social' | 'marketing' | 'beide'; sectoren: alleen tonen bij deze sectoren (leeg = alle)
export const FEITEN = [
  // Curaçao
  { id: 'F1', voor: 'beide', locaties: ['curacao'], sectoren: ['hotel', 'restaurant', 'airbnb', 'tours'],
    tekst: 'Curaçao welcomed a record 788,427 stay-over visitors in 2025, up 13% from 2024. In December 2025 the largest source markets were the Netherlands (26,243 visitors) and the United States (20,423 visitors).',
    bron: 'Curaçao Tourist Board, January 2026', url: 'https://www.curacaotouristboard.com/2026/01/13/a-successful-year-for-curacao-tourism-stayover-arrivals-reach-record-of-788000-in-2025/' },
  { id: 'F2', voor: 'beide', locaties: ['curacao'], sectoren: [],
    tekst: 'Curaçao has 126,000 internet users (68.1% of the population), 108,000 social media user identities (58.1%) and 177,000 mobile connections (95.6%), as of late 2025.',
    bron: 'DataReportal, Digital 2026: Curaçao', url: 'https://datareportal.com/reports/digital-2026-curacao' },
  { id: 'F3', voor: 'beide', locaties: ['curacao'], sectoren: [],
    tekst: 'Ad audience on Curaçao in late 2025: Facebook 108,000 (58.1% of the population), TikTok 102,000 adults (66.7% of adults), LinkedIn 93,000 members (50.1% of the population), Instagram 68,000 (36.7% of the population). These are advertising reach figures, not unique users.',
    bron: 'DataReportal, Digital 2026: Curaçao', url: 'https://datareportal.com/reports/digital-2026-curacao' },
  // Aruba
  { id: 'F11', voor: 'beide', locaties: ['aruba'], sectoren: ['hotel', 'restaurant', 'airbnb', 'tours'],
    tekst: 'Aruba welcomed 1,515,102 stay-over visitors in 2025 (preliminary figure), up from 1,421,686 in 2024.',
    bron: 'Centrale Bank van Aruba, tourism indicators', url: 'https://www.cbaruba.org/readBlob.do?id=19182' },
  { id: 'F12', voor: 'beide', locaties: ['aruba'], sectoren: [],
    tekst: 'Aruba has 105,000 internet users (97.2% of the population), 88,000 social media user identities (81.4%) and 149,000 mobile connections (138%), as of late 2025.',
    bron: 'DataReportal, Digital 2026: Aruba', url: 'https://datareportal.com/reports/digital-2026-aruba' },
  { id: 'F13', voor: 'beide', locaties: ['aruba'], sectoren: [],
    tekst: 'Ad audience on Aruba in late 2025: Facebook 85,100 (78.7% of the population), LinkedIn 73,000 members (67.5%), Instagram 66,000 (61.0%). These are advertising reach figures, not unique users.',
    bron: 'DataReportal, Digital 2026: Aruba', url: 'https://datareportal.com/reports/digital-2026-aruba' },
  // Bonaire (DataReportal rapporteert Bonaire, Sint Eustatius en Saba samen; geen officieel jaartotaal toerisme gevonden)
  { id: 'F21', voor: 'beide', locaties: ['bonaire'], sectoren: ['hotel', 'restaurant', 'airbnb', 'tours'],
    tekst: 'Bonaire welcomed 19,540 stay-over visitors in December 2025 (preliminary), up 1.9% from December 2024. The Netherlands (43.9%) and the United States (31.9%) were the largest markets that month.',
    bron: 'Tourism Corporation Bonaire, January 2026', url: 'https://bonaireisland.com/?p=15508' },
  { id: 'F22', voor: 'beide', locaties: ['bonaire'], sectoren: [],
    tekst: 'Bonaire, Sint Eustatius and Saba together have 22,100 internet users (70.1% of the population), 21,700 social media user identities (68.7%) and 48,900 mobile connections (155%), as of late 2025. These figures are for the three islands combined.',
    bron: 'DataReportal, Digital 2026: Bonaire, Sint Eustatius and Saba', url: 'https://datareportal.com/reports/digital-2026-bonaire-sint-eustatius-and-saba' },
  // Nederland
  { id: 'F31', voor: 'beide', locaties: ['nederland'], sectoren: ['hotel', 'restaurant', 'airbnb', 'tours'],
    tekst: 'Hotels, campsites and holiday parks in the Netherlands received about 52.2 million guests in 2025, almost 2% more than in 2024. International guests grew 5% to 22.3 million, Dutch guests dipped slightly to 29.9 million.',
    bron: 'CBS (Statistics Netherlands), April 2026', url: 'https://www.cbs.nl/en-gb/news/2026/16/fewer-overnight-stays-by-dutch-guests-more-international-visitors-in-2025' },
  { id: 'F32', voor: 'beide', locaties: ['nederland'], sectoren: [],
    tekst: 'The Netherlands has 18.2 million internet users (99.0% of the population) and 15.3 million social media user identities (83.3%), as of late 2025.',
    bron: 'DataReportal, Digital 2026: The Netherlands', url: 'https://datareportal.com/reports/digital-2026-netherlands' },
  { id: 'F33', voor: 'beide', locaties: ['nederland'], sectoren: [],
    tekst: 'Ad audience in the Netherlands in late 2025: LinkedIn 14.0 million members (76.2% of the population), Instagram 8.15 million (44.4%), Facebook 7.50 million (40.8%), TikTok 6.30 million adults (41.9% of adults). These are advertising reach figures, not unique users.',
    bron: 'DataReportal, Digital 2026: The Netherlands', url: 'https://datareportal.com/reports/digital-2026-netherlands' },
  // Elders: wereldwijde cijfers
  { id: 'F41', voor: 'beide', locaties: ['elders'], sectoren: ['hotel', 'restaurant', 'airbnb', 'tours'],
    tekst: 'International tourist arrivals worldwide grew about 4% in 2025, to an estimated 1.52 billion.',
    bron: 'UN Tourism, World Tourism Barometer, January 2026', url: 'https://www.hospitalitynet.org/news/4130515.html' },
  { id: 'F42', voor: 'beide', locaties: ['elders'], sectoren: [],
    tekst: 'Worldwide there are 6.04 billion internet users (73.2% of the population), 5.66 billion social media user identities (68.7%) and 5.78 billion unique mobile users (70.1%), as of October 2025.',
    bron: 'DataReportal, Digital 2026 Global Overview Report', url: 'https://datareportal.com/reports/digital-2026-global-overview-report' },
  // Platformfeiten: gelden overal
  { id: 'F4', voor: 'social', locaties: [], sectoren: [],
    tekst: 'Instagram says the most important actions it predicts in Explore are likes, saves and shares, and that Explore looks at how many people, and how quickly, like, comment on, share and save a post.',
    bron: 'Instagram, Instagram Ranking Explained (2023)', url: 'https://about.instagram.com/blog/announcements/instagram-ranking-explained' },
  { id: 'F5', voor: 'social', locaties: [], sectoren: [],
    tekst: 'For Reels, Instagram predicts how likely someone is to reshare a reel, watch it all the way through, like it and go to the audio page.',
    bron: 'Instagram, Instagram Ranking Explained (2023)', url: 'https://about.instagram.com/blog/announcements/instagram-ranking-explained' },
  { id: 'F6', voor: 'social', locaties: [], sectoren: [],
    tekst: 'For Stories, Instagram looks at how often someone views an account\'s stories and how often they engage with them, for example by sending a like or a DM.',
    bron: 'Instagram, Instagram Ranking Explained (2023)', url: 'https://about.instagram.com/blog/announcements/instagram-ranking-explained' },
  { id: 'F7', voor: 'social', locaties: [], sectoren: [],
    tekst: 'Instagram Stories disappear from Feed, the profile and Direct after 24 hours, unless they are added to a Highlight.',
    bron: 'Instagram Help Center', url: 'https://help.instagram.com/1729008150678239' },
  { id: 'F8', voor: 'marketing', locaties: [], sectoren: [],
    tekst: 'Google ranks local results mainly on relevance, distance and prominence. Google states: "More reviews and positive ratings can help your business\'s local ranking."',
    bron: 'Google Business Profile Help', url: 'https://support.google.com/business/answer/7091?hl=en' },
  { id: 'F9', voor: 'marketing', locaties: [], sectoren: [],
    tekst: 'Google states: "When you reply to customer reviews, it shows that you value their feedback."',
    bron: 'Google Business Profile Help', url: 'https://support.google.com/business/answer/7091?hl=en' },
  { id: 'F10', voor: 'marketing', locaties: [], sectoren: [],
    tekst: 'OpenAI uses its OAI-SearchBot crawler to surface websites in ChatGPT search. Sites that block OAI-SearchBot are not shown in ChatGPT search answers.',
    bron: 'OpenAI, Overview of OpenAI Crawlers', url: 'https://developers.openai.com/api/docs/bots' }
];

export function feitenVoor(type, sector, locatie) {
  return FEITEN.filter(f => (f.voor === 'beide' || f.voor === type)
    && (!f.sectoren.length || f.sectoren.includes(sector))
    && (!f.locaties.length || f.locaties.includes(locatie)));
}

export const LOCATIES = {
  curacao:   { naam: 'Curaçao',          in: 'on Curaçao' },
  aruba:     { naam: 'Aruba',            in: 'on Aruba' },
  bonaire:   { naam: 'Bonaire',          in: 'on Bonaire' },
  nederland: { naam: 'the Netherlands',  in: 'in the Netherlands' },
  elders:    { naam: 'outside the Caribbean Netherlands and Aruba', in: 'in their area' }
};

export function feitenAlsTekst(feiten) {
  return feiten.map(f => `[${f.id}] ${f.tekst}`).join('\n');
}

// Regels die elk rapport volgt: niets verzinnen
export const REGELS_GEEN_VERZINSELS = `HARD RULES, NOTHING MAY BE MADE UP:
- Your text contains NO factual claims of your own. Do not explain how platforms, algorithms, search engines, markets, customers or "most businesses" behave.
- The ONLY exception: you may quote a fact from the FACTS list, using its figures and wording exactly, followed by its id in square brackets like [F3], and place it next to what their answer says. Never add a cause or effect the fact does not state. A fact about Instagram may only be used about Instagram.
- You may only write about: (1) what their answers say, using their exact answer, (2) what is literally in their website text or bio, (3) recommendations, never as a promise or a guaranteed effect.
- Write recommendations as bold, direct commands with energy, like a coach who believes in them. Write your own commands that fit this business; never reuse stock phrases. Avoid weak openers like "Try", "Consider" or "You might".
- No guesses presented as facts ("likely means", "you are losing", "is costing you", "is invisible", "the algorithm rewards").
- Never claim what other businesses, competitors or "fast movers" do.
- Never invent or change numbers, frequencies or percentages. The only numbers allowed are the ones in their answers.
- Plain text only: no markdown, no asterisks, no em dash, no " - " as a separator. Square brackets only for fact ids like [F3]. Numbered steps go on their own line ("1. ...").`;

// Zet [F3]-verwijzingen om naar [1], [2] ... en geeft de gebruikte bronnen terug.
// Verwijzingen naar onbekende feiten worden weggehaald.
export function verwerkBronnen(velden, feiten) {
  const perId = Object.fromEntries(feiten.map(f => [f.id, f]));
  const gebruikt = [];
  // Feiten met dezelfde bron (url) krijgen hetzelfde nummer
  const nummer = id => {
    let i = gebruikt.findIndex(g => perId[g].url === perId[id].url);
    if (i === -1) { gebruikt.push(id); i = gebruikt.length - 1; }
    return i + 1;
  };
  const uit = {};
  for (const [k, v] of Object.entries(velden)) {
    if (typeof v !== 'string') { uit[k] = v; continue; }
    uit[k] = v.replace(/\s*\[(F\d+)(?:\s*,\s*(F\d+))*\]/g, (m) => {
      const ids = m.match(/F\d+/g).filter(id => perId[id]);
      return ids.length ? ' ' + [...new Set(ids.map(nummer))].map(n => `[${n}]`).join('') : '';
    });
  }
  const bronnen = gebruikt.map((id, i) => ({ nr: i + 1, bron: perId[id].bron, url: perId[id].url }));
  return { velden: uit, bronnen };
}

// Haalt opmaakresten uit AI-tekst: sterretjes, emdashes, losse aanhalingstekens aan begin of eind
export function schoonTekst(t) {
  if (typeof t !== 'string') return t;
  let s = t
    .replace(/\\"/g, '"')                         // escape-resten van de controleur
    .replace(/\*+/g, '')
    .replace(/\s*\u2014\s*/g, ', ')
    .replace(/ - /g, ', ')                          // geen spatie-koppelteken-spatie als scheiding
    .replace(/\s*\[(?!F\d+(?:\s*,\s*F\d+)*\])[^\]]*\]/g, '') // haakjes die geen bronverwijzing zijn
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const quotes = (s.match(/"/g) || []).length;
  if (quotes % 2 === 1) s = s.replace(/^"|"$/g, '');
  return s.trim();
}

// Getallen in de AI-tekst die nergens in de prompt staan, zijn verzonnen
export function verzonnenGetallen(velden, prompt) {
  const inPrompt = new Set((prompt.match(/\d[\d.,]*/g) || []).map(n => n.replace(/[.,]$/, '')));
  const verdacht = new Set();
  for (const v of Object.values(velden)) {
    if (typeof v !== 'string') continue;
    for (const n of v.replace(/\[F\d+\]/g, '').match(/\d[\d.,]*/g) || []) {
      const schoon = n.replace(/[.,]$/, '');
      if (!inPrompt.has(schoon) && !/^(1|2|3|4|5|20|30)$/.test(schoon)) verdacht.add(schoon);
    }
  }
  return [...verdacht];
}

// Tweede stap: een strenge controleur legt elke zin naast feiten, antwoorden en website
// en herschrijft alleen wat er niet uit volgt. Valt terug op het concept als de controle mislukt.
export async function controleerRapport({ client, model, feitenTekst, antwoordenTekst, websiteInhoud, bio, concept, verdacht = [] }) {
  const tekstVelden = Object.fromEntries(Object.entries(concept).filter(([, v]) => typeof v === 'string'));
  // In drie groepen tegelijk controleren: zelfde regels, een derde van de wachttijd
  const sleutels = Object.keys(tekstVelden);
  const groepen = [0, 1, 2].map(g => sleutels.filter((_, i) => i % 3 === g)).filter(g => g.length);

  const controleerGroep = async (keys) => {
    const groep = Object.fromEntries(keys.map(k => [k, tekstVelden[k]]));
    const prompt = `You are a strict checker for a business scan report. The report text may contain NO factual claims of its own.

FACTS (may only be quoted exactly, with their [F#]):
${feitenTekst}

THE CLIENT'S EXACT ANSWERS:
${antwoordenTekst}

THEIR WEBSITE TEXT: ${websiteInhoud || 'none provided'}
THEIR BIO: ${bio || 'none provided'}

DRAFT REPORT TEXT (JSON, part of the report):
${JSON.stringify(groep, null, 2)}

${verdacht.length ? `These numbers appear in the draft but not in the answers, website, bio or FACTS, so they are made up and must be removed: ${verdacht.join(', ')}.\n\n` : ''}Go through every field, sentence by sentence. A sentence is allowed only if it does one of these:
(a) states what their answers say, matching the exact answer,
(b) states what is literally in their website text or bio,
(c) gives a recommendation or a concrete step as a direct command ("Add", "Pick", "Start with"), without promising an effect,
(d) quotes a fact from the FACTS list with the same figures and meaning, followed by its correct [F#], and places it next to their answer without adding a cause or effect. Check the figures and the [F#] against the FACTS list; fix or remove any mismatch.
Rewrite or remove every other sentence, for example: claims about how platforms, algorithms, search engines, markets or customers work; claims about other businesses or "most businesses"; guesses presented as facts ("likely", "you are losing", "is costing you", "invisible", "the algorithm"); promised effects ("will grow", "unlocks", "turns browsers into bookers"); statistics; any number that is not in their answers.
Keep allowed sentences exactly as they are. When you rewrite, keep the FUNkiness! tone: bold, positive, direct commands with energy ("Put it in your bio today."), never weak openers like "Try" or "Consider". Plain text only, no markdown, no em dash. Keep [F#] markers on correct fact quotes. Keep line breaks and numbered steps.

Call submit_checked_report once with every field from this draft part, corrected.`;
    const checkTool = {
      name: 'submit_checked_report',
      description: 'Submit the corrected report text.',
      input_schema: {
        type: 'object',
        properties: Object.fromEntries(keys.map(k => [k, { type: 'string' }])),
        required: keys
      }
    };
    for (let poging = 1; poging <= 2; poging++) {
      try {
        const message = await client.messages.create({
          model,
          max_tokens: 4000,
          output_config: { effort: 'low' },
          tools: [checkTool],
          tool_choice: { type: 'auto' },
          messages: [{ role: 'user', content: prompt }]
        });
        const toolUse = message.content.find(block => block.type === 'tool_use');
        const uit = toolUse?.input || {};
        const kapotVeld = !toolUse ? '(geen tool_use, stop: ' + message.stop_reason + ')'
          : keys.find(k => typeof uit[k] !== 'string' || (groep[k] && !uit[k].trim()) || /<\/?\w|parameter name=/.test(uit[k]));
        if (!kapotVeld) return Object.fromEntries(keys.map(k => [k, uit[k]]));
        console.warn(`Controle poging ${poging} onvolledig:`, kapotVeld, JSON.stringify(uit[kapotVeld])?.slice(0, 300));
      } catch (err) {
        console.error(`Controle poging ${poging} mislukt:`, err.message);
      }
    }
    // Nooit ongecontroleerde tekst naar de klant: deze onderdelen worden leeg en de code vult ze veilig aan
    console.error('Controle mislukt voor:', keys.join(', '));
    return Object.fromEntries(keys.map(k => [k, '']));
  };

  const resultaten = await Promise.all(groepen.map(controleerGroep));
  return Object.assign({ ...concept }, ...resultaten);
}

// Bouwt het blok "Worth knowing": de gekozen feiten letterlijk uit de bronnenlijst, met genummerde bronnen
export function feitenBlok(gekozenIds, feiten, tekstVelden = {}) {
  const geldig = [...new Set(Array.isArray(gekozenIds) ? gekozenIds : [])].filter(id => feiten.some(f => f.id === id)).slice(0, 3);
  const ids = geldig.length ? geldig : feiten.slice(0, 2).map(f => f.id);
  const bronnen = [];
  const nummerVoor = f => {
    let b = bronnen.find(x => x.url === f.url);
    if (!b) { b = { nr: bronnen.length + 1, bron: f.bron, url: f.url }; bronnen.push(b); }
    return b.nr;
  };
  // [F#] in de tekst omzetten naar bronnummers; onbekende verwijzingen verdwijnen
  const velden = Object.fromEntries(Object.entries(tekstVelden).map(([k, v]) => [k, typeof v !== 'string' ? v
    : v.replace(/\s*\[(F\d+(?:\s*,\s*F\d+)*)\]/g, (m, lijst) => {
        const nrs = [...new Set(lijst.split(/\s*,\s*/).map(id => feiten.find(f => f.id === id)).filter(Boolean).map(nummerVoor))];
        return nrs.length ? ' ' + nrs.map(n => `[${n}]`).join('') : '';
      })]));
  const items = ids.map(id => {
    const f = feiten.find(x => x.id === id);
    return { tekst: f.tekst, nr: nummerVoor(f) };
  });
  return { items, bronnen, velden };
}

// Veilige vervanging als de controle van een categorie mislukt: alleen de eigen antwoorden van de klant
export function antwoordenSamenvatting(type, cat, antwoorden) {
  return Object.entries(VRAGEN[type])
    .filter(([k, v]) => v.cat === cat && antwoorden[k] !== undefined)
    .map(([k]) => `${VRAAGTEKST[k]} Your answer: "${antwoorden[k]}".`)
    .join('\n');
}

// Echte openbare Instagram-cijfers via de officiële Instagram API (Business Discovery).
// Werkt alleen voor zakelijke en creator-accounts. Zonder sleutel, of bij een privé/persoonlijk account: null.
// Alle cijfers rekent de code uit; de AI krijgt ze als feit met bron.
export async function leesInstagram(invoer) {
  const igUser = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUser || !token || !invoer || typeof invoer !== 'string') return null;
  const handle = invoer.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;

  try {
    const velden = `business_discovery.username(${handle}){username,followers_count,media_count,media.limit(25){timestamp,like_count,comments_count,media_type,media_product_type}}`;
    const url = `https://graph.facebook.com/v26.0/${igUser}?fields=${encodeURIComponent(velden)}&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const json = await res.json();
    const bd = json?.business_discovery;
    if (!res.ok || !bd) {
      console.warn('Instagram niet gelezen:', handle, json?.error?.message?.slice(0, 120));
      return null;
    }

    const posts = (bd.media?.data || []).filter(p => p.timestamp);
    const vandaag = new Date();
    const datum = d => d.toISOString().slice(0, 10);
    const getal = n => n >= 100 ? Math.round(n).toLocaleString('en-US') : n.toFixed(1);
    const procent = n => n < 0.1 ? n.toFixed(2) : n.toFixed(1);
    const delen = [`${bd.followers_count.toLocaleString('en-US')} followers and ${bd.media_count.toLocaleString('en-US')} posts in total`];

    if (posts.length) {
      const tijden = posts.map(p => new Date(p.timestamp).getTime()).sort((a, b) => b - a);
      const nieuwste = new Date(tijden[0]);
      const oudste = new Date(tijden[tijden.length - 1]);
      const dagenSindsLaatste = Math.floor((vandaag - nieuwste) / 86400000);
      delen.push(`the latest post was ${dagenSindsLaatste === 0 ? 'today' : dagenSindsLaatste === 1 ? '1 day ago' : `${dagenSindsLaatste} days ago`} (${datum(nieuwste)})`);
      if (posts.length >= 2) {
        const weken = Math.max((tijden[0] - tijden[tijden.length - 1]) / (7 * 86400000), 1 / 7);
        delen.push(`the last ${posts.length} posts (${datum(oudste)} to ${datum(nieuwste)}) work out to ${(posts.length / weken).toFixed(1)} posts per week`);
      }
      const reels = posts.filter(p => p.media_product_type === 'REELS');
      delen.push(`${Math.round(reels.length / posts.length * 100)}% of the last ${posts.length} posts are Reels`);

      // Interacties alleen als likes zichtbaar zijn
      const metLikes = posts.filter(p => typeof p.like_count === 'number');
      if (metLikes.length >= 3) {
        const interacties = p => p.like_count + (p.comments_count || 0);
        const gem = lijst => lijst.reduce((s, p) => s + interacties(p), 0) / lijst.length;
        const gemAlles = gem(metLikes);
        delen.push(`these posts average ${getal(gemAlles)} likes plus comments each`);
        if (bd.followers_count > 0) delen.push(`that is an engagement rate of ${procent(gemAlles / bd.followers_count * 100)}% of followers per post`);
        const reelsMet = metLikes.filter(p => p.media_product_type === 'REELS');
        const andereMet = metLikes.filter(p => p.media_product_type !== 'REELS');
        if (reelsMet.length >= 2 && andereMet.length >= 2) {
          delen.push(`Reels average ${getal(gem(reelsMet))} likes plus comments versus ${getal(gem(andereMet))} for other posts`);
        }
      }
    }

    return {
      id: 'F90', voor: 'social', locaties: [], sectoren: [],
      tekst: `Public Instagram data for @${bd.username}, fetched on ${datum(vandaag)}: ${delen.join('; ')}.`,
      bron: `Instagram, public data of @${bd.username} (${datum(vandaag)})`,
      url: `https://www.instagram.com/${bd.username}/`
    };
  } catch (err) {
    console.warn('Instagram fout:', err.message);
    return null;
  }
}

// Objectieve website-check: alles gemeten door de code, niets door de AI.
// Geeft { inhoud, feit } terug: inhoud = homepagetekst voor de prompt, feit = meetresultaten als bronfeit F91.
export async function analyseerWebsite(invoer) {
  const leeg = { inhoud: '', feit: null };
  try {
    if (!invoer || typeof invoer !== 'string' || invoer.length > 300) return leeg;
    const url = new URL(/^https?:\/\//i.test(invoer.trim()) ? invoer.trim() : `https://${invoer.trim()}`);
    const host = url.hostname.toLowerCase();
    if (!['http:', 'https:'].includes(url.protocol) || !host.includes('.') || host === 'localhost'
      || host.endsWith('.local') || host.endsWith('.internal') || /^[\d.]+$/.test(host) || host.includes(':')) return leeg;

    const ua = { 'User-Agent': 'Mozilla/5.0 (compatible; FUNkinessScan/1.0; +https://funkiness.ai/scan)' };
    const t0 = Date.now();
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(8000), headers: ua });
    if (res.status === 401 || res.status === 403 || res.status === 429) return { ...leeg, status: 'blocked' };
    if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return { ...leeg, status: 'unreadable' };
    const ruweHtml = await res.text();
    const seconden = (Date.now() - t0) / 1000;
    const html = ruweHtml.slice(0, 600000);
    const eind = new URL(res.url || url);

    // Robots.txt en sitemap tegelijk ophalen
    const haal = p => fetch(new URL(p, eind.origin), { signal: AbortSignal.timeout(4000), headers: ua, redirect: 'follow' })
      .then(async r => ({ ok: r.ok, tekst: r.ok ? (await r.text()).slice(0, 100000) : '' })).catch(() => ({ ok: false, tekst: '' }));
    const [robots, sitemap] = await Promise.all([haal('/robots.txt'), haal('/sitemap.xml')]);

    const ontcijfer = t => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
    const titel = ontcijfer(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
    const metaInhoud = naam => ontcijfer(
      html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${naam}["'][^>]*content=["']([^"']*)["']`, 'i'))?.[1]
      || html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${naam}["']`, 'i'))?.[1] || '').trim();
    const beschrijving = metaInhoud('description');
    const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    const h1 = (html.match(/<h1[\s>]/gi) || []).length;
    const ogBeeld = !!metaInhoud('og:image');
    const taal = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] || '';
    const ldTypes = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(m => [...m[1].matchAll(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]*)\])/g)].flatMap(t => (t[1] || t[2] || '').replace(/"/g, '').split(',').map(s => s.trim())))
      .filter(Boolean);
    const whatsapp = /href=["'][^"']*(wa\.me|api\.whatsapp\.com|whatsapp:\/\/)/i.test(html);
    const telefoon = /href=["']tel:/i.test(html);
    const mail = /href=["']mailto:/i.test(html);

    // Robots.txt: mag OAI-SearchBot de homepage lezen?
    let openai = robots.ok ? 'allowed' : 'no robots.txt found, so allowed by default';
    if (robots.ok) {
      const groepen = []; let huidig = null;
      for (const regel of robots.tekst.split(/\r?\n/).map(r => r.replace(/#.*/, '').trim()).filter(Boolean)) {
        const [k, ...rest] = regel.split(':'); const v = rest.join(':').trim(); const sleutel = k.trim().toLowerCase();
        if (sleutel === 'user-agent') { if (!huidig || huidig.regels.length) { huidig = { agents: [], regels: [] }; groepen.push(huidig); } huidig.agents.push(v.toLowerCase()); }
        else if (huidig && (sleutel === 'disallow' || sleutel === 'allow')) huidig.regels.push([sleutel, v]);
      }
      const groep = groepen.find(g => g.agents.includes('oai-searchbot')) || groepen.find(g => g.agents.includes('*'));
      if (groep && groep.regels.some(([s, v]) => s === 'disallow' && v === '/') && !groep.regels.some(([s, v]) => s === 'allow' && v === '/')) openai = 'blocked';
    }
    const heeftSitemap = sitemap.ok && /<(urlset|sitemapindex)/i.test(sitemap.tekst) || /^sitemap:/im.test(robots.tekst);

    const ja = b => b ? 'yes' : 'no';
    const metingen = [
      `secure connection (HTTPS): ${ja(eind.protocol === 'https:')}`,
      `homepage loaded in ${seconden.toFixed(1)} seconds from our server, ${Math.round(ruweHtml.length / 1024)} KB of HTML`,
      `mobile viewport tag: ${ja(viewport)}`,
      `page title: ${titel ? `"${titel.slice(0, 90)}" (${titel.length} characters)` : 'missing'}`,
      `meta description: ${beschrijving ? `present (${beschrijving.length} characters)` : 'missing'}`,
      `H1 headings on the homepage: ${h1}`,
      `structured data (JSON-LD): ${ldTypes.length ? [...new Set(ldTypes)].slice(0, 6).join(', ') : 'none found'}`,
      `social sharing image (og:image): ${ja(ogBeeld)}`,
      `language set in the page: ${taal || 'no'}`,
      `WhatsApp link: ${ja(whatsapp)}, phone link: ${ja(telefoon)}, email link: ${ja(mail)}`,
      `robots.txt for OAI-SearchBot (ChatGPT search): ${openai}`,
      `sitemap: ${heeftSitemap ? 'found' : 'not found'}`
    ];
    const datum = new Date().toISOString().slice(0, 10);
    const tekst = html
      .replace(/<(script|style|noscript|svg|nav|footer)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ');
    const inhoud = [titel && `Title: ${titel}`, beschrijving && `Meta description: ${beschrijving}`,
      `Homepage text: ${ontcijfer(tekst).replace(/\s+/g, ' ').trim().slice(0, 3000)}`].filter(Boolean).join('\n');

    return {
      inhoud,
      feit: {
        id: 'F91', voor: 'marketing', locaties: [], sectoren: [],
        tekst: `Website check of ${eind.hostname} by FUNkiness! on ${datum} (homepage only): ${metingen.join('; ')}.`,
        bron: `FUNkiness! website check of ${eind.hostname} (${datum})`,
        url: eind.href
      }
    };
  } catch (err) {
    console.warn('Website-check fout:', err.message);
    return { ...leeg, status: 'unreachable' };
  }
}

// Eerlijke regel voor de prompt als er wel een website is opgegeven maar die niet te lezen was
export function websiteRegel(site, inhoud, status) {
  if (inhoud) return `Their website (homepage text, fetched just now):\n${inhoud}\n`;
  if (!site) return 'Website: not provided\n';
  const reden = status === 'blocked' ? 'the site refused automated visits' : status === 'unreachable' ? 'the site could not be reached' : 'the page could not be read';
  return `Website: they gave ${site}, but our automatic check could not read it (${reden}). Do not describe its content and do not say they have no website.\n`;
}
