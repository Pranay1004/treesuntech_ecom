import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Ticket, RefreshCw, ChevronDown, Search,
  CheckCircle2, Truck, Factory, XCircle, Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ScrollReveal from '@/components/shared/ScrollReveal';
import {
  getAllOrders,
  updateOrderStatus,
  getAllTickets,
  updateTicketStatus,
  type Order,
  type OrderStatus,
  type SupportTicket,
} from '@/lib/firestore';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Clock },
  production: { label: 'In Production', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Factory },
  shipped: { label: 'Shipped', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
};

const statusFlow: OrderStatus[] = ['confirmed', 'production', 'shipped', 'delivered'];

export default function AdminDashboard() {
  const { user, isAdminUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'orders' | 'tickets'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    // Check for admin session (development login)
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      // Admin via dev credentials, allow access
      return;
    }
    
    // Otherwise check Firebase auth
    if (!user || !isAdminUser) {
      navigate('/', { replace: true });
      return;
    }
    fetchData();
  }, [user, isAdminUser, authLoading, navigate]);

  async function fetchData() {
    setLoading(true);
    try {
      const [o, t] = await Promise.all([getAllOrders(), getAllTickets()]);
      setOrders(o);
      setTickets(t);
    } catch (err) {
      console.error(err);
      toast('Failed to load data', 'error');
    }
    setLoading(false);
  }

  async function handleStatusUpdate(order: Order, newStatus: OrderStatus) {
    if (!order.id) return;
    setUpdatingId(order.id);
    try {
      await updateOrderStatus(order.id, newStatus, `Status changed to ${newStatus}`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: newStatus } : o
        )
      );
      toast(`Order ${order.orderId} updated to ${newStatus}`, 'success');
    } catch {
      toast('Failed to update status', 'error');
    }
    setUpdatingId(null);
  }

  async function handleTicketStatus(ticket: SupportTicket, status: SupportTicket['status']) {
    if (!ticket.id) return;
    try {
      await updateTicketStatus(ticket.id, status);
      setTickets((prev) =>
        prev.map((t) => (t.id === ticket.id ? { ...t, status } : t))
      );
      toast(`Ticket updated to ${status}`, 'success');
    } catch {
      toast('Failed to update ticket', 'error');
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: orders.length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    production: orders.filter((o) => o.status === 'production').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    revenue: orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
    openTickets: tickets.filter((t) => t.status === 'open').length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-surface-950 pt-24 pb-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 pt-24 pb-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary-400 text-sm font-semibold tracking-[0.2em] uppercase mb-1">
                  Admin Dashboard
                </p>
                <h1 className="text-3xl font-bold font-display text-white">
                  Manage Orders
                </h1>
              </div>
              <button
                onClick={fetchData}
                className="btn-secondary text-sm px-4 py-2.5 inline-flex items-center gap-2"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Total Orders', value: stats.total, color: 'text-white' },
                { label: 'Awaiting Action', value: stats.confirmed, color: 'text-blue-400' },
                { label: 'In Production', value: stats.production, color: 'text-amber-400' },
                { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: 'text-green-400' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Tabs */}
          <ScrollReveal>
            <div className="flex bg-white/[0.03] rounded-xl p-1 mb-6 border border-white/10">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all inline-flex items-center justify-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Package size={14} /> Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all inline-flex items-center justify-center gap-2 ${
                  activeTab === 'tickets'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <Ticket size={14} /> Tickets ({stats.openTickets} open)
              </button>
            </div>
          </ScrollReveal>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <>
              {/* Filters */}
              <ScrollReveal>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by order ID or email..."
                      className="input-field pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                    className="input-field w-auto min-w-[160px]"
                  >
                    <option value="all">All Status</option>
                    {statusFlow.map((s) => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </ScrollReveal>

              {/* Order list */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const cfg = statusConfig[order.status];
                    const StatusIcon = cfg.icon;
                    const isExpanded = expandedOrder === order.id;
                    const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];

                    return (
                      <motion.div
                        key={order.id}
                        layout
                        className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden"
                      >
                        {/* Order header */}
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id!)}
                          className="w-full p-4 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-3">
                            <StatusIcon size={18} className={cfg.color.split(' ')[0]} />
                            <div>
                              <p className="text-white font-mono font-semibold text-sm">{order.orderId}</p>
                              <p className="text-slate-500 text-xs">{order.userEmail}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <span className="text-white font-semibold text-sm">
                              ₹{order.total.toLocaleString('en-IN')}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>

                        {/* Expanded */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-white/5 pt-4">
                                {/* Items */}
                                <div className="mb-4">
                                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Items</p>
                                  {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm py-1">
                                      <span className="text-slate-300">{item.name} &times; {item.quantity}</span>
                                      <span className="text-slate-400">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between text-sm pt-2 border-t border-white/5 mt-2">
                                    <span className="text-slate-400">Subtotal + GST + Shipping</span>
                                    <span className="text-white font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>

                                {/* Shipping address */}
                                <div className="mb-4">
                                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Shipping Address</p>
                                  <div className="text-sm text-slate-300">
                                    <p>{order.shippingAddress?.fullName}</p>
                                    <p>{order.shippingAddress?.line1}{order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ''}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                                    <p className="text-slate-500">{order.shippingAddress?.phone}</p>
                                  </div>
                                </div>

                                {/* Payment & Notes */}
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Payment</p>
                                    <p className="text-slate-300 text-sm capitalize">{order.paymentMethod}</p>
                                  </div>
                                  {order.notes && (
                                    <div>
                                      <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Notes</p>
                                      <p className="text-slate-300 text-sm">{order.notes}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Status history */}
                                {order.statusHistory && order.statusHistory.length > 0 && (
                                  <div className="mb-4">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Status History</p>
                                    <div className="space-y-1">
                                      {order.statusHistory.map((h, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                          <span className="w-2 h-2 rounded-full bg-primary-400" />
                                          <span className="capitalize">{h.status}</span>
                                          <span className="text-slate-600">&middot;</span>
                                          <span>{new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                                  {nextStatus && order.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order, nextStatus)}
                                      disabled={updatingId === order.id}
                                      className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                      {updatingId === order.id ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <StatusIcon size={12} />
                                      )}
                                      Move to {statusConfig[nextStatus].label}
                                    </button>
                                  )}
                                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order, 'cancelled')}
                                      disabled={updatingId === order.id}
                                      className="btn-ghost text-xs px-4 py-2 text-red-400 hover:text-red-300 inline-flex items-center gap-1.5"
                                    >
                                      <XCircle size={12} /> Cancel Order
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No support tickets</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-mono font-semibold text-sm">{ticket.ticketId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                            ticket.status === 'open'
                              ? 'text-amber-400 bg-amber-500/10'
                              : ticket.status === 'in-progress'
                              ? 'text-blue-400 bg-blue-500/10'
                              : 'text-green-400 bg-green-500/10'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm">{ticket.name} ({ticket.userEmail})</p>
                      </div>
                      <span className="text-slate-500 text-xs">{ticket.issueType}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{ticket.message}</p>
                    {ticket.orderId && (
                      <p className="text-slate-500 text-xs mb-2">Order: <span className="text-primary-400 font-mono">{ticket.orderId}</span></p>
                    )}
                    <div className="flex gap-2">
                      {ticket.status !== 'in-progress' && (
                        <button
                          onClick={() => handleTicketStatus(ticket, 'in-progress')}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={() => handleTicketStatus(ticket, 'resolved')}
                          className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
