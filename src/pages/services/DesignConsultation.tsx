import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lightbulb, PenTool, Box, FileCheck } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const offerings = [
  {
    icon: <Lightbulb size={20} />,
    name: 'Design for Manufacturing (DFM)',
    desc: 'We review your CAD models and suggest modifications for optimal printability, strength, and cost.',
  },
  {
    icon: <PenTool size={20} />,
    name: 'CAD Modifications',
    desc: 'Need small tweaks to your design? We can add fillets, bosses, or modify wall thicknesses.',
  },
  {
    icon: <Box size={20} />,
    name: 'Material Selection',
    desc: 'Not sure which filament? We help you pick the right material for your application, whether you need strength, flexibility, or heat resistance.',
  },
  {
    icon: <FileCheck size={20} />,
    name: 'Print Orientation & Support Strategy',
    desc: 'We optimise slicing settings including orientation, supports, and infill for the best quality to cost ratio.',
  },
];

export default function DesignConsultation() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Design Consultation</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Design Consultation
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Not every 3D model is print ready. Our design team helps you optimise
              your files for FDM, reducing cost, improving strength, and ensuring
              a clean print every time.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {offerings.map((o, i) => (
            <ScrollReveal key={o.name} delay={i * 0.08}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
                  {o.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{o.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{o.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Book a Consultation <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
