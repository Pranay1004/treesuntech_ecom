import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless: /api/create-razorpay-order
 * Creates a Razorpay order for checkout.
 * 
 * Body: { amount: number (in paise), orderId: string, customerEmail: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, orderId, customerEmail, customerName, customerPhone } = req.body || {};

  if (!amount || !orderId) {
    return res.status(400).json({ error: 'Missing amount or orderId' });
  }

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    return res.status(500).json({ error: 'Razorpay not configured' });
  }

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64'),
      },
      body: JSON.stringify({
        amount: Math.round(amount), // in paise
        currency: 'INR',
        receipt: orderId,
        notes: {
          order_id: orderId,
          customer_email: customerEmail || '',
          customer_name: customerName || '',
          customer_phone: customerPhone || '',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Razorpay order creation failed:', error);
      return res.status(response.status).json({ error: 'Failed to create payment order', details: error });
    }

    const data = await response.json();
    return res.status(200).json({
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: KEY_ID, // Safe to expose — this is the public key
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
