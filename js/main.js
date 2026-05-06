/* ============================================
   SUSTAINPLUS - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Theme Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('sp-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sp-theme', next);
    });
  }

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    header && header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop && backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active Nav Link ---------- */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- AOS Init ---------- */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  /* ---------- Swiper (Client Logos) ---------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-clients')) {
    new Swiper('.swiper-clients', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      speed: 800,
      breakpoints: {
        480:  { slidesPerView: 3 },
        768:  { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
      },
    });
  }

  /* ---------- Counter Animation (fallback — GSAP version in animations.js takes over when loaded) ---------- */
  const counters = document.querySelectorAll('[data-count]:not([data-counted])');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        if (current < target) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  /* ---------- Project Modal (event delegation — works with dynamic cards) ---------- */
  const modalBackdrop = document.getElementById('projectModal');
  if (modalBackdrop) {
    const modalImg   = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag   = document.getElementById('modalTag');
    const modalDesc  = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');

    const openModal = (card) => {
      modalImg.src           = card.dataset.img || '';
      modalImg.alt           = card.dataset.title || '';
      modalTitle.textContent = card.dataset.title || '';
      modalTag.textContent   = card.dataset.tag || '';
      modalDesc.textContent  = card.dataset.desc || '';
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    };

    document.addEventListener('click', e => {
      const card = e.target.closest('.project-card[data-modal]');
      if (card) openModal(card);
    });

    document.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement?.matches('.project-card[data-modal]')) {
        e.preventDefault();
        openModal(document.activeElement);
      }
      if (e.key === 'Escape') closeModal();
    });

    modalClose && modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const showError = (field, msg) => {
      field.classList.add('error');
      const err = field.nextElementSibling;
      if (err && err.classList.contains('form-error')) {
        err.textContent = msg;
        err.classList.add('visible');
      }
    };

    const clearError = (field) => {
      field.classList.remove('error');
      const err = field.nextElementSibling;
      if (err && err.classList.contains('form-error')) {
        err.classList.remove('visible');
      }
    };

    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let valid = true;

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');
      const success = document.getElementById('formSuccess');

      if (!name.value.trim()) { showError(name, 'Name is required.'); valid = false; }
      if (!email.value.trim()) {
        showError(email, 'Email is required.'); valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError(email, 'Enter a valid email address.'); valid = false;
      }
      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters.'); valid = false;
      }

      if (!valid) return;

      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const action   = contactForm.getAttribute('action');
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          contactForm.reset();
          success && success.classList.add('visible');
        } else {
          alert('Something went wrong. Please try again or email us directly.');
        }
      } catch {
        alert('Network error. Please try again later.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  /* ---------- Smooth Anchor Scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
