import ScrollReveal from '@/components/shared/ScrollReveal';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Legal
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              Terms of Service
            </h1>
            <p className="text-slate-400 text-lg mb-12">Last updated: February 2026</p>

            <div className="space-y-8">
              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">1. Acceptance of Terms</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  By using the TREESUN TECHNICAL SOLUTIONS website and placing an order, you
                  agree to these Terms of Service. If you do not agree, please do not use our
                  services.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">2. Products & Services</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We provide FDM 3D printing services including prototyping, production runs,
                  post processing, and design consultation. All products are custom manufactured.
                  Product images on our website are representative. Minor variations in color,
                  texture, and surface finish are inherent to FDM printing and do not constitute
                  defects.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">3. Pricing & Payment</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  Prices shown on our website are starting prices in Indian Rupees (₹) and
                  are subject to change based on order specifics. Final pricing is confirmed
                  after order review. GST (18%) is applicable on all orders. Payment must be
                  completed before or at the time of delivery depending on the chosen payment method.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">4. Order Cancellation</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Orders may be cancelled without charge before production begins. Once
                  printing has started, cancellation may not be possible. In such cases, a
                  partial refund may be issued at our discretion. Contact us immediately if
                  you wish to cancel an order.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">5. Intellectual Property</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  By uploading 3D files, you confirm that you have the right to manufacture
                  the design. We do not claim ownership of your designs. We reserve the right
                  to refuse orders that may infringe on known intellectual property or involve
                  prohibited items (weapons, controlled substances, etc.).
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">6. Liability</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  TREESUN TECHNICAL SOLUTIONS is not liable for any indirect, incidental, or
                  consequential damages arising from the use of our products. Our total
                  liability is limited to the value of the order in question. Printed parts
                  are not certified for load bearing, medical, or safety critical applications
                  unless explicitly agreed.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">7. Governing Law</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  These terms are governed by the laws of India. Any disputes arising from
                  these terms shall be subject to the jurisdiction of the courts in Raigad
                  District, Maharashtra, India.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg mb-3">8. Contact</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  For questions about these terms, contact us at:<br />
                  Email: <a href="mailto:treesunonline@outlook.com" className="text-primary-400 hover:underline">treesunonline@outlook.com</a><br />
                  Phone: +91 95739 88677
                </p>
              </section>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
