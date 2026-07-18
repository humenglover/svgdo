const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es'];
const localesDir = path.join(__dirname, '../src/locales');

const translations = {
  en: {
    navTerms: 'Terms of Service',
    contactTitle: 'Contact Us',
    contactDesc: 'We welcome your feedback and suggestions. If you have any questions, business inquiries, or need technical support, please feel free to contact us via the email below.',
    termsTitle: 'Terms of Service',
    termsBack: 'Back to Home',
    termsIntro: 'Welcome to SVGDO ("the Website"). By using our free online SVG editor and tools, you agree to be bound by these Terms of Service.',
    t1Title: '1. Use of Service',
    t1Desc: 'The Website provides browser-based SVG editing, compression, and conversion tools. All core processing happens locally in your browser. You may use these tools for personal or commercial projects.',
    t2Title: '2. User Content & Privacy',
    t2Desc: 'We do not own, store, or upload any SVG files you edit to our servers. Your files remain entirely yours. For more details, please see our Privacy Policy.',
    t3Title: '3. Intellectual Property',
    t3Desc: 'The architecture, design, interface, and integration of this Website are proprietary. You are free to use the output code, but you may not maliciously scrape or copy the Website\'s code to build counterfeit sites.',
    t4Title: '4. Disclaimer',
    t4Desc: 'The Website is provided "as is". We are not liable for any data loss, business interruption, or damages resulting from the use of our tools. Please backup your files before processing.',
    t5Title: '5. Contact',
    t5Desc: 'If you have any questions about these Terms, please contact us at: shengqiangwang666@gmail.com'
  },
  zh: {
    navTerms: '服务条款',
    contactTitle: '联系我们',
    contactDesc: '我们非常欢迎您提出宝贵的意见与反馈。如果您有任何问题、商业合作意向或需要技术支持，请随时通过以下电子邮箱与我们取得联系。',
    termsTitle: '服务条款 (Terms of Service)',
    termsBack: '返回首页',
    termsIntro: '欢迎使用 SVGDO（“本网站”）。在使用我们的免费在线 SVG 编辑器及相关工具前，请仔细阅读以下条款。使用本网站即表示您同意这些条款。',
    t1Title: '1. 服务的使用',
    t1Desc: '本网站提供基于浏览器的 SVG 矢量图编辑、压缩与转换工具。所有的核心计算和处理均在您的本地浏览器中完成。您可以免费使用这些工具用于个人或商业项目。',
    t2Title: '2. 用户内容与隐私',
    t2Desc: '我们不拥有、不存储也不会向任何第三方服务器上传您编辑或处理的 SVG 文件。您的文件和数据完全属于您自己。有关详细信息，请参阅我们的隐私政策。',
    t3Title: '3. 知识产权',
    t3Desc: '本网站的架构、设计、界面以及底层开源整合由本站团队独立开发。您可以自由使用输出的代码，但禁止恶意扒取、复制本网站的整体代码架构用于构建仿冒站点。',
    t4Title: '4. 免责声明',
    t4Desc: '本网站“按原样”提供。我们不对由于使用本工具造成的任何数据丢失、业务中断或其他间接损害承担责任。在处理极其重要的文件前，请务必自行做好备份。',
    t5Title: '5. 联系我们',
    t5Desc: '如果您对这些条款有任何疑问，可以通过以下方式联系我们：shengqiangwang666@gmail.com'
  },
  ja: {
    navTerms: '利用規約',
    contactTitle: 'お問い合わせ',
    contactDesc: '貴重なご意見やフィードバックを歓迎いたします。ご質問、ビジネスのお問い合わせ、技術サポートが必要な場合は、以下のメールアドレスまでお気軽にご連絡ください。',
    termsTitle: '利用規約 (Terms of Service)',
    termsBack: 'ホームに戻る',
    termsIntro: 'SVGDO（以下「当サイト」）へようこそ。無料のオンラインSVGエディターおよび関連ツールを使用する前に、以下の利用規約をよくお読みください。当サイトを使用することにより、これらの利用規約に拘束されることに同意したことになります。',
    t1Title: '1. サービスの利用',
    t1Desc: '当サイトは、ブラウザベースのSVG編集、圧縮、変換ツールを提供します。すべてのコア処理はブラウザのローカルで完了します。これらのツールは個人または商用プロジェクトに無料でご使用いただけます。',
    t2Title: '2. ユーザーコンテンツとプライバシー',
    t2Desc: '当社は、お客様が編集または処理したSVGファイルを所有、保存、またはいかなるサードパーティサーバーにもアップロードしません。お客様のファイルとデータは完全に独自のものです。詳細については、プライバシーポリシーを参照してください。',
    t3Title: '3. 知的財産',
    t3Desc: '当サイトのアーキテクチャ、デザイン、インターフェース、および基礎となるオープンソースの統合は、独自に開発されたものです。出力コードを自由に使用できますが悪意を持ってスクレイピングしたり、ウェブサイトのコードをコピーして偽造サイトを構築したりすることは禁止されています。',
    t4Title: '4. 免責事項',
    t4Desc: '当サイトは「現状有姿」で提供されます。本ツールの使用に起因するデータ損失、事業の中断、その他の間接的な損害について、当社は一切責任を負いません。重要なファイルを処理する前に、必ずご自身でバックアップを取ってください。',
    t5Title: '5. お問い合わせ',
    t5Desc: 'これらの規約についてご不明な点がある場合は、shengqiangwang666@gmail.com までご連絡ください。'
  },
  ko: {
    navTerms: '서비스 약관',
    contactTitle: '문의하기',
    contactDesc: '소중한 의견과 피드백을 환영합니다. 질문, 비즈니스 파트너십 문의 또는 기술 지원이 필요한 경우 아래 이메일 주소로 언제든지 문의해 주세요.',
    termsTitle: '서비스 약관 (Terms of Service)',
    termsBack: '홈으로 돌아가기',
    termsIntro: 'SVGDO("본 웹사이트")에 오신 것을 환영합니다. 무료 온라인 SVG 편집기 및 관련 도구를 사용하기 전에 다음 약관을 주의 깊게 읽어보시기 바랍니다. 본 웹사이트를 사용함으로써 귀하는 이 약관에 동의하는 것으로 간주됩니다.',
    t1Title: '1. 서비스 이용',
    t1Desc: '본 웹사이트는 브라우저 기반 SVG 벡터 편집, 압축 및 변환 도구를 제공합니다. 모든 핵심 계산 및 처리는 로컬 브라우저에서 이루어집니다. 개인 또는 상업 프로젝트에 이러한 도구를 무료로 사용할 수 있습니다.',
    t2Title: '2. 사용자 콘텐츠 및 개인정보',
    t2Desc: '당사는 귀하가 편집하거나 처리한 SVG 파일을 소유, 저장하거나 타사 서버에 업로드하지 않습니다. 귀하의 파일과 데이터는 전적으로 귀하의 소유입니다. 자세한 내용은 개인정보 보호정책을 참조하세요.',
    t3Title: '3. 지적 재산권',
    t3Desc: '본 웹사이트의 아키텍처, 디자인, 인터페이스 및 기본 오픈소스 통합은 독자적으로 개발되었습니다. 출력 코드를 자유롭게 사용할 수 있지만 웹사이트의 코드를 악의적으로 스크랩하거나 복사하여 위조 사이트를 구축하는 것은 금지되어 있습니다.',
    t4Title: '4. 면책 조항',
    t4Desc: '본 웹사이트는 "있는 그대로" 제공됩니다. 당사는 본 도구 사용으로 인한 데이터 손실, 비즈니스 중단 또는 기타 간접적인 손해에 대해 책임을 지지 않습니다. 매우 중요한 파일을 처리하기 전에 반드시 백업을 수행하시기 바랍니다.',
    t5Title: '5. 문의하기',
    t5Desc: '본 약관과 관련하여 궁금한 점이 있으시면 shengqiangwang666@gmail.com 으로 문의해 주십시오.'
  },
  es: {
    navTerms: 'Términos de Servicio',
    contactTitle: 'Contáctenos',
    contactDesc: 'Agradecemos sus valiosos comentarios y sugerencias. Si tiene alguna pregunta, consultas comerciales o necesita soporte técnico, no dude en contactarnos a través del siguiente correo electrónico.',
    termsTitle: 'Términos de Servicio',
    termsBack: 'Volver a Inicio',
    termsIntro: 'Bienvenido a SVGDO ("el Sitio Web"). Al utilizar nuestro editor SVG en línea gratuito y herramientas relacionadas, usted acepta estar sujeto a estos Términos de Servicio.',
    t1Title: '1. Uso del Servicio',
    t1Desc: 'El Sitio Web proporciona herramientas de edición, compresión y conversión de vectores SVG basadas en el navegador. Todo el procesamiento central ocurre localmente en su navegador. Puede utilizar estas herramientas de forma gratuita para proyectos personales o comerciales.',
    t2Title: '2. Contenido del Usuario y Privacidad',
    t2Desc: 'No poseemos, almacenamos ni subimos ningún archivo SVG que edite o procese a ningún servidor de terceros. Sus archivos y datos le pertenecen por completo. Para más detalles, consulte nuestra Política de Privacidad.',
    t3Title: '3. Propiedad Intelectual',
    t3Desc: 'La arquitectura, el diseño, la interfaz y la integración de código abierto subyacente de este Sitio Web son de desarrollo propio. Puede utilizar el código de salida libremente, pero tiene prohibido copiar o extraer maliciosamente la arquitectura del código del sitio web para construir sitios falsificados.',
    t4Title: '4. Descargo de Responsabilidad',
    t4Desc: 'El Sitio Web se proporciona "tal cual". No nos hacemos responsables de ninguna pérdida de datos, interrupción comercial u otros daños indirectos resultantes del uso de esta herramienta. Por favor, asegúrese de hacer una copia de seguridad antes de procesar archivos extremadamente importantes.',
    t5Title: '5. Contacto',
    t5Desc: 'Si tiene alguna pregunta sobre estos términos, puede contactarnos a través de: shengqiangwang666@gmail.com'
  }
};

locales.forEach(lang => {
  const dir = path.join(localesDir, lang);
  const data = translations[lang];

  // 1. Update common.ts (nav.terms)
  const commonPath = path.join(dir, 'common.ts');
  let commonStr = fs.readFileSync(commonPath, 'utf-8');
  if (!commonStr.includes('terms:')) {
    commonStr = commonStr.replace(/privacy: '(.*?)',/, `privacy: '$1', terms: '${data.navTerms}',`);
    fs.writeFileSync(commonPath, commonStr);
  }

  // 2. Update about.ts (contact section)
  const aboutPath = path.join(dir, 'about.ts');
  let aboutStr = fs.readFileSync(aboutPath, 'utf-8');
  if (!aboutStr.includes('contact:')) {
    aboutStr = aboutStr.replace(/}(\s*)$/, `,\n  contact: { title: '${data.contactTitle}', desc: '${data.contactDesc}' }\n$1`);
    fs.writeFileSync(aboutPath, aboutStr);
  }

  // 3. Create terms.ts
  const termsPath = path.join(dir, 'terms.ts');
  const termsContent = `export default {
  title: '${data.termsTitle}',
  back: '${data.termsBack}',
  intro: '${data.termsIntro}',
  sections: [
    { title: '${data.t1Title}', desc: '${data.t1Desc}' },
    { title: '${data.t2Title}', desc: '${data.t2Desc}' },
    { title: '${data.t3Title}', desc: '${data.t3Desc}' },
    { title: '${data.t4Title}', desc: '${data.t4Desc}' },
    { title: '${data.t5Title}', desc: '${data.t5Desc}' },
  ]
}
`;
  fs.writeFileSync(termsPath, termsContent);

  // 4. Update index.ts to export terms
  const indexPath = path.join(dir, 'index.ts');
  let indexStr = fs.readFileSync(indexPath, 'utf-8');
  if (!indexStr.includes('terms')) {
    indexStr = indexStr.replace(/import about from '\.\/about'/, `import about from './about'\nimport terms from './terms'`);
    indexStr = indexStr.replace(/privacy, about /, 'privacy, about, terms ');
    fs.writeFileSync(indexPath, indexStr);
  }
});

console.log('Locales generated successfully!');
