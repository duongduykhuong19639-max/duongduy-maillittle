const body = document.body;
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const yearNode = document.querySelector('[data-year]');
const revealNodes = document.querySelectorAll('[data-reveal]');
const parallaxNode = document.querySelector('[data-parallax]');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('is-open');
    body.classList.toggle('menu-open');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      body.classList.remove('menu-open');
    });
  });
}

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if ('IntersectionObserver' in window && revealNodes.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealNodes.forEach((node) => {
    node.classList.add('reveal');
    observer.observe(node);
  });
} else {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
}

if (parallaxNode && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const updateParallax = () => {
    const rect = parallaxNode.getBoundingClientRect();
    const shift = rect.top * -0.04;
    parallaxNode.style.transform = `translate3d(0, ${shift}px, 0) scale(1.04)`;
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-nav-link]').forEach((link) => {
  const href = link.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
