export default {
  title: 'SVGエディタ',
  upload: 'アップロード',
  url: 'URL',
  library: 'アイコンライブラリ',
  empty: {
    welcome: 'SVGエディタへようこそ',
    desc: 'SVGファイルをドラッグ＆ドロップ、または「アップロード/アイコンライブラリ」をクリック、Ctrl/Cmd+Vでコードを貼り付け',
    startFromExample: 'サンプルから始める',
    startFromExampleDesc: '下のアイコンをクリックするか、自分のSVGをアップロードしてください。',
    keyboardHint: 'ショートカット: Ctrl + スクロール | Ctrl+± | Ctrl+0 リセット'
  },
  toolbar: {
    undo: '元に戻す', redo: 'やり直し', zoomIn: '拡大', zoomOut: '縮小',
    fit: '画面に合わせる', reset: 'ズームリセット', canvasBg: '背景',
    preview: 'プレビュー', split: '分割', code: 'コード'
  },
  transform: {
    title: '変形', rotate: '回転', flip: '反転',
    flipH: '水平', flipV: '垂直', scale: '拡大縮小',
  },
  optimize: {
    title: '最適化', original: '元のサイズ', current: '現在', mode: 'モード',
    modeSafe: '安全', modeAggressive: '強力',
    btnOptimize: '最適化',
    copySvg: 'SVGをコピー', copyOptimized: '最適化後をコピー',
    copyOriginal: '元に戻す',
    optimizeSuccess: '最適化成功！{{bytes}}バイト削減 ({{percent}}%)',
    alreadyOptimized: 'すでに最適化されています！',
    optimizeFailed: '最適化に失敗しました',
    restored: '元のコードに戻しました',
    copied: 'コピーしました'
  },
  export: {
    title: 'エクスポート',
    exportPng: 'PNGをエクスポート',
    bgTransparent: '透明', bgWhite: '白', bgBlack: '黒',
    btnExportPng: 'PNGをエクスポート',
    downloadSvg: 'SVGをダウンロード',
    downloading: 'ダウンロード開始',
    exported: 'PNGをエクスポートしました'
  },
  code: { title: 'SVGコード', copy: 'コピー', copied: 'コピーしました' },
  libraryModal: {
    title: 'アイコンライブラリ', search: 'アイコンを検索...',
    results: '{{count}}件', loadMore: 'もっと読み込む',
  },
  urlModal: {
    title: 'URLから読み込み',
    desc: '公開されているSVGファイルの直接URLを入力してください。',
    placeholder: 'https://example.com/icon.svg',
    cancel: 'キャンセル', load: 'SVGを読み込む', loadSuccess: 'SVGの読み込みに成功しました'
  },
  mobile: { canvas: 'キャンバス', transform: '変形', optimize: '最適化', export: 'エクスポート' }
}
