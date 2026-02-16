import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Eye, Ruler, ShieldCheck, ClipboardCheck } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const steps = [
  {
    icon: <Eye size={20} />,
    name: 'Visual Inspection',
    desc: 'Every part checked for warping, stringing, layer shifts, and surface defects.',
  },
  {
    icon: <Ruler size={20} />,
    name: 'Dimensional Check',
    desc: 'Critical dimensions verified against the original CAD model with callipers.',
  },
  {
    icon: <ShieldCheck size={20} />,
    name: 'Structural Integrity',
    desc: 'Layer adhesion and infill consistency checked for functional reliability.',
  },
  {
    icon: <ClipboardCheck size={20} />,
    name: 'Documentation',
    desc: 'Quality report provided on request with photos, measurements, and notes.',
  },
];

export default function QualityAssurance() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Quality Assurance</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Quality Assurance
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Quality isn't optional, it's standard. Every print that leaves our
              workshop goes through a multistep QA process to ensure it meets
              your specifications.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {steps.map((s, i) => (
            <ScrollReveal key={s.name} delay={i * 0.08}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{s.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
