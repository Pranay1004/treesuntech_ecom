import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, FileCheck } from 'lucide-react';
import { type Product, products, getTechColor } from '@/lib/data/products';
import { cn } from '@/lib/utils';

interface ProductTabsProps {
  product: Product;
}

const tabs = ['Technical Details', 'Material Properties', 'Certifications', 'Related Products'];

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.technology === product.technology ||
          p.industry.some((ind) => product.industry.includes(ind)))
    )
    .slice(0, 4);

  return (
    <div>
      {/* Tab headers */}
      <div className="flex gap-1 border-b border-white/5 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
              i === activeTab
                ? 'text-primary-400 border-primary-400'
                : 'text-slate-500 border-transparent hover:text-slate-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8">
        {/* Technical Details */}
        {activeTab === 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Specifications</h4>
              <div className="space-y-0 rounded-xl overflow-hidden border border-white/10">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center justify-between px-4 py-3',
                      i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                    )}
                  >
                    <span className="text-slate-400 text-sm">{key}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Applications</h4>
              <ul className="space-y-3">
                {product.applications.map((app) => (
                  <li key={app} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Material Properties */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h4 className="text-white font-semibold mb-4">
                {product.material}: Key Properties
              </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(product.specifications)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-xl p-4">
                      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{key}</p>
                      <p className="text-white font-semibold">{value}</p>
                    </div>
                  ))}
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              Material data is typical for the specified grade and process. Actual properties
              may vary based on build orientation, geometry, and post processing. Contact us
              for certified material datasheets.
            </p>
          </div>
        )}

        {/* Certifications */}
        {activeTab === 2 && (
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: 'ISO 9001:2015', desc: 'Quality Management System certified for consistent manufacturing processes.' },
              { icon: Award, title: 'ISO 13485', desc: 'Medical device quality management for regulated medical applications.' },
              { icon: FileCheck, title: 'AS9100D', desc: 'Aerospace quality standard for safety critical flight components.' },
            ].map((cert) => (
              <div key={cert.title} className="glass-card p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-3">
                  <cert.icon size={22} className="text-primary-400" />
                </div>
                <h5 className="text-white font-semibold mb-2">{cert.title}</h5>
                <p className="text-slate-400 text-sm">{cert.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group glass-card overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getTechColor(p.technology)}`}>
                    {p.technology}
                  </span>
                  <h5 className="text-white text-sm font-semibold mt-2 group-hover:text-primary-400 transition-colors">
                    {p.name}
                  </h5>
                  <p className="text-primary-400 text-sm font-medium mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
