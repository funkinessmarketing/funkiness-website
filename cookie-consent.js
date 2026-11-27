window.funkinessLoadAnalytics = function () {
  if (window.__funkinessGaLoaded) return;
  window.__funkinessGaLoaded = true;
  var GA_ID = 'G-VEEW2PC9P5';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
};

// Advertentiepixels (Black Friday 2026 en later). Leeg = niet geladen en de cookiebanner noemt ze niet.
// Ze laden alleen na 'accepted', net als Google Analytics.
var FUNKINESS_META_PIXEL_ID = '2502034796950833';
var FUNKINESS_TIKTOK_PIXEL_ID = '';

window.funkinessLoadAdPixels = function () {
  if (window.__funkinessAdsLoaded) return;
  window.__funkinessAdsLoaded = true;
  if (FUNKINESS_META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', FUNKINESS_META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  if (FUNKINESS_TIKTOK_PIXEL_ID) {
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.load = function (e) {
        var s = d.createElement('script'); s.async = !0; s.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + e + '&lib=' + t;
        var f = d.getElementsByTagName('script')[0]; f.parentNode.insertBefore(s, f);
      };
      ttq.load(FUNKINESS_TIKTOK_PIXEL_ID); ttq.page();
    }(window, document, 'ttq');
  }
};

window.funkinessConsent = function () {
  try { return localStorage.getItem('funkiness_cookie_consent'); } catch (e) { return null; }
};

(function () {
  var STORAGE_KEY = 'funkiness_cookie_consent';
  var ADS = !!(FUNKINESS_META_PIXEL_ID || FUNKINESS_TIKTOK_PIXEL_ID);
  var lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  var prefix = lang === 'nl' ? '/nl' : '';

  var copy = {
    en: {
      text: 'Quick cookie check. One remembers you said hi, so we don’t ask twice. One (optional) shows us which pages you’re actually into.' + (ADS ? ' And (also optional) one tells Facebook, Instagram or TikTok that our ad brought you here.' : ''),
      policy: 'Cookie Policy',
      accept: 'Works for me',
      decline: 'Not now'
    },
    nl: {
      text: 'Eventjes de cookies. Eén onthoudt dat je hier al was, zodat we het niet nog een keer vragen. Eén (optioneel) laat zien welke pagina’s je leest.' + (ADS ? ' En (ook optioneel) één vertelt Facebook, Instagram of TikTok dat onze advertentie je hier bracht.' : ''),
      policy: 'Cookiebeleid',
      accept: 'Prima',
      decline: 'Liever niet'
    }
  };

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    var banner = document.getElementById('funkiness-cookie-banner');
    if (banner) banner.remove();
    if (value === 'accepted' && typeof window.funkinessLoadAnalytics === 'function') {
      window.funkinessLoadAnalytics();
      window.funkinessLoadAdPixels();
    }
  }

  function showBanner() {
    var t = copy[lang];
    var el = document.createElement('div');
    el.id = 'funkiness-cookie-banner';
    el.innerHTML =
      '<p>' + t.text + ' <a href="' + prefix + '/cookie-policy.html">' + t.policy + '</a></p>' +
      '<div class="funkiness-cookie-actions">' +
      '<button type="button" data-action="decline">' + t.decline + '</button>' +
      '<button type="button" data-action="accept">' + t.accept + '</button>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('[data-action="accept"]').addEventListener('click', function () { setConsent('accepted'); });
    el.querySelector('[data-action="decline"]').addEventListener('click', function () { setConsent('declined'); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var consent = getConsent();
    if (!consent) {
      showBanner();
    } else if (consent === 'accepted' && typeof window.funkinessLoadAnalytics === 'function') {
      window.funkinessLoadAnalytics();
      window.funkinessLoadAdPixels();
    }
  });
})();

// Black Friday 2026: balk bovenaan elke pagina + knop in de hero van de homepage.
// Zichtbaar van 26-11-2026 00:00 t/m 29-11-2026 23:59 (Curaçao, UTC-4), daarna verdwijnt hij vanzelf.
(function () {
  var start = Date.UTC(2026, 10, 26, 4, 0, 0), einde = Date.UTC(2026, 10, 30, 3, 59, 59);
  var nu = Date.now();
  if (nu < start || nu > einde) return;
  if (/^\/black-friday/.test(location.pathname)) return;
  var nl = document.documentElement.lang === 'nl';
  var link = '/black-friday?utm_source=website&utm_medium=banner&utm_campaign=bf26_spin';
  var t = nl
    ? { kop: 'BLACK FRIDAY OP CURAÇAO', tekst: 'Draai en win een gratis marketingcadeau.', knop: 'DRAAI NU', hero: 'Black Friday: draai en win' }
    : { kop: 'BLACK FRIDAY ON CURAÇAO', tekst: 'Spin & win a free marketing gift.', knop: 'SPIN NOW', hero: 'Black Friday: spin & win' };
  var css = document.createElement('style');
  css.textContent =
    '@keyframes bfPuls{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(255,255,255,.75)}50%{transform:scale(1.07);box-shadow:0 0 0 10px rgba(255,255,255,0)}}' +
    '@keyframes bfGlans{0%{background-position:-200% 0}100%{background-position:200% 0}}' +
    '@keyframes bfWip{0%,100%{transform:rotate(0)}50%{transform:rotate(-3deg) scale(1.05)}}' +
    '.bf-bar{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:center;background:linear-gradient(100deg,#f21b7a 0%,#ff4fa0 25%,#f21b7a 50%,#c8106a 75%,#f21b7a 100%);background-size:200% 100%;animation:bfGlans 6s linear infinite;color:#fff;text-decoration:none;padding:14px 16px;text-align:center;font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.3;position:sticky;top:0;z-index:40;box-shadow:0 4px 18px rgba(58,37,27,.25)}' +
    '.bf-bar b{font-family:Poppins,Arial,sans-serif;font-weight:900;font-size:18px;letter-spacing:.4px}' +
    '.bf-bar .bf-wiel{display:inline-block;font-size:22px;animation:bfWip 1.6s ease-in-out infinite}' +
    '.bf-bar .bf-go{display:inline-flex;align-items:center;gap:6px;background:#fff;color:#f21b7a;border-radius:999px;padding:9px 20px;font-family:"Permanent Marker",cursive;font-size:18px;white-space:nowrap;animation:bfPuls 1.6s ease-in-out infinite}' +
    '.bf-hero-btn{display:inline-flex;align-items:center;gap:10px;background:#f21b7a;color:#fff;text-decoration:none;border-radius:999px;padding:16px 28px;font-family:Poppins,Arial,sans-serif;font-weight:900;font-size:18px;box-shadow:0 12px 30px rgba(242,27,122,.4);animation:bfPuls 1.8s ease-in-out infinite}' +
    '.bf-hero-btn:hover,.bf-hero-btn:focus-visible{transform:translateY(-2px) rotate(-1.5deg)}' +
    '.menu a.bf-menu,.mobile-menu a.bf-menu{color:#f21b7a;font-family:"Permanent Marker",cursive;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;animation:bfWip 1.6s ease-in-out infinite;display:inline-block}' +
    '@media (min-width:700px){.bf-bar{font-size:18px;padding:16px 24px}.bf-bar b{font-size:22px}.bf-bar .bf-go{font-size:20px;padding:10px 24px}}' +
    '@media (prefers-reduced-motion:reduce){.bf-bar,.bf-bar .bf-wiel,.bf-bar .bf-go,.bf-hero-btn,.menu a.bf-menu,.mobile-menu a.bf-menu{animation:none}}';
  function zet() {
    if (document.querySelector('.bf-bar')) return;
    document.head.appendChild(css);
    var bar = document.createElement('a');
    bar.className = 'bf-bar'; bar.href = link;
    bar.innerHTML = '<span><span class="bf-wiel" aria-hidden="true">🎡</span> <b>' + t.kop + '</b> ' + t.tekst + '</span><span class="bf-go">' + t.knop + ' ✚</span>';
    document.body.insertBefore(bar, document.body.firstChild);
    // menu: BLACK FRIDAY 2026 (desktop en mobiel)
    var menu = document.querySelector('nav.menu'), taal = menu && menu.querySelector('.lang-switch');
    if (menu && taal) {
      var plus = document.createElement('span'); plus.textContent = '✚';
      var mi = document.createElement('a'); mi.className = 'bf-menu'; mi.href = link; mi.textContent = 'BLACK FRIDAY 2026';
      menu.insertBefore(plus, taal); menu.insertBefore(mi, taal);
    }
    var mob = document.getElementById('mobileMenu'), mobTaal = mob && mob.querySelector('.lang-switch');
    if (mob && mobTaal) {
      var mm = document.createElement('a'); mm.className = 'bf-menu'; mm.href = link; mm.textContent = 'BLACK FRIDAY 2026';
      mob.insertBefore(mm, mobTaal.nextSibling);
    }
    var scanKnop = document.querySelector('.hero-content .black-button');
    if (scanKnop && scanKnop.parentNode) {
      var knop = document.createElement('a');
      knop.className = 'bf-hero-btn'; knop.href = link;
      knop.innerHTML = '🎡 ' + t.hero + ' <span aria-hidden="true">→</span>';
      scanKnop.parentNode.insertBefore(knop, scanKnop);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', zet); else zet();
})();
