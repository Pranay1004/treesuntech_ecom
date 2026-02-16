import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart, Search, User, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { products } from '@/lib/data/products';

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
  { name: 'Track Order', path: '/order-tracking' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAdminUser, logout } = useAuth();

  const filteredProducts = searchQuery.length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setServicesOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setUserMenuOpen(false);
  }, [location]);

  // Close search and user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

          {/* Search + Cart + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Search products"
              >
                <Search size={18} />
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 260 }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 overflow-hidden"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }
                      }}
                      placeholder="Search products..."
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-900/95 backdrop-blur-xl border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary-500/50"
                    />
                    {filteredProducts.length > 0 && (
                      <div className="mt-1 rounded-xl bg-surface-900/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-xl">
                        {filteredProducts.map((p) => (
                          <Link
                            key={p.slug}
                            to={`/products/${p.slug}`}
                            className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          >
                            <span className="font-medium">{p.name}</span>
                            <span className="text-slate-500 ml-2 text-xs">₹{p.price.toLocaleString('en-IN')}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            <Link to="/contact" className="btn-primary text-sm px-5 py-2.5 ml-1">
              Get Quote
            </Link>

            {/* User Menu */}
            <div ref={userMenuRef} className="relative ml-1">
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary-500/50 transition-colors"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs font-bold">
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-surface-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-white text-sm font-medium truncate">{user.displayName || 'User'}</p>
                          <p className="text-slate-500 text-xs truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                          <User size={14} /> My Profile
                        </Link>
                        {isAdminUser && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={async () => { await logout(); navigate('/'); setUserMenuOpen(false); }}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 w-full text-left transition-colors"
                        >
                          <LogOut size={14} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Sign in"
                >
                  <User size={18} />
                </Link>
              )}
            </div>
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
                <Link
                  to="/cart"
                  className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                    isActive('/cart')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.05 }}
              >
                <Link to="/contact" className="block w-full text-center btn-primary mt-4">
                  Get Quote
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (navLinks.length + 2) * 0.05 }}
              >
                {user ? (
                  <div className="flex gap-2 mt-2">
                    <Link to="/profile" className="flex-1 text-center btn-secondary text-sm py-2.5">
                      Profile
                    </Link>
                    <button
                      onClick={async () => { await logout(); navigate('/'); }}
                      className="flex-1 text-center text-sm py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="block w-full text-center btn-secondary mt-2 text-sm">
                    Sign In / Register
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
