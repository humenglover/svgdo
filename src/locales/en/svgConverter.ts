export default {
  title: 'SVG Editor',
  upload: 'Upload', url: 'URL',
  pasteCode: 'Paste Code', pasteCodeTitle: 'Paste SVG Code', syntaxError: 'SVG Syntax Error',
  library: 'Icon Library',
  empty: {
    welcome: 'Welcome to SVG Editor',
    desc: 'Drag & drop SVG file here, or click "Upload/Icon Library", or paste code with Ctrl/Cmd+V',
    pastePlaceholder: 'Paste raw SVG code here...',
    startFromExample: 'Start from examples',
    startFromExampleDesc: 'Click on any icon below, or upload your own SVG.',
    keyboardHint: 'Shortcuts: Ctrl + Scroll | Ctrl+± | Ctrl+0 Reset'
  },
  toolbar: { undo: 'Undo', redo: 'Redo', zoomIn: 'Zoom In', zoomOut: 'Zoom Out', fit: 'Fit to Screen', reset: 'Reset Zoom', canvasBg: 'Canvas Background', preview: 'Preview', split: 'Split', code: 'Code' },
  transform: { title: 'Transform', rotate: 'Rotate', flip: 'Flip', flipH: 'Horizontal', flipV: 'Vertical', scale: 'Scale' },
  optimize: {
    title: 'Optimize', original: 'Original', current: 'Current', mode: 'Mode',
    modeSafe: 'Safe', modeAggressive: 'Aggressive', btnOptimize: 'Optimize',
    copySvg: 'Copy SVG', copyOptimized: 'Copy Optimized', copyOriginal: 'Restore Original',
    optimizeSuccess: 'Optimized! Saved {{bytes}} bytes ({{percent}}%)', alreadyOptimized: 'Already optimized!',
    optimizeFailed: 'Optimization failed', restored: 'Restored to original', copied: 'Copied'
  },
  export: { title: 'Export', exportPng: 'Export PNG', bgTransparent: 'Transparent', bgWhite: 'White', bgBlack: 'Black', btnExportPng: 'Export PNG', downloadSvg: 'Download SVG', downloading: 'Download started', exported: 'PNG exported' },
  code: { title: 'SVG Code', copy: 'Copy', copied: 'Copied' },
  libraryModal: { title: 'Icon Library', search: 'Search icons...', results: '{{count}} results', loadMore: 'Load more' },
  urlModal: { title: 'Load from URL', desc: 'Enter a valid remote SVG file URL to load directly.', placeholder: 'https://example.com/icon.svg', cancel: 'Cancel', load: 'Load SVG', loadSuccess: 'SVG loaded successfully' },
  article: {
    introTitle: 'SVG Editor Guide', introDesc: 'Paste your SVG code, or drag & drop files. Real-time preview, aggressive minification, and PNG export.',
    principle: 'Pure Local Rendering: 100% processed in your browser. No server uploads, zero privacy risk.',
    howToUse: 'How to Use', whatIs: 'FAQ', whatIsDesc1: 'Some tips to get you started:', whatIsDesc2: '',
    badges: ['Two-way Binding', 'Deep Compress', 'HD PNG Export', '100% Local'],
    steps: [
      { title: 'Step 1. Import', desc: 'Ctrl+V to paste code, fetch from URL, or pick from Library.' },
      { title: 'Step 2. Edit', desc: 'Tweak code on the left, instantly see changes on the right.' },
      { title: 'Step 3. Optimize', desc: 'Click Optimize to strip useless tags and metadata.' },
      { title: 'Step 4. Export', desc: 'Download as minified SVG or PNG.' },
    ],
    features: [
      { title: 'Any shortcuts?', desc: 'Ctrl + Scroll to zoom, Ctrl +/- to scale, Ctrl 0 to reset.' },
      { title: 'Are code and canvas synced?', desc: 'Yes! Any transform on the canvas instantly updates the code.' },
      { title: 'Why is compression so high?', desc: 'We aggressively remove empty tags and excessive precision from exported SVGs.' }
    ],
  },
  mobile: { canvas: 'Canvas', transform: 'Transform', optimize: 'Optimize', export: 'Export' },
  exportPanel: {
    title: 'Export', format: 'Format', background: 'Background',
    transparent: 'Transparent', white: 'White', custom: 'Custom',
    scaleSize: 'Scale & Size', widthPx: 'Width (px)', heightPx: 'Height (px)',
    exportBtn: 'Export ', formatSVG: 'SVG', formatPNG: 'PNG', formatWEBP: 'WebP', formatJPEG: 'JPEG',
  },
}
