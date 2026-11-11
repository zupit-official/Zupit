import rateLimit from 'express-rate-limit';

// Global API rate limiter (protects server from DDoS and scraping)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

// Strict OTP Request Limiter (Protects Fast2SMS wallet from depletion)
// Max 3 OTP requests per 10 minutes per IP
export const otpRequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 10 minutes before requesting again.',
  },
});

// Strict OTP Verification Limiter (Prevents brute-force 4-digit code guessing)
// Max 5 attempts per 5 minutes
export const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many incorrect verification attempts. Account locked for 5 minutes.',
  },
});

// Password Login Limiter (Admin, Merchant & Rider Staff)
export const passwordLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// Order Creation Limiter (Prevents accidental multiple clicks / spam orders)
export const orderCreationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Please wait a moment before placing another order.',
  },
});

