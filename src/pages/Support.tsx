import { useState } from 'react';
import { Send, Ticket, Mail, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { useToast } from '@/context/ToastContext';

const issueTypes = [
  'Order Issue',
  'Defective Print',
  'Shipping Delay',
  'Refund Request',
  'Design Help',
  'General Inquiry',
];

export default function Support() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    orderId: '',
    issueType: 'Order Issue',
    message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, POST to backend or email API
    const ticketId = `TK-${Date.now().toString(36).toUpperCase()}`;
    localStorage.setItem(
      'treesun_last_ticket',
      JSON.stringify({ ...form, ticketId, date: new Date().toISOString() })
    );
    toast('Support ticket submitted!', 'success');
    setSubmitted(true);
  }

  if (submitted) {
    const ticket = JSON.parse(localStorage.getItem('treesun_last_ticket') || '{}');
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-lg mx-auto text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h1 className="text-3xl font-bold font-display text-white mb-3">
                Ticket Submitted!
              </h1>
              <p className="text-slate-400 mb-2">
                Your ticket ID is{' '}
                <span className="text-primary-400 font-mono font-semibold">{ticket.ticketId}</span>
              </p>
              <p className="text-slate-500 text-sm mb-8">
                We'll reply to <span className="text-white">{ticket.email}</span> within 24 hours.
              </p>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-left text-sm text-slate-400 space-y-2">
                <p><strong className="text-white">Issue:</strong> {ticket.issueType}</p>
                {ticket.orderId && <p><strong className="text-white">Order ID:</strong> {ticket.orderId}</p>}
                <p><strong className="text-white">Message:</strong> {ticket.message}</p>
              </div>

              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', orderId: '', issueType: 'Order Issue', message: '' }); }}
                className="mt-6 text-sm text-primary-400 hover:underline"
              >
                Submit another ticket
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Support
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              How Can We Help?
            </h1>
            <p className="text-slate-400 text-lg mb-12">
              Submit a support ticket and we'll get back to you within 24 hours via email.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2 mb-2">
                    <Ticket size={18} className="text-primary-400" />
                    Submit a Ticket
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name *" className="input-field" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email Address *" className="input-field" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="orderId" value={form.orderId} onChange={handleChange} placeholder="Order ID (if applicable)" className="input-field" />
                    <select name="issueType" value={form.issueType} onChange={handleChange} className="input-field">
                      {issueTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your issue in detail *"
                    className="input-field w-full"
                  />

                  <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                    <Send size={16} />
                    Submit Ticket
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <ScrollReveal delay={0.1}>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                <Mail size={20} className="text-primary-400 mb-3" />
                <h4 className="text-white font-semibold text-sm mb-1">Email Us Directly</h4>
                <a href="mailto:treesunonline@outlook.com" className="text-primary-400 text-sm hover:underline">
                  treesunonline@outlook.com
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                <Clock size={20} className="text-primary-400 mb-3" />
                <h4 className="text-white font-semibold text-sm mb-1">Response Time</h4>
                <p className="text-slate-400 text-sm">
                  We typically respond within 24 hours during business hours (Mon to Sat, 10 AM to 7 PM IST).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-5 rounded-2xl bg-primary-500/5 border border-primary-500/20">
                <h4 className="text-white font-semibold text-sm mb-2">Common Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/faq" className="text-primary-400 hover:underline">Frequently Asked Questions</a>
                  </li>
                  <li>
                    <a href="/refund-policy" className="text-primary-400 hover:underline">Refund & Exchange Policy</a>
                  </li>
                  <li>
                    <a href="/order-tracking" className="text-primary-400 hover:underline">Track Your Order</a>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
