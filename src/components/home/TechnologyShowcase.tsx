import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const materials = [
  {
    category: 'Standard',
    items: [
      { name: 'PLA', desc: 'Great detail, eco friendly, ideal for models and prototypes' },
      { name: 'PLA+', desc: 'Enhanced toughness over regular PLA' },
      { name: 'ABS', desc: 'Heat resistant, durable, great for functional parts' },
    ],
  },
  {
    category: 'Engineering',
    items: [
      { name: 'PETG', desc: 'Chemical resistant, food safe options available' },
      { name: 'TPU', desc: 'Flexible & elastic for gaskets, grips, and protective gear' },
      { name: 'Nylon PA12', desc: 'High strength, wear resistant, industrial grade' },
    ],
  },
  {
    category: 'Specialty',
    items: [
      { name: 'Carbon Fiber PLA', desc: 'Lightweight with excellent stiffness' },
      { name: 'Food Safe PETG', desc: 'Certified food contact materials' },
      { name: 'Silk PLA', desc: 'Glossy metallic finish for display models' },
    ],
  },
];

const specs = [
  { label: 'Layer Height', value: '0.08–0.32 mm' },
  { label: 'Nozzle Size', value: '0.2 / 0.4 / 0.6 mm' },
  { label: 'Max Build Volume', value: '256 × 256 × 256 mm' },
  { label: 'Positional Accuracy', value: '± 0.1 mm' },
  { label: 'Multicolor', value: 'Up to 16 colors (AMS)' },
  { label: 'Infill Range', value: '10%–100%' },
];

export default function TechnologyShowcase() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="section-badge">Technology</span>
            <h2 className="section-heading">Advanced FDM Printing</h2>
            <p className="section-subheading">
              State of the art desktop manufacturing with Automatic Material
              System for precise, fast, and multicolor FDM printing.
            </p>
          </div>
        </ScrollReveal>

        {/* Materials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {materials.map((group, gi) => (
            <ScrollReveal key={group.category} delay={gi * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-full">
                <h3 className="text-white font-semibold text-lg mb-1">{group.category}</h3>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-5">Filaments</p>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary-400" />
                      </span>
                      <div>
                        <span className="text-white text-sm font-medium">{item.name}</span>
                        <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Specs bar */}
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {specs.map((spec) => (
              <motion.div
                key={spec.label}
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-center"
              >
                <p className="text-primary-400 font-semibold text-sm mb-1">{spec.value}</p>
                <p className="text-slate-500 text-xs">{spec.label}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
