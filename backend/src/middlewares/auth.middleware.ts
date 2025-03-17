import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPrisma, UserRole, UserJWTPayload } from '../models/user.model';
import { APP_ENV } from '../config/environment';
import {
  JWTExpiredError,
  JWTInvalidError,
  JWTNotProvidedError,
  RoleAccessRequiredError,
} from '../errors/auth.errors';
import { asyncHandler } from './async.handler.middleware';
import { UserJWTPayloadSchema } from '../schemas/user.schema';
import { userService } from '../services/user.service';

declare global {
  namespace Express {
    interface Request {
      user?: UserPrisma;
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
      const decoded = jwt.verify(token, APP_ENV.JWT_SECRET) as UserJWTPayload;

      const payload:UserJWTPayload = UserJWTPayloadSchema.parse(decoded);

      const user = await userService.findById(payload.sub);

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
