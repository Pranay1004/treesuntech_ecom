import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ScrollReveal from '@/components/shared/ScrollReveal';
import type { ConfirmationResult } from 'firebase/auth';

type Tab = 'login' | 'register' | 'phone' | 'admin';

export default function Login() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle, sendPhoneOTP, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const [tab, setTab] = useState<Tab>('login');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Phone form
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);

  // Admin form
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminShowPw, setAdminShowPw] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate(from, { replace: true });
    return null;
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (tab === 'login') {
        await loginWithEmail(email, password);
        toast('Welcome back!', 'success');
      } else {
        await registerWithEmail(email, password, name);
        toast('Account created successfully!', 'success');
      }
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''), 'error');
    }
    setBusy(false);
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      await loginWithGoogle();
      toast('Signed in with Google!', 'success');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast(msg.replace('Firebase: ', ''), 'error');
    }
    setBusy(false);
  }

  async function handleSendOTP(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = await sendPhoneOTP(formatted);
      setConfirmResult(result);
      toast('OTP sent to your phone!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast(msg.replace('Firebase: ', ''), 'error');
    }
    setBusy(false);
  }

  async function handleVerifyOTP(e: FormEvent) {
    e.preventDefault();
    if (!confirmResult) return;
    setBusy(true);
    try {
      await confirmResult.confirm(otp);
      toast('Phone verified!', 'success');
      navigate(from, { replace: true });
    } catch {
      toast('Invalid OTP. Please try again.', 'error');
    }
    setBusy(false);
  }

  async function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin') {
      localStorage.setItem(
        'admin_session',
        JSON.stringify({ role: 'admin', loginTime: new Date().toISOString() })
      );
      toast('Admin logged in successfully!', 'success');
      navigate('/admin', { replace: true });
    } else {
      toast('Invalid admin credentials', 'error');
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'login', label: 'Sign In' },
    { key: 'register', label: 'Register' },
    { key: 'phone', label: 'Phone' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20 flex items-center justify-center">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-md mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-display">T</span>
              </div>
              <span className="text-lg font-bold font-display">
                <span className="text-white">TREE</span>
                <span className="text-primary-400">SUN</span>
              </span>
            </Link>

            {/* Tabs */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6 border border-white/10">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    tab === t.key
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Google SSO */}
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 transition-all mb-4 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <AnimatePresence mode="wait">
              {/* Email Login / Register */}
              {(tab === 'login' || tab === 'register') && (
                <motion.form
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleEmail}
                  className="space-y-4"
                >
                  {tab === 'register' && (
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="input-field pl-10"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      minLength={6}
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {busy ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {/* Phone Login */}
              {tab === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {!confirmResult ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Mobile Number"
                          required
                          maxLength={10}
                          className="input-field pl-[4.5rem]"
                        />
                      </div>
                      <p className="text-slate-500 text-xs">
                        Phone auth is limited to 10 verifications per day on the free tier.
                      </p>
                      <button
                        type="submit"
                        disabled={busy || phone.length < 10}
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {busy ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Send OTP</>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <p className="text-sm text-slate-400">
                        OTP sent to +91 {phone}
                      </p>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit OTP"
                        required
                        maxLength={6}
                        className="input-field text-center text-xl tracking-[0.4em] font-mono"
                      />
                      <button
                        type="submit"
                        disabled={busy || otp.length < 6}
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {busy ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>Verify & Sign In</>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setConfirmResult(null); setOtp(''); }}
                        className="text-sm text-slate-400 hover:text-white w-full text-center"
                      >
                        Change number
                      </button>
                    </form>
                  )}
                </motion.div>
              )}

              {/* Admin Login */}
              {tab === 'admin' && (
                <motion.form
                  key="admin"
                  onSubmit={handleAdminLogin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-3 mb-4">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center flex-shrink-0 font-bold">!</div>
                    <p className="text-amber-200 text-sm">Development only: Use <span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">admin</span></p>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-medium">Username</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={adminUser}
                        onChange={(e) => setAdminUser(e.target.value)}
                        placeholder="admin"
                        className="input-field w-full pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2 font-medium">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={adminShowPw ? 'text' : 'password'}
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        placeholder="•••••••"
                        className="input-field w-full pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setAdminShowPw(!adminShowPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400"
                      >
                        {adminShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {busy ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Login as Admin <ArrowRight size={16} /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="text-center text-slate-500 text-xs mt-6">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-primary-400 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy-policy" className="text-primary-400 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
