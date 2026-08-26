# Animación de Trazo SVG y Morphing de Trayectoria: La Guía Avanzada de Motion Design que Da Vida a tus Gráficos Vectoriales

Existe un error persistente en el mundo del frontend: "¿La animación SVG no es solo hacer girar iconos y cambiar colores?"

Hermano. Esas impresionantes animaciones de apertura que has visto en sitios web — un logotipo siendo trazado trazo a trazo como dibujado por una mano invisible, líneas de gráficos de datos "creciendo" a lo largo de sus curvas, ilustraciones SVG materializándose de la nada mientras haces scroll — casi todas funcionan con animación SVG avanzada. Y las técnicas centrales detrás de ellas, quitando todo el espectáculo, se reducen exactamente a dos cosas: **dibujo lineal con stroke-dashoffset** y **morphing de trayectorias**.

Nuestro artículo anterior sobre "Trampas de la Animación SVG" ya cubrió trucos salvavidas como `transform-box: fill-box`. Este se salta lo básico. Vamos directo a lo avanzado — las técnicas que hacen que los entrevistadores se inclinen hacia adelante, que hacen que los usuarios se queden mirando tu pantalla durante tres segundos. Vamos a desmontarlas.

![Demo de Código de Animación de Trazo SVG](/content/images/svg-advanced-animation-1.jpg)
*La animación de trazo SVG hace que cualquier forma con trazado parezca "dibujarse" en tiempo real — algo que las imágenes de mapa de bits y el video nunca pueden lograr. Cada fotograma se controla mediante valores precisos de dashoffset.*

## El Principio Fundamental de la Animación de Trazo: Lo Que Ves Como "Dibujo" Es En Realidad "Revelación"

La lógica detrás de esta técnica es profundamente contraintuitiva. Crees que el navegador está añadiendo segmentos de trayectoria fotograma a fotograma — no es así. Lo que el navegador realmente hace: **dibuja toda la línea primero, luego la oculta usando una ingeniosa propiedad CSS, y la revela poco a poco mediante animación.**

Esa propiedad es `stroke-dasharray`.

Entender `stroke-dasharray` es la llave que desbloquea toda la animación de trazo SVG. Define un patrón de líneas discontinuas — especificas longitudes alternas de trazo sólido y espacio:

```
stroke-dasharray: 10, 5;   /* 10px de trazo + 5px de espacio, repitiendo */
stroke-dasharray: 20;      /* 20px de trazo + 20px de espacio (valor único = espacio igual) */
stroke-dasharray: 500;     /* 500px de trazo + 500px de espacio */
```

Ahora establece `stroke-dasharray` en **la longitud total exacta de la trayectoria**. Obtienes un trazo sólido que cubre precisamente toda la trayectoria, seguido de un espacio de igual longitud — pero como el espacio comienza exactamente donde termina la trayectoria, visualmente ves una línea continua.

La magia ocurre con la segunda propiedad: `stroke-dashoffset`. Desplaza la posición inicial del patrón de guiones.

```
stroke-dashoffset: 0;    /* El patrón comienza al principio → trazo completamente visible */
stroke-dashoffset: 500;  /* Patrón desplazado 500px hacia adelante → la parte sólida sale de la vista → ¡completamente invisible! */
```

**Este es el momento en que tus ojos son engañados.** Usas JavaScript para obtener la longitud real de la trayectoria, estableces tanto `dasharray` como `dashoffset` en esa longitud — toda la línea "desaparece mágicamente." Luego animas `dashoffset` desde la longitud total hasta 0 — y la línea parece dibujarse desde el inicio:

```javascript
// Obtener la longitud real de la trayectoria (esta es la base de toda la animación)
const path = document.querySelector('#my-line');
const length = path.getTotalLength();  // devuelve p. ej. 847.3

// Establecer estado inicial: toda la línea está "oculta"
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
path.style.transition = 'stroke-dashoffset 2s ease-in-out';

// Disparar la animación: el offset va a cero → la línea parece "dibujarse"
requestAnimationFrame(() => {
  path.style.strokeDashoffset = 0;
});
```

Tres líneas de código clave. Sin bibliotecas externas, sin lógica enrevesada — solo aprovechando el renderizado nativo de guiones SVG del navegador para lograr una ilusión óptica. Pero esta ilusión es extraordinariamente poderosa — como opera sobre una propiedad CSS, funciona con `@keyframes`, con `transition`, con `requestAnimationFrame` para control preciso de fotogramas, e incluso con etiquetas SMIL `<animate>` para definición declarativa.

### Por Qué Debes Usar getTotalLength()

Podrías pensar: ¿no puedo simplemente estimar la longitud de la trayectoria y poner un número aproximado? ¿Como `stroke-dasharray: 800`?

No. La falta de precisión causa dos problemas. Si te quedas corto — la animación termina antes de que la línea esté completamente dibujada, dejando un extremo "decapitado". Si te pasas — después de que la animación termina, un espacio residual sigue empujando hacia adelante, haciendo que la línea "parpadee" visualmente al final.

`getTotalLength()` devuelve la longitud de arco precisa de la trayectoria en el sistema de coordenadas SVG, teniendo en cuenta todos los segmentos de curvas Bézier. Por eso debes usar JavaScript para obtener este valor — CSS por sí solo no puede calcular la longitud de arco de una trayectoria SVG arbitraria.

Para escenarios responsive (las dimensiones del SVG cambian con el viewport), la longitud de la trayectoria también cambia. Recuerda recalcular en `resize`:

```javascript
window.addEventListener('resize', () => {
  const newLength = path.getTotalLength();
  path.style.strokeDasharray = newLength;
  path.style.strokeDashoffset = newLength;
});
```

![Animación SVG en Visualización de Datos](/content/images/svg-advanced-animation-2.jpg)
*Los gráficos dinámicos de visualización de datos se encuentran entre las aplicaciones más comunes de la animación SVG. Cada curva que crece, cada gráfico de barras que se eleva, se basa en la coordinación precisa de dasharray y dashoffset detrás de escena.*

## Tres Enfoques de Implementación: CSS, JS y SMIL — Cuál Elegir

### CSS @keyframes Puro: Lo Más Simple pero Limitado

Si la longitud de tu trayectoria es fija (como un logotipo a un tamaño específico), puedes codificar la longitud directamente en CSS:

```css
.logo-path {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 2;
  stroke-linecap: round;        /* extremos redondeados */
  stroke-linejoin: round;       /* esquinas suaves */
  stroke-dasharray: 847;        /* longitud de la trayectoria (conocida de antemano) */
  stroke-dashoffset: 847;
  animation: draw-line 2s ease-in-out forwards;
}

@keyframes draw-line {
  to { stroke-dashoffset: 0; }
}
```

`forwards` es crítico — sin él, `dashoffset` vuelve a su valor inicial cuando termina la animación, y tu línea desaparece instantáneamente. Eso es embarazoso.

El enfoque CSS puro ofrece cero dependencias JS y permite que la GPU maneje la transición de `stroke-dashoffset`. La desventaja: la longitud de la trayectoria debe estar incrustada en el CSS, por lo que se rompe si tu SVG necesita escalar de forma responsive.

### Activación Dinámica con JavaScript: La Más Flexible, Lista para Producción

El fragmento JS anterior es el enfoque estándar en producción. Sus fortalezas: la longitud de la trayectoria se obtiene dinámicamente, la animación puede dispararse en cualquier momento (carga de página, entrada al viewport, clic del usuario), y obtienes control preciso sobre la temporización de múltiples trayectorias.

Un patrón común encadena múltiples animaciones de trayectoria — letras "escritas" una tras otra:

```javascript
const paths = document.querySelectorAll('.handwriting-path');
paths.forEach((path, index) => {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.transition = `stroke-dashoffset 0.6s ${index * 0.15}s ease-out`;
  // Cada trayectoria retrasada index × 0.15s → las letras aparecen secuencialmente
});

// Una vez que todas las trayectorias están listas, dispararlas juntas
requestAnimationFrame(() => {
  paths.forEach(p => p.style.strokeDashoffset = '0');
});
```

El resultado: texto que parece como si alguien lo estuviera escribiendo trazo a trazo. Esta técnica exacta impulsa las secciones hero de innumerables sitios web de marca.

### SMIL `<animate>`: Nativo pero Obsoleto

SMIL (Synchronized Multimedia Integration Language) es la etiqueta de animación declarativa incorporada de SVG, insertada directamente en el marcado SVG:

```html
<path d="M10,80 Q95,10 180,80" fill="none" stroke="#333" stroke-width="3"
      stroke-dasharray="200" stroke-dashoffset="200">
  <animate attributeName="stroke-dashoffset"
           from="200" to="0"
           dur="1.5s"
           fill="freeze"
           begin="0s" />
</path>
```

El beneficio: no se requiere CSS ni JS. La definición de la animación está completamente autocontenida dentro del archivo SVG. Puedes usarlo como `<img>`, como imagen de fondo CSS, incluso incrustarlo en un correo electrónico — y la animación sigue funcionando.

La realidad: Chrome eliminó completamente el soporte SMIL en 2025. Safari y Firefox todavía lo tienen, pero nadie sabe por cuánto tiempo. A menos que estés construyendo un SVG para un entorno específico y controlado (como un logotipo animado en correo electrónico), **no uses SMIL en proyectos nuevos.**

![](https://i.giphy.com/media/3o7TKzZUoKk4Sdkc1q.gif)
*Cuando escribes una animación SMIL elaborada, la abres en Chrome y no se mueve nada — extrañarás los días en que SMIL funcionaba.*

## Práctica Avanzada: Del Dibujo de Línea Simple a la Narrativa Visual Completa

Una vez que dominas los fundamentos, lo que separa lo bueno de lo excelente es la capacidad de componer estas animaciones básicas en motion cohesivo y narrativo.

### Anillo de Progreso de Carga

La aplicación más común de la animación de trazo: un anillo que se llena del 0% al 100%. El truco clave es establecer `dasharray` en la circunferencia, luego animar `dashoffset`:

```css
.progress-ring {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 6;
  stroke-linecap: round;
  /* Circunferencia = 2πr = 2 × 3.14159 × 45 ≈ 282.7 */
  stroke-dasharray: 282.7;
  /* Offset inicial 282.7 → progreso 0%; offset 0 → progreso 100% */
  stroke-dashoffset: 282.7;
  transition: stroke-dashoffset 0.3s ease;
}
```

Calcula dashoffset dinámicamente según el valor de progreso real:

```javascript
function setProgress(percent) {
  const circumference = 2 * Math.PI * 45;  // circunferencia del círculo
  const offset = circumference - (percent / 100) * circumference;
  ring.style.strokeDashoffset = offset;
  // percent=0   → offset=circumference → completamente vacío
  // percent=100 → offset=0              → anillo completo
}

setProgress(75);  // el anillo se llena al 75%
```

Diferentes valores de `stroke-linecap` afectan el estilo visual del anillo: `round` da extremos redondeados adecuados para UI Moderna; `butt` da extremos planos adecuados para estilos Dashboard.

### Hormigas Marchando (Borde Discontinuo Fluido)

El efecto de hormigas marchando (piensa en el marco de selección de Photoshop) es esencialmente guiones cortos más dashoffset cambiando continuamente:

```css
@keyframes marching-ants {
  to { stroke-dashoffset: -20; }  /* valor negativo → "fluye hacia adelante" */
}

.marching-border {
  stroke-dasharray: 10, 5;  /* 10px trazo + 5px espacio */
  animation: marching-ants 0.5s linear infinite;
}
```

Invierte la dirección con `to { stroke-dashoffset: 20; }` para flujo inverso. Este efecto es excelente para selecciones de recorte de imagen, resaltado de límites de mapa y casos de uso similares.

### Animación de Firma Manuscrita

Muchos sitios web de marca presentan una animación de "firma manuscrita" en el área hero — la palabra "Firma" renderizada como una trayectoria SVG, dibujada trazo a trazo.

Receta técnica:
1. Usa Illustrator / Figma para convertir texto en trayectorias de contorno (Outline Stroke)
2. Exporta como SVG, asegurando que cada letra/trazo sea un `<path>` independiente
3. Organiza las trayectorias en orden de escritura, calcula la longitud de cada una
4. Encadena animaciones con JS — el primer trazo termina, el segundo comienza, simulando ritmo de escritura real

La variación del grosor del trazo (sensibilidad a la presión) puede expresarse en SVG estático a través de la forma de la trayectoria, pero para animación solo podemos controlar `stroke-width` — superpón un `@keyframes` de `stroke-width` sobre la animación de trazo para simular inicios finos y trazos gruesos:

```css
@keyframes write-with-pressure {
  0%   { stroke-dashoffset: var(--len); stroke-width: 1; }
  30%  { stroke-width: 3; }
  70%  { stroke-width: 3; }
  100% { stroke-dashoffset: 0; stroke-width: 1; }
}
```

Este nivel de detalle es la diferencia entre "bueno" e "impresionante."

## Path Morphing: Observa Cómo las Formas se Transforman Ante Tus Ojos

La animación de trazo controla la "visibilidad del trazo." El path morphing controla la "transformación de la forma" — un círculo que se convierte en un cuadrado, un triángulo que se convierte en una flecha, la letra A que se convierte en la letra B.

La operación central del path morphing: **animar el atributo `d` de un elemento `<path>`.**

El atributo `d` define la forma de una trayectoria — `M` mueve a, `L` dibuja una línea, `C` dibuja una curva Bézier cúbica, `Q` dibuja una curva Bézier cuadrática. Si las formas inicial y final tienen estructuras de trayectoria idénticas (mismos tipos de comando, mismo número de puntos), el navegador puede interpolar suavemente entre las dos cadenas `d`.

### Animación CSS del Atributo d (Bien Soportada en 2026)

Hace unos años, el atributo `d` estaba prohibido para la animación CSS — los navegadores solo podían animar "atributos de presentación" como `fill`, `stroke` y `opacity`, no "atributos geométricos" como `d`. Pero a partir de 2024, los principales navegadores agregaron progresivamente soporte para la animación CSS del atributo `d`:

```css
.morph-shape {
  /* Círculo → cuadrado → círculo */
  animation: morph 3s ease-in-out infinite alternate;
}

@keyframes morph {
  0% {
    d: path("M50,10 A40,40 0 1,1 49.9,10 Z");  /* círculo aproximado */
  }
  100% {
    d: path("M15,15 L85,15 L85,85 L15,85 Z");   /* cuadrado */
  }
}
```

**El requisito fatal:** las trayectorias inicial y final deben contener **exactamente el mismo número y tipos de comandos.** Si una trayectoria tiene 4 puntos y la otra tiene 8, la animación no dará error — pero la transición se verá extraña, con el navegador produciendo formas intermedias impredecibles. Esta es la trampa más común en el path morphing.

### La Regla de Correspondencia de Puntos

Supón que quieres transformar un triángulo en una flecha. Un triángulo puede tener solo 3 vértices, pero una flecha necesita 7. Hacer morphing directamente fallará. El enfoque correcto: introduce puntos adicionales en la trayectoria del triángulo — estos puntos se superponen con los vértices existentes, por lo que el triángulo se ve igual, pero su estructura de trayectoria ahora coincide con la flecha:

```
Triángulo (visualmente 3 puntos, realmente 8 para coincidir con la flecha):
M50,80 L85,20 L15,20 L15,20 L15,20 L15,20 L15,20 Z

Flecha (8 puntos):
M15,40 L50,15 L85,40 L70,40 L70,70 L30,70 L30,40 Z
```

Ambas trayectorias ahora tienen el mismo número de comandos, y el morphing será suave. En el editor SVGDO, puedes editar el atributo `d` directamente en la vista de código para ajustar el número de puntos de la trayectoria.

## Animación SVG Impulsada por Scroll: Convirtiendo la Rueda del Ratón en una Línea de Tiempo

La animación impulsada por scroll es una de las tendencias más candentes del frontend en 2025-2026. El concepto central: **cada píxel que el usuario desplaza equivale a un fotograma de progreso de animación.**

### IntersectionObserver: El Enfoque Más Estable

`IntersectionObserver` puede detectar con precisión cuándo un elemento entra o sale del viewport. El uso tradicional es booleano — disparar la animación al entrar. Pero podemos usar `intersectionRatio` (la fracción visible del elemento) para mapear la posición de scroll directamente al progreso de la animación:

```javascript
const svgIllustration = document.querySelector('#animated-illustration');
const paths = svgIllustration.querySelectorAll('.draw-on-scroll');

// Inicializar parámetros de animación de trazo para todas las trayectorias
paths.forEach(path => {
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // entry.intersectionRatio: 0 (completamente oculto) → 1 (completamente visible)
    const progress = Math.min(1, Math.max(0, entry.intersectionRatio));

    paths.forEach(path => {
      const len = parseFloat(path.style.strokeDasharray);
      // Calcular dashoffset inversamente desde el progreso de scroll
      path.style.strokeDashoffset = len * (1 - progress);
    });
  });
}, {
  threshold: Array.from({ length: 101 }, (_, i) => i / 100)
  // Disparar callback cada 1% de cambio → la animación sigue el scroll suavemente
});

observer.observe(svgIllustration);
```

El efecto: a medida que el usuario se desplaza hacia abajo, las líneas SVG "se dibujan" al ritmo de la posición de scroll. Desplázate más rápido, el dibujo se acelera. Vuelve a subir, las líneas retroceden. Esta es una herramienta narrativa increíblemente poderosa — perfecta para páginas de aterrizaje de productos, informes de datos, resúmenes anuales y cualquier experiencia de "revelar mientras se lee."

### Nota de Rendimiento

No establezcas 101 puntos de interrupción de threshold y luego llames a `getTotalLength()` en cada trayectoria dentro de cada callback. **Calcula todas las longitudes de trayectoria una vez durante la inicialización**, almacénalas en un Map, y deja que el callback de scroll haga solo aritmética pura (`length * (1 - progress)`) — cero llamadas a APIs de medición del DOM.

## Optimización de Rendimiento: No Conviertas tus Animaciones en una Presentación de Diapositivas

### Regla Uno: Solo Anima transform y opacity

El navegador renderiza un fotograma en cinco etapas: JavaScript → Style → Layout → Paint → Composite.

- Las animaciones de `transform` y `opacity` solo necesitan la etapa **Composite** — el compositor GPU las maneja en el hilo del compositor, omitiendo completamente Layout y Paint.
- `stroke-dashoffset` necesita la etapa **Paint**, pero no Layout.
- Animar `width`, `height`, `top`, `left` requiere las cinco etapas — relayout, repaint, recomposite en cada fotograma. Esto es un desastre de rendimiento.

La estrategia óptima: usa `stroke-dashoffset` para animación de trazo (solo Paint, aceptable), usa `transform: translate() scale()` para cambios de posición y tamaño (solo Composite, ideal), y **nunca animes propiedades de layout.**

### Regla Dos: Limita los Elementos Animados Simultáneamente

Cincuenta animaciones CSS ejecutándose a la vez en una página pueden verse bien en tu máquina de desarrollo, pero las tasas de fotogramas se desplomarán en teléfonos de gama baja. El umbral real está alrededor de 30 elementos (varía según la complejidad de la animación y el dispositivo).

Solución: **solo anima los elementos en el viewport.** Usa `IntersectionObserver` para detectar qué elementos están visibles — elimina la clase `animation` de los elementos fuera de pantalla y pausa sus animaciones. Los usuarios no pueden ver las animaciones fuera de pantalla de todos modos, así que pausarlas no cuesta nada pero produce ganancias de rendimiento significativas.

### Regla Tres: Usa will-change Correctamente

`will-change: stroke-dashoffset` le dice al navegador: "esta propiedad está a punto de ser animada — prepara recursos de optimización por adelantado." Pero no es gratis — el navegador asigna una capa de memoria GPU adicional para cada elemento con `will-change`. Úsalo demasiado liberalmente, y la memoria GPU se llena, haciendo que todo sea más lento.

El patrón correcto: **añade `will-change` antes de que comience la animación, elimínalo cuando termine.**

```css
.animate-in {
  will-change: stroke-dashoffset;
  animation: draw-line 2s ease-out forwards;
}

.animate-done {
  will-change: auto;  /* liberar recursos GPU */
}
```

### Regla Cuatro: Respeta la Configuración de "Reducir Movimiento"

Los sistemas operativos tienen una configuración de accesibilidad "Reducir Movimiento" (prefers-reduced-motion). Algunos usuarios la activan debido a trastornos vestibulares (sensibilidad al movimiento). Como desarrollador, debes respetar esto:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Nota: no estamos estableciendo `animation: none` — estamos comprimiendo las animaciones para que sean casi instantáneas. De esta manera, la información transmitida a través de la animación (como el estado final de un anillo de progreso) no se pierde, pero los usuarios no experimentan el movimiento.

Pero hay una trampa — `@media (prefers-reduced-motion)` solo funciona cuando el SVG está **inline** en el documento HTML. Si usas el SVG como `<img src="animated-logo.svg">`, las reglas `@media` internas del archivo SVG están aisladas en un sandbox del navegador y no pueden leer las preferencias del usuario de la página anfitriona. Si te importa la accesibilidad (y debería importarte), **los SVG animados críticos deben estar inline.**

## Matriz de Decisión para Selección de Tecnología

Después de todo este análisis, el enfoque correcto para cada escenario está claro:

| Escenario | Enfoque Recomendado | Justificación |
|------|------|------|
| Micro-interacciones hover en iconos | CSS transition | Cero peso de código, acelerado por GPU, sub-200ms |
| Animación de trazo para revelar logotipo | JS + stroke-dashoffset | Control de temporización flexible, longitudes de trayectoria responsive |
| Motion SVG narrativo por scroll | IntersectionObserver + JS | Progreso de scroll acoplado precisamente al progreso de animación |
| Líneas de tiempo complejas multi-trayectoria | WAAPI o GSAP | CSS @keyframes tiene dificultades con secuenciación compleja |
| SVG animado en correo electrónico | SMIL `<animate>` | Autocontenido, sin necesidad de CSS/JS externo |
| Animación compleja creada por diseñador | Lottie | Exportación directa desde After Effects, sin codificación manual |
| Animación decorativa de fondo de página | CSS @keyframes | Simple, acelerado por GPU, no ocupa el hilo principal |
| Gráficos dinámicos de visualización de datos | JS + requestAnimationFrame | Control preciso a nivel de fotograma y vinculación de datos |

No existe un único enfoque "mejor" — solo el mejor ajuste para el escenario actual. La mayoría de los proyectos mezclan 2-3 enfoques: CSS para micro-interacciones, JS para animaciones de trazo, GSAP para líneas de tiempo complejas.

## Poniéndolo en Práctica con SVGDO

Una vez que entiendes los principios, ponerlos en práctica en el editor SVGDO (svgdo.com) es rápido.

Abre el editor, importa tu SVG — puede ser un icono exportado desde Figma/Illustrator, o código de trayectoria escrito a mano. Cambia a Vista Dividida: el lado izquierdo muestra el lienzo visual, el lado derecho muestra el código en vivo — cualquier `stroke-dasharray` y `stroke-dashoffset` que escribas en el derecho es inmediatamente visible en el izquierdo.

Para la animación de trazo, el flujo de trabajo principal es:
1. En la vista de código, usa `querySelectorAll` para seleccionar todos los elementos `<path>` que quieres animar
2. Abre la consola del navegador, ejecuta `getTotalLength()` para obtener la longitud de cada trayectoria
3. Escribe los valores de longitud en `stroke-dasharray` y `stroke-dashoffset` de cada elemento
4. Escribe tus `@keyframes` o `transition` en CSS
5. Cambia al modo de vista previa y observa la magia

Para el path morphing, el editor de código de SVGDO cuenta con resaltado de sintaxis — puedes comparar visualmente las estructuras de comandos de dos cadenas `d` para asegurar que el número de puntos coincida.

![Depuración de Animación SVG en Desarrollo Frontend](/content/images/svg-advanced-animation-3.jpg)
*Depurando animaciones SVG en un entorno de desarrollo real: escribe código en un lado, observa la vista previa en vivo en el otro. Cambia un solo valor de dashoffset y ve el progreso de la animación de trazo instantáneamente.*

Si los miles de palabras anteriores fueron la clase teórica, abrir SVGDO y construirlo tú mismo es la sesión de laboratorio. La animación de trazo es una de esas cosas en las que entiendes el principio en diez minutos de lectura, pero en el momento en que realmente ves una curva Bézier pasar de "desaparecida" a "completamente dibujada" — ese "guau" involuntario que sueltas? Esa es la verdadera magia de SVG.
