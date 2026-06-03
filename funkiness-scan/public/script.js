const TOTAL_STEPS = 6; // 0-5 are form steps, 6=loading, 7=report
let currentStep = 0;
const answers = {};
const fieldSelections = {};

// ---- NAVIGATION ----
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateProgress(n);
}

function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const pct = step >= TOTAL_STEPS ? 100 : Math.round((step / TOTAL_STEPS) * 100);
  fill.style.width = pct + '%';
  if (step < TOTAL_STEPS) {
    label.textContent = `Step ${step + 1} of ${TOTAL_STEPS}`;
  } else {
    label.textContent = 'Done!';
  }
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  currentStep++;
  showStep(currentStep);
}

// ---- VALIDATION ----
function validateStep(step) {
  if (step === 0) {
    const bedrijf = document.getElementById('bedrijf').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!bedrijf) { shake('bedrijf'); return false; }
    if (!email || !email.includes('@')) { shake('email'); return false; }
    if (!fieldSelections['sector']) { alert('Please select your sector.'); return false; }
    return true;
  }
  // For steps 1-5: all questions must be answered
  const stepEl = document.querySelector(`.step[data-step="${step}"]`);
  const questions = stepEl.querySelectorAll('.question');
  for (const q of questions) {
    const key = q.dataset.key;
    if (!answers[key]) {
      const firstBtn = q.querySelector('.option-btn');
      firstBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstBtn.classList.add('pulse');
      setTimeout(() => firstBtn.classList.remove('pulse'), 600);
      return false;
    }
  }
  return true;
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#E8186D';
  el.classList.add('shake');
  el.focus();
  setTimeout(() => el.classList.remove('shake'), 500);
}

// ---- OPTION SELECTION ----
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;

  const group = btn.closest('[data-field]');
  const question = btn.closest('.question');

  if (group) {
    // Basic info sector selector
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    fieldSelections[group.dataset.field] = btn.dataset.value;
  } else if (question) {
    // Question answer
    question.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    answers[question.dataset.key] = {
      value: btn.dataset.value,
      category: question.dataset.category,
      scores: JSON.parse(question.dataset.scores)
    };
  }
});

// ---- SCORE CALCULATION ----
function calcScores() {
  const cats = { socials: [], content: [], branding: [], strategie: [], ai: [] };

  for (const [key, data] of Object.entries(answers)) {
    const score = data.scores[data.value] ?? 50;
    if (cats[data.category]) cats[data.category].push(score);
  }

  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  return {
    socials:   avg(cats.socials),
    content:   avg(cats.content),
    branding:  avg(cats.branding),
    strategie: avg(cats.strategie),
    ai:        avg(cats.ai)
  };
}

// ---- SUBMIT ----
async function submitScan() {
  if (!validateStep(5)) return;

  const bedrijf  = document.getElementById('bedrijf').value.trim();
  const email    = document.getElementById('email').value.trim();
  const instagram = document.getElementById('instagram').value.trim();
  const sector   = fieldSelections['sector'];
  const scores   = calcScores();

  document.getElementById('loadingName').textContent = bedrijf;
  currentStep = 6;
  showStep(6);

  // Flatten answers for the API
  const antwoorden = {};
  for (const [key, data] of Object.entries(answers)) {
    antwoorden[key] = data.value;
  }

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bedrijf, sector, email, instagram, antwoorden, scores })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    renderReport(data.rapport, bedrijf, scores);
    currentStep = 7;
    showStep(7);
  } catch (err) {
    alert('Something went wrong generating your report. Please try again.');
    currentStep = 5;
    showStep(5);
  }
}

// ---- RENDER REPORT ----
function renderReport(rapport, bedrijf, scores) {
  document.getElementById('reportTitle').innerHTML =
    `${bedrijf}'s marketing.<br><span class="pink">Exposed.</span>`;

  document.getElementById('reportIntro').textContent = rapport.intro;
  document.getElementById('totalScore').textContent = rapport.totaalscore;

  // Radar chart
  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Socials', 'Content', 'Branding', 'Strategy', 'AI'],
      datasets: [{
        data: [
          rapport.socials.score,
          rapport.content.score,
          rapport.branding.score,
          rapport.strategie.score,
          rapport.ai.score
        ],
        backgroundColor: 'rgba(232, 24, 109, 0.15)',
        borderColor: '#E8186D',
        borderWidth: 2.5,
        pointBackgroundColor: '#E8186D',
        pointRadius: 5
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { display: false },
          grid: { color: 'rgba(0,0,0,0.08)' },
          pointLabels: {
            font: { family: 'Outfit', size: 13, weight: '700' },
            color: '#1A1A1A'
          }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Category cards
  const categories = [
    { key: 'socials',   label: 'Socials',   data: rapport.socials },
    { key: 'content',   label: 'Content',   data: rapport.content },
    { key: 'branding',  label: 'Branding',  data: rapport.branding },
    { key: 'strategie', label: 'Strategy',  data: rapport.strategie },
    { key: 'ai',        label: 'AI',        data: rapport.ai }
  ];

  const container = document.getElementById('categoryCards');
  container.innerHTML = categories.map(({ label, data }) => {
    const s = data.score;
    const pillClass = s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low';
    return `
      <div class="cat-card">
        <div class="cat-header">
          <span class="cat-name">${label}</span>
          <span class="cat-score-pill ${pillClass}">${s}/100</span>
        </div>
        <div class="cat-bar"><div class="cat-bar-fill" style="width:${s}%"></div></div>
        <p class="cat-feedback">${data.feedback}</p>
      </div>`;
  }).join('');

  // Opportunities
  const kansenList = document.getElementById('kansenList');
  kansenList.innerHTML = rapport.kansen.map(k => `<li>${k}</li>`).join('');

  // Quick win
  document.getElementById('quickwinText').textContent = rapport.quickwin;
}

// Init
showStep(0);
