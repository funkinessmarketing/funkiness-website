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
    text: "Your business in 2 years — what does success look like?",
    answers: [
      { text: "A business that runs itself without me being everywhere", archetype: "T" },
      { text: "A brand with a real following people recognize", archetype: "C" },
      { text: "Noticeably bigger — more revenue, more reach", archetype: "G" },
      { text: "Customers who wouldn't dream of going anywhere else", archetype: "E" }
    ]
  },
  {
    text: "What keeps you up at night — in the best way?",
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
      { text: "Operations — keeping everything running", archetype: "T" },
      { text: "Marketing and staying visible", archetype: "C" },
      { text: "Sales and finding new customers", archetype: "G" },
      { text: "Customer service and relationships", archetype: "E" }
    ]
  },
  {
    text: "Someone says 'AI can genuinely help your business.' You think...",
    answers: [
      { text: "Yes — I just need it to take things off my plate", archetype: "T" },
      { text: "Yes — I want it to help me create more content", archetype: "C" },
      { text: "Yes — I want it to help me grow and compete", archetype: "G" },
      { text: "Yes — if it makes my customers happier", archetype: "E" }
    ]
  }
];

const ARCHETYPES = {
  T: {
    name: "The Time Liberator",
    tagline: "AI gives you back the one thing money can't buy.",
    icon: "⚡"
  },
  C: {
    name: "The Content Machine",
    tagline: "Your voice is your brand. AI makes sure it never goes quiet.",
    icon: "📡"
  },
  G: {
    name: "The Growth Catalyst",
    tagline: "The next level isn't luck. It's leverage.",
    icon: "🚀"
  },
  E: {
    name: "The Experience Architect",
    tagline: "Great experiences don't happen by accident.",
    icon: "✨"
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

  // Share card
  document.getElementById('shareCardIcon').textContent = arch.icon;
  document.getElementById('shareCardName').textContent = arch.name;
  document.getElementById('shareCardTagline').textContent = arch.tagline;

  // AI content
  document.getElementById('resultHeadline').textContent = escHtml(rapport.headline);
  document.getElementById('resultDescription').textContent = escHtml(rapport.description);
  document.getElementById('resultSuperpower').textContent = escHtml(rapport.ai_superpower);
  document.getElementById('resultTeaser').textContent = escHtml(rapport.teaser);
  document.getElementById('resultCta').textContent = escHtml(rapport.cta);

  // WhatsApp share
  const shareMsg = `I just discovered I'm ${arch.name} ${arch.icon}\n\nFind out your AI Superpower — free quiz by FUNkiness!:\nfunkiness.ai/quiz`;
  document.getElementById('whatsappShareBtn').href = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`;
}

function showScreenshotTip() {
  alert('Screenshot the card above and share it on your stories! Tag us when you do 🔥');
}
