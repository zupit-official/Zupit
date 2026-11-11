import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'zupit_super_secret_jwt_key_2026_secure';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    phone: string;
    role: string;
  };
}

export function generateToken(payload: { id: string; phone: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '60d' }); // 60 days session
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; phone: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}

