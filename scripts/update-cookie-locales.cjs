const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es'];
const localesDir = path.join(__dirname, '../src/locales');

const cookieData = {
  en: { msg: 'We use cookies (including third-party cookies like Google AdSense) to personalize content, serve targeted ads, and analyze our traffic. By clicking "Accept", you consent to our use of cookies.', accept: 'Accept', learnMore: 'Learn More' },
  zh: { msg: '本站使用 Cookie（包含 Google AdSense 等第三方 Cookie）来提供个性化内容、投放广告以及分析流量。点击“同意”即表示您同意我们使用 Cookie。', accept: '同意', learnMore: '了解更多' },
  ja: { msg: '当サイトでは、コンテンツのパーソナライズ、広告の配信（Google AdSense等）、およびトラフィック分析のためにCookieを使用しています。「同意する」をクリックすると、Cookieの使用に同意したことになります。', accept: '同意する', learnMore: '詳細' },
  ko: { msg: '본 웹사이트는 콘텐츠 맞춤 설정, 타겟 광고 게재(Google AdSense 등) 및 트래픽 분석을 위해 쿠키를 사용합니다. "동의"를 클릭하면 쿠키 사용에 동의하는 것으로 간주됩니다.', accept: '동의', learnMore: '자세히 알아보기' },
  es: { msg: 'Utilizamos cookies (incluidas cookies de terceros como Google AdSense) para personalizar el contenido, mostrar anuncios dirigidos y analizar nuestro tráfico. Al hacer clic en "Aceptar", usted acepta nuestro uso de cookies.', accept: 'Aceptar', learnMore: 'Saber Más' },
};

locales.forEach(lang => {
  const dir = path.join(localesDir, lang);
  const commonPath = path.join(dir, 'common.ts');
  let commonStr = fs.readFileSync(commonPath, 'utf-8');
  
  if (!commonStr.includes('cookieConsent:')) {
    const data = cookieData[lang];
    const injection = 'cookieConsent: { msg: \'' + data.msg + '\', accept: \'' + data.accept + '\', learnMore: \'' + data.learnMore + '\' },';
    commonStr = commonStr.replace(/(nav: \{.*\},)/, '$1\n  ' + injection);
    fs.writeFileSync(commonPath, commonStr);
  }
});
console.log('Cookie locales added!');
