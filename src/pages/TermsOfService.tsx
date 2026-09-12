import PageSEO from "@/components/PageSEO"
import Navbar from "@/components/Navbar"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PageSEO seoKey="terms" />
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-8">
          Terms of Service
        </h1>
        
        <div className="prose dark:prose-invert max-w-none text-secondary text-[15px] leading-relaxed space-y-6">
          <p><strong>Last Updated: July 2026</strong></p>
          <p>Welcome to SVGDO ("the Website"). By accessing or using our free online SVG editor and related tools, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">1. Description of Service</h3>
            <p>SVGDO provides a suite of browser-based tools for editing, optimizing, and converting Scalable Vector Graphics (SVG). All processing algorithms, DOM manipulations, and image conversions are executed entirely on your local machine (within your browser). We do not provide cloud storage, syncing, or remote rendering services.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">2. User Content and Privacy</h3>
            <p>Your vectors and designs are your own. Because our tool operates exclusively client-side, we do not upload, store, or analyze your SVG files on our servers. You retain all rights and ownership to the content you process using our tools.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">3. Intellectual Property Rights</h3>
            <p>The architecture, proprietary optimization algorithms, UI/UX design, and source code of the Website are the exclusive property of SVGDO. While you are free to use the generated output code for any purpose, you may not reverse engineer, maliciously scrape, or copy our website's structure to create competing services.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">4. Advertising and Third-Party Links</h3>
            <p>To keep this tool free, we use third-party advertising networks (such as Google AdSense). These providers may use cookies to serve ads based on your prior visits. We are not responsible for the content, privacy policies, or practices of any third-party websites or services linked to or advertised on our platform.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">5. Disclaimer of Warranties</h3>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the Service. We do not guarantee that the Service will be uninterrupted, secure, or free of errors.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">6. Limitation of Liability</h3>
            <p>In no event shall SVGDO, its developers, or partners be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary mt-8 mb-4">7. Contact Us</h3>
            <p>If you have any questions or require legal clarification regarding these Terms, please contact our legal and support team at: <a href="mailto:shengqiangwang666@gmail.com" className="text-orange hover:underline font-medium">shengqiangwang666@gmail.com</a></p>
          </div>
        </div>
      </main>
    </div>
  )
}
