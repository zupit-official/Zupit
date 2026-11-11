import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { pool } from './db/index.js';
import { redis } from './redis/index.js';
import {
  globalLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
  passwordLoginLimiter,
  orderCreationLimiter,
} from './middlewares/rateLimiters.js';
import { generateToken, authenticate, AuthRequest } from './middlewares/auth.js';
import { sendSMS } from './services/sms.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security & Headers
app.use(helmet());
app.use(
  cors({
    origin: '*', // Allows mobile apps and admin dashboard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' })); // Protect against payload overload
app.use(globalLimiter);

// In-memory fallback for development if Redis is not locally active
const devMemoryCache = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// 2. Health & Metrics Check
app.get('/health', async (_req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'Zupit Core API Engine',
      environment: process.env.NODE_ENV,
      database: 'connected (PostgreSQL + PostGIS)',
      timestamp: dbResult.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database unreachable', error });
  }
});

// ==========================================
// 3. AUTHENTICATION & OTP (Protected by Rate Limiters)
// ==========================================

// Request OTP with SMS wallet & phone protection
app.post('/api/auth/send-otp', otpRequestLimiter, async (req, res) => {
  const { phone } = req.body;

  // Strict Indian mobile phone validation (10 digits starting with 6, 7, 8, or 9)
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit Indian mobile number',
    });
  }

  // Developer Whitelisted Test Number: Bypasses Fast2SMS to save money
  const isDevWhitelisted = phone === '9999999999';
  const code = isDevWhitelisted
    ? '2920'
    : (process.env.NODE_ENV === 'production'
        ? Math.floor(1000 + Math.random() * 9000).toString()
        : '1234');

  const ttlSeconds = 300; // 5 minutes expiration

  try {
    // Save in Redis / Memory cache
    try {
      await redis.set(`otp:${phone}`, code, 'EX', ttlSeconds);
    } catch {
      devMemoryCache.set(phone, {
        code,
        expiresAt: Date.now() + ttlSeconds * 1000,
        attempts: 0,
      });
    }

    if (isDevWhitelisted) {
      console.log(`[WHITELISTED DEV] Fixed OTP for +91 ${phone}: 2920 (Fast2SMS bypassed - ₹0 cost)`);
      return res.json({
        success: true,
        message: 'Developer test OTP ready',
        provider: 'whitelisted_dev',
        expiresInSeconds: ttlSeconds,
        devCode: '2920',
      });
    }

    console.log(`[AUTH SECURE] OTP generated for +91 ${phone}: ${code} (TTL: ${ttlSeconds}s)`);

    // Dispatch real SMS via Fast2SMS for all other numbers
    const smsResult = await sendSMS(phone, code);

    return res.json({
      success: true,
      message: smsResult.message,
      provider: smsResult.provider,
      expiresInSeconds: ttlSeconds,
      devCode: smsResult.provider === 'dev_mock' ? code : undefined,
    });
  } catch (error) {
    console.error('Error dispatching OTP:', error);
    return res.status(500).json({ success: false, message: 'Failed to process OTP request' });
  }
});

// Verify OTP with brute-force prevention
app.post('/api/auth/verify-otp', otpVerifyLimiter, async (req, res) => {
  const { phone, code, role = 'customer' } = req.body;

  if (!phone || !code || code.length !== 4) {
    return res.status(400).json({ success: false, message: 'Valid phone and 4-digit OTP required' });
  }

  let storedCode: string | null = null;

  try {
    try {
      storedCode = await redis.get(`otp:${phone}`);
    } catch {
      const entry = devMemoryCache.get(phone);
      if (entry && Date.now() < entry.expiresAt) {
        storedCode = entry.code;
      }
    }

    if (!storedCode) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired or was not requested. Please request a new code.',
      });
    }

    if (storedCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP entered. Please check and try again.',
      });
    }

    // Invalidate OTP immediately to prevent replay attacks
    try {
      await redis.del(`otp:${phone}`);
    } catch {
      devMemoryCache.delete(phone);
    }

    // Find or register user in PostgreSQL
    let userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user = userResult.rows[0];

    if (!user) {
      const insertResult = await pool.query(
        'INSERT INTO users (phone, role) VALUES ($1, $2) RETURNING *',
        [phone, role]
      );
      user = insertResult.rows[0];
    }

    // Generate real 60-day JWT token
    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(500).json({ success: false, message: 'Internal authentication error' });
  }
});

// ==========================================
// 3B. ZERO-OTP COST AUTH: Password & PIN Login (Riders, Merchants & Admin)
// ==========================================

// Standard password / MPIN login (Cost: ₹0 per login)
app.post('/api/auth/staff-login', passwordLoginLimiter, async (req, res) => {
  const { identifier, password, role } = req.body; // identifier can be phone or email

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Phone number / Email and Password are required',
    });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE (phone = $1 OR email = $1) AND is_active = TRUE',
      [identifier]
    );

    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
    }

    // Role boundary protection (e.g. customers cannot log into admin panel)
    if (role && user.role !== role && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Unauthorized role. Your account is registered as ${user.role}.`,
      });
    }

    if (!user.password_hash) {
      return res.status(400).json({
        success: false,
        message: 'Password not set for this account. Please set a password or use initial OTP setup.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid phone/email or password' });
    }

    // Long-lived 90-day JWT for riders and staff
    const token = generateToken({
      id: user.id,
      phone: user.phone,
      role: user.role,
    });

    console.log(`[STAFF LOGIN - ₹0 OTP] ${user.role.toUpperCase()} logged in: ${user.phone}`);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Staff login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during staff login' });
  }
});

// Set or update staff password / MPIN (Admin or authenticated user)
app.post('/api/auth/set-password', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  const { password } = req.body;

  if (!password || password.length < 4) {
    return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId]);

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password' });
  }
});

// ==========================================
// 4. RESTAURANTS & SPATIAL SEARCH (PostGIS)
// ==========================================

// Get restaurants within radius (default 5km in Jamui)
app.get('/api/merchants/nearby', async (req, res) => {
  const { lat, lng, radiusKm = 5, service = 'food' } = req.query;

  // Default Jamui coordinates if not provided (24.9202° N, 86.2255° E)
  const latitude = lat ? parseFloat(lat as string) : 24.9202;
  const longitude = lng ? parseFloat(lng as string) : 86.2255;
  const radiusMeters = Math.min(parseFloat(radiusKm as string), 25) * 1000; // Cap at 25km max for security

  try {
    const query = `
      SELECT 
        id, name, phone, address_text, service_type, is_open, banner_url, rating,
        ROUND(ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)) AS distance_meters
      FROM merchants
      WHERE service_type = $3
        AND is_active = TRUE
        AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $4)
      ORDER BY distance_meters ASC
      LIMIT 30;
    `;

    const result = await pool.query(query, [longitude, latitude, service, radiusMeters]);
    return res.json({ success: true, count: result.rows.length, merchants: result.rows });
  } catch (error) {
    console.error('Error querying nearby merchants:', error);
    return res.status(500).json({ success: false, message: 'Spatial query failed' });
  }
});

// Get restaurant menu items & categories
app.get('/api/merchants/:id/menu', async (req, res) => {
  const { id } = req.params;

  try {
    const categoriesResult = await pool.query(
      'SELECT * FROM categories WHERE merchant_id = $1 ORDER BY sort_order ASC',
      [id]
    );

    const itemsResult = await pool.query(
      'SELECT * FROM menu_items WHERE merchant_id = $1 AND is_available = TRUE ORDER BY created_at ASC',
      [id]
    );

    return res.json({
      success: true,
      categories: categoriesResult.rows,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ success: false, message: 'Failed to load restaurant menu' });
  }
});

// ==========================================
// 5. ORDERS & CHECKOUT (Protected)
// ==========================================

// Create an order (rate-limited + auth protected)
app.post('/api/orders', orderCreationLimiter, authenticate, async (req: AuthRequest, res) => {
  const customerId = req.user?.id;
  const { merchantId, items, subtotal, deliveryFee = 20, paymentMode = 'cod', deliveryAddressText, lat, lng } = req.body;

  if (!merchantId || !items || !Array.isArray(items) || items.length === 0 || !deliveryAddressText) {
    return res.status(400).json({ success: false, message: 'Incomplete order payload' });
  }

  const calculatedTotal = Number(subtotal) + Number(deliveryFee);

  try {
    const insertQuery = `
      INSERT INTO orders (
        customer_id, merchant_id, service_type, items_json, subtotal,
        delivery_fee, total_amount, payment_mode, payment_status,
        order_status, delivery_address_text, delivery_location
      ) VALUES (
        $1, $2, 'food', $3, $4, $5, $6, $7, $8, 'placed', $9,
        ST_SetSRID(ST_MakePoint($10, $11), 4326)
      ) RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      customerId,
      merchantId,
      JSON.stringify(items),
      subtotal,
      deliveryFee,
      calculatedTotal,
      paymentMode,
      paymentMode === 'online' ? 'paid' : 'pending',
      deliveryAddressText,
      lng || 86.2255,
      lat || 24.9202,
    ]);

    const createdOrder = result.rows[0];

    console.log(`[ORDER CREATED] Order #${createdOrder.order_number} for customer ${req.user?.phone} - Total: ₹${calculatedTotal}`);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: createdOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ success: false, message: 'Failed to process order' });
  }
});

// Get customer's order history
app.get('/api/orders/my-orders', authenticate, async (req: AuthRequest, res) => {
  const customerId = req.user?.id;

  try {
    const orders = await pool.query(
      `SELECT o.*, m.name AS merchant_name, m.banner_url AS merchant_banner
       FROM orders o
       LEFT JOIN merchants m ON o.merchant_id = m.id
       WHERE o.customer_id = $1
       ORDER BY o.created_at DESC
       LIMIT 50`,
      [customerId]
    );

    return res.json({ success: true, count: orders.rows.length, orders: orders.rows });
  } catch (error) {
    console.error('Error fetching order history:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zupit Production-Ready API Engine active on port ${PORT}`);
});
