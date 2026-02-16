import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  addDoc,
  type Timestamp,
} from 'firebase/firestore';
import { db, ADMIN_EMAIL } from './firebase';
import type { Product } from './data/products';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Address {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  photoURL: string;
  addresses: Address[];
  preferredPayment: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type OrderStatus = 'confirmed' | 'production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  material: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: Address;
  notes: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  statusHistory: { status: OrderStatus; date: string; note: string }[];
}

export interface SupportTicket {
  id?: string;
  ticketId: string;
  userId: string;
  userEmail: string;
  name: string;
  orderId?: string;
  issueType: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: Timestamp | null;
}

/* ------------------------------------------------------------------ */
/*  User helpers                                                       */
/* ------------------------------------------------------------------ */

export async function createOrUpdateUser(uid: string, data: Partial<UserProfile>) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, {
      uid,
      email: data.email || '',
      displayName: data.displayName || '',
      phone: data.phone || '',
      photoURL: data.photoURL || '',
      addresses: [],
      preferredPayment: 'cod',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

/* ------------------------------------------------------------------ */
/*  Order helpers                                                      */
/* ------------------------------------------------------------------ */

function generateOrderId() {
  return 'TS-' + Date.now().toString(36).toUpperCase();
}

export function cartItemsToOrderItems(
  items: { product: Product; quantity: number }[]
): OrderItem[] {
  return items.map((i) => ({
    productId: i.product.slug,
    slug: i.product.slug,
    name: i.product.name,
    material: i.product.material,
    image: i.product.images[0],
    price: i.product.price,
    quantity: i.quantity,
  }));
}

export async function createOrder(
  userId: string,
  userEmail: string,
  items: OrderItem[],
  shippingAddress: Address,
  paymentMethod: string,
  notes: string
): Promise<Order> {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + gst + shipping;
  const orderId = generateOrderId();
  const now = new Date().toISOString();

  const order: Omit<Order, 'id'> = {
    orderId,
    userId,
    userEmail,
    items,
    subtotal,
    gst,
    shipping,
    total,
    status: 'confirmed',
    paymentMethod,
    shippingAddress,
    notes,
    createdAt: null,
    updatedAt: null,
    statusHistory: [{ status: 'confirmed', date: now, note: 'Order placed' }],
  };

  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { ...order, id: ref.id };
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  const q = query(collection(db, 'orders'), where('orderId', '==', orderId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Order;
}

export async function updateOrderStatus(
  docId: string,
  status: OrderStatus,
  note: string = ''
) {
  const ref = doc(db, 'orders', docId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data() as Order;
  const history = data.statusHistory || [];
  history.push({ status, date: new Date().toISOString(), note });
  await updateDoc(ref, {
    status,
    statusHistory: history,
    updatedAt: serverTimestamp(),
  });
}

/* ------------------------------------------------------------------ */
/*  Support ticket helpers                                             */
/* ------------------------------------------------------------------ */

export async function createTicket(
  ticket: Omit<SupportTicket, 'id' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'tickets'), {
    ...ticket,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicket));
}

export async function updateTicketStatus(docId: string, status: SupportTicket['status']) {
  await updateDoc(doc(db, 'tickets', docId), { status });
}

/* ------------------------------------------------------------------ */
/*  Admin check                                                        */
/* ------------------------------------------------------------------ */

export function isAdmin(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
