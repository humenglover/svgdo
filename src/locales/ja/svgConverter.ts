export default {
  title: 'SVGエディタ',
  upload: 'アップロード',
  url: 'URL',
  pasteCode: 'コード貼付',
  pasteCodeTitle: 'SVGコードを貼付',
  syntaxError: 'SVG構文エラー',
  library: 'アイコンライブラリ',
  empty: {
    welcome: 'SVGエディタへようこそ',
    desc: 'SVGファイルをドラッグ＆ドロップ、または「アップロード/アイコンライブラリ」をクリック、Ctrl/Cmd+Vでコードを貼り付け',
    pastePlaceholder: 'SVGコードをここに貼り付け...',
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
  article: {
    introTitle: 'SVGエディタガイド',
    introDesc: 'SVGコードを貼り付けるか、ファイルをドラッグ＆ドロップ。リアルタイムプレビュー、強力な最適化、PNGエクスポート。',
    principle: '100%ローカル処理：すべてお使いのブラウザ内で処理されます。サーバーへのアップロードなし、プライバシーリスクゼロ。',
    howToUse: '使い方',
    whatIs: 'よくある質問',
    whatIsDesc1: '使い始めるためのヒント：',
    whatIsDesc2: '',
    badges: ['双方向同期', 'ディープ圧縮', 'HD PNG出力', '100%ローカル'],
    steps: [
      { title: 'ステップ1. インポート', desc: 'Ctrl+Vでコードを貼り付け、URLから取得、またはライブラリから選択します。' },
      { title: 'ステップ2. 編集', desc: '左側のコードを編集すると、右側に即座に反映されます。' },
      { title: 'ステップ3. 最適化', desc: '「最適化」をクリックして、不要なタグとメタデータを削除します。' },
      { title: 'ステップ4. エクスポート', desc: '最適化されたSVGまたはPNGとしてダウンロードします。' },
    ],
    features: [
      { title: 'ショートカットはありますか？', desc: 'Ctrl + スクロールでズーム、Ctrl +/- で拡大縮小、Ctrl + 0 でリセットできます。' },
      { title: 'コードとキャンバスは同期されていますか？', desc: 'はい。キャンバス上での変形操作は即座にコードに反映されます。' },
      { title: 'なぜこんなに圧縮率が高いのですか？', desc: 'デザインツールが出力するSVGから、空のタグや過剰な精度の座標を積極的に削除しているためです。' }
    ],
  },
  mobile: { canvas: 'キャンバス', transform: '変形', optimize: '最適化', export: 'エクスポート' },
  exportPanel: {
    title: 'エクスポート', format: 'フォーマット', background: '背景',
    transparent: '透明', white: '白', custom: 'カスタム',
    scaleSize: 'サイズと倍率', widthPx: '幅 (px)', heightPx: '高さ (px)',
    exportBtn: 'エクスポート ', formatSVG: 'SVG', formatPNG: 'PNG', formatWEBP: 'WebP', formatJPEG: 'JPEG',
  },
}
