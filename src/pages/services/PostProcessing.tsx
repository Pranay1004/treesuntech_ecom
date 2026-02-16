import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Paintbrush, Droplets, Sparkles, Wrench } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const techniques = [
  {
    icon: <Paintbrush size={20} />,
    name: 'Sanding & Smoothing',
    desc: 'Remove layer lines for a polished, professional surface finish.',
  },
  {
    icon: <Droplets size={20} />,
    name: 'Painting & Coating',
    desc: 'Primer, spray paint, or brush painting for exact color matching.',
  },
  {
    icon: <Sparkles size={20} />,
    name: 'Acetone Vapour Smoothing',
    desc: 'Smooth ABS parts to a near injection moulded finish.',
  },
  {
    icon: <Wrench size={20} />,
    name: 'Assembly & Insert Fitting',
    desc: 'Heat set threaded inserts, gluing multipart assemblies.',
  },
];

export default function PostProcessing() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-300">Post Processing</span>
          </nav>
          <div className="max-w-3xl">
            <span className="section-badge">Service</span>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Post Processing &amp; Finishing
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              A great print deserves a great finish. Our post processing services
              transform raw FDM parts into polished, production quality pieces.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {techniques.map((t, i) => (
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
              Enquire About Finishing <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
