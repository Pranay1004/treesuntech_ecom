import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Beaker, Thermometer, Gauge, Microscope } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const tests = [
  {
    icon: <Thermometer size={20} />,
    name: 'Heat Deflection Testing',
    desc: 'Determine max operating temperature for ABS, PETG, and Nylon parts.',
  },
  {
    icon: <Gauge size={20} />,
    name: 'Tensile & Impact Testing',
    desc: 'Measure layer adhesion strength and impact resistance for functional parts.',
  },
  {
    icon: <Beaker size={20} />,
    name: 'Chemical Resistance',
    desc: 'Check filament behaviour against solvents, oils, and cleaning agents.',
  },
  {
    icon: <Microscope size={20} />,
    name: 'Dimensional Verification',
    desc: 'Calliper and gauge measurements to verify tolerances on critical features.',
  },
];

export default function MaterialTesting() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Material Testing</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Material Testing
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Choosing the right material matters. We offer material testing and
              comparison services so you can pick the best filament for your
              application, backed by real data.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {tests.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.08}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
                  {t.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{t.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Request Material Testing <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
