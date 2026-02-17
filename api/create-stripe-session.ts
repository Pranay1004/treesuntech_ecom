import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless: /api/create-stripe-session
 * Creates a Stripe Checkout Session for international payments.
 * 
 * Body: { items: [{name, price, quantity}], orderId: string, customerEmail: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, orderId, customerEmail, successUrl, cancelUrl } = req.body || {};

  if (!items || !orderId) {
    return res.status(400).json({ error: 'Missing items or orderId' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'inr',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Stripe expects paise
      },
      quantity: item.quantity,
    }));

    // Add GST line item
    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const gst = Math.round(subtotal * 0.18);
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: { name: 'GST (18%)' },
        unit_amount: gst * 100,
      },
      quantity: 1,
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'customer_email': customerEmail || '',
        'metadata[order_id]': orderId,
        'success_url': successUrl || `${req.headers.origin || 'https://treesuntech.com'}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        'cancel_url': cancelUrl || `${req.headers.origin || 'https://treesuntech.com'}/checkout?payment=cancelled`,
        ...Object.fromEntries(
          lineItems.flatMap((item: any, i: number) => [
            [`line_items[${i}][price_data][currency]`, item.price_data.currency],
            [`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name],
            [`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount)],
            [`line_items[${i}][quantity]`, String(item.quantity)],
          ])
        ),
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Stripe session creation failed:', error);
      return res.status(response.status).json({ error: 'Failed to create checkout session', details: error });
    }

    const session = await response.json();
    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
