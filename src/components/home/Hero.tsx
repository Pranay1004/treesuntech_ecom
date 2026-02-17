import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─── floating ring — pure CSS animation to reduce JS overhead ─── */
function FloatingRing({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) {
  return (
    <div
      className="absolute pointer-events-none animate-fade-in"
      style={{ left: x, top: y, animationDelay: `${delay}s` }}
    >
      <div
        className="rounded-full border border-white/[0.06] animate-spin-slow"
        style={{ width: size, height: size, animationDuration: `${40 + delay * 10}s` }}
      />
    </div>
  );
}

/* ─── materials for ticker ─── */
const materials = [
  'PLA', 'ABS', 'PETG', 'TPU', 'NYLON PA12',
  'CARBON FIBER', 'SILK PLA', 'PLA+', 'FOOD SAFE PETG',
  'PLA', 'ABS', 'PETG', 'TPU', 'NYLON PA12',
  'CARBON FIBER', 'SILK PLA', 'PLA+', 'FOOD SAFE PETG',
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0">
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary-500/[0.04] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/[0.03] rounded-full blur-[120px]" />

        {/* Rings */}
        <FloatingRing size={600} x="60%" y="10%" delay={0} />
        <FloatingRing size={400} x="70%" y="30%" delay={0.3} />
        <FloatingRing size={220} x="75%" y="55%" delay={0.6} />
        <FloatingRing size={140} x="55%" y="65%" delay={0.9} />

        {/* Vertical accent */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
          className="absolute right-[12%] top-[15%] w-px h-[50vh] bg-gradient-to-b from-transparent via-primary-500/20 to-transparent origin-top hidden lg:block"
        />
      </div>

      {/* ── Content ── */}
      <div className="container-custom relative z-10 pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Tag */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-primary-400 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase mb-8"
        >
          3D Printing &middot; Mumbai, India
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] mb-8"
        >
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-[8.5rem] text-white">
            WE PRINT
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-[8.5rem] text-gradient">
            THE FUTURE
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-slate-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-12"
        >
          From rapid prototypes to production ready parts, high quality
          FDM printing in 15+ materials. Affordable, precise, and built
          for Indian businesses.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="flex flex-wrap gap-4 mb-20"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-surface-950 font-semibold text-sm uppercase tracking-wider hover:bg-primary-400 transition-colors duration-300"
          >
            Get a Quote
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            Explore
          </Link>
        </motion.div>
      </div>

      {/* ── Material ticker — CSS animation for performance ── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-surface-950/80 backdrop-blur-sm">
        <div className="overflow-hidden py-4">
          <div className="flex gap-8 whitespace-nowrap animate-ticker">
            {materials.map((m, i) => (
              <span
                key={i}
                className="text-slate-600 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase flex items-center gap-3"
              >
                <span className="w-1 h-1 rounded-full bg-primary-500/40" />
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
