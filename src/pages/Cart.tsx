import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-slate-500" />
              </div>
              <h1 className="text-3xl font-bold font-display text-white mb-3">Your Cart is Empty</h1>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Browse our catalog and add products you'd like to order.
              </p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Browse Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <ScrollReveal>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-2">Your Cart</h1>
          <p className="text-slate-400 mb-10">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <ScrollReveal key={item.product.id} delay={i * 0.05}>
                <motion.div
                  layout
                  className="flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/10"
                >
                  {/* Image */}
                  <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-xl object-cover bg-surface-900"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="text-white font-semibold hover:text-primary-400 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-slate-500 text-xs mt-1">
                      {item.product.material} &middot; {item.product.finish}
                    </p>
                    <p className="text-primary-400 font-semibold mt-2">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity + Remove */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-medium text-white bg-white/[0.03] min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-slate-500 hover:text-red-400 transition-colors mt-2"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.2}>
              <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-slate-400">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-white">₹{Math.round(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Estimated Total</span>
                    <span className="text-primary-400 font-bold text-lg">
                      ₹{Math.round(totalPrice * 1.18).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/products"
                  className="block text-center text-sm text-slate-400 hover:text-primary-400 transition-colors mt-4"
                >
                  Continue Shopping
                </Link>

                <p className="text-slate-600 text-xs mt-6 text-center">
                  Prices are indicative. Final quote will be confirmed after order review.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
