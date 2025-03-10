import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, UserAuthenticated } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: UserAuthenticated; // Define the type of `user` as needed
    }
  }
}

export function authGuard(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers.authorization?.split(' ')[1];

  if (!token) {
    response.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserAuthenticated;
    request.user = decoded;
    next();
  } catch (error) {
    response.status(401).json({ error: 'Invalid token' });
  }
}

export function adminGuard(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (request.user?.role != UserRole.ADMIN) {
    response.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
}
