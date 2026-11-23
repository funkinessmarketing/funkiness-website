// Black Friday 2026, SPIN THE FUN!: prijzen. De loting zelf gebeurt in het sheet-script (bfSpin).
// Downloads staan in een map met een onraadbare naam en worden niet geïndexeerd (zie vercel.json en robots.txt).
const MAP = '/gifts/bf26-226dada8e958/';

export const SOS_TERMIJN = 'by Friday, December 11, 2026'; // OPEN: termijn nog door Daisy goed te keuren

export const PRIJZEN = {
  hooks: {
    naam: '10 Killer Hooks',
    kort: 'Ten opening lines that stop the scroll, each with an example of how to use it.',
    download: MAP + 'funkiness-10-killer-hooks.pdf'
  },
  'ai-pack': {
    naam: 'AI Power Pack',
    kort: 'Ten ready-to-use AI prompts for content, ideas, better copy and customer messages.',
    download: MAP + 'funkiness-ai-power-pack.pdf'
  },
  rescue: {
    naam: 'Content Rescue Kit',
    kort: 'Five common content problems, the fix for each, before-and-after examples and a checklist.',
    download: MAP + 'funkiness-content-rescue-kit.pdf'
  },
  ideas: {
    naam: '30 Days of Ideas',
    kort: 'Thirty content ideas for Instagram, Facebook and TikTok, with examples for different businesses.',
    download: MAP + 'funkiness-30-days-of-ideas.pdf'
  },
  mystery: {
    naam: 'Mystery FUNky Gift',
    onthulling: 'The 5-Minute Marketing Fix',
    kort: 'A five-minute checklist to sharpen your social media profile, plus a bonus prompt for your bio.',
    download: MAP + 'funkiness-5-minute-marketing-fix.pdf'
  },
  sos: {
    naam: 'Marketing SOS',
    kort: 'A personal mini review of your marketing: one thing that already works, three specific improvements and one action to start with.',
    download: null
  }
};
