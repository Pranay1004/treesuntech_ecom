import ScrollReveal from '@/components/shared/ScrollReveal';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Legal
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-lg mb-12">Last updated: February 2026</p>

            <div className="prose-custom space-y-8">
              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">1. Information We Collect</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  When you use our website or place an order, we may collect the following information:
                </p>
                <ul className="text-slate-400 text-sm space-y-2 ml-4">
                  <li>• Name, email address, and phone number</li>
                  <li>• Shipping address and pin code</li>
                  <li>• Order details and 3D files you upload</li>
                  <li>• Payment information (processed securely, not stored by us)</li>
                  <li>• Device and browser data for website analytics</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">2. How We Use Your Information</h2>
                <ul className="text-slate-400 text-sm space-y-2 ml-4">
                  <li>• To process and fulfill your orders</li>
                  <li>• To communicate order status and shipping updates</li>
                  <li>• To respond to inquiries and provide customer support</li>
                  <li>• To improve our website and services</li>
                  <li>• To send order confirmations and invoices</li>
                </ul>
                <p className="text-slate-400 text-sm mt-3">
                  We do not sell, rent, or share your personal information with third parties
                  for marketing purposes.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">3. File Uploads</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  3D files uploaded through our platform are stored securely via Uploadcare and
                  are used solely for the purpose of fulfilling your order. Files are retained
                  for 90 days after order completion and then permanently deleted. We do not
                  share or redistribute uploaded designs.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">4. Cookies & Analytics</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our website uses essential cookies to maintain your cart and session.
                  We may use analytics tools to understand website usage patterns. You can
                  disable cookies in your browser settings, though some features may not
                  work correctly.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">5. Data Security</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We implement appropriate technical and organizational measures to protect
                  your personal data against unauthorized access, alteration, or destruction.
                  All data transmission is encrypted via HTTPS.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">6. Your Rights</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You may request access to, correction of, or deletion of your personal data
                  at any time by emailing us at{' '}
                  <a href="mailto:treesunonline@outlook.com" className="text-primary-400 hover:underline">
                    treesunonline@outlook.com
                  </a>. We will respond within 7 business days.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">7. Contact</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  For privacy related questions, contact us at:<br />
                  Email: <a href="mailto:treesunonline@outlook.com" className="text-primary-400 hover:underline">treesunonline@outlook.com</a><br />
                  Phone: +91 95739 88677<br />
                  Address: Shop No. 18, Gokul Nagari, Rees, Rasayani, Maharashtra 410222
                </p>
              </section>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
