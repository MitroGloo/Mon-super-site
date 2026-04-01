/* ═══════════════════════════════════════
   PORTFOLIO ALB — main.js
   ═══════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────
   1. CANVAS BACKGROUND — Particules bleues légères
────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const PARTICLE_COUNT = 55;
  const CONNECTION_DIST = 140;
  const COLORS = ['#0071e3', '#34aadc', '#5ac8fa', '#007aff'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.2 + 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 113, 227, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => { resize(); createParticles(); });
})();


/* ──────────────────────────────────────
   2. HEADER — Scroll effect
────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();


/* ──────────────────────────────────────
   3. NAV MOBILE — Toggle menu
────────────────────────────────────── */
(function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────
   4. SCROLL REVEAL — Intersection Observer
────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Barres de compétences (si jamais réintégrées)
        entry.target.querySelectorAll('.skill-fill').forEach(fill => {
          setTimeout(() => { fill.style.width = (fill.dataset.width || 0) + '%'; }, 200);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────
   5. SMOOTH SCROLL — Ancres internes
────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ──────────────────────────────────────
   6. PARALLAX HERO NUMBER
────────────────────────────────────── */
(function initParallax() {
  const heroNum = document.querySelector('.hero-number');
  if (!heroNum) return;
  window.addEventListener('scroll', () => {
    heroNum.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });
})();


/* ──────────────────────────────────────
   7. ACTIVE NAV LINK — au scroll
────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--text-primary)' : '';
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ──────────────────────────────────────
   8. TILT LÉGER sur les cartes
────────────────────────────────────── */
(function initCardTilt() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  document.querySelectorAll('.project-card, .value-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(900px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-5px) scale(1.005)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.35s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease';
    });
  });
})();
