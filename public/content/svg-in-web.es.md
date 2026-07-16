---

## Por qué importa el método de incrustación

El mismo icono SVG puede comportarse de manera completamente diferente según cómo lo incrustes.

---

## 5 métodos de incrustación

### 1. SVG en línea
Escribe el código SVG directamente en tu HTML.

**Ventajas**: Control total con CSS, animación, sin peticiones HTTP extra
**Desventajas**: HTML más pesado, no se puede cachear

### 2. Etiqueta `<img>`
**Ventajas**: Lo más simple, cacheable, lazy loading
**Desventajas**: No se puede cambiar el color con CSS

### 3. Fondo CSS
**Ventajas**: Ideal para iconos decorativos
**Desventajas**: Sin interacción

### 4. Data URI
**Ventajas**: Sin peticiones extra
**Desventajas**: No se cachea, URLs largas

### 5. Sprite SVG
**Ventajas**: Una petición para todos los iconos
**Desventajas**: Requiere herramientas de build

---

## Mejores prácticas

- **Logos e iconos principales → SVG en línea**
- **Iconos decorativos → Fondo CSS**
- **Bibliotecas grandes → Sprite SVG**
- **Imágenes de contenido → `<img>`**

Abre un icono en la vista de código de nuestro editor SVG para copiar el código en línea directamente.
