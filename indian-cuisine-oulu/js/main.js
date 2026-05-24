(function () {
  'use strict';

  // ============================================
  // Mobile sidebar nav
  // ============================================
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebarClose = document.querySelector('.sidebar-close');
  const sidebarLinks = document.querySelectorAll('.sidebar-links a');

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    sidebarLinks.forEach(link => link.addEventListener('click', closeSidebar));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });
  }

  // ============================================
  // FAQ accordion
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ============================================
  // Logo micro-interaction (subtle hover float)
  // ============================================
  const logo = document.querySelector('.nav-logo img');
  if (logo) {
    let raf;
    logo.addEventListener('mousemove', (e) => {
      const rect = logo.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        logo.style.transform = `translate(${dx * 4}px, ${dy * 4 - 2}px)`;
      });
    });
    logo.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      logo.style.transform = '';
    });
  }

  // ============================================
  // Contact form (catering inquiry) — local submit, no backend
  // ============================================
  const form = document.querySelector('.contact-form');
  const formMsg = document.querySelector('.form-message');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const name = encodeURIComponent(data.get('name') || '');
      const type = encodeURIComponent(data.get('type') || '');
      const date = encodeURIComponent(data.get('date') || '');
      const guests = encodeURIComponent(data.get('guests') || '');
      const message = encodeURIComponent(data.get('message') || '');
      const phone = encodeURIComponent(data.get('phone') || '');
      const subject = `Tiedustelu: ${decodeURIComponent(type)} - ${decodeURIComponent(name)}`;
      const body =
        `Nimi: ${decodeURIComponent(name)}%0D%0A` +
        `Puhelin: ${decodeURIComponent(phone)}%0D%0A` +
        `Tilaisuuden tyyppi: ${decodeURIComponent(type)}%0D%0A` +
        `Päivämäärä: ${decodeURIComponent(date)}%0D%0A` +
        `Henkilömäärä: ${decodeURIComponent(guests)}%0D%0A%0D%0A` +
        `${decodeURIComponent(message)}`;
      window.location.href = `mailto:oulu@indiancuisine.fi?subject=${encodeURIComponent(subject)}&body=${body}`;
      if (formMsg) {
        formMsg.textContent = 'Kiitos! Sähköpostiohjelmasi avautuu hetken kuluttua.';
        formMsg.classList.add('success');
      }
    });
  }

  // ============================================
  // Scroll reveal
  // ============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealSelectors = [
      '.section-head',
      '.offering-card',
      '.review-card',
      '.story-text',
      '.story-image',
      '.wine-text',
      '.wine-image',
      '.value-card',
      '.faq-item',
      '.reviews-summary',
      '.cta-banner h2',
      '.cta-banner p',
      '.cta-banner .cta-buttons'
    ];
    const revealEls = document.querySelectorAll(revealSelectors.join(','));
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      // stagger items in a row
      const parent = el.parentElement;
      if (parent && (parent.classList.contains('offerings-grid') ||
                     parent.classList.contains('reviews-grid') ||
                     parent.classList.contains('values-grid'))) {
        const idx = Array.from(parent.children).indexOf(el);
        if (idx > 0 && idx <= 3) el.classList.add('reveal-delay-' + idx);
      }
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => obs.observe(el));
  }

  // ============================================
  // Mark active nav link
  // ============================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .sidebar-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

})();
