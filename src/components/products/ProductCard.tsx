import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        className="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors duration-300 hover:border-primary-500/30 h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-900">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Tech badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary-500/90 text-white backdrop-blur-sm">
            {product.technology}
          </span>
          {/* Arrow (hover reveal) */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Starting at</p>
              <p className="text-primary-400 font-bold text-lg font-display">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>
            <span className="text-slate-500 text-xs border border-white/10 rounded-md px-2 py-1">
              {product.material}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
