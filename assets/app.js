(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  // Theme toggle
  const toggle = $('#themeToggle');
  const LIGHT = 'light';
  const key = 'theme';
  const root = document.documentElement;

  function setTheme(mode) {
    if (mode === LIGHT) root.classList.add(LIGHT);
    else root.classList.remove(LIGHT);
    localStorage.setItem(key, mode);
    toggle?.setAttribute('aria-pressed', String(mode === LIGHT));
  }

  const saved = localStorage.getItem(key);
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme(LIGHT);
  }

  toggle?.addEventListener('click', () => {
    const next = root.classList.contains(LIGHT) ? 'dark' : LIGHT;
    setTheme(next);
  });

  // Smooth scroll for anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', `#${id}`);
  });

  // Form handling (client-side demo)
  const form = $('#contactForm');
  const status = $('#formStatus');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Enviando…';
    await new Promise(r => setTimeout(r, 700)); // simula envio
    status.textContent = 'Obrigado! Sua mensagem foi enviada.';
    form.reset();
  });

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());


    // ===== Carousel =====
  (function initCarousel(){
    const root = document.querySelector('.carousel');
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dotsWrap = root.querySelector('.dots');
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

    let i = 0;
    const total = slides.length;

    function setActive(idx) {
      i = (idx + total) % total;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-selected', String(k === i));
      });
    }

    function go(n) { setActive(i + n); }

    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    dots.forEach(d => d.addEventListener('click', () => setActive(+d.dataset.to)));

    // Teclado
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    root.setAttribute('tabindex', '0');

    // Toque (swipe)
    let x0 = null;
    root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchmove', (e) => {
      if (x0 === null) return;
      const dx = e.touches[0].clientX - x0;
      if (Math.abs(dx) > 60) {
        go(dx > 0 ? -1 : 1);
        x0 = null;
      }
    }, { passive: true });
    root.addEventListener('touchend', () => { x0 = null; });

    // Auto (opcional: defina data-auto="true" no .carousel)
    if (root.dataset.auto === 'true') {
      setInterval(() => go(1), 5000);
    }

    setActive(0);
  })();


})();