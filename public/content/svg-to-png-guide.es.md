---

## ¿Por qué convertir SVG a PNG?

SVG es genial, pero no para todos los casos:

- **Firmas de correo**: La mayoría de clientes no soportan SVG
- **Avatares de redes sociales**: Algunas plataformas rechazan SVG
- **Presentaciones**: Soporte limitado de SVG en Office
- **Capturas de App Store**: Requieren PNG de resolución fija

---

## Tres cosas a verificar antes de convertir

### 1. ¿La resolución es suficiente?
PNG es raster — la resolución es fija. **Exporta a 2x o 4x** para pantallas de alta densidad.

### 2. ¿Necesitas transparencia?
- **Transparente**: Ideal para superponer iconos
- **Fondo blanco**: Para impresión o documentos
- **Fondo negro**: Para interfaces oscuras

### 3. ¿Los colores son correctos?
`currentColor` puede perderse al exportar a PNG. Reemplázalo con valores concretos antes de exportar.

---

## Conversión con herramienta online

1. Carga el SVG (subir / biblioteca / pegar código)
2. Elige escala (1x/2x/4x) y color de fondo
3. Haz clic en "Exportar PNG"

**Todo el proceso ocurre en tu navegador. El código SVG nunca se sube a ningún servidor.**

¡Pruébalo ahora!
