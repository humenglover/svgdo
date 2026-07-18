---

## SVG no es solo estático

![Article Illustration](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80)

La mayoría piensa en SVG como "un PNG que no se pixela". Pero SVG puede moverse.

Con animación CSS, puedes hacer que un icono gire, cambie de color, rebote o se transforme — sin GIF ni video.

---

## Tres formas de animar SVG

### 1. Animación CSS (la más fácil)

```css
.icon { animation: spin 2s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

### 2. Transición CSS (efectos interactivos)

```css
.icon:hover {
  fill: #3b82f6;
  transform: scale(1.2);
  transition: all 0.3s ease;
}
```

---

## Ejemplo real: Un loader giratorio

```html
<svg class="spinner" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="10" fill="none"
          stroke="#3b82f6" stroke-width="3"
          stroke-dasharray="31.4 31.4"/>
</svg>
```

```css
.spinner { animation: rotate 1s linear infinite; }
@keyframes rotate { 100% { transform: rotate(360deg); } }
```

Así de simple.

---

## Consejos de rendimiento

- Prioriza `transform` y `opacity` — solo activan composición, no layout
- Evita animar `width`/`height`
- Usa `will-change` para optimizar
- Para animaciones complejas, usa `requestAnimationFrame` con JavaScript

Pruébalo en nuestro editor SVG: carga un icono, añade animación CSS en la vista de código.
