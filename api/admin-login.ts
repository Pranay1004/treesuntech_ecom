import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Vercel Serverless Function: /api/admin-login
 * Validates admin credentials server-side and returns a signed token.
 * 
 * Body: { username: string, password: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Admin credentials not configured in environment');
    return res.status(500).json({ error: 'Admin auth not configured' });
  }

  // Timing-safe comparison
  const usernameMatch =
    username.length === ADMIN_USERNAME.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(ADMIN_USERNAME));

  const passwordMatch =
    password.length === ADMIN_PASSWORD.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));

  if (!usernameMatch || !passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a signed session token
  const secret = ADMIN_PASSWORD + ADMIN_USERNAME + 'treesun-admin';
  const timestamp = Date.now().toString();
  const token = createHmac('sha256', secret)
    .update(`admin-session-${timestamp}`)
    .digest('hex');

  return res.status(200).json({
    success: true,
    token: `${timestamp}.${token}`,
  });
}
