![Interfaz principal del editor SVG](/content/images/editor-hero.png)

Bienvenido a **SVG do.** — un editor SVG en línea, verdaderamente "sin carga en la nube" y centrado en lo local, diseñado a medida para desarrolladores frontend modernos y diseñadores.

En nuestro flujo de trabajo de desarrollo diario, constantemente necesitamos hacer pequeños ajustes a los SVG: cambiar un color, quitar un borde o minificar un SVG inflado que encontramos en línea. Sin embargo, la mayoría de las herramientas en línea están plagadas de anuncios, te obligan a subir tus archivos de diseño confidenciales a sus servidores, o incluso requieren que te registres e inicies sesión.

Esto viola completamente la intención original de las herramientas frontend: **minimalismo, seguridad y eficiencia**.

La filosofía central detrás de nuestro editor es simple: todo ocurre localmente en tu navegador. Cierra la página y los datos se destruyen. Ahora, profundicemos en las características de núcleo duro de esta poderosa herramienta.

---

## Característica Principal 1: La Biblioteca de Íconos Infinita "Plug and Play"

¿Aún buscas en la web bibliotecas de íconos de código abierto, las descargas y luego las importas manualmente? Hemos integrado directamente un súper arsenal de más de 3,500+ íconos de código abierto de alta calidad justo en el editor.

![Abrir biblioteca de iconos](/content/images/editor-icon-library.png)

![Entrar en vista dividida](/content/images/editor-split-view.png)

![Compresión profunda de SVG](/content/images/editor-optimize-panel.png)

Como se demuestra en la animación de arriba, simplemente necesitas hacer clic en la <strong>Biblioteca de Íconos</strong> (图标库) en la barra lateral izquierda. Navega por el modal, o escribe una palabra clave (como `apple`, `user`, `settings`). Una vez que encuentres el ícono perfecto, un solo clic inyectará instantáneamente su código fuente directamente en tu panel de edición.

Si ya tienes tus propios activos de diseño, también los admitimos:
1. <strong>Arrastra y suelta</strong> cualquier archivo `.svg` directamente en la página web.
2. <strong>Haz clic en "Subir"</strong> para seleccionar un archivo local de tu computadora.
3. <strong>Pega una URL pública de SVG</strong>, y el editor buscará automáticamente el código por ti.

---

## Característica Principal 2: Edición Inmersiva de "Pantalla Dividida" WYSIWYG

La mayoría de las veces, necesitamos hacer ajustes a nivel de código en nuestros SVG. Tal vez necesites modificar el color de `fill`, o agregar una clase CSS específica a un `<path>` particular para poder controlarlo en tu proyecto Vue/React.

Haz clic en el modo de <strong>Pantalla Dividida</strong> (分屏) en la parte superior izquierda, y tu pantalla se dividirá perfectamente en dos mitades:
- El lado izquierdo presenta un editor de código XML ultrarrápido con <strong>resaltado de sintaxis</strong> y <strong>sangría automática</strong>.
- El lado derecho es un área de vista previa de renderizado en tiempo real con tiempos de respuesta de milisegundos.

Cada carácter que escribas y cada píxel de `stroke-width` que modifiques en el código se volverá a dibujar instantáneamente en el lienzo de la derecha. Para los desarrolladores, esta retroalimentación intuitiva de "el código es la imagen" es irremplazable por cualquier herramienta puramente visual.

> <strong>Vista previa en Modo Oscuro:</strong> Si tu SVG es blanco o de color claro, puede ser completamente invisible sobre un lienzo blanco estándar. ¡No te preocupes! Simplemente haz clic en el <strong>Botón de cambio al Modo Oscuro</strong> en la esquina superior derecha del lienzo para establecer instantáneamente un fondo oscuro, simulando perfectamente cómo se verá en un entorno de interfaz de usuario oscura.

---

## Característica Principal 3: El "Motor de Compresión Profunda" para Exprimir la Hinchazón

Los SVG exportados desde Illustrator o Figma por los diseñadores a menudo llevan una cantidad masiva de "contrabando": una pila de `<defs>` inútiles, `<metadata>` específicos del software de diseño y capas ocultas completamente sin sentido. Este código basura no solo ralentiza la velocidad de carga de tu página web, sino que también hace que tu HTML se vea increíblemente feo.

Expande el panel <strong>Optimizar</strong> (优化) a la izquierda, y verás dos opciones asesinas:

1. <strong>Modo Seguro</strong>: La opción más segura. Simplemente elimina comentarios, espacios redundantes, saltos de línea y metadatos inútiles. Absolutamente no alterará la apariencia visual del SVG. Esta es la forma más segura de adelgazar tu archivo.
2. <strong>Compresión Profunda</strong>: ¡Esta es la verdadera magia negra! Más allá de limpiar el código basura, utiliza algoritmos matemáticos subyacentes para fusionar curvas de Bézier, eliminar elementos ocultos invisibles y borrar atributos vacíos. ¡Un archivo de diseño de 10 KB, después de una compresión profunda, a menudo se puede reducir directamente a 2 KB, una reducción masiva del 80% en el tamaño del archivo!

Una vez que se completa la compresión, mostramos instantáneamente la <strong>diferencia de bytes antes y después de la optimización</strong>. Puedes ver visualmente exactamente cuánto ancho de banda le has ahorrado a tu proyecto. Si no estás satisfecho con el resultado comprimido (en casos muy raros, la compresión extrema podría deformar ligeramente formas complejas), simplemente haz clic en <strong>Restaurar Original</strong>, y todo volverá a su estado anterior.

---

## Característica Principal 4: El "Ataque Interdimensional" de la Exportación con Un Clic

No somos solo un editor; somos tu convertidor de formatos personal. Cuando hayas pulido un SVG perfecto, pero el Product Manager de repente se acerque corriendo y te diga: "Dame un PNG de alta resolución", nunca más tendrás que arrancarte el pelo.

En el panel <strong>Exportar</strong> (导出), puedes experimentar una verdadera conversión interdimensional con un solo clic:
- <strong>Escalado Multiplicador (1x / 2x / 4x)</strong>: Si necesitas una imagen ultraclara para imprimir o para pantallas Retina, selecciona 4x directamente. El editor primero ampliará sin pérdidas el gráfico vectorial en la memoria antes de rasterizarlo. El PNG exportado tendrá bordes lo suficientemente afilados como para cortar fruta.
- <strong>Relleno Inteligente de Fondo</strong>: Los PNG exportados tienen un fondo transparente por defecto. Pero si necesitas colocarlo en un documento oscuro, puedes seleccionar rellenarlo con <strong>Negro</strong> o <strong>Blanco</strong> con un clic, resolviendo por completo el incómodo problema de las imágenes "invisibles" en las presentaciones.

Ya sea que simplemente desees <strong>Copiar el Código SVG</strong> para pegarlo en tu proyecto, <strong>Descargar el archivo SVG</strong>, o <strong>Exportar un PNG de Alta Resolución</strong>, todo está listo y esperándote aquí.

¡Abre el panel de código ahora, arrastra un ícono y comienza tu mágico viaje con SVG!
