import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function: /api/send-email
 * Sends emails via Resend API. Keeps RESEND_API_KEY server-side only.
 * 
 * Body: { to: string, subject: string, html: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TREESUN <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Resend API error:', response.status, error);
      return res.status(response.status).json({ error: 'Failed to send email', details: error });
    }

    const data = await response.json();

    // Also send a copy to admin notification email if configured
    if (NOTIFICATION_EMAIL && to !== NOTIFICATION_EMAIL) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TREESUN <onboarding@resend.dev>',
          to: [NOTIFICATION_EMAIL],
          subject: `[Admin Copy] ${subject}`,
          html: `<div style="padding:10px;margin-bottom:10px;background:#fff3cd;border:1px solid #ffc107;border-radius:4px;"><small>Admin copy — Original sent to: ${to}</small></div>${html}`,
        }),
      }).catch((err) => console.error('Admin notification failed:', err));
    }

    return res.status(200).json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
