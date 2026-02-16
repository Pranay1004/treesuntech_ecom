import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />

      <div className="container-custom relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white mb-4 uppercase tracking-tight">
              Ready to Print?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Upload your 3D model or describe your idea. We'll get back to you
              with a quote within 24 hours. STL, 3MF, OBJ, and STEP files accepted.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-surface-950 font-semibold text-sm uppercase tracking-wider hover:bg-primary-400 transition-colors duration-300"
              >
                <Upload size={16} />
                Upload &amp; Get Quote
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
