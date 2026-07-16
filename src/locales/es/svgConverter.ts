export default {
  title: 'Editor SVG',
  upload: 'Subir',
  url: 'URL',
  pasteCode: 'Pegar Código',
  pasteCodeTitle: 'Pegar Código SVG',
  syntaxError: 'Error de Sintaxis SVG',
  library: 'Biblioteca',
  empty: {
    welcome: 'Bienvenido al Editor SVG',
    desc: 'Arrastra un archivo SVG, haz clic en "Subir/Biblioteca", o pega código con Ctrl/Cmd+V',
    pastePlaceholder: 'Pega el código SVG aquí...',
    startFromExample: 'Empezar con ejemplos',
    startFromExampleDesc: 'Haz clic en un icono o sube tu propio SVG.',
    keyboardHint: 'Atajos: Ctrl + Rueda | Ctrl+± | Ctrl+0 Reset'
  },
  toolbar: {
    undo: 'Deshacer', redo: 'Rehacer', zoomIn: 'Acercar', zoomOut: 'Alejar',
    fit: 'Ajustar', reset: 'Reset Zoom', canvasBg: 'Fondo',
    preview: 'Vista', split: 'Dividir', code: 'Código'
  },
  transform: {
    title: 'Transformar', rotate: 'Rotar', flip: 'Voltear',
    flipH: 'Horizontal', flipV: 'Vertical', scale: 'Escalar',
  },
  optimize: {
    title: 'Optimizar', original: 'Original', current: 'Actual', mode: 'Modo',
    modeSafe: 'Seguro', modeAggressive: 'Agresivo',
    btnOptimize: 'Optimizar',
    copySvg: 'Copiar SVG', copyOptimized: 'Copiar optimizado',
    copyOriginal: 'Restaurar original',
    optimizeSuccess: '¡Optimizado! {{bytes}} bytes ahorrados ({{percent}}%)',
    alreadyOptimized: '¡Ya está optimizado!',
    optimizeFailed: 'Error de optimización',
    restored: 'Restaurado al original',
    copied: 'Copiado'
  },
  export: {
    title: 'Exportar',
    exportPng: 'Exportar PNG',
    bgTransparent: 'Transparente', bgWhite: 'Blanco', bgBlack: 'Negro',
    btnExportPng: 'Exportar PNG',
    downloadSvg: 'Descargar SVG',
    downloading: 'Descarga iniciada',
    exported: 'PNG exportado'
  },
  code: { title: 'Código SVG', copy: 'Copiar', copied: 'Copiado' },
  libraryModal: {
    title: 'Biblioteca', search: 'Buscar iconos...',
    results: '{{count}} resultados', loadMore: 'Cargar más',
  },
  urlModal: {
    title: 'Cargar desde URL',
    desc: 'Introduce la URL directa de un archivo SVG público.',
    placeholder: 'https://example.com/icon.svg',
    cancel: 'Cancelar', load: 'Cargar SVG', loadSuccess: 'SVG cargado'
  },
  article: {
    introTitle: 'Guía del Editor SVG',
    introDesc: 'Pega código SVG o arrastra archivos. Vista previa en tiempo real, compresión agresiva y exportación PNG.',
    principle: '100% Local: todo se procesa en tu navegador. Sin subidas al servidor, riesgo de privacidad cero.',
    howToUse: 'Cómo usar',
    whatIs: 'Preguntas frecuentes',
    whatIsDesc1: 'Consejos para empezar:',
    whatIsDesc2: '',
    badges: ['Sincronización dual', 'Compresión profunda', 'Exportación HD', '100% Local'],
    steps: [
      { title: 'Paso 1. Importar', desc: 'Ctrl+V para pegar código, obtener desde URL o elegir de la biblioteca.' },
      { title: 'Paso 2. Editar', desc: 'Modifica el código a la izquierda, ve los cambios a la derecha.' },
      { title: 'Paso 3. Optimizar', desc: 'Haz clic en Optimizar para eliminar etiquetas y metadatos innecesarios.' },
      { title: 'Paso 4. Exportar', desc: 'Descarga como SVG optimizado o PNG.' },
    ],
    features: [
      { title: '¿Hay atajos?', desc: 'Ctrl + Rueda para zoom, Ctrl +/- para escalar, Ctrl 0 para reset.' },
      { title: '¿Código y lienzo sincronizados?', desc: '¡Sí! Cualquier transformación en el lienzo actualiza el código.' },
      { title: '¿Por qué tanta compresión?', desc: 'Eliminamos agresivamente etiquetas vacías y precisión excesiva de los SVG exportados.' }
    ],
  },
  mobile: { canvas: 'Lienzo', transform: 'Transformar', optimize: 'Optimizar', export: 'Exportar' }
}
