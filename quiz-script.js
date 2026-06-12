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
        action: "Set up WhatsApp Business quick replies",
        detail: "Write down the 5 questions you get most often. Use ChatGPT to write a sharp answer for each. Set them up as quick replies in WhatsApp Business. Takes 30 minutes. Saves hours every week.",
        tool: "WhatsApp Business + ChatGPT"
      },
      {
        action: "Let AI draft your standard messages",
        detail: "Open Claude or ChatGPT. Give it your tone of voice and your most common outgoing messages. Ask it to rewrite them. Use those from now on.",
        tool: "Claude / ChatGPT"
      },
      {
        action: "Pick one task you hate and hand it to AI",
        detail: "Just one. Write the briefing, get the output, edit it once. See how much time you get back. Then pick the next one.",
        tool: "Claude / ChatGPT"
      }
    ],
    shortTerm: [
      "Map your full week: write down every repetitive task you do. That list is your AI roadmap.",
      "Use AI to plan and draft your social media posts for the week in one sitting. One session, seven days of content.",
      "Set up a WhatsApp Business catalog to showcase your products or services without typing the same info over and over."
    ],
    mediumTerm: [
      "Look into ManyChat for WhatsApp automation: automated flows for FAQs, bookings, and follow-ups that run without you.",
      "Build a simple weekly content system: one briefing to AI on Monday, AI drafts the week, you edit once, you schedule. Done.",
      "Explore AI scheduling tools so planning and calendar management stops eating your time."
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
        action: "Turn a real conversation into content",
        detail: "Take a recent WhatsApp exchange with a customer, anonymized. Paste it into ChatGPT or Claude. Ask it to turn that into a social media post. Done. Real stories always perform better than made-up ones.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Generate 5 captions in one go",
        detail: "Take 5 photos of your business. Describe what's happening in each one. Ask AI to write a caption for each. Post one a day. No more blank page moments.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Let AI write 3 versions of your key message",
        detail: "Give AI your main message or offer. Get 3 different angles and hooks back. Pick the one that sounds most like you. Use it everywhere.",
        tool: "ChatGPT / Claude"
      }
    ],
    shortTerm: [
      "Create a brand voice document: paste 5 texts you've written that you like, ask AI to describe your tone. Use that as your briefing every single time.",
      "Plan one full month of content in one session: 4 themes, 3 post ideas each. 12 posts in under an hour.",
      "Try Canva AI to generate visuals that match your content without needing a designer or a full day of work."
    ],
    mediumTerm: [
      "Build a weekly content system: 30 minutes of input every Monday, AI creates the week, you edit and schedule. Runs on autopilot.",
      "Start repurposing: one video becomes 3 posts, one caption becomes a story, one idea becomes a week of content. AI does the converting.",
      "Track what performs best. Let AI help you spot the patterns and double down on what actually works for your audience."
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
        action: "Build your ideal customer profile with AI",
        detail: "Ask ChatGPT to describe your ideal customer in detail: who they are, what they want, what they worry about, how they decide. Use this as the foundation for all your marketing from here on.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Analyze your 3 strongest competitors",
        detail: "Ask AI what they are saying, what they are missing, and where the gap is in the market. That gap is your opportunity.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Write 3 versions of your core message",
        detail: "Give AI your offer. Get 3 different angles back. The one that sounds different from everyone else is the one to run with.",
        tool: "ChatGPT / Claude"
      }
    ],
    shortTerm: [
      "Run one small paid social media campaign with AI-written copy. Test 2 versions against each other. See what lands before spending more.",
      "Build a WhatsApp lead follow-up flow: first contact message, follow-up, conversion message. Ask AI to write every step in your tone.",
      "Ask AI to write your market position in one clear sentence. If it struggles, your positioning needs work before anything else."
    ],
    mediumTerm: [
      "Build a full lead generation system: ad to landing page to WhatsApp flow to follow-up. AI writes the copy for every single step.",
      "Use AI to analyze what is working across your marketing. Stop guessing, start knowing, and put your budget where it earns back.",
      "Explore AI tools for market research: what are people in your category actually searching for, asking about, and responding to?"
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
        action: "Map your full customer journey",
        detail: "Write down every touchpoint a customer has with your business, from first WhatsApp message to long after the purchase. That map is where AI goes to work first.",
        tool: "ChatGPT / Claude"
      },
      {
        action: "Set up an automatic welcome message",
        detail: "Use ChatGPT to write a warm, on-brand welcome message for new WhatsApp contacts. Set it up as an automatic reply in WhatsApp Business. Done in 20 minutes.",
        tool: "WhatsApp Business + ChatGPT"
      },
      {
        action: "Write 3 follow-up messages",
        detail: "After a purchase or visit, what do you say? Ask AI to write 3 versions in your exact tone. Send them manually for now. Automate them later once you know what works.",
        tool: "ChatGPT / Claude"
      }
    ],
    shortTerm: [
      "Build a post-experience flow: thank you message, feedback question, reason to come back. AI writes it, WhatsApp Business or email sends it.",
      "Create a FAQ document for your business. Turn it into quick replies in WhatsApp Business so every question gets a fast, consistent and on-brand answer.",
      "Ask AI to review your current customer communication and identify where the experience drops off. Fix the biggest gap first, then move to the next."
    ],
    mediumTerm: [
      "Build a full customer journey automation: first contact, nurture, purchase confirmation, follow-up, re-engagement. Via WhatsApp and email together.",
      "Use AI to analyze customer feedback and spot patterns. What do people always compliment? What do they wish was different? Let the data guide you.",
      "Personalize at scale: use names, reference previous interactions, remember preferences. AI makes this possible without any extra time on your end."
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
