const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es'];
const localesDir = path.join(__dirname, '../src/locales');

const seoData = {
  en: {
    title: 'SVGDO - Free Online SVG Editor | Fast, Secure & No Upload',
    description: 'The ultimate free online SVG editor. Experience lightning-fast, 100% local browser-based SVG editing, compression, and PNG export. Zero cloud uploads. Secure and private.',
    keywords: ['SVG editor', 'free SVG editor', 'online SVG editor', 'fast SVG optimizer', 'SVG to PNG converter', 'secure vector editor', 'browser-based SVG tool', 'SVG compression']
  },
  zh: {
    title: 'SVGDO - 免费在线 SVG 编辑器 | 极速、安全、无云端上传',
    description: '最强大的免费在线 SVG 编辑器。体验极速、100% 浏览器本地计算的 SVG 代码编辑、压缩优化和 PNG 导出。零云端上传，彻底保护您的商业设计隐私。',
    keywords: ['SVG编辑器', '免费SVG编辑器', '在线SVG工具', '极速SVG压缩', 'SVG转PNG', '本地安全矢量处理', 'SVG代码优化', '无云端上传SVG']
  },
  ja: {
    title: 'SVGDO - 無料オンラインSVGエディター | 超高速・安全・クラウドアップロード不要',
    description: '究極の無料オンラインSVGエディター。超高速で100%ブラウザローカルでのSVG編集、圧縮最適化、PNGエクスポートを体験してください。クラウドへのアップロードゼロで、デザインのプライバシーを保護します。',
    keywords: ['SVGエディター', '無料SVGエディター', 'オンラインSVGツール', '超高速SVG圧縮', 'SVGをPNGに変換', '安全なベクターエディター', 'SVGコード最適化', 'クラウド不要SVG']
  },
  ko: {
    title: 'SVGDO - 무료 온라인 SVG 편집기 | 초고속, 안전, 클라우드 업로드 없음',
    description: '최고의 무료 온라인 SVG 편집기입니다. 초고속 100% 브라우저 로컬 기반의 SVG 편집, 압축 최적화 및 PNG 내보내기를 경험해 보세요. 클라우드 업로드가 없어 디자인의 개인정보를 완벽하게 보호합니다.',
    keywords: ['SVG 편집기', '무료 SVG 편집기', '온라인 SVG 도구', '초고속 SVG 압축', 'SVG를 PNG로 변환', '안전한 벡터 편집기', 'SVG 코드 최적화', '클라우드 없는 SVG']
  },
  es: {
    title: 'SVGDO - Editor SVG en línea gratuito | Rápido, seguro y sin subidas a la nube',
    description: 'El editor SVG en línea gratuito definitivo. Experimenta una edición, compresión y exportación a PNG ultrarrápida, 100% basada en el navegador local. Cero subidas a la nube. Seguro y privado.',
    keywords: ['Editor SVG', 'editor SVG gratuito', 'herramienta SVG en línea', 'compresión SVG rápida', 'conversor SVG a PNG', 'editor de vectores seguro', 'optimización de código SVG', 'SVG sin nube']
  }
};

locales.forEach(lang => {
  const dir = path.join(localesDir, lang);
  const seoPath = path.join(dir, 'seo.ts');
  const data = seoData[lang];
  
  if (fs.existsSync(seoPath)) {
    let content = fs.readFileSync(seoPath, 'utf-8');
    
    // Replace title
    content = content.replace(/title:\s*'.*'/, "title: '" + data.title + "'");
    // Replace description
    content = content.replace(/description:\s*'.*'/, "description: '" + data.description + "'");
    // Replace keywords
    const keywordsStr = data.keywords.map(k => "'" + k + "'").join(', ');
    content = content.replace(/keywords:\s*\[.*\]/, "keywords: [" + keywordsStr + "]");
    
    fs.writeFileSync(seoPath, content);
  }
});
console.log('SEO metadata updated across all languages!');
