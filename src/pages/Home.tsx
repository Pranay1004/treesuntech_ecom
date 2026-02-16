import Hero from '@/components/home/Hero';
import Capabilities from '@/components/home/Capabilities';
import MaterialShowcase from '@/components/home/MaterialShowcase';
import TechnologyShowcase from '@/components/home/TechnologyShowcase';
import StatsSection from '@/components/home/StatsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import TrustIndicators from '@/components/home/TrustIndicators';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <Capabilities />
      <MaterialShowcase />
      <FeaturedProducts />
      <TechnologyShowcase />
      <StatsSection />
      <CTASection />
    </>
  );
}
