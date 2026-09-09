# AI Visibility Scan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third scan option to the existing `scan.html` lead-gen tool: the AI Visibility Scan, which audits a business's website for GEO-readiness (structured data, Q&A content), tests 5 live AI search queries via OpenRouter, generates a ready-to-paste JSON-LD schema snippet, and emails a personalized report with 3 concrete action points plus a booking CTA.

**Architecture:** Reuses the existing `scan.html`/`scan-script.js`/`api/*.js` pattern (Vercel serverless functions, Claude API for report generation, nodemailer for email, Google Sheets webhook as a logging safety net). Pure, deterministic logic (schema generation, audit checks, scoring, query templates) lives in a new shared `lib/geo-scan-helpers.js` so it can be unit tested without hitting any external API. The new `api/geo-scan.js` orchestrates the external calls (site fetch, OpenRouter, Claude, email) around those pure helpers.

**Tech Stack:** Node.js (ESM), Vercel serverless functions, `@anthropic-ai/sdk`, `nodemailer`, OpenRouter REST API (native `fetch`), Node's built-in `node:test` for unit tests.

## Global Constraints

- Nooit een directe Perplexity/andere-AI-provider-koppeling. Altijd OpenRouter met `OPENROUTER_API_KEY` uit `.env` voor niet-Claude-modellen (vaste regel uit `CLAUDE.md`).
- Claude API blijft rechtstreeks (`@anthropic-ai/sdk`, `ANTHROPIC_API_KEY`) voor rapportgeneratie, dat is geen "ander AI-model" in de zin van die regel.
- `scan.html` blijft Engelstalig, geen NL-versie (bestaande regel voor deze pagina).
- Geen emdash, geen " - " (spatie-koppelteken-spatie) als separator in enige gegenereerde tekst of copy.
- Geen verzonnen statistieken: het rapport gebruikt alleen de daadwerkelijke audit- en zoekresultaten.
- Volg het bestaande patroon van `api/scan.js` en `api/marketing-scan.js` (honeypot-check, validatie, Google Sheets-webhook vangnet, twee e-mails) in plaats van een nieuw patroon te verzinnen.
- Make.com-koppeling is bewust buiten scope voor dit plan (zie spec, 2026-09-09 beslissing).

---

## File Structure

- **Create:** `lib/geo-scan-helpers.js` — pure, deterministic functies (geen netwerk/AI-calls): sector-zoekvragen, schema-snippet generator, website-auditchecks, scoreberekening.
- **Create:** `lib/geo-scan-helpers.test.js` — `node:test` unit tests voor bovenstaande.
- **Create:** `api/geo-scan.js` — Vercel serverless function: validatie, site-fetch, OpenRouter-calls, Claude-rapportgeneratie, e-mails, Sheets-webhook.
- **Modify:** `vercel.json` — `maxDuration` voor de nieuwe function.
- **Modify:** `scan.html` — derde keuze-kaart, nieuwe formuliervelden (plaats, website), nieuw rapport-blok.
- **Modify:** `scan-script.js` — geo-flow (validatie, skip-logica, submit, render).
- **Create:** `scripts/test-geo-scan-local.js` — lokaal testscript dat de handler rechtstreeks aanroept met een nepverzoek, zodat Daisy dit kan testen zonder de Vercel CLI.
- **Modify:** `package.json` (root) — `dotenv` toevoegen als devDependency, alleen gebruikt door het testscript.

---

### Task 1: Pure helper functions (`lib/geo-scan-helpers.js`)

**Files:**
- Create: `lib/geo-scan-helpers.js`
- Test: `lib/geo-scan-helpers.test.js`

**Interfaces:**
- Produces: `buildSectorQueries(sector, plaats)` → `string[]` (lengte 5), `COMPETITOR_QUERY_INDEX` (constante, `2`), `generateSchemaSnippet({ bedrijf, sector, plaats, website })` → `string` (HTML `<script>`-blok), `calculateAuditChecks(html)` → `{ structuredData, qaContent, metaDescription, viewport } | null`, `calculateScore({ auditChecks, aiResults })` → `number` (0-100), `SECTOR_SCHEMA_TYPE` (object).

- [ ] **Step 1: Write the failing tests**

Create `lib/geo-scan-helpers.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSectorQueries,
  COMPETITOR_QUERY_INDEX,
  generateSchemaSnippet,
  calculateAuditChecks,
  calculateScore,
  SECTOR_SCHEMA_TYPE
} from './geo-scan-helpers.js';

test('buildSectorQueries returns 5 queries for a known sector, all mentioning the location', () => {
  const queries = buildSectorQueries('hotel', 'Willemstad');
  assert.equal(queries.length, 5);
  for (const q of queries) {
    assert.match(q, /Willemstad/);
    assert.match(q, /Curaçao/);
  }
});

test('buildSectorQueries falls back to the "anders" templates for an unknown sector', () => {
  const queries = buildSectorQueries('unknown_sector', 'Jan Thiel');
  assert.equal(queries.length, 5);
  assert.match(queries[0], /Jan Thiel/);
});

test('the competitor query is broad, category-only, no brand name placeholder leaked', () => {
  const queries = buildSectorQueries('restaurant', 'Pietermaai');
  const competitorQuery = queries[COMPETITOR_QUERY_INDEX];
  assert.match(competitorQuery, /top rated/i);
  assert.doesNotMatch(competitorQuery, /\{.*\}/);
});

test('generateSchemaSnippet produces valid, parseable JSON-LD with the right schema.org type', () => {
  const snippet = generateSchemaSnippet({ bedrijf: 'Blue Bay Resort', sector: 'hotel', plaats: 'Willemstad', website: 'https://bluebay.example' });
  const match = snippet.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  assert.ok(match, 'snippet should contain a script tag with JSON inside');
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'Hotel');
  assert.equal(data.name, 'Blue Bay Resort');
  assert.equal(data.address.addressLocality, 'Willemstad');
  assert.equal(data.url, 'https://bluebay.example');
});

test('generateSchemaSnippet omits the url field when no website is given', () => {
  const snippet = generateSchemaSnippet({ bedrijf: 'Casa Curacao', sector: 'anders', plaats: 'Otrobanda', website: '' });
  const match = snippet.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  const data = JSON.parse(match[1]);
  assert.equal(data['@type'], 'LocalBusiness');
  assert.equal('url' in data, false);
});

test('generateSchemaSnippet safely escapes a business name with quotes', () => {
  const snippet = generateSchemaSnippet({ bedrijf: 'The "Best" Cafe', sector: 'restaurant', plaats: 'Willemstad', website: '' });
  const match = snippet.match(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/);
  const data = JSON.parse(match[1]);
  assert.equal(data.name, 'The "Best" Cafe');
});

test('calculateAuditChecks detects all four signals when present', () => {
  const html = `<html><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A cozy boutique hotel in the heart of Willemstad, Curaçao, walking distance from the beach.">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Test"}</script>
    </head><body><h2>What is the best time to visit?</h2><p>Year round.</p></body></html>`;
  const checks = calculateAuditChecks(html);
  assert.deepEqual(checks, { structuredData: true, qaContent: true, metaDescription: true, viewport: true });
});

test('calculateAuditChecks returns all false when nothing is present', () => {
  const html = '<html><head></head><body><p>Just some text, no signals at all.</p></body></html>';
  const checks = calculateAuditChecks(html);
  assert.deepEqual(checks, { structuredData: false, qaContent: false, metaDescription: false, viewport: false });
});

test('calculateAuditChecks returns null when there is no HTML to check', () => {
  assert.equal(calculateAuditChecks(null), null);
  assert.equal(calculateAuditChecks(''), null);
});

test('calculateScore combines audit and AI results out of 100 when a website was audited', () => {
  const auditChecks = { structuredData: true, qaContent: false, metaDescription: true, viewport: true };
  const aiResults = [
    { mentioned: true }, { mentioned: false }, { mentioned: false }, { mentioned: false }, { mentioned: false }
  ];
  // audit: 3 of 4 true = 30, ai: 1 of 5 mentioned = 12, total 42
  assert.equal(calculateScore({ auditChecks, aiResults }), 42);
});

test('calculateScore uses only AI results, scaled to 100, when there is no website', () => {
  const aiResults = [
    { mentioned: true }, { mentioned: true }, { mentioned: false }, { mentioned: false }, { mentioned: false }
  ];
  // 2 of 5 mentioned x 20 = 40
  assert.equal(calculateScore({ auditChecks: null, aiResults }), 40);
});

test('SECTOR_SCHEMA_TYPE maps every known sector to a schema.org type', () => {
  assert.equal(SECTOR_SCHEMA_TYPE.hotel, 'Hotel');
  assert.equal(SECTOR_SCHEMA_TYPE.restaurant, 'Restaurant');
  assert.equal(SECTOR_SCHEMA_TYPE.makelaar, 'RealEstateAgent');
  assert.equal(SECTOR_SCHEMA_TYPE.airbnb, 'LodgingBusiness');
  assert.equal(SECTOR_SCHEMA_TYPE.anders, 'LocalBusiness');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test lib/geo-scan-helpers.test.js`
Expected: FAIL with `Cannot find module './geo-scan-helpers.js'` (the file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `lib/geo-scan-helpers.js`:

```js
export const SECTOR_SCHEMA_TYPE = {
  hotel: 'Hotel',
  restaurant: 'Restaurant',
  makelaar: 'RealEstateAgent',
  airbnb: 'LodgingBusiness',
  anders: 'LocalBusiness'
};

// Index 2 of every template array below is deliberately a broad,
// brand-free "top rated X in <plaats>" query. It is the one we scan for
// competitor names in the report (see api/geo-scan.js).
export const COMPETITOR_QUERY_INDEX = 2;

const SECTOR_QUERY_TEMPLATES = {
  hotel: (p) => [
    `best boutique hotel in ${p}, Curaçao`,
    `where to stay in ${p}, Curaçao`,
    `top rated hotels in ${p} Curaçao`,
    `small hotels in ${p} Curaçao`,
    `recommended hotels near ${p} Curaçao`
  ],
  restaurant: (p) => [
    `best restaurant in ${p}, Curaçao`,
    `where to eat in ${p}, Curaçao`,
    `top rated restaurants in ${p} Curaçao`,
    `good restaurants for dinner in ${p} Curaçao`,
    `local restaurants in ${p} Curaçao`
  ],
  makelaar: (p) => [
    `best real estate agency in ${p}, Curaçao`,
    `how to buy property in ${p}, Curaçao`,
    `top real estate agents in ${p} Curaçao`,
    `real estate agency for expats in ${p} Curaçao`,
    `recommended realtors in ${p} Curaçao`
  ],
  airbnb: (p) => [
    `best vacation rental in ${p}, Curaçao`,
    `where to rent a vacation home in ${p}, Curaçao`,
    `top rated vacation rentals in ${p} Curaçao`,
    `vacation rental manager in ${p} Curaçao`,
    `recommended Airbnb in ${p} Curaçao`
  ],
  anders: (p) => [
    `best local business in ${p}, Curaçao`,
    `recommended businesses in ${p}, Curaçao`,
    `top rated businesses in ${p} Curaçao`,
    `trusted local business in ${p} Curaçao`,
    `where to find good service in ${p} Curaçao`
  ]
};

export function buildSectorQueries(sector, plaats) {
  const templateFn = SECTOR_QUERY_TEMPLATES[sector] || SECTOR_QUERY_TEMPLATES.anders;
  return templateFn(plaats);
}

export function generateSchemaSnippet({ bedrijf, sector, plaats, website }) {
  const type = SECTOR_SCHEMA_TYPE[sector] || 'LocalBusiness';
  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    name: bedrijf,
    address: {
      '@type': 'PostalAddress',
      addressLocality: plaats,
      addressCountry: 'CW'
    }
  };
  if (website) data.url = website;
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
}

export function calculateAuditChecks(html) {
  if (!html) return null;

  const hasStructuredDataBlock = /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html);
  const hasRecognizedType = /"@type"\s*:\s*"(FAQPage|LocalBusiness|Organization|Hotel|Restaurant|RealEstateAgent|LodgingBusiness)"/i.test(html);
  const structuredData = hasStructuredDataBlock && hasRecognizedType;

  const qaContent = /<(h2|h3|summary)[^>]*>[^<]*\?\s*<\/(h2|h3|summary)>/i.test(html);

  let metaDescription = false;
  const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)
    || html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (metaMatch) {
    const len = metaMatch[1].length;
    metaDescription = len >= 50 && len <= 160;
  }

  const viewport = /<meta\s+name=["']viewport["']/i.test(html);

  return { structuredData, qaContent, metaDescription, viewport };
}

export function calculateScore({ auditChecks, aiResults }) {
  const mentionedCount = aiResults.filter(r => r.mentioned).length;

  if (auditChecks) {
    const auditPoints = Object.values(auditChecks).filter(Boolean).length;
    const auditScore = auditPoints * 10; // max 40
    const aiScore = mentionedCount * 12; // max 60
    return Math.min(100, auditScore + aiScore);
  }

  return Math.min(100, mentionedCount * 20); // max 100
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test lib/geo-scan-helpers.test.js`
Expected: PASS, all 12 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/geo-scan-helpers.js lib/geo-scan-helpers.test.js
git commit -m "Add pure GEO scan helpers (queries, schema snippet, audit checks, scoring) with unit tests"
```

---

### Task 2: `api/geo-scan.js` serverless handler

**Files:**
- Create: `api/geo-scan.js`

**Interfaces:**
- Consumes: everything from Task 1 (`buildSectorQueries`, `COMPETITOR_QUERY_INDEX`, `generateSchemaSnippet`, `calculateAuditChecks`, `calculateScore`).
- Produces: HTTP handler matching the exact response shape of `api/scan.js`: `{ success: true, rapport, bedrijf }` on success (where `rapport` includes `booking_url`, see Task 5), `{ success: false, error }` on failure (400/500).

No automated test for this task: it calls three real external services (website fetch, OpenRouter, Claude) and there is no mocking setup anywhere else in this project either (`api/scan.js` and `api/marketing-scan.js` are untested the same way). Verification happens end to end in Task 6.

- [ ] **Step 1: Write the handler**

Create `api/geo-scan.js`:

```js
import Anthropic from '@anthropic-ai/sdk';
import nodemailer from 'nodemailer';
import {
  buildSectorQueries,
  COMPETITOR_QUERY_INDEX,
  generateSchemaSnippet,
  calculateAuditChecks,
  calculateScore
} from '../lib/geo-scan-helpers.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const mailer = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 587,
  secure: false,
  auth: {
    user: 'sayhello@funkiness.ai',
    pass: process.env.TITAN_PASSWORD
  }
});

// Swap this for a real Cal.com link once it exists, see docs/superpowers/specs/2026-09-09-ai-visibility-scan-design.md
const BOOKING_URL = 'mailto:sayhello@funkiness.ai?subject=Let%27s%20talk%20about%20my%20AI%20Visibility%20Scan';

const OPENROUTER_MODEL = 'perplexity/sonar';

async function queryOpenRouterSearch(query) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: query }]
      })
    });
    if (!res.ok) throw new Error(`OpenRouter responded with ${res.status}`);
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || '';
    return { query, answer, error: false };
  } catch (err) {
    console.error('OpenRouter query error:', err.message);
    return { query, answer: '', error: true };
  }
}

async function fetchWebsiteHtml(website) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(website, {
      signal: controller.signal,
      headers: { 'User-Agent': 'FUNkiness-AI-Visibility-Scan/1.0' }
    });
    clearTimeout(timeoutId);
    const html = await res.text();
    return html.slice(0, 500000); // size guard
  } catch (err) {
    console.error('Website fetch error:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bedrijf, sector, plaats, website, email, telefoon, telefoon_nl, naam, functie, honeypot } = req.body;

  if (honeypot) {
    return res.status(400).json({ success: false, error: 'Invalid submission.' });
  }

  if (!bedrijf || !sector || !plaats || !email) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  if (!email.includes('@') || bedrijf.length > 200 || plaats.length > 100 || naam?.length > 200) {
    return res.status(400).json({ success: false, error: 'Invalid input.' });
  }

  if (process.env.GSHEET_WEBHOOK_URL) {
    fetch(process.env.GSHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'geo', bedrijf, sector, plaats, website, naam, functie, email, telefoon, telefoon_nl })
    }).catch(err => console.error('Sheet log error:', err.message));
  }

  try {
    const queries = buildSectorQueries(sector, plaats);
    const aiResponses = await Promise.all(queries.map(q => queryOpenRouterSearch(q)));
    const aiResults = aiResponses.map(r => ({
      query: r.query,
      mentioned: !r.error && r.answer.toLowerCase().includes(bedrijf.toLowerCase()),
      answer: r.answer,
      error: r.error
    }));

    let auditChecks = null;
    if (website) {
      const html = await fetchWebsiteHtml(website);
      auditChecks = calculateAuditChecks(html);
    }

    const totaalscore = calculateScore({ auditChecks, aiResults });
    const schemaSnippet = generateSchemaSnippet({ bedrijf, sector, plaats, website });
    const competitorAnswer = aiResponses[COMPETITOR_QUERY_INDEX]?.answer || '';

    const sectorLabel = {
      hotel: 'hotel or resort',
      restaurant: 'restaurant or café',
      makelaar: 'real estate agency',
      airbnb: 'vacation rental or short-term rental',
      anders: 'local business (sector unknown, do not assume hospitality or tourism)'
    }[sector] || 'local business (sector unknown, do not assume hospitality or tourism)';

    const prompt = `You are writing a personalized AI Visibility Scan report for ${bedrijf}, a ${sectorLabel} in ${plaats}, Curaçao.

Here is what we actually found, use ONLY these facts, never invent statistics or claims:

WEBSITE AUDIT: ${auditChecks ? JSON.stringify(auditChecks) : 'No website was provided, this business does not have a site to audit yet.'}

LIVE AI SEARCH RESULTS (5 real queries sent to a web-search AI model):
${aiResults.map((r, i) => `${i + 1}. "${r.query}" -> ${r.error ? 'the search failed, treat as unknown' : r.mentioned ? 'MENTIONED ' + bedrijf : 'did NOT mention ' + bedrijf}`).join('\n')}

RAW ANSWER TO THE BROAD CATEGORY QUERY (use this to spot real competitor business names, only name businesses that are actually written in this text, never invent one):
"${competitorAnswer}"

Write a report that is bold, direct and specific to ${bedrijf}, in FUNkiness!'s voice: casual, confident, zero corporate fluff, no clichés like "boost your business", no em dash anywhere.`;

    const reportTool = {
      name: 'submit_geo_scan_report',
      description: 'Submit the structured AI Visibility Scan report',
      input_schema: {
        type: 'object',
        properties: {
          intro: { type: 'string', description: `2 sharp sentences about ${bedrijf} specifically, referencing their sector and location.` },
          audit_summary: { type: 'string', description: auditChecks ? '2-3 sentences on what the technical audit found, specific, no fluff.' : 'One sentence noting no website was provided and that this halves what we could check.' },
          ai_search_summary: { type: 'string', description: '2-3 sentences on what happened across the 5 live AI search queries, specific to the actual results given above.' },
          competitors_mentioned: {
            type: 'array',
            items: { type: 'string' },
            description: 'Up to 3 real business names found in the raw competitor-query answer text above that are NOT ' + bedrijf + '. Empty array if none are clearly named.'
          },
          action_point_1: { type: 'string', description: 'One fully explained, concrete action doable today, grounded in the actual findings.' },
          action_point_2: { type: 'string', description: 'A second, different, fully explained concrete action doable today.' },
          action_point_3: { type: 'string', description: 'A third, different, fully explained concrete action doable today.' },
          teaser_more: { type: 'string', description: `1-2 sentences: these are 3 quick wins, there are more opportunities specific to ${bedrijf} worth a closer look.` },
          cta_text: { type: 'string', description: 'A personal, direct, non-salesy invitation to talk with Daisy about the rest.' }
        },
        required: ['intro', 'audit_summary', 'ai_search_summary', 'competitors_mentioned', 'action_point_1', 'action_point_2', 'action_point_3', 'teaser_more', 'cta_text']
      }
    };

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      tools: [reportTool],
      tool_choice: { type: 'tool', name: 'submit_geo_scan_report' },
      messages: [{ role: 'user', content: prompt }]
    });

    const toolUse = message.content.find(block => block.type === 'tool_use');
    if (!toolUse) throw new Error('No tool_use block in response');

    const out = toolUse.input;
    const rapport = {
      intro: out.intro,
      audit_summary: out.audit_summary,
      ai_search_summary: out.ai_search_summary,
      competitors_mentioned: out.competitors_mentioned,
      schema_snippet: schemaSnippet,
      action_point_1: out.action_point_1,
      action_point_2: out.action_point_2,
      action_point_3: out.action_point_3,
      teaser_more: out.teaser_more,
      cta_text: out.cta_text,
      totaalscore,
      booking_url: BOOKING_URL
    };

    if (process.env.TITAN_PASSWORD) {
      mailer.sendMail({
        from: '"FUNkiness!" <sayhello@funkiness.ai>',
        to: email,
        subject: `Your AI Visibility Scan is ready, ${naam}!`,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;background:#f7efe7;padding:40px 32px;border-radius:16px">
            <h1 style="font-size:26px;color:#080403;margin-bottom:8px">Hey ${naam},</h1>
            <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px">${rapport.intro}</p>
            <div style="text-align:center;background:#f21b7a;color:white;border-radius:12px;padding:24px;margin-bottom:24px">
              <div style="font-size:48px;font-weight:900;line-height:1">${rapport.totaalscore}</div>
              <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;opacity:0.9">AI Visibility Score / 100</div>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Website audit</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.audit_summary}</p>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">What AI already says</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.ai_search_summary}</p>
              ${rapport.competitors_mentioned.length ? `<p style="font-size:14px;line-height:1.6;color:#f21b7a;font-weight:700;margin:12px 0 0">AI already recommends: ${rapport.competitors_mentioned.join(', ')}</p>` : ''}
            </div>
            <div style="background:#080403;color:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">Paste this into your site today</div>
              <pre style="background:#1a1512;color:#f7efe7;padding:14px;border-radius:8px;font-size:11px;overflow-x:auto;white-space:pre-wrap;word-break:break-word">${rapport.schema_snippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            </div>
            <div style="background:white;border-radius:12px;padding:20px 24px;margin-bottom:16px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#f21b7a;margin-bottom:8px">3 things to do today</div>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 12px">${rapport.action_point_1}</p>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0 0 12px">${rapport.action_point_2}</p>
              <p style="font-size:15px;line-height:1.6;color:#333;margin:0">${rapport.action_point_3}</p>
            </div>
            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:8px;font-style:italic">${rapport.teaser_more}</p>
            <p style="font-size:15px;color:#444;line-height:1.6;margin-bottom:20px">${rapport.cta_text}</p>
            <div style="text-align:center;margin-bottom:32px">
              <a href="${BOOKING_URL}" style="display:inline-block;background:#f21b7a;color:white;padding:14px 32px;border-radius:99px;font-size:15px;font-weight:700;text-decoration:none">
                Plan a call with Daisy →
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
        subject: `Nieuwe AI Visibility Scan: ${bedrijf}, score ${rapport.totaalscore}/100`,
        html: `
          <h2 style="color:#f21b7a;font-family:sans-serif">Nieuwe AI Visibility Scan</h2>
          <table style="border-collapse:collapse;width:100%;font-family:sans-serif;margin-bottom:24px">
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Bedrijf</td><td style="padding:8px;border:1px solid #eee">${bedrijf}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Sector</td><td style="padding:8px;border:1px solid #eee">${sectorNaam}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Plaats</td><td style="padding:8px;border:1px solid #eee">${plaats}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Website</td><td style="padding:8px;border:1px solid #eee">${website || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Naam</td><td style="padding:8px;border:1px solid #eee">${naam || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Functie</td><td style="padding:8px;border:1px solid #eee">${functie || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (CW)</td><td style="padding:8px;border:1px solid #eee">${telefoon || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Telefoon (NL)</td><td style="padding:8px;border:1px solid #eee">${telefoon_nl || 'niet opgegeven'}</td></tr>
            <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Score</td><td style="padding:8px;border:1px solid #eee">${rapport.totaalscore}/100</td></tr>
          </table>
          <h3 style="font-family:sans-serif;color:#080403">Volledig rapport</h3>
          <div style="font-family:sans-serif;font-size:14px;color:#333;line-height:1.6">
            <p><strong>Intro:</strong> ${rapport.intro}</p>
            <p><strong>Audit:</strong> ${rapport.audit_summary}</p>
            <p><strong>AI search:</strong> ${rapport.ai_search_summary}</p>
            <p><strong>Concurrenten genoemd:</strong> ${rapport.competitors_mentioned.join(', ') || 'geen'}</p>
            <p><strong>Actiepunt 1:</strong> ${rapport.action_point_1}</p>
            <p><strong>Actiepunt 2:</strong> ${rapport.action_point_2}</p>
            <p><strong>Actiepunt 3:</strong> ${rapport.action_point_3}</p>
          </div>
        `
      }).catch(err => console.error('Lead email error:', err.message));
    }

    res.json({ success: true, rapport, bedrijf });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Scan could not be generated. Please try again.' });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add api/geo-scan.js
git commit -m "Add api/geo-scan.js: AI Visibility Scan backend (audit, OpenRouter search, Claude report, email)"
```

---

### Task 3: `vercel.json` timeout config

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add the new function's maxDuration**

In `vercel.json`, inside `"functions"`, add a line matching the existing three entries:

```json
  "functions": {
    "api/scan.js": { "maxDuration": 30 },
    "api/marketing-scan.js": { "maxDuration": 30 },
    "api/archetype-quiz.js": { "maxDuration": 30 },
    "api/geo-scan.js": { "maxDuration": 30 }
  },
```

- [ ] **Step 2: Verify the file is still valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('vercel.json', 'utf8')); console.log('OK')"`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "Give api/geo-scan.js the same 30s timeout as the other scan endpoints"
```

---

### Task 4: `scan.html` markup

**Files:**
- Modify: `scan.html`

- [ ] **Step 1: Add the third type card (step 0)**

Find (around line 722-727):

```html
          <button class="scan-type-card" data-scan-type="marketing">
            <span class="scan-type-label">Marketing Strategy</span>
            <strong>Marketing Strategy Scan</strong>
            <p>See how your overall marketing measures up. Brand, audience, channels and execution.</p>
          </button>
        </div>
```

Replace with:

```html
          <button class="scan-type-card" data-scan-type="marketing">
            <span class="scan-type-label">Marketing Strategy</span>
            <strong>Marketing Strategy Scan</strong>
            <p>See how your overall marketing measures up. Brand, audience, channels and execution.</p>
          </button>
          <button class="scan-type-card" data-scan-type="geo">
            <span class="scan-type-label">AI Visibility</span>
            <strong>AI Visibility Scan</strong>
            <p>Find out if ChatGPT, Perplexity and Google's AI already know your business, and get a ready-to-use fix today.</p>
          </button>
        </div>
```

Also update the intro copy just above it (around line 714), find:

```html
        <p class="scan-sub">Two free scans, both built for businesses on Curaçao. Pick the one you need and get your personalized report in minutes.</p>
```

Replace with:

```html
        <p class="scan-sub">Three free scans, all built for businesses on Curaçao. Pick the one you need and get your personalized report in minutes.</p>
```

- [ ] **Step 2: Add the plaats/website fields to step 1**

Find (around line 743-752):

```html
        <div class="scan-form-group">
          <label>Your sector</label>
          <div class="scan-options-grid" data-field="sector">
            <button class="scan-option-btn" data-value="hotel">Hotel / Resort</button>
            <button class="scan-option-btn" data-value="restaurant">Restaurant / Café</button>
            <button class="scan-option-btn" data-value="makelaar">Real Estate</button>
            <button class="scan-option-btn" data-value="airbnb">Vacation Rental</button>
            <button class="scan-option-btn" data-value="anders">Other</button>
          </div>
        </div>
```

Replace with (adds the conditional wrapper right after it):

```html
        <div class="scan-form-group">
          <label>Your sector</label>
          <div class="scan-options-grid" data-field="sector">
            <button class="scan-option-btn" data-value="hotel">Hotel / Resort</button>
            <button class="scan-option-btn" data-value="restaurant">Restaurant / Café</button>
            <button class="scan-option-btn" data-value="makelaar">Real Estate</button>
            <button class="scan-option-btn" data-value="airbnb">Vacation Rental</button>
            <button class="scan-option-btn" data-value="anders">Other</button>
          </div>
        </div>
        <div id="geoFieldsWrap" style="display:none">
          <div class="scan-form-group">
            <label>Which town or area on Curaçao?</label>
            <input type="text" id="plaats" placeholder="e.g. Willemstad, Jan Thiel" />
          </div>
          <div class="scan-form-group">
            <label>Your website <span class="scan-hint">(optional, unlocks the technical audit)</span></label>
            <input type="url" id="website" placeholder="https://yourbusiness.com" />
          </div>
        </div>
```

- [ ] **Step 3: Wrap the existing report content and add the geo report block**

Find (around line 1104-1111):

```html
    <section class="scan-step" data-step="7" id="reportStep">
      <div class="scan-step-inner">
        <span class="scan-eyebrow" id="reportEyebrow">Your Scan</span>
        <h2 class="scan-h2" id="reportTitle">Your socials.<br><span class="scan-pink">Exposed.</span></h2>
        <p class="scan-intro-text" id="reportIntro"></p>
        <p class="scan-email-note" id="reportEmailNote"></p>

        <div class="scan-radar-wrap">
          <canvas id="radarChart"></canvas>
        </div>
```

Replace with:

```html
    <section class="scan-step" data-step="7" id="reportStep">
      <div class="scan-step-inner">
        <span class="scan-eyebrow" id="reportEyebrow">Your Scan</span>
        <h2 class="scan-h2" id="reportTitle">Your socials.<br><span class="scan-pink">Exposed.</span></h2>
        <p class="scan-intro-text" id="reportIntro"></p>
        <p class="scan-email-note" id="reportEmailNote"></p>

        <div id="standardReportBlocks">

        <div class="scan-radar-wrap">
          <canvas id="radarChart"></canvas>
        </div>
```

Then find the end of that same block (around line 1148-1157):

```html
        <div class="scan-download-wrap">
          <button class="scan-btn-download" onclick="downloadReport()">Download your report <span>↓</span></button>
        </div>

        <div class="scan-cta-wrap">
          <p class="scan-cta-hook" id="ctaHook"></p>
          <a id="btnWhatsApp" href="https://wa.me/59996751737" class="scan-btn-cta" target="_blank" rel="noopener">Say hello on WhatsApp <span>→</span></a>
        </div>
      </div>
    </section>
```

Replace with (closes `#standardReportBlocks` and adds the new `#geoReportBlocks` sibling):

```html
        <div class="scan-download-wrap">
          <button class="scan-btn-download" onclick="downloadReport()">Download your report <span>↓</span></button>
        </div>

        <div class="scan-cta-wrap">
          <p class="scan-cta-hook" id="ctaHook"></p>
          <a id="btnWhatsApp" href="https://wa.me/59996751737" class="scan-btn-cta" target="_blank" rel="noopener">Say hello on WhatsApp <span>→</span></a>
        </div>

        </div>

        <div id="geoReportBlocks" style="display:none">
          <div class="scan-score-badge-wrap">
            <div class="scan-score-badge">
              <span class="scan-score-num" id="geoScoreNum">0</span>
              <span class="scan-score-label">AI Visibility</span>
            </div>
          </div>

          <div class="scan-working-wrap">
            <p class="scan-working-label">Website audit</p>
            <p id="geoAuditSummary"></p>
          </div>

          <div class="scan-working-wrap">
            <p class="scan-working-label">What AI already says</p>
            <p id="geoAiSummary"></p>
            <div id="geoCompetitors" style="display:none;margin-top:10px">
              <p style="color:#f21b7a;font-weight:800"></p>
            </div>
          </div>

          <div class="scan-kansen-wrap">
            <h3 class="scan-h3">Paste this into your site today</h3>
            <pre id="geoSchemaCode" style="white-space:pre-wrap;word-break:break-word;font-size:12px;background:#080403;color:#f7efe7;padding:14px;border-radius:8px;overflow-x:auto"></pre>
          </div>

          <div class="scan-kansen-wrap">
            <h3 class="scan-h3">3 things to do today</h3>
            <p id="geoAction1" style="margin-bottom:12px"></p>
            <p id="geoAction2" style="margin-bottom:12px"></p>
            <p id="geoAction3"></p>
          </div>

          <div class="scan-fomo-wrap">
            <p id="geoTeaser" style="font-style:italic"></p>
          </div>

          <div class="scan-cta-wrap">
            <p class="scan-cta-hook" id="geoCtaHook"></p>
            <a id="btnBookCall" href="mailto:sayhello@funkiness.ai" class="scan-btn-cta">Plan a call with Daisy <span>→</span></a>
          </div>
        </div>

      </div>
    </section>
```

- [ ] **Step 4: Commit**

```bash
git add scan.html
git commit -m "Add AI Visibility Scan card, form fields and report layout to scan.html"
```

---

### Task 5: `scan-script.js` flow

**Files:**
- Modify: `scan-script.js`

**Interfaces:**
- Consumes: `POST /api/geo-scan` → `{ success, rapport: { intro, audit_summary, ai_search_summary, competitors_mentioned, schema_snippet, action_point_1, action_point_2, action_point_3, teaser_more, cta_text, totaalscore, booking_url }, bedrijf }`

- [ ] **Step 1: Skip the scored-question steps for the geo flow**

Find `nextStep()` (around line 69-73):

```js
function nextStep() {
  if (!validateStep(currentStep)) return;
  currentStep++;
  showStep(currentStep);
}
```

Replace with:

```js
function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep === 1 && scanType === 'geo') {
    submitScan();
    return;
  }
  currentStep++;
  showStep(currentStep);
}
```

- [ ] **Step 2: Require "plaats" for the geo flow, toggle the geo fields and eyebrow text**

Find in `validateStep()` (around line 87-102), the end of the `step === 1` block:

```js
    if (!fieldSelections['sector']) {
      alert('Please select your sector.');
      return false;
    }
    return true;
  }
```

Replace with:

```js
    if (!fieldSelections['sector']) {
      alert('Please select your sector.');
      return false;
    }
    if (scanType === 'geo') {
      const plaats = document.getElementById('plaats').value.trim();
      if (!plaats) { shake('plaats'); return false; }
    }
    return true;
  }
```

Find in `showStep()` (around line 36-39):

```js
  if (n === 1 && scanType) {
    const eyebrow = document.getElementById('step1Eyebrow');
    if (eyebrow) eyebrow.textContent = scanType === 'social' ? 'Social Media Scan' : 'Marketing Strategy Scan';
  }
```

Replace with:

```js
  if (n === 1 && scanType) {
    const eyebrow = document.getElementById('step1Eyebrow');
    if (eyebrow) eyebrow.textContent = scanType === 'social' ? 'Social Media Scan' : scanType === 'geo' ? 'AI Visibility Scan' : 'Marketing Strategy Scan';
    const geoFields = document.getElementById('geoFieldsWrap');
    if (geoFields) geoFields.style.display = scanType === 'geo' ? 'block' : 'none';
  }
```

- [ ] **Step 3: Branch `submitScan()` for the geo flow**

Find the top of `submitScan()` (around line 175-176):

```js
async function submitScan() {
  if (!validateStep(5)) return;
```

Replace with:

```js
async function submitScan() {
  if (!validateStep(scanType === 'geo' ? 1 : 5)) return;
```

Then find, right after the existing `showStep(6);` line and before `const antwoorden = {};` (around line 193-196):

```js
  document.getElementById('loadingName').textContent = bedrijf;
  currentStep = 6;
  showStep(6);

  const antwoorden = {};
```

Replace with (adds the geo branch, `return`s before reaching the existing quiz-based flow):

```js
  document.getElementById('loadingName').textContent = bedrijf;
  currentStep = 6;
  showStep(6);

  if (scanType === 'geo') {
    const plaats  = document.getElementById('plaats').value.trim();
    const website = document.getElementById('website')?.value.trim() || '';
    const honeypot = document.getElementById('honeypot')?.value || '';

    try {
      const res = await fetch('/api/geo-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedrijf, sector, plaats, website, email, telefoon, telefoon_nl, naam, functie, honeypot })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      renderGeoReport(data.rapport, data.bedrijf, email);
      currentStep = 7;
      showStep(7);
    } catch {
      alert('Something went wrong. Please try again.');
      currentStep = 1;
      showStep(1);
    }
    return;
  }

  const antwoorden = {};
```

- [ ] **Step 4: Add `renderGeoReport()` and toggle the block visibility in the existing `renderReport()`**

Find the top of `renderReport()` (around line 230-231):

```js
function renderReport(rapport, bedrijf, naam, functie, email) {
  const isSocial = scanType === 'social';
```

Replace with:

```js
function renderReport(rapport, bedrijf, naam, functie, email) {
  document.getElementById('standardReportBlocks').style.display = 'block';
  document.getElementById('geoReportBlocks').style.display = 'none';

  const isSocial = scanType === 'social';
```

Then add the new function right after `renderReport()` ends (after the closing brace before `function downloadReport()`, around line 354):

```js
function renderGeoReport(rapport, bedrijf, email) {
  document.getElementById('standardReportBlocks').style.display = 'none';
  document.getElementById('geoReportBlocks').style.display = 'block';

  document.getElementById('reportEyebrow').textContent = 'Your AI Visibility Scan';
  document.getElementById('reportTitle').innerHTML = `${escHtml(bedrijf)}'s AI visibility.<br><span class="scan-pink">Exposed.</span>`;
  document.getElementById('reportIntro').textContent = rapport.intro;
  document.getElementById('reportEmailNote').textContent = `We also sent a copy to ${email}. Don't see it? Check your spam folder.`;

  document.getElementById('geoScoreNum').textContent = rapport.totaalscore;
  document.getElementById('geoAuditSummary').textContent = rapport.audit_summary;
  document.getElementById('geoAiSummary').textContent = rapport.ai_search_summary;

  const compWrap = document.getElementById('geoCompetitors');
  if (rapport.competitors_mentioned && rapport.competitors_mentioned.length) {
    compWrap.style.display = 'block';
    compWrap.querySelector('p').textContent = `AI already recommends: ${rapport.competitors_mentioned.join(', ')}`;
  } else {
    compWrap.style.display = 'none';
  }

  document.getElementById('geoSchemaCode').textContent = rapport.schema_snippet;
  document.getElementById('geoAction1').textContent = rapport.action_point_1;
  document.getElementById('geoAction2').textContent = rapport.action_point_2;
  document.getElementById('geoAction3').textContent = rapport.action_point_3;
  document.getElementById('geoTeaser').textContent = rapport.teaser_more;
  document.getElementById('geoCtaHook').textContent = rapport.cta_text;
  document.getElementById('btnBookCall').href = rapport.booking_url;
}
```

- [ ] **Step 5: Commit**

```bash
git add scan-script.js
git commit -m "Wire up the AI Visibility Scan flow: skip scored questions, submit, render report"
```

---

### Task 6: Local test harness (test before deploying)

**Files:**
- Create: `scripts/test-geo-scan-local.js`
- Modify: `package.json` (root)

This is the task that lets Daisy try the real thing before it goes live: it calls the actual `api/geo-scan.js` handler directly with fake form data, using the real API keys from `.env`, and prints the report to the terminal. **This spends real OpenRouter and Claude credits and sends two real emails each time it runs.**

- [ ] **Step 1: Add `dotenv` as a dev dependency**

Run: `npm install --save-dev dotenv`

Confirm `package.json` now lists `dotenv` under `devDependencies`.

- [ ] **Step 2: Write the test harness**

Create `scripts/test-geo-scan-local.js`:

```js
import 'dotenv/config';
import handler from '../api/geo-scan.js';

const fakeRequest = {
  method: 'POST',
  body: {
    bedrijf: 'Blue Bay Test Resort',
    sector: 'hotel',
    plaats: 'Willemstad',
    website: 'https://www.funkiness.ai',
    email: process.env.TEST_EMAIL || 'sayhello@funkiness.ai',
    telefoon: '+599 9 123 4567',
    telefoon_nl: '',
    naam: 'Daisy',
    functie: 'Founder',
    honeypot: ''
  }
};

function makeFakeResponse() {
  return {
    _status: 200,
    status(code) { this._status = code; return this; },
    json(payload) {
      console.log(`\n--- Response (HTTP ${this._status}) ---\n`);
      console.log(JSON.stringify(payload, null, 2));
      return payload;
    }
  };
}

console.log('Running the AI Visibility Scan handler locally against real APIs...');
console.log('Test business:', fakeRequest.body.bedrijf, '/', fakeRequest.body.website);
await handler(fakeRequest, makeFakeResponse());
console.log('\nDone. Check the inbox for', fakeRequest.body.email, 'and sayhello@funkiness.ai for the two report emails.');
```

- [ ] **Step 3: Run it and read the output**

Run: `node scripts/test-geo-scan-local.js`

Expected: after a few seconds (5 parallel OpenRouter calls + 1 Claude call + a real website fetch of funkiness.ai), a `Response (HTTP 200)` block prints with the full `rapport` object: `intro`, `audit_summary`, `ai_search_summary`, `competitors_mentioned`, `schema_snippet`, three `action_point_*` fields, `teaser_more`, `cta_text`, and `totaalscore`. Two real emails should also arrive.

**Manual check for Daisy before moving on:** read the printed `schema_snippet`, confirm it is valid-looking JSON-LD with `"@type": "Hotel"`. Read the two report emails and confirm the tone matches FUNkiness! (no clichés, no em dash, no invented numbers).

- [ ] **Step 4: Commit**

```bash
git add scripts/test-geo-scan-local.js package.json package-lock.json
git commit -m "Add a local test harness for the AI Visibility Scan handler"
```

---

### Task 7: Deploy

**Files:** none (git operation only)

**Only do this once Daisy has run Task 6 and approved the output.**

- [ ] **Step 1: Push to main**

```bash
git push
```

- [ ] **Step 2: Confirm live**

Open `https://www.funkiness.ai/scan.html`, pick "AI Visibility Scan", fill in a real test business, and confirm the full flow works end to end on the live site the same way it did locally.

---

## Open follow-up (not part of this plan)

- Swap `BOOKING_URL` in `api/geo-scan.js` from the `mailto:` fallback to a real Cal.com link once Daisy sets one up (she asked to be walked through that separately).
- Make.com integration for lead nurture, deliberately out of scope (see spec).
