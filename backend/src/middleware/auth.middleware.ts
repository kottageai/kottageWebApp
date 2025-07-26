import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../util/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Expected format: "Bearer <token>"
    const [, token] = authHeader.split(' ');

    if (!token) {
      return res.status(401).json({ error: 'Malformed authorization header' });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}