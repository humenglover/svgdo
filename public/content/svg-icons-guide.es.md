---

# Guía de Diseño de Iconos: El Flujo de Trabajo Completo Empezando con SVG (Deja de Dibujar Líneas al Azar)

Sinceramente, después de haberme hecho cargo de tantas bases de código heredadas, lo que más me vuelve loco no es solo el abuso de las etiquetas `<img>`, sino los iconos SVG que carecen de cualquier tipo de estandarización.

A veces abres la carpeta de recursos de un proyecto, y los iconos dentro son un desastre caótico: algunos son de 24x24, otros de 200x200; algunos tienen un ancho de línea de 1px, otros de 1.5px; algunos tienen colores codificados fijamente como `#333` en el `fill`, mientras que otros están envueltos en ocho capas de grupos `<g>`. Cada vez que el gerente de producto dice: "Añade un modo oscuro a estos iconos", los ingenieros frontend quieren renunciar en el acto.

El SVG es el puente entre el diseño y el código. Un conjunto de iconos verdaderamente excelente no se trata solo de "verse bien"; debe ser riguroso y controlable a nivel de ingeniería. Hoy no hablaremos de diseños estéticos esquivos. Comenzaremos directamente desde las especificaciones subyacentes más técnicas y discutiremos cómo un icono SVG de nivel empresarial debe ser realmente dibujado, administrado y utilizado.

---

## 1. Tira tu Mesa de Trabajo, Construye Primero una "Cuadrícula de Píxeles"

No sé a cuántos diseñadores les gusta simplemente arrastrar un cuadro casualmente en Figma y empezar a dibujar iconos. Esto es un tabú absoluto.

Los iconos de interfaz de usuario excelentes deben basarse en una cuadrícula de píxeles absolutamente rigurosa. El estándar más universal en la industria en este momento es un viewBox de **24x24**. Ya sea que estés dibujando una aguja o un elefante, el código final generado debe ser:

```html
<svg viewBox="0 0 24 24" width="24" height="24">
```

### Líneas Clave y Relleno (Padding)
Dentro de una mesa de trabajo de 24x24, ¡absolutamente no llenes el contenido hasta los bordes! Necesitas dejar al menos 2px de relleno de seguridad, por lo que el área de dibujo real es de solo 20x20.
¿Por qué? Porque cuando colocas un rectángulo redondeado junto a un círculo, dada la misma área de píxeles, el círculo parecerá visualmente más pequeño. Necesitas usar esta zona segura de 2px para agrandar ligeramente el círculo (rompiendo el límite de 20x20 para llegar a 22x22) para que se vean del mismo tamaño en la pantalla. Esto es lo que llamamos "equilibrio óptico".

![Comprobando el viewBox y el código fuente SVG en tiempo real bajo la Vista Dividida](/content/images/icon-split-view.png)

*Al usar nuestro editor SVG, cambia directamente al modo de vista dividida de código, y tu primer vistazo debe verificar si el `viewBox` es estrictamente 0 0 24 24. Si no, devuélvelo para que lo rehagan de inmediato.*

---

## 2. Especificaciones de Trazo: El Diablo está en los Detalles

Si tus iconos del sistema son de estilo lineal, entonces el **ancho del trazo debe ser uniforme**.

Para los iconos de 24x24, un **trazo de 2px** es la proporción áurea reconocida por casi todas las grandes empresas tecnológicas (Apple, Google, Microsoft). 1px se ve demasiado débil en pantallas que no son retina, y 1.5px causa problemas de renderizado de subpíxeles (borrosidad) en ciertas pantallas de baja resolución.

```html
<path d="..." stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
```

Además, se recomienda encarecidamente utilizar remates redondeados (`stroke-linecap="round"`) y uniones redondeadas (`stroke-linejoin="round"`). Compensan significativamente los bordes dentados que los gráficos vectoriales tienden a exhibir en resoluciones más bajas, haciendo que los iconos se vean mucho más suaves y amigables.

Lo más importante: **¡No mezcles y combines!** Tu proyecto no puede tener simultáneamente un icono de búsqueda de 1.5px y un icono de inicio de 2px. Esta discontinuidad visual degradará instantáneamente la sensación premium de toda la aplicación.

---

## 3. Gestión de Color: currentColor es el Único Dios Verdadero

Esta es una gran zona de conflicto entre los desarrolladores frontend y los diseñadores. Los SVG exportados por los diseñadores a menudo vienen con `#000000` o incluso valores de color más extraños.

Si el color en el SVG está codificado fijamente, se vuelve extremadamente doloroso para los desarrolladores frontend controlar los estados de desplazamiento o el modo oscuro a través de CSS (generalmente forzando el uso de feos filtros CSS para cambiar el color a la fuerza).

**La ÚNICA mejor práctica: Reemplazar el color principal con `currentColor`.**

```html
<!-- INCORRECTO -->
<svg fill="none" stroke="#333333">

<!-- CORRECTO -->
<svg fill="none" stroke="currentColor">
```

Al usar `currentColor`, el SVG actúa como texto, heredando automáticamente la propiedad `color` de su elemento padre. Si escribes `color: red;` en el contenedor exterior, el icono se vuelve rojo. En modo oscuro, si el texto se vuelve blanco, el icono automáticamente se vuelve blanco. Limpio, elegante y cero sobrecarga de rendimiento.

---

## 4. Experimenta a Fondo el Suave Flujo de Trabajo "WYSIWYG"

Hablar es fácil. A menudo, es difícil obligar a los diseñadores sin experiencia técnica a cumplir completamente con las especificaciones a nivel de código. Esto requiere que los desarrolladores frontend tengan un flujo de trabajo extremadamente útil para "limpiar" y "previsualizar" estos SVG.

Hemos integrado un flujo de trabajo increíblemente poderoso directamente en el Editor SVG. Puedes ver esta animación de demostración en tiempo real grabada puramente de forma local a continuación (esta no es una imagen de red enlazada externamente; se carga suavemente directamente desde tu entorno local):

![Una demostración completa del flujo de trabajo de importación, limpieza de código y exportación ultrarrápida de iconos SVG](/content/images/icon-workflow-demo.webp)

Como se demuestra en la animación, puedes extraer iconos que cumplen con los estándares de la biblioteca con un solo clic, o tirar tus archivos fuente desordenados. Usando los controles en el panel izquierdo, cambia directamente a **Split View** (Vista Dividida). Puedes ver la vista previa visual mientras eliminas despiadadamente esas etiquetas `<g>` redundantes, `<defs>` inútiles y código basura con colores codificados fijamente. Una vez verificado, presiona Exportar con un solo clic.

No es necesario alternar constantemente entre tu IDE y el navegador. Esta es la eficiencia que un desarrollador frontend moderno debería tener al manejar activos vectoriales.

---

## Conclusión: Construye Tu Lista de Verificación

La próxima vez que recibas un lote de iconos SVG, no te apresures a tirarlos en tu código. Revisa esta lista de verificación:

1. **Dimensiones Uniformes:** ¿Son todos los viewBoxes `0 0 24 24`?
2. **Trazo Consistente:** ¿El ancho del trazo es uniformemente de `2px` (o cualquier estándar que hayas establecido)?
3. **Herencia de Color:** ¿Todos los colores codificados fijamente se han reemplazado con `currentColor`?
4. **Pureza del Código:** ¿Se han comprimido y limpiado las etiquetas redundantes y el código basura generado por Figma?

Si todos pasan, felicidades, tu aplicación ya ha superado al 80% de los proyectos mal hechos en términos de detalle. Los estándares pueden ser tediosos, pero son la única base que permite que la ingeniería evolucione de manera sostenible.
