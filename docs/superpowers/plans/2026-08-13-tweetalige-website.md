# Tweetalige Website (NL/EN) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Dutch translation of the FUNkiness! marketing site under `nl/`, with English as the default language and a flag-based language switcher, without touching `quiz.html`, `scan.html`, or `island-host-ai-prompt-kit.html`.

**Architecture:** Static HTML site, no build step, hosted on Vercel with `cleanUrls: true`. Every bilingual page gets a sibling file under `nl/` with the same filename. `style.css` stays shared between languages. No JavaScript language-detection or redirect logic is added.

**Tech Stack:** Plain HTML/CSS. No framework, no templating engine, no test runner. "Tests" in this plan are `grep` content checks and manual browser verification via a local static file server.

**Spec:** `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md`

## Global Constraints

- Bilingual pages (get an `nl/` counterpart): `index.html`, `what-we-do.html`, `contact.html`, `faq.html`, `blog.html`, `blog-ai-curacao.html`, `blog-market-position-curacao.html`, `blog-marketing-strategy-curacao.html`, `connect.html`.
- Never touch `quiz.html`, `scan.html`, `island-host-ai-prompt-kit.html`. No `nl/` copies of these.
- English is the default language everywhere. No automatic language detection or redirect based on browser/locale.
- Slogan `Boring was never the plan.` (and any ticker variant of it, e.g. `STRATEGY FIRST. BORING NEVER.`) stays in English on every NL page, unchanged.
- Brand rules apply to Dutch copy exactly as to English: no em dash (—), no `" - "` (space-hyphen-space) as a separator, no "premium"/"luxury"/"luxe", no unverifiable claims, energetic/bold/humorous tone, no problem-framing, Berdien does not live on Curaçao yet (do not imply otherwise in Dutch either).
- **Link convention (new links only — do not touch existing EN-to-EN links):**
  - Every href added as part of this feature (language-switch flags, and every internal link inside a newly created `nl/*.html` file) uses a **root-relative path with the `.html` extension**, e.g. `/what-we-do.html`, `/nl/what-we-do.html`, `/scan.html`, except the homepage, which is `/` (EN) and `/nl/` (NL).
  - Existing EN-to-EN links (bare filenames like `href="what-we-do.html"`) are left exactly as they are.
  - `hreflang` tags use the full clean-URL form matching existing `<link rel="canonical">` conventions, e.g. `https://www.funkiness.ai/what-we-do`, `https://www.funkiness.ai/nl/what-we-do`.
- **Internal link map** for the 8 pages that share the standard navbar (all except `connect.html`): `what-we-do.html`, `contact.html`, `faq.html`, `blog.html`, `scan.html`, `quiz.html`. `blog.html` additionally links to `blog-ai-curacao.html`, `blog-market-position-curacao.html`, `blog-marketing-strategy-curacao.html`.
- Links from an `nl/*.html` page to `scan.html` or `quiz.html` (English-only) get the literal suffix ` (EN)` appended to the visible link text (e.g. `Gratis Scan (EN)`), and use the root-relative link convention above.

### Vertaalgids (translation glossary — created in Task 1, referenced by every translation task)

| English | Dutch (fixed) |
|---|---|
| What We Do | Wat We Doen |
| Free Scan | Gratis Scan |
| Free Quiz | Gratis Quiz |
| Blog | Blog |
| FAQ | FAQ |
| Home | Home |
| Contact | Contact |
| Say Hello | Zeg Hallo |
| Get your free scan | Vraag je gratis scan aan |
| Boring was never the plan. | Boring was never the plan. *(unchanged, see Global Constraints)* |

### Standard EN head/nav additions (apply to the 8 pages with the standard navbar; `connect.html` is handled separately in Task 10)

1. In `<head>`, immediately after the `<link rel="canonical" href="...">` line, insert:
   ```html
   <link rel="alternate" hreflang="en" href="{EN_CANONICAL}">
   <link rel="alternate" hreflang="nl" href="{NL_CANONICAL}">
   <link rel="alternate" hreflang="x-default" href="{EN_CANONICAL}">
   ```
2. Inside `<nav class="menu">`, immediately before the `<a href="contact.html" class="nav-button" ...>Say Hello <span>↗</span></a>` element, insert:
   ```html
   <div class="lang-switch">
     <a href="{EN_SWITCH_HREF}" class="lang-active" aria-label="English" hreflang="en">🇬🇧</a>
     <a href="{NL_SWITCH_HREF}" aria-label="Nederlands" hreflang="nl">🇳🇱</a>
   </div>
   ```
3. Inside `<div class="mobile-menu" id="mobileMenu">`, immediately after the `<button class="mobile-close" ...>✕</button>` line, insert the same `.lang-switch` block as step 2.

### Standard NL head/nav (apply when creating each `nl/*.html` file)

Same three insertions as above, but:
- `{EN_CANONICAL}` / `{NL_CANONICAL}` are the same absolute URL pair (hreflang block is identical content in both language versions of a page).
- The `lang-switch` block has `class="lang-active"` on the 🇳🇱 link instead of the 🇬🇧 link.
- `<link rel="canonical">` on the NL page points to its own NL URL (e.g. `https://www.funkiness.ai/nl/what-we-do`), not the EN one.
- `<html lang="en">` becomes `<html lang="nl">`.
- Nav link labels use the Vertaalgids. Links to `scan.html`/`quiz.html` get the ` (EN)` suffix.
- Footer nav (`<footer class="site-footer">` → `<nav class="footer-nav">`) gets the same label translation and ` (EN)` suffix treatment as the top nav.

---

### Task 1: Language-switch CSS and translation glossary file

**Files:**
- Modify: `style.css:107-109`
- Create: `docs/vertaalgids-website.md`

**Interfaces:**
- Produces: CSS classes `.lang-switch`, `.lang-switch a`, `.lang-switch a.lang-active` used by every later task. `docs/vertaalgids-website.md` is read by every translation task (Tasks 3-10).

- [ ] **Step 1: Read style.css lines 95-115 to confirm the exact anchor text**

Run: read `style.css` around line 107 and confirm it still ends with the `.nav-button span` / `.black-button span` media block and is immediately followed by the `/* MOBILE MENU */` comment, as read during planning.

- [ ] **Step 2: Insert the language-switch CSS block**

Insert this block immediately before the `/* ============================\n   MOBILE MENU\n   ============================ */` comment (i.e. right after the `@media (min-width: 1100px) { .nav-button span, .black-button span { font-size: 24px; } }` block):

```css
/* ============================
   LANGUAGE SWITCH
   ============================ */
.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 4px;
}

.lang-switch a {
  font-size: 20px;
  line-height: 1;
  text-decoration: none;
  opacity: 0.35;
  filter: grayscale(70%);
  transition: opacity 200ms ease, filter 200ms ease;
}

.lang-switch a:hover { opacity: 0.7; }

.lang-switch a.lang-active {
  opacity: 1;
  filter: none;
}

.mobile-menu .lang-switch {
  position: absolute;
  top: 40px;
  left: 7vw;
  gap: 10px;
}

.mobile-menu .lang-switch a { font-size: 26px; }
```

- [ ] **Step 3: Bump the CSS cache-busting query param**

Every HTML file links `style.css?v=4` (or similar). This task doesn't touch HTML files, so leave this for now — Task 2 onward will reference `style.css?v=6` when editing `<head>` blocks. Just note the new version number here: **v6**.

- [ ] **Step 4: Verify the CSS is syntactically valid**

Run: `python3 -c "import re; s=open('style.css').read(); print(s.count('{'), s.count('}'))"`
Expected: both numbers equal (braces balanced).

- [ ] **Step 5: Write the translation glossary file**

Create `docs/vertaalgids-website.md` with this content:

```markdown
# Vertaalgids website (NL/EN)

Vaste vertalingen voor navigatie- en UI-labels op de tweetalige FUNkiness!-site.
Gebruik deze tabel bij elke pagina die naar `nl/` vertaald wordt, zodat labels
overal identiek zijn.

| Engels | Nederlands (vast) |
|---|---|
| What We Do | Wat We Doen |
| Free Scan | Gratis Scan |
| Free Quiz | Gratis Quiz |
| Blog | Blog |
| FAQ | FAQ |
| Home | Home |
| Contact | Contact |
| Say Hello | Zeg Hallo |
| Get your free scan | Vraag je gratis scan aan |
| Boring was never the plan. | Boring was never the plan. (blijft altijd Engels, ook op NL-pagina's) |

## Regels
- Links naar `scan.html` en `quiz.html` vanaf een NL-pagina krijgen het achtervoegsel
  ` (EN)` in de zichtbare linktekst, bv. "Gratis Scan (EN)".
- Alle merk- en contentregels uit het hoofd-`CLAUDE.md` gelden ook voor de
  Nederlandse teksten (geen emdash, geen " - " separator, geen "premium"/"luxe",
  geen onverifieerbare claims, energiek/bold/humor, geen probleemframe).
- Zie `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md` voor de
  volledige spec.
```

- [ ] **Step 6: Commit**

```bash
git add style.css docs/vertaalgids-website.md
git commit -m "Add language-switch CSS and NL/EN translation glossary"
```

---

### Task 2: Homepage — EN additions + create nl/index.html

**Files:**
- Modify: `index.html`
- Create: `nl/index.html`

**Interfaces:**
- Consumes: `.lang-switch` CSS from Task 1, Vertaalgids from Task 1.
- Produces: `nl/index.html`, linked to by every other NL page's "Home" nav entry (`/nl/`).

- [ ] **Step 1: Read `index.html` in full** (already read during planning — re-read to get current line numbers before editing).

- [ ] **Step 2: Apply the Standard EN head/nav additions to `index.html`**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/`, `{EN_SWITCH_HREF}` = `/`, `{NL_SWITCH_HREF}` = `/nl/`.

Also bump `<link rel="stylesheet" href="style.css?v=4">` to `style.css?v=6`.

- [ ] **Step 3: Create `nl/index.html`**

Full Dutch translation of `index.html`, preserving structure/classes/images/JSON-LD shape exactly, translating only human-readable text (title, meta description/keywords, OG/Twitter tags, hero copy, ticker text except the slogan variant, service cards, "The FUNky Ladies" section, "Why FUNkiness!" cards, scan section copy, footer tagline, JSON-LD `description`/`slogan`/FAQ `name`/`text` fields — keep `slogan` in English per Global Constraints).

Apply the Standard NL head/nav block: `<html lang="nl">`, canonical `https://www.funkiness.ai/nl/`, hreflang triple (same as Task 2 values), 🇳🇱 marked active, nav labels via Vertaalgids, `Free Scan`/`Free Quiz` links become `Gratis Scan (EN)` / `Gratis Quiz (EN)` pointing at `/scan.html` / `/quiz.html`, `What We Doen`/`Blog`/`FAQ`/`Contact` point at `what-we-do.html` / `blog.html` / `faq.html` / `contact.html` (bare filenames — siblings inside `nl/`), footer nav "Home" points at `/nl/`.

Reference `style.css?v=6` via `<link rel="stylesheet" href="../style.css?v=6">` (one level up from `nl/`). All image `src` attributes also need `../` prepended (e.g. `../jeep3.png`, `../funkiness-logo.png`, `../marketing-bureau-curacao.jpg`, `../jeep-side.jpg` etc.) since images live in the project root, not in `nl/`. Translate `alt` text to Dutch.

- [ ] **Step 4: Verify no forbidden characters/patterns in the new file**

Run: `grep -n "—" nl/index.html; grep -n " - " nl/index.html`
Expected: no matches (empty output). If `grep` finds a legitimate non-separator use of " - " (there shouldn't be one), fix the copy instead of the check.

- [ ] **Step 5: Verify every local asset/link target exists**

Run:
```bash
grep -o 'src="\.\./[^"]*"' nl/index.html | sed 's/src="\.\.\///;s/"$//' | while read f; do test -f "$f" || echo "MISSING: $f"; done
grep -o 'href="/[a-z0-9.-]*\.html"' nl/index.html | sed 's/href="\///;s/"$//' | while read f; do test -f "$f" || echo "MISSING: $f"; done
```
Expected: no `MISSING:` lines.

- [ ] **Step 6: Manual browser check**

Run: `python3 -m http.server 8000` from the project root, then open `http://localhost:8000/` and `http://localhost:8000/nl/`. Confirm: both pages render with correct styling, the flag toggle switches between them and back, the mobile menu flag toggle works, and no image is broken.

- [ ] **Step 7: Commit**

```bash
git add index.html nl/index.html
git commit -m "Add NL homepage and language switcher to EN homepage"
```

---

### Task 3: what-we-do.html — EN additions + create nl/what-we-do.html

**Files:**
- Modify: `what-we-do.html`
- Create: `nl/what-we-do.html`

**Interfaces:** Same as Task 2, applied to this page.

- [ ] **Step 1: Read `what-we-do.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/what-we-do`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/what-we-do`, `{EN_SWITCH_HREF}` = `/what-we-do.html`, `{NL_SWITCH_HREF}` = `/nl/what-we-do.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/what-we-do.html`** — full Dutch translation, same rules as Task 2 Step 3 (relative asset paths get `../`, sibling NL pages linked by bare filename, `scan.html`/`quiz.html` get ` (EN)` suffix + root-relative href, canonical/hreflang per this task's values, `<html lang="nl">`).

- [ ] **Step 4: Verify no forbidden characters/patterns** — same grep commands as Task 2 Step 4, run against `nl/what-we-do.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — same commands as Task 2 Step 5, run against `nl/what-we-do.html`.

- [ ] **Step 6: Manual browser check** — with the server from Task 2 still running (or restart it), open `http://localhost:8000/what-we-do.html` and `http://localhost:8000/nl/what-we-do.html`, confirm rendering and switcher.

- [ ] **Step 7: Commit**

```bash
git add what-we-do.html nl/what-we-do.html
git commit -m "Add NL what-we-do page and language switcher to EN version"
```

---

### Task 4: contact.html — EN additions + create nl/contact.html

**Files:**
- Modify: `contact.html`
- Create: `nl/contact.html`

- [ ] **Step 1: Read `contact.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/contact`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/contact`, `{EN_SWITCH_HREF}` = `/contact.html`, `{NL_SWITCH_HREF}` = `/nl/contact.html`. Bump `style.css?v=4` → `style.css?v=6`. Note `contact.html`'s nav-button already carries `style="background:var(--pink);"` (active-page styling) — leave that untouched, insert `.lang-switch` before it as usual.

- [ ] **Step 3: Create `nl/contact.html`** — full Dutch translation, same rules as Task 2 Step 3. Pay attention to any contact form field labels/placeholders/button text — translate those too. If the form posts to a backend endpoint (check for `<form action="...">` or JS `fetch(...)` calls in the file), keep the endpoint URL and field `name` attributes exactly as in the English version — only translate visible labels, placeholders and button text, never `name`/`id` attributes or the submit target.

- [ ] **Step 4: Verify no forbidden characters/patterns** — same as before, against `nl/contact.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — same as before, against `nl/contact.html`.

- [ ] **Step 6: Manual browser check** — open `http://localhost:8000/contact.html` and `http://localhost:8000/nl/contact.html`; if there's a form, submit a test entry on the EN page only (not the NL page) to confirm the form still posts correctly after the head/nav edit.

- [ ] **Step 7: Commit**

```bash
git add contact.html nl/contact.html
git commit -m "Add NL contact page and language switcher to EN version"
```

---

### Task 5: faq.html — EN additions + create nl/faq.html

**Files:**
- Modify: `faq.html`
- Create: `nl/faq.html`

- [ ] **Step 1: Read `faq.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/faq`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/faq`, `{EN_SWITCH_HREF}` = `/faq.html`, `{NL_SWITCH_HREF}` = `/nl/faq.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/faq.html`** — full Dutch translation, same rules as Task 2 Step 3. This page is long (393 lines) — translate every question and answer, not just headings. If `faq.html` contains its own `FAQPage` JSON-LD block, translate its `name`/`text` fields to Dutch too, keeping `@type`/`@id`/URL fields unchanged.

- [ ] **Step 4: Verify no forbidden characters/patterns** — against `nl/faq.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — against `nl/faq.html`.

- [ ] **Step 6: Manual browser check** — open `http://localhost:8000/faq.html` and `http://localhost:8000/nl/faq.html`, confirm all Q&A items render and any accordion/toggle JS still works on both.

- [ ] **Step 7: Commit**

```bash
git add faq.html nl/faq.html
git commit -m "Add NL FAQ page and language switcher to EN version"
```

---

### Task 6: blog.html — EN additions + create nl/blog.html

**Files:**
- Modify: `blog.html`
- Create: `nl/blog.html`

- [ ] **Step 1: Read `blog.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/blog`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/blog`, `{EN_SWITCH_HREF}` = `/blog.html`, `{NL_SWITCH_HREF}` = `/nl/blog.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/blog.html`** — full Dutch translation, same rules as Task 2 Step 3. This is the blog listing page: it links to `blog-ai-curacao.html`, `blog-market-position-curacao.html`, `blog-marketing-strategy-curacao.html` as well as the standard nav targets. Since these three posts also get NL versions (Tasks 7-9), link to them as bare filenames (siblings inside `nl/`): `blog-ai-curacao.html`, `blog-market-position-curacao.html`, `blog-marketing-strategy-curacao.html`. Translate each post's teaser title/excerpt shown on the listing page.

- [ ] **Step 4: Verify no forbidden characters/patterns** — against `nl/blog.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — against `nl/blog.html`, plus additionally check the three blog post links resolve once Tasks 7-9 land (it's fine if this check shows them missing at this point in the task order — re-run it after Task 9).

- [ ] **Step 6: Manual browser check** — open `http://localhost:8000/blog.html` and `http://localhost:8000/nl/blog.html`.

- [ ] **Step 7: Commit**

```bash
git add blog.html nl/blog.html
git commit -m "Add NL blog listing page and language switcher to EN version"
```

---

### Task 7: blog-ai-curacao.html — EN additions + create nl/blog-ai-curacao.html

**Files:**
- Modify: `blog-ai-curacao.html`
- Create: `nl/blog-ai-curacao.html`

- [ ] **Step 1: Read `blog-ai-curacao.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/blog-ai-curacao`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/blog-ai-curacao`, `{EN_SWITCH_HREF}` = `/blog-ai-curacao.html`, `{NL_SWITCH_HREF}` = `/nl/blog-ai-curacao.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/blog-ai-curacao.html`** — full Dutch translation of the entire blog post body (per `CLAUDE.md`'s blog post template: hero kicker/h1/script-word, sidebar, article body, callout(s), CTA), same rules as Task 2 Step 3. Blog post JSON-LD (likely `Article`/`BlogPosting`) gets its `headline`/`description` translated, `@id`/URL/date fields unchanged.

- [ ] **Step 4: Verify no forbidden characters/patterns** — against `nl/blog-ai-curacao.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — against `nl/blog-ai-curacao.html`.

- [ ] **Step 6: Manual browser check** — open both language versions, confirm the wave-dividers and sidebar render correctly.

- [ ] **Step 7: Commit**

```bash
git add blog-ai-curacao.html nl/blog-ai-curacao.html
git commit -m "Add NL blog-ai-curacao post and language switcher to EN version"
```

---

### Task 8: blog-market-position-curacao.html — EN additions + create nl/blog-market-position-curacao.html

**Files:**
- Modify: `blog-market-position-curacao.html`
- Create: `nl/blog-market-position-curacao.html`

- [ ] **Step 1: Read `blog-market-position-curacao.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/blog-market-position-curacao`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/blog-market-position-curacao`, `{EN_SWITCH_HREF}` = `/blog-market-position-curacao.html`, `{NL_SWITCH_HREF}` = `/nl/blog-market-position-curacao.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/blog-market-position-curacao.html`** — same translation rules as Task 7 Step 3.

- [ ] **Step 4: Verify no forbidden characters/patterns** — against `nl/blog-market-position-curacao.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — against `nl/blog-market-position-curacao.html`.

- [ ] **Step 6: Manual browser check** — open both language versions.

- [ ] **Step 7: Commit**

```bash
git add blog-market-position-curacao.html nl/blog-market-position-curacao.html
git commit -m "Add NL blog-market-position post and language switcher to EN version"
```

---

### Task 9: blog-marketing-strategy-curacao.html — EN additions + create nl/blog-marketing-strategy-curacao.html

**Files:**
- Modify: `blog-marketing-strategy-curacao.html`
- Create: `nl/blog-marketing-strategy-curacao.html`

- [ ] **Step 1: Read `blog-marketing-strategy-curacao.html` in full.**

- [ ] **Step 2: Apply the Standard EN head/nav additions.**

Values: `{EN_CANONICAL}` = `https://www.funkiness.ai/blog-marketing-strategy-curacao`, `{NL_CANONICAL}` = `https://www.funkiness.ai/nl/blog-marketing-strategy-curacao`, `{EN_SWITCH_HREF}` = `/blog-marketing-strategy-curacao.html`, `{NL_SWITCH_HREF}` = `/nl/blog-marketing-strategy-curacao.html`. Bump `style.css?v=4` → `style.css?v=6`.

- [ ] **Step 3: Create `nl/blog-marketing-strategy-curacao.html`** — same translation rules as Task 7 Step 3.

- [ ] **Step 4: Verify no forbidden characters/patterns** — against `nl/blog-marketing-strategy-curacao.html`.

- [ ] **Step 5: Verify local asset/link targets exist** — against `nl/blog-marketing-strategy-curacao.html`. Also re-run Task 6 Step 5's check against `nl/blog.html` now that all three posts exist — confirm no `MISSING:` lines remain.

- [ ] **Step 6: Manual browser check** — open both language versions, and re-check `http://localhost:8000/nl/blog.html` to confirm all three post links now resolve.

- [ ] **Step 7: Commit**

```bash
git add blog-marketing-strategy-curacao.html nl/blog-marketing-strategy-curacao.html
git commit -m "Add NL blog-marketing-strategy post and language switcher to EN version"
```

---

### Task 10: connect.html — add switcher + create nl/connect.html

**Files:**
- Modify: `connect.html`
- Create: `nl/connect.html`

**Interfaces:** `connect.html` does not share the standard navbar/footer (it's the standalone NFC card landing page with inline `<style>` and `<meta name="robots" content="noindex, nofollow">`). It does not need hreflang tags (not indexed) — skip the Standard head/nav recipe for this page and follow the bespoke steps below instead.

- [ ] **Step 1: Read `connect.html` in full** (already read during planning: 161 lines, inline `<style>`, no navbar/footer, dark background).

- [ ] **Step 2: Add a small lang-switch to `connect.html`'s inline `<style>` block**

Append to the `<style>` block (before the closing `</style>` at line 126):

```css
.lang-switch-standalone {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.lang-switch-standalone a {
  font-size: 22px;
  text-decoration: none;
  opacity: 0.35;
  filter: grayscale(70%);
  transition: opacity 200ms ease, filter 200ms ease;
}
.lang-switch-standalone a.lang-active { opacity: 1; filter: none; }
```

- [ ] **Step 3: Insert the switcher markup**

Insert immediately before `<div class="logo-wrap">` (line 130):

```html
<div class="lang-switch-standalone">
  <a href="/connect.html" class="lang-active" aria-label="English">🇬🇧</a>
  <a href="/nl/connect.html" aria-label="Nederlands">🇳🇱</a>
</div>
```

- [ ] **Step 4: Create `nl/connect.html`**

Full Dutch translation of the page (headline, script-line, button labels "Say hello on WhatsApp" → "Zeg hallo via WhatsApp", "Website" stays "Website"), keeping the WhatsApp/Instagram/TikTok URLs and the `mailto:` link exactly as in the English version. Keep `Boring was never the plan.` in English. Update the switcher markup so 🇳🇱 has `class="lang-active"` and 🇬🇧 has none, with hrefs `/connect.html` and `/nl/connect.html`. Update `<html lang="nl">` and `<meta name="robots" content="noindex, nofollow">` stays as-is (still not meant to be indexed). Image `src="funkiness-logo.png"` becomes `src="../funkiness-logo.png"`.

- [ ] **Step 5: Verify no forbidden characters/patterns**

Run: `grep -n "—" nl/connect.html; grep -n " - " nl/connect.html`
Expected: no matches.

- [ ] **Step 6: Manual browser check**

With the local server running, open `http://localhost:8000/connect.html` and `http://localhost:8000/nl/connect.html`. Confirm the WhatsApp/Instagram/TikTok buttons and the flag switcher all work.

- [ ] **Step 7: Commit**

```bash
git add connect.html nl/connect.html
git commit -m "Add NL connect page and language switcher to EN version"
```

---

### Task 11: Update sitemap.xml with the 8 new /nl/ URLs

**Files:**
- Modify: `sitemap.xml`

**Interfaces:** Consumes the 8 bilingual page URLs already live after Tasks 2-9 (connect.html is `noindex`, so it is excluded from the sitemap, matching current practice — `connect.html` itself is not in `sitemap.xml` today either).

- [ ] **Step 1: Read the current `sitemap.xml` in full** (already read during planning — 9 `<url>` entries, one per indexed EN page, `connect.html` is absent since it's `noindex`).

- [ ] **Step 2: Add one `<url>` entry per bilingual, indexed NL page**

For each of `nl/` (home), `nl/what-we-do`, `nl/faq`, `nl/blog`, `nl/blog-marketing-strategy-curacao`, `nl/blog-ai-curacao`, `nl/blog-market-position-curacao`, `nl/contact`, add an entry immediately after its EN counterpart, matching that counterpart's `changefreq`/`priority`, with today's date as `lastmod`. Example for the homepage pair:

```xml
  <url>
    <loc>https://www.funkiness.ai/</loc>
    <lastmod>2026-06-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.funkiness.ai/nl/</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
```

Repeat this pattern (EN entry unchanged, new NL entry directly after it with the same `changefreq`/`priority` and `lastmod` `2026-08-13`) for all 8 remaining pairs, using each page's existing `<loc>` path prefixed with `/nl`.

- [ ] **Step 3: Validate the XML is well-formed**

Run: `python3 -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('OK')"`
Expected: `OK`.

- [ ] **Step 4: Verify entry count**

Run: `grep -c "<loc>" sitemap.xml`
Expected: `17` (9 existing + 8 new).

- [ ] **Step 5: Commit**

```bash
git add sitemap.xml
git commit -m "Add /nl/ URLs to sitemap.xml"
```

---

### Task 12: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md` (the one at the project root: `/Users/daisykuipers/Library/Mobile Documents/com~apple~CloudDocs/Claude Code Projecten/Het Mainframe/CLAUDE.md`)

**Interfaces:** None — this is a documentation-only task, run last so it reflects the actually-shipped structure.

- [ ] **Step 1: Replace the language rule under "Schrijfstijl"**

Find this sentence:
```
Casual, direct, bold, met humor. Altijd positief en vanuit eigen kracht. Kort en krachtig. Nooit corporate, traag, voorspelbaar, safe of verontschuldigend. Engels op de website, Nederlands en Engels op social media. TikTok is een kernplatform. Altijd spreektaal.
```
Replace `Engels op de website, Nederlands en Engels op social media.` with:
```
De website is sinds augustus 2026 tweetalig: Engels is de default taal, Nederlands staat onder de `nl/` submap (bv. `nl/what-we-do.html`), met een vlaggetjes-taalswitcher in de navbar. Geen automatische taaldetectie. `quiz.html`, `scan.html` en `island-host-ai-prompt-kit.html` blijven Engelstalig, geen NL-versie. Vaste navigatie-/UI-vertalingen staan in `docs/vertaalgids-website.md`. Social media blijft Nederlands en Engels.
```

- [ ] **Step 2: Add a reference to the new spec/plan/glossary under "Kennisbestanden" or a new short line near "Tools en projecten"**

Insert this as a new line directly after the "NFC visitekaartje" paragraph (before "## Social media planning"):

```markdown
**Tweetalige website (NL/EN)** - sinds augustus 2026. Elke tweetalige pagina heeft een `nl/`-tegenhanger met dezelfde bestandsnaam (bv. `contact.html` ↔ `nl/contact.html`), gedeelde `style.css`, taalswitcher (🇬🇧/🇳🇱) in de navbar. `quiz.html`, `scan.html` en `island-host-ai-prompt-kit.html` blijven Engels-only. Vertaalgids: `docs/vertaalgids-website.md`. Design-spec: `docs/superpowers/specs/2026-08-13-tweetalige-website-design.md`.
```

- [ ] **Step 3: Verify the file still renders as valid Markdown**

Run: `python3 -c "print(open('CLAUDE.md').read()[:200])"` to confirm the file is still readable/non-empty after the edit (sanity check, not a real Markdown linter — this repo has none).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "Document the bilingual NL/EN website structure in CLAUDE.md"
```

---

## Self-Review Notes

- Spec coverage: file structure (Tasks 2-10), language switcher (Task 1 CSS + every page task), SEO hreflang/sitemap (every page task + Task 11), translation/brand-voice (every page task's Step 3, glossary in Task 1), documentation update (Task 12) — all covered.
- `connect.html` deliberately deviates from the standard recipe (Task 10) since it has no shared navbar/footer and is `noindex` — documented explicitly rather than forced into the standard steps.
- Every task's verification step is a concrete command (`grep`, `python3 -c`, local HTTP server + manual check), not a vague "test it" instruction.
- Task order matters for Task 6/9: `nl/blog.html`'s links to the three NL posts are only fully verifiable after Task 9 — this is called out explicitly in both tasks rather than silently left broken.
