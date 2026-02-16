import { Link } from 'react-router-dom';
import { Shield, RotateCcw, Truck, Clock, Mail, AlertCircle } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Policy
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              Refund & Exchange Policy
            </h1>
            <p className="text-slate-400 text-lg mb-12">
              Last updated: February 2026
            </p>

            <div className="space-y-8">
              {/* Overview */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <Shield size={18} className="text-primary-400" />
                  Our Commitment
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  At TREESUN TECHNICAL SOLUTIONS, we stand behind the quality of every print.
                  Since most of our products are custom manufactured to your specifications,
                  our policy is designed to be fair to both parties while ensuring you receive
                  exactly what you ordered.
                </p>
              </div>

              {/* When eligible */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <RotateCcw size={18} className="text-primary-400" />
                  When You're Eligible for a Refund or Reprint
                </h2>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li className="flex gap-3">
                    <span className="text-primary-400 font-bold">•</span>
                    <span><strong className="text-white">Defective prints:</strong> Warping, layer separation, missing features, or dimensional inaccuracy beyond stated tolerances.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-400 font-bold">•</span>
                    <span><strong className="text-white">Damaged in transit:</strong> If the package or print arrives damaged due to shipping. Photo evidence required within 24 hours.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-400 font-bold">•</span>
                    <span><strong className="text-white">Wrong item:</strong> If you receive a different product than what you ordered.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary-400 font-bold">•</span>
                    <span><strong className="text-white">Wrong material:</strong> If the print is made in a different material than specified in your order.</span>
                  </li>
                </ul>
              </div>

              {/* Not eligible */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <AlertCircle size={18} className="text-amber-400" />
                  Not Eligible for Refund
                </h2>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-bold">•</span>
                    Change of mind after custom production has started.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-bold">•</span>
                    Minor cosmetic variations inherent to FDM printing (visible layer lines, slight color variation between batches).
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-bold">•</span>
                    Issues caused by incorrect 3D files provided by the customer.
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-400 font-bold">•</span>
                    Products modified or damaged by the customer after delivery.
                  </li>
                </ul>
              </div>

              {/* Process */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-primary-400" />
                  Refund Process
                </h2>
                <ol className="space-y-4 text-slate-400 text-sm">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    Contact us within 48 hours of delivery at <a href="mailto:treesunonline@outlook.com" className="text-primary-400 hover:underline">treesunonline@outlook.com</a> with your Order ID and clear photos.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    Our team reviews your claim within 24 hours.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    If approved, we offer a free reprint or a full refund (your choice).
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    Refunds are processed within 5 to 7 business days to the original payment method.
                  </li>
                </ol>
              </div>

              {/* Shipping */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <Truck size={18} className="text-primary-400" />
                  Shipping for Returns
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  If the return is due to our error (defective, wrong item), we cover all
                  return shipping costs. For other cases, return shipping is at the
                  customer's expense. Please pack items securely to prevent damage during return transit.
                </p>
              </div>

              {/* Contact */}
              <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/20 text-center">
                <Mail size={24} className="mx-auto text-primary-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Need Help?</h3>
                <p className="text-slate-400 text-sm mb-4">
                  For refund inquiries, reach out to us with your Order ID.
                </p>
                <Link to="/contact" className="btn-primary inline-block text-sm">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
