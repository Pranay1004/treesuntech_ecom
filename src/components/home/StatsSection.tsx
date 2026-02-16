import ScrollReveal from '@/components/shared/ScrollReveal';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import { Printer, Users, Package, Star } from 'lucide-react';

const stats = [
  { icon: <Printer size={24} />, value: 500, suffix: '+', label: 'Parts Printed' },
  { icon: <Users size={24} />, value: 80, suffix: '+', label: 'Happy Clients' },
  { icon: <Package size={24} />, value: 15, suffix: '+', label: 'Materials Available' },
  { icon: <Star size={24} />, value: 98, suffix: '%', label: 'Quality Rate' },
];

export default function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-accent-500/5" />
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-display text-white mb-1">
                  <AnimatedCounter target={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
