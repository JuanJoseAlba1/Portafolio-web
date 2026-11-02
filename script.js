'use strict';

const STORAGE_KEYS = { theme: 'theme', lang: 'lang', cookies: 'cookie-consent' };

const translations = {
  es: {
    nav_home: 'Inicio', nav_about: 'Sobre mí', nav_skills: 'Habilidades', nav_projects: 'Proyectos', nav_contact: 'Contactar',
    hero_title: 'Ingeniero de Software | Automatización con IA',
    hero_desc: 'Combino visión técnica, optimización de procesos e inteligencia artificial para crear soluciones de alto impacto. Ingeniero de Sistemas con experiencia gerencial, listo para automatizar lo que hoy consume tu tiempo.',
    stat_1: 'Reducción en tiempos de ejecución de procesos', stat_2: 'Integrantes en equipos coordinados',
    stat_3: 'Incremento en la rentabilidad operativa', stat_4: 'Años de experiencia en proyectos e ingeniería',
    about_title: 'Sobre mí',
    about_p1: 'Soy Ingeniero de Sistemas con experiencia gerencial y estudiante del Máster en Organización Industrial. Me enfoco en resolver problemas reales con inteligencia artificial, análisis de datos y optimización de procesos.',
    about_p2: 'Diseño automatizaciones que reducen tiempos, liberan equipos de tareas repetitivas y convierten los datos en decisiones medibles.',
    skills_title: 'Habilidades', skills_1: 'Automatización, IA & Cloud', skills_2: 'Software & Datos', skills_3: 'Gestión & Agilidad',
    sk_risk: 'Gestión de Riesgos', sk_opt: 'Optimización de Procesos',
    projects_title: 'Proyectos', project_next: 'Próximo proyecto',
    contact_title: 'Contacto', f_name: 'Nombre', f_email: 'Correo electrónico', f_msg: 'Mensaje', f_send: 'Enviar mensaje',
    f_error: 'Completa todos los campos con un correo válido.', f_ok: 'Mensaje listo. Se abrirá tu cliente de correo.',
    cookies_text: 'Usamos almacenamiento local para recordar tus preferencias (tema e idioma).',
    cookies_config: 'Configurar', cookies_accept: 'Aceptar'
  },
  en: {
    nav_home: 'Home', nav_about: 'About', nav_skills: 'Skills', nav_projects: 'Projects', nav_contact: 'Contact me',
    hero_title: 'Software Engineer | AI Automation',
    hero_desc: 'I combine technical vision, process optimization and artificial intelligence to build high-impact solutions. A Systems Engineer with management experience, ready to automate what drains your time today.',
    stat_1: 'Reduction in process execution time', stat_2: 'Team members coordinated',
    stat_3: 'Increase in operating profitability', stat_4: 'Years of experience in projects and engineering',
    about_title: 'About me',
    about_p1: "I'm a Systems Engineer with management experience and a student of the Master's in Industrial Organization. I focus on solving real problems with artificial intelligence, data analysis and process optimization.",
    about_p2: 'I design automations that cut execution time, free teams from repetitive tasks and turn data into measurable decisions.',
    skills_title: 'Skills', skills_1: 'Automation, AI & Cloud', skills_2: 'Software & Data', skills_3: 'Management & Agility',
    sk_risk: 'Risk Management', sk_opt: 'Process Optimization',
    projects_title: 'Projects', project_next: 'Next project',
    contact_title: 'Contact', f_name: 'Name', f_email: 'Email', f_msg: 'Message', f_send: 'Send message',
    f_error: 'Fill in every field with a valid email.', f_ok: 'Message ready. Your email client will open.',
    cookies_text: 'We use local storage to remember your preferences (theme and language).',
    cookies_config: 'Settings', cookies_accept: 'Accept'
  }
};

const $ = (selector) => document.querySelector(selector);
const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } };

let currentLang = 'es';

/* ---------- i18n ---------- */
function applyLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = translations[lang][el.dataset.i18n] ?? el.textContent;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = translations[lang][el.dataset.i18nPlaceholder] ?? el.placeholder;
  });
  $('#lang-toggle').textContent = lang.toUpperCase();
  write(STORAGE_KEYS.lang, lang);
}

/* ---------- Theme ---------- */
function applyTheme(isLight) {
  document.body.classList.toggle('light-mode', isLight);
  write(STORAGE_KEYS.theme, isLight ? 'light' : 'dark');
}

/* ---------- Cookie banner ---------- */
function initCookieBanner() {
  const banner = $('#cookie-banner');
  if (read(STORAGE_KEYS.cookies)) return;
  banner.hidden = false;
  const choose = (value) => { write(STORAGE_KEYS.cookies, value); banner.hidden = true; };
  $('#cookie-accept').addEventListener('click', () => choose('accepted'));
  // "Configure" keeps only essential storage (no optional cookies are used on this site)
  $('#cookie-config').addEventListener('click', () => choose('essential'));
}

/* ---------- Hero typing effect ---------- */
function initTyping() {
  const target = $('#typed');
  const text = 'workflow.run();';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { target.textContent = text; return; }
  let index = 0;
  const tick = () => {
    target.textContent = text.slice(0, ++index);
    if (index < text.length) setTimeout(tick, 110);
  };
  setTimeout(tick, 600);
}

/* ---------- Contact form (opens mailto; no backend required) ---------- */
function initContactForm() {
  const form = $('#contact-form');
  const status = $('#form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { name, email, message } = Object.fromEntries(new FormData(form));
    const isValid = name.trim() && message.trim() && /^\S+@\S+\.\S+$/.test(email);
    if (!isValid) { status.textContent = translations[currentLang].f_error; return; }
    status.textContent = translations[currentLang].f_ok;
    const body = encodeURIComponent(`${message}\n\n${name} <${email}>`);
    window.location.href = `mailto:jj.albaarango@gmail.com?subject=Portfolio%20contact&body=${body}`;
    form.reset();
  });
}

/* ---------- Mobile menu ---------- */
function initMenu() {
  const nav = $('#nav');
  $('#menu-toggle').addEventListener('click', () => nav.classList.toggle('open'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) nav.classList.remove('open'); });
}

function init() {
  applyTheme(read(STORAGE_KEYS.theme) === 'light');
  applyLanguage(read(STORAGE_KEYS.lang) || 'es');
  $('#theme-toggle').addEventListener('click', () => applyTheme(!document.body.classList.contains('light-mode')));
  $('#lang-toggle').addEventListener('click', () => applyLanguage(currentLang === 'es' ? 'en' : 'es'));
  $('#year').textContent = new Date().getFullYear();
  initCookieBanner(); initTyping(); initContactForm(); initMenu();
}

document.addEventListener('DOMContentLoaded', init);
