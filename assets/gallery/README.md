# Galería

`gallery.json` define el mosaico. Cada entrada puede ser:

* **Foto optimizada** (recomendado): `{ "img": "nombre", "title": "Texto", "span": "big|tall|wide" }`, donde `nombre` existe en
  `tools/images.json`. Para añadir fotos nuevas: copia el original a `tools/src/`, agrega su entrada en `tools/images.json`
  y ejecuta `python3 tools/build-images.py`.
* **Archivo suelto**: `{ "src": "assets/gallery/mi-foto.jpg", "alt": "Descripción", "title": "Texto" }` (copia el JPG aquí).

Si `gallery.json` está vacío, el sitio muestra mosaicos animados de la marca.
