// Nieuwsbrief-inschrijving: elk formulier met [data-newsletter] post naar /api/newsletter
document.querySelectorAll('[data-newsletter]').forEach(form => {
  const status = form.querySelector('.newsletter-status');
  const button = form.querySelector('button[type="submit"]');
  const zeg = (soort) => {
    status.textContent = status.dataset[soort];
    status.className = 'newsletter-status ' + (soort === 'ok' ? 'is-ok' : 'is-fout');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return zeg('ongeldig');

    button.disabled = true;
    try {
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          taal: form.taal.value,
          bron: form.dataset.bron,
          honeypot: form.website_url.value
        })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.success) throw new Error();
      zeg('ok');
      form.email.value = '';
      if (typeof gtag === 'function') gtag('event', 'newsletter_signup', { taal: form.taal.value });
    } catch {
      zeg('fout');
    } finally {
      button.disabled = false;
    }
  });
});
