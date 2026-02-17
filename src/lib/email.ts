/**
 * Email notification service
 * Sends emails via server-side API route to keep API keys secure
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Email send failed:', error);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false };
  }
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemsHTML = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Order Confirmed!</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Thank you for your order</p>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <p>Hi ${customerName},</p>
        <p>We've received your order and will begin processing it shortly. Here are the details:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> <code style="background: #f0f0f0; padding: 2px 6px;">${orderId}</code></p>
          <p style="margin: 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
              <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
            <tr style="font-weight: bold; background: #f9fafb;">
              <td colspan="2" style="padding: 8px;">Total</td>
              <td style="padding: 8px; text-align: right;">₹${total.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <p>Our team will prepare a final quote and send it to you shortly. You can track your order status anytime using your order ID.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          TREESUN TECHNICAL SOLUTIONS | FDM 3D Printing Services<br>
          Mumbai, India | +91 8451-859-898<br>
          <a href="https://treesuntech.com" style="color: #10b981; text-decoration: none;">treesuntech.com</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmed - ${orderId}`,
    html,
  });
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  status: string,
  message: string
) {
  const statusColors: Record<string, string> = {
    confirmed: '#3b82f6',
    production: '#f59e0b',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const statusColor = statusColors[status] || '#6b7280';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: ${statusColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Order ${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <p>Hi ${customerName},</p>
        <p>${message}</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${statusColor};">
          <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          TREESUN TECHNICAL SOLUTIONS<br>
          <a href="https://treesuntech.com/order-tracking?id=${orderId}" style="color: #10b981; text-decoration: none;">Track your order</a>
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Your order ${orderId} is ${status}`,
    html,
  });
}

/**
 * Send support inquiry confirmation to customer + admin notification
 */
export async function sendSupportTicketEmail(
  customerEmail: string,
  customerName: string,
  ticketId: string,
  issueType: string,
  message: string
) {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">Support Ticket Received</h1>
      </div>
      
      <div style="padding: 20px; background: #f9fafb;">
        <p>Hi ${customerName},</p>
        <p>Thank you for reaching out. We've received your support request and assigned it a ticket ID for reference.</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Ticket ID:</strong> <code style="background: #f0f0f0; padding: 2px 6px;">${ticketId}</code></p>
          <p style="margin: 0 0 10px 0;"><strong>Issue Type:</strong> ${issueType}</p>
          <p style="margin: 0;"><strong>Status:</strong> <span style="color: #3b82f6;">Open - Awaiting Response</span></p>
        </div>
        
        <p>We typically respond within 24 hours during business hours. You can reference your ticket ID in any follow-up communication.</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          TREESUN TECHNICAL SOLUTIONS<br>
          Email: treesunonline@outlook.com<br>
          Hours: Mon-Sat, 10 AM - 7 PM IST
        </p>
      </div>
    </div>
  `;

  // Send to customer
  await sendEmail({
    to: customerEmail,
    subject: `Support Ticket #${ticketId} - We're here to help`,
    html,
  });

  // Notify admin if email configured
  if (adminEmail) {
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2>New Support Ticket</h2>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
        <p><strong>Type:</strong> ${issueType}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9fafb; padding: 10px; border-left: 4px solid #8b5cf6;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `[New Ticket] ${issueType} - ${ticketId}`,
      html: adminHtml,
    });
  }
}
