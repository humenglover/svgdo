const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es'];
const localesDir = path.join(__dirname, '../src/locales');

const comprehensiveTerms = {
  en: {
    title: 'Terms of Service',
    back: 'Back to Home',
    lastUpdated: 'Last Updated: July 2026',
    intro: 'Welcome to SVGDO ("the Website"). By accessing or using our free online SVG editor and related tools, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.',
    sections: [
      { title: '1. Description of Service', desc: 'SVGDO provides a suite of browser-based tools for editing, optimizing, and converting Scalable Vector Graphics (SVG). All processing algorithms, DOM manipulations, and image conversions are executed entirely on your local machine (within your browser). We do not provide cloud storage, syncing, or remote rendering services.' },
      { title: '2. User Content and Privacy', desc: 'Your vectors and designs are your own. Because our tool operates exclusively client-side, we do not upload, store, or analyze your SVG files on our servers. You retain all rights and ownership to the content you process using our tools. Our collection of usage data is strictly limited to non-identifying analytics to improve tool performance, as detailed in our Privacy Policy.' },
      { title: '3. Intellectual Property Rights', desc: 'The architecture, proprietary optimization algorithms, UI/UX design, and source code of the Website are the exclusive property of SVGDO. While you are free to use the generated output code for any purpose, you may not reverse engineer, maliciously scrape, or copy our website\'s structure to create competing or counterfeit services.' },
      { title: '4. Advertising and Third-Party Links', desc: 'To keep this tool free, we use third-party advertising networks (such as Google AdSense). These providers may use cookies to serve ads based on your prior visits. We are not responsible for the content, privacy policies, or practices of any third-party websites or services linked to or advertised on our platform.' },
      { title: '5. Disclaimer of Warranties', desc: 'The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the Service. We do not guarantee that the Service will be uninterrupted, secure, or free of errors.' },
      { title: '6. Limitation of Liability', desc: 'In no event shall SVGDO, its developers, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, resulting from your use of or inability to use the Service.' },
      { title: '7. Governing Law', desc: 'These Terms shall be governed and construed in accordance with standard international copyright and digital service laws, without regard to its conflict of law provisions.' },
      { title: '8. Contact Us', desc: 'If you have any questions or require legal clarification regarding these Terms, please contact our legal and support team at: shengqiangwang666@gmail.com' },
    ]
  },
  zh: {
    title: '服务条款 (Terms of Service)',
    back: '返回首页',
    lastUpdated: '最后更新：2026年7月',
    intro: '欢迎访问 SVGDO（“本网站”）。当您访问或使用我们的免费在线 SVG 编辑器及相关工具时，即表示您同意受本服务条款的约束。如果您不同意本条款的任何部分，请停止使用本服务。',
    sections: [
      { title: '1. 服务说明', desc: 'SVGDO 提供基于浏览器的可缩放矢量图形 (SVG) 编辑、优化和转换工具。所有的算法处理、DOM 操作和图像转换都完全在您的本地机器（浏览器内）执行。我们不提供云存储、同步或远程渲染服务。' },
      { title: '2. 用户内容与隐私', desc: '您的矢量图和设计完全属于您。由于我们的工具完全在客户端运行，我们绝不会将您的 SVG 文件上传、存储或分析到我们的服务器上。您保留使用我们工具处理的内容的所有权利和所有权。正如我们的隐私政策所述，我们仅收集非识别性的分析数据以优化工具性能。' },
      { title: '3. 知识产权', desc: '本网站的架构、专有优化算法、UI/UX 设计和源代码均为 SVGDO 的独家财产。虽然您可以出于任何目的自由使用生成的输出代码，但严禁逆向工程、恶意抓取或复制我们网站的结构以创建竞争或伪造的服务。' },
      { title: '4. 广告与第三方链接', desc: '为了维持本工具的免费运营，我们使用了第三方广告网络（如 Google AdSense）。这些提供商可能会使用 Cookie 根据您之前的访问记录投放广告。我们对我们平台上链接或广告的任何第三方网站的内容、隐私政策或做法不承担任何责任。' },
      { title: '5. 免责声明', desc: '本服务按“原样”和“现有”基础提供。我们不对服务的准确性、可靠性或可用性做出任何明示或暗示的保证。我们不保证服务将是不中断的、绝对安全的或没有错误的。在处理重要的商业资产前，请务必自行备份。' },
      { title: '6. 责任限制', desc: '在任何情况下，SVGDO 及其开发者或合作伙伴均不对因您使用或无法使用本服务而导致的任何间接、偶然、特殊、后果性或惩罚性损害（包括但不限于利润损失、数据丢失或商誉损失）负责。' },
      { title: '7. 适用法律', desc: '本条款受国际标准版权法和数字服务法的管辖和解释，不考虑其法律冲突原则。' },
      { title: '8. 联系我们', desc: '如果您对本条款有任何疑问或需要法律澄清，请通过以下方式联系我们的法律和支持团队：shengqiangwang666@gmail.com' },
    ]
  },
  ja: {
    title: '利用規約',
    back: 'ホームに戻る',
    lastUpdated: '最終更新日：2026年7月',
    intro: 'SVGDO（以下「当サイト」）へようこそ。当社の無料オンラインSVGエディターおよび関連ツールにアクセスまたは使用することにより、お客様は本利用規約に拘束されることに同意するものとします。',
    sections: [
      { title: '1. サービスの説明', desc: 'SVGDOは、SVG（Scalable Vector Graphics）の編集、最適化、変換のためのブラウザベースのツールセットを提供します。すべての処理アルゴリズムはローカルマシン（ブラウザ内）で完全に実行されます。クラウドストレージやリモートレンダリングは提供していません。' },
      { title: '2. ユーザーコンテンツとプライバシー', desc: 'お客様のベクターデータはお客様のものです。当社のツールはクライアントサイドで動作するため、サーバーにお客様のSVGファイルをアップロードしたり保存したりすることはありません。データ収集は、プライバシーポリシーに記載されている通り、匿名のアナリティクスに限定されます。' },
      { title: '3. 知的財産権', desc: '当サイトのアーキテクチャ、最適化アルゴリズム、UIデザインはSVGDOの独占的な財産です。出力されたコードは自由に使用できますが、当社のサイトを悪意を持ってスクレイピングしたり、競合サービスを構築するためにコードをコピーしたりすることは固く禁じられています。' },
      { title: '4. 広告およびサードパーティリンク', desc: 'このツールを無料で提供するため、サードパーティの広告ネットワーク（Google AdSenseなど）を使用しています。これらはCookieを使用する場合があります。当社はサードパーティのウェブサイトのコンテンツやプライバシーポリシーについて責任を負いません。' },
      { title: '5. 免責事項', desc: '本サービスは「現状有姿」で提供されます。当社は、サービスの正確性、信頼性、または可用性についていかなる保証も行いません。エラーや中断がないことを保証するものではありません。' },
      { title: '6. 責任の制限', desc: 'SVGDOは、サービスの使用から生じるデータ損失、利益の損失、またはいかなる間接的損害についても責任を負いません。' },
      { title: '7. 準拠法', desc: '本利用規約は、国際的な著作権およびデジタルサービス法に準拠し解釈されるものとします。' },
      { title: '8. お問い合わせ', desc: '本規約に関するご質問は、shengqiangwang666@gmail.com までお問い合わせください。' },
    ]
  },
  ko: {
    title: '서비스 약관',
    back: '홈으로 돌아가기',
    lastUpdated: '최근 업데이트: 2026년 7월',
    intro: 'SVGDO("본 웹사이트")에 오신 것을 환영합니다. 당사의 무료 온라인 SVG 편집기 및 관련 도구를 사용함으로써 귀하는 본 서비스 약관에 동의하게 됩니다.',
    sections: [
      { title: '1. 서비스 설명', desc: 'SVGDO는 SVG 편집, 최적화 및 변환을 위한 브라우저 기반 도구를 제공합니다. 모든 처리 알고리즘은 로컬 시스템(브라우저 내)에서 전적으로 실행됩니다. 당사는 클라우드 스토리지나 원격 렌더링 서비스를 제공하지 않습니다.' },
      { title: '2. 사용자 콘텐츠 및 개인정보', 소셜: '귀하의 벡터 파일은 귀하의 소유입니다. 당사의 도구는 클라이언트 측에서만 작동하므로 서버에 귀하의 SVG 파일을 업로드하거나 저장하지 않습니다. 데이터 수집은 개인정보 처리방침에 자세히 설명된 대로 익명 분석으로 엄격히 제한됩니다.', desc: '귀하의 벡터 파일은 귀하의 소유입니다. 당사의 도구는 클라이언트 측에서만 작동하므로 서버에 귀하의 SVG 파일을 업로드하거나 저장하지 않습니다. 데이터 수집은 개인정보 처리방침에 자세히 설명된 대로 익명 분석으로 엄격히 제한됩니다.' },
      { title: '3. 지적 재산권', desc: '본 웹사이트의 아키텍처, 독점 최적화 알고리즘, UI/UX 디자인은 SVGDO의 독점 재산입니다. 출력된 코드는 자유롭게 사용할 수 있지만, 웹사이트를 악의적으로 스크랩하거나 복제하여 경쟁 서비스를 구축하는 것은 금지되어 있습니다.' },
      { title: '4. 광고 및 타사 링크', desc: '본 도구를 무료로 유지하기 위해 당사는 타사 광고 네트워크(예: Google AdSense)를 사용합니다. 이러한 제공업체는 귀하의 이전 방문을 기반으로 광고를 제공하기 위해 쿠키를 사용할 수 있습니다.' },
      { title: '5. 면책 조항', desc: '서비스는 "있는 그대로" 제공됩니다. 당사는 서비스의 정확성이나 신뢰성에 대해 명시적이거나 묵시적인 보증을 하지 않습니다. 서비스가 중단되지 않고 오류가 없을 것이라고 보장하지 않습니다.' },
      { title: '6. 책임의 한계', desc: '어떠한 경우에도 SVGDO는 서비스 사용으로 인해 발생하는 데이터 손실, 이익 상실 또는 간접적인 손해에 대해 책임을 지지 않습니다.' },
      { title: '7. 준거법', desc: '본 약관은 국제 표준 저작권 및 디지털 서비스 법률에 따라 규율되고 해석됩니다.' },
      { title: '8. 문의하기', desc: '본 약관과 관련하여 궁금한 점이 있으시면 shengqiangwang666@gmail.com 으로 문의해 주십시오.' },
    ]
  },
  es: {
    title: 'Términos de Servicio',
    back: 'Volver a Inicio',
    lastUpdated: 'Última actualización: Julio 2026',
    intro: 'Bienvenido a SVGDO ("el Sitio Web"). Al acceder o utilizar nuestro editor SVG gratuito y herramientas relacionadas, usted acepta estar sujeto a estos Términos de Servicio.',
    sections: [
      { title: '1. Descripción del Servicio', desc: 'SVGDO proporciona herramientas basadas en el navegador para editar, optimizar y convertir SVG. Todos los algoritmos se ejecutan de forma local en su navegador. No proporcionamos almacenamiento en la nube ni servicios remotos.' },
      { title: '2. Contenido y Privacidad', desc: 'Sus vectores son suyos. Debido a que nuestra herramienta opera exclusivamente en el lado del cliente, nunca subimos o almacenamos sus archivos SVG en nuestros servidores. La recopilación de datos se limita estrictamente a análisis anónimos.' },
      { title: '3. Propiedad Intelectual', desc: 'La arquitectura y algoritmos de este Sitio Web son propiedad exclusiva de SVGDO. Puede usar libremente el código generado, pero no puede extraer o copiar la estructura de nuestro sitio para crear servicios competidores.' },
      { title: '4. Publicidad', desc: 'Para mantener esta herramienta gratuita, utilizamos redes publicitarias de terceros (como Google AdSense). Estos proveedores pueden usar cookies para mostrar anuncios basados en sus visitas anteriores.' },
      { title: '5. Descargo de Responsabilidad', desc: 'El Servicio se proporciona "TAL CUAL". No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores. Siempre haga copias de seguridad de sus archivos importantes.' },
      { title: '6. Limitación de Responsabilidad', desc: 'En ningún caso SVGDO será responsable por pérdida de datos, pérdida de beneficios o cualquier daño indirecto resultante del uso del servicio.' },
      { title: '7. Ley Aplicable', desc: 'Estos Términos se regirán e interpretarán de acuerdo con las leyes internacionales estándar de derechos de autor y servicios digitales.' },
      { title: '8. Contáctenos', desc: 'Si tiene alguna pregunta sobre estos Términos, contáctenos en: shengqiangwang666@gmail.com' },
    ]
  }
};

const comprehensivePrivacy = {
  en: {
    title: 'Privacy Policy',
    back: 'Back to Home',
    lastUpdated: 'Last Updated: July 2026',
    intro: 'At SVGDO, your privacy and data security are our highest priorities. Because our tools are designed to run entirely within your local web browser, we naturally collect far less information than traditional cloud-based platforms. This Privacy Policy outlines what minimal information is collected, how it is used, and your rights.',
    sections: [
      {
        title: '1. Local Processing & File Security',
        subsections: [
          { title: 'Zero Cloud Storage', paragraphs: ['When you upload, edit, or compress an SVG file on our website, the entire process happens within your computer\'s RAM using your browser\'s native capabilities. Your files are never transmitted to, uploaded to, or stored on any remote SVGDO servers.'] },
          { title: 'Confidentiality of Designs', paragraphs: ['Because we cannot access your files, you can safely use our tool for proprietary, confidential, or sensitive commercial assets without fear of data breaches or leaks from our end.'] }
        ]
      },
      {
        title: '2. Information We Do Collect',
        subsections: [
          { title: 'Analytics and Telemetry', paragraphs: ['To understand how our tool is used and to improve its functionality, we collect anonymous, aggregated usage data. This may include metrics such as browser type, device type, general geographic region, and interaction events (e.g., clicking "Optimize" or "Export PNG").'] },
          { title: 'Error Logging', paragraphs: ['If the application crashes or encounters a syntax error, we may automatically log anonymous error reports to help our developers fix bugs. These logs do not contain your SVG data.'] }
        ]
      },
      {
        title: '3. Cookies and Advertising (Google AdSense)',
        subsections: [
          { title: 'Advertising Providers', paragraphs: ['We use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.'] },
          { title: 'DoubleClick Cookie', paragraphs: ['Google, as a third-party vendor, uses cookies to serve ads on our site. Google\'s use of the DoubleClick cookie enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.'] },
          { title: 'Opt-out', paragraphs: ['Users may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting the Google Ads Settings page or the aboutads.info opt-out page.'] }
        ]
      },
      {
        title: '4. GDPR and CCPA Compliance',
        subsections: [
          { title: 'Data Subject Rights', paragraphs: ['If you are a resident of the EEA or California, you have the right to access, correct, or delete any personal data we hold. Since we only hold anonymous analytics data and cookies, you can manage your preferences directly through your browser\'s cookie settings or via the Consent Management Platform (CMP) banner presented upon your first visit.'] }
        ]
      },
      {
        title: '5. Contact Us',
        subsections: [
          { title: '', paragraphs: ['If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at: shengqiangwang666@gmail.com'] }
        ]
      }
    ]
  },
  zh: {
    title: '隐私政策 (Privacy Policy)',
    back: '返回首页',
    lastUpdated: '最后更新：2026年7月',
    intro: '在 SVGDO，您的隐私和数据安全是我们的最高优先级。由于我们的工具被设计为完全在您的本地网络浏览器内运行，我们自然比传统的基于云的平台收集更少的信息。本隐私政策概述了我们收集哪些最少的信息、如何使用这些信息以及您的权利。',
    sections: [
      {
        title: '1. 本地处理与文件安全',
        subsections: [
          { title: '零云端存储', paragraphs: ['当您在我们的网站上上传、编辑或压缩 SVG 文件时，整个过程都利用您浏览器的原生功能在您计算机的内存中进行。您的文件绝不会被传输、上传或存储在任何 SVGDO 的远程服务器上。'] },
          { title: '设计的保密性', paragraphs: ['因为我们无法访问您的文件，您可以安全地使用我们的工具处理专有、机密或敏感的商业资产，而不必担心我们这边发生数据泄露。'] }
        ]
      },
      {
        title: '2. 我们收集的信息',
        subsections: [
          { title: '分析与遥测', paragraphs: ['为了了解我们的工具是如何被使用的并改进其功能，我们收集匿名的、聚合的使用数据。这可能包括浏览器类型、设备类型、大致地理区域以及交互事件（例如，点击“优化”或“导出 PNG”）。'] },
          { title: '错误日志', paragraphs: ['如果应用程序崩溃或遇到语法错误，我们可能会自动记录匿名的错误报告，以帮助我们的开发人员修复错误。这些日志绝不包含您的 SVG 图像数据。'] }
        ]
      },
      {
        title: '3. Cookie 与广告 (Google AdSense)',
        subsections: [
          { title: '广告提供商', paragraphs: ['我们使用第三方广告公司（包括 Google AdSense）在您访问我们的网站时投放广告。这些公司可能会使用有关您访问本网站和其他网站的信息（不包括您的姓名、地址、电子邮件地址或电话号码），以便向您提供您感兴趣的商品和服务的广告。'] },
          { title: 'DoubleClick Cookie', paragraphs: ['Google 作为第三方供应商，使用 Cookie 在我们的网站上投放广告。Google 及其合作伙伴使用 DoubleClick Cookie，可以根据用户对我们网站和/或互联网上其他网站的访问记录为用户投放定向广告。'] },
          { title: '选择退出 (Opt-out)', paragraphs: ['用户可以通过访问 Google 广告设置页面或 aboutads.info 选择退出页面来选择退出将 DoubleClick Cookie 用于基于兴趣的广告。'] }
        ]
      },
      {
        title: '4. GDPR 与 CCPA 合规性',
        subsections: [
          { title: '数据主体权利', paragraphs: ['如果您是欧洲经济区 (EEA) 或加利福尼亚州的居民，您有权访问、更正或删除我们持有的任何个人数据。由于我们只持有匿名的分析数据和 Cookie，您可以直接通过浏览器的 Cookie 设置或通过您首次访问时呈现的同意管理平台 (CMP) 横幅来管理您的偏好。'] }
        ]
      },
      {
        title: '5. 联系我们',
        subsections: [
          { title: '', paragraphs: ['如果您对本隐私政策有任何疑问或疑虑，请通过以下方式联系我们的数据保护专员：shengqiangwang666@gmail.com'] }
        ]
      }
    ]
  },
  ja: {
    title: 'プライバシーポリシー',
    back: 'ホームに戻る',
    lastUpdated: '最終更新日：2026年7月',
    intro: 'SVGDOでは、お客様のプライバシーとデータセキュリティを最優先事項としています。当社のツールはローカルウェブブラウザ内で完全に実行されるように設計されているため、収集する情報は最小限です。',
    sections: [
      {
        title: '1. ローカル処理とファイルのセキュリティ',
        subsections: [
          { title: 'ゼロ・クラウド・ストレージ', paragraphs: ['ファイルのアップロード、編集、最適化のすべてのプロセスは、お使いのコンピューターのRAM内で処理されます。SVGファイルが当社のサーバーに送信されたり、保存されたりすることは決してありません。'] }
        ]
      },
      {
        title: '2. 収集する情報',
        subsections: [
          { title: 'アナリティクスとテレメトリー', paragraphs: ['ツールの利用状況を把握し機能を改善するため、ブラウザの種類やクリックされたボタンなどの匿名の使用データを収集しています。'] }
        ]
      },
      {
        title: '3. Cookie と広告 (Google AdSense)',
        subsections: [
          { title: '広告プロバイダー', paragraphs: ['当社は、Google AdSenseを含むサードパーティの広告会社を使用して、広告を配信しています。これらの会社は、Cookie（DoubleClick Cookieなど）を使用して、ユーザーの興味に基づいた広告を配信する場合があります。'] },
          { title: 'オプトアウト', paragraphs: ['ユーザーは、Googleの広告設定ページにアクセスすることで、パーソナライズ広告に使用されるDoubleClick Cookieを無効にすることができます。'] }
        ]
      },
      {
        title: '4. コンプライアンスと連絡先',
        subsections: [
          { title: 'GDPR / CCPA', paragraphs: ['当社は、GDPRおよびCCPAに準拠したデータ保護を実施しています。ユーザーは、同意バナーまたはブラウザ設定を通じてCookieの設定を管理できます。ご質問がある場合は、shengqiangwang666@gmail.com までご連絡ください。'] }
        ]
      }
    ]
  },
  ko: {
    title: '개인정보 보호정책',
    back: '홈으로 돌아가기',
    lastUpdated: '최근 업데이트: 2026년 7월',
    intro: 'SVGDO는 귀하의 개인정보 및 데이터 보안을 최우선으로 생각합니다. 당사의 도구는 브라우저 내에서 100% 로컬로 실행되므로 최소한의 정보만 수집됩니다.',
    sections: [
      {
        title: '1. 로컬 처리 및 파일 보안',
        subsections: [
          { title: '클라우드 저장 없음', paragraphs: ['파일 업로드, 편집 및 압축 프로세스는 귀하의 컴퓨터 RAM 내에서만 처리됩니다. 당사 서버에는 귀하의 SVG 파일이 전송되거나 저장되지 않습니다.'] }
        ]
      },
      {
        title: '2. 수집하는 정보',
        subsections: [
          { title: '익명 분석', paragraphs: ['서비스 개선을 위해 브라우저 유형, 인터랙션 이벤트 등 익명화된 사용 데이터만 수집합니다.'] }
        ]
      },
      {
        title: '3. 쿠키 및 광고 (Google AdSense)',
        subsections: [
          { title: 'DoubleClick 쿠키', paragraphs: ['당사는 Google AdSense를 사용하여 광고를 게재합니다. Google은 쿠키를 사용하여 사용자의 당사 웹사이트 및 기타 인터넷 사이트 방문을 기반으로 타겟팅 광고를 게재할 수 있습니다.'] }
        ]
      },
      {
        title: '4. 문의하기',
        subsections: [
          { title: '', paragraphs: ['개인정보 보호와 관련하여 궁금한 점이 있으시면 shengqiangwang666@gmail.com 으로 문의해 주십시오.'] }
        ]
      }
    ]
  },
  es: {
    title: 'Política de Privacidad',
    back: 'Volver a Inicio',
    lastUpdated: 'Última actualización: Julio 2026',
    intro: 'En SVGDO, su privacidad y seguridad de datos son nuestra máxima prioridad. Debido a que nuestras herramientas se ejecutan localmente en su navegador, recopilamos mucha menos información que las plataformas en la nube tradicionales.',
    sections: [
      {
        title: '1. Procesamiento Local y Seguridad',
        subsections: [
          { title: 'Cero Almacenamiento en la Nube', paragraphs: ['Todo el proceso de carga, edición y optimización ocurre dentro de la RAM de su computadora. Sus archivos SVG nunca se transmiten ni se almacenan en nuestros servidores.'] }
        ]
      },
      {
        title: '2. Información que Recopilamos',
        subsections: [
          { title: 'Análisis Anónimo', paragraphs: ['Recopilamos datos de uso anónimos (tipo de navegador, eventos de interacción) para mejorar nuestra herramienta y corregir errores.'] }
        ]
      },
      {
        title: '3. Cookies y Publicidad (Google AdSense)',
        subsections: [
          { title: 'Cookie de DoubleClick', paragraphs: ['Utilizamos Google AdSense para mostrar anuncios. Google utiliza cookies de DoubleClick para mostrar anuncios relevantes basados en sus visitas a nuestro sitio y otros sitios en Internet. Puede optar por no participar en la personalización de anuncios en la configuración de Google.'] }
        ]
      },
      {
        title: '4. Contáctenos',
        subsections: [
          { title: '', paragraphs: ['Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos en: shengqiangwang666@gmail.com'] }
        ]
      }
    ]
  }
};

locales.forEach(lang => {
  const dir = path.join(localesDir, lang);
  
  // Update Terms
  const termsPath = path.join(dir, 'terms.ts');
  const termsData = comprehensiveTerms[lang];
  const termsContent = "export default " + JSON.stringify(termsData, null, 2);
  fs.writeFileSync(termsPath, termsContent);

  // Update Privacy
  const privacyPath = path.join(dir, 'privacy.ts');
  const privacyData = comprehensivePrivacy[lang];
  const privacyContent = "export default " + JSON.stringify(privacyData, null, 2);
  fs.writeFileSync(privacyPath, privacyContent);
});

console.log('Comprehensive Legal Policies updated successfully!');
