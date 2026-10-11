/* ============================================================
   CONFIGURACIÓN DEL SITIO · edita solo este archivo
   ============================================================ */
window.MO_CONFIG = {
  brand: 'Mundo Online Costa Rica',
  site: 'https://mundoonlinecr.com',
  tagline: 'Tu mundo, más fácil.',

  // WhatsApp: solo dígitos con código de país (tomado de las publicaciones de Instagram).
  // Si queda vacío, los botones usan el mensaje directo de Instagram como respaldo.
  whatsapp: '50689977020',

  instagram: 'mundoonlinecostarica',
  facebook: 'mundoonlinecostarica',

  // Opcionales: si se dejan vacíos, simplemente no se muestran.
  email: '',            // Ej.: 'ventas@mundoonlinecr.com' (solo si ya existe el buzón)
  phone: '+506 8997 7020', // WhatsApp y llamadas
  address: '',          // Ej.: 'San José, Costa Rica · Barrio Escalante'
  hours: '',            // Ej.: 'Lun–Sáb 9:00 a.m. – 6:00 p.m.'
  mapQuery: 'San José, Costa Rica', // Texto para el mapa (dirección exacta o nombre del local)
  coverage: 'Entrega incluida en el área metropolitana · Envíos a todo el país por correos y encomienda',

  // Pedidos: el botón principal siempre envía el pedido por WhatsApp (SINPE, efectivo o tarjeta al coordinar).
  // Pago con tarjeta en la web: elija la pasarela (tilopay u onvo) y el modo:
  //   'soon' → se muestra "Próximamente" (valor actual: aún no hay credenciales)
  //   'demo' → simula el flujo completo sin cobrar (para revisar con el cliente)
  //   'live' → cobra de verdad: requiere Netlify + llaves de la pasarela (ver README)
  payments: { onvo: false, tilopay: true, whatsapp: true },
  cardMode: 'soon',

  // Endpoints de las funciones serverless (Netlify). Cambiar si usa otro hosting.
  api: {
    status: '/.netlify/functions/pay-status',
    onvo: '/.netlify/functions/onvo-intent',
    tilopay: '/.netlify/functions/tilopay-checkout'
  },

  // Muestra además el feed en vivo de Instagram en la galería (carga contenido de terceros).
  instagramEmbed: false
};
