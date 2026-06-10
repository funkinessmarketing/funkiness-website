const TOTAL_STEPS = 5;
let currentStep = 0;
const answers = {};
const fieldSelections = {};
let scanType = null;

const STEP_HEADERS = {
  social: {
    2: { eyebrow: 'Step 1: Your Channels',  h2: 'Where are you<br><span class="scan-pink">showing up?</span>' },
    3: { eyebrow: 'Step 2: Instagram',       h2: 'Let\'s look at<br><span class="scan-pink">your Instagram.</span>' },
    4: { eyebrow: 'Step 3: Engagement',      h2: 'Are people actually<br><span class="scan-pink">interacting?</span>' },
    5: { eyebrow: 'Step 4: Content',         h2: 'What does your<br><span class="scan-pink">content look like?</span>' },
  },
  marketing: {
    2: { eyebrow: 'Step 1: Brand & Positioning',  h2: 'What makes you<br><span class="scan-pink">different?</span>' },
    3: { eyebrow: 'Step 2: Audience & Market',    h2: 'Who are you<br><span class="scan-pink">talking to?</span>' },
    4: { eyebrow: 'Step 3: Channels & Reach',     h2: 'How do people<br><span class="scan-pink">find you?</span>' },
    5: { eyebrow: 'Step 4: Strategy & Execution', h2: 'Do you have<br><span class="scan-pink">a real plan?</span>' },
  }
};

function showStep(n) {
  document.querySelectorAll('.scan-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.scan-step[data-step="${n}"]`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  updateProgress(n);

  const progressWrap = document.getElementById('scanProgressWrap');
  if (progressWrap) {
    progressWrap.style.display = (n === 0 || n >= 6) ? 'none' : 'flex';
  }

  if (n === 1 && scanType) {
    const eyebrow = document.getElementById('step1Eyebrow');
    if (eyebrow) eyebrow.textContent = scanType === 'social' ? 'Social Media Scan' : 'Marketing Strategy Scan';
  }

  if (n >= 2 && n <= 5 && scanType && target) {
    const headers = STEP_HEADERS[scanType][n];

    if (headers) {
      const eyebrow = target.querySelector('.scan-eyebrow');
      const h2 = target.querySelector('.scan-h2');
      if (eyebrow) eyebrow.textContent = headers.eyebrow;
      if (h2) h2.innerHTML = headers.h2;
    }
    target.querySelectorAll('.scan-qs').forEach(qs => {
      qs.style.display = qs.dataset.scanType === scanType ? 'block' : 'none';
    });
  }
}

function updateProgress(step) {
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (!fill || !label) return;
  // steps 1-5 visible (1=contact, 2-5=questions), 5 total
  const visibleStep = step; // step 1 = info, 2-5 = questions
  const pct = visibleStep >= 5 ? 100 : Math.round((visibleStep / 5) * 100);
  fill.style.width = pct + '%';
  if (visibleStep === 1) label.textContent = 'Your details';
  else if (visibleStep >= 2 && visibleStep <= 5) label.textContent = `Question ${visibleStep - 1} of 4`;
  else label.textContent = 'Done!';
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  currentStep++;
  showStep(currentStep);
}

function validateStep(step) {
  if (step === 0) {
    if (!scanType) {
      document.querySelectorAll('.scan-type-card').forEach(c => {
        c.classList.add('pulse');
        setTimeout(() => c.classList.remove('pulse'), 600);
      });
      return false;
    }
    return true;
  }

  if (step === 1) {
    const fields = ['bedrijf', 'naam', 'functie', 'email'];
    for (const id of fields) {
      const val = document.getElementById(id).value.trim();
      const ok = id === 'email' ? val.includes('@') : val.length > 0;
      if (!ok) { shake(id); return false; }
    }
    const cw = document.getElementById('telefoon').value.trim();
    const nl = document.getElementById('telefoon_nl').value.trim();
    if (!cw && !nl) { shake('telefoon'); return false; }
    if (!fieldSelections['sector']) {
      alert('Please select your sector.');
      return false;
    }
    return true;
  }

  const stepEl = document.querySelector(`.scan-step[data-step="${step}"]`);
  const activeQs = stepEl.querySelector(`.scan-qs[data-scan-type="${scanType}"]`);
  const questions = activeQs ? activeQs.querySelectorAll('.scan-question') : [];
  for (const q of questions) {
    if (!answers[q.dataset.key]) {
      const btn = q.querySelector('.scan-option-btn');
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
  if (!el) return;
  el.style.borderColor = '#f21b7a';
  el.classList.add('scan-shake');
  el.focus();
  setTimeout(() => el.classList.remove('scan-shake'), 500);
}

document.addEventListener('click', (e) => {
  const typeCard = e.target.closest('.scan-type-card');
  if (typeCard) {
    document.querySelectorAll('.scan-type-card').forEach(c => c.classList.remove('selected'));
    typeCard.classList.add('selected');
    scanType = typeCard.dataset.scanType;
    for (const key in answers) delete answers[key];
    return;
  }

  const btn = e.target.closest('.scan-option-btn');
  if (!btn) return;
  const group = btn.closest('[data-field]');
  const question = btn.closest('.scan-question');
  if (group) {
    group.querySelectorAll('.scan-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    fieldSelections[group.dataset.field] = btn.dataset.value;
  } else if (question) {
    question.querySelectorAll('.scan-option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    answers[question.dataset.key] = {
      value: btn.dataset.value,
      category: question.dataset.category,
      scores: JSON.parse(question.dataset.scores)
    };
  }
});

function calcScores() {
  const catKeys = scanType === 'social'
    ? ['platforms', 'instagram', 'engagement', 'content']
    : ['brand', 'audience', 'channels', 'strategy'];

  const cats = {};
  catKeys.forEach(k => cats[k] = []);

  for (const [, data] of Object.entries(answers)) {
    const score = data.scores[data.value] ?? 50;
    if (cats[data.category] !== undefined) cats[data.category].push(score);
  }
  const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
  const result = {};
  catKeys.forEach(k => result[k] = avg(cats[k]));
  return result;
}

async function submitScan() {
  if (!validateStep(5)) return;

  const bedrijf     = document.getElementById('bedrijf').value.trim();
  const naam        = document.getElementById('naam').value.trim();
  const functie     = document.getElementById('functie').value.trim();
  const email       = document.getElementById('email').value.trim();
  const cw_input    = document.getElementById('telefoon').value.trim();
  const nl_input    = document.getElementById('telefoon_nl').value.trim();
  const telefoon    = cw_input ? `+599 ${cw_input}` : '';
  const telefoon_nl = nl_input ? `+31 ${nl_input}` : '';
  const instagram   = document.getElementById('instagram')?.value.trim() || '';
  const bio         = document.getElementById('bio')?.value.trim() || '';
  const sector      = fieldSelections['sector'];
  const scores      = calcScores();
  const honeypot    = document.getElementById('honeypot')?.value || '';

  document.getElementById('loadingName').textContent = bedrijf;
  currentStep = 6;
  showStep(6);

  const antwoorden = {};
  for (const [key, data] of Object.entries(answers)) {
    antwoorden[key] = data.value;
  }

  const apiEndpoint = scanType === 'social' ? '/api/scan' : '/api/marketing-scan';

  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bedrijf, sector, email, telefoon, telefoon_nl, naam, functie, instagram, bio, antwoorden, scores, honeypot })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    renderReport(data.rapport, data.bedrijf, data.naam, data.functie, email);
    currentStep = 7;
    showStep(7);
  } catch {
    alert('Something went wrong. Please try again.');
    currentStep = 5;
    showStep(5);
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderReport(rapport, bedrijf, naam, functie, email) {
  const isSocial = scanType === 'social';

  document.getElementById('reportEyebrow').textContent = isSocial
    ? 'Your Social Media Scan'
    : 'Your Marketing Strategy Scan';

  document.getElementById('reportTitle').innerHTML = isSocial
    ? `${escHtml(bedrijf)}'s socials.<br><span class="scan-pink">Exposed.</span>`
    : `${escHtml(bedrijf)}'s marketing.<br><span class="scan-pink">Exposed.</span>`;

  document.getElementById('reportIntro').textContent = rapport.intro;
  document.getElementById('totalScore').textContent = rapport.totaalscore;
  document.getElementById('whatsWorking').textContent = rapport.whats_working;
  document.getElementById('topQuickwin').textContent = rapport.top_quickwin;
  document.getElementById('quickwinText').textContent = rapport.do_today;
  document.getElementById('ctaHook').textContent = rapport.cta_dynamic;
  document.getElementById('reportEmailNote').textContent = `We also sent a copy to ${email}.`;

  const waMsg = encodeURIComponent(
    `Hi FUNkiness! I just completed the ${isSocial ? 'Social Media' : 'Marketing Strategy'} Scan.\n\nName: ${naam}\nJob title: ${functie}\nBusiness: ${bedrijf}\nScore: ${rapport.totaalscore}/100\n\nI'd love to talk about what's possible!`
  );
  document.getElementById('btnWhatsApp').href = `https://wa.me/59996751737?text=${waMsg}`;

  document.getElementById('benchmarkWrap').innerHTML = `
    <p>How <strong>${bedrijf}</strong> compares to ${rapport.benchmark_label}:</p>
    <div class="scan-bench-bars">
      <div class="scan-bench-row">
        <span class="scan-bench-label">Average</span>
        <div class="scan-bench-track"><div class="scan-bench-fill avg" style="width:${rapport.benchmark_avg}%"></div></div>
        <span class="scan-bench-val">${rapport.benchmark_avg}</span>
      </div>
      <div class="scan-bench-row">
        <span class="scan-bench-label">Top 20%</span>
        <div class="scan-bench-track"><div class="scan-bench-fill top" style="width:${rapport.benchmark_top}%"></div></div>
        <span class="scan-bench-val">${rapport.benchmark_top}</span>
      </div>
      <div class="scan-bench-row">
        <span class="scan-bench-label" style="color:#f21b7a;font-weight:800">You</span>
        <div class="scan-bench-track"><div class="scan-bench-fill you" style="width:${rapport.totaalscore}%"></div></div>
        <span class="scan-bench-val" style="color:#f21b7a;font-weight:800">${rapport.totaalscore}</span>
      </div>
    </div>`;

  const radarLabels = isSocial
    ? ['Platforms', 'Instagram', 'Engagement', 'Content']
    : ['Brand', 'Audience', 'Channels', 'Strategy'];

  const radarData = isSocial
    ? [rapport.platforms.score, rapport.instagram.score, rapport.engagement.score, rapport.content.score]
    : [rapport.brand.score, rapport.audience.score, rapport.channels.score, rapport.strategy.score];

  const existingChart = Chart.getChart('radarChart');
  if (existingChart) existingChart.destroy();

  const ctx = document.getElementById('radarChart').getContext('2d');
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: radarLabels,
      datasets: [{
        data: radarData,
        backgroundColor: 'rgba(242, 27, 122, 0.12)',
        borderColor: '#f21b7a',
        borderWidth: 2.5,
        pointBackgroundColor: '#f21b7a',
        pointRadius: 5
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true, max: 100,
          ticks: { display: false },
          grid: { color: 'rgba(0,0,0,0.08)' },
          pointLabels: { font: { family: 'Poppins', size: 13, weight: '700' }, color: '#080403' }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  const categories = isSocial
    ? [
        { label: 'Platforms & Reach', data: rapport.platforms },
        { label: 'Instagram',         data: rapport.instagram },
        { label: 'Engagement',        data: rapport.engagement },
        { label: 'Content',           data: rapport.content }
      ]
    : [
        { label: 'Brand & Positioning',  data: rapport.brand },
        { label: 'Audience & Market',    data: rapport.audience },
        { label: 'Channels & Reach',     data: rapport.channels },
        { label: 'Strategy & Execution', data: rapport.strategy }
      ];

  document.getElementById('categoryCards').innerHTML = categories.map(({ label, data }) => {
    const s = data.score;
    const pill = s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low';
    return `<div class="scan-cat-card">
      <div class="scan-cat-header">
        <span class="scan-cat-name">${label}</span>
        <span class="scan-cat-pill ${pill}">${s}/100</span>
      </div>
      <div class="scan-cat-bar"><div class="scan-cat-bar-fill" style="width:${s}%"></div></div>
      <p class="scan-cat-feedback">${data.feedback}</p>
    </div>`;
  }).join('');

  const bioWrap = document.getElementById('bioWrap');
  if (bioWrap) {
    if (isSocial && rapport.bio_feedback) {
      bioWrap.style.display = 'block';
      document.getElementById('bioFeedback').textContent = rapport.bio_feedback;
    } else {
      bioWrap.style.display = 'none';
    }
  }

  document.getElementById('teaserWins').textContent = rapport.teaser_wins;

  document.getElementById('fomoWrap').innerHTML = `
    <h3>What the fast movers are doing</h3>
    <p>${rapport.fomo}</p>`;
}

function downloadReport() {
  const reportEl = document.getElementById('reportStep');
  const content = reportEl.innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8"/>
  <title>FUNkiness! Scan Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Poppins:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Poppins',sans-serif;background:#f7efe7;color:#080403;padding:32px 24px}
    h2{font-family:'Permanent Marker',cursive;font-size:2rem;font-weight:400;line-height:1.15;margin-bottom:16px}
    h3{font-size:1rem;font-weight:700;margin-bottom:10px}
    .scan-pink{color:#f21b7a}
    .scan-step-inner{max-width:600px;margin:0 auto}
    .scan-intro-text{font-size:1rem;line-height:1.7;color:#444;margin-bottom:32px;padding:18px;background:white;border-radius:14px;border-left:4px solid #f21b7a}
    .scan-radar-wrap{background:white;border-radius:14px;padding:20px;margin-bottom:20px;max-width:380px;margin-left:auto;margin-right:auto}
    .scan-score-badge-wrap{display:flex;justify-content:center;margin-bottom:28px}
    .scan-score-badge{display:flex;flex-direction:column;align-items:center;background:#f21b7a;color:white;border-radius:50%;width:100px;height:100px;justify-content:center}
    .scan-score-num{font-size:2.2rem;font-weight:900;line-height:1}
    .scan-score-label{font-size:0.6rem;font-weight:700;text-transform:uppercase;opacity:.9}
    .scan-bench-wrap{background:white;border-radius:14px;padding:20px 24px;margin-bottom:24px}
    .scan-bench-bars{display:flex;flex-direction:column;gap:8px}
    .scan-bench-row{display:flex;align-items:center;gap:10px;font-size:.82rem}
    .scan-bench-label{width:110px;text-align:right;color:#888;font-weight:600;flex-shrink:0}
    .scan-bench-track{flex:1;height:8px;background:rgba(0,0,0,.07);border-radius:99px;overflow:hidden}
    .scan-bench-fill{height:100%;border-radius:99px}
    .scan-bench-fill.avg{background:rgba(0,0,0,.2)}
    .scan-bench-fill.top{background:rgba(242,27,122,.3)}
    .scan-bench-fill.you{background:#f21b7a;print-color-adjust:exact;-webkit-print-color-adjust:exact}
    .scan-bench-val{width:36px;font-weight:700;font-size:.82rem}
    .scan-working-wrap{background:#080403;color:white;border-radius:14px;padding:20px 24px;margin-bottom:24px}
    .scan-working-label{font-size:.75rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#f21b7a;margin-bottom:8px}
    .scan-category-cards{display:flex;flex-direction:column;gap:14px;margin-bottom:28px}
    .scan-cat-card{background:white;border-radius:14px;padding:18px 20px}
    .scan-cat-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
    .scan-cat-name{font-weight:800;font-size:.85rem;text-transform:uppercase;letter-spacing:.5px}
    .scan-cat-pill{padding:3px 10px;border-radius:99px;font-weight:800;font-size:.85rem}
    .scan-cat-pill.high{background:#d4f0d4;color:#1a6b1a}
    .scan-cat-pill.mid{background:#fff3cd;color:#856404}
    .scan-cat-pill.low{background:#fde8f0;color:#f21b7a}
    .scan-cat-bar{height:5px;background:rgba(0,0,0,.08);border-radius:99px;overflow:hidden;margin-bottom:10px}
    .scan-cat-bar-fill{height:100%;background:#f21b7a;border-radius:99px;print-color-adjust:exact;-webkit-print-color-adjust:exact}
    .scan-cat-feedback{font-size:.88rem;color:#555;line-height:1.6}
    .scan-bio-wrap{background:white;border-radius:14px;padding:18px 20px;margin-bottom:20px;border-left:4px solid #080403}
    .scan-kansen-wrap{background:white;border-radius:14px;padding:20px;margin-bottom:20px}
    .scan-quickwin-wrap{background:#f21b7a;color:white;border-radius:14px;padding:20px;margin-bottom:28px;print-color-adjust:exact;-webkit-print-color-adjust:exact}
    .scan-quickwin-wrap h3{color:white;opacity:.85}
    .scan-quickwin-wrap p{font-size:.95rem;line-height:1.6;font-weight:600}
    .scan-fomo-wrap{background:white;border-radius:14px;padding:20px 24px;margin-bottom:24px;border-top:3px solid #f21b7a}
    .scan-fomo-wrap h3{color:#f21b7a;margin-bottom:8px}
    .scan-download-wrap,.scan-cta-wrap,.scan-email-note{display:none}
  </style>
</head><body>
  <div class="scan-step-inner">${content}</div>
  <script>window.onload=function(){setTimeout(function(){window.print()},800)}<\/script>
</body></html>`);
  printWindow.document.close();
}

showStep(0);
