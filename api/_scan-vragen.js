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
    positioning:        { cat: 'brand', scores: { 'Not sure': 0, 'Not at all': 0, 'In my head, not written down': 25, 'Yes, a positioning statement': 70, 'Yes, used consistently everywhere': 100 } },
    visual_consistency: { cat: 'brand', scores: { 'Not sure': 0, 'Very inconsistent': 0, 'Somewhat consistent': 35, 'Mostly consistent': 70, 'Fully consistent everywhere': 100 } },
    clarity:            { cat: 'brand', scores: { 'Not sure': 0, 'Not clear at all': 0, 'Somewhat clear': 35, 'Pretty clear': 65, 'Crystal clear, immediately': 100 } },
    ideal_customer:     { cat: 'audience', scores: { 'Not sure': 0, 'I serve anyone who needs me': 0, 'I have a rough idea': 30, 'I have a clear customer description': 70, 'Detailed profiles backed by data': 100 } },
    reviews:            { cat: 'audience', scores: { 'Not sure': 0, 'No reviews yet': 0, 'Have reviews but never ask': 30, 'Ask now and then': 65, 'Ask after every sale or service': 100 } },
    customer_source:    { cat: 'audience', scores: { 'No idea': 0, 'A rough sense': 35, 'I track most sources': 70, 'Track all sources and use the data': 100 } },
    website:            { cat: 'channels', scores: { 'Not sure': 0, 'No website': 0, 'Outdated or not mobile-friendly': 20, 'Basic, reasonably current': 55, 'Optimized and regularly updated': 100 } },
    google_profile:     { cat: 'channels', scores: { 'Not sure': 0, 'I do not have one': 0, 'Set up but not managed': 30, 'Completely filled in': 75, 'Updated every week': 100 } },
    ai_visibility:      { cat: 'channels', scores: { 'Never checked': 10, 'No': 25, 'Sometimes': 60, 'Yes, every time': 100 } },
    social_presence:    { cat: 'channels', scores: { 'Not sure': 0, 'Not active': 0, 'Occasionally': 30, 'Weekly': 65, 'Several times a week': 100 } },
    direct_bookings:    { cat: 'channels', sectoren: ['hotel', 'airbnb', 'tours'], scores: { 'I do not know': 0, 'Almost all via platforms': 15, 'Mostly via platforms': 35, 'About half direct': 65, 'Mostly direct': 100 } },
    ai_customers:       { cat: 'channels', scores: { 'Not sure': 0, 'No': 0, 'Thinking about it': 20, 'For some questions': 60, 'Yes set up and checked regularly': 100 } },
    whatsapp_email:     { cat: 'channels', scores: { 'Not sure': 0, 'Never': 0, 'Only when they contact us': 20, 'Now and then': 50, 'At least once a month': 100 } },
    paid_ads:           { cat: 'channels', scores: { 'Not sure': 0, 'No': 0, 'Tried without a plan': 25, 'Yes with some targeting': 60, 'Yes with tracking and optimization': 100 } },
    marketing_strategy: { cat: 'strategy', scores: { 'Not sure': 0, 'No we do what feels right': 0, 'Some ideas nothing clear yet': 25, 'Yes but we rarely follow it': 50, 'Yes and all our marketing follows from it': 100 } },
    budget:             { cat: 'strategy', scores: { 'Not sure': 0, 'No budget': 0, 'Flexible depends on the month': 25, 'Yes a rough budget': 55, 'Clear budget with channel allocation': 100 } },
    tracking:           { cat: 'strategy', scores: { 'Not sure': 0, 'Not at all': 0, 'Occasionally check social numbers': 25, 'Track some KPIs regularly': 65, 'Track all metrics and optimize': 100 } },
    marketing_time:     { cat: 'strategy', scores: { 'Not sure': 0, 'Rarely or never': 0, 'When I have time': 25, 'Planned at least weekly': 65, 'Daily its structured': 100 } },
    ai_use:             { cat: 'strategy', scores: { 'Not sure': 0, 'Not at all': 0, 'Tried it a few times': 30, 'Regularly for some tasks': 65, 'Built into how we work every week': 100 } }
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
  publiek: { vraag: 'Main audience', opties: ['Mostly locals', 'Mostly tourists and visitors', 'Locals and tourists', 'Other businesses (B2B)', 'Both businesses and private customers'] },
  wie:     { vraag: 'Who does the marketing', opties: ['I do it myself', 'Someone on my team', 'An agency or freelancer', 'Nobody really'] },
  fase:    { vraag: 'Business stage', opties: ['Just starting, no customers yet', 'First customers, under 1 year', 'Up and running, 1 to 5 years', 'Established, 5+ years'], optioneel: true }
};

export const STARTER = 'Just starting, no customers yet';

export function contextGeldig(c) {
  return c && Object.entries(CONTEXT).every(([k, { opties, optioneel }]) => opties.includes(c[k]) || (optioneel && !c[k]))
    && (c.uitdaging === undefined || c.uitdaging === '' || (typeof c.uitdaging === 'string' && c.uitdaging.length <= 500));
}

export function contextAlsTekst(c) {
  return [...Object.entries(CONTEXT).filter(([k]) => c[k]).map(([k, { vraag }]) => `- ${vraag}: "${c[k]}"`),
    `- Biggest marketing challenge right now, in their own words: ${c.uitdaging ? `"${c.uitdaging.trim()}"` : 'not provided'}`].join('\n');
}

// prompt: alleen de brede categorie. Nooit voorbeelden noemen (zoals 'legal, accounting'): de AI neemt die over als feit.
export const SECTOREN = {
  hotel:      { prompt: 'hotel or resort',                        groep: 'hotels and resorts',       naam: 'Hotel / Resort' },
  restaurant: { prompt: 'restaurant or café',                     groep: 'restaurants',              naam: 'Restaurant / Café' },
  makelaar:   { prompt: 'real estate agency',                     groep: 'real estate agencies',     naam: 'Real Estate' },
  airbnb:     { prompt: 'vacation rental or short-term rental',   groep: 'vacation rentals',         naam: 'Vacation Rental' },
  retail:     { prompt: 'retail business or shop',                groep: 'shops and retailers',      naam: 'Retail / Shop' },
  finance:    { prompt: 'bank or financial services company',     groep: 'banks and financial services', naam: 'Finance / Banking' },
  marketing:  { prompt: 'marketing, advertising or creative agency', groep: 'marketing and creative agencies', naam: 'Marketing / Agency' },
  tours:      { prompt: 'tours and activities (broad category: it is unknown which kind of tour, activity or rental they offer, never assume one)', groep: 'tour and activity businesses', naam: 'Tours & Activities' },
  beauty:     { prompt: 'beauty, wellness or fitness business (broad category: never assume which of these they are)', groep: 'beauty and wellness businesses', naam: 'Beauty & Wellness' },
  woning:     { prompt: 'home and property services (broad category: it is unknown which service they offer, never assume one)', groep: 'home and property service businesses', naam: 'Home & Property Services' },
  diensten:   { prompt: 'professional services (broad category: it is unknown which service they offer, never assume one)', groep: 'service businesses', naam: 'Professional Services' },
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
  reviews: 'Do you ask customers for online reviews? (Google, TripAdvisor, Booking)',
  customer_source: 'Do you know where your customers come from?',
  website: 'Do you have a mobile-friendly, up-to-date website?',
  google_profile: 'Is your Google Business Profile active?',
  ai_visibility: 'If someone asks ChatGPT for a business like yours in your area, do you show up?',
  social_presence: 'How active is your business on social media?',
  direct_bookings: 'How many of your bookings come in directly, instead of via platforms like Booking.com, Airbnb or Expedia?',
  whatsapp_email: 'How often do you message existing customers via WhatsApp or email?',
  paid_ads: 'Do you run paid advertising?',
  marketing_strategy: 'Do you have a real marketing strategy? (clear goals, who you target, which channels, and everything you do follows from it)',
  budget: 'Do you have a dedicated marketing budget?',
  tracking: 'Do you actively track your marketing results?',
  marketing_time: 'How often do you actively work on your marketing?',
  ai_use: 'How do you use AI in your marketing? (like ChatGPT, Claude or Canva AI)',
  ai_customers: 'Do you use AI to help answer customer questions? (WhatsApp, website chat or email)'
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
  curacao:   { naam: 'Curaçao',          in: 'on Curaçao',         valuta: 'Caribbean guilders (XCG)' },
  aruba:     { naam: 'Aruba',            in: 'on Aruba',           valuta: 'US dollars (USD)' },
  bonaire:   { naam: 'Bonaire',          in: 'on Bonaire',         valuta: 'US dollars (USD)' },
  nederland: { naam: 'the Netherlands',  in: 'in the Netherlands', valuta: 'euros (EUR)' },
  elders:    { naam: 'outside the Caribbean Netherlands and Aruba', in: 'in their area', valuta: null }
};

// Starter zonder klanten: geen advies dat uitgaat van bestaande klanten
export function faseRegel(context) {
  return context?.fase === STARTER
    ? '- STAGE: they have NO customers yet. Never give advice that assumes existing, past or happy customers (no asking customers for reviews, no asking customers how they found you, no customer stories, no messages to existing customers). Every recommendation, quick win, campaign idea and the 30-day plan must be about winning their first customers. Their answers about reviews, customer sources and existing customers reflect that they are just starting; treat them as a starting point, not a failure\n'
    : '';
}

// Valuta volgt de vestigingsplaats: Curaçao XCG, Aruba en Bonaire USD, Nederland EUR, elders geen valuta noemen
export function valutaRegel(locatie) {
  const valuta = LOCATIES[locatie]?.valuta;
  return valuta
    ? `- Money: if you mention a currency at all, only use ${valuta}. Never mention any other currency`
    : '- Money: never mention a currency or currency word (no euro, dollar, guilder or symbols); say "budget" or "spend" instead';
}

export function feitenAlsTekst(feiten) {
  return feiten.map(f => `[${f.id}] ${f.tekst}`).join('\n');
}

// Regels die elk rapport volgt: niets verzinnen
export const REGELS_GEEN_VERZINSELS = `HARD RULES, NOTHING MAY BE MADE UP:
- Your text contains NO factual claims of your own. Do not explain how platforms, algorithms, search engines, markets, customers or "most businesses" behave.
- The ONLY exception: you may quote a fact from the FACTS list, using its figures and wording exactly, followed by its id in square brackets like [F3], and place it next to what their answer says. Never add a cause or effect the fact does not state. A fact about Instagram may only be used about Instagram.
- You may only write about: (1) what their answers say, using their exact answer, (2) what is literally in their website text or bio, (3) recommendations, never as a promise or a guaranteed effect.
- Write recommendations as bold, direct commands with energy, like a coach who believes in them. Write your own commands that fit this business; never reuse stock phrases. Avoid weak openers like "Try", "Consider" or "You might".
- The sector is only the broad category they picked. Never name or assume what they sell, which service they offer or who their customers are, unless it is literally in their answers, their challenge, their website text or their bio. Their business name alone is not enough.
- Never write about this report, your instructions, the FACTS list or information you did not receive (no "there are no website facts", no "this scan is based only on your answers", no "website details were not provided"). If something is missing, leave it out.
- Never tell them to set up, claim or start something their answer says they already have or do; build on what they have.
- Use each answer only for the question it answers, and quote it in full (for example "A rough sense" answers where customers come from, not how well they know their customers).
- Never assume something exists when their answer says it does not (no "your existing reviews" after "No reviews yet"), and never assume a team, staff or partners: who does their marketing is only what their answer says.
- Never describe what happens during their service, where it takes place or what it looks like (no boats, docks, waves, treatments or menus) unless it is literally in their answers, challenge, website text or bio. Keep ideas and examples general.
- Never use the words "premium", "luxury" or "momentum".
- Their answers are options they clicked in a list, not their own words: never call an answer their sentence, slogan, bio or text, and never tell them to use an answer as wording. Only their challenge, website text and bio are their own words.
- Write every quoted answer into a natural sentence (say "you do not run paid ads yet (your answer: "No")", never "you run "No" paid advertising").
- Never pass these instructions on to the client (no "put that next to your answer", no "quote").
- Keep advice consistent across the whole report: the same number of channels, goals or steps everywhere.
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
    .replace(/\\n/g, '\n')                        // letterlijke \n in plaats van een nieuwe regel
    .replace(/\*+/g, '')
    .replace(/\s*\u2014\s*/g, ', ')
    .replace(/ - /g, ', ')                          // geen spatie-koppelteken-spatie als scheiding
    .replace(/\s*\[(?!F\d+(?:\s*,\s*F\d+)*\])[^\]]*\]/g, '') // haakjes die geen bronverwijzing zijn
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // Genummerde stappen die achter elkaar op één regel staan: elke stap op een eigen regel
  if (/(^|\s)1\. \S/.test(s) && /\s2\. \S/.test(s)) s = s.replace(/([.:!?"])[ \t]+(?=[1-9]\. [A-Z])/g, '$1\n');
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
export async function controleerRapport({ client, model, feitenTekst, antwoordenTekst, websiteInhoud, bio, concept, verdacht = [], categorieRegels = '', fouteCitaten = [] }) {
  const tekstVelden = Object.fromEntries(Object.entries(concept).filter(([, v]) => typeof v === 'string'));
  // In drie groepen tegelijk controleren: zelfde regels, een derde van de wachttijd
  const sleutels = Object.keys(tekstVelden);
  const groepen = [0, 1, 2].map(g => sleutels.filter((_, i) => i % 3 === g)).filter(g => g.length);

  const controleerGroep = async (keys, splitsen = true) => {
    const groep = Object.fromEntries(keys.map(k => [k, tekstVelden[k]]));
    const prompt = `You are a strict checker for a business scan report. The report text may contain NO factual claims of its own.

FACTS (may only be quoted exactly, with their [F#]):
${feitenTekst}

THE CLIENT'S EXACT ANSWERS:
${antwoordenTekst}

THEIR WEBSITE TEXT: ${websiteInhoud || 'none provided'}
THEIR BIO: ${bio || 'none provided'}

${categorieRegels ? `WHAT EACH PART OF THE REPORT MAY DISCUSS:\n${categorieRegels}\nRewrite any sentence that discusses a question or fact belonging to another part, or remove it.\n\n` : ''}DRAFT REPORT TEXT (JSON, part of the report):
${JSON.stringify(groep, null, 2)}

${fouteCitaten.length ? `These quotes in the draft do not match anything the client answered or wrote: ${fouteCitaten.map(c => `"${c}"`).join(', ')}. Replace each with their exact answer from THE CLIENT'S EXACT ANSWERS, or rewrite the sentence without it. Never comment on the mistake.\n\n` : ''}${verdacht.length ? `These numbers appear in the draft but not in the answers, website, bio or FACTS, so they are made up and must be removed: ${verdacht.join(', ')}.\n\n` : ''}Go through every field, sentence by sentence. A sentence is allowed only if it does one of these:
(a) states what their answers say, matching the exact answer,
(b) states what is literally in their website text or bio,
(c) gives a recommendation or a concrete step as a direct command ("Add", "Pick", "Start with"), without promising an effect,
(d) quotes a fact from the FACTS list with the same figures and meaning, followed by its correct [F#], and places it next to their answer without adding a cause or effect. Check the figures and the [F#] against the FACTS list; fix or remove any mismatch.
Rewrite or remove every other sentence, for example: claims about how platforms, algorithms, search engines, markets or customers work; claims about other businesses or "most businesses"; any named service, product or type of customer for this business that is not literally in their answers, challenge, website text or bio (for example "legal or accounting needs" when they never said so); any description of what happens during their service, where it takes place or what it looks like that is not in their answers, challenge, website text or bio (boats, docks, waves, treatments, menus); the words "premium", "luxury" and "momentum"; sentences that are grammatically broken or do not read naturally; an answer treated as their own words, sentence, slogan or bio (answers are options they clicked); a quoted answer squeezed into a sentence that does not read naturally ("you run "No" paid advertising"); instructions passed on to the client ("put that next to your answer"); advice that contradicts other advice in the same text (three channels in one step, two in the next); an answer quoted for a different question than the one it answers, or quoted only in part; anything assumed to exist that their answers say does not (existing reviews after "No reviews yet"); a team, staff or partners that their answers do not mention; sentences about the report itself, its instructions or missing information ("there are no website facts", "this scan is based only on"); advice to set up or claim something their answer says they already have; guesses presented as facts ("likely", "you are losing", "is costing you", "invisible", "the algorithm"); promised effects ("will grow", "unlocks", "turns browsers into bookers"); statistics; any number that is not in their answers.
Your output is the final report text the client reads: never add notes, corrections or comments about the draft (no "Correction:", no "is not what you said"). Keep allowed sentences exactly as they are. When you rewrite, keep the FUNkiness! tone: bold, positive, direct commands with energy ("Put it in your bio today."), never weak openers like "Try" or "Consider". Plain text only, no markdown, no em dash. Keep [F#] markers on correct fact quotes. Keep line breaks and numbered steps.

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
        console.warn(`Controle poging ${poging} onvolledig:`, kapotVeld, '...' + JSON.stringify(uit[kapotVeld])?.slice(-300));
      } catch (err) {
        console.error(`Controle poging ${poging} mislukt:`, err.message);
      }
    }
    // Groep mislukt: elk onderdeel apart nog een keer, kleiner is betrouwbaarder
    if (splitsen && keys.length > 1) {
      console.warn('Controle per onderdeel opnieuw:', keys.join(', '));
      return Object.assign({}, ...await Promise.all(keys.map(k => controleerGroep([k], false))));
    }
    // Nooit ongecontroleerde tekst naar de klant: deze onderdelen worden leeg en de code vult ze veilig aan
    console.error('Controle mislukt voor:', keys.join(', '));
    return Object.fromEntries(keys.map(k => [k, '']));
  };

  const resultaten = await Promise.all(groepen.map(g => controleerGroep(g)));
  return Object.assign({ ...concept }, ...resultaten);
}

// Een [F#] die vóór het citaat staat in plaats van erachter, schuift naar het einde van die zin.
// Alleen als die zin een letterlijk citaat uit dat feit bevat, of letterlijk met het feit begint.
export function verschuifBronnen(tekst, feiten) {
  return tekst.replace(/\s*\[(F\d+)\]\s+([^\[\n]*?[.!?]"?)(?=\s|$)/g, (m, id, zin, plek, alles) => {
    const feit = feiten.find(f => f.id === id);
    const citaten = (zin.match(/"([^"]{15,})"/g) || []).map(c => c.slice(1, -1).replace(/[.!?]$/, ''));
    // De zin citeert het feit, of begint letterlijk zoals het feit
    const begin = zin.replace(/[.!?"]+$/, '').slice(0, 40);
    if (!feit || !(citaten.some(c => feit.tekst.includes(c)) || (begin.length >= 20 && feit.tekst.includes(begin)))) return m;
    // Staat dezelfde verwijzing er al achter, dan niet dubbel
    return alles.slice(plek + m.length).startsWith(` [${id}]`) ? ` ${zin}` : ` ${zin} [${id}]`;
  });
}

// Bij welk onderdeel van het rapport een feit hoort. Een feit verschijnt alleen in dat onderdeel.
const FEIT_CAT = {
  marketing: { F1: 'audience', F11: 'audience', F21: 'audience', F31: 'audience', F41: 'audience', F8: 'audience', F9: 'audience',
    F2: 'channels', F3: 'channels', F12: 'channels', F13: 'channels', F22: 'channels', F32: 'channels', F33: 'channels', F42: 'channels', F10: 'channels', F91: ['channels', 'brand'] },
  social: { F1: 'platforms', F11: 'platforms', F21: 'platforms', F31: 'platforms', F41: 'platforms',
    F2: 'platforms', F3: 'platforms', F12: 'platforms', F13: 'platforms', F22: 'platforms', F32: 'platforms', F33: 'platforms', F42: 'platforms', F90: ['platforms', 'instagram', 'engagement'],
    F4: 'engagement', F5: 'instagram', F6: 'instagram', F7: 'instagram' }
};

function vragenVan(type, cat, antwoorden, sector) {
  return Object.entries(VRAGEN[type]).filter(([k, v]) => v.cat === cat && antwoorden[k] !== undefined && (!v.sectoren || v.sectoren.includes(sector)));
}

const feitHoortBij = (type, id, cat) => { const c = FEIT_CAT[type]?.[id]; return Array.isArray(c) ? c.includes(cat) : c === cat; };

// Een onderdeel is pas compleet met drie genummerde stappen, elk op een eigen regel
export const heeftDrieStappen = t => typeof t === 'string' && /(^|\n)1\. \S[^\n]*\n2\. \S[^\n]*\n3\. \S/.test(t);

// Regel per onderdeel: alleen de eigen vragen en de eigen feiten
export function categorieRegel(type, cat, antwoorden, sector, feiten) {
  const vragen = vragenVan(type, cat, antwoorden, sector).map(([k]) => `"${VRAAGTEKST[k]}" (their answer: "${antwoorden[k]}")`).join('; ');
  const eigen = feiten.filter(f => feitHoortBij(type, f.id, cat)).map(f => `[${f.id}]`);
  return `This field may ONLY discuss these questions: ${vragen}. ${eigen.length ? `The only facts allowed in this field: ${eigen.join(', ')}.` : 'No facts from the FACTS list are allowed in this field.'} Never mention answers, questions or facts that belong to another part of the report.`;
}

// Voor de controleur: alle onderdelen met hun eigen vragen en feiten
export function categorieRegelsVoorControle(type, antwoorden, sector, feiten) {
  const cats = [...new Set(Object.values(VRAGEN[type]).map(v => v.cat))];
  return cats.map(cat => `- Field ${cat}_feedback: ${categorieRegel(type, cat, antwoorden, sector, feiten)}`).join('\n')
    + '\n- Any other field may quote any fact, but each fact at most once in the whole report text.';
}

// Vangnet in code: zinnen in een onderdeel die een feit of een letterlijk antwoord uit een ander onderdeel citeren, gaan eruit
export function bewaakCategorieen(velden, type, antwoorden, sector) {
  const uit = { ...velden };
  const cats = [...new Set(Object.values(VRAGEN[type]).map(v => v.cat))];
  const antwoordVan = cat => new Set(vragenVan(type, cat, antwoorden, sector).map(([k]) => antwoorden[k]));
  for (const cat of cats) {
    const veld = `${cat}_feedback`;
    if (typeof uit[veld] !== 'string') continue;
    const eigen = antwoordVan(cat);
    const vreemd = new Set(cats.filter(c => c !== cat).flatMap(c => [...antwoordVan(c)]).filter(a => !eigen.has(a)));
    const zinOk = zin => {
      const ids = zin.match(/F\d+/g) || [];
      if (ids.some(id => FEIT_CAT[type]?.[id] && !feitHoortBij(type, id, cat))) return false;
      const citaten = [...zin.matchAll(/"([^"]+)"/g)].map(m => m[1].replace(/[.,!?]$/, ''));
      return !citaten.some(c => vreemd.has(c));
    };
    uit[veld] = uit[veld].split('\n').map(regel => regel
      .split(/(?<=[.!?]"?(?:\s*\[F\d+(?:\s*,\s*F\d+)*\])?)\s+(?=[A-Z0-9"])/)
      .filter(zinOk).join(' ').trim())
      .filter(r => r && !/^\d\.$/.test(r)).join('\n').trim();
  }
  return uit;
}

// Velden waarin citaten letterlijk uit de antwoorden, website, bio of feiten moeten komen.
// Stappen (regels die met "1." beginnen) en ideeën mogen voorbeeldzinnen tussen aanhalingstekens bevatten.
const CITAAT_VELDEN = k => ['intro', 'eye_opener', 'whats_working', 'teaser_wins', 'challenge_answer', 'cta_dynamic'].includes(k) || (k.endsWith('_feedback') && k !== 'bio_feedback');
const normaal = t => t.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').replace(/[.,!?;:]+$/, '').trim();

// Geeft per veld de citaten die nergens in de bronnen staan
export function controleerCitaten(velden, bronnen) {
  const bron = normaal(bronnen.filter(Boolean).join(' \n '));
  const fout = {};
  for (const [k, v] of Object.entries(velden)) {
    if (typeof v !== 'string' || !CITAAT_VELDEN(k)) continue;
    const tekst = v.replace(/\\"/g, '"').split('\n').filter(r => !/^\s*\d\.\s/.test(r)).join('\n');
    const lijst = [...tekst.matchAll(/["“]([^"”\n]{3,})["”]/g)].map(m => m[1].replace(/\s*\[F\d+(?:\s*,\s*F\d+)*\]/g, ''))
      // Scheef gekoppelde aanhalingstekens (de tekst tussen twee citaten) overslaan
      .filter(c => !/^[\s,.;:)]/.test(c) && !/[\s(]$/.test(c))
      .filter(c => !bron.includes(normaal(c)));
    if (lijst.length) fout[k] = [...new Set(lijst)];
  }
  return fout;
}

// Laatste vangnet: zinnen met een citaat dat duidelijk een verkeerd overgenomen antwoord is, en commentaarzinnen, gaan eruit
export function verwijderFouteZinnen(velden, fout, antwoordLijst) {
  const woorden = t => new Set(normaal(t).split(/[^a-z0-9']+/).filter(Boolean));
  const lijktOpAntwoord = c => antwoordLijst.some(a => { const w = woorden(a), cw = woorden(c); const gedeeld = [...cw].filter(x => w.has(x)).length; return w.size && gedeeld / Math.max(w.size, cw.size) >= 0.6; });
  const commentaar = /\b(correction|is not what you said|not what you answered|the draft|this report says)\b/i;
  const uit = { ...velden };
  for (const [k, v] of Object.entries(uit)) {
    if (typeof v !== 'string') continue;
    const slecht = (fout[k] || []).filter(lijktOpAntwoord);
    uit[k] = v.split('\n').map(regel => regel
      .split(/(?<=[.!?]"?(?:\s*\[F\d+(?:\s*,\s*F\d+)*\])?)\s+(?=[A-Z0-9"])/)
      .filter(zin => !commentaar.test(zin) && !slecht.some(c => zin.includes(c)))
      .join(' ').trim())
      .filter(r => r && !/^\d\.$/.test(r)).join('\n').trim();
  }
  return uit;
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
    : verschuifBronnen(v, feiten).replace(/\s*\[(F\d+(?:\s*,\s*F\d+)*)\]/g, (m, lijst) => {
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
export async function leesInstagram(invoer, tijdzone = 'America/Curacao') {
  const igUser = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!igUser || !token || !invoer || typeof invoer !== 'string') return null;
  const handle = invoer.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/^@/, '').replace(/[/?#].*$/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;

  try {
    const velden = `business_discovery.username(${handle}){username,followers_count,media_count,media.limit(25){timestamp,like_count,comments_count,media_type,media_product_type,permalink}}`;
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
    const extra = [];   // alleen voor Daisy en het gesprek, niet in het klantrapport
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

        // Verdieping voor het gesprek: best scorende vorm, dag en dagdeel, beste post, langste stilte
        const besteVan = (sleutel) => {
          const groepen = {};
          for (const p of metLikes) (groepen[sleutel(p)] ||= []).push(p);
          const kandidaten = Object.entries(groepen).filter(([, l]) => l.length >= 2).map(([k, l]) => [k, gem(l), l.length]);
          return kandidaten.length >= 2 ? kandidaten.sort((a, b) => b[1] - a[1])[0] : null;
        };
        const vormNaam = { REELS: 'Reels', CAROUSEL_ALBUM: 'carousels', IMAGE: 'photos', VIDEO: 'videos' };
        const vorm = p => p.media_product_type === 'REELS' ? 'REELS' : p.media_type;
        const dag = p => new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: tijdzone }).format(new Date(p.timestamp));
        const uur = p => Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: tijdzone }).format(new Date(p.timestamp)));
        const dagdeel = p => { const u = uur(p); return u < 6 ? 'night (0-6h)' : u < 12 ? 'morning (6-12h)' : u < 17 ? 'afternoon (12-17h)' : 'evening (17-24h)'; };
        const bv = besteVan(vorm), bd2 = besteVan(dag), bdd = besteVan(dagdeel);
        if (bv) extra.push(`Best performing format: ${vormNaam[bv[0]] || bv[0]} (average ${getal(bv[1])} likes plus comments over ${bv[2]} posts)`);
        if (bd2) extra.push(`Best day: ${bd2[0]} (average ${getal(bd2[1])} over ${bd2[2]} posts)`);
        if (bdd) extra.push(`Best time of day: ${bdd[0]} (average ${getal(bdd[1])} over ${bdd[2]} posts)`);
        const top = [...metLikes].sort((a, b) => interacties(b) - interacties(a))[0];
        extra.push(`Best post: ${datum(new Date(top.timestamp))}, ${vormNaam[vorm(top)] || vorm(top)}, ${interacties(top).toLocaleString('en-US')} likes plus comments${top.permalink ? `, ${top.permalink}` : ''}`);
      }
      if (posts.length >= 3) {
        const tijden2 = posts.map(p => new Date(p.timestamp).getTime()).sort((a, b) => a - b);
        const gat = Math.max(...tijden2.slice(1).map((t, i) => t - tijden2[i])) / 86400000;
        extra.push(`Longest silence between two posts: ${Math.round(gat)} days`);
      }
    }

    return {
      id: 'F90', voor: 'social', locaties: [], sectoren: [],
      tekst: `Public Instagram data for @${bd.username}, fetched on ${datum(vandaag)}: ${delen.join('; ')}.`,
      bron: `Instagram, public data of @${bd.username} (${datum(vandaag)})`,
      url: `https://www.instagram.com/${bd.username}/`,
      extra
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
    const bedrijfsTypes = /LocalBusiness|Organization|Hotel|Restaurant|Store|Resort|LodgingBusiness|ProfessionalService|Corporation|BankOrCreditUnion|RealEstateAgent|TravelAgency/i;
    // Punten die aandacht nodig hebben (alleen wat echt gemeten is)
    const punten = [
      [eind.protocol !== 'https:', 'no secure connection (HTTPS)'],
      [seconden > 3, `homepage took ${seconden.toFixed(1)} seconds to load from our server`],
      [!viewport, 'no mobile viewport tag'],
      [!titel, 'no page title'],
      [!!titel && titel.length > 65, `page title is ${titel.length} characters (search results usually show about 60)`],
      [!beschrijving, 'no meta description'],
      [!!beschrijving && beschrijving.length > 160, `meta description is ${beschrijving.length} characters (search results usually show about 155)`],
      [h1 !== 1, h1 === 0 ? 'no H1 heading on the homepage' : `${h1} H1 headings on the homepage instead of 1`],
      [!ldTypes.some(t => bedrijfsTypes.test(t)), 'no business details in structured data (LocalBusiness or Organization)'],
      [!ogBeeld, 'no social sharing image (og:image)'],
      [!taal, 'no language set in the page'],
      [!whatsapp, 'no WhatsApp link'],
      [!telefoon, 'no phone link'],
      [openai === 'blocked', 'robots.txt blocks OAI-SearchBot, the crawler ChatGPT search uses'],
      [!heeftSitemap, 'no sitemap found']
    ].filter(([fout]) => fout).map(([, tekst]) => tekst);
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
      punten,
      samenvatting: `Website check of ${eind.hostname} by FUNkiness! on ${datum} (homepage only): we checked 13 points and found ${punten.length} ${punten.length === 1 ? 'point that needs' : 'points that need'} attention${punten.length ? `, including: ${punten.slice(0, 3).join('; ')}` : ''}.`,
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

// Punten per vraag, voor het gesprek (alleen in de leadmail)
export function scoresPerVraag(type, antwoorden, sector) {
  return Object.entries(VRAGEN[type])
    .filter(([k, v]) => antwoorden[k] !== undefined && (!v.sectoren || v.sectoren.includes(sector)))
    .map(([k, v]) => `${VRAAGTEKST[k]} "${antwoorden[k]}" = ${v.scores[antwoorden[k]]}/100`);
}

export const TIJDZONE = { curacao: 'America/Curacao', aruba: 'America/Aruba', bonaire: 'America/Kralendijk', nederland: 'Europe/Amsterdam', elders: 'UTC' };

// Teasers voor het blok "We saw more": alleen wat echt gemeten of berekend is, zonder de inhoud te verklappen
export function teasers({ instagramFeit, websitePunten, aantalVragen }) {
  const lijst = [];
  if (websitePunten?.length) {
    const rest = websitePunten.length - Math.min(3, websitePunten.length);
    lijst.push(rest > 0
      ? `Our website check found ${websitePunten.length} points that need attention on your homepage. This report names 3 of them; the other ${rest} we go through with you.`
      : `Our website check found ${websitePunten.length} ${websitePunten.length === 1 ? 'point that needs' : 'points that need'} attention on your homepage, and we show you exactly how to fix ${websitePunten.length === 1 ? 'it' : 'them'}.`);
  }
  if (instagramFeit?.extra?.length) {
    const wat = [];
    if (instagramFeit.extra.some(e => e.startsWith('Best performing format'))) wat.push('which type of post');
    if (instagramFeit.extra.some(e => e.startsWith('Best day'))) wat.push('which day');
    if (instagramFeit.extra.some(e => e.startsWith('Best time'))) wat.push('which time of day');
    lijst.push(`We dug deeper into your latest Instagram posts${wat.length ? `: ${wat.join(', ')} gets the most response for you` : ''}, which post did best, and your longest silence between posts.`);
  }
  lijst.push(`Your score for each of the ${aantalVragen} questions, side by side, so you see exactly where the quickest gains are.`);
  return lijst;
}

// Afspraakvorm: op Curaçao komt FUNkiness! langs, elders een online afspraak
export function afspraak(locatie) {
  return locatie === 'curacao'
    ? { kort: 'a free visit', zin: 'We come to you and walk you through all of it, free, at your business.', knop: 'Plan your free visit', wens: "I'd like to plan a visit." }
    : { kort: 'a free online meeting', zin: 'We walk you through all of it in a free online meeting.', knop: 'Plan your free meeting', wens: "I'd like to plan an online meeting." };
}

// Opvolgberichten voor Daisy bij elke scan: WhatsApp (dag 0) en twee mails (dag 3 en dag 8).
// Alles komt uit metingen en antwoorden, er schrijft geen AI aan mee, dus er kan niets verzonnen worden.
// type: 'marketing' of 'social'. Marketing haakt aan op websitepunten, social op de Instagram-verdieping;
// beide alleen op wat niet in het klantrapport stond.
export function opvolging({ type = 'marketing', naam, bedrijf, locatie, sector, antwoorden, websitePunten = [], instagramFeit = null, ideeen = '', laagsteLabel, laagsteScore, totaalscore, telefoon, telefoon_nl }) {
  const hoi = naam ? `Hi ${naam}` : 'Hi there';
  const scanNaam = type === 'social' ? 'Social Media Scan' : 'Marketing Scan';
  const ideeSoort = type === 'social' ? 'post ideas' : 'campaign ideas';
  const metingen = type === 'social'
    // Instagram-verdieping staat alleen in de leadmail; 'Best post' is te lang voor een bericht
    ? (instagramFeit?.extra || []).filter(e => !e.startsWith('Best post')).map((e, i) => i === 0
        ? `We dug into your latest Instagram posts and found something that isn't in your report. ${e}.`
        : `Another thing from your Instagram that didn't make the report. ${e}.`)
    // Het rapport noemt de eerste 3 websitepunten; de rest heeft de klant nog niet gezien
    : websitePunten.slice(3).map((p, i) => i === 0
        ? `Our website check found something that isn't in your report: ${p}.`
        : `There's another point from our website check that didn't make the report: ${p}.`);
  const laagste = Object.entries(VRAGEN[type])
    .filter(([k, v]) => antwoorden[k] !== undefined && (!v.sectoren || v.sectoren.includes(sector)))
    .map(([k, v]) => ({ vraag: VRAAGTEKST[k], antwoord: antwoorden[k], score: v.scores[antwoorden[k]] }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 2);
  const haken = [
    ...metingen.slice(0, 2),
    ...laagste.map(q => `You answered "${q.antwoord}" to "${q.vraag}", one of your lowest scores in the scan. That's where I'd start.`)
  ];
  const idee = ideeen.match(/^\s*1\.\s*([^:\n]{3,80}):/m)?.[1]?.trim();
  const uitnodiging = `I'd love to come by ${bedrijf} for a free visit and walk you through the rest.`;
  const afsluiting = 'Daisy\nFUNkiness! AI, Social Media & Marketing, Curaçao\nWhatsApp: +599 9 675 1737';

  const whatsapp = `${hoi}! Daisy from FUNkiness! here. Your ${scanNaam} for ${bedrijf} just landed, love that you did it. ${haken[0]} ${uitnodiging} Which day works for you this week?`;

  const dag3 = {
    onderwerp: `${bedrijf}: one more thing from your scan`,
    tekst: [
      `${hoi},`,
      `Quick one. Your scan gave ${bedrijf} ${totaalscore}/100, and there's more behind that number than fit in the report.`,
      haken[1] || haken[0],
      idee ? `Of the 3 ${ideeSoort} in your report, "${idee}" is the one I can't wait to build with you.` : '',
      `${uitnodiging} Just reply with a day and time that suits you, or send me a WhatsApp.`,
      afsluiting
    ].filter(Boolean).join('\n\n')
  };

  const dag8 = {
    onderwerp: `Door's open, ${naam || bedrijf}`,
    tekst: [
      `${hoi},`,
      `Last nudge from me, promise. Your lowest area in the scan was ${laagsteLabel} (${laagsteScore}/100), so that's where I'd dig in first with ${bedrijf}.`,
      `Whenever you're ready, reply to this email or send me a WhatsApp and we'll plan your free visit.`,
      `Boring was never the plan,\n${afsluiting}`
    ].join('\n\n')
  };

  // Klikbare WhatsApp-link naar de klant, tekst al ingevuld
  const nummer = String((locatie === 'curacao' ? (telefoon || telefoon_nl) : (telefoon_nl || telefoon)) || '').replace(/\D/g, '');
  const whatsappLink = nummer.length >= 7 ? `https://wa.me/${nummer}?text=${encodeURIComponent(whatsapp)}` : '';

  return { whatsapp, whatsappLink, dag3, dag8 };
}

// Blok bovenaan Daisy's leadmail: WhatsApp in één tik, en wat de sheet daarna doet
export function opvolgingHtml(volg, esc) {
  return `<div style="font-family:sans-serif;background:#fff4f9;border:2px solid #f21b7a;border-radius:12px;padding:16px 20px;margin-bottom:20px">
            <strong>Opvolgen, stap 1: stuur nu deze WhatsApp</strong>
            <p style="margin:8px 0 12px">${esc(volg.whatsapp)}</p>
            ${volg.whatsappLink ? `<a href="${volg.whatsappLink}" style="display:inline-block;background:#25d366;color:white;padding:10px 22px;border-radius:99px;font-weight:700;text-decoration:none">Open in WhatsApp</a>` : '<em>Geen telefoonnummer opgegeven, kopieer de tekst of mail hem.</em>'}
            <p style="font-size:13px;color:#666;margin:12px 0 0">Stap 2 en 3: op dag 3 en dag 8 staat er vanzelf een mailconcept klaar in Gmail, zolang je in de sheet "Gereageerd" niet hebt aangevinkt.</p>
          </div>`;
}

// Zo leest het sheetscript de opvolging: eerste regel van een mail is het onderwerp
export function opvolgingVoorSheet(volg) {
  return { whatsapp: volg.whatsapp, whatsappLink: volg.whatsappLink, dag3: `${volg.dag3.onderwerp}\n\n${volg.dag3.tekst}`, dag8: `${volg.dag8.onderwerp}\n\n${volg.dag8.tekst}` };
}
