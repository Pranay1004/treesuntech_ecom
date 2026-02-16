import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Package, Clock, LogOut,
  Plus, Trash2, Check, Edit3, Shield,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ScrollReveal from '@/components/shared/ScrollReveal';
import {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  type UserProfile,
  type Address,
  type Order,
} from '@/lib/firestore';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Chandigarh',
  'Jammu & Kashmir','Ladakh','Puducherry',
];

const statusColors: Record<string, string> = {
  confirmed: 'text-blue-400 bg-blue-500/10',
  production: 'text-amber-400 bg-amber-500/10',
  shipped: 'text-purple-400 bg-purple-500/10',
  delivered: 'text-green-400 bg-green-500/10',
  cancelled: 'text-red-400 bg-red-500/10',
};

function emptyAddress(): Address {
  return {
    label: 'Home',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    isDefault: false,
  };
}

export default function Profile() {
  const { user, logout, isAdminUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [loading, setLoading] = useState(true);

  // Editable profile fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  // Address editing
  const [editingAddr, setEditingAddr] = useState<number | 'new' | null>(null);
  const [addrForm, setAddrForm] = useState<Address>(emptyAddress());

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    (async () => {
      const [p, o] = await Promise.all([
        getUserProfile(user.uid),
        getUserOrders(user.uid),
      ]);
      if (p) {
        setProfile(p);
        setEditName(p.displayName);
        setEditPhone(p.phone);
      }
      setOrders(o);
      setLoading(false);
    })();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleSaveProfile() {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, { displayName: editName, phone: editPhone });
      setProfile((prev) => prev ? { ...prev, displayName: editName, phone: editPhone } : prev);
      setEditingProfile(false);
      toast('Profile updated!', 'success');
    } catch {
      toast('Failed to update profile', 'error');
    }
  }

  async function handleSaveAddress() {
    if (!user || !profile) return;
    let addresses = [...(profile.addresses || [])];
    if (addrForm.isDefault) {
      addresses = addresses.map((a) => ({ ...a, isDefault: false }));
    }
    if (editingAddr === 'new') {
      if (addresses.length === 0) addrForm.isDefault = true;
      addresses.push(addrForm);
    } else if (typeof editingAddr === 'number') {
      addresses[editingAddr] = addrForm;
    }
    try {
      await updateUserProfile(user.uid, { addresses });
      setProfile((prev) => prev ? { ...prev, addresses } : prev);
      setEditingAddr(null);
      toast('Address saved!', 'success');
    } catch {
      toast('Failed to save address', 'error');
    }
  }

  async function handleDeleteAddress(idx: number) {
    if (!user || !profile) return;
    const addresses = profile.addresses.filter((_, i) => i !== idx);
    if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    try {
      await updateUserProfile(user.uid, { addresses });
      setProfile((prev) => prev ? { ...prev, addresses } : prev);
      toast('Address removed', 'info');
    } catch {
      toast('Failed to remove address', 'error');
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
    toast('Logged out', 'info');
  }

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { key: 'orders' as const, label: 'Orders', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-14 h-14 rounded-full border-2 border-primary-500/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-xl font-bold">
                    {(profile?.displayName || user?.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold font-display text-white">
                    {profile?.displayName || 'Your Profile'}
                  </h1>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdminUser && (
                  <Link to="/admin" className="btn-outline text-sm px-4 py-2 inline-flex items-center gap-2">
                    <Shield size={14} /> Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-ghost text-sm px-4 py-2 inline-flex items-center gap-2 text-red-400 hover:text-red-300">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6 border border-white/10">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all inline-flex items-center justify-center gap-2 ${
                    activeTab === t.key
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <t.icon size={14} />
                  {t.label}
                  {t.key === 'orders' && orders.length > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-primary-500/30 text-primary-400 text-[10px] flex items-center justify-center font-semibold">
                      {orders.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <ScrollReveal>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Personal Information</h3>
                  <button
                    onClick={() => setEditingProfile(!editingProfile)}
                    className="text-sm text-primary-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Edit3 size={12} />
                    {editingProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Full Name</label>
                      <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1.5">Phone</label>
                      <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="input-field" />
                    </div>
                    <button onClick={handleSaveProfile} className="btn-primary text-sm px-6 py-2.5 inline-flex items-center gap-2">
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                      <User size={16} className="text-primary-400" />
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Name</p>
                        <p className="text-white text-sm">{profile?.displayName || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                      <Mail size={16} className="text-primary-400" />
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Email</p>
                        <p className="text-white text-sm">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                      <Phone size={16} className="text-primary-400" />
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Phone</p>
                        <p className="text-white text-sm">{profile?.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                      <Clock size={16} className="text-primary-400" />
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider">Member Since</p>
                        <p className="text-white text-sm">
                          {profile?.createdAt
                            ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <ScrollReveal>
              <div className="space-y-4">
                {(profile?.addresses || []).map((addr, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded-full font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm">{addr.fullName}</p>
                        <p className="text-slate-400 text-sm">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                        <p className="text-slate-400 text-sm">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-slate-500 text-sm">{addr.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingAddr(idx); setAddrForm(addr); }}
                          className="text-sm text-slate-400 hover:text-primary-400"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(idx)}
                          className="text-sm text-slate-400 hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {editingAddr !== null ? (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <h4 className="text-white font-semibold text-sm">
                      {editingAddr === 'new' ? 'Add Address' : 'Edit Address'}
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <select
                        value={addrForm.label}
                        onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                        className="input-field"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                      <input value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} placeholder="Full Name" className="input-field" />
                      <input value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} placeholder="Phone" className="input-field" />
                      <input value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} placeholder="Pincode" className="input-field" />
                    </div>
                    <input value={addrForm.line1} onChange={(e) => setAddrForm({ ...addrForm, line1: e.target.value })} placeholder="Address Line 1" className="input-field" />
                    <input value={addrForm.line2 || ''} onChange={(e) => setAddrForm({ ...addrForm, line2: e.target.value })} placeholder="Address Line 2 (optional)" className="input-field" />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} placeholder="City" className="input-field" />
                      <select value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="input-field">
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addrForm.isDefault}
                        onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                        className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500/30"
                      />
                      Set as default address
                    </label>
                    <div className="flex gap-3">
                      <button onClick={handleSaveAddress} className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2">
                        <Check size={14} /> Save
                      </button>
                      <button onClick={() => setEditingAddr(null)} className="btn-ghost text-sm px-5 py-2.5">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditingAddr('new'); setAddrForm(emptyAddress()); }}
                    className="w-full p-4 rounded-2xl border-2 border-dashed border-white/10 text-slate-400 hover:border-primary-500/30 hover:text-primary-400 transition-all inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <ScrollReveal>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={48} className="mx-auto text-slate-600 mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">No orders yet</h3>
                  <p className="text-slate-400 text-sm mb-6">Your order history will appear here.</p>
                  <Link to="/products" className="btn-primary text-sm px-6 py-2.5">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold font-mono text-sm">{order.orderId}</p>
                          <p className="text-slate-500 text-xs">
                            {order.createdAt
                              ? new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                })
                              : 'Recently'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status] || 'text-slate-400 bg-white/5'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{item.name} &times; {item.quantity}</span>
                            <span className="text-slate-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-white font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                        <Link
                          to={`/order-tracking?id=${order.orderId}`}
                          className="text-sm text-primary-400 hover:underline"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}
