// Rose's Cleaning & Janitorial — site interactions
(() => {
  const PHONE = '+14352659950';
  const EMAIL = 'brambilarosie773@gmail.com';
  const isMobile = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ---------- header: shadow on scroll ----------
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- mobile nav ----------
  const nav = $('#primary-nav');
  const navToggle = $('.nav-toggle');
  function setNav(open) {
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.style.setProperty('--nav-top', `${header.getBoundingClientRect().bottom}px`);
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }
  navToggle.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));

  // ---------- dropdown menus ----------
  const toggles = $$('.menu-toggle');
  const closeMenus = (except) => toggles.forEach((t) => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    $('#' + t.getAttribute('aria-controls')).classList.remove('is-open');
  });
  toggles.forEach((t) => {
    const menu = $('#' + t.getAttribute('aria-controls'));
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = t.getAttribute('aria-expanded') !== 'true';
      closeMenus(t);
      t.setAttribute('aria-expanded', open);
      menu.classList.toggle('is-open', open);
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-menu')) closeMenus(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openToggle = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
    closeMenus();
    if (openToggle) openToggle.focus();
    if (nav.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setNav(false); });

  // ---------- reveal on scroll ----------
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = $$('.section-head, .card, .mosaic figure, .cta-band, .faq-list, .prose');
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) return; // already on screen: don't animate
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ---------- hero slideshow ----------
  // Crossfades every 6s. Stops when the tab is hidden and never autoplays for
  // people who prefer reduced motion. The pause button (WCAG 2.2.2) is only
  // visible when focused with the keyboard.
  const hero = $('[data-hero]');
  if (hero) {
    const slides = $$('.hero-slide', hero);
    const pauseBtn = $('.hero-pause', hero);
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let timer = null;
    let paused = reduceMotion;

    const show = (i) => {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { stop(); if (!paused && !document.hidden) timer = setInterval(() => show(current + 1), 6000); };
    const setPaused = (p) => {
      paused = p;
      pauseBtn.setAttribute('aria-pressed', p);
      pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
      p ? stop() : start();
    };

    pauseBtn.addEventListener('click', () => setPaused(!paused));
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    setPaused(paused);
  }

  // ---------- price estimator ----------
  const RATES = {
    standard: { base: 120, sqft: 0.05, bed: 10, bath: 15, label: 'standard cleaning', slug: 'standard-cleaning' },
    deep: { base: 200, sqft: 0.08, bed: 20, bath: 25, label: 'deep cleaning', slug: 'deep-cleaning' },
    'move-out': { base: 250, sqft: 0.10, bed: 25, bath: 30, label: 'move-in/move-out cleaning', slug: 'move-in-move-out-cleaning' },
  };
  $$('[data-estimator]').forEach((est) => {
    const service = $('#est-service', est);
    const size = $('#est-size', est);
    const sizeOut = $('#est-size-out', est);
    const beds = $('#est-beds', est);
    const baths = $('#est-baths', est);
    const price = $('#est-price', est);
    const cta = $('#est-cta', est);
    function update() {
      const r = RATES[service.value];
      const sq = Number(size.value);
      const total = r.base + Math.max(0, sq - 1000) * r.sqft + Number(beds.value) * r.bed + Number(baths.value) * r.bath;
      const lo = Math.round((total - 15) / 5) * 5;
      const hi = Math.round((total + 15) / 5) * 5;
      sizeOut.textContent = `${sq.toLocaleString()} sq ft`;
      price.textContent = `$${lo} – $${hi}`;
      const notes = `Estimator: ${r.label}, about ${sq.toLocaleString()} sq ft, ${beds.value} bed / ${baths.value} bath. Estimated $${lo}–$${hi}.`;
      cta.href = `/contact/?service=${r.slug}&notes=${encodeURIComponent(notes)}`;
    }
    [service, size, beds, baths].forEach((el) => el.addEventListener('input', update));
    update();
  });

  // ---------- quote form: hand off to SMS or email ----------
  const form = $('#quote-form');
  if (form) {
    const params = new URLSearchParams(location.search);
    const svc = params.get('service');
    if (svc && $(`#q-service option[value="${CSS.escape(svc)}"]`)) $('#q-service').value = svc;
    if (params.get('notes')) $('#q-notes').value = params.get('notes');

    const err = $('#q-error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#q-name');
      const phone = $('#q-phone');
      let ok = true;
      [name, phone].forEach((f) => {
        const bad = !f.value.trim();
        f.setAttribute('aria-invalid', bad);
        if (bad) ok = false;
      });
      err.hidden = ok;
      if (!ok) { (name.value.trim() ? phone : name).focus(); return; }

      const serviceLabel = $('#q-service').selectedOptions[0].text;
      const notes = $('#q-notes').value.trim();
      const body = [
        `Hi Rose and Maria! I'd like a free estimate.`,
        `Name: ${name.value.trim()}`,
        `Phone: ${phone.value.trim()}`,
        `Service: ${serviceLabel}`,
        `City: ${$('#q-area').value}`,
        notes && `Details: ${notes}`,
      ].filter(Boolean).join('\n');

      const via = e.submitter?.value || (isMobile ? 'sms' : 'email');
      if (via === 'sms') {
        // "?&body=" is understood by both iOS and Android messaging apps.
        location.href = `sms:${PHONE}?&body=${encodeURIComponent(body)}`;
      } else {
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Cleaning estimate request: ${serviceLabel}`)}&body=${encodeURIComponent(body)}`;
      }
    });
    $$('#q-name, #q-phone').forEach((f) => f.addEventListener('input', () => f.value.trim() && f.removeAttribute('aria-invalid')));
  }

  // On desktop, "Text" links can't open a texting app; send those to email instead.
  if (!isMobile) {
    $$('a[href^="sms:"]').forEach((a) => {
      if (a.closest('.mobile-actions')) return;
      a.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Cleaning estimate request')}`;
      const label = a.querySelector('small');
      if (label) label.textContent = 'Text (opens email on computers)';
    });
  }
})();
