import { motion } from 'framer-motion';
import { Printer, Paintbrush, ShieldCheck, Lightbulb, Cog, Package } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const capabilities = [
  {
    icon: <Printer size={24} />,
    title: 'FDM 3D Printing',
    description:
      'High quality Fused Deposition Modeling in PLA, ABS, PETG, TPU, Nylon, and specialty filaments. Precision engineered, every layer.',
    highlight: true,
  },
  {
    icon: <Package size={24} />,
    title: 'Rapid Prototyping',
    description:
      'Turn your ideas into tangible prototypes quickly. Perfect for product development, testing, and iteration.',
    highlight: true,
  },
  {
    icon: <Cog size={24} />,
    title: 'Production Runs',
    description:
      'Small to medium batch production with consistent quality. Ideal for custom parts, enclosures, and components.',
    highlight: true,
  },
  {
    icon: <Paintbrush size={24} />,
    title: 'Post Processing',
    description:
      'Sanding, painting, acetone smoothing, and finishing services for a professional look and feel.',
    highlight: true,
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Quality Assurance',
    description:
      'Every print is inspected for dimensional accuracy, layer adhesion, and surface finish before delivery.',
    highlight: true,
  },
  {
    icon: <Lightbulb size={24} />,
    title: 'Design Consultation',
    description:
      'Need help optimising your design for 3D printing? We provide DFM feedback and slicing optimisation.',
    highlight: true,
  },
];

export default function Capabilities() {
  return (
    <section className="section-padding bg-surface-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="section-badge">What We Do</span>
            <h2 className="section-heading">Our Capabilities</h2>
            <p className="section-subheading">
              From concept to finished product, we handle every step of the FDM
              3D printing process with care and precision.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <ScrollReveal key={cap.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 h-full ${
                  cap.highlight
                    ? 'bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/30 hover:border-primary-500/50'
                    : 'bg-white/[0.02] border-white/10 hover:border-primary-500/30 hover:bg-white/[0.04]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    cap.highlight
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'bg-white/5 text-slate-400 group-hover:text-primary-400 group-hover:bg-primary-500/10'
                  } transition-colors duration-300`}
                >
                  {cap.icon}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{cap.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cap.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
