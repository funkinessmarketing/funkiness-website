// Black Friday 2026, SPIN THE FUN!: rad, formulier en meting.
// De prijs komt van de server (api/spin.js + sheet-script). Dit script laat het rad alleen op die prijs stoppen.
(function () {
  // Volgorde op het rad (met de klok mee vanaf boven). Kans bepaalt de breedte van het vak.
  var VAKKEN = [
    { id: 'hooks', label: '10 Killer Hooks', kans: 18, bg: '#f21b7a', fg: '#ffffff' },
    { id: 'ai-pack', label: 'AI Power Pack', kans: 18, bg: '#3a251b', fg: '#ffffff' },
    { id: 'rescue', label: 'Content Rescue Kit', kans: 18, bg: '#f7efe7', fg: '#3a251b' },
    { id: 'ideas', label: '30 Days of Ideas', kans: 18, bg: '#f21b7a', fg: '#ffffff' },
    { id: 'mystery', label: 'Mystery FUNky Gift', kans: 18, bg: '#3a251b', fg: '#ffffff' },
    { id: 'sos', label: 'Marketing SOS', kans: 10, bg: '#f6b4a6', fg: '#3a251b' }
  ];
  var R = 200, NS = 'http://www.w3.org/2000/svg';
  var wiel = document.getElementById('bfWheel');
  var rotatie = 0;

  function punt(r, graden) {
    var a = graden * Math.PI / 180;
    return [r * Math.sin(a), -r * Math.cos(a)];
  }
  function el(naam, attrs) {
    var e = document.createElementNS(NS, naam);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // Rad tekenen
  var hoek = 0;
  VAKKEN.forEach(function (v) {
    var breedte = v.kans / 100 * 360;
    v.van = hoek; v.tot = hoek + breedte; v.midden = hoek + breedte / 2;
    var a = punt(R, v.van), b = punt(R, v.tot);
    wiel.appendChild(el('path', {
      d: 'M0,0 L' + a[0] + ',' + a[1] + ' A' + R + ',' + R + ' 0 ' + (breedte > 180 ? 1 : 0) + ' 1 ' + b[0] + ',' + b[1] + ' Z',
      fill: v.bg, stroke: '#ffffff', 'stroke-width': 3
    }));
    var t = el('text', {
      x: 0, y: 0, fill: v.fg, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
      // Rechterhelft leest van binnen naar buiten, linkerhelft van buiten naar binnen: nooit op z'n kop
      transform: v.midden <= 180
        ? 'rotate(' + (v.midden - 90) + ') translate(' + (R * 0.6) + ',0)'
        : 'rotate(' + (v.midden + 90) + ') translate(' + (-R * 0.6) + ',0)'
    });
    if (v.label.length > 14) t.setAttribute('style', 'font-size:12.5px');
    t.textContent = v.label;
    wiel.appendChild(t);
    hoek = v.tot;
  });
  wiel.appendChild(el('circle', { cx: 0, cy: 0, r: R - 1.5, fill: 'none', stroke: '#3a251b', 'stroke-width': 5 }));

  // Geluid: bij elk segment dat langs de wijzer gaat klikt het rad, op het ritme van het draaien.
  // Gemaakt met Web Audio (geen bestand nodig). De AudioContext start bij de klik op de knop.
  var audio = null;
  function startAudio() {
    try {
      if (!audio) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        audio = new AC();
      }
      if (audio.state === 'suspended') audio.resume();
    } catch (e) { audio = null; }
  }
  function tik(snelheid) {
    if (!audio || audio.state !== 'running') return;
    try {
      var t = audio.currentTime;
      var rustig = Math.min(1, Math.max(0, snelheid / 900));      // 0 = bijna stil, 1 = vol in gang
      var toon = 620 + rustig * 520 + Math.random() * 60;
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(toon, t);
      o.frequency.exponentialRampToValueAtTime(toon * 0.45, t + 0.035);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.32 - rustig * 0.1, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(g); g.connect(audio.destination);
      o.start(t); o.stop(t + 0.06);
      // klein tikje van het pennetje: korte ruis
      var n = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.012), audio.sampleRate);
      var d = n.getChannelData(0);
      for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      var bron = audio.createBufferSource(), f = audio.createBiquadFilter(), g2 = audio.createGain();
      bron.buffer = n; f.type = 'highpass'; f.frequency.value = 2500; g2.gain.value = 0.18;
      bron.connect(f); f.connect(g2); g2.connect(audio.destination);
      bron.start(t);
    } catch (e) {}
    var wijzer = document.querySelector('.bf-pointer');
    if (wijzer) {
      wijzer.style.transform = 'translateX(-50%) rotate(-16deg)';
      setTimeout(function () { wijzer.style.transform = 'translateX(-50%) rotate(0deg)'; }, 55);
    }
  }
  function vakNaarWijzer(graden) {
    var a = (((-graden) % 360) + 360) % 360;
    for (var i = 0; i < VAKKEN.length; i++) if (a >= VAKKEN[i].van && a < VAKKEN[i].tot) return i;
    return 0;
  }
  function hoekNu() {
    var m = getComputedStyle(wiel).transform;
    if (!m || m === 'none') return 0;
    var w = m.match(/matrix\(([^)]+)\)/);
    if (!w) return 0;
    var p = w[1].split(',');
    return Math.atan2(parseFloat(p[1]), parseFloat(p[0])) * 180 / Math.PI;
  }
  function luisterNaarWiel(isKlaar) {
    var vorigeHoek = hoekNu(), vorigVak = vakNaarWijzer(vorigeHoek), vorigeTijd = performance.now();
    (function frame(nu) {
      if (isKlaar()) return;
      var h = hoekNu(), vak = vakNaarWijzer(h);
      var dt = Math.max(1, nu - vorigeTijd);
      var delta = ((h - vorigeHoek) % 360 + 360) % 360;
      if (delta > 180) delta -= 360;
      var snelheid = Math.abs(delta) / dt * 1000;
      if (vak !== vorigVak) tik(snelheid);
      vorigeHoek = h; vorigVak = vak; vorigeTijd = nu;
      requestAnimationFrame(frame);
    })(performance.now());
  }

  function draaiNaar(prijsId, klaar) {
    var v = VAKKEN.filter(function (x) { return x.id === prijsId; })[0];
    var marge = (v.tot - v.van) * 0.35;
    var doel = v.midden + (Math.random() * 2 - 1) * marge;
    var rest = ((-doel - rotatie) % 360 + 360) % 360;
    rotatie = rotatie + 360 * 6 + rest;
    wiel.classList.remove('bf-wobble');
    void wiel.getBoundingClientRect();
    wiel.style.transform = 'rotate(' + rotatie + 'deg)';
    var gedaan = false;
    function einde() { if (!gedaan) { gedaan = true; klaar(); } }
    luisterNaarWiel(function () { return gedaan; });
    wiel.addEventListener('transitionend', einde, { once: true });
    setTimeout(einde, 6200);
  }

  // Herkomst van de bezoeker, voor resultaten per kanaal
  var herkomst = { bron: 'direct', campagne: '' };
  try {
    var q = new URLSearchParams(location.search);
    var opgeslagen = JSON.parse(sessionStorage.getItem('bf_herkomst') || 'null');
    if (q.get('utm_source') || q.get('fbclid') || q.get('ttclid')) {
      herkomst.bron = q.get('utm_source') || (q.get('fbclid') ? 'meta' : 'tiktok');
      herkomst.campagne = q.get('utm_campaign') || '';
    } else if (opgeslagen) {
      herkomst = opgeslagen;
    } else if (document.referrer && document.referrer.indexOf(location.host) < 0) {
      herkomst.bron = new URL(document.referrer).hostname.replace(/^www\./, '');
    }
    sessionStorage.setItem('bf_herkomst', JSON.stringify(herkomst));
  } catch (e) { /* zonder opslag blijft het 'direct' */ }

  function koekje(naam) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + naam + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  try {
    var fbclid = new URLSearchParams(location.search).get('fbclid');
    if (fbclid) { herkomst.fbc = 'fb.1.' + Date.now() + '.' + fbclid; sessionStorage.setItem('bf_herkomst', JSON.stringify(herkomst)); }
  } catch (e) {}

  function tel(stap) {
    try {
      fetch('/api/bf-event', {
        method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stap: stap, bron: herkomst.bron, campagne: herkomst.campagne })
      }).catch(function () {});
    } catch (e) {}
  }
  // Advertentiepixels laden alleen na cookietoestemming (cookie-consent.js); zonder pixel gebeurt hier niets
  function pixel(naam, id) {
    try { if (window.fbq) window.fbq('track', naam, {}, { eventID: id }); } catch (e) {}
    try { if (window.ttq) window.ttq.track(naam === 'Lead' ? 'SubmitForm' : naam, {}, { event_id: id }); } catch (e) {}
  }

  // Voor de opening: formulier dicht (de server bewaakt het echt, dit voorkomt dat iemand eerst alles invult)
  var OPEN_OP = Date.UTC(2026, 10, 26, 4, 0, 0); // 26 nov 00:00 Curaçao (UTC-4)
  var nogDicht = Date.now() < OPEN_OP;

  tel('bezoek');
  var form = document.getElementById('bfForm');
  var gestart = false;
  form.addEventListener('focusin', function () { if (!gestart) { gestart = true; tel('start-formulier'); } });

  var VELDEN = { naam: 'bfNaam', bedrijf: 'bfBedrijf', email: 'bfEmail', whatsapp: 'bfWhatsapp', kanaal: 'bfKanaal' };
  var VINKJES = { curacao: 'bfCuracaoWrap', voorwaarden: 'bfVoorwaardenWrap' };
  var melding = document.getElementById('bfMelding');
  var knop = document.getElementById('bfButton');
  if (nogDicht) {
    knop.disabled = true; knop.textContent = 'OPENS THURSDAY, NOV 26';
    document.getElementById('bfMelding').textContent = 'The wheel opens on Thursday, November 26. Come back then and spin!';
    document.getElementById('bfMelding').style.display = 'block';
  }

  function toonFouten(lijst) {
    Object.keys(VELDEN).forEach(function (k) { document.getElementById(VELDEN[k]).parentNode.classList.toggle('bf-fout', lijst.indexOf(k) >= 0); });
    Object.keys(VINKJES).forEach(function (k) { document.getElementById(VINKJES[k]).classList.toggle('bf-fout', lijst.indexOf(k) >= 0); });
    var eerste = lijst[0] && document.getElementById(VELDEN[lijst[0]] || VINKJES[lijst[0]]);
    if (eerste) eerste.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function zegIets(tekst) { melding.textContent = tekst; melding.style.display = tekst ? 'block' : 'none'; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (nogDicht) return;
    zegIets('');
    var data = {
      naam: form.naam.value, bedrijf: form.bedrijf.value, email: form.email.value, whatsapp: form.whatsapp.value,
      kanaal: form.kanaal.value, honeypot: form.honeypot.value,
      curacao: document.getElementById('bfCuracao').checked, voorwaarden: document.getElementById('bfVoorwaarden').checked,
      bron: herkomst.bron, campagne: herkomst.campagne,
      toestemming: !!(window.funkinessConsent && window.funkinessConsent() === 'accepted'),
      fbc: koekje('_fbc') || herkomst.fbc || '', fbp: koekje('_fbp') || ''
    };
    var fout = [];
    if (data.naam.trim().length < 2) fout.push('naam');
    if (data.bedrijf.trim().length < 2) fout.push('bedrijf');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) fout.push('email');
    var cijfers = data.whatsapp.replace(/\D/g, '').replace(/^00/, '');
    if (!(/^5999\d{7}$/.test(cijfers) || /^9\d{7}$/.test(cijfers))) fout.push('whatsapp');
    if (data.kanaal.trim().length < 3) fout.push('kanaal');
    if (!data.curacao) fout.push('curacao');
    if (!data.voorwaarden) fout.push('voorwaarden');
    toonFouten(fout);
    if (fout.length) return;

    startAudio();
    knop.disabled = true; knop.textContent = 'SPINNING...';
    wiel.style.setProperty('--bf-r', (rotatie % 360) + 'deg');
    wiel.style.transform = 'rotate(' + (rotatie % 360) + 'deg)';
    rotatie = rotatie % 360;
    wiel.classList.add('bf-wobble');
    document.querySelector('.bf-wheel-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });

    fetch('/api/spin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (u) {
        if (!u.success) {
          wiel.classList.remove('bf-wobble');
          knop.disabled = false; knop.textContent = 'SPIN THE FUN!';
          if (u.velden) { toonFouten(u.velden); return; }
          if (u.status === 'gesloten') return zegIets('SPIN THE FUN! has ended. Thanks for stopping by!');
          if (u.status === 'nog-niet') return zegIets('The wheel opens soon. Come back on Thursday, November 26!');
          return zegIets(u.error || 'The wheel is stuck. Please try again in a minute.');
        }
        if (document.getElementById('bfLetter').checked && !u.dubbel) {
          fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, taal: 'en', bron: 'black-friday-marketing-ai' }) }).catch(function () {});
        }
        draaiNaar(u.prijs, function () { toonUitslag(u, data); });
      })
      .catch(function () {
        wiel.classList.remove('bf-wobble');
        knop.disabled = false; knop.textContent = 'SPIN THE FUN!';
        zegIets('No connection. Please try again in a minute.');
      });
  });

  function toonUitslag(u, data) {
    form.style.display = 'none';
    document.getElementById('bfWonLabel').textContent = u.dubbel ? 'You already spun! You won:' : 'You won!';
    document.getElementById('bfPrijs').textContent = u.onthulling ? u.naam + ': ' + u.onthulling : u.naam;
    document.getElementById('bfKort').textContent = u.kort;
    var dl = document.getElementById('bfDownload');
    if (u.download) { dl.href = u.download; dl.style.display = 'inline-block'; } else { dl.style.display = 'none'; }
    document.getElementById('bfMailNote').textContent = u.dubbel
      ? 'One spin per business, so this is your prize.'
      : u.download
        ? (u.mail ? 'We also sent it to ' + data.email + '.' : 'Download it now. Our email may take a little longer.')
        : (u.mail ? 'We sent the details to ' + data.email + '. Nothing to do right now.'
                          : 'Your Marketing SOS is registered. We will contact you at ' + data.email + ' shortly. Nothing to do right now.');
    document.getElementById('bfResult').style.display = 'block';
    // Op mobiel staat de uitslag onder het rad: even laten zien waar het rad stopte, dan erheen
    setTimeout(function () { document.getElementById('bfCard').scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 900);
    if (!u.dubbel) pixel('Lead', u.id);
  }
})();
