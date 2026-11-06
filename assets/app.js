// Navegación: fondo al hacer scroll y menú móvil
const nav = document.querySelector('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const burger = document.querySelector('.burger'), links = document.querySelector('.links');
burger?.addEventListener('click', () => links.classList.toggle('open'));
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Aparición al hacer scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// Flujo animado del hero
const steps = [...document.querySelectorAll('.flow .step')];
const counter = document.getElementById('flow-count');
let i = 0, total = 127;
function tick() {
  if (!steps.length) return;
  if (i === 0) steps.forEach(s => s.classList.remove('on', 'done'));
  steps[i].classList.add('on');
  if (i > 0) { steps[i - 1].classList.remove('on'); steps[i - 1].classList.add('done'); }
  i++;
  if (i === steps.length) {
    const last = steps[steps.length - 1];
    setTimeout(() => { last.classList.remove('on'); last.classList.add('done');
      total++; if (counter) counter.textContent = total; }, 900);
    i = 0; setTimeout(tick, 2600);
  } else setTimeout(tick, 1100);
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(tick, 600);
else steps.forEach(s => s.classList.add('done'));

// Calculadora de horas
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('es-ES');
function calc() {
  const p = +$('c-personas').value, h = +$('c-horas').value, c = +$('c-coste').value;
  $('o-personas').textContent = p; $('o-horas').textContent = h + ' h'; $('o-coste').textContent = c + ' €';
  const auto = 0.6; // supuesto: se automatiza el 60 % de las tareas repetitivas
  const horasMes = p * h * auto * 4.33;
  const euros = horasMes * c * 12;
  $('r-horas').textContent = fmt(horasMes);
  $('r-euros').textContent = fmt(euros) + ' €';
  $('r-dias').textContent = fmt(horasMes / 8);
  $('r-semana').textContent = fmt(h * auto) + ' h';
}
['c-personas', 'c-horas', 'c-coste'].forEach(id => $(id)?.addEventListener('input', calc));
if ($('c-personas')) calc();

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
