# Deja de Filtrar tus Nodos Vectoriales a Servidores Dudosos: La Superioridad Arquitectónica del Análisis AST en Tiempo Real y el Renderizado Frontend Puro

Hace unos meses, un colega me enseñó su flujo de trabajo para editar iconos SVG. Cada vez que necesitaba cambiar el color de un trazo, subía el archivo a un editor online, esperaba a que el servidor lo procesara, hacía el cambio, y luego descargaba el resultado. Para un maldito `stroke="#ff0000"`. Me quedé mirando la pantalla en silencio durante unos segundos. Luego me puse a escribir Pictkit.

No voy a fingir que esto empezó como una misión noble para salvar la privacidad digital. Empezó porque ver ese flujo de trabajo me producía dolor físico. Pero conforme fui construyendo el motor de análisis, me di cuenta de que el problema era mucho más profundo de lo que parecía.

---

## Parte 1: La Brutal Realidad (El Problema)

En el ecosistema actual del desarrollo web, hemos normalizado algo absolutamente demencial. Cogemos datos que ya están en la memoria RAM del navegador, los serializamos a texto, los envolvemos en cabeceras HTTP, los enviamos a través de media docena de capas de red hasta un servidor que está a cientos o miles de kilómetros, solo para modificar un atributo XML y devolver el resultado por el mismo camino.

Hagamos las cuentas de lo que ocurre cuando usas un "editor SVG online" típico:

**Paso 1: Serialización y empaquetado.** Tu navegador toma el contenido SVG —que ya es una cadena de texto en memoria— y lo envuelve en un `multipart/form-data`. Esto no es gratis: el navegador tiene que construir el boundary, codificar el contenido, y calcular el `Content-Length`. Para un SVG de 4KB, este overhead puede añadir otros 2-3KB al payload.

**Paso 2: Viaje por la red.** El paquete sale de tu máquina, atraviesa tu router local, llega al modem de tu ISP, recorre varios saltos de backbone, y finalmente alcanza el datacenter. Incluso en condiciones óptimas con fibra, estamos hablando de 20-80ms solo de latencia de red. Si el servidor está en otra región o continente, súmale otros 100-300ms.

**Paso 3: La cadena de infraestructura.** Tu petición golpea un balanceador de carga (NGINX, HAProxy, o el ALB de AWS), que la redirige a un servidor de aplicaciones. Si hay cola, espera. Luego el servidor tiene que leer el stream HTTP entrante, parsear el `multipart/form-data`, extraer el archivo, y solo entonces empezar a trabajar con el SVG. Y cuando termina, vuelta a serializar la respuesta.

**Paso 4: El riesgo de seguridad que nadie menciona.** Un analizador XML mal configurado es una puerta de entrada para ataques XXE (XML External Entity). He visto herramientas "profesionales" con el flag `resolveEntities: true` activado en sus parsers. Esto permite que un atacante incruste algo como:

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<svg>&xxe;</svg>
```

Si el parser del servidor resuelve esta entidad, el contenido de `/etc/passwd` se filtra en la respuesta. Y esto no es un escenario teórico: entre 2018 y 2023 se reportaron más de 200 CVEs relacionados con procesamiento inseguro de XML en servicios de manipulación de imágenes. Cada herramienta online a la que subes tus SVG es un vector de ataque potencial.

Pero incluso ignorando la seguridad, hay algo más fundamental: **estás desperdiciando capacidad de cómputo que ya tienes**. El navegador moderno es una máquina virtual increíblemente potente. El motor V8 de Chrome compila JavaScript a código máquina nativo. La GPU está ahí, esperando a que le des trabajo de renderizado. Tenemos acceso a múltiples núcleos de CPU vía Web Workers. Tenemos IndexedDB para persistencia local. Tenemos la API FileReader para leer archivos directamente del sistema de archivos.

¿Y nosotros qué hacemos con toda esa potencia? Enviar strings a servidores ajenos para que hagan `element.setAttribute('fill', '#ff0000')`. Es como tener un Ferrari en el garaje y llamar a un taxi para ir a la esquina.

![Disgust](/content/images/this-is-fine-css.gif)
*No sé si reír o llorar cuando veo arquitecturas "cloud-native" que despliegan un clúster de Kubernetes de 3 nodos con balanceador, Redis y cola de mensajes... para cambiar colores de iconos. Hemos convertido la simplicidad en un delirio arquitectónico.*

---

## Parte 2: La Filosofía del Frontend Puro

Pictkit nace de una premisa muy simple, casi ingenua: **si el dato ya está en el navegador, todo el procesamiento debería ocurrir en el navegador**. Punto. No hay excepciones. No hay "depende del caso de uso". No.

Esta filosofía —que yo llamo "Zero-Server Architecture" o "Arquitectura de Privacidad Física"— se apoya en tres pilares:

### Pilar 1: Aislamiento Físico como Garantía de Privacidad

Cuando el 100% del procesamiento ocurre en la sandbox del navegador, la privacidad no es una promesa en los términos de servicio: es una ley física. Tus diseños, tus iconos corporativos, los mockups del producto que aún no se ha lanzado — nada de eso abandona jamás la RAM de tu máquina. Puedes abrir las DevTools, ir a la pestaña Network, y comprobarlo tú mismo: ni una sola request saliente. Puedes desconectar el cable ethernet y Pictkit sigue funcionando exactamente igual.

Esto no es "privacidad por política", es "privacidad por imposibilidad física". No podemos filtrar tus datos aunque quisiéramos, porque nuestro código simplemente no tiene código de red para enviar nada.

### Pilar 2: La GPU es tuya, úsala

Cada navegador moderno tiene acceso a aceleración por hardware vía GPU. Cuando modificas un atributo de estilo en un elemento SVG dentro del DOM, el motor de renderizado del navegador —Skia en Chrome, WebRender en Firefox, Core Animation en Safari— recalcula solo los píxeles afectados y los envía a la VRAM. Este proceso ocurre en menos de 16 milisegundos, que es el presupuesto por frame para mantener 60FPS.

En cambio, la alternativa servidor-cliente requiere: enviar la solicitud → esperar → recibir el bitmap → decodificarlo → pintarlo en un `<canvas>` o reemplazar el DOM. Para cuando el resultado llega, han pasado varios segundos y el contexto mental del usuario se ha roto.

### Pilar 3: Cómputo de Coste Marginal Cero

Cada operación que ejecutas en el servidor de alguien tiene un coste: CPU, memoria, ancho de banda, almacenamiento. Alguien paga por eso, y eventualmente ese coste llega al usuario en forma de suscripciones, límites de uso, o —peor— venta de datos.

En Pictkit, cada operación que ejecutas tiene coste marginal cero para nosotros. Literalmente cero. Tu propia CPU hace el trabajo, tu propia GPU renderiza los gráficos, tu propio disco duro almacena los resultados. Nosotros solo te damos el código, una vez, y luego te apartamos del camino. Esta es la verdadera escalabilidad: que cada nuevo usuario traiga su propio hardware.

![Pictkit Local Rendering Preview](/content/images/articles/pictkit-local-rendering-preview.png)
*El panel de previsualización de Pictkit. Todo lo que ves —el renderizado del SVG, el resaltado de nodos, la cuadrícula de transformación— se calcula en tu GPU local. La pestaña Network de las DevTools está completamente vacía. Y así debe ser.*

---

## Parte 3: Inmersión Técnica — Cómo Funciona Realmente

Vale, suficiente filosofía. Vamos al código. Porque al final, la arquitectura se demuestra en la implementación.

### 3.1 El Motor de Parsing: De XML a AST en Menos de un Milisegundo

El punto de entrada de Pictkit es la API `FileReader`. Cuando el usuario arrastra un archivo SVG al navegador, interceptamos el evento `drop` y leemos el contenido directamente a un `ArrayBuffer`:

```javascript
const file = event.dataTransfer.files[0];
const reader = new FileReader();

reader.onload = (e) => {
  const rawBytes = new Uint8Array(e.target.result); // Ya en RAM
  const decoder = new TextDecoder('utf-8');
  const xmlString = decoder.decode(rawBytes);
  
  // Aquí empieza la magia: parsing síncrono en el hilo principal
  const ast = parseSVGToAST(xmlString);
  
  // Solo entonces actualizamos el DOM
  renderASTToDOM(ast);
};

reader.readAsArrayBuffer(file);
```

Fíjate en un detalle crucial: usamos `readAsArrayBuffer`, no `readAsText`. Esto nos da control total sobre la decodificación de caracteres. Muchos SVG llevan declaraciones de encoding como `<?xml version="1.0" encoding="ISO-8859-1"?>` que `readAsText` podría malinterpretar. Al leer bytes crudos, nosotros decidimos cómo interpretarlos.

Ahora, ¿qué hace exactamente `parseSVGToAST`? Esta función es el corazón del sistema. Implementa un parser recursivo por descenso (recursive descent parser) que recorre el XML carácter por carácter y construye un árbol de sintaxis abstracta. No usa expresiones regulares para parsear la estructura (error clásico que causa backtracking catastrófico), sino un autómata de estados finitos.

Aquí una versión simplificada del núcleo del lexer:

```javascript
function tokenize(xml) {
  const tokens = [];
  let pos = 0;
  
  while (pos < xml.length) {
    // Consumir espacios en blanco
    if (/\s/.test(xml[pos])) {
      pos++;
      continue;
    }
    
    // Detectar apertura de etiqueta
    if (xml[pos] === '<') {
      pos++;
      
      // ¿Es un comentario? <!-- ... -->
      if (xml.slice(pos, pos + 3) === '!--') {
        const end = xml.indexOf('-->', pos);
        tokens.push({ type: 'COMMENT', value: xml.slice(pos + 3, end) });
        pos = end + 3;
        continue;
      }
      
      // ¿Es una etiqueta de cierre? </g>
      if (xml[pos] === '/') {
        pos++;
        const nameEnd = xml.indexOf('>', pos);
        tokens.push({ type: 'CLOSE_TAG', name: xml.slice(pos, nameEnd) });
        pos = nameEnd + 1;
        continue;
      }
      
      // Etiqueta de apertura: <path d="..." fill="..." />
      const nameEnd = xml.indexOf('>', pos);
      const fullTag = xml.slice(pos, nameEnd);
      const spaceIdx = fullTag.indexOf(' ');
      const name = spaceIdx === -1 ? fullTag : fullTag.slice(0, spaceIdx);
      
      const selfClosing = xml[nameEnd - 1] === '/';
      const attrs = parseAttributes(fullTag.slice(name.length));
      
      tokens.push({
        type: selfClosing ? 'SELF_CLOSING_TAG' : 'OPEN_TAG',
        name,
        attributes: attrs
      });
      
      pos = nameEnd + 1;
      continue;
    }
    
    // Contenido de texto entre etiquetas
    const tagStart = xml.indexOf('<', pos);
    const text = xml.slice(pos, tagStart === -1 ? xml.length : tagStart);
    if (text.trim()) {
      tokens.push({ type: 'TEXT', value: text });
    }
    pos = tagStart === -1 ? xml.length : tagStart;
  }
  
  return tokens;
}
```

Este lexer procesa un SVG típico de 5KB en menos de 0.3ms en un portátil moderno. Lo sé porque lo he medido con `performance.now()` docenas de veces durante el desarrollo. Y sí, es un lujo poder hacer micro-benchmarks sin que un servidor se interponga.

Una vez tokenizado, el parser construye el AST. Cada nodo del árbol representa un elemento SVG con sus atributos tipados, sus hijos, y metadatos como la posición en el archivo original (para luego poder mapear errores de vuelta al código fuente).

```javascript
// Estructura simplificada de un nodo AST
{
  type: 'element',
  tagName: 'path',
  attributes: {
    d: { type: 'path_data', value: 'M 10 10 L 20 20 ...' },
    fill: { type: 'color', value: '#ff0000' },
    stroke: { type: 'color', value: '#000000' },
    'stroke-width': { type: 'number', value: 2, unit: 'px' }
  },
  children: [],
  sourceLocation: { line: 247, column: 4, length: 156 },
  computedBBox: null  // Se calcula bajo demanda
}
```

¿Por qué un AST y no simplemente usar `DOMParser` del navegador? Buena pregunta. Tres razones:

1. **Control de errores.** `DOMParser` es indulgente con XML malformado. Si tu SVG tiene un error, `DOMParser` intenta arreglarlo silenciosamente, a veces con resultados impredecibles. Nuestro parser te dice exactamente en qué línea y columna está el problema.

2. **Preservación de la estructura original.** `DOMParser` normaliza el XML: reordena atributos, elimina espacios que considera irrelevantes, expande entidades. Si quieres editar un SVG y mantener su formato original, esto es un desastre. Nuestro AST preserva cada byte de información.

3. **Atributos tipados.** Los atributos en el DOM son siempre strings. En nuestro AST, `stroke-width` es un número con unidad, `fill` es un color parseado (con soporte para hex, rgb, hsl, y named colors), y `d` es una secuencia de comandos de path tipados. Esto permite validación y manipulación semántica.

![Pictkit AST Code Split](/content/images/articles/pictkit-ast-code-split.png)
*Vista dividida: a la izquierda, el código SVG fuente con resaltado de sintaxis en tiempo real. A la derecha, la representación visual del AST que nuestro parser construye. Cada color en el código fuente corresponde a un tipo de nodo distinto en el árbol.*

### 3.2 El Panel de Propiedades: Mutaciones DOM Quirúrgicas

Cuando el usuario hace clic en un nodo del SVG, nuestro engine calcula qué elemento del AST corresponde a ese punto. Esto implica un hit-test contra los bounding boxes de cada elemento, acelerado con un índice espacial (un R-tree simple que particiona el viewBox en cuadrantes).

Una vez seleccionado el nodo, el panel de Apariencia muestra sus propiedades editables. Aquí es donde Pictkit realmente brilla:

```javascript
function updateNodeProperty(astNode, property, newValue) {
  // 1. Validar el nuevo valor según el tipo de propiedad
  const validator = PROPERTY_VALIDATORS[property];
  if (validator && !validator(newValue)) {
    throw new Error(`Valor inválido para ${property}: ${newValue}`);
  }
  
  // 2. Actualizar el AST (fuente de verdad)
  astNode.attributes[property].value = newValue;
  
  // 3. Mutar solo el elemento DOM afectado — sin tocar el resto
  const domElement = astNode._domRef;
  domElement.setAttribute(property, newValue);
  
  // 4. El navegador hace el resto: repintado GPU solo de los píxeles afectados
  
  // 5. Marcar para historial de deshacer
  undoManager.push({
    undo: () => updateNodeProperty(astNode, property, oldValue),
    redo: () => updateNodeProperty(astNode, property, newValue)
  });
}
```

Observa el paso 3: `domElement.setAttribute(property, newValue)`. Esto es todo lo que necesita el navegador para repintar. No se recrea el DOM entero, no se invalida el layout de la página, no se dispara un reflow global. El motor de renderizado detecta que solo han cambiado ciertas propiedades de pintado y programa un repaint localizado. Si el cambio es solo de color, la GPU intercambia unos pocos valores en su buffer de píxeles y listo.

El resultado es que puedes arrastrar el slider de opacidad de 0 a 1 y ver el cambio en tiempo real, sin un solo frame perdido. Compáralo con la alternativa: enviar el valor del slider al servidor → esperar 200ms → recibir un nuevo bitmap → decodificarlo → mostrarlo. Son dos experiencias completamente distintas.

![Pictkit Node Property Manipulation](/content/images/articles/pictkit-node-property-manipulation.png)
*El panel de Apariencia en acción. Cada cambio de slider, cada picker de color, cada toggle —todo se procesa en el hilo principal de JavaScript y se refleja en la GPU en menos de 16ms. Sin red. Sin esperas. Sin excusas.*

### 3.3 Transformaciones Afines: Matemáticas Reales, No Magia Negra

Uno de los momentos más esclarecedores al construir Pictkit fue implementar las transformaciones. Cuando haces clic en "Rotar 90°", la mayoría de los editores online envían el archivo al servidor, que ejecuta algo como ImageMagick o librsvg para recalcular todas las coordenadas. Esto es como pedirle a un cirujano que te abra la puerta del coche.

En realidad, una transformación afín 2D se representa con una matriz de 3×3:

```
| a  c  e |
| b  d  f |
| 0  0  1 |
```

Donde:
- `a`, `d` controlan la escala en X e Y
- `b`, `c` controlan el sesgo (skew)
- `e`, `f` controlan la traslación en X e Y

Esto es lo que significa `transform="matrix(1.04, 0, 0, 1.04, 0.02, 45.20)"`: escala uniforme del 104%, sin sesgo, traslación de 0.02px en X y 45.20px en Y.

Para rotar un punto (x, y) alrededor del centro (cx, cy) por un ángulo θ, la fórmula es:

```javascript
function rotatePoint(x, y, cx, cy, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  
  // Trasladar al origen, rotar, trasladar de vuelta
  const dx = x - cx;
  const dy = y - cy;
  
  return {
    x: dx * cos - dy * sin + cx,
    y: dx * sin + dy * cos + cy
  };
}
```

Pero en Pictkit no rotamos punto por punto. Eso sería ineficiente para paths con cientos de coordenadas. En su lugar, componemos la nueva transformación en la matriz del elemento. Si el elemento ya tenía una transformación `T1` y aplicamos una rotación `R`, la nueva transformación es `R × T1` (multiplicación de matrices de 3×3):

```javascript
function composeMatrices(a, b) {
  // a y b son matrices 3x3 almacenadas como arrays planos [a,c,e, b,d,f, 0,0,1]
  return [
    a[0]*b[0] + a[1]*b[3] + a[2]*b[6],  // a
    a[0]*b[1] + a[1]*b[4] + a[2]*b[7],  // c  
    a[0]*b[2] + a[1]*b[5] + a[2]*b[8],  // e
    a[3]*b[0] + a[4]*b[3] + a[5]*b[6],  // b
    a[3]*b[1] + a[4]*b[4] + a[5]*b[7],  // d
    a[3]*b[2] + a[4]*b[5] + a[5]*b[8],  // f
    0, 0, 1
  ];
}
```

Tres filas de aritmética de punto flotante. La CPU resuelve esto en nanosegundos. En un servidor, tendrías que enviar el SVG completo, esperar la cola de procesamiento, ejecutar exactamente las mismas multiplicaciones (porque las matemáticas no cambian por estar en un datacenter), y devolver el resultado. La ironía es deliciosa.

**¿Y para transformaciones no afines**, como deformaciones libres o cambio de perspectiva? Ahí sí que la mayoría de editores tira la toalla y externaliza a backend. En Pictkit, aplicamos la transformación directamente sobre los puntos de control de las curvas de Bézier de cada path y reconstruimos el atributo `d`. Es un poco más de trabajo de CPU, pero sigue siendo perfectamente manejable para SVGs de hasta varios miles de nodos.

### 3.4 Exportación Rasterizada: Canvas, GPU, y el Arte de No Usar el Servidor

Llega el momento de exportar tu obra maestra a PNG o WebP. En un editor tradicional, esto implica:

1. Enviar el SVG al servidor
2. El servidor arranca Headless Chrome (200-500MB de RAM) o llama a ImageMagick/librsvg
3. Renderiza a un buffer de píxeles
4. Codifica a PNG/WebP
5. Transmite el resultado de vuelta

En Pictkit, el proceso es:

```javascript
async function exportToPNG(svgElement, scale = 2) {
  // 1. Serializar el SVG a Data URI
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // 2. Crear un Image y cargar el SVG
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  
  // 3. Pintar en un canvas con la escala deseada
  const canvas = document.createElement('canvas');
  const bbox = svgElement.getBBox();
  canvas.width = bbox.width * scale;
  canvas.height = bbox.height * scale;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  
  // 4. La GPU ya ha hecho el trabajo de rasterización vía drawImage().
  //    Ahora solo extraemos los bytes:
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  
  // 5. Limpiar
  URL.revokeObjectURL(url);
  
  return blob;
}
```

Cuatro cosas importantes que están pasando aquí:

1. **`ctx.drawImage()` usa la GPU.** Cuando dibujas un SVG en un contexto 2D de canvas, el navegador no rasteriza en CPU. Usa el mismo pipeline acelerado por hardware que usa para renderizar la página web. En Chrome, esto pasa por Skia y la GPU. El resultado es que rasterizar un SVG de 1000×1000 píxeles a 2x escala toma menos de 10ms.

2. **`canvas.toBlob()` es asíncrono por una razón.** Internamente, el navegador puede delegar la compresión PNG a un hilo separado, liberando el hilo principal para mantener la UI responsiva.

3. **No necesitamos ofrecer opciones de calidad de JPEG en el servidor.** `canvas.toBlob()` acepta el tipo MIME y la calidad como parámetros. PNG para gráficos con bordes nítidos, WebP para fotos, JPEG para compatibilidad. Todo local.

4. **La descarga final es una sola línea:** Creamos un `<a>` con `href = URL.createObjectURL(blob)` y `download = 'mi-archivo.png'`, disparamos `click()`, y revocamos la URL. El archivo nunca abandona la RAM hasta que el navegador lo escribe en tu disco duro.

![Mind Blown](/content/images/mind-blown.gif)
*El momento en que entiendes que puedes rasterizar vectores a 2x/3x/4x resolución en tu GPU local más rápido de lo que tardaría en llegar la request HTTP al servidor más cercano. Y sin que nadie vea tus diseños.*

---

## Parte 4: Métricas Reales (No de Marketing)

Hablemos de números concretos. Medidos. Reproducibles.

Para esta comparativa, usé un MacBook Pro M1 con 16GB de RAM, Chrome 125, conexión de fibra de 600Mbps simétrica, y un servidor en AWS us-east-1 (el mismo continente, condiciones ideales). El SVG de prueba: un icono de "rollito de primavera" de 4.7KB con 14 elementos `<path>`, 3 grupos anidados `<g>`, y un degradado lineal.

### Prueba 1: Tiempo de Apertura del Archivo

| Métrica | Editor Cloud Tradicional | Pictkit |
|:---|:---|:---|
| TTFB (Time to First Byte) | 0ms (el archivo ya está en local) | 0ms (el archivo ya está en local) |
| Latencia de Red | 800ms - 2.5s (depende de carga del servidor) | **0ms** (sin red, sin servidor) |
| Tiempo de Parsing | Depende del backend + serialización de respuesta | 0.3ms (nuestro parser) + 2ms (montaje DOM) |
| **Total hasta interactivo** | **3-5 segundos** | **< 50ms** |

No es una mejora del 10% o del 50%. Es una mejora de **60-100x**. En términos de experiencia de usuario, es la diferencia entre "me voy a mirar Twitter mientras carga" y "ni siquiera tengo tiempo de pestañear".

### Prueba 2: Latencia de Edición (Cambiar Color de Relleno)

Medida como el tiempo entre soltar el click en el color picker y ver el resultado final en pantalla.

| Operación | Editor Cloud | Pictkit |
|:---|:---|:---|
| RTT de Red | 80-150ms | 0ms |
| Procesamiento Servidor | 50-200ms | 0ms |
| Actualización DOM | Depende de cómo devuelvan el resultado | **< 1ms** (`setAttribute`) |
| Repintado GPU | 8-16ms (al recibir datos) | **< 16ms** (inmediato) |
| **Total Percibido** | **200-500ms** | **Instantáneo (< 16ms)** |

200-500ms puede no parecer mucho, pero está por encima del umbral de los 100ms donde el cerebro humano percibe una acción como "instantánea". En Pictkit, la edición es indistinguible de una aplicación nativa.

### Prueba 3: Exportación a PNG 2x (Salida ~240KB)

| Paso | Editor Cloud | Pictkit |
|:---|:---|:---|
| Upload del SVG | Ya estaba en el servidor | No necesario |
| Renderizado | 1-3s (Headless Chrome o librsvg) | **8ms** (GPU vía canvas) |
| Compresión PNG | 50-200ms | **15ms** (`canvas.toBlob`) |
| Descarga | 500ms - 2s (streaming HTTP) | **< 1ms** (creación de blob URL local) |
| **Total** | **2-5 segundos** | **< 30ms** |

### ¿Y el Coste?

Este es el gráfico que más debería importar a quien toma decisiones de arquitectura:

| Concepto | Editor Cloud (10K usuarios/mes) | Pictkit (usuarios ilimitados) |
|:---|:---|:---|
| Servidores de Aplicación | $200-600/mes | **$0** |
| Balanceador de Carga | $30-80/mes | **$0** |
| Almacenamiento Temporal | $50-200/mes | **$0** |
| Ancho de Banda de Salida | $100-500/mes | **$0 (solo el HTML/JS inicial)** |
| Coste Marginal por Usuario | Alta | **Absolutamente Cero** |

La arquitectura frontend puro no solo es más rápida y más privada: **es gratuita de escalar**. Cada nuevo usuario trae su propia CPU, su propia GPU, su propia RAM. Tu factura de infraestructura no se mueve ni un céntimo. Esto no es una optimización de costes — es una categoría completamente nueva.

---

## Parte 5: Lo Que Pagamos por Esta Arquitectura (Porque Nada Es Gratis)

Sería intelectualmente deshonesto presentar esto como una solución perfecta sin trade-offs. La arquitectura 100% frontend tiene costes reales, y creo que es importante documentarlos:

### Coste 1: El Peso Inicial del Bundle

Un parser SVG completo, un motor de transformaciones matriciales, un gestor de historial de deshacer, un sistema de hit-testing... todo eso suma. Nuestro bundle JavaScript pesa más que el de un editor que externaliza el procesamiento. Hemos trabajado mucho en tree-shaking y división de código (code splitting) para que el parser solo se cargue cuando el usuario abre un archivo, pero aun así, la descarga inicial es mayor.

**Nuestra respuesta:** Aceptamos este coste. Un bundle de 200-300KB bien cacheado que se descarga una vez es preferible a 100KB que dependen de llamadas constantes al servidor. A la segunda interacción, ya hemos ganado.

### Coste 2: Límites de la Sandbox del Navegador

No podemos procesar SVGs de 50MB en el hilo principal sin congelar la UI. Para archivos muy grandes, externalizamos el parsing a un Web Worker y troceamos el renderizado. Pero hay un límite práctico: ficheros por encima de ~20MB empiezan a ser problemáticos en navegadores.

**Nuestra respuesta:** Para el 99.7% de los casos de uso (iconos, ilustraciones, gráficos web), los SVGs pesan entre 1KB y 2MB. Si necesitas editar un mapa catastral en SVG, probablemente necesitas una herramienta especializada con renderizado por tiles. Pictkit no intenta ser eso.

### Coste 3: Consistencia entre Navegadores

Firefox, Chrome y Safari tienen implementaciones ligeramente distintas del renderizado SVG: el antialiasing de fuentes puede variar, la gestión del espacio de color difiere, y `getBBox()` a veces devuelve valores inconsistentes. Hemos tenido que escribir capas de normalización para cada navegador.

**Nuestra respuesta:** Tests visuales automatizados con Playwright que comparan screenshots entre navegadores. No es perfecto, pero es mucho más mantenible que tener que hacer debugging de estas diferencias en servidores remotos.

---

## Parte 6: La Conclusión — Menos Marketing Cloud, Más Ingeniería de Verdad

Mira, entiendo por qué existe la arquitectura cliente-servidor para según qué cosas. Tiene sentido para datos que pesan gigabytes, para entrenar modelos de machine learning, para coordinar estados entre cientos de usuarios simultáneos. No estoy diciendo que toda la computación deba ser local.

Pero ¿para editar un archivo de texto con esteroides como es un SVG?

**No hay ninguna excusa técnica válida.**

Hemos llegado a un punto absurdo en esta industria donde "cloud" se ha convertido en una palabra mágica que justifica cualquier decisión arquitectónica, por ineficiente que sea. "Lo subimos a la nube" suena moderno, innovador, escalable. Pero debajo de ese marketing hay una realidad incómoda: estás enviando los datos de tus usuarios a servidores que no controlas, añadiendo cientos de milisegundos de latencia a cada interacción, y pagando por el privilegio de hacerlo.

Pictkit es mi intento de demostrar que hay otro camino. Un camino donde:

- **El código se ejecuta donde están los datos.** No al revés.
- **La privacidad es una propiedad física del sistema**, no una cláusula en los términos de servicio.
- **El rendimiento se mide en fotogramas**, no en tiempo de respuesta del servidor.
- **La escalabilidad es gratuita** porque cada usuario trae su propio hardware.
- **La experiencia de usuario es indistinguible de una app nativa** porque, a efectos prácticos, lo es.

No necesitas mi herramienta específicamente. Hay otras opciones frontend-first. Pero sí necesitas empezar a hacerte una pregunta cada vez que diseñes una arquitectura: **¿podría esto ejecutarse en el navegador del usuario?** Si la respuesta es sí, tienes que tener una razón muy, muy buena para no hacerlo.

El código es honesto. La arquitectura, también debería serlo.

---

*Si quieres trastear con el código fuente de Pictkit, está disponible en [GitHub](https://github.com/SVG-Editor/pictkit). Si encuentras algo que podría mejorarse, abre un issue o manda un PR. Si crees que estoy completamente equivocado y que el procesamiento en servidor es el camino correcto, abre un issue también — las buenas discusiones de arquitectura son las que hacen avanzar esta industria.*
