import { ShieldCheck, Truck, Clock, HeadphonesIcon } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const indicators = [
  {
    icon: <ShieldCheck size={20} />,
    title: 'Quality Guaranteed',
    desc: 'Every print inspected for accuracy and finish',
  },
  {
    icon: <Truck size={20} />,
    title: 'Pan India Shipping',
    desc: 'Reliable delivery across India via trusted couriers',
  },
  {
    icon: <Clock size={20} />,
    title: 'Fast Turnaround',
    desc: 'Most orders printed and shipped within 3–5 business days',
  },
  {
    icon: <HeadphonesIcon size={20} />,
    title: 'Dedicated Support',
    desc: 'Talk directly to our team for quotes and design help',
  },
];

export default function TrustIndicators() {
  return (
    <section className="py-16 relative">
      <div className="container-custom">
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {indicators.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
