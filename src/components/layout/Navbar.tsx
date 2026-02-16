import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  {
    name: 'Services',
    path: '/services',
    children: [
      { name: 'Rapid Prototyping', path: '/services/rapid-prototyping' },
      { name: 'Production Runs', path: '/services/production-runs' },
      { name: 'Post Processing', path: '/services/post-processing' },
      { name: 'Design Consultation', path: '/services/design-consultation' },
      { name: 'Material Testing', path: '/services/material-testing' },
      { name: 'Quality Assurance', path: '/services/quality-assurance' },
    ],
  },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setServicesOpen(false);
  }, [location]);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-surface-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
              <span className="text-white font-bold text-xl font-display">T</span>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight font-display leading-none">
                <span className="text-white">TREE</span>
                <span className="text-primary-400">SUN</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-[0.15em] uppercase leading-none mt-0.5">
                Technical Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 inline-flex items-center gap-1 ${
                      isActive('/services')
                        ? 'text-primary-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-surface-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-3 text-sm transition-colors ${
                              location.pathname === child.path
                                ? 'text-primary-400 bg-primary-500/10'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(link.path) && link.path !== '/services'
                      ? 'text-primary-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/contact" className="btn-primary text-sm px-5 py-2.5">
              Get Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-surface-950/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="container-custom py-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.children ? (
                    <div>
                      <button
                        onClick={() => setServicesOpen(!servicesOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium rounded-xl text-slate-300 hover:bg-white/5"
                      >
                        Services
                        <ChevronDown size={18} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {servicesOpen && (
                        <div className="ml-4 space-y-1 mt-1">
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-4 py-2 text-base rounded-xl transition-colors ${
                                location.pathname === child.path
                                  ? 'text-primary-400 bg-primary-500/10'
                                  : 'text-slate-400 hover:bg-white/5'
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                        isActive(link.path)
                          ? 'text-primary-400 bg-primary-500/10'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
              >
                <Link to="/contact" className="block w-full text-center btn-primary mt-4">
                  Get Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
