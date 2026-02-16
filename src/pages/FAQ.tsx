import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const faqCategories = [
  {
    title: 'Ordering & Pricing',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our product catalog, add items to your cart, and proceed to checkout. You can also upload your own 3D model files on the Contact page for a custom quote.',
      },
      {
        q: 'How is pricing determined?',
        a: 'Pricing depends on material, model size, infill percentage, layer height, and finishing requirements. The prices shown on our website are starting prices. We provide a final quote after reviewing your order and files.',
      },
      {
        q: 'Do you offer bulk/volume discounts?',
        a: 'Yes! For orders of 10+ identical parts, we offer volume pricing. Contact us with your requirements and quantity for a custom quote.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), and direct bank transfer (NEFT/IMPS). Online payment gateway integration is coming soon.',
      },
    ],
  },
  {
    title: 'Materials & Printing',
    questions: [
      {
        q: 'What materials do you offer?',
        a: 'We work with PLA, PLA+, ABS, PETG, TPU, Nylon, Carbon Fiber PLA, and specialty filaments. Each material has different properties suited for different applications. Visit our Material Testing service page for details.',
      },
      {
        q: 'What is FDM 3D printing?',
        a: 'FDM (Fused Deposition Modeling) builds parts layer by layer by melting and extruding thermoplastic filament. It is the most affordable and widely used 3D printing technology, ideal for prototypes, functional parts, and models.',
      },
      {
        q: 'What file formats do you accept?',
        a: 'We accept STL, 3MF, OBJ, STEP, and IGES files. 3MF is preferred as it preserves color and material data. Maximum file size is 100 MB.',
      },
      {
        q: 'What is the maximum print size?',
        a: 'Our largest build volume is 256 x 256 x 256mm. For larger models, we can split them into multiple parts and assemble them.',
      },
      {
        q: 'What tolerances can you achieve?',
        a: 'Our standard tolerance is ±0.2mm, with high precision prints achieving ±0.1mm. Tolerance depends on geometry, material, and print settings.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    questions: [
      {
        q: 'What are the lead times?',
        a: 'Standard orders ship within 3 to 7 business days depending on complexity. Simple parts can be ready in 1 to 2 days. Rush orders are available on request.',
      },
      {
        q: 'Do you ship across India?',
        a: 'Yes, we ship to all serviceable pin codes across India via reliable courier partners. Shipping charges are calculated based on weight and destination.',
      },
      {
        q: 'How is shipping calculated?',
        a: 'Shipping cost depends on package weight, dimensions, and delivery location. It will be calculated and shown at checkout. Local pickup from our Rasayani workshop is free.',
      },
      {
        q: 'Can I track my order?',
        a: 'Yes! Once your order is shipped, you will receive a tracking link via email. You can also track your order using your Order ID on our Order Tracking page.',
      },
    ],
  },
  {
    title: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'Since most of our products are custom made, we do not accept returns for change of mind. However, if you receive a defective or damaged item, we will reprint or refund it at no extra cost.',
      },
      {
        q: 'How do I request a refund?',
        a: 'Contact us within 48 hours of receiving your order with photos of the issue. We will assess and process a reprint or refund within 3 to 5 business days.',
      },
      {
        q: 'What if my print arrives damaged?',
        a: 'If your order arrives damaged in transit, send us photos of the packaging and the part within 24 hours. We will reprint and reship at no cost to you.',
      },
    ],
  },
  {
    title: 'Custom & Design',
    questions: [
      {
        q: 'Can you design a part for me?',
        a: 'Yes! Our Design Consultation service includes CAD modeling, DFM feedback, and slicing optimization. Share your idea via our Contact page and we will work with you to bring it to life.',
      },
      {
        q: 'I don\'t have a 3D file. Can you still help?',
        a: 'Absolutely. Send us sketches, photos, or even a description of what you need. Our team can create a 3D model for you (design charges apply).',
      },
      {
        q: 'Do you offer post processing?',
        a: 'Yes, we offer sanding, painting, acetone smoothing, heat set inserts, and more. Check our Post Processing service page for the full list.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-primary-400' : 'text-white'}`}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-primary-400' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              FAQ
            </p>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-400 text-lg mb-12">
              Everything you need to know about our 3D printing services, ordering, and delivery.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto space-y-8">
          {faqCategories.map((cat, ci) => (
            <ScrollReveal key={cat.title} delay={ci * 0.08}>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h2 className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
                  <HelpCircle size={18} className="text-primary-400" />
                  {cat.title}
                </h2>
                {cat.questions.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="max-w-3xl mx-auto mt-12 p-6 rounded-2xl bg-primary-500/5 border border-primary-500/20 text-center">
            <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
            <p className="text-slate-400 text-sm mb-4">
              Can't find what you're looking for? Reach out to our team directly.
            </p>
            <a href="/contact" className="btn-primary inline-block text-sm">
              Contact Us
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
