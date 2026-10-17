// Booking buttons: every [data-book] link plus a floating button open the Cal.com
// calendar in a pop-up. Without JavaScript the links simply open the page on cal.com.
(function () {
  var CAL_LINK = 'funkiness/marketing-strategy-session';
  var NS = 'marketing-strategy-session';
  var nl = document.documentElement.lang === 'nl';

  var noFloat = /\/(scan|quiz)\.html$/.test(location.pathname);

  var btn = document.createElement('a');
  btn.className = 'book-float';
  btn.href = 'https://cal.com/' + CAL_LINK;
  btn.target = '_blank';
  btn.rel = 'noopener';
  btn.innerHTML = '<span class="book-float-plus" aria-hidden="true">✚</span>' +
    '<span class="book-float-text"><strong>' + (nl ? 'Plan je gratis sessie' : 'Book your free session') +
    '</strong><small>' + (nl ? 'Kies zelf direct een tijd' : 'Pick your time right now') + '</small></span>';
  btn.setAttribute('data-book', '');
  if (!noFloat) document.body.appendChild(btn);

  function loadCal() {
    if (window.Cal && window.Cal.ns && window.Cal.ns[NS]) return;
    // Official Cal.com embed loader
    (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', NS, { origin: 'https://app.cal.com' });
    Cal.ns[NS]('ui', {
      theme: 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#f21b7a' } },
      hideEventTypeDetails: false,
      layout: 'month_view'
    });
  }

  document.querySelectorAll('[data-book]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
      loadCal();
      Cal.ns[NS]('modal', { calLink: CAL_LINK, config: { layout: 'month_view', theme: 'light' } });
    });
    // Preload on first hover or touch, so the pop-up opens faster
    el.addEventListener('pointerenter', loadCal, { once: true });
    el.addEventListener('touchstart', loadCal, { once: true, passive: true });
  });
})();
