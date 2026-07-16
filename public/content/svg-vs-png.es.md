---

## Vector vs Raster: Cuándo usar cada uno

"¿Debería usar SVG o PNG?" — una pregunta que todo diseñador se hace.

La respuesta no es blanco o negro. Cada formato tiene su caso de uso ideal.

---

## Diferencias principales

| Aspecto | SVG | PNG |
|---------|-----|-----|
| Tipo de imagen | Vector (matemáticas) | Raster (píxeles) |
| Escalado | Infinito, sin pérdida | Se ve borroso al ampliar |
| Tamaño de archivo | Mínimo para gráficos simples | Proporcional a la resolución |
| Transparencia | Nativa | Nativa |
| Animación | CSS/JS/SMIL | Solo APNG |

---

## Cuándo usar SVG

- **Iconos y elementos UI** — El terreno natural de SVG
- **Visualización de datos** — ECharts, D3.js usan SVG internamente
- **Diseño responsive** — Un archivo funciona en todas las resoluciones
- **Elementos interactivos** — Cambios de color al pasar el ratón

## Cuándo usar PNG

- **Fotografías** — Los gradientes continuos no se pueden reproducir en SVG
- **Gradientes y sombras complejos** — El código SVG se vuelve enorme
- **Soporte de navegadores antiguos** — Para IE11 y anteriores (cada vez más raro)

Convierte entre SVG y PNG en cualquier momento con nuestro editor.
