/**
 * generate-seo-html.cjs
 *
 * 为 SVGDO 的每个路由 × 5 种语言生成具备完整正文文本的静态 HTML。
 * 彻底解决 Google AdSense 爬虫抓取客户端 SPA 时因页面缺乏实质文本被判定为「低价值内容」的问题。
 *
 * 特性：
 * 1. 使用 marked 解析 public/content/*.md，将每篇文章完整正文预渲染进 HTML
 * 2. 为首页、关于页、隐私政策、服务条款、资源列表页生成富文本语义化 HTML
 * 3. 注入完善的 Schema.org JSON-LD（Article, WebApplication, FAQPage）
 * 4. 保持 React 19 客户端无缝接管（asset 引用 + #root）
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PUBLIC = path.join(ROOT, 'public')
const SITE = 'https://svgdo.com'
const DEFAULT_LANG = 'en'
const OG_IMAGE = `${SITE}/og-image.png`
const CONTACT_EMAIL = 'shengqiangwang666@gmail.com'

const LANGS = [
  { code: 'en', ogLocale: 'en_US', htmlLang: 'en', name: 'English' },
  { code: 'zh', ogLocale: 'zh_CN', htmlLang: 'zh-CN', name: '简体中文' },
  { code: 'ja', ogLocale: 'ja_JP', htmlLang: 'ja', name: '日本語' },
  { code: 'ko', ogLocale: 'ko_KR', htmlLang: 'ko', name: '한국어' },
  { code: 'es', ogLocale: 'es_ES', htmlLang: 'es', name: 'Español' },
]

/* ─── 页面级 SEO 元数据 ────────────────────────────── */
const PAGE_SEO = {
  home: {
    title: {
      en: 'SVGDO - Free Online SVG Editor | Fast, Secure & No Upload',
      zh: 'SVGDO - 免费在线 SVG 编辑器 | 快速、安全、零云端上传',
      ja: 'SVGDO - 無料オンラインSVGエディタ | 高速・安全・アップロード不要',
      ko: 'SVGDO - 무료 온라인 SVG 편집기 | 빠르고 안전하며 업로드 없음',
      es: 'SVGDO - Editor SVG Gratuito en Línea | Rápido, Seguro y Sin Subidas',
    },
    description: {
      en: 'The ultimate free online SVG editor. Experience lightning-fast, 100% local browser-based SVG editing, compression, path manipulation, and PNG export. Zero cloud uploads. Secure and private.',
      zh: '终极免费在线 SVG 编辑器。体验闪电般快速、100% 本地浏览器运行的 SVG 节点编辑、代码高亮、无损压缩与高分辨率 PNG 导出。零云端上传，安全且私密。',
      ja: '究極の無料オンラインSVGエディタ。超高速・100%ローカルブラウザで動くSVG編集、パス操作、圧縮、PNG書き出しを体験。クラウドアップロードなし。安全・プライベート。',
      ko: '궁극의 무료 온라인 SVG 편집기. 초고속, 100% 로컬 브라우저 기반의 SVG 편집, 압축, PNG 내보내기를 경험하세요. 클라우드 업로드 제로. 안전하고 비공개.',
      es: 'El editor SVG gratuito en línea definitivo. Edición, compresión y exportación PNG de SVG 100% local en el navegador, ultrarrápida. Cero subidas a la nube. Seguro y privado.',
    },
    h1: {
      en: 'SVGDO - Free Online SVG Editor & Vector Suite',
      zh: 'SVGDO - 免费在线 SVG 矢量编辑器与格式转换工具',
      ja: 'SVGDO - 無料オンラインSVGエディタ＆ベクターツール',
      ko: 'SVGDO - 무료 온라인 SVG 편집기 & 벡터 도구',
      es: 'SVGDO - Editor SVG Gratuito en Línea y Suite Vectorial',
    },
  },
  resources: {
    title: {
      en: 'Help Center & SVG Guides - SVG Editor Tutorials & Best Practices',
      zh: '帮助中心与 SVG 指南 - 矢量图教程、优化与开发实践',
      ja: 'ヘルプセンター - SVGエディタチュートリアルと実践ガイド',
      ko: '도움말 센터 - SVG 에디터 튜토리얼 및 모범 사례',
      es: 'Centro de Ayuda - Tutoriales del Editor SVG y Mejores Prácticas',
    },
    description: {
      en: 'Learn SVG editing, vector path optimization, CSS/SMIL animation, and web design best practices with our in-depth guides.',
      zh: '通过我们的深度指南，全面学习 SVG 节点编辑、路径优化、CSS/SMIL 描边动画以及前端矢量图最佳实践。',
      ja: '詳細なガイドを通じて、SVG編集、最適化、アニメーション、ウェブデザインのベストプラクティスを学びます。',
      ko: '심층 가이드를 통해 SVG 편집, 최적화, 애니메이션 및 웹 디자인 모범 사례를 배우세요.',
      es: 'Aprende edición SVG, optimización de trayectorias, animación CSS/SMIL y mejores prácticas con nuestras guías.',
    },
    h1: {
      en: 'SVG Tutorials, Guides & Best Practices',
      zh: 'SVG 教程、指南与最佳实践',
      ja: 'SVGチュートリアル・ガイド・ベストプラクティス',
      ko: 'SVG 튜토리얼, 가이드 및 모범 사례',
      es: 'Tutoriales, Guías y Mejores Prácticas de SVG',
    },
  },
  about: {
    title: {
      en: 'About SVGDO - Free Online SVG Editor & Mission',
      zh: '关于 SVGDO - 免费在线 SVG 编辑器与项目愿景',
      ja: 'SVGDOについて - 無料オンラインSVGエディタ',
      ko: 'SVGDO 소개 - 무료 온라인 SVG 편집기',
      es: 'Acerca de SVGDO - Editor SVG Gratuito en Línea',
    },
    description: {
      en: 'SVGDO is a free, 100% private, browser-based SVG editor. No uploads, no accounts, no data leaving your device.',
      zh: 'SVGDO 是一款免费、100% 本地私密的浏览器端 SVG 矢量编辑器。不上传文件、不注册账号、数据永不离开您的设备。',
      ja: 'SVGDOは無料でプライベートなブラウザベースのSVGエディタです。アップロードなし、アカウント不要、データはデバイスから離れません。',
      ko: 'SVGDO는 무료이고 사적인 브라우저 기반 SVG 편집기입니다. 업로드 없음, 계정 불필요, 데이터는 기기를 떠나지 않습니다.',
      es: 'SVGDO es un editor SVG gratuito y privado basado en navegador. Sin subidas, sin cuentas, sin que tus datos abandonen tu dispositivo.',
    },
    h1: {
      en: 'About SVGDO - Local-First Vector Engineering',
      zh: '关于 SVGDO - 本地优先的矢量图形引擎',
      ja: 'SVGDOについて - ローカルファーストのベクターツール',
      ko: 'SVGDO 소개 - 로컬 우선 벡터 엔지니어링',
      es: 'Acerca de SVGDO - Ingeniería Vectorial Local',
    },
  },
  privacy: {
    title: {
      en: 'Privacy Policy - SVGDO',
      zh: '隐私政策 - SVGDO',
      ja: 'プライバシーポリシー - SVGDO',
      ko: '개인정보처리방침 - SVGDO',
      es: 'Política de Privacidad - SVGDO',
    },
    description: {
      en: 'SVGDO processes all vector images locally in your browser memory. Read our privacy policy — your data never leaves your device.',
      zh: 'SVGDO 在浏览器内存本地处理所有矢量图像。阅读我们的隐私政策——您的数据与矢量文件绝不会离开您的设备。',
      ja: 'SVGDOはすべての画像をブラウザ内でローカル処理します。プライバシーポリシーをご覧ください——あなたのデータはデバイスから離れません。',
      ko: 'SVGDO는 모든 이미지를 브라우저에서 로컬 처리합니다. 개인정보처리방침을 읽어보세요 — 데이터는 기기를 떠나지 않습니다.',
      es: 'SVGDO procesa todas las imágenes localmente en tu navegador. Lee nuestra política de privacidad — tus datos nunca abandonan tu dispositivo.',
    },
    h1: {
      en: 'Privacy Policy',
      zh: '隐私政策',
      ja: 'プライバシーポリシー',
      ko: '개인정보처리방침',
      es: 'Política de Privacidad',
    },
  },
  terms: {
    title: {
      en: 'Terms of Service - SVGDO',
      zh: '服务条款 - SVGDO',
      ja: '利用規約 - SVGDO',
      ko: '이용약관 - SVGDO',
      es: 'Términos del Servicio - SVGDO',
    },
    description: {
      en: 'The terms of service for using SVGDO, the free online SVG editor.',
      zh: '使用 SVGDO（免费在线 SVG 编辑器）的完整服务条款。',
      ja: '無料オンラインSVGエディタSVGDOを利用するための利用規約。',
      ko: '무료 온라인 SVG 편집기 SVGDO 이용약관.',
      es: 'Los términos del servicio para usar SVGDO, el editor SVG gratuito en línea.',
    },
    h1: {
      en: 'Terms of Service',
      zh: '服务条款',
      ja: '利用規約',
      ko: '이용약관',
      es: 'Términos del Servicio',
    },
  },
}

/* ─── 常见问题 FAQ 库 ──────────────────────────────────── */
const FAQ_DATA = {
  en: [
    {
      q: 'What is SVGDO and how does it work?',
      a: 'SVGDO is a free, modern online SVG editor and vector optimizer that runs 100% inside your web browser. It allows you to view, edit, clean, transform, and convert Scalable Vector Graphics (SVG) with real-time visual and code synchronization.',
    },
    {
      q: 'Are my SVG files uploaded to any server?',
      a: 'No. SVGDO uses a 100% client-side, local-first architecture. All parsing, rendering, and exporting algorithms execute entirely in your browser memory. Your files and proprietary designs are never uploaded to any remote server or cloud storage.',
    },
    {
      q: 'Can I export SVG to high-resolution PNG or JPG?',
      a: 'Yes. SVGDO includes a built-in raster export pipeline supporting custom resolution scales (1x, 2x, 4x, 8x), transparency controls, and multiple output formats including PNG, JPEG, and WebP.',
    },
    {
      q: 'How does the SVG optimizer reduce file size?',
      a: 'Our optimization engine strips redundant metadata, editor comments, empty groups, and unnecessary XML attributes while rounding decimal precision in path commands. This typically reduces SVG file size by 30% to 70% without any visible loss in visual quality.',
    },
    {
      q: 'Is SVGDO free for commercial use?',
      a: 'Yes, SVGDO is completely free for both personal and commercial use. There are no subscriptions, account signups, or usage limits.',
    },
  ],
  zh: [
    {
      q: '什么是 SVGDO？它如何运作？',
      a: 'SVGDO 是一款现代化、纯浏览器端运行的免费在线 SVG 编辑器与矢量优化工具。它支持实时可视化节点编辑、代码高亮互通、属性精细调校以及多格式图片导出。',
    },
    {
      q: '我的 SVG 文件会被上传到服务器吗？',
      a: '绝不会。SVGDO 采用 100% 纯前端本地架构，所有 SVG 解析、DOM 运算与图片生成完全在您的本地浏览器内存中进行，数据永不上传至任何服务器，彻底杜绝数据泄露风险。',
    },
    {
      q: 'SVGDO 支持将 SVG 转换为高分辨率 PNG 或 JPG 吗？',
      a: '支持。SVGDO 内置了强大的光栅化导出引擎，支持 1x 到 8x 超高清无损缩放导出，并支持 PNG 透明背景、JPEG 高质量压缩以及 WebP 现代图像格式。',
    },
    {
      q: 'SVG 代码优化器是如何减小文件体积的？',
      a: '优化器通过清理冗余的元数据、隐藏图层、无效命名空间，并对路径坐标的小数点位数进行智能舍入，通常可在保持图像画质不变的前提下减少 30% 到 70% 的文件大小。',
    },
    {
      q: 'SVGDO 允许用于商业项目吗？',
      a: '完全可以。SVGDO 永久免费供个人和商业团队使用，无需注册账号，没有任何导出水印或次数限制。',
    },
  ],
  ja: [
    {
      q: 'SVGDOとは何ですか？',
      a: 'SVGDOは、ブラウザ上で100%動作する無料のオンラインSVGエディタ＆ベクター最適化ツールです。リアルタイムでビジュアル編集とコード編集を同期できます。',
    },
    {
      q: 'SVGファイルはサーバーにアップロードされますか？',
      a: 'いいえ。すべての処理はお使いのブラウザのメモリ内で行われます。ファイルやデザインデータが外部サーバーに送信されることは一切ありません。',
    },
    {
      q: '高解像度のPNGやJPEGに変換できますか？',
      a: 'はい、最大8倍の高解像度エクスポート、透過PNG、JPEG、WebP形式への変換に対応しています。',
    },
  ],
  ko: [
    {
      q: 'SVGDO란 무엇인가요?',
      a: 'SVGDO는 브라우저에서 100% 로컬로 작동하는 무료 온라인 SVG 편집기 및 벡터 최적화 도구입니다.',
    },
    {
      q: '내 SVG 파일이 서버에 업로드되나요?',
      a: '아니요. 모든 처리는 사용자의 브라우저 메모리 내에서 로컬로 실행되며 서버로 파일이 전송되지 않습니다.',
    },
    {
      q: '고해상도 PNG로 내보낼 수 있나요?',
      a: '네, 최대 8배 고해상도 내보내기 및 투명 PNG, JPEG, WebP 변환을 지원합니다.',
    },
  ],
  es: [
    {
      q: '¿Qué es SVGDO y cómo funciona?',
      a: 'SVGDO es un editor SVG y optimizador vectorial gratuito en línea que funciona 100% en tu navegador web.',
    },
    {
      q: '¿Se suben mis archivos SVG a algún servidor?',
      a: 'No. Todo el procesamiento se realiza localmente en la memoria de tu navegador. Tus archivos nunca salen de tu dispositivo.',
    },
    {
      q: '¿Puedo exportar SVG a PNG de alta resolución?',
      a: 'Sí, SVGDO permite exportar hasta a 8x de resolución en formatos PNG, JPEG y WebP.',
    },
  ],
}

/* ─── 导航和页脚文本 ───────────────────────────────────────── */
const UI_TEXT = {
  en: {
    brand: 'SVGDO',
    tagline: 'Free Online SVG Editor',
    navHome: 'Editor',
    navResources: 'Tutorials & Guides',
    navAbout: 'About Us',
    navPrivacy: 'Privacy Policy',
    navTerms: 'Terms of Service',
    featuresTitle: 'Why Choose SVGDO Online SVG Editor?',
    feature1Title: '100% Local & Private',
    feature1Desc: 'All SVG processing happens in your browser RAM. Zero server uploads, zero data leakage.',
    feature2Title: 'Visual & Code Sync',
    feature2Desc: 'Inspect and edit SVG elements visually or tweak raw XML path data with instant live preview.',
    feature3Title: 'Lossless Optimizer',
    feature3Desc: 'Strip useless metadata, round coordinates, and compress SVG file sizes by up to 70%.',
    feature4Title: 'High-Res Multi-Format Export',
    feature4Desc: 'Convert SVG to crisp PNG, JPEG, and WebP at 1x, 2x, 4x, or custom dimensions.',
    howTitle: 'How to Edit & Optimize SVG Online',
    howStep1: '1. Load SVG: Drop your SVG file, paste raw code, or choose from our built-in icon presets.',
    howStep2: '2. Edit & Optimize: Adjust paths, colors, viewBox, stroke styles, and apply instant code minification.',
    howStep3: '3. Download & Export: Save clean SVG code or export to ultra-clear PNG with one click.',
    faqTitle: 'Frequently Asked Questions',
    articlesTitle: 'Explore SVG Tutorials & Best Practices',
    readMore: 'Read Article →',
    backToResources: '← Back to all tutorials',
    author: 'SVGDO Editorial Team',
    publishedOn: 'Published on',
    footerCopyright: '© 2026 SVGDO. All rights reserved. 100% Client-Side Vector Engineering.',
  },
  zh: {
    brand: 'SVGDO',
    tagline: '免费在线 SVG 矢量编辑器',
    navHome: '在线编辑器',
    navResources: '教程与指南',
    navAbout: '关于我们',
    navPrivacy: '隐私政策',
    navTerms: '服务条款',
    featuresTitle: '为什么选择 SVGDO 在线矢量编辑器？',
    feature1Title: '100% 本地运行与隐私保护',
    feature1Desc: '所有矢量运算均在浏览器内存完成，零云端上传，商用设计草稿零泄露风险。',
    feature2Title: '可视化与代码实时双向同步',
    feature2Desc: '既能可视化拖拽调整节点与图层，又能直接编写 SVG 源码，实时无缝联动。',
    feature3Title: '智能无损代码压缩优化',
    feature3Desc: '智能清理冗余元数据、闭合多余标签、精度优化，让 SVG 体积瘦身高达 70%。',
    feature4Title: '超高清多格式光栅化导出',
    feature4Desc: '一键将 SVG 转换为 1x 至 8x 超高清透明 PNG、JPEG 及 WebP 格式。',
    howTitle: '如何在线编辑与优化 SVG 文件',
    howStep1: '1. 载入矢量图：拖拽本地 SVG 文件、直接粘贴 SVG 代码，或从内置图标库挑选。',
    howStep2: '2. 调整与优化：编辑路径、调色、修改 viewBox、旋转翻转并执行代码瘦身压缩。',
    howStep3: '3. 导出与应用：一键复制干净的 SVG 源码，或下载高分辨率 PNG 图像。',
    faqTitle: '常见问题解答 (FAQ)',
    articlesTitle: '精选 SVG 进阶教程与开发指南',
    readMore: '阅读全文 →',
    backToResources: '← 返回教程中心',
    author: 'SVGDO 技术编辑团队',
    publishedOn: '发布日期：',
    footerCopyright: '© 2026 SVGDO. 保留所有权利。100% 本地纯前端矢量处理工具箱。',
  },
  ja: {
    brand: 'SVGDO',
    tagline: '無料オンラインSVGエディタ',
    navHome: 'エディタ',
    navResources: 'チュートリアル',
    navAbout: '概要',
    navPrivacy: 'プライバシーポリシー',
    navTerms: '利用規約',
    featuresTitle: 'SVGDO の主な機能と特徴',
    feature1Title: '100% ローカル＆プライベート',
    feature1Desc: 'データはブラウザ内でのみ処理されます。サーバーへのアップロードはありません。',
    feature2Title: 'ビジュアル＆コードの同期',
    feature2Desc: '視覚的な操作とSVGソースコードの直接編集をリアルタイムに反映。',
    feature3Title: 'SVG最適化・圧縮',
    feature3Desc: '不要なタグを削除し、ファイルサイズを最大70%削減。',
    feature4Title: '高解像度エクスポート',
    feature4Desc: 'SVGを高精細なPNG、JPEG、WebPに簡単変換。',
    howTitle: 'SVG編集の使い方',
    howStep1: '1. SVGを読み込む：ファイルをドロップまたはコードを貼り付け。',
    howStep2: '2. 編集と最適化：パス、色、サイズを調整し、コードを最適化。',
    howStep3: '3. 保存・書き出し：最適化されたSVGまたはPNGをダウンロード。',
    faqTitle: 'よくある質問',
    articlesTitle: 'SVGガイド＆チュートリアル一覧',
    readMore: '記事を読む →',
    backToResources: '← チュートリアル一覧に戻る',
    author: 'SVGDO 編集部',
    publishedOn: '公開日：',
    footerCopyright: '© 2026 SVGDO. All rights reserved.',
  },
  ko: {
    brand: 'SVGDO',
    tagline: '무료 온라인 SVG 편집기',
    navHome: '에디터',
    navResources: '튜토리얼 및 가이드',
    navAbout: '소개',
    navPrivacy: '개인정보처리방침',
    navTerms: '이용약관',
    featuresTitle: 'SVGDO 온라인 SVG 에디터의 주요 장점',
    feature1Title: '100% 로컬 및 프라이버시 보호',
    feature1Desc: '모든 데이터 처리가 브라우저 내부에서만 이루어집니다.',
    feature2Title: '시각적 편집 & 코드 실시간 동기화',
    feature2Desc: '시각적 요소 편집과 SVG XML 코드 수정을 실시간으로 지원합니다.',
    feature3Title: '무손실 SVG 파일 크기 압축',
    feature3Desc: '불필요한 메타데이터를 제거하여 용량을 최대 70% 줄입니다.',
    feature4Title: '초고해상도 다중 포맷 내보내기',
    feature4Desc: 'SVG를 고해상도 PNG, JPEG, WebP로 쉽게 변환합니다.',
    howTitle: 'SVG 편집 및 최적화 방법',
    howStep1: '1. SVG 파일 열기: 파일을 드래그하거나 코드를 붙여넣으세요.',
    howStep2: '2. 편집 및 최적화: 패스, 색상, 크기를 조정하고 코드를 압축하세요.',
    howStep3: '3. 내보내기: 깨끗한 SVG 또는 고해상도 PNG로 다운로드하세요.',
    faqTitle: '자주 묻는 질문',
    articlesTitle: 'SVG 가이드 & 튜토리얼',
    readMore: '자세히 보기 →',
    backToResources: '← 튜토리얼 목록으로 돌아가기',
    author: 'SVGDO 편집팀',
    publishedOn: '게시일: ',
    footerCopyright: '© 2026 SVGDO. All rights reserved.',
  },
  es: {
    brand: 'SVGDO',
    tagline: 'Editor SVG Gratuito en Línea',
    navHome: 'Editor',
    navResources: 'Tutoriales y Guías',
    navAbout: 'Acerca de',
    navPrivacy: 'Privacidad',
    navTerms: 'Términos',
    featuresTitle: '¿Por qué elegir el editor SVGDO?',
    feature1Title: '100% Local y Privado',
    feature1Desc: 'Todo el procesamiento se realiza en la memoria de tu navegador.',
    feature2Title: 'Sincronización Visual y de Código',
    feature2Desc: 'Edita visualmente o modifica el código SVG con vista previa en tiempo real.',
    feature3Title: 'Optimizador sin Pérdidas',
    feature3Desc: 'Elimina metadatos innecesarios y reduce el tamaño hasta un 70%.',
    feature4Title: 'Exportación en Múltiples Formatos',
    feature4Desc: 'Convierte SVG a PNG, JPEG y WebP en alta resolución.',
    howTitle: 'Cómo editar y optimizar SVG en línea',
    howStep1: '1. Carga tu SVG: Arrastra el archivo o pega el código.',
    howStep2: '2. Edita y optimiza: Modifica trazos, colores y reduce el código.',
    howStep3: '3. Descarga: Exporta tu SVG limpio o conviértelo a PNG.',
    faqTitle: 'Preguntas Frecuentes',
    articlesTitle: 'Tutoriales y Guías de SVG',
    readMore: 'Leer más →',
    backToResources: '← Volver a tutoriales',
    author: 'Equipo Editorial SVGDO',
    publishedOn: 'Publicado el: ',
    footerCopyright: '© 2026 SVGDO. Todos los derechos reservados.',
  },
}

/* ─── 工具函数 ─────────────────────────────────────────────── */
function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'data', 'articles.ts'), 'utf8')
  const blocks = src.split(/slug:\s*'/).slice(1)
  const articles = []
  for (const block of blocks) {
    const slug = block.slice(0, block.indexOf("'"))
    const title = {}
    const excerpt = {}
    const dateMatch = block.match(/date:\s*'([^']+)'/)
    const date = dateMatch ? dateMatch[1] : '2026-07-20'
    const tagsMatch = block.match(/tags:\s*\[([^\]]+)\]/)
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean) : ['SVG']

    for (const langInfo of LANGS) {
      const lang = langInfo.code
      const t = parseField(block, 'title', lang)
      const e = parseField(block, 'excerpt', lang)
      if (t !== undefined) title[lang] = t
      if (e !== undefined) excerpt[lang] = e
    }
    articles.push({ slug, title, excerpt, date, tags })
  }
  return articles
}

function parseField(block, field, lang) {
  const head = `${field}: {`
  const start = block.indexOf(head)
  if (start < 0) return undefined
  const objEnd = block.indexOf('}', start + head.length)
  if (objEnd < 0) return undefined
  const prefix = `${lang}: `
  const langPos = block.indexOf(prefix, start)
  if (langPos < 0 || langPos > objEnd) return undefined
  const quoteStart = langPos + prefix.length
  const quote = block[quoteStart]
  if (quote !== "'" && quote !== '"') return undefined
  const valueStart = quoteStart + 1
  let i = valueStart
  while (i < block.length) {
    if (block[i] === '\\') { i += 2; continue }
    if (block[i] === quote) break
    i++
  }
  if (i >= block.length) return undefined
  return block.slice(valueStart, i).replace(/\\'/g, "'").replace(/\\"/g, '"')
}

function extractAssetTags(template) {
  const tags = template.match(/<script[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/g) || []
  const preloads = template.match(/<link[^>]*rel="modulepreload"[^>]*href="\/assets\/[^"]*"[^>]*>/g) || []
  const css = template.match(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/g) || []
  const adsense = template.match(/<script[^>]*adsbygoogle[^>]*><\/script>/g) || []
  const gtagLoader = template.match(/<script[^>]*googletagmanager\.com\/gtag[^>]*><\/script>/g) || []
  let gtagInline = ''
  const inlineStart = template.indexOf('window.dataLayer')
  if (inlineStart > -1) {
    const scriptStart = template.lastIndexOf('<script>', inlineStart)
    const scriptEnd = template.indexOf('</script>', inlineStart) + '</script>'.length
    if (scriptStart > -1 && scriptEnd > scriptStart) gtagInline = template.slice(scriptStart, scriptEnd)
  }
  return { tags, preloads, css, adsense, gtagLoader, gtagInline }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function langPath(lang) {
  return lang === DEFAULT_LANG ? '' : `/${lang}`
}

function pageUrl(lang, pagePath) {
  const base = `${SITE}${langPath(lang)}`
  return pagePath === '' ? base : `${base}/${pagePath}`
}

function relativeHref(lang, pagePath) {
  const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`
  return pagePath === '' ? (prefix || '/') : `${prefix}/${pagePath}`
}

/* ─── 统一 HTML 骨架渲染函数 ─────────────────────────────────── */
function renderNavbar(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  return `
    <header style="background:#0f172a;border-bottom:1px solid #1e293b;padding:12px 24px;color:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <a href="${relativeHref(lang, '')}" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:#f8fafc;font-weight:800;font-size:20px;">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#f97316"/><path d="M9 16L14 21L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>${ui.brand}</span>
      </a>
      <nav style="display:flex;align-items:center;gap:18px;font-size:14px;font-weight:600;">
        <a href="${relativeHref(lang, '')}" style="color:#cbd5e1;text-decoration:none;">${ui.navHome}</a>
        <a href="${relativeHref(lang, 'resources')}" style="color:#cbd5e1;text-decoration:none;">${ui.navResources}</a>
        <a href="${relativeHref(lang, 'about')}" style="color:#cbd5e1;text-decoration:none;">${ui.navAbout}</a>
        <a href="${relativeHref(lang, 'privacy')}" style="color:#cbd5e1;text-decoration:none;">${ui.navPrivacy}</a>
        <a href="${relativeHref(lang, 'terms')}" style="color:#cbd5e1;text-decoration:none;">${ui.navTerms}</a>
      </nav>
    </header>
  `
}

function renderFooter(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  return `
    <footer style="background:#090d16;border-top:1px solid #1e293b;padding:40px 24px 30px;color:#94a3b8;font-size:14px;margin-top:auto;">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:30px;">
        <div style="max-width:360px;">
          <div style="font-weight:800;font-size:18px;color:#f8fafc;margin-bottom:8px;">${ui.brand} - ${ui.tagline}</div>
          <p style="line-height:1.6;color:#64748b;margin:0;">100% private, client-side vector graphics suite. Zero uploads, lightning fast, instant conversion and export.</p>
        </div>
        <div>
          <div style="font-weight:700;color:#f8fafc;margin-bottom:12px;">Quick Links</div>
          <ul style="list-style:none;padding:0;margin:0;line-height:2;">
            <li><a href="${relativeHref(lang, '')}" style="color:#94a3b8;text-decoration:none;">${ui.navHome}</a></li>
            <li><a href="${relativeHref(lang, 'resources')}" style="color:#94a3b8;text-decoration:none;">${ui.navResources}</a></li>
            <li><a href="${relativeHref(lang, 'about')}" style="color:#94a3b8;text-decoration:none;">${ui.navAbout}</a></li>
            <li><a href="${relativeHref(lang, 'privacy')}" style="color:#94a3b8;text-decoration:none;">${ui.navPrivacy}</a></li>
            <li><a href="${relativeHref(lang, 'terms')}" style="color:#94a3b8;text-decoration:none;">${ui.navTerms}</a></li>
          </ul>
        </div>
        <div>
          <div style="font-weight:700;color:#f8fafc;margin-bottom:12px;">Support & Contact</div>
          <p style="margin:0 0 8px;color:#64748b;">Questions or bug reports? Reach us anytime:</p>
          <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;text-decoration:none;font-weight:600;">${CONTACT_EMAIL}</a>
        </div>
      </div>
      <div style="max-width:1100px;margin:30px auto 0;padding-top:20px;border-top:1px solid #1e293b;text-align:center;color:#475569;font-size:13px;">
        ${ui.footerCopyright}
      </div>
    </footer>
  `
}

/* ─── 页面主体 HTML 构建器 ──────────────────────────────────── */
function buildHomeBody(lang, articles) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  const faqs = FAQ_DATA[lang] || FAQ_DATA.en
  const recentArticles = articles.slice(0, 6)

  return `
    ${renderNavbar(lang)}
    <main style="max-width:1100px;margin:0 auto;padding:40px 20px;color:#1e293b;line-height:1.7;">
      <!-- Hero -->
      <section style="text-align:center;padding:40px 0 30px;">
        <h1 style="font-size:2.5rem;font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:16px;">${esc(PAGE_SEO.home.h1[lang] || PAGE_SEO.home.h1.en)}</h1>
        <p style="font-size:1.2rem;color:#475569;max-width:760px;margin:0 auto 24px;">${esc(PAGE_SEO.home.description[lang] || PAGE_SEO.home.description.en)}</p>
        <div style="display:inline-flex;gap:12px;">
          <a href="${relativeHref(lang, '')}" style="background:#f97316;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">Start Editing SVG</a>
          <a href="${relativeHref(lang, 'resources')}" style="background:#f1f5f9;color:#0f172a;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">Browse Tutorials</a>
        </div>
      </section>

      <!-- Key Features Grid -->
      <section style="margin:50px 0;padding:30px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">${esc(ui.featuresTitle)}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:24px;">
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">🔒 ${esc(ui.feature1Title)}</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">${esc(ui.feature1Desc)}</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">⚡ ${esc(ui.feature2Title)}</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">${esc(ui.feature2Desc)}</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">📉 ${esc(ui.feature3Title)}</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">${esc(ui.feature3Desc)}</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">🖼️ ${esc(ui.feature4Title)}</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">${esc(ui.feature4Desc)}</p>
          </div>
        </div>
      </section>

      <!-- How to use -->
      <section style="margin:50px 0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:24px;">${esc(ui.howTitle)}</h2>
        <div style="max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:16px;">
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">${esc(ui.howStep1)}</div>
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">${esc(ui.howStep2)}</div>
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">${esc(ui.howStep3)}</div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section style="margin:50px 0;padding-top:30px;border-top:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">${esc(ui.faqTitle)}</h2>
        <div style="max-width:850px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
          ${faqs.map(faq => `
            <div style="background:#f8fafc;padding:22px;border-radius:14px;border:1px solid #e2e8f0;">
              <h3 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin-bottom:8px;">${esc(faq.q)}</h3>
              <p style="color:#475569;font-size:15px;margin:0;">${esc(faq.a)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Featured Tutorials -->
      <section style="margin:50px 0;padding-top:30px;border-top:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">${esc(ui.articlesTitle)}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;">
          ${recentArticles.map(a => {
            const title = a.title[lang] || a.title.en
            const excerpt = a.excerpt[lang] || a.excerpt.en
            return `
              <article style="background:#ffffff;padding:24px;border-radius:16px;border:1px solid #e2e8f0;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                  <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${a.date}</div>
                  <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;line-height:1.4;">
                    <a href="${relativeHref(lang, `resources/${a.slug}`)}" style="color:#0f172a;text-decoration:none;">${esc(title)}</a>
                  </h3>
                  <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 16px;">${esc(excerpt)}</p>
                </div>
                <a href="${relativeHref(lang, `resources/${a.slug}`)}" style="color:#f97316;font-weight:700;font-size:14px;text-decoration:none;">${esc(ui.readMore)}</a>
              </article>
            `
          }).join('')}
        </div>
      </section>
    </main>
    ${renderFooter(lang)}
  `
}

function buildResourcesListBody(lang, articles) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  return `
    ${renderNavbar(lang)}
    <main style="max-width:1100px;margin:0 auto;padding:40px 20px;color:#1e293b;line-height:1.7;">
      <header style="text-align:center;margin-bottom:40px;">
        <h1 style="font-size:2.4rem;font-weight:900;color:#0f172a;margin-bottom:12px;">${esc(PAGE_SEO.resources.h1[lang] || PAGE_SEO.resources.h1.en)}</h1>
        <p style="font-size:1.1rem;color:#64748b;max-width:650px;margin:0 auto;">${esc(PAGE_SEO.resources.description[lang] || PAGE_SEO.resources.description.en)}</p>
      </header>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:60px;">
        ${articles.map(a => {
          const title = a.title[lang] || a.title.en
          const excerpt = a.excerpt[lang] || a.excerpt.en
          return `
            <article style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
              <div>
                <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                  ${a.tags.map(t => `<span style="background:#f1f5f9;color:#475569;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;">${esc(t)}</span>`).join('')}
                  <span style="font-size:12px;color:#94a3b8;margin-left:auto;">${a.date}</span>
                </div>
                <h2 style="font-size:1.25rem;font-weight:800;color:#0f172a;margin-bottom:12px;line-height:1.4;">
                  <a href="${relativeHref(lang, `resources/${a.slug}`)}" style="color:#0f172a;text-decoration:none;">${esc(title)}</a>
                </h2>
                <p style="color:#64748b;font-size:14px;line-height:1.6;margin-bottom:20px;">${esc(excerpt)}</p>
              </div>
              <a href="${relativeHref(lang, `resources/${a.slug}`)}" style="color:#f97316;font-weight:700;font-size:14px;text-decoration:none;">${esc(ui.readMore)}</a>
            </article>
          `
        }).join('')}
      </div>
    </main>
    ${renderFooter(lang)}
  `
}

function buildArticleDetailBody(lang, article, renderedHtml) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  const title = article.title[lang] || article.title.en

  return `
    ${renderNavbar(lang)}
    <main style="max-width:860px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <!-- Breadcrumb -->
      <nav style="font-size:13px;color:#64748b;margin-bottom:20px;">
        <a href="${relativeHref(lang, '')}" style="color:#64748b;text-decoration:none;">${ui.navHome}</a> &gt;
        <a href="${relativeHref(lang, 'resources')}" style="color:#64748b;text-decoration:none;">${ui.navResources}</a> &gt;
        <span style="color:#0f172a;font-weight:600;">${esc(title)}</span>
      </nav>

      <article>
        <header style="margin-bottom:36px;border-bottom:1px solid #e2e8f0;padding-bottom:24px;">
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            ${article.tags.map(t => `<span style="background:#ffedd5;color:#c2410c;font-size:12px;font-weight:700;padding:3px 10px;border-radius:6px;">${esc(t)}</span>`).join('')}
          </div>
          <h1 style="font-size:2.3rem;font-weight:900;color:#0f172a;line-height:1.25;margin-bottom:16px;">${esc(title)}</h1>
          <div style="display:flex;align-items:center;gap:16px;font-size:13px;color:#64748b;">
            <span>✍️ ${esc(ui.author)}</span>
            <span>📅 ${esc(ui.publishedOn)} ${article.date}</span>
          </div>
        </header>

        <!-- Article Markdown Rendered Content -->
        <div class="prose" style="font-size:16px;color:#334155;line-height:1.8;">
          ${renderedHtml}
        </div>

        <footer style="margin-top:60px;padding-top:30px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <a href="${relativeHref(lang, 'resources')}" style="color:#f97316;font-weight:700;text-decoration:none;font-size:15px;">${esc(ui.backToResources)}</a>
          <a href="${relativeHref(lang, '')}" style="background:#f97316;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Try SVGDO Online Editor</a>
        </footer>
      </article>
    </main>
    ${renderFooter(lang)}
  `
}

function buildAboutBody(lang) {
  const ui = UI_TEXT[lang] || UI_TEXT.en
  return `
    ${renderNavbar(lang)}
    <main style="max-width:900px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <h1 style="font-size:2.4rem;font-weight:900;color:#0f172a;margin-bottom:16px;">${esc(PAGE_SEO.about.h1[lang] || PAGE_SEO.about.h1.en)}</h1>
      <p style="font-size:1.15rem;color:#475569;margin-bottom:36px;">${esc(PAGE_SEO.about.description[lang] || PAGE_SEO.about.description.en)}</p>

      <section style="margin-bottom:36px;">
        <h2 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin-bottom:12px;">Our Mission: Local-First Vector Processing</h2>
        <p>In an era where web tools increasingly force users to upload their creative assets and proprietary graphics to remote servers, SVGDO was created to redefine browser-based vector workflows. We believe that privacy, performance, and simplicity should never be compromised.</p>
        <p>Every single line of SVG code, path coordinate, color adjustment, and export operation happens 100% locally in your device's memory. No tracking of your designs, no cloud storage leaks, and no mandatory logins.</p>
      </section>

      <section style="margin-bottom:36px;">
        <h2 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin-bottom:12px;">Core Architecture & Technical Innovations</h2>
        <ul style="padding-left:24px;line-height:1.9;">
          <li><strong>Memory-Level AST & DOM Parsing:</strong> Real-time SVG XML parsing and sanitization using pure client-side parsers.</li>
          <li><strong>Zero-Latency GPU Rasterization:</strong> High-DPI Canvas export pipeline supporting up to 8x resolution scaling.</li>
          <li><strong>Integrated Code Minification:</strong> Native SVG path precision rounding, attribute optimization, and unused namespace stripping.</li>
          <li><strong>Responsive Cross-Platform UI:</strong> Designed to work seamlessly across desktops, tablets, and mobile devices.</li>
        </ul>
      </section>

      <section style="background:#f8fafc;padding:28px;border-radius:16px;border:1px solid #e2e8f0;margin-top:40px;">
        <h2 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin-bottom:8px;">Contact & Developer Support</h2>
        <p style="margin-bottom:12px;color:#64748b;">Have suggestions, feature requests, or business inquiries? Contact our team directly:</p>
        <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:700;font-size:16px;text-decoration:none;">${CONTACT_EMAIL}</a>
      </section>
    </main>
    ${renderFooter(lang)}
  `
}

function buildLegalBody(lang, type) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? (PAGE_SEO.privacy.h1[lang] || 'Privacy Policy') : (PAGE_SEO.terms.h1[lang] || 'Terms of Service')
  
  return `
    ${renderNavbar(lang)}
    <main style="max-width:860px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <h1 style="font-size:2.3rem;font-weight:900;color:#0f172a;margin-bottom:16px;">${esc(title)}</h1>
      <p style="color:#64748b;font-size:14px;margin-bottom:30px;"><strong>Last Updated: July 2026</strong></p>

      ${isPrivacy ? `
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">1. Client-Side Local Processing & Zero Server Uploads</h2>
          <p>SVGDO operates exclusively client-side. When you edit, convert, or export SVG files on this website, all processing algorithms execute in your local browser memory. Your image assets, code, and graphics are never transmitted or stored on any remote server.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">2. Cookies & Google AdSense Advertising Disclosures</h2>
          <p>To keep SVGDO free, we partner with third-party advertising vendors including Google AdSense. Google uses cookies (including the DoubleClick cookie) to serve ads based on user visits to this and other websites on the Internet.</p>
          <p>Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com/) or via aboutads.info.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">3. GDPR & CCPA Compliance</h2>
          <p>We respect international privacy rights under GDPR (EU/UK) and CCPA (California). Because we do not collect personal identities or store your creative files, data deletion requests are naturally satisfied by refreshing or closing your browser.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">4. Contact Us</h2>
          <p>For any privacy-related inquiries, please email our data protection contact at: <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:600;">${CONTACT_EMAIL}</a>.</p>
        </section>
      ` : `
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">1. Description of Service</h2>
          <p>SVGDO provides free online vector graphic editing, code formatting, path manipulation, and image export tools. All operations run directly in your web browser.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">2. User Ownership of Content</h2>
          <p>You retain 100% full ownership and intellectual property rights to all SVG graphics, vector files, and exported images that you create or process using SVGDO.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">3. Disclaimer & Limitation of Liability</h2>
          <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. SVGDO shall not be liable for any indirect or consequential damages arising from the use of this tool.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">4. Legal Inquiries</h2>
          <p>If you have any questions regarding these Terms of Service, reach out to us at: <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:600;">${CONTACT_EMAIL}</a>.</p>
        </section>
      `}
    </main>
    ${renderFooter(lang)}
  `
}

/* ─── 生成最终 HTML 文档 ─────────────────────────────────────── */
function buildFullHtml({ lang, pagePath, title, description, keywords, type, datePublished, bodyHtml }) {
  const langInfo = LANGS.find(l => l.code === lang) || LANGS[0]
  const url = pageUrl(lang, pagePath)

  const alternates = LANGS
    .map(l => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code, pagePath)}" />`)
    .join('\n    ')
  const xdefault = `<link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG, pagePath)}" />`

  const ogLocale = `<meta property="og:locale" content="${langInfo.ogLocale}" />`
  const ogLocales = LANGS
    .filter(l => l.code !== lang)
    .map(l => `<meta property="og:locale:alternate" content="${l.ogLocale}" />`)
    .join('\n    ')

  let jsonLd
  if (type === 'article') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      inLanguage: lang,
      datePublished: datePublished || '2026-07-20',
      author: { '@type': 'Organization', name: 'SVGDO' },
      publisher: { '@type': 'Organization', name: 'SVGDO', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }
  } else if (type === 'webapp') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      inLanguage: lang,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }
  } else {
    jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url, inLanguage: lang }
  }

  return `<!doctype html>
<html lang="${langInfo.htmlLang}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#f97316" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${keywords ? `<meta name="keywords" content="${esc(keywords.join(', '))}" />` : ''}

    <link rel="canonical" href="${url}" />
    ${alternates}
    ${xdefault}

    <meta property="og:type" content="${type === 'article' ? 'article' : 'website'}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    ${ogLocale}
    ${ogLocales}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

    ${assetTags.gtagLoader.join('\n    ')}
    ${assetTags.gtagInline}
    ${assetTags.adsense.join('\n    ')}
    ${assetTags.preloads.join('\n    ')}
    ${assetTags.css.join('\n    ')}
    ${assetTags.tags.join('\n    ')}
  </head>
  <body>
    <div id="root">${bodyHtml}</div>
  </body>
</html>
`
}

/* ─── 主流程 ─────────────────────────────────────────────── */
async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('✗ dist/index.html 不存在，请先运行 npm run build')
    process.exit(1)
  }
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  assetTags = extractAssetTags(template)

  const { marked } = await import('marked')
  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  const articles = extractArticles()
  console.log(`  从 articles.ts 提取了 ${articles.length} 篇文章`)

  let count = 0
  const writeFor = (html, lang, pagePath) => {
    const dir = lang === DEFAULT_LANG
      ? path.join(DIST, pagePath)
      : path.join(DIST, lang, pagePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
    count++
  }

  // 1. 固定页 × 5 语言
  for (const langInfo of LANGS) {
    const lang = langInfo.code

    // Home
    const homeSeo = PAGE_SEO.home
    const homeTitle = homeSeo.title[lang] || homeSeo.title.en
    const homeDesc = homeSeo.description[lang] || homeSeo.description.en
    const homeHtml = buildFullHtml({
      lang,
      pagePath: '',
      title: homeTitle,
      description: homeDesc,
      keywords: ['SVG editor', 'free SVG editor', 'online SVG editor', 'SVG optimizer', 'SVG to PNG'],
      type: 'webapp',
      bodyHtml: buildHomeBody(lang, articles),
    })
    writeFor(homeHtml, lang, '')

    // Resources
    const resSeo = PAGE_SEO.resources
    const resTitle = resSeo.title[lang] || resSeo.title.en
    const resDesc = resSeo.description[lang] || resSeo.description.en
    const resHtml = buildFullHtml({
      lang,
      pagePath: 'resources',
      title: resTitle,
      description: resDesc,
      type: 'webpage',
      bodyHtml: buildResourcesListBody(lang, articles),
    })
    writeFor(resHtml, lang, 'resources')

    // About
    const aboutSeo = PAGE_SEO.about
    const aboutTitle = aboutSeo.title[lang] || aboutSeo.title.en
    const aboutDesc = aboutSeo.description[lang] || aboutSeo.description.en
    const aboutHtml = buildFullHtml({
      lang,
      pagePath: 'about',
      title: aboutTitle,
      description: aboutDesc,
      type: 'webpage',
      bodyHtml: buildAboutBody(lang),
    })
    writeFor(aboutHtml, lang, 'about')

    // Privacy
    const privSeo = PAGE_SEO.privacy
    const privTitle = privSeo.title[lang] || privSeo.title.en
    const privDesc = privSeo.description[lang] || privSeo.description.en
    const privHtml = buildFullHtml({
      lang,
      pagePath: 'privacy',
      title: privTitle,
      description: privDesc,
      type: 'webpage',
      bodyHtml: buildLegalBody(lang, 'privacy'),
    })
    writeFor(privHtml, lang, 'privacy')

    // Terms
    const termsSeo = PAGE_SEO.terms
    const termsTitle = termsSeo.title[lang] || termsSeo.title.en
    const termsDesc = termsSeo.description[lang] || termsSeo.description.en
    const termsHtml = buildFullHtml({
      lang,
      pagePath: 'terms',
      title: termsTitle,
      description: termsDesc,
      type: 'webpage',
      bodyHtml: buildLegalBody(lang, 'terms'),
    })
    writeFor(termsHtml, lang, 'terms')
  }

  // 2. 85 篇 Markdown 文章页预渲染（17 篇 × 5 语言）
  for (const article of articles) {
    for (const langInfo of LANGS) {
      const lang = langInfo.code
      const title = article.title[lang] || article.title.en
      const description = article.excerpt[lang] || article.excerpt.en
      const pagePath = `resources/${article.slug}`

      // 寻找对应的 markdown 文件
      const suffix = lang === DEFAULT_LANG ? '' : `.${lang}`
      let mdPath = path.join(PUBLIC, 'content', `${article.slug}${suffix}.md`)
      if (!fs.existsSync(mdPath)) {
        mdPath = path.join(PUBLIC, 'content', `${article.slug}.md`)
      }

      let renderedMarkdown = ''
      if (fs.existsSync(mdPath)) {
        const mdRaw = fs.readFileSync(mdPath, 'utf8')
        renderedMarkdown = marked.parse(mdRaw)
      } else {
        renderedMarkdown = `<p>${esc(description)}</p>`
      }

      const articleBodyHtml = buildArticleDetailBody(lang, article, renderedMarkdown)
      const articleHtml = buildFullHtml({
        lang,
        pagePath,
        title,
        description,
        keywords: article.tags,
        type: 'article',
        datePublished: article.date,
        bodyHtml: articleBodyHtml,
      })
      writeFor(articleHtml, lang, pagePath)
    }
  }

  console.log(`\n🎉 成功生成 ${count} 个全量 SEO 预渲染 HTML 页面！`)
  console.log(`   - 首页、帮助中心、关于我们、隐私政策、服务条款 × 5 语言`)
  console.log(`   - ${articles.length} 篇长文 Markdown 教程全量预渲染 × 5 语言`)
  console.log(`   - 爬虫（Googlebot/AdSense）现在能看到数万字的高价值原创富文本内容！`)
}

let assetTags = null
main().catch(err => {
  console.error('generate-seo-html 执行出错:', err)
  process.exit(1)
})
