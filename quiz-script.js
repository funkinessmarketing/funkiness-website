const QUESTIONS = [
  {
    text: "If you could fix one thing in your business tomorrow, what would it be?",
    answers: [
      { text: "Stop drowning in tasks that never end", archetype: "T" },
      { text: "Have great content going out every single week", archetype: "C" },
      { text: "Bring in more of the right customers", archetype: "G" },
      { text: "Make every customer experience unforgettable", archetype: "E" }
    ]
  },
  {
    text: "The part of your week you'd most love to hand off?",
    answers: [
      { text: "Emails, admin, scheduling, follow-ups", archetype: "T" },
      { text: "Writing posts, captions, and content", archetype: "C" },
      { text: "Finding leads and chasing new business", archetype: "G" },
      { text: "Answering the same customer questions again", archetype: "E" }
    ]
  },
  {
    text: "It's Monday morning. What's taking up most of your headspace?",
    answers: [
      { text: "The backlog that built up over the weekend", archetype: "T" },
      { text: "What to post and whether anyone's even watching", archetype: "C" },
      { text: "Where the next customer is coming from", archetype: "G" },
      { text: "Making sure today's experience is perfect", archetype: "E" }
    ]
  },
  {
    text: "When you imagine AI working for your business, you see it...",
    answers: [
      { text: "Running in the background while you focus on the big stuff", archetype: "T" },
      { text: "Generating content that actually sounds like you", archetype: "C" },
      { text: "Spotting opportunities and helping you reach more people", archetype: "G" },
      { text: "Making every customer feel like a VIP", archetype: "E" }
    ]
  },
  {
    text: "Your business in 2 years: what does success look like?",
    answers: [
      { text: "A business that runs itself without me being everywhere", archetype: "T" },
      { text: "A brand with a real following people recognize", archetype: "C" },
      { text: "Noticeably bigger, more revenue, more reach", archetype: "G" },
      { text: "Customers who wouldn't dream of going anywhere else", archetype: "E" }
    ]
  },
  {
    text: "What keeps you up at night, in the best way?",
    answers: [
      { text: "How to do more without burning out", archetype: "T" },
      { text: "How to tell your story better", archetype: "C" },
      { text: "How to reach the next level of growth", archetype: "G" },
      { text: "How to create experiences people talk about", archetype: "E" }
    ]
  },
  {
    text: "Right now, where does most of your energy go?",
    answers: [
      { text: "Operations, keeping everything running", archetype: "T" },
      { text: "Marketing and staying visible", archetype: "C" },
      { text: "Sales and finding new customers", archetype: "G" },
      { text: "Customer service and relationships", archetype: "E" }
    ]
  },
  {
    text: "Someone says 'AI can genuinely help your business.' You think...",
    answers: [
      { text: "Yes, I just need it to take things off my plate", archetype: "T" },
      { text: "Yes, I want it to help me create more content", archetype: "C" },
      { text: "Yes, I want it to help me grow and compete", archetype: "G" },
      { text: "Yes, if it makes my customers happier", archetype: "E" }
    ]
  }
];

const ARCHETYPES = {
  T: {
    name: "The Time Terminator",
    tagline: "AI gives you back the one thing money can't buy.",
    icon: "⚡",
    aha: "You don't have a time problem. You have an automation problem.",
    quickWins: [
      {
        action: "Set up 5 WhatsApp quick replies today",
        detail: "Write down the 5 questions you get most on WhatsApp. For each one, open ChatGPT and type: \"Write a WhatsApp reply for this question: [paste the question]. Friendly, confident, max 3 sentences. Sign off as [your name].\" Then open WhatsApp Business, go to Business Tools, Quick Replies, and paste them in. 30 minutes of setup. Hours saved every week.",
        tool: "WhatsApp Business + ChatGPT"
      },
      {
        action: "Stop retyping messages you've sent a hundred times",
        detail: "Think of messages you write over and over: booking confirmations, pricing info, directions, opening hours. For each one, give ChatGPT one example you've actually sent. Ask: \"Rewrite this sharper and shorter, same tone.\" Save every version. You now have a library. Never type them from scratch again.",
        tool: "Claude / ChatGPT"
      },
      {
        action: "Hand AI the task sitting on your to-do list right now",
        detail: "Pick the one thing you've been putting off because it costs too much mental energy: a price list, a product description, a contract paragraph, a follow-up you need to send. Open Claude, describe what you need, give the context. Get a first draft in 2 minutes. Edit once. Send it.",
        tool: "Claude / ChatGPT"
      }
    ],
    shortTerm: [
      "Map your week in writing: every repetitive thing you do Monday to Friday, from booking confirmations to FAQ replies. That list is your AI roadmap. Start automating from the top, one task at a time.",
      "Set your WhatsApp Business greeting and away messages using AI-written copy. Customers who message outside hours get an instant, warm, on-brand reply while you sleep.",
      "Try AI for one admin task a day for two weeks. After 14 days, count how much time you saved. That number becomes your case for doing more."
    ],
    mediumTerm: [
      "Look into ManyChat for WhatsApp: automated reply flows for bookings, FAQs and follow-ups that run 24/7 without you touching your phone.",
      "Build a weekly content routine: every Monday, give AI 5 bullet points about what happened that week. It writes the posts, you review in 10 minutes, you schedule. Seven days handled in one sitting.",
      "Identify your single biggest time drain, the one task that eats the most hours. Build an AI workflow around it: what input does it need, what does good output look like. Brief AI once, use the template forever."
    ],
    tools: [
      { name: "WhatsApp Business", url: "https://business.whatsapp.com", note: "Free" },
      { name: "ChatGPT", url: "https://chatgpt.com", note: "Free / Plus" },
      { name: "Claude", url: "https://claude.ai", note: "Free / Pro" },
      { name: "ManyChat", url: "https://manychat.com", note: "Paid" }
    ],
    cultureNote: "On Curaçao, people expect a fast response on WhatsApp. Anything over a few hours feels slow. Quick replies via WhatsApp Business fix this immediately and keep the relationship warm."
  },
  C: {
    name: "The Content Crusher",
    tagline: "Your voice is your brand. AI makes sure it never goes quiet.",
    icon: "📡",
    aha: "You have stories. AI just needs to help you tell them faster.",
    quickWins: [
      {
        action: "Teach AI your voice in one prompt",
        detail: "Open Claude or ChatGPT. Type: \"Here are 3 texts I wrote that I like: [paste 3 captions, messages or emails you're proud of]. Describe my writing style in 5 words. From now on I'll say 'match my style' before every request.\" Save this as your opening message for every AI conversation. Your output gets 10x more you.",
        tool: "Claude / ChatGPT"
      },
      {
        action: "Turn this week's photos into captions right now",
        detail: "Pick 3 photos sitting on your phone. For each one, write 2 sentences: what's happening, who it's for, what the mood is. Send all three to ChatGPT with this prompt: \"Write an Instagram caption for each. Max 120 characters. Bold and direct. No hashtags. Same tone across all three.\" Post the best one today. No planning needed.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Get 5 scroll-stopping hooks in 2 minutes",
        detail: "Open ChatGPT. Type: \"Write 5 opening lines for a 30-second Reel about [your topic]. Each line must make someone stop scrolling. No questions. No 'have you ever'. Just bold statements. My audience is [describe them in one sentence].\" Use the one that makes you slightly uncomfortable. That's usually the one that works.",
        tool: "ChatGPT / Claude"
      }
    ],
    shortTerm: [
      "Block 90 minutes once this month for a content session. Input: 10 topics, 3 recent photos, your tone brief. Output: a full month of captions ready to copy-paste. Do it once, know exactly what you're posting for 30 days.",
      "Ask AI to write a brand brief: your tone, what you never say, 3 words that describe your style. Save it as a note. Paste it at the start of every new AI conversation. Consistency becomes automatic.",
      "Open Canva AI. Describe your vibe, pick your brand colors, let it generate 5 visuals. Takes 15 minutes. No designer, no full day of work."
    ],
    mediumTerm: [
      "Build a Monday routine: 30 minutes, 5 bullet points about what happened that week, AI turns it into a full week of posts. You review in 10 minutes, schedule, done. Seven days of content on autopilot.",
      "Start a repurposing loop. Every video you post gets turned into 3 captions by AI. Every caption becomes a story. One idea feeds 7 days. Ask AI to do the converting every time.",
      "After 4 weeks, paste your 5 best-performing posts into ChatGPT and ask: 'What do these have in common? What should I keep doing?' Let AI analyze the pattern so you stop guessing and start repeating what works."
    ],
    tools: [
      { name: "ChatGPT", url: "https://chatgpt.com", note: "Free / Plus" },
      { name: "Claude", url: "https://claude.ai", note: "Free / Pro" },
      { name: "Canva AI", url: "https://canva.com", note: "Free / Pro" },
      { name: "CapCut AI", url: "https://capcut.com", note: "Free" }
    ],
    cultureNote: "On Curaçao, authenticity beats polish every time. A real photo with a strong caption outperforms a perfect studio shot. Don't over-produce. Keep it human and keep it real."
  },
  G: {
    name: "The Growth Guru",
    tagline: "The next level is not luck. It's leverage.",
    icon: "🚀",
    aha: "You don't need more effort. You need smarter targeting.",
    quickWins: [
      {
        action: "Build your ideal customer profile in 15 minutes",
        detail: "Open ChatGPT. Type: \"I run [describe your business] on Curaçao. My best customers are people who [describe in 2 sentences]. Build me a detailed profile: who they are, what they want, what they are afraid of, and how they decide to buy.\" Save this document. Paste it into every marketing prompt you write from now on. Everything gets sharper instantly.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Find your market gap with one prompt",
        detail: "Open ChatGPT. Type: \"Look at these 3 businesses that do what I do: [name them, describe briefly]. What are they saying in their marketing? What are they NOT saying that my customers actually care about? Where is the gap?\" The answer usually takes 30 seconds to read and years to see on your own.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Write your best ad in 10 minutes",
        detail: "Open ChatGPT. Type: \"Write 3 Facebook ad headlines for my business. Each one targeting a different fear or desire my ideal customer has. My business: [2 lines]. My customer: [paste the profile from win 1]. Keep each headline under 8 words.\" Test the one that makes you slightly uncomfortable. That is usually the one that converts.",
        tool: "ChatGPT / Meta Ads Manager"
      }
    ],
    shortTerm: [
      "Run one small paid campaign with 2 AI-written ad variations. Budget: as low as 50 USD. Goal: find out which angle gets more clicks before you spend more. Data beats guessing every time.",
      "Ask AI to write your market position in one sentence. Not your tagline. Your actual strategic position: what you do, for whom, and why them over everyone else. If AI struggles, your positioning needs work.",
      "Build a 5-step WhatsApp follow-up sequence for new leads: first contact, value message, social proof, soft offer, final nudge. Ask AI to write every step in your exact tone."
    ],
    mediumTerm: [
      "Build a full lead funnel: ad, landing page headline, WhatsApp first message, 5-step follow-up. AI writes every piece. You connect the steps. Run it for 30 days and track where people drop off.",
      "Set up a monthly market check: ask AI to summarize what is trending in your industry, what people are searching for and what your competitors are pushing. Use it to adjust your strategy before you fall behind.",
      "Use Meta Ads Manager to test 3 different customer segments with AI-written copy. Let data tell you who is actually buying, not who you assumed would."
    ],
    tools: [
      { name: "ChatGPT", url: "https://chatgpt.com", note: "Free / Plus" },
      { name: "Claude", url: "https://claude.ai", note: "Free / Pro" },
      { name: "Meta Ads Manager", url: "https://adsmanager.facebook.com", note: "Free to use" },
      { name: "ManyChat", url: "https://manychat.com", note: "Paid" }
    ],
    cultureNote: "On Curaçao, trust is built person by person. People buy from people they know. Use AI to scale your reach, but keep the personal connection real. Never fully automate the relationship."
  },
  E: {
    name: "The Experience Engine",
    tagline: "Great experiences don't happen by accident.",
    icon: "✨",
    aha: "The best customer experience is not a moment. It's a system.",
    quickWins: [
      {
        action: "Write your perfect welcome message right now",
        detail: "Open ChatGPT. Type: \"Write a WhatsApp welcome message for new customers of my [business type] on Curaçao. Warm, personal, max 4 sentences. Tell them what to expect, when they'll hear from us, and one thing that makes us different. Tone: [friendly / professional / relaxed].\" Copy it into WhatsApp Business under Business Tools, then Greeting Message. Live in 5 minutes.",
        tool: "WhatsApp Business + ChatGPT"
      },
      {
        action: "Write 3 follow-up messages for after a visit or purchase",
        detail: "Open Claude. Type: \"Write 3 different WhatsApp follow-up messages to send to a customer 24 hours after [their visit/purchase]. Each one: different angle, warm, max 3 sentences. Include one question that invites a reply. Business: [describe briefly].\" Send them manually this week. Save the one that gets responses. Automate it later.",
        tool: "Claude / ChatGPT"
      },
      {
        action: "Turn your top 10 questions into instant answers",
        detail: "Write down the 10 questions you hear most before or during a sale. Paste them into ChatGPT: \"Write a clear, friendly answer for each of these questions. Max 2 sentences each. Tone: [your tone]. Business: [what you do].\" Add them to WhatsApp Business as quick replies. Every future customer gets the right answer in seconds, even when you're busy.",
        tool: "WhatsApp Business + ChatGPT"
      }
    ],
    shortTerm: [
      "Build a 3-message post-experience flow: thank you, feedback question, reason to come back. AI writes every message, WhatsApp Business sends them automatically. Takes an afternoon to set up and runs forever.",
      "Map every customer touchpoint in writing: first contact, during the experience, after. For each step, ask AI: 'Where does this feel impersonal or slow?' Fix the biggest gap first, then move to the next.",
      "Write your customer promise in one paragraph using AI: what people can always expect, what you never do, and one thing that makes the experience with you different. Use it to align your whole team."
    ],
    mediumTerm: [
      "Automate the full journey: welcome on WhatsApp, booking confirmation, reminder before the visit, thank you after, re-engagement 30 days later. AI writes every message. ManyChat or email runs them without you.",
      "Collect feedback systematically: after every purchase or visit, send one question via WhatsApp. Paste all replies into Claude monthly and ask: 'What are the most common compliments and complaints? What should I start, stop or change?' Let customers guide your improvement.",
      "Personalize at scale: reference the customer's name, what they bought, when they visited. AI generates the message, you add the personal detail. Takes 30 extra seconds. Makes people feel remembered for years."
    ],
    tools: [
      { name: "WhatsApp Business", url: "https://business.whatsapp.com", note: "Free" },
      { name: "ChatGPT", url: "https://chatgpt.com", note: "Free / Plus" },
      { name: "Claude", url: "https://claude.ai", note: "Free / Pro" },
      { name: "ManyChat", url: "https://manychat.com", note: "Paid" },
      { name: "Mailchimp", url: "https://mailchimp.com", note: "Free tier" }
    ],
    cultureNote: "On Curaçao, the personal touch is not optional. It is expected. People remember how you made them feel. Use AI to make sure you never drop the ball, but make sure every message still feels like it came from a real human who genuinely cares."
  }
};

let currentQ = 0;
let scores = { T: 0, C: 0, G: 0, E: 0 };
let userArchetype = null;

function startQuiz() {
  document.getElementById('quizStart').style.display = 'none';
  document.getElementById('quizWrapper').style.display = 'block';
  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const total = QUESTIONS.length;

  document.getElementById('progressFill').style.width = `${(currentQ / total) * 100}%`;
  document.getElementById('progressLabel').textContent = `${currentQ + 1} / ${total}`;
  document.getElementById('questionText').textContent = q.text;

  const grid = document.getElementById('answerGrid');
  grid.innerHTML = '';

  q.answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.className = 'answer-card';
    btn.textContent = ans.text;
    btn.addEventListener('click', () => selectAnswer(ans.archetype, btn));
    grid.appendChild(btn);
  });

  document.getElementById('screenQuestion').style.display = 'block';
  document.getElementById('screenContact').style.display = 'none';
  document.getElementById('screenLoading').style.display = 'none';
  document.getElementById('screenResult').style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectAnswer(archetype, card) {
  document.querySelectorAll('.answer-card').forEach(c => {
    c.disabled = true;
    c.classList.remove('selected');
  });
  card.classList.add('selected');
  scores[archetype]++;

  setTimeout(() => {
    currentQ++;
    if (currentQ < QUESTIONS.length) {
      renderQuestion();
    } else {
      showContactForm();
    }
  }, 380);
}

function showContactForm() {
  document.getElementById('progressFill').style.width = '100%';
  document.getElementById('progressLabel').textContent = 'Almost done!';
  document.getElementById('screenQuestion').style.display = 'none';
  document.getElementById('screenContact').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calcArchetype() {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function submitQuiz(e) {
  e.preventDefault();

  const naam    = document.getElementById('qNaam').value.trim();
  const email   = document.getElementById('qEmail').value.trim();
  const bedrijf = document.getElementById('qBedrijf').value.trim();
  const sector  = document.getElementById('qSector').value;
  const honeypot = document.getElementById('qHoneypot').value;

  const errorEl = document.getElementById('contactError');

  if (!naam) { errorEl.textContent = 'Please enter your name.'; return; }
  if (!email || !email.includes('@')) { errorEl.textContent = 'Please enter a valid email address.'; return; }
  errorEl.textContent = '';

  userArchetype = calcArchetype();

  document.getElementById('screenContact').style.display = 'none';
  document.getElementById('screenLoading').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const res = await fetch('/api/archetype-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam, email, bedrijf, sector, archetype: userArchetype, scores, honeypot })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Something went wrong. Please try again.');
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Something went wrong. Please try again.');

    renderResult(data.rapport, naam);

  } catch (err) {
    document.getElementById('screenLoading').style.display = 'none';
    document.getElementById('screenContact').style.display = 'block';
    document.getElementById('contactError').textContent = err.message;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function renderResult(rapport, naam) {
  const arch = ARCHETYPES[userArchetype];

  document.getElementById('screenLoading').style.display = 'none';
  document.getElementById('screenResult').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Archetype header
  document.getElementById('resultArchetypeName').textContent = arch.name;
  document.getElementById('resultTagline').textContent = arch.tagline;

  // AHA moment
  document.getElementById('resultAha').textContent = arch.aha;

  // Share card
  document.getElementById('shareCardIcon').textContent = arch.icon;
  document.getElementById('shareCardName').textContent = arch.name;
  document.getElementById('shareCardTagline').textContent = arch.tagline;

  // AI personalized content
  document.getElementById('resultHeadline').textContent = escHtml(rapport.headline);
  document.getElementById('resultDescription').textContent = escHtml(rapport.description);

  // Quick wins
  const qwEl = document.getElementById('resultQuickWins');
  qwEl.innerHTML = '';
  arch.quickWins.forEach((win, i) => {
    const div = document.createElement('div');
    div.className = 'result-action-item';
    div.innerHTML = `
      <div class="result-action-num">0${i + 1}</div>
      <div class="result-action-body">
        <h4>${win.action}</h4>
        <p>${win.detail}</p>
        <span class="result-tool-badge">${win.tool}</span>
      </div>
    `;
    qwEl.appendChild(div);
  });

  // Short term
  const stEl = document.getElementById('resultShortTerm');
  stEl.innerHTML = '';
  arch.shortTerm.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    stEl.appendChild(li);
  });

  // Medium term
  const mtEl = document.getElementById('resultMediumTerm');
  mtEl.innerHTML = '';
  arch.mediumTerm.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    mtEl.appendChild(li);
  });

  // Tools
  const toolsEl = document.getElementById('resultTools');
  toolsEl.innerHTML = '';
  arch.tools.forEach(tool => {
    const a = document.createElement('a');
    a.className = 'result-tool-link';
    a.href = tool.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <span class="result-tool-link-name">${tool.name}</span>
      <span class="result-tool-link-note">${tool.note}</span>
    `;
    toolsEl.appendChild(a);
  });

  // Culture note
  document.getElementById('resultCultureNote').textContent = arch.cultureNote;

  // CTA
  document.getElementById('resultCta').textContent = escHtml(rapport.cta);

  // WhatsApp share
  const shareMsg = `I just discovered I'm ${arch.name} ${arch.icon}\n\nFind out your AI Superpower, free quiz by FUNkiness!:\nfunkiness.ai/quiz`;
  document.getElementById('whatsappShareBtn').href = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;
}

function showScreenshotTip() {
  alert('Screenshot the card above and share it on your stories! Tag us when you do.');
}
