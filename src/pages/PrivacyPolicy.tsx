import PageSEO from "@/components/PageSEO"
import Navbar from "@/components/Navbar"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PageSEO seoKey="privacy" />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-8">Privacy Policy</h1>

        <div className="prose dark:prose-invert max-w-none text-secondary text-[15px] leading-relaxed space-y-4">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>Welcome to SVGDO ("the Service", "we", "our", or "us"). At SVGDO, user privacy and data security are our top priorities. Because our tools operate using a pure client-side architecture, all image editing, processing, and exporting occur entirely within your local browser memory. This Privacy Policy details how we protect your privacy, what minimal anonymous information we collect, our third-party advertising (Google AdSense) mechanisms, and your legal rights.</p>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">1. Client-Side Local Processing & File Security</h3>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Zero Cloud Upload & Zero Server Retention</h4>
              <p className="mb-2">When you load, edit, convert, or export SVG images and code on our site, the entire operation relies natively on your browser's JavaScript and WebGL/Canvas capabilities in your device's memory. Your SVG files and image assets are never transmitted, uploaded, analyzed, or stored on any external remote servers.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Commercial & Proprietary Asset Protection</h4>
              <p className="mb-2">Because our service is technically incapable of accessing or reading your image data, you can safely process proprietary vector graphics, unreleased design drafts, and trade secrets without concern for server data leaks or unauthorized AI model training.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">2. Information Collection & Usage</h3>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Non-Personally Identifiable Information (Non-PII)</h4>
              <p className="mb-2">To ensure application stability and optimize user experience, we may collect minimal anonymous telemetry data. This may include browser type, device category, language preferences, access timestamps, and aggregated feature usage metrics. This data cannot identify you personally.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Error Logs & Crash Analytics</h4>
              <p className="mb-2">If the application encounters a runtime crash or script exception, your browser may automatically send an anonymous error diagnostic report. These reports contain only execution stack trace information and never contain your SVG content or personal identity data.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">3. Cookies & Google AdSense Advertising Disclosures</h3>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Third-Party Advertising Partners</h4>
              <p className="mb-2">To support free access and ongoing maintenance of our service, we partner with third-party advertising vendors (including Google AdSense). These vendors may use non-personally identifiable information during your visits to this and other websites to serve advertisements for goods and services of interest to you.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Google DoubleClick / DART Cookie Mechanism</h4>
              <p className="mb-2">Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of DoubleClick or DART cookies enables it and its partners to serve personalized ads to users based on their historical visits to our site and/or other sites across the Internet.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Personalized Ads Opt-out Pathways</h4>
              <p className="mb-2">Users may opt out of personalized advertising at any time by visiting Google's official Ads Settings page (https://adssettings.google.com/). You may also opt out of third-party vendor cookies for interest-based advertising by visiting aboutads.info (https://www.aboutads.info) or Your Online Choices (https://www.youronlinechoices.com/).</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">4. Global Privacy Regulations & Data Subject Rights</h3>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">EU GDPR & UK GDPR Privacy Rights</h4>
              <p className="mb-2">If you reside in the European Economic Area (EEA) or the UK, under the GDPR you have rights to access, rectify, export, or request deletion of your personal data. Because we do not collect or store your personal identity data or image files, data modification requests naturally do not apply.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">US California CCPA / CPRA Disclosures</h4>
              <p className="mb-2">If you are a California resident, under the CCPA/CPRA you have the right to know what categories of data are collected and to opt out of the 'sale or sharing' of personal information. We explicitly declare: We never sell or rent any user personal information.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">5. Children's Privacy & Data Retention</h3>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Protection of Minors</h4>
              <p className="mb-2">Our service is not directed to minors or children under the age of 13 under applicable law. We do not knowingly collect personal data from children.</p>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold text-primary mb-2">Data Retention Period</h4>
              <p className="mb-2">Because your SVG files reside exclusively in your browser's temporary RAM, closing or refreshing your browser tab immediately purges the associated image memory. No server-side data retention exists.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-primary mb-4">6. Contact Us</h3>
            <div className="mb-4">
              <p className="mb-2">If you have any questions, comments, or complaints regarding this Privacy Policy, cookie management, or data protection, please contact us via our official support email: <a href="mailto:shengqiangwang666@gmail.com" className="text-orange hover:underline font-medium">shengqiangwang666@gmail.com</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
