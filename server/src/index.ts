import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory OTP storage for rapid development / testing (backed by Redis in production)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Health check endpoint
app.get('/health', async (_req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'Zupit Core API',
      timestamp: dbResult.rows[0].now,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database unreachable', error });
  }
});

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length < 10) {
    return res.status(400).json({ success: false, message: 'Valid 10-digit phone number is required' });
  }

  // Generate 4-digit code (Use default test OTP 1234 in development)
  const code = process.env.NODE_ENV === 'development' ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 3 * 60 * 1000; // 3 minutes TTL

  otpStore.set(phone, { code, expiresAt });

  console.log(`[AUTH] OTP for ${phone} is: ${code}`);

  return res.json({
    success: true,
    message: 'OTP sent successfully',
    devCode: process.env.NODE_ENV === 'development' ? code : undefined,
  });
});

// Verify OTP & Login
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, code, role = 'customer' } = req.body;

  const stored = otpStore.get(phone);
  if (!stored) {
    return res.status(400).json({ success: false, message: 'OTP not requested or expired' });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (stored.code !== code) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  otpStore.delete(phone);

  try {
    // Find or create user
    let userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    let user;

    if (userResult.rows.length === 0) {
      const insertResult = await pool.query(
        'INSERT INTO users (phone, role) VALUES ($1, $2) RETURNING *',
        [phone, role]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
    }

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
      token: 'jwt_mock_token_' + user.id, // Will replace with sign JWT
    });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ success: false, message: 'Server database error' });
  }
});

// Nearby Restaurants using PostGIS
app.get('/api/merchants/nearby', async (req, res) => {
  const { lat, lng, radiusKm = 5, service = 'food' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'Latitude and Longitude required' });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const radiusMeters = parseFloat(radiusKm as string) * 1000;

  try {
    const query = `
      SELECT 
        id, name, phone, address_text, service_type, is_open, banner_url, rating,
        ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_meters
      FROM merchants
      WHERE service_type = $3
        AND is_active = TRUE
        AND ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $4)
      ORDER BY distance_meters ASC
      LIMIT 20;
    `;

    const result = await pool.query(query, [longitude, latitude, service, radiusMeters]);
    return res.json({ success: true, count: result.rows.length, merchants: result.rows });
  } catch (error) {
    console.error('Error fetching nearby merchants:', error);
    return res.status(500).json({ success: false, message: 'Spatial query failed', error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zupit Backend running on port ${PORT}`);
});
