export interface Article {
  slug: string
  title: Record<string, string>   // lang code → title
  date: string
  excerpt: Record<string, string> // lang code → excerpt
  tags: string[]
}

export const tagLabels: Record<string, Record<string, string>> = {
  'SVG':        { zh: 'SVG',         en: 'SVG',         ja: 'SVG',         ko: 'SVG',         es: 'SVG' },
  'vector':     { zh: '矢量',        en: 'Vector',      ja: 'ベクター',    ko: '벡터',        es: 'Vector' },
  'design':     { zh: '设计',        en: 'Design',      ja: 'デザイン',    ko: '디자인',      es: 'Diseño' },
  'guide':      { zh: '指南',        en: 'Guide',       ja: 'ガイド',      ko: '가이드',      es: 'Guía' },
  'tutorial':   { zh: '教程',        en: 'Tutorial',    ja: 'チュートリアル', ko: '튜토리얼', es: 'Tutorial' },
  'formats':    { zh: '格式',        en: 'Formats',     ja: 'フォーマット', ko: '포맷',      es: 'Formatos' },
  'optimization': { zh: '优化',      en: 'Optimization', ja: '最適化',     ko: '최적화',      es: 'Optimización' },
  'web-dev':    { zh: '前端开发',    en: 'Web Dev',     ja: 'ウェブ開発',  ko: '웹 개발',    es: 'Desarrollo Web' },
  'animation':  { zh: '动画',        en: 'Animation',   ja: 'アニメーション', ko: '애니메이션', es: 'Animación' },
  'tips':       { zh: '技巧',        en: 'Tips',        ja: 'ヒント',      ko: '팁',          es: 'Consejos' },
  'beginner':   { zh: '入门',        en: 'Beginner',    ja: '初心者',      ko: '초보자',      es: 'Principiante' },
  'comparison': { zh: '对比',        en: 'Comparison',  ja: '比較',        ko: '비교',        es: 'Comparación' },
}

export function getTagLabel(tag: string, lang: string): string {
  return tagLabels[tag]?.[lang] ?? tagLabels[tag]?.en ?? tag
}

export const articles: Article[] = [
  {
    slug: 'svg-basics',
    title: { zh: 'SVG 格式入门：什么是 SVG？为什么你需要它？', en: 'SVG Basics: What Is SVG and Why Do You Need It?', ja: 'SVG入門：SVGとは？なぜ必要なのか？', ko: 'SVG 기초: SVG란 무엇이며 왜 필요한가?' },
    date: '2026-07-16',
    excerpt: { zh: '从零开始了解 SVG。可缩放矢量图形是什么？它和 PNG、JPEG 有什么区别？为什么设计师和前端开发者都在用它？', en: 'Learn SVG from scratch. What is Scalable Vector Graphics? How does it differ from PNG and JPEG? Why designers and developers love it.', ja: 'SVGをゼロから学ぶ。スケーラブルベクターグラフィックスとは？PNGやJPEGとの違いは？デザイナーや開発者が愛用する理由。', ko: 'SVG를 처음부터 배워보세요. 스케일러블 벡터 그래픽스란? PNG 및 JPEG와의 차이점은? 디자이너와 개발자가 사랑하는 이유.', es: 'Aprende SVG desde cero. ¿Qué son los Gráficos Vectoriales Escalables? ¿En qué se diferencian de PNG y JPEG? Por qué diseñadores y desarrolladores lo adoran.' },
    tags: ['SVG', 'beginner', 'guide'],
  },
  {
    slug: 'svg-vs-png',
    title: { zh: 'SVG vs PNG：什么时候该用矢量图？什么时候用位图？', en: 'SVG vs PNG: When to Use Vector and When to Use Raster', ja: 'SVG vs PNG：ベクターとラスターの使い分け', ko: 'SVG vs PNG: 벡터와 래스터, 언제 무엇을 써야 할까?' },
    date: '2026-07-16',
    excerpt: { zh: 'SVG 和 PNG 各有优势。本文从文件大小、缩放、透明度、浏览器兼容等维度全面对比，帮你选对格式。', en: 'SVG and PNG each have strengths. A comprehensive comparison across file size, scaling, transparency, and browser support to help you choose.', ja: 'SVGとPNGにはそれぞれ強みがある。ファイルサイズ、拡大縮小、透明度、ブラウザ対応まで包括的に比較し、最適な選択をサポート。', ko: 'SVG와 PNG는 각각 장점이 있습니다. 파일 크기, 확대, 투명도, 브라우저 지원까지 포괄적으로 비교하여 최적의 선택을 도와드립니다.', es: 'SVG y PNG tienen sus fortalezas. Una comparación completa de tamaño, escalado, transparencia y soporte de navegadores para elegir el formato correcto.' },
    tags: ['SVG', 'formats', 'comparison'],
  },
  {
    slug: 'svg-optimization',
    title: { zh: 'SVG 文件优化指南：把 SVG 压缩到极致', en: 'SVG Optimization Guide: Compress SVGs to the Minimum', ja: 'SVG最適化ガイド：SVGを限界まで圧縮する', ko: 'SVG 최적화 가이드: SVG를 극한까지 압축하기' },
    date: '2026-07-16',
    excerpt: { zh: '设计工具导出的 SVG 通常包含大量冗余代码。学习如何移除注释、简化路径、删除无用属性，让 SVG 文件体积减少 50%-80%。', en: 'SVGs from design tools often contain bloat. Learn to strip comments, simplify paths, and remove useless attributes — reducing file size by 50-80%.', ja: 'デザインツールから出力されたSVGには多くの無駄が。コメント削除、パス簡略化、不要属性の除去で、ファイルサイズを50-80%削減する方法を学ぶ。', ko: '디자인 도구에서 출력된 SVG에는 많은 불필요한 코드가 있습니다. 주석 제거, 패스 간소화, 불필요 속성 제거로 파일 크기를 50-80% 줄이는 방법을 배워보세요.', es: 'Los SVG de herramientas de diseño suelen contener código innecesario. Aprende a eliminar comentarios, simplificar trazados y quitar atributos inútiles — reduce el tamaño un 50-80%.' },
    tags: ['SVG', 'optimization', 'tutorial'],
  },
  {
    slug: 'svg-animation',
    title: { zh: 'SVG 动画入门：用 CSS 让图标动起来', en: 'SVG Animation Guide: Animating Icons with CSS', ja: 'SVGアニメーション入門：CSSでアイコンを動かす', ko: 'SVG 애니메이션 입문: CSS로 아이콘 움직이기' },
    date: '2026-07-17',
    excerpt: { zh: 'SVG 不只是静态图像。通过 CSS animation 和 SMIL，你可以让图标旋转、变色、变形。新手也能上手的动画教程。', en: 'SVG isn\'t just static. With CSS animation and SMIL, make icons spin, change color, and morph. A beginner-friendly animation tutorial.', ja: 'SVGは静止画だけではない。CSSアニメーションとSMILで、アイコンを回転させ、色を変え、変形させる。初心者でもできるアニメーション入門。', ko: 'SVG는 정적인 이미지가 아닙니다. CSS 애니메이션으로 아이콘을 회전시키고, 색을 바꾸고, 변형시킬 수 있습니다. 초보자도 쉽게 따라할 수 있는 애니메이션 튜토리얼.', es: 'SVG no es solo estático. Con animación CSS, haz que los iconos giren, cambien de color y se transformen. Un tutorial para principiantes.' },
    tags: ['SVG', 'animation', 'tutorial'],
  },
  {
    slug: 'svg-icons-guide',
    title: { zh: '图标设计指南：从 SVG 开始的完整工作流', en: 'Icon Design Guide: Complete SVG Workflow', ja: 'アイコンデザインガイド：SVGワークフロー完全版', ko: '아이콘 디자인 가이드: SVG 워크플로 완전판' },
    date: '2026-07-17',
    excerpt: { zh: '设计一套高质量 SVG 图标的完整流程。从网格设置、描边规范到导出优化，专业图标设计师都在用的方法。', en: 'A complete workflow for designing high-quality SVG icon sets. From grid setup and stroke specs to export optimization — the methods pro designers use.', ja: '高品質なSVGアイコンセットをデザインするための完全なワークフロー。グリッド設定、ストローク仕様からエクスポート最適化まで、プロの手法を紹介。', ko: '고품질 SVG 아이콘 세트를 디자인하는 완전한 워크플로. 그리드 설정, 스트로크 사양부터 내보내기 최적화까지, 프로 디자이너가 사용하는 방법을 소개합니다.', es: 'Un flujo de trabajo completo para diseñar conjuntos de iconos SVG de alta calidad. Desde cuadrícula y especificaciones de trazo hasta optimización de exportación.' },
    tags: ['SVG', 'design', 'guide'],
  },
  {
    slug: 'svg-in-web',
    title: { zh: '网页中使用 SVG 的 5 种方式及最佳实践', en: '5 Ways to Use SVG in Web Pages — Best Practices', ja: 'WebページでSVGを使う5つの方法とベストプラクティス', ko: '웹에서 SVG를 사용하는 5가지 방법과 모범 사례' },
    date: '2026-07-17',
    excerpt: { zh: '在 HTML 中嵌入 SVG 有很多种方式：inline、img 标签、CSS background、data URI 和 sprite。了解每种方式的优劣和适用场景。', en: 'Many ways to embed SVG in HTML: inline, img tag, CSS background, data URI, and sprite. Learn the pros, cons, and best use cases for each.', ja: 'HTMLにSVGを埋め込む方法は多数：インライン、imgタグ、CSS背景、Data URI、スプライト。それぞれの長所短所と最適な使用シーンを解説。', ko: 'HTML에 SVG를 임베딩하는 다양한 방법: 인라인, img 태그, CSS 배경, Data URI, 스프라이트. 각 방식의 장단점과 최적의 사용 사례를 알아보세요.', es: 'Muchas formas de incrustar SVG en HTML: en línea, img, fondo CSS, Data URI y sprite. Ventajas, desventajas y mejores usos para cada método.' },
    tags: ['SVG', 'web-dev', 'guide'],
  },
  {
    slug: 'svg-editor-guide',
    title: { zh: '在线 SVG 编辑器完全使用指南', en: 'Complete Guide to Using Online SVG Editors', ja: 'オンラインSVGエディタ完全活用ガイド', ko: '온라인 SVG 에디터 완전 활용 가이드' },
    date: '2026-07-17',
    excerpt: { zh: '掌握在线 SVG 编辑器的全部功能。从上传、编辑、优化到导出，一步步教你高效处理 SVG 文件。', en: 'Master the online SVG editor. From upload, edit, optimize to export — a step-by-step guide to processing SVG files efficiently.', ja: 'オンラインSVGエディタの全機能をマスター。アップロード、編集、最適化からエクスポートまで、SVGファイルを効率的に処理する方法をステップバイステップで解説。', ko: '온라인 SVG 에디터의 모든 기능을 마스터하세요. 업로드, 편집, 최적화부터 내보내기까지 SVG 파일을 효율적으로 처리하는 방법을 단계별로 설명합니다.', es: 'Domina el editor SVG online. Desde subir, editar, optimizar hasta exportar — una guía paso a paso para procesar archivos SVG eficientemente.' },
    tags: ['SVG', 'tutorial', 'guide'],
  },
  {
    slug: 'svg-to-png-guide',
    title: { zh: 'SVG 转 PNG 完全指南：格式转换的正确姿势', en: 'SVG to PNG Guide: The Right Way to Convert', ja: 'SVGからPNGへの変換ガイド：正しい変換方法', ko: 'SVG를 PNG로 변환 가이드: 올바른 변환 방법' },
    date: '2026-07-17',
    excerpt: { zh: '什么时候需要把 SVG 转成 PNG？如何选择分辨率和背景色？教你用在线工具一键完成高质量转换。', en: 'When should you convert SVG to PNG? How to choose resolution and background? One-click high-quality conversion with online tools.', ja: 'いつSVGをPNGに変換すべきか？解像度と背景色の選び方は？オンラインツールで高品質変換をワンクリックで行う方法を解説。', ko: '언제 SVG를 PNG로 변환해야 할까요? 해상도와 배경색은 어떻게 선택할까요? 온라인 도구로 고품질 변환을 원클릭으로 하는 방법을 알려드립니다.', es: '¿Cuándo convertir SVG a PNG? ¿Cómo elegir resolución y fondo? Conversión de alta calidad con un clic usando herramientas online.' },
    tags: ['SVG', 'formats', 'tutorial'],
  },
]
