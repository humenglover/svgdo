---

# ¿SVG o PNG? ¿Cuál diablos deberías usar realmente? (Deja de meter imágenes de 10MB en mis proyectos)

Sinceramente, cada vez que me hago cargo de un nuevo proyecto, mi mayor temor no es el antiguo código basura heredado. Es abrir la carpeta `assets` y ser recibido por un caos desordenado de formatos de imagen.
Algunos diseñadores parecen pensar que PNG es el santo grial. Independientemente de si se trata de un icono, un logotipo o incluso unas pocas líneas decorativas rotas en el fondo, cortarán todo meticulosamente en PNGs con fondo transparente para ti. ¿Y el resultado? Una página de inicio de sesión de mierda que solo tiene algo de texto y unos pocos iconos termina cargando docenas de imágenes de mapa de bits, hinchando la carga útil a varios megabytes y dejando a los usuarios en una red 4G girando sus ruedas de carga hasta que quieren romper sus teléfonos.

Luego está la otra multitud. Leyeron algunos artículos exagerados elogiando los SVG y se transformaron instantáneamente en "Fundamentalistas Vectoriales". No importa qué tipo de imagen desordenada sea, incluso un render 3D con iluminación y sombras extremadamente complejas y miles de capas de degradado, obligan absolutamente a la herramienta de diseño a exportarla como un SVG. Esto da como resultado que el código esté repleto de decenas de miles de nodos `<path>` poligonales microscópicos, lo que hace que el motor de renderizado del navegador literalmente vomite sangre y se bloquee en el acto.

![Mi estado de ánimo al tratar de entender por qué un diseñador exportó una foto de alta resolución como SVG](/content/images/confused-math.gif)
*(Yo todos los días enfrentándome a estos formatos desordenados: ¿Quién diablos les enseñó a hacer esto?)*

Es 2026, por el amor de Dios, dejemos de cometer estos errores de aficionados. En este artículo largo de hoy, no habrá palabrería corporativa, ni estructuras de mierda generadas por IA de "en primer lugar, en segundo lugar, en conclusión". Voy a usar el lenguaje más crudo y directo para decirte exactamente qué formato usar en qué escenario olvidado de Dios. Si esto no son 1500 palabras de hechos puros y sin adulterar, te he fallado. Hoy vamos a masticar por completo este punto de dolor.

Primero destripemos a PNG.
Muchos desarrolladores frontend veteranos o diseñadores tienen una dependencia enfermiza de los PNG. Creen que admite fondos transparentes, tiene una gran compatibilidad y se puede usar en cualquier lugar. Sí, PNG es un mapa de bits comprimido sin pérdida; registra fielmente cada píxel en la matriz de ancho-alto de tu pantalla.
¿Pero conoces el mayor defecto fatal de los mapas de bits? "Capacidad de respuesta" y "Pantallas High-DPI".
Los teléfonos modernos lucen casualmente pantallas Retina de 3x o incluso 4x. Si mides un icono de 24x24 píxeles en el diseño, lo cortas como un PNG de 24x24 y lo pones en el iPhone 15 Pro Max de un usuario, la pixelación en los bordes es una atrocidad absoluta. Parece que alguien le ha puesto un desenfoque gaussiano.
Para arreglar la borrosidad, te ves obligado a cortar un icono de 72x72 de 3x. ¡Cielos, el tamaño del archivo acaba de aumentar 9 veces! Si tu página tiene cincuenta de estos iconos, las solicitudes de red por sí solas serán suficientes para hacerte sufrir. Sin mencionar que, si el gerente de producto de repente dice: "Oh, el color de este icono debe invertirse en modo oscuro", ¿tienes que volver atrás y cortar un conjunto completamente nuevo de PNGs blancos? Es absolutamente asqueroso.

Así que memoriza esto: **¡Todos los iconos de interfaz de usuario de color sólido, planos y simples, logotipos y decoraciones de líneas DEBEN, ABSOLUTAMENTE, SOLO ser SVGs! ¡No hay lugar para la negociación!**
SVG (Gráficos Vectoriales Escalables) no almacena píxeles en absoluto; ¡almacena fórmulas matemáticas! Le dice al navegador: "Dibuja una línea de aquí a allá y llénala de rojo". No importa cuán masiva sea la pantalla en la que lo pongas, incluso la valla publicitaria gigante en Times Square, los bordes calculados siempre serán absolutamente nítidos y el tamaño del archivo a menudo es de solo unos pocos KB. La parte más satisfactoria es que puedes usar CSS directamente para modificar su color, tamaño e incluso agregar animaciones a cada ruta en su interior.

¡PERO! Hagamos un giro, no pienses que SVG es un dios.
Los "Fundamentalistas Vectoriales" a los que maldecía al principio simplemente ignoran el defecto fatal de SVG.
SVG es una fórmula matemática, lo que significa que cuanto más complejo sea el gráfico, más larga será la fórmula. Cuando encuentras un render 3D complejo, una ilustración con múltiples texturas de ruido o una fotografía del mundo real, si fuerzas una exportación SVG, el software de diseño solo puede usar miles o millones de polígonos diminutos para "simular" esos píxeles.
¡En este punto, tu código SVG podría tener millones de líneas! Cuando el navegador lo renderiza, tiene que analizar estos millones de líneas XML en un árbol DOM. Tu CPU se maximiza instantáneamente y los ventiladores de refrigeración comienzan a gritar.

![La desesperación de ver un SVG de 10MB bloquear el navegador](/content/images/homer-bush.gif)
*(Viendo cómo el navegador se congela hasta la muerte en decenas de miles de nodos SVG mientras el PM urge por el lanzamiento, mi estado de ánimo es exactamente esta imagen)*

Por lo tanto, la regla rígida aquí es: **¡Siempre que la imagen contenga transiciones de color complejas, iluminación y sombras incontrolables, texturas de ruido densas, o necesites absolutamente un rendimiento extremo de renderizado por lotes, mete la cola entre las piernas y vuelve a usar PNG!**
PNG tiene ventajas incomparables en el registro de matrices de píxeles complejas. Cuando necesites admitir la derrota, simplemente admítela.

Así que aquí viene la verdadera pregunta. Si solo tienes una ilustración de alta gama en formato SVG a mano, pero en el escenario comercial actual (como necesitar meterla en algún antiguo editor de texto enriquecido que solo reconoce imágenes, o hacer optimización de renderizado por lotes en un juego Canvas), DEBES convertirla a un PNG, ¿qué haces?

El enfoque estúpido adoptado por la gran mayoría de las personas es: abrir el software de diseño o un navegador y hacer una captura de pantalla.
Literalmente te ruego, por favor deja de hacer este trabajo sucio. Una captura de pantalla no solo capturará el color de fondo de tu página web, sino que la nitidez será completamente destruida por el escalado de pantalla del sistema operativo.

Esta es exactamente la razón por la que obstinadamente construí un panel de conversión "puramente local, ultra-HD, escalado continuo" directamente en nuestro editor.

![Usando nuestra herramienta integrada para la conversión sin pérdida de alta definición](/content/images/svg-to-png-panel.webp)
*(Abandona las capturas de pantalla de fuerza bruta; utiliza un motor de renderizado Canvas puramente local para exportar a cualquier multiplicador sin distorsión)*

Solo necesitas lanzar ese problemático SVG a nuestro editor, ni siquiera mires el código, selecciona directamente el multiplicador de Escala (Scale) en el panel de exportación del lado derecho. Debido a que el archivo fuente es una fórmula matemática (SVG), ya sea que elijas 1x, 4x o un loco 10x, rasterizará instantáneamente una imagen PNG absolutamente nítida y perfectamente transparente para ti a través del motor subyacente Canvas justo dentro de la memoria de tu navegador.
Lo más importante es que todo esto se ejecuta en tu máquina local. No hay anuncios asquerosos y no necesitas subir tus iconos comerciales a algún servidor desconocido y dudoso.

Así es como debería verse el flujo de trabajo de un ingeniero frontend moderno. Deja de perder tu preciosa juventud en la conversión de formatos y la borrosidad de los píxeles. ¡Pongamos fin a este aburrido debate de "Vector vs Mapa de bits" hoy mismo!
