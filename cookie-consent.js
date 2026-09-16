(function () {
  var STORAGE_KEY = 'funkiness_cookie_consent';
  var lang = document.documentElement.lang === 'nl' ? 'nl' : 'en';
  var prefix = lang === 'nl' ? '/nl' : '';

  var copy = {
    en: {
      text: 'We use a couple of cookies. One remembers you saw this message, one (optional) helps us see which pages get visited. No personal tracking, no selling data.',
      policy: 'Cookie Policy',
      accept: 'Accept',
      decline: 'Decline'
    },
    nl: {
      text: 'We gebruiken een paar cookies. Eén onthoudt dat je dit bericht hebt gezien, één (optioneel) helpt ons zien welke pagina’s bezocht worden. Geen persoonlijke tracking, geen doorverkoop van gegevens.',
      policy: 'Cookiebeleid',
      accept: 'Accepteren',
      decline: 'Weigeren'
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
