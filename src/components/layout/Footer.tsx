import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Youtube, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { name: 'Products', path: '/products' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Support', path: '/support' },
  { name: 'Order Tracking', path: '/order-tracking' },
  { name: 'Refund Policy', path: '/refund-policy' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
  { name: 'Terms of Service', path: '/terms' },
];

const services = [
  { name: 'Rapid Prototyping', path: '/services/rapid-prototyping' },
  { name: 'Production Runs', path: '/services/production-runs' },
  { name: 'Post Processing', path: '/services/post-processing' },
  { name: 'Design Consultation', path: '/services/design-consultation' },
  { name: 'Material Testing', path: '/services/material-testing' },
  { name: 'Quality Assurance', path: '/services/quality-assurance' },
];

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative bg-surface-950 border-t border-white/5">
      {/* Gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg font-display">T</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight font-display leading-none">
                  <span className="text-white">TREE</span>
                  <span className="text-primary-400">SUN</span>
                </span>
                <span className="text-[9px] text-slate-500 tracking-[0.12em] uppercase leading-none mt-0.5">
                  Technical Solutions
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Professional FDM 3D printing services in Mumbai, India. Custom prototypes,
              scale models, and production parts.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/30 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-slate-400 hover:text-primary-400 text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    {service.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Shop No. 18, Gokul Nagari,<br />
                  Rees, Rasayani,<br />
                  Maharashtra 410222
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:treesunonline@outlook.com"
                  className="text-slate-400 text-sm hover:text-primary-400 transition-colors"
                >
                  treesunonline@outlook.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href="tel:+919573988677"
                    className="block text-slate-400 text-sm hover:text-primary-400 transition-colors"
                  >
                    +91 95739 88677 (Jyotikumar)
                  </a>
                  <a
                    href="tel:+919867046342"
                    className="block text-slate-400 text-sm hover:text-primary-400 transition-colors"
                  >
                    +91 98670 46342 (Eshant)
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} TREESUN TECHNICAL SOLUTIONS. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            FDM 3D Printing &middot; Mumbai, India
          </p>
        </div>
      </div>
    </footer>
  );
}
