// ONVO Pay · crea la intención de pago en el servidor y devuelve su id al navegador.
// Docs: https://docs.onvopay.com  (POST /v1/payment-intents, monto en la unidad mínima: ₡1.234,56 -> 123456)
const { buildOrder, reply, HttpError, handle } = require('./lib/shared');

exports.handler = handle(async (_event, payload) => {
  const secret = process.env.ONVO_SECRET_KEY, publicKey = process.env.ONVO_PUBLIC_KEY;
  if (!secret || !publicKey) throw new HttpError(503, 'ONVO Pay no está configurado todavía.');
  const { total, lines, customer, orderId } = buildOrder(payload);

  const res = await fetch('https://api.onvopay.com/v1/payment-intents', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: total * 100,
      currency: 'CRC',
      description: `Pedido ${orderId} · Mundo Online Costa Rica`,
      metadata: { orderId, cliente: customer.name, telefono: customer.phone, correo: customer.email,
        entrega: `${customer.address}, ${customer.city}, ${customer.province}`.slice(0, 500), productos: lines.join(' | ').slice(0, 500) }
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.id) { console.error('ONVO', res.status, data); throw new Error('onvo'); }
  return reply(200, { paymentIntentId: data.id, publicKey, orderId });
});
