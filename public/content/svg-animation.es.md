---

# Sangre, sudor y lágrimas de las animaciones SVG: Desde principiante hasta casi destrozar mi teclado

Sinceramente, mientras escribo este artículo, literalmente estoy en medio de la reparación de otro error de animación SVG en una base de código heredada. Estoy mirando la pantalla donde un círculo de carga, que se suponía que debía girar silenciosamente en su lugar, está orbitando la esquina superior izquierda del navegador en algún extraño movimiento centrífugo, volando completamente fuera de la pantalla.

Mi estado de ánimo exacto en este momento está perfectamente capturado por el GIF a continuación.

![Mi estado de ánimo viendo mi icono SVG volar fuera de la pantalla](/content/images/this-is-fine-css.gif)
*(Esta es literalmente la vida diaria de un ingeniero frontend. El mundo está ardiendo y yo sigo ajustando el CSS).*

No sé cuántos de ustedes son como yo, pero cuando comencé a aprender frontend, pensé que las animaciones CSS eran solo aplicar unos pocos `@keyframes`. ¿Quién no sabe cómo escribir `transform: rotate(360deg)`? Animar un simple `div` o `span` de HTML es algo que puedes hacer con los ojos cerrados. ¡Pero! En el momento en que tocas los nodos dentro de un SVG, como tratar de hacer que un `<path>` o `<circle>` específico se anime de forma independiente, comienza la pesadilla absoluta.

Hoy, me he hartado por completo de la frustración de tener que explorar StackOverflow durante medio día solo por una simple animación. Decidí sacar manualmente cada una de las trampas que he encontrado con las animaciones SVG a lo largo de los años. Sin rodeos, sin estructuras rígidas de "en primer lugar, en segundo lugar, por último". Solo hablemos del dolor.

Si todavía estás usando JavaScript para manipular agresivamente el DOM y crear animaciones SVG, te insto a que te detengas de inmediato. Esa basura no solo asfixiará tu hilo principal hasta la muerte, sino que el código que escribas será largo y apestoso. ¿En qué año estamos? Incluso las pantallas de los teléfonos tienen una frecuencia de actualización de 120Hz. Necesitamos aceleración de hardware de la GPU; necesitamos la máxima fluidez. Por lo tanto, impulsar los SVG en línea con CSS puro es absolutamente la única solución seria y sin retrasos en este momento.

Pero, tal como me quejaba antes, en el momento en que agregas una animación de rotación a un nodo SVG, volará fuera de control el 100% de las veces. ¿Por qué?

Porque en el mundo HTML normal en el que solemos escribir, el `transform-origin` (el punto central alrededor del cual se deforma o gira) de un elemento predetermina su centro exacto, es decir, `50% 50%`.
¡Pero el mundo SVG tiene un sistema de coordenadas increíblemente extraño! En la mayoría de los navegadores (especialmente Safari, te lo digo a ti), el origen de transformación de los nodos SVG internos predetermina estar anclado en la esquina superior izquierda `(0, 0)` del enorme lienzo SVG.

¿Qué tan estúpido es esto? ¡Es como si quisieras dar una vuelta en tu lugar, pero el sistema te obliga a dar una vuelta por la plaza del ayuntamiento a tres millas de distancia!

Una vez me quedé despierto hasta las 3 AM la noche antes del lanzamiento de un proyecto investigando este problema. Al final, descubrí que el salvavidas era en realidad una propiedad CSS ridículamente oscura de la que incluso muchos veteranos no habían oído hablar.
Todo lo que necesitas hacer es agregar estas dos líneas de código bajo el nombre de la clase del nodo SVG que necesita rotar:

```css
.spin-gear {
  transform-origin: center center;
  /* ¡PRESTA ATENCIÓN! Esta es la propiedad salvavidas de nivel dios */
  transform-box: fill-box;
  animation: spin 2s linear infinite;
}
```

Después de agregar `transform-box: fill-box;`, el navegador finalmente deja de ser estúpido. Entiende: "Oh, el jefe quiere que use el Bounding Box (Cuadro Delimitador) real de este gráfico en sí como línea de base para calcular el punto central, no ese maldito lienzo enorme".
Esta sola línea de código ha salvado quién sabe cuánto cabello de los programadores frontend que estaba a punto de caerse.

Además de la rotación, otro truco llamativo que puedes usar para presumir en las entrevistas es la "Animación de Dibujo de Líneas" (Line Drawing Animation).
Definitivamente lo has visto en el sitio web oficial de Apple o en esos sitios web minimalistas extremadamente pretenciosos. A medida que desplazas el mouse, una curva en la pantalla se dibuja lentamente como si un bolígrafo invisible la estuviera trazando.

Mucha gente piensa que esto debe estar escrito usando una increíble biblioteca Canvas o WebGL. Pero en realidad, puedes obtener esta animación en SVG usando puramente CSS de forma gratuita.
El mecanismo subyacente es tan astuto que es indignante. Utiliza la propiedad de línea discontinua de SVG.

Imagina que tienes una línea que tiene 1000 píxeles de largo.
Primer paso, usas `stroke-dasharray: 1000;` para convertir esta línea en una línea discontinua masiva donde "la parte sólida tiene 1000 píxeles de largo, y el espacio vacío también tiene 1000 píxeles de largo".
Segundo paso, usas agresivamente `stroke-dashoffset: 1000;` para desplazar esta línea discontinua 1000 píxeles a la izquierda. Al hacer esto, lo que cae en la ventana gráfica de tu pantalla es exactamente ese "espacio vacío" de 1000 píxeles. La línea, mágicamente, desaparece.
Tercer paso, escribe una animación CSS extremadamente simple para hacer una transición lenta de este desplazamiento de 1000 de vuelta a 0.

El código se ve así; es tan simple que es difícil de creer:

```css
.magic-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 3s ease-in-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}
```
La parte sólida que originalmente se escondía fuera de la ventana gráfica es arrastrada lentamente hacia atrás, viéndose visualmente exactamente como si estuviera siendo dibujada en ese mismo momento. Si dominas este truco, puedes encargarte por ti solo de todas las fantásticas animaciones de carga de tu empresa a partir de ahora.

Pero, por otro lado, escribir código es solo escribir código. Si el SVG que recibes es basura en primer lugar, con un sistema de coordenadas desordenado y siete u ocho capas de etiquetas `<g>` sin sentido anidadas en su interior, entonces no importa cuán increíble sea tu CSS, es inútil. La animación definitivamente tartamudeará y se retrasará.

Por lo tanto, antes de lanzar SVGs en tu proyecto para escribir animaciones, ¡absolutamente debes lavar el código primero!

Deja de usar esos sitios de compresión en línea de basura llenos de anuncios. Simplemente puedes abrir nuestro propio Editor SVG y echar un vistazo. Construimos un flujo de trabajo completamente localizado. Mira el GIF animado a continuación, lo grabé específicamente para ti, puramente renderizado localmente sin efectos visuales falsos:

![Procesa tus SVGs basura directamente en el editor](/content/images/icon-workflow-demo.webp)
*(Es así de suave. Opera a la izquierda, obtén instantáneamente código puro a la derecha, sin tener que soportar ninguna latencia de red).*

Lanza esos SVGs con todo tipo de coordenadas sucias y desordenadas que los diseñadores te arrojaron. Bajo la Vista Dividida (Split View), elimina directamente esos metadatos inútiles y limpia el viewBox. Solo cuando la estructura subyacente está limpia, las animaciones interactivas que escribes con CSS pueden lograr realmente una fluidez de 60 FPS.

Muy bien, basta de quejas, acabo de recibir un nuevo requisito. El gerente de producto dice que el icono del corazón no solo debe rebotar al hacer clic, sino que también debe explotar con un anillo de partículas. Tengo que ir a pelear con el sistema de coordenadas SVG de nuevo. Recuerda ese encantamiento: `transform-box: fill-box;`. ¡Que todos salgan temprano del trabajo y nunca encuentren errores!
