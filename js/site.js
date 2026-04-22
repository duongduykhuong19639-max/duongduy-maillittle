/* =============================================
   Reliable Helper Gia My — site.js
   Rich animations inspired by Tesla-style UX
   ============================================= */

(function () {
  'use strict';

  /* ── 1. UTILITIES ── */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 2. YEAR ── */
  qsa('[data-year]').forEach(n => (n.textContent = new Date().getFullYear()));

  /* ── 3. NAVIGATION ── */
  const body = document.body;
  const navToggle = qs('[data-nav-toggle]');
  const mobileMenu = qs('[data-mobile-menu]');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('is-open');
      body.classList.toggle('menu-open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('is-open');
        body.classList.remove('menu-open');
      });
    });
  }

  /* ── 4. ACTIVE NAV LINK ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  qsa('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── 5. SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  }, { passive: true });

  /* ── 6. CURSOR GLOW (desktop only) ── */
  if (!reduced && window.innerWidth > 820) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  /* ── 7. SCROLL-REVEAL (IntersectionObserver) ── */
  const revealNodes = qsa('[data-reveal]');
  if ('IntersectionObserver' in window && revealNodes.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    revealNodes.forEach(node => {
      node.classList.add('reveal');
      observer.observe(node);
    });
  } else {
    revealNodes.forEach(n => n.classList.add('is-visible'));
  }

  /* ── 8. COUNT-UP ANIMATION ── */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    qsa('[data-count]').forEach(n => countObserver.observe(n));
  }

  /* ── 9. FAQ ACCORDION ── */
  qsa('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const faqBody = qs('.faq-body', item);
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      qsa('.faq-item').forEach(other => {
        if (other !== item) {
          qs('.faq-trigger', other).setAttribute('aria-expanded', 'false');
          qs('.faq-body', other).classList.remove('is-open');
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      faqBody.classList.toggle('is-open', !isOpen);
    });
  });

  /* ── 10. NAVBAR SCROLL STYLE ── */
  const topbar = qs('.topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        topbar.style.boxShadow = '0 4px 32px rgba(15,23,32,0.1)';
        topbar.style.borderBottomColor = 'rgba(15,23,32,0.1)';
      } else {
        topbar.style.boxShadow = '';
        topbar.style.borderBottomColor = '';
      }
    }, { passive: true });
  }

  /* ── 11. STAGGERED CARD ANIMATION ── */
  if ('IntersectionObserver' in window && !reduced) {
    const gridContainers = qsa('.app-grid, .services-grid, .values-grid, .metrics-grid, .faq-grid, .app-showcase, .process-steps');
    const gridObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = qsa(':scope > *', entry.target);
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, i * 80);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    gridContainers.forEach(container => {
      const cards = qsa(':scope > *', container);
      if (cards.length) {
        cards.forEach(c => {
          c.style.opacity = '0';
          c.style.transform = 'translateY(28px) scale(0.98)';
          c.style.transition = 'opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1)';
        });
        gridObserver.observe(container);
      }
    });
  }

  /* ── 12. PARALLAX ── */
  const parallaxNode = qs('[data-parallax]');
  if (parallaxNode && !reduced) {
    const updateParallax = () => {
      const rect = parallaxNode.getBoundingClientRect();
      const shift = rect.top * -0.04;
      parallaxNode.style.transform = `translate3d(0,${shift}px,0) scale(1.04)`;
    };
    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  /* ── 13. HERO ORB MOUSE PARALLAX ── */
  const heroOrbs = qsa('.hero-bg-orbs .orb');
  if (heroOrbs.length && !reduced) {
    document.addEventListener('mousemove', e => {
      const xRatio = (e.clientX / window.innerWidth - 0.5);
      const yRatio = (e.clientY / window.innerHeight - 0.5);
      heroOrbs.forEach((orb, i) => {
        const depth = (i + 1) * 18;
        orb.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
      });
    }, { passive: true });
  }

  /* ── 14. CARD TILT EFFECT (desktop) ── */
  if (!reduced && window.innerWidth > 820) {
    qsa('.card, .service-card, .value-card, .app-showcase-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const maxTilt = 6;
        card.style.transform = `perspective(600px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateY(-4px) scale(1.01)`;
        card.style.transition = 'transform 100ms ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
      });
    });
  }

  /* ── 15. MARQUEE DUPLICATE ── */
  qsa('.marquee-track, .tech-ribbon-track').forEach(track => {
    if (!track.dataset.duplicated) {
      track.innerHTML += track.innerHTML;
      track.dataset.duplicated = '1';
    }
  });

  /* ── 16. SCROLL ANCHOR SMOOTH ── */
  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
  });

  /* ── 17. FLOATING BADGE ANIMATION ── */
  qsa('.float-badge, .overlay-badge, .floating-note, .mini-chip').forEach((el, i) => {
    if (!el.style.animationDelay) {
      el.style.animationDelay = `${i * 0.5}s`;
    }
  });

})();
