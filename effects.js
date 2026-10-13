// Subtle motion: pink marker words get written when their heading scrolls into view.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var words = document.querySelectorAll('.script-word, .hero-script');
  if (!words.length) return;
  document.documentElement.classList.add('fx-write');
  // watch the parent, a fully clipped word has nothing visible to intersect
  var io = new IntersectionObserver(function (entries) {
    var step = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.script-word, .hero-script').forEach(function (el) {
        setTimeout(function () { el.classList.add('is-written'); }, 150 + step++ * 120);
      });
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -15% 0px' });
  var parents = [];
  words.forEach(function (w) {
    if (parents.indexOf(w.parentNode) === -1) { parents.push(w.parentNode); io.observe(w.parentNode); }
  });
})();
