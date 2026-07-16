---

## Por qué importa un buen diseño de iconos

Los iconos son el "lenguaje silencioso" de las interfaces. Un buen conjunto de iconos hace que un producto se vea profesional y confiable.

---

## Sistema de cuadrícula para iconos

Los iconos deben diseñarse en una cuadrícula de píxeles estándar, generalmente **24×24**:

```html
<svg viewBox="0 0 24 24" width="24" height="24">
```

En una cuadrícula de 24×24, el área de contenido es 20×20 con 2px de relleno interior.

---

## Especificaciones de trazo

Para iconos UI, **trazo de 2px** es el estándar más común:

```html
stroke-width="2"
```

Usa `stroke-linecap="round"` y `stroke-linejoin="round"`.

---

## Estrategia de color: usa `currentColor`

En lugar de codificar valores, hereda el color del texto:

```html
<svg fill="none" stroke="currentColor" stroke-width="2">
```

Así los iconos se adaptan automáticamente al color del componente padre, incluso en modo oscuro.

---

## Lista de verificación de exportación

- [ ] ¿viewBox es de tamaño estándar?
- [ ] ¿Todos los iconos usan el mismo grosor de trazo?
- [ ] ¿Usas `currentColor`?
- [ ] ¿Sin atributos `id` o `data-*` innecesarios?
- [ ] ¿Código optimizado?

Usa nuestro editor SVG para las comprobaciones finales.
