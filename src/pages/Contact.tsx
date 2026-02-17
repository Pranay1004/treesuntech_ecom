import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';
import Uploader from '@/components/shared/Uploader';
import { sendEmail } from '@/lib/email';

const contactInfo = [
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'treesunonline@outlook.com',
    href: 'mailto:treesunonline@outlook.com',
  },
  {
    icon: <Phone size={20} />,
    label: 'Jyotikumar',
    value: '+91 95739 88677',
    href: 'tel:+919573988677',
  },
  {
    icon: <Phone size={20} />,
    label: 'Eshant',
    value: '+91 98670 46342',
    href: 'tel:+919867046342',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Workshop',
    value: 'Shop No. 18, Gokul Nagari, Rees, Rasayani, MH 410222',
    href: 'https://www.google.com/maps/search/Shop+No.+18+Gokul+Nagari+Rees+Rasayani+Maharashtra+410222',
  },
  {
    icon: <Clock size={20} />,
    label: 'Hours',
    value: 'Mon – Sat, 10 AM – 7 PM IST',
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'testkeysw@gmail.com';

    const filesSection = uploadedUrls.length > 0
      ? `<div style="margin-top:15px;"><strong>Attached Files:</strong><ul>${uploadedUrls.map(u => `<li><a href="${u}">${u}</a></li>`).join('')}</ul></div>`
      : '';

    // Send email to admin with customer inquiry
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">New Contact Inquiry</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">From ${form.name}</p>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px;font-weight:bold;width:100px;">Name</td><td style="padding:8px;">${form.name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${form.email}">${form.email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;"><a href="tel:${form.phone}">${form.phone || 'Not provided'}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${form.subject || 'General Inquiry'}</td></tr>
          </table>
          <div style="margin-top:15px;background:white;padding:15px;border-radius:8px;border-left:4px solid #10b981;">
            <strong>Message:</strong>
            <p style="white-space:pre-wrap;">${form.message}</p>
          </div>
          ${filesSection}
        </div>
      </div>
    `;

    // Send confirmation to customer
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">We've received your message!</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${form.name},</p>
          <p>Thank you for contacting TREESUN Technical Solutions. We've received your inquiry and will get back to you within 24 hours.</p>
          <div style="background:white;padding:15px;border-radius:8px;margin:15px 0;">
            <p style="margin:0 0 5px;"><strong>Subject:</strong> ${form.subject || 'General Inquiry'}</p>
            <p style="margin:0;"><strong>Your message:</strong></p>
            <p style="color:#666;white-space:pre-wrap;">${form.message}</p>
          </div>
          <p style="color:#666;font-size:12px;margin-top:20px;">
            TREESUN TECHNICAL SOLUTIONS<br>
            Email: treesunonline@outlook.com<br>
            Hours: Mon-Sat, 10 AM - 7 PM IST
          </p>
        </div>
      </div>
    `;

    try {
      // Send to admin
      const result = await sendEmail({
        to: adminEmail,
        subject: `[New Inquiry] ${form.subject || 'Contact Form'} - from ${form.name}`,
        html: adminHtml,
      });

      // Send confirmation to customer
      await sendEmail({
        to: form.email,
        subject: `We've received your message - TREESUN`,
        html: customerHtml,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError('Failed to send message. Please try emailing us directly at treesunonline@outlook.com');
      }
    } catch {
      setError('Network error. Please try emailing us directly at treesunonline@outlook.com');
    }

    setSending(false);
  }

  function handleUpload(url: string) {
    setUploadedUrls((prev) => [...prev, url]);
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        {/* Header */}
        <ScrollReveal>
          <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Contact
          </p>
          <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 max-w-2xl leading-tight">
            Let's Bring Your Ideas to Life
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mb-12">
            Upload your 3D files, tell us what you need, and we'll get back to you
            with a quote within 24 hours.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* -----  Form (3 cols)  ----- */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-10 rounded-2xl bg-primary-500/10 border border-primary-500/30 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-4">
                    <Send size={24} />
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    We've received your enquiry. Our team will review your files and
                    get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 p-8 rounded-2xl bg-white/[0.02] border border-white/10"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5">Name *</label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5">Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1.5">Service</label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option value="rapid-prototyping">Rapid Prototyping</option>
                        <option value="production-runs">Production Runs</option>
                        <option value="post-processing">Post Processing</option>
                        <option value="design-consultation">Design Consultation</option>
                        <option value="material-testing">Material Testing</option>
                        <option value="quality-assurance">Quality Assurance</option>
                        <option value="custom-order">Custom Order</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                      placeholder="Describe your project: material preference, quantity, dimensions, finish…"
                    />
                  </div>

                  {/* Uploadcare uploader */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">
                      Upload 3D Files{' '}
                      <span className="text-slate-500">(STL, 3MF, OBJ, STEP)</span>
                    </label>
                    <Uploader onUpload={handleUpload} />
                    {uploadedUrls.length > 0 && (
                      <p className="text-primary-400 text-xs mt-2">
                        {uploadedUrls.length} file(s) uploaded
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Enquiry
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </ScrollReveal>
          </div>

          {/* -----  Sidebar (2 cols)  ----- */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.08}>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white text-sm hover:text-primary-400 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}

            {/* Accepted files note */}
            <ScrollReveal delay={0.5}>
              <div className="p-5 rounded-xl bg-primary-500/5 border border-primary-500/20">
                <h4 className="text-white text-sm font-semibold mb-2">Accepted File Formats</h4>
                <div className="flex flex-wrap gap-2">
                  {['.STL', '.3MF', '.OBJ', '.STEP', '.IGES', '.CAD'].map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-1 text-xs rounded bg-white/5 text-primary-400 border border-primary-500/20"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  Max file size: 100 MB. Multiple files supported.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
