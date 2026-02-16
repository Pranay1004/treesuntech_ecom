import { motion } from 'framer-motion';
import {
  Users,
  Printer,
  Rocket,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import AnimatedCounter from '@/components/shared/AnimatedCounter';

/* ----------  team  ---------- */
const team = [
  {
    name: 'Mr. Jyotikumar',
    role: 'Founder & Managing Director',
    phone: '+91 95739 88677',
    bio: 'Jyotikumar leads TREESUN TECHNICAL SOLUTIONS with a sharp focus on quality manufacturing and customer first service. With a hands on approach to every project, he ensures each print meets exacting standards before it ships.',
  },
  {
    name: 'Mr. Eshant Shinde',
    role: 'Cofounder & Partner',
    phone: '+91 98670 46342',
    bio: 'Eshant brings deep knowledge of FDM technology and design for manufacturing principles. He manages technical operations, slicer optimisation, and material R&D, keeping TREESUN at the forefront of desktop manufacturing.',
  },
];

/* ----------  timeline  ---------- */
const milestones = [
  {
    year: '2023',
    title: 'The Beginning',
    desc: 'Started with a single FDM printer in a small workshop in Rasayani, Maharashtra.',
  },
  {
    year: '2023',
    title: 'First 50 Orders',
    desc: 'Delivered prototypes and models to local businesses and hobbyists across Mumbai.',
  },
  {
    year: '2024',
    title: 'Scaling Up',
    desc: 'Expanded material library to 15+ filaments and added multicolor AMS capabilities.',
  },
  {
    year: '2024',
    title: 'Online Presence',
    desc: 'Launched TREESUN TECHNICAL SOLUTIONS online, serving clients across India.',
  },
];

/* ----------  stats  ---------- */
const stats = [
  { value: 500, suffix: '+', label: 'Parts Delivered' },
  { value: 80, suffix: '+', label: 'Clients Served' },
  { value: 15, suffix: '+', label: 'Materials' },
  { value: 98, suffix: '%', label: 'Timely Delivery' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      {/* -------- Hero -------- */}
      <section className="container-custom mb-20">
        <ScrollReveal>
          <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            About Us
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-6 leading-tight max-w-2xl">
            We Build Ideas,<br />
            Layer by Layer
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            TREESUN TECHNICAL SOLUTIONS is a professional FDM 3D printing
            service based in Rasayani, near Mumbai. We specialise in rapid
            prototyping, scale models, functional parts, and small batch
            production, engineered layer by layer.
          </p>
        </ScrollReveal>
      </section>

      {/* -------- Stats -------- */}
      <section className="py-14 border-y border-white/5 mb-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold font-display text-white mb-1">
                    <AnimatedCounter target={s.value} />
                    {s.suffix}
                  </p>
                  <p className="text-slate-400 text-sm">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------- Team -------- */}
      <section className="container-custom mb-20">
        <ScrollReveal>
          <span className="section-badge">The Team</span>
          <h2 className="section-heading">Meet the Founders</h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary-500/30 transition-all duration-300"
              >
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center text-primary-400 border border-primary-500/20 mb-5">
                  <Users size={28} />
                </div>
                <h3 className="text-white text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-400 text-sm font-medium mb-4">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{member.bio}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Phone size={14} className="text-primary-400/60" />
                  <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="hover:text-primary-400 transition-colors">
                    {member.phone}
                  </a>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* -------- Timeline -------- */}
      <section className="container-custom mb-20">
        <ScrollReveal>
          <span className="section-badge">Our Journey</span>
          <h2 className="section-heading">Timeline</h2>
        </ScrollReveal>

        <div className="relative mt-12 max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.title} delay={i * 0.12}>
                <div className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-[9px] top-1 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-surface-950" />
                  <span className="text-primary-400 text-xs font-semibold tracking-wider uppercase">
                    {m.year}
                  </span>
                  <h4 className="text-white font-semibold text-lg mt-1 mb-1">{m.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------- Location -------- */}
      <section className="container-custom">
        <ScrollReveal>
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-primary-400" />
                Our Workshop
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Shop No. 18, Gokul Nagari,<br />
                Rees, Rasayani,<br />
                Maharashtra 410222
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-slate-400 text-sm">
                  <Mail size={14} className="text-primary-400/60" />
                  <a href="mailto:treesunonline@outlook.com" className="hover:text-primary-400 transition-colors">
                    treesunonline@outlook.com
                  </a>
                </p>
                <p className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone size={14} className="text-primary-400/60" />
                  <a href="tel:+919573988677" className="hover:text-primary-400 transition-colors">
                    +91 95739 88677
                  </a>
                </p>
              </div>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden min-h-[200px] bg-surface-900">
              <iframe
                title="TREESUN Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.0844!2d73.1551!3d18.8606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be5f5d5f5d5f5d5%3A0x0!2sShop%20No.%2018%2C%20Gokul%20Nagari%2C%20Rees%2C%20Rasayani%2C%20Maharashtra%20410222!5e0!3m2!1sen!2sin!4v1739703600000"
                className="w-full h-full min-h-[240px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
