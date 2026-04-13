/**
 * components.js
 * Carrega automaticamente o header e footer em todas as páginas.
 * Basta incluir este script e ter <div id="header"></div> e <div id="footer"></div> no HTML.
 */

// Detecta o caminho base (útil para páginas dentro de subpastas)
function getBasePath() {
  const depth = window.location.pathname.split('/').length - 2;
  return depth > 0 ? '../'.repeat(depth) : './';
}

async function loadComponent(elementId, filePath) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Erro ao carregar ${filePath}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

async function initComponents() {
  const base = getBasePath();

  await Promise.all([
    loadComponent('header', `${base}components/header.html`),
    loadComponent('footer', `${base}components/footer.html`),
  ]);

  // ── Nav: sombra ao fazer scroll ──
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ── Nav: marca o link activo ──
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href.replace(/^\//, '').split('#')[0])) {
      link.classList.add('active');
    }
  });

  // ── Reveal on scroll ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initComponents);
