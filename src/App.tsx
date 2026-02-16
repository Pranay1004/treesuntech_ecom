import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/shared/ScrollToTop';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

// Pages
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

// Service pages (lazy-loaded)
const RapidPrototyping = lazy(() => import('@/pages/services/RapidPrototyping'));
const ProductionRuns = lazy(() => import('@/pages/services/ProductionRuns'));
const PostProcessing = lazy(() => import('@/pages/services/PostProcessing'));
const DesignConsultation = lazy(() => import('@/pages/services/DesignConsultation'));
const MaterialTesting = lazy(() => import('@/pages/services/MaterialTesting'));
const QualityAssurance = lazy(() => import('@/pages/services/QualityAssurance'));

// E-commerce & info pages (lazy-loaded)
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const RefundPolicy = lazy(() => import('@/pages/RefundPolicy'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const Support = lazy(() => import('@/pages/Support'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-surface-950 text-white">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:slug" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* E-commerce */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-tracking" element={<OrderTracking />} />
                  <Route path="/support" element={<Support />} />

                  {/* Info pages */}
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />

                  {/* Service subpages */}
                  <Route path="/services/rapid-prototyping" element={<RapidPrototyping />} />
                  <Route path="/services/production-runs" element={<ProductionRuns />} />
                  <Route path="/services/post-processing" element={<PostProcessing />} />
                  <Route path="/services/design-consultation" element={<DesignConsultation />} />
                  <Route path="/services/material-testing" element={<MaterialTesting />} />
                  <Route path="/services/quality-assurance" element={<QualityAssurance />} />

                  {/* 404 fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-6xl font-bold font-display text-white mb-4">404</h1>
                          <p className="text-slate-400 mb-6">Page not found</p>
                          <a href="/" className="btn-primary">Go Home</a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
