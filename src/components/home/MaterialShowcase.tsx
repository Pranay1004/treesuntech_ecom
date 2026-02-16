import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Repeat2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/shared/ScrollReveal';

interface Material {
  name: string;
  tag: string;
  color: string;
  props: string[];
  alsoAvailableIn: string[];
}

const materialData: Material[] = [
  {
    name: 'PLA',
    tag: 'Standard',
    color: 'from-emerald-400 to-emerald-600',
    props: ['High detail', 'Eco friendly', 'Great for models'],
    alsoAvailableIn: ['PLA+', 'Silk PLA', 'PLA-CF'],
  },
  {
    name: 'ABS',
    tag: 'Engineering',
    color: 'from-amber-400 to-orange-500',
    props: ['Heat resistant', 'Durable', 'Acetone smoothable'],
    alsoAvailableIn: ['ASA', 'PETG', 'Nylon PA12'],
  },
  {
    name: 'PETG',
    tag: 'Versatile',
    color: 'from-blue-400 to-cyan-500',
    props: ['Chemical resistant', 'Food safe options', 'Strong & clear'],
    alsoAvailableIn: ['ABS', 'PLA+', 'Nylon PA12'],
  },
  {
    name: 'TPU',
    tag: 'Flexible',
    color: 'from-violet-400 to-purple-500',
    props: ['Elastic & bend proof', 'Grip & shock absorb', 'Shore 95A'],
    alsoAvailableIn: ['Soft TPU', 'PETG', 'Nylon PA12'],
  },
  {
    name: 'Nylon PA12',
    tag: 'Industrial',
    color: 'from-slate-300 to-slate-500',
    props: ['Wear resistant', 'High strength', 'Self lubricating'],
    alsoAvailableIn: ['PLA-CF', 'PETG', 'ABS'],
  },
  {
    name: 'Carbon Fiber',
    tag: 'Specialty',
    color: 'from-gray-400 to-gray-600',
    props: ['Ultra stiff', 'Lightweight', 'Professional grade'],
    alsoAvailableIn: ['Nylon PA12', 'PETG', 'ABS'],
  },
];

export default function MaterialShowcase() {
  const [active, setActive] = useState(0);
  const mat = materialData[active];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />

      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-primary-400 text-xs font-semibold tracking-[0.3em] uppercase block mb-4">
              MATERIALS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white uppercase tracking-tight mb-4">
              One Design, Many Materials
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Your part designed in PETG? We can also produce it in ABS, Nylon, or
              Carbon Fiber. Same geometry, different properties. Pick what works.
            </p>
          </div>
        </ScrollReveal>

        {/* Material selector pills */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {materialData.map((m, i) => (
              <button
                key={m.name}
                onClick={() => setActive(i)}
                className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all duration-300 border ${
                  i === active
                    ? 'bg-white text-surface-950 border-white'
                    : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Active material card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-0 border border-white/10 overflow-hidden">
              {/* Left: material info */}
              <div className="p-8 lg:p-10 bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${mat.color}`} />
                  <span className="text-slate-500 text-xs uppercase tracking-widest">
                    {mat.tag}
                  </span>
                </div>

                <h3 className="text-4xl lg:text-5xl font-extrabold font-display text-white uppercase tracking-tight mb-6">
                  {mat.name}
                </h3>

                <ul className="space-y-3 mb-8">
                  {mat.props.map((p) => (
                    <li key={p} className="flex items-center gap-3">
                      <Check size={14} className="text-primary-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{p}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-primary-400 text-sm font-semibold uppercase tracking-wider group hover:text-primary-300 transition-colors"
                >
                  Request in {mat.name}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              {/* Right: "Also available in" */}
              <div className="p-8 lg:p-10 bg-white/[0.01] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <Repeat2 size={16} className="text-primary-400" />
                  <span className="text-white text-sm font-semibold uppercase tracking-wider">
                    Also available in
                  </span>
                </div>

                <div className="space-y-3">
                  {mat.alsoAvailableIn.map((alt) => {
                    const altMat = materialData.find((m) => m.name === alt);
                    return (
                      <button
                        key={alt}
                        onClick={() => {
                          const idx = materialData.findIndex((m) => m.name === alt);
                          if (idx >= 0) setActive(idx);
                        }}
                        className="w-full flex items-center justify-between px-5 py-4 border border-white/10 bg-white/[0.02] hover:border-primary-500/30 hover:bg-primary-500/5 transition-all duration-300 group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-br ${
                              altMat?.color ?? 'from-slate-400 to-slate-600'
                            }`}
                          />
                          <span className="text-white text-sm font-semibold uppercase tracking-wider">
                            {alt}
                          </span>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-slate-600 text-xs mt-6">
                  Same geometry, different material. Properties and pricing may vary.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
