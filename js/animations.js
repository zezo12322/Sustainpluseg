/* ============================================================
   SUSTAINPLUS — GSAP Animations
   Adapted from mekky portfolio patterns, tuned for green brand
   ============================================================ */

(function () {
  'use strict';

  /* ── Reduced-motion bail-out ────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const pre = document.getElementById('preloader');
    if (pre) pre.remove();
    return;
  }

  /* ── GSAP guard ─────────────────────────────────────── */
  if (typeof gsap === 'undefined') return;

  /* Mark html so CSS can disable conflicting animations */
  document.documentElement.classList.add('js-gsap');

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ── Preloader ──────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  let heroDelay   = 0.25;   /* delay before hero elements animate */

  if (preloader) {
    const firstVisit = !sessionStorage.getItem('sp-loaded');

    if (!firstVisit) {
      /* Subsequent pages: skip preloader immediately */
      preloader.style.display = 'none';
    } else {
      sessionStorage.setItem('sp-loaded', '1');
      const counterEl  = preloader.querySelector('.preloader-count');
      const COUNT_DUR  = 0.95;   /* 0 → 100 */
      const EXIT_DUR   = 0.55;   /* slide-up exit */
      heroDelay        = COUNT_DUR + EXIT_DUR + 0.05;

      document.body.style.overflow = 'hidden';

      const obj = { value: 0 };
      gsap.to(obj, {
        value: 100,
        duration: COUNT_DUR,
        ease: 'power2.inOut',
        onUpdate () {
          if (counterEl) counterEl.textContent = Math.round(obj.value);
        },
        onComplete () {
          gsap.to(preloader, {
            yPercent: -100,
            duration: EXIT_DUR,
            ease: 'power3.inOut',
            onComplete () {
              preloader.style.display = 'none';
              document.body.style.overflow = '';
            },
          });
        },
      });
    }
  }

  /* ── Hero — full-page (index) ───────────────────────── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroH1    = heroSection.querySelector('h1');
    const heroBadge = heroSection.querySelector('.hero-badge');
    const heroP     = heroSection.querySelector('p');
    const heroCta   = heroSection.querySelector('.hero-cta');

    /* Hide elements before animation */
    const heroEls = [heroBadge, heroH1, heroP, heroCta].filter(Boolean);
    gsap.set(heroEls, { opacity: 0, y: 30 });

    /* Word-by-word h1 reveal */
    if (heroH1 && typeof SplitType !== 'undefined') {
      const split = new SplitType(heroH1, { types: 'words' });
      gsap.set(heroH1, { opacity: 1, y: 0 });
      gsap.from(split.words, {
        y: 55,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        delay: heroDelay,
      });
    } else if (heroH1) {
      /* Fallback — no SplitType */
      gsap.to(heroH1, { opacity: 1, y: 0, duration: 0.7, delay: heroDelay, ease: 'power3.out' });
    }

    /* Stagger remaining hero elements */
    const tl = gsap.timeline({ delay: heroDelay + 0.15 });
    if (heroBadge) tl.to(heroBadge, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0);
    if (heroP)     tl.to(heroP,     { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 0.3);
    if (heroCta)   tl.to(heroCta,   { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, 0.55);
  }

  /* ── Page hero (about / services / projects / contact) ─ */
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    const pageH1 = pageHero.querySelector('h1');
    const pageSub = pageHero.querySelector('p, .breadcrumb');

    if (pageH1) {
      if (typeof SplitType !== 'undefined') {
        gsap.set(pageH1, { opacity: 0 });
        const split = new SplitType(pageH1, { types: 'words' });
        gsap.set(pageH1, { opacity: 1 });
        gsap.from(split.words, {
          y: 40,
          opacity: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.2,
        });
      } else {
        gsap.from(pageH1, { opacity: 0, y: 30, duration: 0.6, delay: 0.2, ease: 'power3.out' });
      }
    }
    if (pageSub) {
      gsap.from(pageSub, { opacity: 0, y: 20, duration: 0.5, delay: 0.5, ease: 'power2.out' });
    }
  }

  /* ── Section heading word reveal ────────────────────── */
  if (typeof SplitType !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.section-header h2').forEach(el => {
      gsap.set(el, { opacity: 0 });
      const split = new SplitType(el, { types: 'words' });
      gsap.set(el, { opacity: 1 });
      gsap.from(split.words, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 35,
        opacity: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: 'power3.out',
      });
    });
  }

  /* ── Image parallax (split-section images) ──────────── */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.split-image img').forEach(img => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img.closest('.split-section') || img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: -45,
        ease: 'none',
      });
    });
  }

  /* ── Service / value cards stagger ─────────────────── */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.cards-grid, .values-grid').forEach(grid => {
      const items = Array.from(grid.querySelectorAll('.card, .value-item'));
      if (!items.length) return;
      /* Only animate items that don't already have data-aos */
      const targets = items.filter(el => !el.hasAttribute('data-aos'));
      if (!targets.length) return;
      gsap.from(targets, {
        scrollTrigger: { trigger: grid, start: 'top 82%', once: true },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    });
  }

  /* ── Stats strip number counter (GSAP) ─────────────── */
  if (typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      /* Remove the IntersectionObserver hook by pre-marking as animated */
      el.dataset.counted = 'true';
      const obj = { value: 0 };
      gsap.to(obj, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        value: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate () { el.textContent = Math.round(obj.value) + suffix; },
      });
    });
  }

})();
