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

(function () {
  var STORAGE_KEY = 'funkiness_cookie_consent';
  var lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  var prefix = lang === 'nl' ? '/nl' : '';

  var copy = {
    en: {
      text: 'Quick cookie check. One remembers you said hi, so we don’t ask twice. One (optional) shows us which pages you’re actually into.',
      policy: 'Cookie Policy',
      accept: 'Works for me',
      decline: 'Not now'
    },
    nl: {
      text: 'Eventjes de cookies. Eén onthoudt dat je hier al was, zodat we het niet nog een keer vragen. Eén (optioneel) laat zien welke pagina’s je leest.',
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
    }
  });
})();
