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
      text: 'Yes, the cookie thing. One remembers you saw this so we don’t nag you again. One optional cookie shows us which pages actually get read. No stalking, no selling your data.',
      policy: 'Cookie Policy',
      accept: 'Sounds good',
      decline: 'No thanks'
    },
    nl: {
      text: 'Ja, het cookie-dingetje. Eén onthoudt dat je dit al zag, zodat we niet zeuren. Eén optionele cookie laat ons zien welke pagina’s je echt leest. Geen spionage, geen doorverkoop van jouw gegevens.',
      policy: 'Cookiebeleid',
      accept: 'Prima zo',
      decline: 'Nee, laat maar'
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
