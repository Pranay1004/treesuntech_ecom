import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless: /api/shiprocket
 * Handles Shiprocket operations: create shipment, track, get rates.
 * 
 * Body: { action: 'create' | 'track' | 'rates', ...params }
 */

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials not configured');
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Shiprocket auth failed');
  const data = await res.json();
  
  // Cache token for 9 days (Shiprocket tokens last 10 days)
  cachedToken = { token: data.token, expires: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

async function createShipment(token: string, order: any) {
  const payload = {
    order_id: order.orderId,
    order_date: new Date().toISOString().split('T')[0],
    pickup_location: 'Primary',
    billing_customer_name: order.customerName.split(' ')[0],
    billing_last_name: order.customerName.split(' ').slice(1).join(' ') || '',
    billing_address: order.address,
    billing_city: order.city,
    billing_pincode: order.pincode,
    billing_state: order.state,
    billing_country: 'India',
    billing_email: order.email,
    billing_phone: order.phone,
    shipping_is_billing: true,
    order_items: order.items.map((item: any) => ({
      name: item.name,
      sku: item.productId || item.slug || 'SKU-' + Date.now(),
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: Math.round(item.price * 0.18),
    })),
    payment_method: order.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
    sub_total: order.total,
    length: 20,
    breadth: 15,
    height: 10,
    weight: 0.5,
  };

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Shiprocket create order failed:', err);
    throw new Error(err.message || 'Failed to create shipment');
  }

  return res.json();
}

async function trackShipment(token: string, shipmentId: string) {
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error('Tracking failed');
  return res.json();
}

async function trackByOrderId(token: string, orderId: string) {
  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${encodeURIComponent(orderId)}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error('Tracking failed');
  return res.json();
}

async function getShippingRates(token: string, params: {
  pickup_pincode: string;
  delivery_pincode: string;
  weight: number;
  cod: boolean;
}) {
  const pickupPincode = params.pickup_pincode || process.env.SHIPROCKET_PICKUP_PINCODE || '410222';

  const res = await fetch(
    `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${params.delivery_pincode}&weight=${params.weight}&cod=${params.cod ? 1 : 0}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!res.ok) throw new Error('Rate check failed');
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...params } = req.body || {};

  if (!action) {
    return res.status(400).json({ error: 'Missing action parameter' });
  }

  try {
    const token = await getToken();

    switch (action) {
      case 'create': {
        const result = await createShipment(token, params);
        return res.status(200).json(result);
      }
      case 'track': {
        const result = params.shipmentId
          ? await trackShipment(token, params.shipmentId)
          : await trackByOrderId(token, params.orderId);
        return res.status(200).json(result);
      }
      case 'rates': {
        const result = await getShippingRates(token, params);
        return res.status(200).json(result);
      }
      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }
  } catch (error: any) {
    console.error('Shiprocket API error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
