# Adiós al desastre de exportación de Figma: Cómo dominé el desarrollo SVG usando IA y un editor local

Honestamente, no sé ustedes, pero cada vez que hago desarrollo frontend o escribo blogs de tecnología, conseguir que las "ilustraciones" queden bien siempre es una pesadilla.

Cada vez que necesito un diagrama de arquitectura simple, un diagrama de flujo de trabajo o una decoración de fondo tecnológica, empiezo a sufrir. Si busco imágenes de archivo, es difícil encontrar algo que se adapte perfectamente a mi contenido y, a veces, hay problemas de derechos de autor. Si lo dibujo yo mismo, abrir Illustrator o Sketch se siente como usar un mazo para cascar una nuez. Claro, mucha gente usa Figma, y Figma es genial. ¿Pero alguna vez has intentado exportar un diseño de Figma como código SVG puro? Por lo general, está lleno de etiquetas `<g>` inútiles, posicionamiento absoluto y rutas extremadamente redundantes. Poner eso en una página web no solo se ve desordenado, sino que el tamaño del archivo ni siquiera es tan pequeño.

En cuanto a escribir código SVG completamente a mano... Admito que puedo escribir un `<rect>` o un `<circle>`, pero si me pides que codifique a mano una flecha con una curva bezier suave, o que cree un degradado complejo con sombras, literalmente colapsaría en el acto.

No fue hasta hace poco, con el auge de los Grandes Modelos de Lenguaje (especialmente la nueva generación de modelos con sólidas capacidades de razonamiento espacial y de codificación, como la serie insignia de Claude y DeepSeek), que descubrí un truco alucinante que libera por completo la productividad del frontend: <strong>Usar IA para generar el borrador del esqueleto del SVG, luego arrojarlo directamente a nuestro `svg-editor` para hacer ajustes a ciegas y renderizarlo en tiempo real.</strong>

En el artículo de hoy, voy a compartir este flujo de trabajo increíblemente satisfactorio con ustedes. Puro conocimiento práctico y extremadamente eficiente en ancho de banda.

---

## Los malentendidos que tenemos sobre el dibujo con IA

Cuando mucha gente escucha "Dibujo con IA", su primer pensamiento es Midjourney, DALL-E o Stable Diffusion. Innegablemente, las imágenes de mapa de bits generadas por estos modelos de difusión son absolutamente asombrosas y ricas en detalles. Pero si eres un desarrollador web que persigue un rendimiento extremo, o un bloguero que necesita diagramas nítidos, te darás cuenta de que los mapas de bits tienen algunas fallas fatales.

Primero es el <strong>tamaño del archivo</strong>. Un diagrama de alta definición puede ser fácilmente de cientos de KB o incluso de unos pocos MB. Si tienes diez imágenes en tu artículo, la experiencia de carga del usuario será terrible. El segundo es la <strong>inmutabilidad</strong>. Usas Midjourney para generar una hermosa maqueta de interfaz de usuario, pero si una palabra en inglés en el interior está mal escrita, o si deseas cambiar un botón de azul a verde, lo siento, solo puedes regenerarlo como si abrieras una "caja sorpresa". Es muy difícil lograr un control preciso. Finalmente, hay <strong>distorsión de escala</strong>. En pantallas con diferentes resoluciones, los mapas de bits luchan por permanecer perfectamente nítidos.

Aquí es donde brillan las ventajas de SVG (Gráficos Vectoriales Escalables). Es puro código de texto, soporta naturalmente un escalado infinito sin perder calidad, y el tamaño del archivo es lastimosamente pequeño. Un gráfico extremadamente complejo representado en SVG podría tener solo 2 KB.

Entonces, dado que la IA puede escribir Python y React, ¿puede escribir código SVG directamente para mí?

La respuesta es: antes no podía, pero ahora absolutamente puede. Los primeros modelos entendían la sintaxis HTML, pero carecían gravemente de "intuición espacial". Los elementos que generaban a menudo estaban sesgados, con texto superpuesto a los bordes: era ilegible. Pero los modelos de primer nivel de hoy son diferentes. No solo saben qué es un sistema de coordenadas o entienden el propósito de `viewBox`; incluso entienden la teoría del color y la estética tipográfica básica.

---

## Flujo de trabajo en la práctica: De "Prompts estructurados" a borrador

Para que la IA escriba un código SVG confiable, no puedes simplemente arrojarle un montón de adjetivos como lo haces con Midjourney. Tienes que usar la mentalidad de un desarrollador y alimentarlo con "Prompts estructurados".

Por lo general, utilizo una plantilla como esta para limitar la IA:

1. <strong>Configuración de rol</strong>: "Eres un experto senior en visualización de datos frontend y diseñador de UI con 10 años de experiencia". (Esto activa los pesos en su modelo con respecto a la calidad del código y la estética tipográfica).
2. <strong>Objetivo principal</strong>: "Por favor, utiliza código SVG puro para dibujar un [Diagrama de flujo de trabajo] para mi artículo".
3. <strong>Límites del lienzo</strong>: "Establece el viewBox en 0 0 1000 400. Usa un blanco cálido o un degradado oscuro premium para el fondo".
4. <strong>Reglas estrictas</strong> (Este es el paso más crucial): "Prohíbe estrictamente que los gráficos y el texto se superpongan. El texto debe estar centrado con un amplio relleno (padding). Usa flechas discontinuas para conectar los gráficos".
5. <strong>Formato de salida</strong>: "Exporta directamente el código de la etiqueta `<svg>` sin ninguna explicación, y no lo envuelvas en bloques de código Markdown".

Cuando le lanzas un prompt como este a Claude o DeepSeek, a menudo ocurren milagros. En una docena de segundos, un código SVG estructuralmente claro, a veces con sangrías perfectamente ordenadas, aparecerá justo ante tus ojos.

---

## Por qué necesitas absolutamente un `svg-editor` local

Podrías preguntar: dado que la IA ya ha escrito el código, ¿no puedo simplemente copiarlo y pegarlo en mi proyecto?

<strong>Absolutamente no.</strong>

Este es el "escollo" más realista y fácilmente pasado por alto en este flujo de trabajo. La IA es, después de todo, IA. No tiene ojos reales para "ver" la imagen que genera. Se basa completamente en probabilidades matemáticas para calcular coordenadas. Por lo tanto, con frecuencia encontrarás estos problemas menores:

- La IA establece el `width` de un rectángulo en 100, pero el texto que genera tiene una docena de palabras, lo que hace que el texto se derrame fuera de los bordes del rectángulo.
- Los colores aleatorios que elige la IA pueden ser correctos en el espectro de colores, pero se ven increíblemente ásperos en una pantalla real.
- La IA podría codificar valores absolutos como `<svg width="1000" height="400">`, haciéndolo completamente incapaz de reducirse de forma responsiva en dispositivos móviles.

Si regresas y le preguntas a la IA cada vez que detectas uno de estos problemas menores: "Haz que la fuente del texto sea más pequeña en el cuadro izquierdo", es muy probable que la IA regenere todo el código solo para satisfacer esa pequeña solicitud, y de repente la mitad derecha originalmente perfecta se arruina. El costo de comunicación de este escenario de "tirar de un pelo y mover todo el cuerpo" es terriblemente alto.

<strong>Es por eso que confío firmemente en el `svg-editor` proporcionado en este sitio.</strong>

La IA se encarga del trabajo pesado de ir "de 0 a 1", construyendo todos los nodos complejos, filtros de sombra (`feDropShadow`) y degradados (`linearGradient`) para ti. Mientras tanto, solo necesitas usar nuestro `svg-editor` para completar el pulido fino de "99 a 100".

Puedes volcar todo el código generado por IA en el área de código en el lado izquierdo del editor. Al instante, en la ventana de vista previa en tiempo real de la derecha, el código se convierte en un gráfico visible.

![Escenario real de depuración de flujo de trabajo SVG en el editor](/content/images/ai-svg-generation-workflow.png)

Toma el diagrama de flujo de trabajo anterior, por ejemplo. Cuando la IA lo generó por primera vez, la distancia entre los tres rectángulos redondeados era demasiado cercana, haciéndolo ver apretado. Si regresara a la IA para ajustarlo, Dios sabe qué desastre crearía. Pero en el `svg-editor`, simplemente mantuve mis ojos en la vista previa de la derecha y cambié manualmente la coordenada `x` de la segunda forma de `400` a `500` a la izquierda. En el momento en que presioné el teclado, la forma se trasladó obedientemente 100 píxeles a la derecha. Esta sensación WYSIWYG de seguridad y control es algo que la conversación pura de IA nunca puede darte.

---

## Juego avanzado: Renderizar una interfaz de usuario de "Periódico en color" con código puro

Además de dibujar diagramas de flujo secos, podemos crear algo más artístico. Por ejemplo, a veces, cuando escribo resúmenes técnicos, quiero una ilustración de estilo retro occidental de "periódico en color" o "revista independiente".

Si buscas en sitios de fotos de archivo, no solo es difícil encontrar diseños que se sientan "similares a un código", sino que también tienes que pagar una suscripción. Pero todo lo que necesito hacer es cambiar el prompt para la IA:

> "Usa SVG para dibujar una tarjeta de introducción de características estilo revista. La parte superior debe tener un texto Serif grande y en negrita que diga 'THE DAILY OBSERVER'. El cuerpo principal debe tener tres bloques rectangulares de alto contraste de diferentes colores (como amarillo brillante, azul claro, rosa), y los bordes deben ser líneas sólidas oscuras y gruesas para simular una textura de impresión".

Una vez que obtengo el código, lo arrojo casualmente a nuestro editor. En este punto, noto que el amarillo que eligió la IA es un poco opaco (`#eab308`). Lo cambio directamente en el código a un amarillo brillante (`#fef08a`), y convenientemente cambio el `stroke-width` del borde de 1 a 3.

Todo el proceso de depuración se siente como jugar a un "juego de colorear" basado en la web, y es increíblemente aliviador del estrés.

![Ajustando tipografía y colores en tiempo real en svg-editor](/content/images/ai-svg-generation-newspaper-style.png)

¿Te imaginas que la imagen de arriba, que parece meticulosamente formateada, con colores vivos y completa con sombras y líneas de cuadrícula, es esencialmente solo una cadena de texto puro de menos de 2 KB? Si no me crees, ¡puedes hacer clic derecho para inspeccionar el elemento en tu navegador ahora mismo y ver qué tan rápido se carga!

---

## El movimiento asesino definitivo: Ingeniería inversa (Robo de independencia gráfica)

Permítanme compartir un truco "malvado" pero súper útil que me guardo para mí: <strong>Redibujado inverso</strong>.

Por lo general, cuando navegamos por Twitter (X) o leemos blogs de los mejores desarrolladores, a menudo vemos estos diagramas de arquitectura de sistemas en modo oscuro increíblemente hermosos con efectos brillantes. Cuando esto suceda, todo lo que necesitas hacer es tomar una captura de pantalla, guardarla y dársela a un modelo grande con capacidad de visión (como la versión multimodal de Claude 3.5 Sonnet).

Combínalo con un prompt extremadamente simple: "<strong>Analiza el diseño tipográfico y la lógica de color de esta imagen, y replícala perfectamente 1:1 usando código SVG nativo.</strong>"

La IA actuará como un analizador de código despiadado, desmantelando instantáneamente las formas geométricas y la lógica de conexión en la imagen, y codificará a mano un conjunto estructuralmente idéntico de código fuente SVG.

Por supuesto, no puedes usarlo directamente en este punto porque el texto sigue siendo de otra persona. Como de costumbre, copia y pega el código en nuestro `svg-editor`. Pega el código a la izquierda, y el diagrama de arquitectura original renace a la derecha.

A continuación, solo necesitas presionar `Ctrl+F` en el cuadro de búsqueda de código, encontrar el texto original en inglés y reemplazarlo uno por uno con tu propia copia. Luego, simplemente elimina las líneas de código con las etiquetas `<path>` de cualquier icono adicional que consideres redundante.

¡En menos de 3 minutos, una captura de pantalla de mapa de bits rígida que originalmente pertenecía a otra persona se ha transformado en un gráfico vectorial personalizado sin marca de agua, infinitamente editable que te pertenece por completo! ¿No es esto mucho más eficiente que abrir Photoshop y retocar meticulosamente con la herramienta de tampón de clonar?

---

## Conclusión

Por lo tanto, deja de creer en las tonterías de que "con la IA, los programadores/diseñadores perderán sus trabajos". La IA no está aquí para reemplazarte; está aquí para ser tu "cortador junior" y "portero de código".

Una vez que la IA cruza el umbral de escribir etiquetas SVG complejas, las únicas cosas que realmente te limitan son tu competencia con tus herramientas y tu gusto estético. Y nuestra herramienta `svg-editor` llena perfectamente la pieza faltante más importante en este flujo de trabajo: <strong>te da un control absoluto</strong>.

"La IA proporciona inspiración y estructura; el editor local completa el ajuste fino y la entrega". Este es, en mi opinión, el paradigma de desarrollo de gráficos vectoriales más elegante, eficiente y que ahorra ancho de banda de nuestra era actual.

No lo dudes. ¡Ve a abrir una conversación con un modelo grande ahora mismo, pide algo de código, luego haz clic en la barra de navegación de este sitio para regresar a nuestro editor y experimenta la emoción de "moldear gráficos con tus propias manos"!
