import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/data/products';
import ScrollReveal from '@/components/shared/ScrollReveal';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="section-padding bg-surface-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      <div className="container-custom">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="section-badge">Featured Work</span>
              <h2 className="section-heading mb-0">Best of FDM</h2>
            </div>
            <Link
              to="/products"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 transition-colors group"
            >
              View all products
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.08}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
