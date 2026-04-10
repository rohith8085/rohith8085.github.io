/* ==============================
   NAVBAR SCROLL
============================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ==============================
   HAMBURGER MENU
============================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ==============================
   TYPING EFFECT
============================== */
const roles = [
  'QA Engineer',
  'Automation Tester',
  'API Testing Expert',
  'Prompt Engineer',
  'SDET Specialist',
  'AI-Powered Tester'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typing');

function type() {
  const current = roles[roleIdx];
  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { isDeleting = true; setTimeout(type, 1800); return; }
  } else {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(type, isDeleting ? 55 : 85);
}
type();

/* ==============================
   PARTICLE CANVAS
============================== */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

let mouseX = -9999, mouseY = -9999;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x      = Math.random() * canvas.width;
    this.y      = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
    this.size   = Math.random() * 1.6 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.speedY = (Math.random() - 0.5) * 0.45;
    this.alpha  = Math.random() * 0.45 + 0.08;
    this.color  = Math.random() > 0.55 ? '250,204,21' : Math.random() > 0.5 ? '167,139,250' : '94,234,212';
  }
  update() {
    const dx = mouseX - this.x, dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x -= (dx / dist) * 0.8;
      this.y -= (dy / dist) * 0.8;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(140, Math.floor(canvas.width * canvas.height / 7000));
  particles = Array.from({ length: count }, () => new Particle());
}
initParticles();

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 95) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(167,139,250,${(1 - d / 95) * 0.07})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==============================
   SCROLL REVEAL (IntersectionObserver)
============================== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ==============================
   SKILL BAR ANIMATION
============================== */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(el => barObs.observe(el));

/* ==============================
   ACTIVE NAV HIGHLIGHT
============================== */
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navItems.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObs.observe(s));

/* ==============================
   INTEGRATION PARTNER TABS
============================== */
document.querySelectorAll('.itab').forEach(tab => {
  tab.addEventListener('click', () => {
    const parent = tab.closest('.integration-mini');
    const key    = tab.dataset.tab;

    parent.querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    parent.querySelectorAll('.integration-panel').forEach(p => p.classList.add('hidden'));
    const panel = document.getElementById(`tab-${key}`);
    if (panel) panel.classList.remove('hidden');
  });
});

/* ==============================
   PROJECT CARD 3D TILT
============================== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ==============================
   STAT COUNTER ANIMATION
============================== */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const isFloat = String(target).includes('.');
  const step = isFloat ? 0.1 : 1;
  const duration = 1400;
  const stepTime = Math.floor(duration / (target / step));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = isFloat ? start.toFixed(1) + suffix : Math.floor(start) + suffix;
  }, stepTime);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const raw     = n.textContent;
        const suffix  = raw.replace(/[\d.]/g, '');
        const val     = parseFloat(raw);
        if (!isNaN(val)) animateCounter(n, val, suffix);
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObs.observe(heroStats);

/* ==============================
   CONTACT FORM
============================== */
const form      = document.getElementById('contact-form');
const formMsg   = document.getElementById('form-msg');
const submitBtn = document.getElementById('submit-btn');
const btnText   = document.getElementById('btn-text');

form.addEventListener('submit', e => {
  e.preventDefault();
  btnText.textContent = 'Sending…';
  submitBtn.disabled  = true;
  submitBtn.style.opacity = '0.7';

  // Replace this with your backend (EmailJS, Formspree, etc.)
  setTimeout(() => {
    formMsg.textContent     = '✅ Message sent! I\'ll reply within 24 hours.';
    formMsg.style.color     = '#22c55e';
    btnText.textContent     = 'Send Message ✉️';
    submitBtn.disabled      = false;
    submitBtn.style.opacity = '1';
    form.reset();
    setTimeout(() => { formMsg.textContent = ''; }, 6000);
  }, 1500);
});

/* ==============================
   SMOOTH SCROLL UTILITY
============================== */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
