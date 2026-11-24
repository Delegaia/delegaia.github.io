// Black Friday: cuenta atrás hasta el cierre y botones que preseleccionan la oferta
const fin = new Date('2026-12-01T23:59:59+01:00').getTime();
const pad = n => String(n).padStart(2, '0');
function tickBF() {
  const ms = fin - Date.now();
  if (ms <= 0) { document.body.classList.add('is-closed'); return; }
  const s = Math.floor(ms / 1000);
  document.getElementById('cd-d').textContent = Math.floor(s / 86400);
  document.getElementById('cd-h').textContent = pad(Math.floor(s / 3600) % 24);
  document.getElementById('cd-m').textContent = pad(Math.floor(s / 60) % 60);
  document.getElementById('cd-s').textContent = pad(s % 60);
  setTimeout(tickBF, 1000);
}
tickBF();

const sel = document.getElementById('oferta');
document.querySelectorAll('[data-oferta]').forEach(a => a.addEventListener('click', () => { if (sel) sel.value = a.dataset.oferta; }));
