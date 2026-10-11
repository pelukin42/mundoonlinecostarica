/* Mundo Online Costa Rica · imágenes, catálogo y pedido por WhatsApp (pago con tarjeta opcional, fase 2) */
(() => {
'use strict';
const C = window.MO_CONFIG || {};
const IMG = window.MO_IMAGES || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '₡' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};
const waNumber = (C.whatsapp || '').replace(/\D/g, '');
const waHref = (msg = '') => waNumber
  ? `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
  : `https://ig.me/m/${C.instagram || 'mundoonlinecostarica'}`; // respaldo mientras no haya número
const ICON = { relojes: 'watch', tecnologia: 'laptop', hogar: 'home', electro: 'washer', colchones: 'bed' };
const GRAD = {
  relojes: 'linear-gradient(150deg,#0d2b45,#14b8a6)', tecnologia: 'linear-gradient(150deg,#0d2b45,#14b8a6)',
  hogar: 'linear-gradient(150deg,#14385a,#ff6b4a)', electro: 'linear-gradient(150deg,#0b7a6e,#0d2b45)', colchones: 'linear-gradient(150deg,#ff6b4a,#0d2b45)'
};
const SOON_IMG = { tecnologia: 'stock-tecnologia-2', hogar: 'stock-hogar-2', electro: 'stock-electro-2', colchones: 'stock-colchones-2' };
const svg = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
const cardOn = !!(C.payments && (C.payments.onvo || C.payments.tilopay)); // fase 2: cobro con tarjeta

let toastT;
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); };
const lockScroll = () => { document.body.style.overflow = $('.drawer.on, .modal.on, #lb.open') ? 'hidden' : ''; };

/* ---------- Imágenes responsivas (registro generado por tools/build-images.py) ---------- */
const pickW = (n, w) => IMG[n].v.find(x => x >= w) || IMG[n].v[IMG[n].v.length - 1];
const srcOf = (n, w) => `assets/img/${n}-${pickW(n, w)}.webp`;
const srcsetOf = n => IMG[n].v.map(w => `assets/img/${n}-${w}.webp ${w}w`).join(', ');
const imgTag = (n, sizes, cls = '') => IMG[n]
  ? `<img class="${cls}" data-img="${n}" data-sizes="${sizes}" src="${srcOf(n, 480)}" alt="${esc(IMG[n].alt)}">` : '';
function hydrate(root = document) {
  $$('img[data-img]:not([data-h])', root).forEach(img => {
    const n = img.dataset.img, m = IMG[n]; img.dataset.h = 1;
    const done = () => img.classList.add('ld');
    if (!m) return done();
    img.srcset = srcsetOf(n); img.sizes = img.dataset.sizes || '100vw'; img.width = m.w; img.height = m.h;
    img.style.backgroundColor = m.c; img.decoding = 'async'; if (!img.hasAttribute('data-eager')) img.loading = 'lazy';
    img.complete && img.naturalWidth ? done() : (img.addEventListener('load', done, { once: true }), img.addEventListener('error', done, { once: true }));
  });
}

/* ---------- Intro (revelación) ---------- */
const intro = $('#intro');
let seen = false; try { seen = sessionStorage.getItem('mo_intro'); sessionStorage.setItem('mo_intro', '1'); } catch { /* ok */ }
if (reduce || seen) intro.remove();
else { setTimeout(() => intro.classList.add('out'), 1500); setTimeout(() => intro.remove(), 2600); }

/* ---------- WhatsApp / contacto ---------- */
$$('[data-wa]').forEach(a => { a.href = waHref(a.dataset.msg || 'Hola Mundo Online 👋, quisiera más información.'); a.target = '_blank'; a.rel = 'noopener'; });
if (!waNumber) {
  $$('[data-wa-label]').forEach(el => { el.textContent = el.textContent.replace('WhatsApp', 'Instagram'); });
  $$('[data-wa] use, [data-wa-label]').forEach(el => { const u = el.tagName === 'use' ? el : el.parentElement.querySelector('use'); if (u) u.setAttribute('href', '#i-ig'); });
}
$('#yr').textContent = new Date().getFullYear();
const rows = [
  waNumber && ['wa', 'WhatsApp y llamadas', C.phone || '+' + waNumber, waHref('Hola Mundo Online 👋')],
  ['ig', 'Instagram', '@' + C.instagram, `https://www.instagram.com/${C.instagram}/`],
  ['fb', 'Facebook', '/' + C.facebook, `https://www.facebook.com/${C.facebook}`],
  C.phone && ['phone', 'Llámanos', C.phone, 'tel:' + C.phone.replace(/[^\d+]/g, '')],
  C.email && ['mail', 'Correo', C.email, 'mailto:' + C.email],
  ['pin', C.address ? 'Ubicación' : 'Cobertura', C.address || C.coverage || 'Costa Rica', null],
  C.hours && ['clock', 'Horario', C.hours, null]
].filter(Boolean);
$('#clist').innerHTML = rows.map(([i, t, s, h]) => {
  const inner = `<span class="ico">${svg(i)}</span><span><b>${esc(t)}</b><span>${esc(s)}</span></span>`;
  return h ? `<a class="crow" href="${esc(h)}" target="_blank" rel="noopener">${inner}</a>` : `<div class="crow">${inner}</div>`;
}).join('');
$('#mapFrame').src = 'https://www.google.com/maps?q=' + encodeURIComponent(C.address || C.mapQuery || 'Costa Rica') + '&output=embed';
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const m = `Hola Mundo Online 👋\nMi nombre es ${$('#cn').value}${$('#ct').value ? ' (' + $('#ct').value + ')' : ''}.\n${$('#cm').value}`;
  window.open(waHref(m), '_blank', 'noopener'); toast('Abriendo tu conversación…');
});

/* ---------- Header, progreso, menú ---------- */
const nav = $('#nav'), bar = $('#bar'), menu = $('#menu'), burger = $('#burger');
const onScroll = () => {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle('solid', y > 30); bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
};
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
const links = $$('#menu a');
const secObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => secObs.observe(s));

/* ---------- Hero: palabras, parallax, spotlight ---------- */
const words = ['relojes', 'tecnología', 'hogar', 'electrodomésticos', 'colchones'], sw = $('#swap'); let wi = 0;
if (!reduce) setInterval(() => { sw.classList.add('out'); setTimeout(() => { wi = (wi + 1) % words.length; sw.textContent = words[wi]; sw.classList.remove('out'); }, 350); }, 2400);
if (fine && !reduce) {
  const hero = $('.hero'), orb = $('#orb');
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    hero.style.setProperty('--mx', x * 100 + '%'); hero.style.setProperty('--my', y * 100 + '%');
    orb.style.transform = `translate3d(${(x - .5) * -26}px,${(y - .5) * -26}px,0)`;
  });
  $$('.mag').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

/* ---------- Revelado, contadores, tilt, parallax ---------- */
const rvObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), { threshold: .12 });
const watch = root => $$('.rv:not(.in)', root).forEach(el => rvObs.observe(el));
const tilt = root => { if (!fine || reduce) return; $$('.tilt:not([data-t])', root).forEach(el => {
  el.dataset.t = 1;
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transition = 'transform .12s ease-out'; el.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`; });
  el.addEventListener('pointerleave', () => { el.style.transition = ''; el.style.transform = ''; });
}); };
hydrate(); watch(document); tilt(document);
const cObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cObs.unobserve(e.target);
  const end = +e.target.dataset.count, t0 = performance.now();
  const step = t => { const p = Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  reduce ? (e.target.textContent = end) : requestAnimationFrame(step);
}), { threshold: .6 });
$$('[data-count]').forEach(el => cObs.observe(el));
const par = $$('[data-parallax]');
if (par.length && !reduce) {
  let tick = false;
  const upd = () => { tick = false; par.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -120 || r.top > innerHeight + 120) return; el.style.transform = `translate3d(0,${((r.top + r.height / 2 - innerHeight / 2) * -.12).toFixed(1)}px,0)`; }); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
}

/* ---------- Lightbox ---------- */
const lb = $('#lb'); let lbList = [], li = 0;
const lbSrc = it => it.name ? srcOf(it.name, 1200) : it.src;
const lbAlt = it => it.name ? IMG[it.name].alt : (it.alt || '');
function showLb(i) {
  li = (i + lbList.length) % lbList.length; const it = lbList[li], im = $('img', lb);
  im.src = lbSrc(it); im.alt = lbAlt(it); $('figcaption', lb).textContent = it.title || lbAlt(it);
  lb.classList.add('open'); lockScroll();
}
const openLb = (list, i) => { lbList = list; showLb(i); };
function closeLb() { lb.classList.remove('open'); lockScroll(); }
$('.x', lb).onclick = closeLb; $('.p', lb).onclick = () => showLb(li - 1); $('.n', lb).onclick = () => showLb(li + 1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'ArrowLeft') showLb(li - 1); if (e.key === 'ArrowRight') showLb(li + 1); });

/* ---------- Cinta de fotos ---------- */
const RIB1 = ['reloj-cronografo-colores', 'reloj-cristal-esmeralda', 'curren-verde', 'cuadrante-azul-esfera', 'reloj-azul-clasico', 'cronografo-celeste-menta', 'promo-curren', 'esmeralda-esfera', 'curren-azul'];
const RIB2 = ['reloj-cuadrante-azul', 'cronografo-azul-oscuro', 'curren-colores', 'esmeralda-brazalete', 'cronografo-azul-metalico', 'cuadrante-azul-eslabones', 'curren-acero', 'clasico-esfera'];
{
  const all = [...RIB1, ...RIB2].filter(n => IMG[n]).map(n => ({ name: n })), idx = n => all.findIndex(x => x.name === n);
  const row = (list, cls) => { const tiles = (dup) => list.filter(n => IMG[n]).map(n => `<button class="rib" data-i="${idx(n)}" ${dup ? 'tabindex="-1" aria-hidden="true"' : ''} aria-label="Ampliar: ${esc(IMG[n].alt)}">${imgTag(n, '250px')}</button>`).join(''); return `<div class="rrow ${cls}">${tiles(false)}${tiles(true)}</div>`; };
  const box = $('#ribbon');
  if (all.length) {
    box.innerHTML = row(RIB1, '') + row(RIB2, 'rev'); hydrate(box);
    box.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) openLb(all, +b.dataset.i); });
  }
}

/* ---------- Catálogo ---------- */
let DATA = { items: [], categories: [] }, filter = 'all', query = '';
const cart = store.get('mo_cart', {});
const byId = id => DATA.items.find(p => p.id === id);
const catName = id => (DATA.categories.find(c => c.id === id) || {}).name || '';
const PSIZES = '(min-width:1100px) 270px, (min-width:600px) 33vw, 90vw';
const prodHTML = p => {
  const ims = (p.images || []).filter(n => IMG[n]), has = ims.length > 0;
  return `<article class="prod rv">
  <button class="pimg${has ? ' has' : ''}" data-qv="${esc(p.id)}" style="${has ? `--c:${IMG[ims[0]].c}` : `--g:${GRAD[p.cat] || GRAD.relojes}`}" aria-label="Ver ${esc(p.name)} en detalle">
    ${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ''}${has ? imgTag(ims[0], PSIZES) + (ims[1] ? imgTag(ims[1], PSIZES, 'i2') : '') : svg(ICON[p.cat] || 'bolt')}<span class="qv-hint">${svg('eye')} Vista rápida</span>
  </button>
  <div class="pbody"><div class="meta"><small>${esc(catName(p.cat))}</small><span class="sku">SKU ${esc(p.sku || '')}</span></div>
  <h3 data-qv="${esc(p.id)}">${esc(p.name)}</h3><p>${esc(p.desc || '')}</p>
  <div class="pfoot"><span class="price">${money(p.price)}</span><button class="btn teal sm" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.name)} al pedido">${svg('plus')} Agregar</button></div></div></article>`;
};
function renderProducts() {
  const q = query.trim().toLowerCase(), box = $('#products');
  const list = DATA.items.filter(p => (filter === 'all' || p.cat === filter) && (!q || (p.name + ' ' + (p.desc || '') + ' ' + (p.sku || '')).toLowerCase().includes(q)));
  const cat = DATA.categories.find(c => c.id === filter);
  box.innerHTML = list.length ? list.map(prodHTML).join('')
    : (cat && !q ? `<div class="soon">${SOON_IMG[cat.id] ? imgTag(SOON_IMG[cat.id], '100vw') : ''}${svg(ICON[cat.id] || 'bolt')}<h3>${esc(cat.name)}: estamos preparando esta línea</h3><p>Escríbenos y te avisamos apenas tengamos novedades, o pregúntanos por lo que necesitas.</p><a class="btn primary" data-wa href="${esc(waHref('Hola Mundo Online 👋, me interesa la línea de ' + cat.name + '. ¿Me avisan cuando llegue?'))}" target="_blank" rel="noopener">${svg('wa')} Avísame por WhatsApp</a></div>`
      : '<p class="empty">No encontramos productos con ese filtro. ¿Te ayudamos por WhatsApp?</p>');
  hydrate(box); watch(box); requestAnimationFrame(() => $$('.rv', box).forEach(el => el.classList.add('in')));
}
function renderFilters() {
  const all = [{ id: 'all', name: 'Todo' }, ...DATA.categories];
  $('#filters').innerHTML = all.map(c => `<button class="fchip${c.id === filter ? ' on' : ''}" data-f="${c.id}" role="tab" aria-selected="${c.id === filter}">${esc(c.name)}</button>`).join('');
}
function setFilter(id) { filter = id; renderFilters(); renderProducts(); }
$('#filters').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (b) setFilter(b.dataset.f); });
$('#q').addEventListener('input', e => { query = e.target.value; renderProducts(); });
$$('[data-cat]').forEach(b => b.addEventListener('click', () => { setFilter(b.dataset.cat); $('#tienda').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));
$('#products').addEventListener('click', e => {
  const a = e.target.closest('[data-add]'); if (a) return add(a.dataset.add);
  const q = e.target.closest('[data-qv]'); if (q) openQv(q.dataset.qv);
});
fetch('products.json').then(r => r.json()).then(d => {
  DATA = d; $('#demoNote').hidden = !d.demo;
  Object.keys(cart).forEach(id => { if (!byId(id)) delete cart[id]; });
  renderFilters(); renderProducts(); renderCart();
}).catch(() => { $('#products').innerHTML = '<p class="empty">No pudimos cargar el catálogo. Abre el sitio desde un servidor web (no como archivo local).</p>'; });

/* ---------- Vista rápida ---------- */
const qv = $('#qv'); let qvP = null;
function setQvImg(i) {
  const ims = (qvP.images || []).filter(n => IMG[n]), main = $('#qvMain'), box = $('.qv-main');
  if (!ims.length) { main.hidden = true; box.style.background = GRAD[qvP.cat]; return; }
  const n = ims[i]; main.hidden = false; main.srcset = srcsetOf(n); main.sizes = '(min-width:760px) 480px, 92vw'; main.src = srcOf(n, 800); main.alt = IMG[n].alt; box.style.setProperty('--c', IMG[n].c);
  $$('#qvThumbs button').forEach((b, k) => b.classList.toggle('on', k === i));
}
function openQv(id) {
  const p = byId(id); if (!p) return; qvP = p;
  const ims = (p.images || []).filter(n => IMG[n]);
  $('#qvCat').textContent = catName(p.cat); $('#qvTitle').textContent = p.name; $('#qvSku').textContent = 'SKU ' + (p.sku || '');
  $('#qvPrice').textContent = money(p.price); $('#qvDesc').textContent = p.desc || '';
  $('#qvFeat').innerHTML = (p.features || []).map(f => `<li>${svg('check')}<span>${esc(f)}</span></li>`).join('');
  $('#qvThumbs').innerHTML = ims.length > 1 ? ims.map((n, i) => `<button data-i="${i}" aria-label="Foto ${i + 1}">${imgTag(n, '68px')}</button>`).join('') : '';
  hydrate($('#qvThumbs')); $$('#qvThumbs img').forEach(i => { i.loading = 'eager'; });
  $('#qvWa').href = waHref(orderMsg([[p, 1]]));
  setQvImg(0); qv.classList.add('on'); $('#veil').classList.add('on'); lockScroll(); $('#qvClose').focus();
}
function closeQv() { if (!qv.classList.contains('on')) return; qv.classList.remove('on'); if (!$('.drawer.on, #checkout.on')) $('#veil').classList.remove('on'); lockScroll(); }
$('#qvThumbs').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) setQvImg(+b.dataset.i); });
$('#qvMain').addEventListener('click', () => { if (qvP) openLb((qvP.images || []).filter(n => IMG[n]).map(n => ({ name: n, title: qvP.name })), 0); });
$('#qvAdd').addEventListener('click', () => { add(qvP.id); });
$('#qvClose').addEventListener('click', closeQv);
qv.addEventListener('mousedown', e => { if (e.target === qv) closeQv(); });

/* ---------- Pedido (carrito) ---------- */
const total = () => Object.entries(cart).reduce((s, [id, q]) => s + (byId(id)?.price || 0) * q, 0);
const count = () => Object.values(cart).reduce((s, q) => s + q, 0);
const save = () => store.set('mo_cart', cart);
const lineText = (p, q) => `• ${q} × ${p.name} (SKU ${p.sku}) — ${money(p.price * q)}`;
const orderMsg = (pairs, extra = '') => `Hola Mundo Online 👋 Quiero hacer este pedido:\n\n${pairs.map(([p, q]) => lineText(p, q)).join('\n')}\n\nTotal: ${money(pairs.reduce((s, [p, q]) => s + p.price * q, 0))}${extra}\n\n¿Me confirman disponibilidad y la entrega? 🙌`;
function add(id) {
  cart[id] = Math.min((cart[id] || 0) + 1, 20); save(); renderCart();
  const b = $('#cartCount'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  toast(`✓ ${byId(id).name} agregado a tu pedido`);
}
function renderCart() {
  const ids = Object.keys(cart);
  $('#cartCount').textContent = count(); $('#cartTotal').textContent = money(total());
  const btn = $('#checkoutBtn'); btn.disabled = !ids.length; btn.style.opacity = ids.length ? 1 : .5; $('#cartClear').hidden = !ids.length;
  btn.className = 'btn block ' + (cardOn ? 'primary' : 'wa'); $('#checkoutLabel').textContent = cardOn ? 'Finalizar compra' : 'Pedir por WhatsApp';
  $('#cartBody').innerHTML = ids.length ? ids.map(id => { const p = byId(id), n = (p.images || []).find(x => IMG[x]); return `<div class="line-item"><div class="th" style="${n ? `--c:${IMG[n].c}` : `--g:${GRAD[p.cat]}`}">${n ? imgTag(n, '62px') : svg(ICON[p.cat] || 'bolt')}</div>
    <div><b>${esc(p.name)}</b><small>SKU ${esc(p.sku)} · ${money(p.price)}</small><div class="qty"><button data-dec="${id}" aria-label="Menos">${svg('minus')}</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Más">${svg('plus')}</button></div></div>
    <div style="text-align:right"><b>${money(p.price * cart[id])}</b><br><button class="rm" data-rm="${id}">Quitar</button></div></div>`; }).join('')
    : `<p class="empty">Tu pedido está vacío.<br>¡Explora el catálogo y agrega tus favoritos!</p>`;
  hydrate($('#cartBody'));
}
$('#cartBody').addEventListener('click', e => {
  const t = e.target.closest('button'); if (!t) return;
  const { inc, dec, rm } = t.dataset;
  if (inc) cart[inc] = Math.min(cart[inc] + 1, 20);
  if (dec) cart[dec] = cart[dec] > 1 ? cart[dec] - 1 : (delete cart[dec], 0);
  if (rm) delete cart[rm];
  save(); renderCart();
});
$('#cartClear').addEventListener('click', () => { Object.keys(cart).forEach(k => delete cart[k]); save(); renderCart(); });
const drawer = $('#drawer'), veil = $('#veil');
const openDrawer = o => { drawer.classList.toggle('on', o); veil.classList.toggle('on', o || qv.classList.contains('on') || $('#checkout').classList.contains('on')); drawer.setAttribute('aria-hidden', !o); lockScroll(); if (o) $('#cartClose').focus(); };
$('#cartOpen').addEventListener('click', () => openDrawer(true));
$('#cartClose').addEventListener('click', () => openDrawer(false));
veil.addEventListener('click', () => { openDrawer(false); closeCheckout(); closeQv(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { openDrawer(false); closeCheckout(); closeQv(); closeLb(); setMenu(false); } });
$('#checkoutBtn').addEventListener('click', () => {
  if (!count()) return;
  if (cardOn) return openCheckout();
  const pairs = Object.entries(cart).map(([id, q]) => [byId(id), q]);
  window.open(waHref(orderMsg(pairs)), '_blank', 'noopener'); toast('Abrimos WhatsApp con tu pedido 🙌');
});

/* ---------- Checkout con tarjeta (fase 2: solo si config.js activa una pasarela) ---------- */
const co = $('#checkout'), err = $('#coErr');
const PAY = {
  onvo: ['card', 'Tarjeta de crédito o débito', 'Pago seguro con ONVO Pay'],
  tilopay: ['card', 'Tarjeta · Tilopay', 'Te llevamos al checkout seguro de Tilopay'],
  whatsapp: ['sinpe', 'SINPE Móvil o efectivo', 'Coordinamos el pago y la entrega contigo por WhatsApp']
};
const payStatus = cardOn ? fetch(C.api.status).then(r => r.ok ? r.json() : {}).catch(() => ({})) : Promise.resolve({});
const renderPayOpts = st => {
  const allowed = C.payments || { whatsapp: true };
  let enabled = Object.keys(PAY).filter(k => allowed[k] && (k === 'whatsapp' || st[k]));
  if (!enabled.length) enabled = ['whatsapp'];
  $('#payOpts').innerHTML = enabled.map((k, i) => `<label class="opt"><input type="radio" name="pay" value="${k}"${i ? '' : ' checked'}><span class="ico" style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--navy);color:var(--teal)">${svg(PAY[k][0])}</span><span><b>${PAY[k][1]}</b><small>${PAY[k][2]}</small></span></label>`).join('');
};
const showErr = m => { err.textContent = m || ''; err.classList.toggle('on', !!m); };
async function openCheckout() {
  if (!count()) return;
  renderPayOpts(await payStatus);
  openDrawer(false); showErr(''); $('#coStep1').hidden = false; $('#coStep2').hidden = true;
  $('#coTotal').textContent = money(total()); co.classList.add('on'); veil.classList.add('on'); lockScroll();
  const c = store.get('mo_customer', {}); Object.entries(c).forEach(([k, v]) => { const el = $('#f-' + k); if (el) el.value = v; });
}
function closeCheckout() { if (!co.classList.contains('on')) return; co.classList.remove('on'); if (!qv.classList.contains('on')) veil.classList.remove('on'); lockScroll(); }
$('#coClose').addEventListener('click', closeCheckout);
co.addEventListener('mousedown', e => { if (e.target === co) closeCheckout(); });
$('#coBack').addEventListener('click', () => { $('#coStep1').hidden = false; $('#coStep2').hidden = true; });

const customer = () => Object.fromEntries(['name', 'phone', 'email', 'prov', 'city', 'addr'].map(k => [k, $('#f-' + k).value.trim()]));
const items = () => Object.entries(cart).map(([id, qty]) => ({ id, qty }));
async function api(url, body) {
  let res; try { res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); } catch { throw new Error('offline'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (res.status === 404 ? 'nobackend' : 'Error ' + res.status));
  return data;
}
const loadOnvo = () => window.onvo ? Promise.resolve() : new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'https://sdk.onvopay.com/sdk.js'; s.onload = ok; s.onerror = () => ko(new Error('No se pudo cargar ONVO Pay.')); document.head.appendChild(s); });
const finish = q => { Object.keys(cart).forEach(k => delete cart[k]); save(); renderCart(); location.href = 'gracias.html?' + q; };

$('#coForm').addEventListener('submit', async e => {
  e.preventDefault(); if ($('#coStep1').hidden) return;
  const method = $('input[name=pay]:checked')?.value, cu = customer(), btn = $('#coGo'), label = btn.innerHTML;
  store.set('mo_customer', cu); showErr('');
  if (method === 'whatsapp') {
    const pairs = Object.entries(cart).map(([id, q]) => [byId(id), q]);
    const extra = `\n\nNombre: ${cu.name}\nTel: ${cu.phone}\nCorreo: ${cu.email}\nEntrega: ${cu.addr}, ${cu.city}, ${cu.prov}\n\nPago: SINPE Móvil o efectivo`;
    window.open(waHref(orderMsg(pairs, extra)), '_blank', 'noopener'); return finish('pago=whatsapp');
  }
  btn.disabled = true; btn.textContent = 'Procesando…';
  try {
    if (method === 'tilopay') { const d = await api(C.api.tilopay, { items: items(), customer: cu }); if (!d.url) throw new Error('Respuesta inválida'); location.href = d.url; return; }
    const d = await api(C.api.onvo, { items: items(), customer: cu });
    await loadOnvo(); $('#coStep1').hidden = true; $('#coStep2').hidden = false; $('#onvoBox').innerHTML = '';
    window.onvo.pay({
      publicKey: d.publicKey, paymentIntentId: d.paymentIntentId, paymentType: 'one_time', locale: 'es',
      onSuccess: () => finish(`pago=onvo&ref=${encodeURIComponent(d.paymentIntentId)}`),
      onError: x => { $('#coStep1').hidden = false; $('#coStep2').hidden = true; showErr(x?.message || 'El pago no pudo completarse. Intenta con otra tarjeta.'); }
    }).render('#onvoBox');
  } catch (x) {
    showErr(['offline', 'nobackend'].includes(x.message)
      ? 'El pago con tarjeta no está disponible en este momento. Puedes finalizar tu pedido por SINPE Móvil o efectivo vía WhatsApp.' : x.message);
  } finally { btn.disabled = false; btn.innerHTML = label; }
});

/* ---------- Galería (mosaico) ---------- */
const BRAND = [
  ['Tecnología que conecta', 'laptop', 'tecnologia', 300], ['Hogar con confianza', 'home', 'hogar', 210], ['Compra simple', 'bolt', 'electro', 240],
  ['Descanso y bienestar', 'bed', 'colchones', 280], ['Servicio cercano', 'heart', 'hogar', 230], ['Calidad y funcionalidad', 'washer', 'electro', 300]
];
const GSIZES = { big: '(min-width:860px) 50vw, 100vw', wide: '(min-width:860px) 50vw, 100vw', tall: '(min-width:860px) 25vw, 50vw', '': '(min-width:860px) 25vw, 50vw' };
fetch('assets/gallery/gallery.json').then(r => r.json()).catch(() => []).then(list => {
  const g = $('#gallery'), ok = (Array.isArray(list) ? list : []).filter(x => x.img ? IMG[x.img] : x.src);
  if (ok.length) {
    const lbl = ok.map(x => x.img ? { name: x.img, title: x.title } : { src: x.src, alt: x.alt, title: x.title });
    g.innerHTML = ok.map((x, i) => `<button class="shot rv ${esc(x.span || '')}" data-i="${i}" aria-label="Ampliar: ${esc(x.title || x.alt || 'foto')}" style="--c:${x.img ? IMG[x.img].c : '#123'}">${x.img ? imgTag(x.img, GSIZES[x.span || ''] || GSIZES['']) : `<img src="${esc(x.src)}" alt="${esc(x.alt || '')}" loading="lazy">`}${x.title ? `<span>${esc(x.title)}</span>` : ''}</button>`).join('');
    g.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) openLb(lbl, +b.dataset.i); });
  } else {
    g.innerHTML = BRAND.map(([t, i, c, h], n) => `<div class="shot brand rv" style="--g:${GRAD[c]};--d:${n * .06}s;animation-delay:${-n * 1.3}s">${svg(i)}<b>${t}</b></div>`).join('');
  }
  hydrate(g); watch(g);
});
if (C.instagramEmbed) {
  const box = $('#igEmbed'), ob = new IntersectionObserver(es => { if (es[0].isIntersecting) { ob.disconnect(); box.hidden = false; box.innerHTML = `<iframe loading="lazy" title="Instagram de Mundo Online Costa Rica" src="https://www.instagram.com/${esc(C.instagram)}/embed"></iframe>`; } }, { rootMargin: '300px' });
  ob.observe($('#galeria'));
}
})();
