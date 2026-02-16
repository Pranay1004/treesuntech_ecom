import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Layers, Zap, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const benefits = [
  'Concept to part in 24–72 hours',
  'Iterative design refinement',
  'Multiple material options for testing',
  'Accurate dimensional tolerances (±0.2mm)',
  'Functional prototypes you can test immediately',
  'Confidential and secure handling',
];

export default function RapidPrototyping() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Rapid Prototyping</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Rapid Prototyping
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Turn your CAD designs into physical prototypes fast. Our FDM
              printers produce accurate, functional prototypes in PLA, ABS, PETG,
              and engineering grade filaments, often within 24–72 hours.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <ScrollReveal>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10">
              <h3 className="text-white font-semibold text-lg mb-6">Why Choose Us?</h3>
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
                { icon: <Clock size={24} />, label: '24–72 hrs', desc: 'Typical turnaround' },
                { icon: <Layers size={24} />, label: '0.08mm', desc: 'Min layer height' },
                { icon: <Zap size={24} />, label: '15+', desc: 'Filament options' },
                { icon: <CheckCircle2 size={24} />, label: '±0.2mm', desc: 'Accuracy' },
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
              Get a Prototyping Quote <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
