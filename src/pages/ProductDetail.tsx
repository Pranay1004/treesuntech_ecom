import { useParams, Navigate } from 'react-router-dom';
import { getProductBySlug } from '@/lib/data/products';
import ImageGallery from '@/components/product-detail/ImageGallery';
import ProductInfo from '@/components/product-detail/ProductInfo';
import ProductTabs from '@/components/product-detail/ProductTabs';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
            {/* Left: Gallery */}
            <div>
              <ImageGallery images={product.images} name={product.name} />
            </div>

            {/* Right: Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={0.2}>
          <ProductTabs product={product} />
        </ScrollReveal>
      </div>
    </div>
  );
}
