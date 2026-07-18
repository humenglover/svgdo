---

## ¿Por qué tu SVG es tan grande?

![Article Illustration](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80)

¿Alguna vez exportaste un icono simple de Figma o Illustrator y terminaste con un archivo de decenas de KB?

El problema no es tu diseño — es **la hinchazón que las herramientas de diseño inyectan en los SVG exportados**. Figma añade IDs de componente y metadatos. Illustrator escribe números de punto flotante ultra-precisos (6+ decimales) en cada trazado.

---

## ¿Cuánto se puede ahorrar?

| Fuente | Original | Optimizado | Reducción |
|--------|----------|------------|-----------|
| Figma | 8.2 KB | 2.1 KB | 74.4% |
| Illustrator | 15.6 KB | 3.4 KB | 78.2% |
| Icono descargado | 4.8 KB | 1.2 KB | 75.0% |

**Reducción promedio: 70-80% del tamaño del archivo.**

---

## Métodos de optimización

### Método 1: Optimización con un clic

Abre el editor SVG, pega tu código, elige modo "Seguro" o "Agresivo", y haz clic en Optimizar — listo en segundos.

- **Modo seguro**: Solo elimina comentarios y declaraciones XML
- **Modo agresivo**: Simplifica trazados, elimina grupos vacíos, comprime espacios

### Método 2: Optimización manual

Si te sientes cómodo con el código SVG:
1. Elimina declaraciones `<?xml>` y comentarios
2. Elimina atributos `id` y `data-*` no utilizados
3. Redondea coordenadas a 1-2 decimales
4. Compara el renderizado antes/después

¡Pruébalo ahora en nuestro editor SVG!
