# Ingeniería de Rendimiento SVG: Editando Archivos Vectoriales de 100,000 Nodos en el Navegador Sin Congelarse

Déjenme contarles el momento en que nuestro editor intentó cometer un asesinato por mapa.

Un usuario soltó un archivo SVG. Nada inusual en la superficie: 750 kilobytes, un documento XML, de esos que adjuntas a un correo sin pensarlo dos veces. Pero cuando nuestro motor de análisis le puso las manos encima, los números fueron aleccionadores: **3,143 elementos `<path>`. 9,431 atributos `d`. 9,436 líneas de marcado.** Cada uno de los condados de Estados Unidos, cada uno su propio pequeño polígono, cada polígono su propio nodo DOM a punto de nacer.

El archivo se renderizó. Luego el usuario agarró el mapa para arrastrarlo por el lienzo. Y la pestaña… la pestaña recordó que era una página web y empezó a jadear por aire como un pez en el muelle. No fue un cuelgue — peor. De ese tipo de velocidad de cuadros donde puedes contar los fotogramas con los dedos. De ese tipo donde el cursor arrastra el mapa y el mapa lo alcanza tres segundos después, como una mala videollamada con un satélite.

Me quedé mirando la pantalla y pensé: *esto es un archivo de 750KB. Un GIF de un gato escribiendo es más grande que esto.* ¿Cómo es posible que el navegador se esté ahogando?

![La cabeza de Homero explotando](https://i.giphy.com/26gseQZ5oUvc2mkFi.gif)
*Yo, dándome cuenta de que un archivo de texto de 750KB contiene suficientes nodos DOM para poner a un navegador de rodillas.*

La respuesta — que me tomó un tiempo y mucho profiling (análisis de rendimiento) aceptar por completo — es que **SVG tiene un secreto sucio: no es un formato de imagen. Es un formato de DOM.** Cada forma es un elemento DOM real y vivo, con costos de estilo, layout y pintado. Y como toda tecnología cargada de DOM, tiene un acantilado. Esta publicación es la autopsia de ingeniería de ese acantilado: por qué un archivo vectorial de 750KB puede destrozar una pestaña, y las estrategias exactas — culling por viewport, LOD, diffing basado en AST, tuberías de actualización — que permiten a SVGDO editar un archivo vectorial de 100,000 nodos sin que el navegador se declare en bancarrota.

## La Matemática de los Nodos: Todo Elemento SVG Es un Ciudadano del DOM

Empecemos con el balance físico, porque esta es la parte en la que todos se equivocan.

Un elemento SVG no es "una forma". Es un nodo DOM — MDN es explícito al respecto: SVG fue *diseñado específicamente para funcionar bien con otros estándares web, incluyendo CSS, DOM y JavaScript* ([fuente](https://developer.mozilla.org/en-US/docs/Web/SVG)). Un `<path>` es un `SVGPathElement`. Tiene estilo, clase, listeners de eventos, estilos calculados, un lugar en el árbol de renderizado. Participa en el recálculo de estilos, el layout y el pintado igual que un `<div>` — a menudo de forma más costosa, porque su geometría son curvas arbitrarias, no rectángulos.

Así que cuando alguien te dice que "SVG es liviano", lo que quiere decir es que *un* SVG es liviano. El formato escala de maravilla. El **DOM** no. Aquí está la escala, con puntos de referencia reales:

![Costo de los nodos SVG](/content/images/articles/svg-dom-cost.svg)
*La escalera de nodos: 1 nodo para un ícono, ~800 para una página típica (el umbral de advertencia de Lighthouse), 3,143 para un mapa real de condados, más de 10,000 donde Lighthouse empieza a reprobarte, 100,000 para archivos industriales. Cada peldaño multiplica la factura de estilo/layout/pintado.*

Los puntos de referencia importan, así que déjenme citarlos como corresponde. La auditoría "Evita un tamaño de DOM excesivo" de Google Lighthouse ([fuente](https://developer.chrome.com/docs/lighthouse/performance/dom-size/)) **advierte cuando el body de la página tiene más de ~800 nodos y arroja error por encima de ~1,400** — y eso es para *páginas web completas*, no para un solo SVG. La propia justificación de la auditoría enumera tres formas en que un DOM grande mata el rendimiento: bytes de red desperdiciados en nodos invisibles, recomputación constante de posiciones y estilos de nodos durante la interacción, y presión de memoria por scripts que retienen referencias a nodos.

Nuestro pequeño mapa de condados está en 3,143 nodos — ya supera por 2.2× la línea de error de Lighthouse, y es solo una capa de un documento editable. Ahora añade una segunda capa, algunas etiquetas de texto, una forma de marca de agua, una capa de contorno para los handles de selección… y el árbol DOM de tu *sesión de edición* tiene el tamaño de un sitio web pequeño, excepto que cada nodo es una ruta bézier que se re-laya en cada interacción. Esa es la física del problema. El navegador no es lento; le pediste que mantuviera un bosque y luego lo pinchaste en cada fotograma.

Hay un dato más contraintuitivo: **la especificación SVG no impone ningún límite de longitud al atributo `d`.** La referencia de atributos de MDN documenta la sintaxis, no un presupuesto de líneas, y ningún navegador ha publicado jamás una declaración oficial de "más allá de este número de comandos dejamos de intentarlo". Eso significa que el techo de complejidad no lo fija la especificación — lo fija la paciencia del motor de renderizado. Puedes escribir legalmente una ruta con cientos de miles de comandos y luego ver cómo la fase de pintado sube de 16ms a 1.6 segundos — sin error, sin advertencia, solo lentitud pura. Los documentos "legales pero letales" son exactamente la razón por la que un editor tiene que domarlos antes de que lleguen al DOM.

## Por Qué "Cambiar Solo Una Cosa" Es Tan Costoso

Aquí está la trampa que mata a los editores SVG ingenuos: **el costo de una edición no es proporcional a la edición. Es proporcional al árbol.**

Cuando el usuario arrastra un nodo, cambia un color de trazo o mueve un punto de una ruta, la tubería del navegador tiene que volver a ejecutar tres fases:

1. **Recálculo de estilo** — recorre el árbol, empareja selectores, recalcula los estilos calculados. El costo escala con el número de nodos × la complejidad de los selectores.
2. **Layout** — recalcula la geometría. En SVG, los cambios de geometría se propagan a los descendientes (y con ciertas características, a los *ancestros*), así que un cambio en la raíz puede re-layar todo lo que está debajo.
3. **Pintado (Paint)** — rasteriza. Para `<path>`, esto significa aplanar curvas bézier, aplicar anti-aliasing a los bordes, rellenar la región. Las rutas complejas son caras aquí — una sola cadena `d` con diez mil comandos es un nodo con un costo de pintado aterrador.

Ahora haz eso en cada fotograma de una interacción de arrastre. La implementación ingenua — "en cada cambio, actualiza el DOM y deja que el navegador lo resuelva" — ejecuta toda esta tubería por evento. Con 3,000 nodos es un tartamudeo. Con 30,000, una presentación de diapositivas. Con 100,000, el navegador empieza a preguntarte si estás seguro.

Y aquí está la parte que lo empeora más de lo necesario: **la mayoría de las ediciones ni siquiera tocan el árbol.** Cuando arrastras una forma de (10,10) a (12,14), solo cambiaron las coordenadas de un elemento. Los otros 99,999 nodos están ahí, idénticos, esperando ser reprocesados. El editor ingenuo paga el precio del bosque completo por una sola hoja.

Un ejemplo concreto: el usuario está arrastrando un punto de ancla de una ruta. En el enfoque ingenuo, cada `pointermove` llama directamente a `setAttribute('d', newValue)`, y el navegador inmediatamente re-analiza, re-laya y re-pinta — un arrastre con 120 eventos de movimiento significa 120 ejecuciones completas de la tubería. Pero de esos 120, solo importa la última coordenada; nadie ve jamás los otros 119 valores intermedios. La jugada correcta es acumular las 120 solicitudes y confirmarlas una vez por fotograma — la misma cantidad de trabajo, cien veces menos dolor.

## Primero el AST: No Edites el DOM, Edita el Modelo

Este es el insight arquitectónico que lo salva todo: **la fuente de verdad del editor nunca debe ser el DOM.**

En SVGDO, el archivo se analiza en un **AST** — un árbol de objetos en memoria que representa cada elemento, atributo y comando de ruta — y *toda* la edición ocurre contra ese AST. El DOM es solo una vista. Cuando el usuario cambia un color de trazo, mutamos un nodo en el AST, no un elemento DOM. (Esta es la misma arquitectura de frontend puro que cubrimos en [la publicación sobre la arquitectura de Pictkit](/resources/pictkit-architecture): analizar una vez en memoria, editar en memoria, renderizar deliberadamente.)

¿Por qué importa esto para el rendimiento? Porque un diff de AST es *barato*. Comparar dos árboles de objetos y descubrir "estos tres nodos cambiaron" es trabajo de microsegundos — sin recálculo de estilos, sin layout, sin pintado. El DOM ni siquiera está involucrado todavía. La parte costosa solo ocurre cuando *aplicamos* el diff al DOM real, y en ese punto sabemos exactamente qué nodos cambiaron.

Para un archivo de 100,000 nodos donde el usuario edita una ruta, el diff del AST produce un patch de **1 elemento**. Esa es la diferencia entre "volver a renderizar un bosque" y "actualizar una hoja".

## Culling por Viewport: Nunca Pagues por lo que No Puedes Ver

El AST resuelve el costo de *actualización*. Pero hay un segundo problema, más grande: el costo *inicial y de estado estable*. Si el usuario está mirando un viewport de 1200×800 dentro de un documento de 50,000×30,000 unidades, la gran mayoría del SVG está fuera de pantalla — invisible, y sin embargo sigue consumiendo presupuesto de estilo/layout/pintado en cada fotograma.

La respuesta es el truco más antiguo de los gráficos: **culling por viewport — solo renderiza lo que es visible.**

![Culling por viewport + LOD](/content/images/articles/svg-viewport-culling.svg)
*Un documento de 100,000 nodos, un viewport que muestra ~2,000 de ellos, y un índice quadtree que encuentra esos 2,000 en O(log n). Los otros 98,000 nodos simplemente no existen en lo que respecta al renderizador.*

La pila de implementación, desde lo nativo del navegador hasta las bibliotecas:

- **`content-visibility: auto`** — una propiedad CSS que le dice al navegador que se salte el estilo/layout/pintado de los subárboles fuera del viewport. El artículo de web.dev sobre content-visibility ([fuente](https://web.dev/articles/content-visibility)) midió que el tiempo de renderizado caía de **232ms a 30ms — aproximadamente una aceleración de 7×** en una página con muchas secciones fuera de pantalla. Esta es la versión gratuita y nativa del culling, y cualquier página cargada de SVG debería usarla para subárboles fuera de pantalla.
- **Indexación espacial** — cuando necesitas un control más fino (qué elementos están bajo el cursor, cuáles están en el rectángulo visible), un quadtree es la herramienta estándar. El módulo d3-quadtree ([fuente](https://d3js.org/d3-quadtree)) tiene una API `visit` exactamente para esto: "visita todos los nodos que intersecan un rectángulo". Encontrar los nodos visibles en un documento de 100,000 nodos cae de O(n) a algo así como O(log n).
- **Renderiza el subconjunto visible** — nuestro renderizador recorre el documento una vez, usa el índice espacial para recoger solo los nodos que intersecan el viewport, y construye el DOM a partir de ese subconjunto. ¿Mover (pan) el viewport? Re-consulta, intercambia subárboles. El DOM nunca contiene más que la porción visible del documento.

Los números no son sutiles. Si tu viewport muestra el 2% del documento, el culling hace que el costo de estado estable del navegador sea el 2% de lo que era — *antes* de que toques una sola ruta.

## LOD: Ajusta el Detalle al Zoom

El culling por viewport resuelve el problema espacial. LOD — *level of detail* (nivel de detalle) — resuelve el problema de la *densidad*: un polígono de condado que llena la pantalla al 500% de zoom no significa nada al 5% de zoom, donde son dos píxeles.

La escalera LOD para la edición de SVG:

- **Muy alejado (zoom out)** → renderiza geometría *simplificada*. Colapsa elementos pequeños, fusiona subrutas, usa menos puntos por ruta.
- **Zoom medio** → detalle moderado — conserva la estructura, elimina el ruido.
- **Acercado (zoom in)** → fidelidad total — solo en este punto cargas las rutas originales, sin simplificar.

Esta es la misma lógica de pirámide de detalle que Google Maps y todos los motores de juego han usado durante décadas, y encaja en SVG de maravilla porque **la simplificación de rutas es un problema resuelto**. El algoritmo clásico es Douglas-Peucker (también conocido como Ramer-Douglas-Peucker, RDP) — una simplificación de polilíneas O(n log n) que descarta vorazmente los puntos que se desvían menos de una tolerancia respecto a la curva simplificada. Es geometría computacional de libro de texto, no una función del navegador, así que trátalo como un algoritmo general; pero para "esta ruta de 50,000 puntos se convierte en 5,000 puntos y se ve idéntica con este zoom", es exactamente la herramienta.

Para la cirugía de rutas del día a día, la biblioteca `svgpath` ([github.com/fontello/svgpath](https://github.com/fontello/svgpath)) es nuestra caballito de batalla. Analiza la cadena del atributo `d` (no el XML) y te da una API encadenable para exactamente las transformaciones que un editor necesita — `round(precision)` para cuantizar coordenadas y encoger la cadena, `abs()/rel()` para convertir entre comandos absolutos y relativos (las coordenadas relativas comprimen mejor), `unarc()` para convertir arcos en béziers cuando necesitas un manejo uniforme. Combinado con `svgo` ([github.com/svg/svgo](https://github.com/svg/svgo), más de 22k estrellas) para eliminar metadatos del editor, comentarios y valores por defecto subóptimos, una pasada de "optimizar antes de editar" recorta rutinariamente tanto el tamaño del archivo como la complejidad de nodos antes de que el DOM vea el documento.

La recompensa del LOD: al 10% de zoom, el renderizador sirve rutas simplificadas con una fracción de los nodos originales. Al 100% de zoom, sirve la geometría completa — pero solo para el puñado de rutas dentro del viewport. Densidad y área, ambas domadas.

## La Tubería de Actualización: diff, patch, batch, composite

Hasta ahora: editar el AST, hacer culling al viewport, simplificar por zoom. El último pilar es *cómo* llegan los cambios a la pantalla — porque incluso un patch de 3 nodos puede tartamudear (jank) si lo aplicas mal.

La tubería, en cinco etapas:

1. **AST** — la edición muta el modelo en memoria.
2. **DIFF** — compara el AST antiguo y el nuevo, produce un conjunto de cambios mínimo ("estos 3 atributos en este 1 elemento").
3. **PATCH** — aplica el conjunto de cambios al DOM con llamadas quirúrgicas a `setAttribute`. Sin reconstrucción con `innerHTML`, sin re-análisis, sin "reemplazar todo el SVG".
4. **BATCH (rAF)** — fusiona todo lo que ocurrió desde el último fotograma en una única actualización del DOM, programada con `requestAnimationFrame`. Un arrastre produce 60 eventos/segundo; el DOM se actualiza una vez por fotograma, no 60 veces.
5. **COMPOSITE (GPU)** — pan/zoom mediante `transform` de CSS, que el navegador compone en la GPU sin volver a ejecutar layout ni pintado.

![Tubería de actualización](/content/images/articles/svg-update-pipeline.svg)
*AST → DIFF → PATCH → rAF → GPU. El camino ingenuo re-renderiza todo el árbol por evento; la tubería actualiza exactamente los nodos cambiados, una vez por fotograma, en el compositor.*

Estas no son opiniones — son las propias guías de rendimiento del navegador, del tutorial de optimización de Canvas de MDN ([fuente](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)): *"Renderiza solo las diferencias de pantalla, no todo el estado nuevo"*, *"usa requestAnimationFrame en lugar de setInterval"*, y *"los transforms de CSS son más rápidos porque usan la GPU"*. (Ese tutorial es nominalmente sobre `<canvas>`, pero los principios son universales — se tratan de la tubería de renderizado del navegador, que SVG comparte.)

Una trampa más que vale la pena nombrar: **throttling vs. batching.** Hacer debounce a un evento con `setTimeout(…, 200)` añade latencia percibida y aun así dispara la actualización del DOM en momentos arbitrarios. El batching con rAF dispara exactamente una vez por fotograma, sincronizado con la pantalla — la misma cantidad de trabajo, sin nada del lag. Usa el presupuesto del fotograma, no un temporizador de cocina.

## SVG vs Canvas: Cuándo Admitir la Derrota

Déjenme ser honesto sobre los límites de todo este enfoque, porque un artículo de rendimiento que no te dice cuándo parar es una mentira.

Si tu caso de uso son **decenas de miles de nodos que se mueven todos en cada fotograma** — piensa en un sistema de partículas, un grafo dirigido por fuerzas en vivo con 50,000 nodos, una visualización en tiempo real — SVG es la herramienta equivocada, punto. Canvas existe exactamente para esto: MDN lo describe como la elección para "animaciones, gráficos de juegos, visualización de datos, manipulación de fotos y procesamiento de video en tiempo real" ([fuente](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)), y es una superficie de bitmap de *modo inmediato*: dibuja, presenta, olvida. Sin nodos DOM, sin recálculo de estilos, sin layout por elemento. Para esa carga de trabajo, canvas o WebGL le dan mil vueltas a SVG, y `OffscreenCanvas` incluso te permite renderizarlo fuera del hilo principal.

Pero — y esta es la parte que el grupo de "canvas es más rápido" se salta — canvas renuncia a todo lo que hace que SVG sea *editable*: sin DOM, sin accesibilidad (MDN advierte que el contenido de canvas "no se expone a las herramientas de accesibilidad como lo hace el HTML semántico"), sin estilos CSS para elementos individuales, sin nitidez infinita a cualquier zoom. No puedes inspeccionar una forma de canvas en DevTools, no puedes adjuntar un manejador de clic a un elemento, no puedes dejar que los usuarios editen "una ruta" — es todo solo píxeles en un buffer.

La respuesta honesta de ingeniería para un *editor*: **SVG para la capa editable, interactiva y semántica; canvas (o una vista previa rasterizada) solo cuando domina el rendimiento bruto de píxeles.** Un editor manipula sobre todo *algunos* elementos, no todos a la vez — que es exactamente la carga de trabajo que el modelo DOM de SVG maneja bien una vez que aplicas culling, simplificación y diff. El archivo de 100,000 nodos es sobrevivible en SVG; el *sistema de partículas* de 100,000 nodos no lo es, y no debería serlo.

E incluso si te rindes y apuestas todo a canvas, el cielo del bitmap tiene su propio techo: MDN señala que aunque la mayoría de los navegadores de escritorio permiten canvases de más de 10,000×10,000, los dispositivos iOS los limitan a 4096×4096 ([fuente](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas)) — más allá de eso, los comandos de dibujo fallan silenciosamente. La promesa de "escalabilidad infinita" de los vectores deja de cumplirse en el momento en que rasterizas. Para un editor, ese es un argumento concreto más para mantener viva la capa vectorial.

## Caso Práctico: El Mapa de Condados, Domado

Volvamos al mapa que lo inició todo. Aquí está el archivo real — un SVG auténtico de 750KB de Wikimedia Commons, cada condado de EE. UU. como su propio `<path>` ([fuente](https://commons.wikimedia.org/wiki/File:USA_Counties_with_FIPS_and_names.svg)):

![SVG de condados de EE. UU. — 3,143 rutas](/content/images/articles/svg-counties-sample.svg)
*3,143 rutas, 9,431 atributos `d`, 9,436 líneas, 750KB. Un archivo vectorial "pequeño" completamente ordinario que resulta estar 2.2× por encima del umbral de error de DOM de Lighthouse.*

Esto es lo que le pasa bajo las estrategias anteriores:

1. **Analiza una vez** en un AST (unos 15ms por 750KB en una laptop de gama media — el análisis XML es rápido; nunca fue el cuello de botella).
2. **Haz culling al viewport.** El mapa es de 555×352 unidades; el viewport del editor muestra una porción. El renderizador materializa el DOM solo para la porción visible — unos pocos cientos de rutas como máximo, más una versión simplificada del resto a bajo zoom.
3. **LOD por zoom.** Con zoom hacia afuera, el mapa se renderiza a partir de rutas simplificadas (procesadas con RDP hasta unos pocos cientos de puntos en total); con zoom hacia Kansas, el renderizador intercambia la geometría de fidelidad total para los condados visibles — un puñado de rutas, totalmente detalladas.
4. **Edita mediante diff de AST.** ¿El usuario renombra el título de un condado? Cambia un nodo del AST, se dispara un `setAttribute` del DOM, un batch de rAF. Costo total: microsegundos.
5. **Pan/zoom mediante transform de CSS** — composición por GPU, cero re-layout.

El arrastre que hacía jadear a la pestaña en el camino ingenuo ahora corre a 60fps fijos, porque el DOM de estado estable del navegador es de ~200 nodos en lugar de 3,143, y el costo de actualización por fotograma es *cero* mientras el gesto es solo un transform.

Nada de esto requirió tecnología exótica. Requirió negarse a dejar que el navegador vea el documento completo de una sola vez.

## El Argumento Final

El incidente del mapa de condados me enseñó la misma lección que el grupo de los píxeles aprendió con las imágenes raster, traducida a vectores: **el navegador no es lento. Tu estrategia lo es.** Un archivo de 750KB con 3,143 rutas no es "grande" — es un error de redondeo para el analizador. Solo se convierte en catástrofe en el momento en que le entregas todo al DOM y esperas que el navegador haga de niñera de 3,000 elementos vivos a través de cada interacción.

Las cuatro reglas:

- **Edita el modelo, no el DOM** — un AST en memoria, con diff, parcheado quirúrgicamente.
- **Nunca renderices lo que no puedes ver** — culling por viewport con `content-visibility` y un índice espacial.
- **Ajusta el detalle al zoom** — LOD con simplificación de rutas (RDP, svgpath, svgo) para que la densidad se encoja tan rápido como los píxeles.
- **Haz batch y compón** — coalescencia con rAF, transforms de CSS en la GPU, nunca un re-render completo por evento.

Los archivos vectoriales crecen cada año — planos de pisos, mapas de ciudades, diseños de chips, vistas previas de corte para impresión 3D, exportaciones completas de CAD. El navegador es genuinamente capaz de editar documentos de 100,000 nodos. Solo necesita que dejes de hacer que lo note.

Si estás construyendo tu propio editor vectorial, guarda los diagramas de esta publicación como lista de verificación: primero pregúntate dónde vive el AST, luego pregúntate si los nodos fuera del viewport siguen en el DOM, y luego pregúntate cuántos re-renders completos dispara un solo arrastre. Responde las tres correctamente, y tu editor podrá sobrevivir a los archivos más dementes de la era — los gigantes de cien mil nodos exportados de herramientas de CAD, GIS y diseño de chips. No están en tu contra. Solo son grandes.

![Error de Windows](https://i.giphy.com/XUqcmSSeTUbupSeGA4.gif)
*El final alternativo — "ha ocurrido un error fatal" — lo que pasa cuando le das todo el bosque al DOM de una sola vez.*

*Esta publicación es parte de la serie de ingeniería de SVGDO. Anteriormente: [Deja de Filtrar Tus Nodos Vectoriales a Servidores Sospechosos](/resources/pictkit-architecture).*
