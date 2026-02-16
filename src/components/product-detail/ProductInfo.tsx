import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, Ruler, Weight, Layers, Package } from 'lucide-react';
import type { Product } from '@/lib/data/products';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const specRows = [
    { icon: <Layers size={14} />, label: 'Technology', value: product.technology },
    { icon: <Package size={14} />, label: 'Material', value: product.material },
    { icon: <Ruler size={14} />, label: 'Dimensions', value: product.dimensions },
    { icon: <Weight size={14} />, label: 'Weight', value: product.weight },
    { icon: <Clock size={14} />, label: 'Lead Time', value: product.leadTime },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/products" className="hover:text-primary-400 transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-300">{product.name}</span>
      </nav>

      {/* Category & tech */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2.5 py-1 text-xs rounded-lg bg-primary-500/10 text-primary-400 font-medium border border-primary-500/20">
          {product.technology}
        </span>
        <span className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/10">
          {product.category}
        </span>
        <span className="px-2.5 py-1 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/10">
          {product.finish}
        </span>
      </div>

      {/* Name */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Description */}
      <p className="text-slate-400 leading-relaxed mb-6">{product.description}</p>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-8">
        <span className="text-3xl font-bold text-primary-400 font-display">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <span className="text-slate-500 text-sm">Starting price</span>
      </div>

      {/* Quick specs */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {specRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/10"
          >
            <span className="text-primary-400">{row.icon}</span>
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">{row.label}</p>
              <p className="text-white text-sm font-medium">{row.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/contact"
          className="btn-primary inline-flex items-center gap-2 flex-1 justify-center"
        >
          <ShoppingCart size={18} />
          Request Quote
        </Link>
      </div>

      {/* Tolerance note */}
      <p className="text-slate-500 text-xs mt-4">
        Tolerance: {product.tolerance} &middot; Final price may vary based on quantity and finishing.
      </p>
    </div>
  );
}
