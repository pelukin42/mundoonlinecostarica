// Tilopay · autentica, crea el pago y devuelve la URL del checkout seguro (redirección).
// Flujo: POST /login -> POST /processPayment (type 100 = ok, url = checkout). Credenciales en admin.tilopay.com > "Tilopay Checkout".
const { buildOrder, reply, HttpError, siteUrl, handle } = require('./lib/shared');
const API = 'https://app.tilopay.com/api/v1/';

exports.handler = handle(async (event, payload) => {
  const { TILOPAY_API_USER: user, TILOPAY_API_PASSWORD: password, TILOPAY_API_KEY: key } = process.env;
  if (!user || !password || !key) throw new HttpError(503, 'Tilopay no está configurado todavía.');
  const { total, customer, orderId } = buildOrder(payload);
  const [first, ...rest] = customer.name.split(' ');

  const login = await fetch(API + 'login', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email: user, password })
  }).then(r => r.json()).catch(() => ({}));
  if (!login.access_token) { console.error('Tilopay login falló'); throw new Error('tilopay-login'); }

  const res = await fetch(API + 'processPayment', {
    method: 'POST',
    headers: { Authorization: 'bearer ' + login.access_token, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      redirect: `${siteUrl(event)}/gracias.html`,
      key, amount: String(total), currency: 'CRC',
      billToFirstName: first, billToLastName: rest.join(' ') || first,
      billToAddress: customer.address, billToAddress2: customer.city, billToCity: customer.city,
      billToState: customer.province, billToZipPostCode: process.env.TILOPAY_DEFAULT_ZIP || '10101', billToCountry: 'CR',
      billToTelephone: customer.phone, billToEmail: customer.email,
      orderNumber: orderId, capture: 1, subscription: 0, lang: 'es',
      platform: 'custom-web', hashVersion: 'V2', returnData: orderId
    })
  });
  const data = await res.json().catch(() => ({}));
  if (Number(data.type) !== 100 || !data.url) { console.error('Tilopay', res.status, data); throw new Error('tilopay'); }
  return reply(200, { url: data.url, orderId });
});
