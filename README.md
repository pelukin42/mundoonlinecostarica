# Mundo Online Costa Rica · sitio web 2026

Sitio estático (HTML + CSS + JS, sin dependencias ni *build*) con tienda en línea, carrito y pagos con tarjeta
(**ONVO Pay** o **Tilopay**) mediante funciones serverless. Sigue la propuesta de rebranding: círculo **MO**,
azul petróleo `#0D2B45`, turquesa `#14B8A6`, coral `#FF6B4A`, crema `#F6F6F6`, Montserrat y el eslogan *«Tu mundo, más fácil.»*

```
index.html · gracias.html         páginas
assets/css/styles.css             sistema visual y animaciones
assets/js/config.js               ← datos del negocio y opciones (único archivo que se edita a menudo)
assets/js/app.js                  tienda, carrito, checkout, galería
assets/logo/                      logo vectorial (completo, horizontal, símbolo, animado, claro/oscuro), favicon, OG
assets/gallery/                   fotos + gallery.json
products.json                     catálogo (precios en colones)
netlify/functions/                pay-status · onvo-intent · tilopay-checkout
netlify.toml · .env.example       despliegue y variables
```

## Probar en local
```bash
python3 -m http.server 8000      # sitio + WhatsApp/SINPE (sin tarjeta)
npx netlify dev                  # además las funciones de pago (requiere .env)
```

## Datos del negocio (tomados de las publicaciones de Instagram)
WhatsApp y llamadas **8997‑7020** · pagos con tarjeta, SINPE y efectivo · entrega incluida en el área metropolitana ·
envíos a todo el país por correos y encomienda. Se editan en `assets/js/config.js` (también correo, dirección y horario:
si se dejan vacíos, no se muestran). Si `whatsapp` queda vacío, los botones usan el mensaje directo de Instagram.

## Catálogo y galería
* **Productos:** edita `products.json` (`id` único, `cat`, `name`, `desc`, `price` en colones, `image`, `badge`).
  Las líneas Tecnología, Hogar, Electrodomésticos y Colchones aparecen como «en preparación» hasta que tengan productos.
  Con `"demo": true` se muestra un aviso de catálogo de ejemplo.
* **Galería:** copia fotos en `assets/gallery/` y enuméralas en `assets/gallery/gallery.json`.
* **Confirmar antes de publicar:** los precios de `rel-003` y `rel-004` se asumieron en ₡25.000 (la publicación no indica precio).

## Pagos con tarjeta (elige UNA pasarela)
Los precios se recalculan **en el servidor** desde `products.json`; el navegador nunca decide el monto, y las llaves
secretas viven solo en variables de entorno. Las opciones de tarjeta aparecen en el checkout **solo si el servidor
tiene las llaves**; si no, queda SINPE Móvil / efectivo por WhatsApp (el pedido llega armado en el mensaje).

**ONVO Pay** (`onvo-intent.js`, [docs](https://docs.onvopay.com))
1. En el dashboard de ONVO copia las llaves de pruebas (`onvo_test_…`).
2. Define `ONVO_SECRET_KEY` y `ONVO_PUBLIC_KEY` en Netlify. El servidor crea la *payment intent* (CRC, monto ×100) y el
   navegador muestra el formulario seguro con `sdk.onvopay.com`. Los datos del cliente y los productos quedan en el
   *metadata* del pago.
3. Prueba con tarjetas de prueba; luego cambia a llaves `onvo_live_…`. Recomendado: webhook `payment-intent.succeeded`.

**Tilopay** (`tilopay-checkout.js`)
1. En `admin.tilopay.com` → *Tilopay Checkout* obtén llave, usuario y contraseña API (modo pruebas disponible).
2. Define `TILOPAY_API_KEY`, `TILOPAY_API_USER`, `TILOPAY_API_PASSWORD` (y opcional `TILOPAY_DEFAULT_ZIP`).
   El servidor hace `login` → `processPayment` y redirige al checkout de Tilopay; al terminar vuelve a `/gracias.html`
   (`code=1` = aprobado). Recomendado: validar el retorno con el webhook/consulta de Tilopay antes de despachar.

Para desactivar una pasarela, ponla en `false` en `payments` de `config.js`.

> Las integraciones siguen la documentación y el plugin oficial de cada pasarela y se probaron con respuestas
> simuladas. Falta una prueba real con llaves en modo pruebas.

## Publicar con el dominio propio (Netlify, gratis)
1. Netlify → *Add new site → Import from Git* → este repositorio (el `netlify.toml` ya configura todo).
2. *Site configuration → Environment variables*: pega las llaves de `.env.example`.
3. *Domain management → Add a domain*: indica el dominio y apunta el DNS según Netlify (CNAME de `www` y A/ALIAS del
   dominio raíz, o delegar los *nameservers*). El SSL se activa solo. En cada despliegue el *build* escribe tu dominio
   en las metaetiquetas OG, canonical, sitemap y robots (`__SITE_URL__`).
4. Si se usa otro hosting (cPanel, GitHub Pages): el sitio funciona igual, pero la tarjeta requiere las funciones;
   reemplaza `__SITE_URL__` a mano por la URL final.

## Marca
Logo vectorial con texto convertido a trazos (`assets/logo/*.svg`): `logo-full(-light)`, `logo-horizontal(-light)`,
`logo-symbol`, `logo-symbol-animated`, `favicon.svg`, `og-image.jpg`, íconos PWA. Los colores superan el contraste
mínimo; el coral lleva texto azul petróleo. Respeta `prefers-reduced-motion`.
