// Utilidades compartidas por las funciones de pago.
// Los precios SIEMPRE se leen de products.json en el servidor: nunca se confía en el monto del navegador.
const catalog = require('../../../products.json');
const byId = new Map(catalog.items.map(p => [p.id, p]));

const reply = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body)
});

class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }

const clean = (v, max = 120) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, max);

function buildOrder(payload) {
  const items = Array.isArray(payload.items) ? payload.items.slice(0, 50) : [];
  let total = 0;
  const lines = [];
  for (const it of items) {
    const p = byId.get(String(it.id));
    const qty = Math.min(Math.max(parseInt(it.qty, 10) || 0, 0), 20);
    if (!p || !qty) continue;
    total += p.price * qty;
    lines.push(`${qty}x ${p.name}`);
  }
  if (!lines.length || total <= 0) throw new HttpError(400, 'El carrito está vacío.');
  const c = payload.customer || {};
  const customer = {
    name: clean(c.name, 80), phone: clean(c.phone, 30), email: clean(c.email, 100),
    province: clean(c.prov, 40), city: clean(c.city, 60), address: clean(c.addr, 240)
  };
  if (!customer.name || !customer.phone || !/^\S+@\S+\.\S+$/.test(customer.email)) {
    throw new HttpError(400, 'Completa nombre, teléfono y un correo válido.');
  }
  const orderId = 'MO-' + Date.now().toString(36).toUpperCase();
  return { total, lines, customer, orderId };
}

const siteUrl = event => (process.env.SITE_URL || process.env.URL || `https://${event.headers.host}`).replace(/\/$/, '');

function handle(fn) {
  return async event => {
    if (event.httpMethod !== 'POST') return reply(405, { error: 'Método no permitido' });
    try {
      return await fn(event, JSON.parse(event.body || '{}'));
    } catch (e) {
      if (e instanceof HttpError) return reply(e.status, { error: e.message });
      console.error(e);
      return reply(502, { error: 'No pudimos contactar la pasarela de pago. Intenta de nuevo.' });
    }
  };
}

module.exports = { buildOrder, reply, HttpError, siteUrl, handle };
