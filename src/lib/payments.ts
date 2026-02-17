/**
 * Payment integration client
 * Handles Razorpay and Stripe payment flows from the frontend
 */

export type PaymentMethod = 'razorpay' | 'stripe' | 'cod' | 'upi' | 'bank';

interface RazorpayOptions {
  amount: number; // in rupees
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (paymentId: string, razorpayOrderId: string) => void;
  onFailure: (error: string) => void;
}

interface StripeOptions {
  items: Array<{ name: string; price: number; quantity: number }>;
  orderId: string;
  customerEmail: string;
}

/**
 * Load Razorpay checkout SDK dynamically
 */
function loadRazorpaySDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.head.appendChild(script);
  });
}

/**
 * Initiate Razorpay payment
 * Creates order on server, opens Razorpay checkout, verifies payment server-side
 */
export async function payWithRazorpay(options: RazorpayOptions): Promise<void> {
  // In dev mode, simulate payment
  if (import.meta.env.DEV) {
    console.log('[DEV] Razorpay payment simulated for', options.amount);
    // Simulate a short delay
    await new Promise((r) => setTimeout(r, 1000));
    options.onSuccess('pay_dev_' + Date.now(), 'order_dev_' + Date.now());
    return;
  }

  await loadRazorpaySDK();

  // Step 1: Create Razorpay order on server
  const orderRes = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Math.round(options.amount * 100), // convert to paise
      orderId: options.orderId,
      customerEmail: options.customerEmail,
      customerName: options.customerName,
      customerPhone: options.customerPhone,
    }),
  });

  if (!orderRes.ok) {
    const err = await orderRes.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create payment order');
  }

  const { razorpayOrderId, amount, keyId } = await orderRes.json();

  // Step 2: Open Razorpay checkout
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay({
      key: keyId,
      amount,
      currency: 'INR',
      name: 'TREESUN TECHNICAL SOLUTIONS',
      description: `Order ${options.orderId}`,
      order_id: razorpayOrderId,
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      theme: {
        color: '#10b981',
        backdrop_color: 'rgba(0,0,0,0.7)',
      },
      handler: async function (response: any) {
        try {
          // Step 3: Verify payment server-side
          const verifyRes = await fetch('/api/verify-razorpay-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await verifyRes.json();

          if (result.verified) {
            options.onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
            resolve();
          } else {
            options.onFailure('Payment verification failed');
            reject(new Error('Payment verification failed'));
          }
        } catch (err: any) {
          options.onFailure(err.message || 'Verification error');
          reject(err);
        }
      },
      modal: {
        ondismiss: function () {
          options.onFailure('Payment cancelled by user');
          reject(new Error('Payment cancelled'));
        },
      },
    });

    rzp.on('payment.failed', function (response: any) {
      options.onFailure(response.error?.description || 'Payment failed');
      reject(new Error(response.error?.description || 'Payment failed'));
    });

    rzp.open();
  });
}

/**
 * Initiate Stripe Checkout Session (redirect-based)
 */
export async function payWithStripe(options: StripeOptions): Promise<string> {
  // In dev mode, simulate
  if (import.meta.env.DEV) {
    console.log('[DEV] Stripe payment simulated for order', options.orderId);
    return 'stripe_session_dev_' + Date.now();
  }

  const res = await fetch('/api/create-stripe-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: options.items,
      orderId: options.orderId,
      customerEmail: options.customerEmail,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create checkout session');
  }

  const { url } = await res.json();

  // Redirect to Stripe checkout
  window.location.href = url;
  return url;
}

/**
 * Get shipping rates from Shiprocket
 */
export async function getShippingRates(deliveryPincode: string, weight = 0.5, cod = false) {
  if (import.meta.env.DEV) {
    return {
      recommended: { name: 'Standard Delivery', rate: 80, etd: '5-7 days' },
      options: [
        { name: 'Standard Delivery', rate: 80, etd: '5-7 days', courier: 'DTDC' },
        { name: 'Express Delivery', rate: 150, etd: '2-3 days', courier: 'Delhivery' },
      ],
    };
  }

  const res = await fetch('/api/shiprocket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'rates',
      delivery_pincode: deliveryPincode,
      weight,
      cod,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();

  const couriers = data?.data?.available_courier_companies || [];
  const options = couriers.slice(0, 5).map((c: any) => ({
    name: c.courier_name,
    rate: Math.round(c.freight_charge),
    etd: c.etd || 'N/A',
    courier: c.courier_name,
    courierId: c.courier_company_id,
  }));

  return {
    recommended: options[0] || null,
    options,
  };
}

/**
 * Create Shiprocket shipment for an order
 */
export async function createShipment(order: {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ name: string; productId?: string; slug?: string; quantity: number; price: number }>;
  total: number;
  paymentMethod: string;
}) {
  if (import.meta.env.DEV) {
    console.log('[DEV] Shiprocket shipment simulated for', order.orderId);
    return { shipment_id: 'SHIP_DEV_' + Date.now(), status: 'created' };
  }

  const res = await fetch('/api/shiprocket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', ...order }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create shipment');
  }

  return res.json();
}

/**
 * Track shipment via Shiprocket
 */
export async function trackShipment(orderId: string) {
  if (import.meta.env.DEV) {
    return {
      tracking_data: {
        track_status: 1,
        shipment_status: 5,
        shipment_track: [{ current_status: 'In Transit', origin: 'Mumbai', destination: 'Delhi' }],
        shipment_track_activities: [
          { date: new Date().toISOString(), activity: 'Shipment picked up', location: 'Mumbai' },
          { date: new Date(Date.now() - 86400000).toISOString(), activity: 'Order created', location: 'Mumbai' },
        ],
      },
    };
  }

  const res = await fetch('/api/shiprocket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'track', orderId }),
  });

  if (!res.ok) return null;
  return res.json();
}
