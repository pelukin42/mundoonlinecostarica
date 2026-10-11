/* ============================================================
   CONFIGURACIÓN DEL SITIO · edita solo este archivo
   ============================================================ */
window.MO_CONFIG = {
  brand: 'Mundo Online Costa Rica',
  tagline: 'Tu mundo, más fácil.',

  // WhatsApp: solo dígitos con código de país (tomado de las publicaciones de Instagram).
  // Si queda vacío, los botones usan el mensaje directo de Instagram como respaldo.
  whatsapp: '50689977020',

  instagram: 'mundoonlinecostarica',
  facebook: 'mundoonlinecostarica',

  // Opcionales: si se dejan vacíos, simplemente no se muestran.
  email: '',
  phone: '+506 8997 7020', // WhatsApp y llamadas
  address: '',          // Ej.: 'San José, Costa Rica · Barrio Escalante'
  hours: '',            // Ej.: 'Lun–Sáb 9:00 a.m. – 6:00 p.m.'
  mapQuery: 'Gran Área Metropolitana, Costa Rica', // Texto para el mapa (dirección exacta o nombre del local)
  coverage: 'Entrega incluida en el área metropolitana · Envíos a todo el país por correos y encomienda',

  // Métodos de pago permitidos en el checkout. Con tarjeta solo aparecen si el servidor tiene las
  // llaves configuradas (ver README). Ponga false el que NO vaya a usar (elija ONVO o Tilopay).
  payments: { onvo: true, tilopay: true, whatsapp: true },

  // Endpoints de las funciones serverless (Netlify). Cambiar si usa otro hosting.
  api: {
    status: '/.netlify/functions/pay-status',
    onvo: '/.netlify/functions/onvo-intent',
    tilopay: '/.netlify/functions/tilopay-checkout'
  },

  // Muestra además el feed en vivo de Instagram en la galería (carga contenido de terceros).
  instagramEmbed: false
};
