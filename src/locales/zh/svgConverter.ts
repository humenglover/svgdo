export default {
  title: 'SVG 编辑器',
  upload: '上传',
  url: 'URL',
  pasteCode: '粘贴代码',
  pasteCodeTitle: '粘贴 SVG 代码',
  syntaxError: 'SVG 语法错误',
  library: '图标库',
  empty: {
    welcome: '欢迎使用 SVG 编辑器',
    desc: '拖拽 SVG 文件到页面，或点击"上传/图标库"，也可 Ctrl/Cmd+V 粘贴代码',
    pastePlaceholder: '在此粘贴原始 SVG 代码...',
    startFromExample: '先从示例图标开始',
    startFromExampleDesc: '可先点击下方图标，也可以上传你自己的 SVG。',
    keyboardHint: '快捷键: Ctrl + 滚轮缩放 | Ctrl+± 放大缩小 | Ctrl+0 重置'
  },
  toolbar: {
    undo: '撤销', redo: '重做', zoomIn: '放大', zoomOut: '缩小',
    fit: '适应屏幕', reset: '重置缩放', canvasBg: '画布背景',
    preview: '预览', split: '分屏', code: '代码'
  },
  transform: {
    title: '变换', rotate: '旋转', flip: '翻转',
    flipH: '水平', flipV: '垂直', scale: '缩放',
  },
  optimize: {
    title: '优化', original: '原始', current: '当前', mode: '模式',
    modeSafe: '常规优化', modeAggressive: '深度压缩',
    btnOptimize: '优化',
    copySvg: '复制 SVG', copyOptimized: '复制优化后',
    copyOriginal: '恢复原始',
    optimizeSuccess: '优化成功！减少了 {{bytes}} 字节 ({{percent}}%)',
    alreadyOptimized: '已经很优化了！',
    optimizeFailed: '优化失败',
    restored: '已恢复原始代码',
    copied: '已复制'
  },
  export: {
    title: '导出',
    exportPng: '导出 PNG',
    bgTransparent: '透明', bgWhite: '纯白', bgBlack: '纯黑',
    btnExportPng: '导出 PNG',
    downloadSvg: '下载 SVG',
    downloading: '已开始下载',
    exported: '已导出 PNG'
  },
  code: { title: 'SVG 源码', copy: '复制', copied: '已复制' },
  libraryModal: {
    title: '图标库', search: '搜索图标...',
    results: '{{count}} 个结果', loadMore: '向下加载更多',
  },
  urlModal: {
    title: '加载远程 SVG',
    desc: '请输入远程公开 SVG 文件的直链 URL 进行即刻加载解析。',
    placeholder: 'https://example.com/icon.svg',
    cancel: '取消', load: '立即加载', loadSuccess: 'SVG 加载成功'
  },
  article: {
    introTitle: '怎么用这个 SVG 工具？',
    introDesc: '不用复杂的安装，直接把 SVG 代码粘贴进来，或者拖个文件到这儿就行。你能立刻看到图标长什么样，还能顺手给它瘦个身。',
    principle: '💡 别担心隐私问题，所有操作全都在你自己的浏览器里算完了。没连网也能照样压缩、旋转、改色，完全不用担心你的商业图标泄露给服务器。',
    howToUse: '快速上手指南',
    whatIs: '遇到问题了？',
    whatIsDesc1: '这里整理了一些常用的快捷技巧：',
    whatIsDesc2: '',
    badges: ['完全免费', '极速本地处理', '一键瘦身'],
    steps: [
      { title: '随便丢进来', desc: '按 Ctrl+V 直接粘代码，点击 URL 抓网上的图标，或者干脆从“图标库”里挑一个练练手。' },
      { title: '见缝插针改代码', desc: '左边是代码，右边是画布。你在代码里随便改个色号、删条线，右边立刻就跟着变，跟魔法一样。' },
      { title: '暴力压榨体积', desc: '设计软件导出的图标通常很臃肿，去右侧点一下“深度压缩”，我们能帮你榨干最后一滴多余的水分。' },
      { title: '一键拿走', desc: '搞定之后，直接拿走最纯净的 SVG 代码，或者干脆导出成背景透明的 PNG 丢给前端。' },
    ],
    features: [
      { title: '有没有啥快捷键？', desc: '有的，我们照抄了你最习惯的设计软件操作：\n- 滚轮：自由放大缩小\n- Ctrl + 加减号：精细缩放\n- Ctrl + 0：一秒回到 100% 原始大小' },
      { title: '我在这儿点旋转，代码会变吗？', desc: '绝对会。这工具牛就牛在，你在面板上点的每一个操作（翻转、旋转），它都会硬核地重新计算所有 Path 路径，直接反馈到你的代码里。' },
      { title: '为什么能压掉这么多体积？', desc: 'Figma 或者 AI 导出的 SVG 里面总喜欢塞一堆没用的标签。我们的压缩引擎不仅会把这些垃圾删干净，还会把那些长得离谱的小数点砍短，效果立竿见影。' }
    ],
  },
  mobile: { canvas: '预览', transform: '变换', optimize: '优化', export: '导出' },
  exportPanel: {
    title: '导出', format: '格式', background: '背景',
    transparent: '透明', white: '白色', custom: '自定义',
    scaleSize: '尺寸与缩放', widthPx: '宽度 (px)', heightPx: '高度 (px)',
    exportBtn: '导出 ', formatSVG: 'SVG', formatPNG: 'PNG', formatWEBP: 'WebP', formatJPEG: 'JPEG',
  },
}
