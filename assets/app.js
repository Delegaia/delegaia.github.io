// ===== Delegaia · animaciones del tema «horizonte» =====
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('es-ES');

// Navegación: fondo al hacer scroll y menú móvil
const nav = document.querySelector('nav');
const burger = document.querySelector('.burger'), links = document.querySelector('.links');
burger?.addEventListener('click', () => links.classList.toggle('open'));
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Estrellas del cielo
const sky = document.querySelector('.stars');
if (sky) for (let k = 0; k < 46; k++) {
  const s = document.createElement('i');
  s.style.left = Math.random() * 100 + '%'; s.style.top = Math.random() * 62 + '%';
  s.style.animationDelay = (Math.random() * 5).toFixed(2) + 's'; s.style.animationDuration = (3 + Math.random() * 4).toFixed(2) + 's';
  sky.appendChild(s);
}

// El «sol»: el borde del horizonte brilla más donde está el ratón
const hz = document.querySelector('.horizon'), hero = document.querySelector('.hero');
if (hz && hero && !reduce) {
  let tx = 50, cx = 50, tg = .55, cg = .55;
  hero.addEventListener('pointermove', e => {
    const r = hz.getBoundingClientRect();
    tx = Math.max(15, Math.min(85, (e.clientX - r.left) / r.width * 100));
    // más cerca del horizonte = más brillo
    const d = Math.abs(e.clientY - (r.top + 150));
    tg = .55 + .55 * Math.max(0, 1 - d / 520);
  });
  hero.addEventListener('pointerleave', () => { tx = 50; tg = .55 });
  (function loop() {
    cx += (tx - cx) * .2; cg += (tg - cg) * .15;
    hz.style.setProperty('--mx', cx.toFixed(2) + '%'); hz.style.setProperty('--glow', cg.toFixed(3));
    requestAnimationFrame(loop);
  })();
}

// Tarjetas: foco de luz que sigue al ratón
document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px');
}));

// Contadores que suben
function countUp(el) {
  const to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
  if (reduce) return;
  const t0 = performance.now(), dur = 1400;
  (function f(t) { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + fmt(to * e) + suf; if (p < 1) requestAnimationFrame(f); })(t0);
}

// Gráficos de barras
function bars(el, vals, hi) {
  if (!el.children.length) vals.forEach(() => el.appendChild(document.createElement('i')));
  const max = Math.max(...vals) || 1;
  [...el.children].forEach((b, k) => { b.style.height = (vals[k] / max * 100) + '%'; b.classList.toggle('hl', hi(k)); });
}
const pchart = $('pchart');
const pvals = [38, 52, 47, 66, 58, 81, 74, 69, 88, 96, 112, 104];

// Aparición al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('in'); io.unobserve(el);
  el.querySelectorAll('[data-count]').forEach(countUp);
  if (el === panel && pchart) setTimeout(() => bars(pchart, pvals, k => k % 3 === 2 || k === 10), 250);
  if (el.id === 'tasks') runTasks();
  if (el.id === 'chat') runChat();
}), { threshold: .18 });
const panel = document.querySelector('.panel');
document.querySelectorAll('.rv, .panel, #tasks, #chat').forEach(el => io.observe(el));
if (reduce && pchart) bars(pchart, pvals, k => k % 3 === 2 || k === 10);

// Scroll: panel que se endereza, barra de navegación y línea del proceso
const stepsEl = $('steps');
function onScroll() {
  nav.classList.toggle('scrolled', scrollY > 10);
  if (panel && !reduce) {
    const r = panel.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh - r.top) / (vh * .75)));
    panel.style.setProperty('--rx', (22 * (1 - p)).toFixed(2) + 'deg');
    panel.style.setProperty('--sc', (.92 + .08 * p).toFixed(3));
  }
  if (stepsEl) {
    const r = stepsEl.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / (r.height + innerHeight * .3)));
    stepsEl.style.setProperty('--prog', (reduce ? 100 : p * 100) + '%');
  }
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Flujo animado del panel
const steps = [...document.querySelectorAll('.flow .step')];
let si = 0;
function tick() {
  if (!steps.length) return;
  if (si === 0) steps.forEach(s => s.classList.remove('on', 'done'));
  steps[si].classList.add('on');
  if (si > 0) { steps[si - 1].classList.remove('on'); steps[si - 1].classList.add('done'); }
  si++;
  if (si === steps.length) {
    const last = steps[steps.length - 1];
    setTimeout(() => { last.classList.remove('on'); last.classList.add('done'); }, 900);
    si = 0; setTimeout(tick, 2800);
  } else setTimeout(tick, 1100);
}
if (!reduce) setTimeout(tick, 900); else steps.forEach(s => s.classList.add('done'));

// Mini chat del Asistente 24/7
let chatOn = false;
function runChat() {
  const chat = $('chat'); if (!chat || chatOn) return; chatOn = true;
  const msgs = [...chat.querySelectorAll('.m')], typing = chat.querySelector('.typing');
  if (reduce) { msgs.forEach(m => m.classList.add('show')); return; }
  const play = () => {
    msgs.forEach(m => m.classList.remove('show'));
    let t = 300;
    msgs.forEach(m => {
      const isA = m.classList.contains('a');
      if (isA) { setTimeout(() => { typing.classList.add('show'); chat.appendChild(typing); }, t); t += 1100; }
      setTimeout(() => { typing.classList.remove('show'); m.classList.add('show'); }, t);
      t += isA ? 1500 : 1000;
    });
    setTimeout(play, t + 3500);
  };
  play();
}

// Lista de tareas que se completan solas
function runTasks() {
  const items = [...document.querySelectorAll('#tasks div')];
  if (reduce) { items.forEach(d => d.classList.add('done')); return; }
  const cycle = () => {
    items.forEach(d => d.classList.remove('done'));
    items.forEach((d, k) => setTimeout(() => d.classList.add('done'), 700 + k * 900));
    setTimeout(cycle, 700 + items.length * 900 + 3000);
  };
  cycle();
}

// Pestañas IA / Marketing con píldora deslizante
const tabs = [...document.querySelectorAll('.tabs [role=tab]')], pill = document.querySelector('.tabs .pillbg');
function placePill(b) { if (pill && b) { pill.style.width = b.offsetWidth + 'px'; pill.style.transform = `translateX(${b.offsetLeft}px)`; } }
tabs.forEach(b => b.addEventListener('click', () => {
  tabs.forEach(o => { const on = o === b; o.setAttribute('aria-selected', on); o.tabIndex = on ? 0 : -1;
    const p = $(o.getAttribute('aria-controls')); p.hidden = !on; p.classList.toggle('show', on); });
  placePill(b);
}));
document.querySelector('.tabs')?.addEventListener('keydown', e => {
  if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const k = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const n = tabs[(k + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.click(); n.focus();
});
// enlaces del menú antiguos (#marketing) abren su pestaña
if (location.hash === '#marketing') tabs[1]?.click();
document.querySelectorAll('a[href="#marketing"]').forEach(a => a.addEventListener('click', () => tabs[1]?.click()));
addEventListener('load', () => placePill(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
addEventListener('resize', () => placePill(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
placePill(tabs[0]);

// Calculadora de horas con gráfico acumulado
const cchart = $('cchart');
function paint(i) { i.style.setProperty('--p', ((i.value - i.min) / (i.max - i.min) * 100) + '%'); }
function calc() {
  const p = +$('c-personas').value, h = +$('c-horas').value, c = +$('c-coste').value;
  $('o-personas').textContent = p; $('o-horas').textContent = h + ' h'; $('o-coste').textContent = c + ' €';
  const auto = 0.6; // supuesto: se automatiza el 60 % de las tareas repetitivas
  const horasMes = p * h * auto * 4.33;
  $('r-horas').textContent = fmt(horasMes);
  $('r-euros').textContent = fmt(horasMes * c * 12) + ' €';
  $('r-dias').textContent = fmt(horasMes / 8);
  $('r-semana').textContent = fmt(h * auto) + ' h';
  // barras: horas acumuladas mes a mes, escaladas al máximo posible (50 personas × 20 h)
  if (cchart) {
    if (!cchart.children.length) for (let k = 0; k < 12; k++) cchart.appendChild(document.createElement('i'));
    const ratio = Math.min(1, horasMes / 600);
    [...cchart.children].forEach((b, k) => { b.style.height = ((k + 1) / 12 * (35 + 65 * ratio)) + '%'; b.classList.toggle('hl', k === 11 || k === 5); });
  }
  ['c-personas', 'c-horas', 'c-coste'].forEach(id => paint($(id)));
}
['c-personas', 'c-horas', 'c-coste'].forEach(id => $(id)?.addEventListener('input', calc));
if ($('c-personas')) calc();

$('year') && ($('year').textContent = new Date().getFullYear());

// Formulario de diagnóstico: envío con respaldo si el servicio falla
const form = document.getElementById('dform');
if (form) form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form.botcheck?.checked) return;
  const btn = document.getElementById('dsend'), fail = document.getElementById('dfail');
  const fd = new FormData(form), data = Object.fromEntries(fd);
  btn.disabled = true; btn.textContent = 'Enviando…'; fail.hidden = true;
  try {
    // FormData = petición "simple" (sin preflight CORS), la más compatible
    const r = await fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || j.success === false) throw new Error(j.message || ('HTTP ' + r.status));
    location.href = '/gracias.html';
  } catch (err) {
    const campos = [['Nombre', 'Nombre'], ['Empresa', 'Empresa'], ['Email', 'email'], ['Teléfono', 'Telefono'], ['Sector', 'Sector'], ['Tamaño', 'Tamano'],
      ['Situación', 'Situacion'], ['Objetivo', 'Objetivo'], ['Herramientas', 'Herramientas'], ['Urgencia', 'Urgencia']];
    const cuerpo = campos.map(([l, k]) => `${l}: ${data[k] || '-'}`).join('\n');
    const asunto = 'Diagnóstico gratuito · ' + (data.Empresa || '');
    document.getElementById('dtext').value = cuerpo;
    document.getElementById('dmail').href = 'mailto:alejandro@delegaia.es?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    document.getElementById('dgmail').href = 'https://mail.google.com/mail/?view=cm&to=alejandro@delegaia.es&su=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    document.getElementById('derr').textContent = 'Detalle técnico: ' + (err.message || err);
    fail.hidden = false; btn.disabled = false; btn.textContent = 'Reintentar envío →';
  }
});
document.getElementById('dcopy')?.addEventListener('click', async () => {
  const t = document.getElementById('dtext'), b = document.getElementById('dcopy');
  try { await navigator.clipboard.writeText(t.value); } catch { t.select(); document.execCommand('copy'); }
  b.textContent = '✓ Copiado'; setTimeout(() => b.textContent = '📋 Copiar texto', 2000);
});
