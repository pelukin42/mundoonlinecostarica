# Mundo Online Costa Rica · sitio web 2026 · mundoonlinecr.com

Sitio estático (HTML + CSS + JS, sin dependencias ni *build* para publicarlo) con catálogo, pedido por WhatsApp y
mucha imagen. Sigue la propuesta de rebranding: círculo **MO**, azul petróleo `#0D2B45`, turquesa `#14B8A6`,
coral `#FF6B4A`, crema `#F6F6F6`, Montserrat y el eslogan *«Tu mundo, más fácil.»*

```
index.html · gracias.html         páginas
assets/css/styles.css             sistema visual y animaciones
assets/js/config.js               ← datos del negocio y opciones (el archivo que más se edita)
assets/js/app.js                  catálogo, pedido, vista rápida, galería
assets/js/images.js               registro de imágenes (generado, no editar)
assets/img/                       27 fotos en WebP, varios anchos (+ CREDITS.md)
assets/logo/                      logo vectorial (completo, horizontal, símbolo, animado, claro/oscuro), favicon, OG
assets/gallery/gallery.json       orden del mosaico
products.json                     catálogo: SKU, precios (CRC), fotos, características
tools/                            images.json + build-images.py + src/ (originales) para regenerar las fotos
netlify/functions/                (fase 2, opcional) pagos con tarjeta ONVO Pay / Tilopay
```

## Probar en local
```bash
python3 -m http.server 8000      # abre http://localhost:8000
```

## Botones de WhatsApp y pedido
Todos los botones de mensaje usan el logo real de WhatsApp, abren el chat de **8997‑7020** con un texto ya escrito y llevan la
firma «Enviado desde mundoonlinecr.com» (así el negocio sabe qué mensajes vienen del sitio):
* **Inicio:** botón verde «Pedir por WhatsApp» con el número, y el mismo botón en el encabezado y en el menú móvil.
* **Burbuja flotante** con menú rápido: pedido, disponibilidad y precios, envío a mi zona, hablar con un asesor, llamar e Instagram.
* **Cada producto:** botón «Pedir» (producto, SKU y precio) además de «Agregar»; la vista rápida lo repite en grande.
* **Barra de pedido** que aparece al agregar productos (cantidad, total y «Pedir por WhatsApp»); el cajón del pedido suma
  «Copiar mi pedido». El mensaje lista cada producto con su SKU y el total.
* **Galería:** «Preguntar por este reloj» en cada foto ampliada; los banners, la sección de contacto y «línea en preparación»
  también tienen su botón con mensaje propio.
Si `whatsapp` queda vacío en `config.js`, todos los botones se convierten en mensaje directo de Instagram.

## Datos del negocio (`assets/js/config.js`)
WhatsApp y llamadas, redes, cobertura y mapa ya están cargados con lo publicado en Instagram. Correo, dirección y
horario van vacíos: si se completan, aparecen solos. Si `whatsapp` queda vacío, los botones usan el DM de Instagram.

## Catálogo y SKU (`products.json`)
Cada producto tiene `id`, **`sku` tentativo** (`MO-<LÍNEA>-<NNN>`: REL relojes, TEC tecnología, HOG hogar,
ELE electrodomésticos, COL colchones), `price` en colones, `images` (nombres de `tools/images.json`), `features` y `badge`.
El SKU se muestra en tarjetas, vista rápida y pedido, y se puede buscar en el catálogo.
Las líneas sin productos aparecen como «en preparación». **Confirmar** los marcados `"confirm": true` (precio asumido
en ₡25.000 porque la publicación no lo indica).

## Imágenes
* **Reales (17):** las 5 fotos de Instagram del negocio y 12 recortes de detalle de cada reloj.
* **De ambiente (10):** Tecnología, Hogar, Electrodomésticos, Colchones, regalo y volcán Arenal, de
  [Pexels](https://www.pexels.com/license/) (uso comercial libre, sin atribución; ver `assets/img/CREDITS.md`).
  Sustitúyelas cuando el cliente tenga fotos propias de esas líneas.
* **Agregar o cambiar fotos:** copia el original a `tools/src/`, añade su entrada en `tools/images.json`
  (nombre, archivo, recorte opcional, texto alternativo) y ejecuta `pip install pillow && python3 tools/build-images.py`.
  Genera los anchos WebP y `assets/js/images.js`. Luego úsala en `products.json` (`images`) o `gallery.json`.
* Todas cargan en diferido y con `srcset`: recorrer la página completa descarga ~1,3 MB.

## Publicar en mundoonlinecr.com
**Opción A · GitHub Pages (gratis, sin servidor).** *Settings → Pages → Deploy from a branch → `main` / `(root)`*,
dominio `mundoonlinecr.com` (el archivo `CNAME` ya está) y *Enforce HTTPS*. En el DNS del registrador: cuatro registros
**A** para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, y un **CNAME** `www` →
`pelukin42.github.io`.
**Opción B · Netlify.** *Import from Git* (el `netlify.toml` ya está) → *Domain management → Add domain* y seguir sus
instrucciones de DNS. Es la única opción que ejecuta las funciones de la fase 2.
**Opción C · hosting tradicional (cPanel/FTP).** Subir el contenido de esta carpeta a `public_html`.
Las URLs de canonical/OG/sitemap ya apuntan a `https://mundoonlinecr.com`.

## Pago con tarjeta (Tilopay)
Aparece como **«Pagar con tarjeta · Tilopay»** en el cajón del pedido y en la vista rápida, junto a WhatsApp. Tiene tres modos
(`cardMode` en `assets/js/config.js`):
* `'soon'` (actual): se muestra como «Próximamente» porque aún no hay credenciales.
* `'demo'`: simula el flujo completo (checkout → pago aprobado) sin pedir tarjeta ni cobrar; sirve para revisarlo con el cliente.
* `'live'`: cobra de verdad. Requiere publicar en **Netlify** (las funciones no corren en GitHub Pages) y cargar en
  *Environment variables*: `TILOPAY_API_KEY`, `TILOPAY_API_USER`, `TILOPAY_API_PASSWORD` (ver `.env.example`; las credenciales
  salen de admin.tilopay.com → *Tilopay Checkout*, con modo de pruebas). El servidor hace `login` → `processPayment`, redirige
  al checkout de Tilopay y vuelve a `/gracias.html` (`code=1` = aprobado).
Los precios siempre se recalculan en el servidor desde `products.json` y el SKU viaja en el detalle del pago. ONVO Pay también
está implementado (`payments.onvo: true`, llaves `ONVO_SECRET_KEY` y `ONVO_PUBLIC_KEY`). Falta una prueba real con
credenciales de pruebas y validar el retorno/webhook de la pasarela antes de despachar.

## Marca
Logo vectorial con texto a trazos (`assets/logo/*.svg`), favicon, `og-image.jpg` e íconos PWA. El coral lleva texto azul
petróleo para cumplir contraste. Respeta `prefers-reduced-motion`.
