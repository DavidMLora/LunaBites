# Identidad y procedencia de recursos

## Originales

- `public/images/logo-officiel.png`: imagen horizontal adjunta por el usuario, copiada sin modificar. La grafía del logotipo es **LunaBite**; los contenidos del proyecto utilizan el nombre solicitado **Luna Bites**.
- `public/images/moon-cookie.png`: isotipo adjunto, conservado como recurso disponible.
- `public/images/seal-official.png`: sello adjunto, conservado como recurso disponible.
- `public/images/seal-presentation.png`: imagen original X8 extraída de la primera página de la presentación `LUNA BITES.pptx.pdf`. Mantiene su transparencia y sus dimensiones originales.
- `public/images/valeriana.png`, `melisa.png`, `pasiflora.png`: imágenes X21, X23 y X24 extraídas de la página 5 del PDF, sin redibujar ni reemplazar.

La extracción fue de imágenes embebidas, no de capturas recortadas. No se utilizan imágenes descargadas de Pinterest. Los dos enlaces de inspiración no fueron accesibles desde la herramienta de consulta.

## Tipografía y color

Los recursos de fuente del PDF contienen Georgia, Georgia-Italic, Georgia-Bold y Georgia-BoldItalic. La web utiliza Georgia como fuente principal para títulos e identidad, con la familia serif del sistema como alternativa. Los controles y textos de apoyo utilizan Segoe UI para favorecer la lectura.

La página usa la paleta de referencia del encargo. Se verificó el crema `#F4F0E9` en las instrucciones de color del PDF y se utilizó ese valor en lugar de la aproximación `#F4F0E8`. No se proporcionó una presentación editable que permitiera verificar nombres o tokens de marca. La fuente central de color es `src/styles/tokens.css`.

## Visual conceptual generado

- Archivo: `public/images/cookies-concept.webp`.
- Herramienta: ImageGen integrada, modo de generación de imagen nueva; sin API ni CLI alternativa.
- Conversión: PNG original a WebP, calidad 88, sin cambios de contenido.
- Uso: portada, sección de producto e imagen del paquete individual. Se indica **imagen conceptual** y que la forma final está por definir.
- No constituye fotografía de un producto comercial, evidencia de composición, presentación o empaque definitivo. Las plantas del decorado son ambientación, no una identificación botánica de ingredientes.

Prompt final utilizado, literal:

> Use case: product-mockup. Asset: conceptual product still life for Luna Bites, Mexican botanical butter cookies, midnight garden website. Make a premium editorial photorealistic still-life, portrait composition 4:5. A matte cream handmade ceramic plate with several golden butter cookies in crescent moon shapes, realistic crumbly baked texture and subtle visible butter-cookie pores, NO chocolate chips, no oat flakes. Plate sits on textured navy blue linen on a dark midnight blue #132548 surface. Delicate botanical sprigs with small pale lavender flowers and muted sage green leaves frame just the lower left and upper right edges, plenty of quiet dark space. Soft warm angled moonlike studio light from upper left, fine natural shadows, tactile materials. A small folded cream linen napkin partly under plate. Sophisticated intimate nighttime food photography, warm gold, midnight blue, cream, sage and lavender palette only. No text, logos, packaging, lettering, watermark, people, invented benefit claims. This is concept imagery, not a photograph of an existing product.

## Fuentes informativas en ciencia

- [NCCIH: Valeriana](https://www.nccih.nih.gov/health/valerian).
- [EMA: Melissa officinalis](https://www.ema.europa.eu/en/medicines/herbal/melissae-folium).
- [NCCIH: Pasiflora](https://www.nccih.nih.gov/health/passionflower).
- [Universidad de Ciencias Agrícolas y Medicina Veterinaria de Cluj-Napoca: producción y composición de hidrolatos](https://journals.usamvcluj.ro/index.php/horticulture/article/view/15253).

Los textos son explicaciones originales, sin reproducir pasajes extensos ni extrapolar beneficios clínicos al producto. Los enlaces figuran también en `/ciencia`.
