import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserJWT } from '../models/user.model';
import { APP_ENV } from '../config/environment';
import { prisma } from '../config/database';
import {
  JWTExpiredError,
  JWTInvalidError,
  JWTNotProvidedError,
  RoleAccessRequiredError,
} from '../errors/auth.errors';
import { asyncHandler } from './asyncHandler.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authGuard = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new JWTNotProvidedError();
    }

    try {
      const decoded = jwt.verify(token, APP_ENV.JWT_SECRET) as UserJWT;

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new JWTInvalidError();
      }

      request.user = user;
      next();
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        throw new JWTExpiredError();
      }
      throw new JWTInvalidError();
    }
  },
);

export const adminGuard = asyncHandler(
  (request: Request, response: Response, next: NextFunction) => {
    if (request.user?.role !== UserRole.ADMIN) {
      throw new RoleAccessRequiredError();
    }
    next();
  },
);
