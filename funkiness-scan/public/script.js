const TOTAL_STEPS = 5; // 0-4 zijn form steps, 5=loading, 6=rapport
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
  label.textContent = step < TOTAL_STEPS ? `Step ${step + 1} of ${TOTAL_STEPS}` : 'Done!';
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  currentStep++;
  showStep(currentStep);
}

// ---- VALIDATIE ----
function validateStep(step) {
  if (step === 0) {
    const fields = ['bedrijf', 'naam', 'functie', 'email'];
    for (const id of fields) {
      const val = document.getElementById(id).value.trim();
      const ok = id === 'email' ? val.includes('@') : val.length > 0;
      if (!ok) { shake(id); return false; }
    }
    const cw = document.getElementById('telefoon').value.trim();
    const nl = document.getElementById('telefoon_nl').value.trim();
    if (!cw && !nl) {
      shake('telefoon');
      return false;
    }
    if (!fieldSelections['sector']) {
      alert('Please select your sector.');
      return false;
    }
    return true;
  }

  // Stappen 1-4: alle vragen beantwoord
  const stepEl = document.querySelector(`.step[data-step="${step}"]`);
  const questions = stepEl.querySelectorAll('.question');
  for (const q of questions) {
    if (!answers[q.dataset.key]) {
      const btn = q.querySelector('.option-btn');
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.classList.add('pulse');
      setTimeout(() => btn.classList.remove('pulse'), 600);
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

// ---- OPTION KLIKKEN ----
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;
  const group = btn.closest('[data-field]');
  const question = btn.closest('.question');
  if (group) {
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    fieldSelections[group.dataset.field] = btn.dataset.value;
  } else if (question) {
    question.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    answers[question.dataset.key] = {
      value: btn.dataset.value,
      category: question.dataset.category,
      scores: JSON.parse(question.dataset.scores)
    };
  }
});

// ---- SCORES BEREKENEN ----
function calcScores() {
  const cats = { platforms: [], instagram: [], engagement: [], content: [] };
  for (const [, data] of Object.entries(answers)) {
    const score = data.scores[data.value] ?? 50;
    if (cats[data.category]) cats[data.category].push(score);
  }
  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  return {
    platforms:  avg(cats.platforms),
    instagram:  avg(cats.instagram),
    engagement: avg(cats.engagement),
    content:    avg(cats.content)
  };
}

// ---- SUBMIT ----
async function submitScan() {
  if (!validateStep(4)) return;

  const bedrijf  = document.getElementById('bedrijf').value.trim();
  const naam     = document.getElementById('naam').value.trim();
  const functie  = document.getElementById('functie').value.trim();
  const email    = document.getElementById('email').value.trim();
  const cw_input    = document.getElementById('telefoon').value.trim();
  const nl_input    = document.getElementById('telefoon_nl').value.trim();
  const telefoon    = cw_input ? `+599 ${cw_input}` : '';
  const telefoon_nl = nl_input ? `+31 ${nl_input}` : '';
  const instagram = document.getElementById('instagram').value.trim();
  const bio      = document.getElementById('bio').value.trim();
  const sector   = fieldSelections['sector'];
  const scores   = calcScores();

  document.getElementById('loadingName').textContent = bedrijf;
  currentStep = 5;
  showStep(5);

  const antwoorden = {};
  for (const [key, data] of Object.entries(answers)) {
    antwoorden[key] = data.value;
  }

  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, antwoorden, scores })
    });
    const data = await res.json();
    if (!data.success) {
      if (data.error === 'too_many_ip') {
        alert("You've reached the daily scan limit. Try again tomorrow.");
        currentStep = 4; showStep(4); return;
      }
      if (data.error === 'too_many_email') {
        alert('This email already has a scan this week. Check your inbox for your existing report.');
        currentStep = 4; showStep(4); return;
      }
      throw new Error(data.error);
    }
    document.getElementById('checkEmailAddress').textContent = email;
    currentStep = 6;
    showStep(6);
  } catch {
    alert('Something went wrong. Please try again.');
    currentStep = 4;
    showStep(4);
  }
}

// ---- RAPPORT RENDEREN ----
function renderReport(rapport, bedrijf, naam, functie) {
  document.getElementById('reportTitle').innerHTML =
    `${bedrijf}'s socials.<br><span class="pink">Exposed.</span>`;
  document.getElementById('reportIntro').textContent = rapport.intro;
  document.getElementById('totalScore').textContent = rapport.totaalscore;
  document.getElementById('whatsWorking').textContent = rapport.whats_working;
  document.getElementById('topQuickwin').textContent = rapport.top_quickwin;
  document.getElementById('quickwinText').textContent = rapport.do_today;
  document.getElementById('ctaHook').textContent = rapport.cta_dynamic;

  // WhatsApp link met vooringevuld bericht
  const waMsg = encodeURIComponent(
    `Hi FUNkiness! I just completed the Social Media Scan.\n\n` +
    `Name: ${naam}\n` +
    `Job title: ${functie}\n` +
    `Business: ${bedrijf}\n` +
    `Score: ${rapport.totaalscore}/100\n\n` +
    `I would love to talk about what's possible!`
  );
  document.getElementById('btnWhatsApp').href = `https://wa.me/59996751737?text=${waMsg}`;

  // Benchmark
  document.getElementById('benchmarkWrap').innerHTML = `
    <p>How <strong>${bedrijf}</strong> compares to ${rapport.benchmark_label}:</p>
    <div class="benchmark-bars">
      <div class="bench-row">
        <span class="bench-label">Average</span>
        <div class="bench-track"><div class="bench-fill avg" style="width:${rapport.benchmark_avg}%"></div></div>
        <span class="bench-val">${rapport.benchmark_avg}</span>
      </div>
      <div class="bench-row">
        <span class="bench-label">Top 20%</span>
        <div class="bench-track"><div class="bench-fill top" style="width:${rapport.benchmark_top}%"></div></div>
        <span class="bench-val">${rapport.benchmark_top}</span>
      </div>
      <div class="bench-row">
        <span class="bench-label" style="color:#E8186D;font-weight:800">You</span>
        <div class="bench-track"><div class="bench-fill you" style="width:${rapport.totaalscore}%"></div></div>
        <span class="bench-val" style="color:#E8186D;font-weight:800">${rapport.totaalscore}</span>
      </div>
    </div>`;

  // Radar chart
  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Platforms', 'Instagram', 'Engagement', 'Content'],
      datasets: [{
        data: [rapport.platforms.score, rapport.instagram.score, rapport.engagement.score, rapport.content.score],
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
          beginAtZero: true, max: 100,
          ticks: { display: false },
          grid: { color: 'rgba(0,0,0,0.08)' },
          pointLabels: { font: { family: 'Poppins', size: 13, weight: '700' }, color: '#1A1A1A' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Categorie cards
  const categories = [
    { label: 'Platforms & Reach', data: rapport.platforms },
    { label: 'Instagram',         data: rapport.instagram },
    { label: 'Engagement',        data: rapport.engagement },
    { label: 'Content',           data: rapport.content }
  ];
  document.getElementById('categoryCards').innerHTML = categories.map(({ label, data }) => {
    const s = data.score;
    const pill = s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low';
    return `<div class="cat-card">
      <div class="cat-header">
        <span class="cat-name">${label}</span>
        <span class="cat-score-pill ${pill}">${s}/100</span>
      </div>
      <div class="cat-bar"><div class="cat-bar-fill" style="width:${s}%"></div></div>
      <p class="cat-feedback">${data.feedback}</p>
    </div>`;
  }).join('');

  // Bio feedback
  if (rapport.bio_feedback) {
    document.getElementById('bioWrap').style.display = 'block';
    document.getElementById('bioFeedback').textContent = rapport.bio_feedback;
  }

  // Teaser wins
  document.getElementById('teaserWins').textContent = rapport.teaser_wins;

  // FOMO
  document.getElementById('fomoWrap').innerHTML = `
    <h3>What the fast movers are doing</h3>
    <p>${rapport.fomo}</p>`;
}

// ---- DOWNLOAD ----
function downloadReport() {
  const reportEl = document.getElementById('reportStep');
  const content = reportEl.innerHTML;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>FUNkiness! Social Media Scan Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --pink: #E8186D; --beige: #F5EDE4; --dark: #1A1A1A; --radius: 14px; }
    body { font-family: 'Poppins', sans-serif; background: #F5EDE4; color: #1A1A1A; padding: 32px 24px; }
    h2 { font-family: 'Permanent Marker', cursive; font-size: 2rem; font-weight: 400; line-height: 1.15; margin-bottom: 16px; }
    h3 { font-size: 1rem; font-weight: 700; margin-bottom: 10px; }
    .pink { color: #E8186D; }
    .eyebrow { color: #E8186D; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
    .step-inner { max-width: 600px; margin: 0 auto; }
    .intro-text { font-size: 1rem; line-height: 1.7; color: #444; margin-bottom: 32px; padding: 18px; background: white; border-radius: 14px; border-left: 4px solid #E8186D; }
    .radar-wrap { background: white; border-radius: 14px; padding: 20px; margin-bottom: 20px; max-width: 380px; margin-left: auto; margin-right: auto; }
    .score-badge-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
    .score-badge { display: flex; flex-direction: column; align-items: center; background: #E8186D; color: white; border-radius: 50%; width: 100px; height: 100px; justify-content: center; }
    .score-num { font-size: 2.2rem; font-weight: 900; line-height: 1; }
    .score-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; opacity: 0.9; }
    .category-cards { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
    .cat-card { background: white; border-radius: 14px; padding: 18px 20px; }
    .cat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .cat-name { font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .cat-score-pill { padding: 3px 10px; border-radius: 99px; font-weight: 800; font-size: 0.85rem; }
    .cat-score-pill.high { background: #d4f0d4; color: #1a6b1a; }
    .cat-score-pill.mid { background: #fff3cd; color: #856404; }
    .cat-score-pill.low { background: #fde8f0; color: #E8186D; }
    .cat-bar { height: 5px; background: rgba(0,0,0,0.08); border-radius: 99px; overflow: hidden; margin-bottom: 10px; }
    .cat-bar-fill { height: 100%; background: #E8186D; border-radius: 99px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .cat-feedback { font-size: 0.88rem; color: #555; line-height: 1.6; }
    .bio-wrap { background: white; border-radius: 14px; padding: 18px 20px; margin-bottom: 20px; border-left: 4px solid #1A1A1A; }
    .kansen-wrap { background: white; border-radius: 14px; padding: 20px; margin-bottom: 20px; }
    .kansen-wrap ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .kansen-wrap li { padding-left: 24px; position: relative; font-size: 0.9rem; line-height: 1.5; color: #444; }
    .kansen-wrap li::before { content: '->'; position: absolute; left: 0; color: #E8186D; font-weight: 700; }
    .quickwin-wrap { background: #E8186D; color: white; border-radius: 14px; padding: 20px; margin-bottom: 28px; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .quickwin-wrap h3 { color: white; opacity: 0.85; }
    .quickwin-wrap p { font-size: 0.95rem; line-height: 1.6; font-weight: 600; }
    .cta-wrap { text-align: center; padding: 28px 0; border-top: 1px solid rgba(0,0,0,0.08); }
    .cta-hook { font-size: 1.05rem; font-weight: 800; margin-bottom: 6px; }
    .cta-sub { font-size: 0.9rem; color: #555; margin-bottom: 14px; }
    .btn-cta { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #E8186D; color: white; text-decoration: none; border-radius: 99px; font-size: 0.95rem; font-weight: 700; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .download-wrap { display: none; }
    @media print {
      body { padding: 16px; }
      .btn-cta { display: none; }
    }
  </style>
</head>
<body>
  <div class="step-inner">${content}</div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 800);
    };
  <\/script>
</body>
</html>`);
  printWindow.document.close();
}

// Init: check if this is a token-based report URL (/r/UUID)
(function init() {
  const tokenMatch = window.location.pathname.match(/^\/r\/([0-9a-f-]{36})$/i);
  if (!tokenMatch) { showStep(0); return; }

  const token = tokenMatch[1];
  document.getElementById('loadingName').textContent = 'your report';
  currentStep = 5;
  showStep(5);

  fetch(`/api/report/${token}`)
    .then(r => r.json())
    .then(data => {
      if (!data.success) throw new Error(data.error);
      renderReport(data.rapport, data.bedrijf, data.naam, data.functie);
      currentStep = 7;
      showStep(7);
    })
    .catch(() => {
      document.getElementById('loadingStep').innerHTML = `
        <div class="step-inner center">
          <h2>Link expired<br><span class="pink">or not found.</span></h2>
          <p class="sub">Report links are valid for 7 days. Start a new scan to get a fresh report.</p>
          <button class="btn-next" onclick="location.href='/'">Start new scan <span>→</span></button>
        </div>`;
    });
})();
