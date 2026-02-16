import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, Clock, CheckCircle2, Truck, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/shared/ScrollReveal';

const statusSteps = [
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { key: 'production', label: 'In Production', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [searched, setSearched] = useState(!!initialId);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const stored = localStorage.getItem('treesun_last_order');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.orderId === orderId.trim()) {
        setOrder(parsed);
        setSearched(true);
        return;
      }
    }
    setOrder(null);
    setSearched(true);
  }

  // Load on initial render if ID from URL
  if (initialId && !order && !searched) {
    const stored = localStorage.getItem('treesun_last_order');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.orderId === initialId) {
        setOrder(parsed);
      }
    }
    setSearched(true);
  }

  const currentStatus = (order as Record<string, string>)?.status || 'confirmed';
  const statusIndex = statusSteps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto">
            <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
              Track Order
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
              Order Tracking
            </h1>
            <p className="text-slate-400 mb-8">
              Enter your order ID to check the current status of your order.
            </p>

            {/* Search form */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-12">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter Order ID (e.g. TS-M3XKAB)"
                  className="input-field w-full pl-11"
                  required
                />
              </div>
              <button type="submit" className="btn-primary px-6">
                Track
              </button>
            </form>

            {/* Result */}
            {searched && !order && (
              <div className="text-center py-12">
                <Clock size={40} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">
                  No order found with ID <span className="text-white font-mono">{orderId}</span>.
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  Please check the order ID and try again, or{' '}
                  <Link to="/contact" className="text-primary-400 hover:underline">
                    contact support
                  </Link>.
                </p>
              </div>
            )}

            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Status bar */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Order ID</p>
                      <p className="text-white font-mono font-semibold text-lg">
                        {(order as Record<string, string>).orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs uppercase tracking-wider">Date</p>
                      <p className="text-white text-sm">
                        {new Date((order as Record<string, string>).date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="relative">
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10" />
                    <div
                      className="absolute top-5 left-5 h-0.5 bg-primary-400 transition-all duration-500"
                      style={{ width: `${(statusIndex / (statusSteps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 40px)' }}
                    />
                    <div className="relative flex justify-between">
                      {statusSteps.map((s, i) => {
                        const isComplete = i <= statusIndex;
                        const isCurrent = i === statusIndex;
                        return (
                          <div key={s.key} className="flex flex-col items-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isComplete
                                  ? 'bg-primary-500/20 text-primary-400 border-2 border-primary-500/50'
                                  : 'bg-surface-900 text-slate-600 border-2 border-white/10'
                              } ${isCurrent ? 'ring-4 ring-primary-500/20' : ''}`}
                            >
                              <s.icon size={18} />
                            </div>
                            <p
                              className={`text-xs mt-2 ${
                                isComplete ? 'text-primary-400 font-medium' : 'text-slate-600'
                              }`}
                            >
                              {s.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="text-white font-semibold mb-4">Order Items</h3>
                  {((order as Record<string, Array<{ product: { id: string; name: string; price: number; images: string[] }; quantity: number }>>).items || []).map(
                    (item) => (
                      <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-surface-900"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.product.name}</p>
                          <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )
                  )}
                  <div className="flex justify-between pt-4 mt-2 border-t border-white/10">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-primary-400 font-bold">
                      ₹{((order as Record<string, number>).total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
