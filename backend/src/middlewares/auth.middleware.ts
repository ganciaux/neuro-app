import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserJWT } from '../models/user.model';
import { PrismaClient } from '@prisma/client';
import { APP_ENV } from '../config/environment';

const prisma = new PrismaClient();

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authGuard(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers.authorization?.split(' ')[1];

  if (!token) {
    response.status(401).json({ error: 'Access denied: No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, APP_ENV.JWT_SECRET) as UserJWT;

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      response.status(401).json({ error: 'Invalid token: User not found' });
      return;
    }

    request.user = user;
    next();
  } catch (error) {
    if ((error as Error).name === 'TokenExpiredError') {
      response.status(401).json({ error: 'Token expired' });
    }
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
