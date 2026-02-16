import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Package, Repeat, Settings, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const benefits = [
  'Batch quantities from 10 to 500+ units',
  'Consistent quality across every part',
  'Multicolor runs via AMS (up to 16 colors)',
  'Cost effective for short to medium runs',
  'Flexible scheduling and priority options',
  'Quality inspection on every batch',
];

export default function ProductionRuns() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Production Runs</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Production Runs
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Need more than a prototype? We handle small to medium batch production
              with the same precision. Consistent quality, timely delivery, and
              competitive pricing for repeat orders.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <ScrollReveal>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-6">What You Get</h3>
              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { icon: <Package size={24} />, label: '10–500+', desc: 'Units per batch' },
                { icon: <Repeat size={24} />, label: 'Repeatable', desc: 'Consistent output' },
                { icon: <Settings size={24} />, label: 'AMS', desc: 'Multicolor support' },
                { icon: <TrendingUp size={24} />, label: 'Scalable', desc: 'Grow with demand' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col items-center text-center"
                >
                  <div className="text-primary-400 mb-3">{item.icon}</div>
                  <p className="text-white font-semibold text-lg">{item.label}</p>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Request Batch Quote <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
