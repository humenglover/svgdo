---

## SVG no es una imagen

![Article Illustration](https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80)

Mucha gente trata el SVG como una imagen, lo mete en una etiqueta img y se olvida. Pero un SVG dentro de un img está muerto. No puedes acceder a sus elementos internos, y menos aún asignar un evento de clic a un path. Para darle vida, necesitas incluirlo en línea en el HTML.

Una vez en línea, cada elemento SVG es un nodo DOM real. Puedes seleccionarlo con querySelector, agregarle eventos con addEventListener y modificar sus atributos con setAttribute. Esa es la base.

## Paso 1: Asignar un identificador a cada elemento

Los SVG que descargas o que un diseñador te exporta desde Figma normalmente no tienen IDs, o peor, tienen IDs como "Capa 1 copia 3" que se repiten. Primero hay que darle a cada elemento un identificador único.

Analiza el SVG, recorre el árbol DOM e inyecta un data-editor-id en cada elemento manipulable (path, rect, circle, ellipse, polygon, line, g). Al mismo tiempo, recolecta los atributos en un array para usarlos después en el panel de propiedades.

No toques los elementos dentro de defs, clipPath o mask: son definiciones de renderizado, no formas que el usuario pueda manipular. Los elementos g sí deben incluirse porque muchos SVG aplican transform a g en lugar de a formas individuales.

## Paso 2: Clic para seleccionar, más difícil de lo que parece

Los elementos SVG en línea soportan eventos de clic de forma nativa. La trampa está en el burbujeo de eventos. Haces clic en un path, el evento burbujea al g padre, luego al svg exterior. Si pusiste un manejador en el svg para deseleccionar, el clic del elemento deselecciona lo que acabas de seleccionar.

Solución: llama a stopPropagation en el manejador del elemento. No pongas la lógica de selección a nivel de svg.

Otro detalle: los paths con trazo muy fino son difíciles de clicar. Con stroke-width de 1px es casi imposible acertar. Añade una zona de amortiguación transparente de unos 10px alrededor del elemento.

## Paso 3: Arrastrar, todo es cuestión de coordenadas

La mecánica del arrastre es sencilla: pointerdown registra el inicio, pointermove calcula la diferencia, pointerup confirma. Lo difícil son las coordenadas.

La posición del ratón está en el espacio de pantalla. Los elementos SVG viven en el espacio de coordenadas SVG. La relación depende del viewBox, el nivel de zoom y los transform de cada grupo padre. Si usas diferencias en bruto de la pantalla, los elementos salen volando.

La solución: en cada pointermove, usa getScreenCTM para obtener la matriz de transformación actual, convierte las coordenadas de pantalla a coordenadas internas SVG y luego calcula la diferencia.

Los grupos anidados me costaron muchas horas. Un path puede estar dentro de tres niveles de g, cada uno con su propio transform. Usa el CTM del padre inmediato. Si el elemento está dentro de un g, llama a getScreenCTM en ese g, no en la raíz svg.

## Paso 4: Tres formas de resaltar

**Cambiar colores.** Selecciona un elemento, cambia su stroke de negro a azul. El problema: al deseleccionar no puedes restaurar el color original porque no lo guardaste.

**Usar filtro CSS.** Aplica filter: drop-shadow al elemento seleccionado para un efecto de brillo. No modificas ningún atributo original. Al deseleccionar, solo quitas el filtro.

**Usar una superposición.** Coloca un div con posición absoluta encima del SVG. Cuando se selecciona un elemento, dibuja un rectángulo discontinuo en la superposición basado en getBoundingClientRect. Como la superposición está fuera del sistema de coordenadas SVG, el zoom no la afecta.

## Paso 5: Editar atributos, y por qué style gana

Después de seleccionar, el usuario quiere cambiar fill o stroke. Un setAttribute ingenuo parece obvio. Pero muchos SVG (especialmente de Figma) guardan los estilos en el atributo style, no como atributos independientes. Y style tiene prioridad.

Si haces setAttribute('fill', 'blue') en un elemento con style="fill: red", nada cambia visiblemente. Primero verifica el atributo style. Si la propiedad existe en style, elimínala de style, luego haz setAttribute.

## Paso 6: Construir un diagrama de flujo interactivo

Con selección, arrastre y edición de atributos funcionando, un diagrama de flujo interactivo es sobre todo lógica de negocio por encima.

Los nodos son rects o circles. Las aristas son paths. El arrastre de nodos ya está resuelto. Las aristas necesitan seguir a los nodos: mantén un mapeo nodo-arista y recalcula el atributo d de los paths conectados después de cada arrastre.

Para los clics en aristas usa dos capas. Un path transparente y grueso maneja los clics. Un path visible y fino maneja la visualización.

Apila todo esto junto y tienes un editor SVG funcional. El editor en svgdo.com está implementado exactamente así. Código abierto en GitHub.
