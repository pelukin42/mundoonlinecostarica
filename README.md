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

## Cómo funciona el pedido (hoy)
El cliente agrega productos y toca **«Pedir por WhatsApp»**: se abre el chat de **8997‑7020** con la lista, los **códigos
SKU** y el total. Ahí se coordina el pago (tarjeta, SINPE Móvil o efectivo) y la entrega, como ya hace el negocio.
No hay cobro con tarjeta en la web porque el cliente no lo pidió; queda preparado como **fase 2** (ver abajo).

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

## Fase 2 (opcional): cobrar con tarjeta
Ya están implementadas y probadas con respuestas simuladas, pero **desactivadas** (`payments` en `config.js`).
Para activarlas: publicar en Netlify, poner `true` en **una** pasarela, cargar las llaves de `.env.example` en
*Environment variables* y probar en modo pruebas.
* **ONVO Pay** (`onvo-intent.js`): `ONVO_SECRET_KEY`, `ONVO_PUBLIC_KEY` (llaves `onvo_test_…` y luego `onvo_live_…`).
* **Tilopay** (`tilopay-checkout.js`): `TILOPAY_API_KEY`, `TILOPAY_API_USER`, `TILOPAY_API_PASSWORD`.
Los precios siempre se recalculan en el servidor desde `products.json`; el SKU viaja en el detalle de cada pago.
Falta una prueba real con llaves de pruebas y validar el retorno/webhook de la pasarela elegida antes de despachar.

## Marca
Logo vectorial con texto a trazos (`assets/logo/*.svg`), favicon, `og-image.jpg` e íconos PWA. El coral lleva texto azul
petróleo para cumplir contraste. Respeta `prefers-reduced-motion`.
