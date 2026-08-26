---

# Interacción SVG + JS: Gráficos Vectoriales en los que se puede Hacer Clic, Arrastrar y Resaltar

Cuando recibes el encargo de crear "gráficos interactivos" (como un mapa de topología de una sala de servidores, un sistema de asientos de un teatro o un simple editor de pósteres en línea), ¿cuál es tu primera reacción?

Para muchos, el primer instinto es: "Usemos Canvas", o simplemente incluir una enorme biblioteca de gráficos de terceros (como Fabric.js, Konva, etc.).

Pero en realidad, si solo necesitas implementar <strong>clics, arrastres y resaltados de elementos</strong>, SVG nativo combinado con JavaScript puro es una herramienta increíblemente afilada y eficiente. Sin dependencias pesadas, sin contextos de renderizado complejos, porque SVG es fundamentalmente solo el DOM.

Hoy, vamos a hablar sobre cómo programar a mano un motor SVG interactivo desde cero. No te asustes; la lógica es en realidad increíblemente sencilla.

---

## Rompiendo el Mito: SVG NO es una Imagen

Estamos demasiado acostumbrados a usar SVG como una imagen: `<img src="logo.svg" />`. Si haces esto, el SVG está muerto. El navegador lo trata como un bloque cerrado de píxeles; no puedes acceder a nada en su interior, y mucho menos vincular un evento de clic a una ruta específica.

Para que SVG cobre vida, la primera regla es: <strong>Debes insertarlo (inline) en el HTML</strong>.

```html
<div id="editor">
  <svg viewBox="0 0 800 600">
    <circle cx="100" cy="100" r="50" fill="red" />
    <path d="M..." fill="blue" />
  </svg>
</div>
```

Una vez que incrustas el código directamente en el árbol DOM, ocurre la magia. Ese `<circle>` y `<path>` no son diferentes de las etiquetas estándar `<div>` o `<button>`. Puedes capturarlos usando `document.querySelector('circle')`, vincular oyentes con `addEventListener`, e incluso pasar el ratón por encima (hover) con CSS.

Esta es la única base para toda nuestra interactividad.

---

## Estableciendo un Sistema de Identidad: Emitiendo "Tarjetas de Identidad" a los Elementos

Supongamos que recibes un SVG increíblemente complejo exportado por un diseñador desde Figma, con cientos de rutas entrelazadas. Es probable que estos elementos no tengan `id`, e incluso si los tienen, serán nombres exasperantes como `Rectangle_12_copy`.

Si estamos construyendo un editor, ¿cómo sabe tu código qué elemento ha hecho clic el usuario?

Antes de lanzar el SVG al contenedor para el renderizado, necesitamos escribir un script de recorrido simple para etiquetar todas las etiquetas verdaderamente visuales (como `path`, `rect`, `circle`, `ellipse`, `polygon`, `line`) con un identificador único, como `data-editor-id`.

![Demostración del etiquetado automático de elementos SVG con data-editor-id](/content/images/interaction-code.png)

> <strong>Advertencia de Trampa:</strong> Nunca toques los elementos dentro de `<defs>`, `<clipPath>`, o `<mask>`. Estas son capas de definición de renderizado de SVG, no entidades físicas que el usuario pueda arrastrar por el lienzo. Además, la etiqueta `<g>` (Grupo) debe manejarse con cuidado; muchas transformaciones complejas (`transform`) se adjutan a grupos, y cuando arrastramos, a menudo arrastramos todo el grupo junto.

---

## Selección por Clic: Burbujeo Molesto y Áreas Invisibles

Debido a que los elementos SVG son nodos DOM, vincular eventos de clic a ellos parece tan simple como beber agua:

```javascript
element.addEventListener('pointerdown', (e) => {
  console.log('¡Fui seleccionado!', e.target);
});
```

Pero en la práctica, inmediatamente caerás en dos trampas.

<strong>La primera trampa es el burbujeo de eventos (event bubbling).</strong> 
Cuando haces clic en una ruta, el evento se dispara primero en este `<path>`, luego burbujeea hasta su `<g>` padre, y finalmente llega al `<svg>` más externo. Por lo general, vinculamos un evento de clic al `<svg>` para "deseleccionar" (hacer clic en un espacio vacío borra la selección). Si no detienes el burbujeo (`e.stopPropagation()`), en el momento en que el usuario hace clic en un elemento, el evento burbujeea a la capa superior, activando instantáneamente la deselección. Miras la pantalla, sintiendo que tu clic se desvaneció en el aire.

<strong>La segunda trampa es "las líneas finas son imposibles de clicar".</strong> 
Si hay una línea extremadamente fina con `stroke-width="1"`, el usuario debe poseer una precisión de ratón a nivel de francotirador para hacer clic en ella. En SVG, hay una solución increíblemente elegante: superponer una "ruta fantasma" completamente transparente (`stroke="transparent"`) pero muy gruesa (ej. `stroke-width="20"`) diseñada específicamente para atrapar los eventos del ratón.

![Demostración del Mecanismo de Interacción SVG](/content/images/svg-interaction.png)

---

## La Ley Fundamental del Arrastre: Las Coordenadas son los Reyes

Todos conocen la lógica de arrastre de memoria: `pointerdown` registra el punto de inicio, `pointermove` calcula la diferencia (delta), y `pointerup` finaliza la acción.

Pero en SVG, si tomas directamente la diferencia de píxeles del ratón moviéndose en la pantalla (Screen Coordinate) y la aplicas a la fuerza a los atributos `x` e `y` de un elemento SVG, encontrarás que el elemento <strong>vuela instantáneamente fuera del sistema solar</strong>.

¿Por qué? Porque el sistema de coordenadas de la pantalla y el sistema de coordenadas interno de SVG son dos bestias diferentes. SVG tiene su propio `viewBox`, tu página web podría estar ampliada, y el elemento en sí podría estar anidado dentro de varios grupos `<g>` con `transform: scale(0.5)`.

<strong>La única respuesta correcta es usar `getScreenCTM()`.</strong> 

Este es un método nativo proporcionado por SVG, que significa Matriz de Transformación Actual (Current Transform Matrix). Al recuperar la matriz de transformación de coordenadas entre el elemento y sus padres, puedes mapear perfectamente el "movimiento de la pantalla" del ratón al "movimiento de coordenadas interno de SVG".

```javascript
// Obtener la matriz de transformación del elemento actual
const ctm = element.getScreenCTM();
// Convertir la diferencia de pantalla a la diferencia real de coordenadas SVG
const svgDx = screenDx / ctm.a;
const svgDy = screenDy / ctm.d;
```

Esta es la lógica central del motor de arrastre que construimos para [SVG do.](/es). Siempre que el cálculo de la matriz sea correcto, no importa cuán profundamente anidado o ampliado esté el lienzo, el elemento se pegará a tu cursor sin fallas.

---

## Implementación Elegante de los Estados de Resaltado

Cuando un usuario selecciona un elemento, tienes que dar algún tipo de respuesta visual, ¿verdad?

![Demostración del Mecanismo de Selección y Resaltado SVG](/content/images/clean-highlight-demo.png)

El enfoque más brutal es cambiar directamente su `stroke` (trazo) a un azul brillante. Pero esto destruye el color original del diseñador, y tienes que recordar laboriosamente el color original para restaurarlo más tarde.

<strong>Un enfoque mucho más elegante es: Dibujar un Cuadro Delimitador (Bounding Box).</strong>

SVG proporciona una API increíblemente poderosa: `getBoundingClientRect()`. Una vez que seleccionas un elemento, generas dinámicamente un elemento `<rect>` sin relleno y con un trazo azul brillante, superponiéndolo encima del elemento original. Incluso puedes dibujar cuatro pequeños puntos en las esquinas de este cuadro delimitador, creando los clásicos tiradores de redimensionamiento.

## Conclusión

¿Lo ves? Todas estas interacciones nunca abandonaron las API de DOM y las matrices matemáticas más fundamentales. Deshazte de esas pesadas bibliotecas de terceros, comprende profundamente la lógica subyacente de SVG, y podrás codificar a mano un mini Figma en el navegador tú solo. Ve a intentarlo; te maravillarás absolutamente con el poder de las tecnologías web nativas.
