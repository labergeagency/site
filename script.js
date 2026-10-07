(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Email links (built at runtime so the address isn't scraped) ---------- */
  $$('a.email-link').forEach((a) => {
    const addr = `${a.dataset.u}@${a.dataset.d}`;
    a.href = `mailto:${addr}`;
    if (a.textContent.includes('[at]')) a.textContent = addr;
  });

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const burger = $('#hamburger');
  const menu = $('#mobile-menu');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Hero slideshow (lazy-loads later slides, pauses when hidden) ---------- */
  const slides = $$('.hero-slide');
  let current = 0;
  let timer;
  const show = (i) => {
    const next = slides[i];
    if (next.dataset.bg) {
      next.style.backgroundImage = `url('${next.dataset.bg}')`;
      delete next.dataset.bg;
    }
    slides[current].classList.remove('active');
    next.classList.add('active');
    current = i;
  };
  const start = () => {
    if (reduceMotion || slides.length < 2) return;
    timer = setInterval(() => show((current + 1) % slides.length), 5000);
  };
  document.addEventListener('visibilitychange', () => {
    clearInterval(timer);
    if (!document.hidden) start();
  });
  start();

  /* ---------- Scroll reveal ---------- */
  const reveal = $$('.fade-up');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Language toggle (data-es attributes hold the Spanish copy) ---------- */
  const translatable = $$('[data-es]');
  translatable.forEach((el) => { el.dataset.en = el.innerHTML; });
  const langButtons = $$('.lang-toggle [data-lang]');
  const setLang = (lang) => {
    translatable.forEach((el) => { el.innerHTML = lang === 'es' ? el.dataset.es : el.dataset.en; });
    // Re-run email setup for any translated link that was re-rendered
    $$('a.email-link').forEach((a) => { a.href = `mailto:${a.dataset.u}@${a.dataset.d}`; });
    document.documentElement.lang = lang;
    langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    store.set('lb-lang', lang);
  };
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  if (store.get('lb-lang') === 'es') setLang('es');

  /* ---------- Chat widget ---------- */
  const WORKER = 'https://laberge-ai.labergeagency.workers.dev/';
  const FALLBACK = 'Please call us at (253) 661-2000 and we will be glad to help!';
  const panel = $('#chat-panel');
  const toggle = $('#chat-btn');
  const intro = $('#chat-intro');
  const session = $('#chat-session');
  const log = $('#chat-log');
  const input = $('#chat-input');
  const sendBtn = $('#chat-send');
  const nameInput = $('#chat-name');
  const history = [];
  let busy = false;

  const setChat = (open) => {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open) (session.classList.contains('open') ? input : nameInput).focus();
    else toggle.focus();
  };
  toggle.addEventListener('click', () => setChat(!panel.classList.contains('open')));
  $('#chat-close').addEventListener('click', () => setChat(false));
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') setChat(false); });

  const addMsg = (type, text) => {
    const el = document.createElement('div');
    el.className = `chat-msg ${type}`;
    el.textContent = text; // textContent: never render model output as HTML
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  };

  intro.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    nameInput.setAttribute('aria-invalid', String(!name));
    if (!name) { nameInput.focus(); return; }
    intro.style.display = 'none';
    session.classList.add('open');
    addMsg('bot', `Hi ${name}! I'm the LaBerge Agency assistant. I can answer questions about auto, home, life, and business insurance. What can I help you with today?`);
    input.focus();
  });

  const send = async () => {
    const text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    sendBtn.disabled = true;
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    const typing = addMsg('typing', 'Typing…');

    let reply = FALLBACK;
    try {
      const res = await fetch(WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: AbortSignal.timeout(30000),
      });
      if (res.ok) {
        const data = await res.json();
        reply = data?.choices?.[0]?.message?.content || FALLBACK;
      }
    } catch { /* network error or timeout: use fallback */ }

    typing.remove();
    history.push({ role: 'assistant', content: reply });
    addMsg('bot', reply);
    busy = false;
    sendBtn.disabled = false;
    input.focus();
  };

  $('#chat-form').addEventListener('submit', (e) => { e.preventDefault(); send(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
})();
