#!/usr/bin/env python3
"""Genera las imágenes optimizadas del sitio.

  python3 tools/build-images.py        (requiere: pip install pillow)

Lee tools/images.json (nombre, archivo en tools/src/, recorte opcional, texto alternativo y crédito) y escribe:
  assets/img/<nombre>-<ancho>.webp   varios anchos para srcset
  assets/js/images.js                registro (ancho, alto, anchos, color, alt) que usa el sitio
  assets/img/CREDITS.md              origen y licencia de cada foto

Para agregar una foto: copia el original a tools/src/, añade su entrada en tools/images.json y ejecuta el script.
Los recortes usan "ref": el ancho de referencia en que se midieron las coordenadas [izq, arriba, der, abajo].
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
cfg = json.loads((ROOT / "tools" / "images.json").read_text(encoding="utf-8"))
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("*.webp"):
    old.unlink()

registry, credits = {}, []
for it in cfg["images"]:
    im = ImageOps.exif_transpose(Image.open(ROOT / "tools" / "src" / it["src"])).convert("RGB")
    if "crop" in it:
        s = im.width / it["ref"] if it.get("ref") else 1
        im = im.crop(tuple(round(v * s) for v in it["crop"]))
    w, h = im.size
    widths = sorted({x for x in cfg["widths"] if x < w} | {min(w, max(cfg["widths"]))})
    for tw in widths:
        th = round(h * tw / w)
        im.resize((tw, th), Image.LANCZOS).save(OUT / f'{it["name"]}-{tw}.webp', "WEBP", quality=cfg["quality"], method=6)
    r, g, b = im.resize((1, 1), Image.BOX).getpixel((0, 0))
    registry[it["name"]] = {"w": min(w, max(cfg["widths"])), "h": round(h * min(w, max(cfg["widths"])) / w), "v": widths,
                            "c": "#%02x%02x%02x" % (r, g, b), "alt": it["alt"]}
    credits.append(f'| `{it["name"]}` | {it["credit"]} |')

(ROOT / "assets" / "js" / "images.js").write_text(
    "/* Generado por tools/build-images.py · no editar a mano */\nwindow.MO_IMAGES = "
    + json.dumps(registry, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
(OUT / "CREDITS.md").write_text(
    "# Créditos de imágenes\n\nFotos de productos: publicaciones de Instagram del propio negocio (@mundoonlinecostarica).\n"
    "Fotos de ambiente: [Pexels](https://www.pexels.com/license/), uso comercial libre y sin atribución obligatoria.\n\n"
    "| Imagen | Origen |\n|---|---|\n" + "\n".join(credits) + "\n", encoding="utf-8")
total = sum(f.stat().st_size for f in OUT.glob("*.webp"))
print(f"{len(registry)} imágenes · {len(list(OUT.glob('*.webp')))} archivos · {total/1024/1024:.1f} MB")
