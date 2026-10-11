// Indica al navegador qué pasarelas están configuradas (solo booleanos, nunca las llaves).
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify({
    onvo: !!(process.env.ONVO_SECRET_KEY && process.env.ONVO_PUBLIC_KEY),
    tilopay: !!(process.env.TILOPAY_API_USER && process.env.TILOPAY_API_PASSWORD && process.env.TILOPAY_API_KEY)
  })
});
