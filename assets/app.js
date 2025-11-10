/* =====================================================
   JS PRINCIPAL — Katriel Fonseca
   - Tema claro/escuro
   - Scroll suave interno
   - Formulário (mock)
   - Ano no rodapé
   - Menu mobile (hambúrguer) — tablet pra baixo (≤1024px)
   - Carousel com botões, dots, teclado e swipe
===================================================== */
(() => {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ========== Tema claro/escuro ==========
  const THEME_KEY = "theme";
  const LIGHT = "light";
  const rootEl = document.documentElement;
  const themeToggle = $("#themeToggle");

  function setTheme(mode) {
    if (mode === LIGHT) rootEl.classList.add(LIGHT);
    else rootEl.classList.remove(LIGHT);
    localStorage.setItem(THEME_KEY, mode);
    themeToggle?.setAttribute("aria-pressed", String(mode === LIGHT));
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    setTheme(LIGHT);
  }

  themeToggle?.addEventListener("click", () => {
    const next = rootEl.classList.contains(LIGHT) ? "dark" : LIGHT;
    setTheme(next);
  });

  // ========== Scroll suave (links #ancora) ==========
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", `#${id}`);
  });

  // ========== Formulário (mock de envio) ==========
  const form = $("#contactForm");
  const formStatus = $("#formStatus");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (formStatus) formStatus.textContent = "Enviando…";
    await new Promise((r) => setTimeout(r, 700));
    if (formStatus) formStatus.textContent = "Obrigado! Sua mensagem foi enviada.";
    form.reset();
  });

  // ========== Ano no rodapé ==========
  const yearSpan = $("#year");
  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  // ========== Menu mobile (hambúrguer) ==========
  // CSS já esconde o menu e mostra o botão em ≤1024px
  const navToggle = $(".nav-toggle");
  const menu = $(".menu");

  function openMenu() {
    menu?.classList.add("open");
    navToggle?.setAttribute("aria-expanded", "true");
    // trava scroll em mobile para evitar scroll do fundo
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMenu() {
  menu.classList.add("open");
  navToggle.classList.add("open"); // <-- ativa animação
  navToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menu.classList.remove("open");
  navToggle.classList.remove("open"); // <-- desativa animação
  navToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function toggleMenu() {
  if (menu.classList.contains("open")) closeMenu();
  else openMenu();
}

navToggle?.addEventListener("click", toggleMenu);


  navToggle?.addEventListener("click", toggleMenu);

  // Fecha ao clicar num link do menu
  $$(".menu a").forEach((a) =>
    a.addEventListener("click", () => closeMenu())
  );

  // Fecha ao clicar fora (quando aberto)
  document.addEventListener("click", (e) => {
    if (!menu?.classList.contains("open")) return;
    const clickedInsideMenu = e.target.closest(".menu") || e.target.closest(".nav-toggle");
    if (!clickedInsideMenu) closeMenu();
  });

  // Se redimensionar para >1024px, garante estado limpo
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMenu();
  });

  // ========== Carousel ==========
  const carousel = $(".carousel");
  if (carousel) {
    const viewport = $(".carousel-viewport", carousel);
    const slides = $$(".slide", viewport);
    const prevBtn = $(".prev", carousel);
    const nextBtn = $(".next", carousel);
    const dotsWrap = $(".dots", carousel);
    const dots = dotsWrap ? $$(".dot", dotsWrap) : [];

    let index = 0;
    const total = slides.length;

    function setActive(i) {
      index = (i + total) % total;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
      dots.forEach((d, k) => {
        d.classList.toggle("is-active", k === index);
        d.setAttribute("aria-selected", String(k === index));
      });
    }

    function go(step) {
      setActive(index + step);
    }

    prevBtn?.addEventListener("click", () => go(-1));
    nextBtn?.addEventListener("click", () => go(1));

    dots.forEach((dot, k) => {
      // aceita data-to="0/1/2" ou usa o índice de fallback
      const to = Number(dot.getAttribute("data-to"));
      dot.addEventListener("click", () => setActive(Number.isFinite(to) ? to : k));
    });

    // Teclado
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });
    carousel.setAttribute("tabindex", "0");

    // Swipe
    let startX = null;
    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (startX === null) return;
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 60) {
          go(dx > 0 ? -1 : 1);
          startX = null;
        }
      },
      { passive: true }
    );
    carousel.addEventListener("touchend", () => (startX = null));

    // Auto-play opcional: data-auto="true"
    if (carousel.dataset.auto === "true") {
      setInterval(() => go(1), 5000);
    }

    setActive(0);
  }
})();
