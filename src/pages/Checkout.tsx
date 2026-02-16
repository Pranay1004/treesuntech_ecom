import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, CheckCircle2, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import ScrollReveal from '@/components/shared/ScrollReveal';
import {
  createOrder,
  cartItemsToOrderItems,
  getUserProfile,
  type Address,
} from '@/lib/firestore';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details');
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    notes: '',
    payment: 'cod',
  });

  // Pre-fill from user profile
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    (async () => {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        const defaultAddr = profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];
        setForm((prev) => ({
          ...prev,
          name: profile.displayName || prev.name,
          email: profile.email || user.email || prev.email,
          phone: profile.phone || prev.phone,
          ...(defaultAddr ? {
            address: defaultAddr.line1 + (defaultAddr.line2 ? `, ${defaultAddr.line2}` : ''),
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode,
          } : {}),
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          email: user.email || prev.email,
          name: user.displayName || prev.name,
        }));
      }
    })();
  }, [user, navigate]);

  const gst = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + gst;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep('confirm');
  }

  async function placeOrder() {
    if (!user) return;
    setBusy(true);
    try {
      const shippingAddress: Address = {
        label: 'Shipping',
        fullName: form.name,
        phone: form.phone,
        line1: form.address,
        line2: '',
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        isDefault: false,
      };
      const order = await createOrder(
        user.uid,
        user.email || form.email,
        cartItemsToOrderItems(items),
        shippingAddress,
        form.payment,
        form.notes
      );
      setPlacedOrderId(order.orderId);
      clearCart();
      toast('Order placed successfully!', 'success');
      setStep('success');
    } catch (err: any) {
      toast(err.message || 'Failed to place order', 'error');
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20">
        <div className="container-custom text-center py-20">
          <Package size={48} className="mx-auto text-slate-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Nothing to checkout</h1>
          <Link to="/products" className="btn-primary inline-block mt-4">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="max-w-lg mx-auto text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 mx-auto rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h1 className="text-3xl font-bold font-display text-white mb-3">
                Order Confirmed!
              </h1>
              <p className="text-slate-400 mb-2">
                Your order ID is{' '}
                <span className="text-primary-400 font-mono font-semibold">
                  {placedOrderId}
                </span>
              </p>
              <p className="text-slate-500 text-sm mb-8">
                We've received your order and will send you a confirmation email
                with the final quote shortly.
              </p>

              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 text-left mb-8">
                <h3 className="text-white font-semibold text-sm mb-3">What happens next?</h3>
                <ol className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    Our team reviews your order and confirms the final price.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    We begin production once you confirm the quote.
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    Your order is shipped within the estimated lead time.
                  </li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={`/order-tracking?id=${placedOrderId}`} className="btn-primary inline-flex items-center gap-2">
                  Track Order
                </Link>
                <Link to="/products" className="px-5 py-2.5 text-sm text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                  Continue Shopping
                </Link>
              </div>
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
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-10">Checkout</h1>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form / Confirm */}
          <div className="lg:col-span-2">
            {step === 'details' && (
              <ScrollReveal>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <Truck size={18} className="text-primary-400" />
                      Shipping Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name *" className="input-field" />
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email *" className="input-field" />
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="Phone Number *" className="input-field" />
                      <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pin Code *" className="input-field" />
                      <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Full Address *" rows={2} className="input-field sm:col-span-2" />
                      <input name="city" value={form.city} onChange={handleChange} required placeholder="City *" className="input-field" />
                      <select name="state" value={form.state} onChange={handleChange} className="input-field">
                        {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                      <CreditCard size={18} className="text-primary-400" />
                      Payment Method
                    </h3>
                    <div className="space-y-3">
                      {[
                        { value: 'cod', label: 'Cash on Delivery (COD)', desc: 'Pay when you receive the order' },
                        { value: 'upi', label: 'UPI / Google Pay / PhonePe', desc: 'Pay via UPI after order confirmation' },
                        { value: 'bank', label: 'Bank Transfer (NEFT/IMPS)', desc: 'Details sent via email after order' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            form.payment === opt.value
                              ? 'border-primary-500/50 bg-primary-500/5'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={opt.value}
                            checked={form.payment === opt.value}
                            onChange={handleChange}
                            className="mt-1 accent-emerald-500"
                          />
                          <div>
                            <p className="text-white text-sm font-medium">{opt.label}</p>
                            <p className="text-slate-500 text-xs">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h3 className="text-white font-semibold mb-3">Order Notes (Optional)</h3>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any special instructions, material preferences, finishing notes..."
                      className="input-field w-full"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full text-center">
                    Review Order
                  </button>
                </form>
              </ScrollReveal>
            )}

            {step === 'confirm' && (
              <ScrollReveal>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h3 className="text-white font-semibold mb-4">Order Review</h3>
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover bg-surface-900" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                          <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white text-sm font-medium">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h3 className="text-white font-semibold mb-3">Shipping To</h3>
                    <p className="text-slate-400 text-sm">
                      {form.name}<br />
                      {form.address}, {form.city}<br />
                      {form.state} {form.pincode}<br />
                      {form.phone} &middot; {form.email}
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      Payment: {form.payment === 'cod' ? 'Cash on Delivery' : form.payment === 'upi' ? 'UPI' : 'Bank Transfer'}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('details')}
                      className="flex-1 px-5 py-3 text-sm border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={busy}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {busy ? 'Placing…' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <ScrollReveal delay={0.15}>
              <div className="sticky top-28 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-slate-400 truncate mr-3">
                        {item.product.name} &times; {item.quantity}
                      </span>
                      <span className="text-white flex-shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">GST (18%)</span>
                    <span className="text-white">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Shipping</span>
                    <span className="text-slate-400">TBD</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-primary-400 font-bold text-lg">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
