import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserJWTPayload } from '../models/user.model';
import { APP_ENV } from '../config/environment';
import {
  AuthRoleAccessRequiredError,
} from '../errors/auth.errors';
import { JWTExpiredError, JWTInvalidError, JWTNotProvidedError } from '../errors/jwt.error';
import { asyncHandler } from './async.handler.middleware';
import { UserJWTPayloadSchema } from '../schemas/user.schema';
import { Container } from '../container';
import { Role, User } from '@prisma/client';
const userService = Container.getUserService();

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
      const decoded = jwt.verify(token, APP_ENV.JWT_SECRET) as UserJWTPayload;

      const payload: UserJWTPayload = UserJWTPayloadSchema.parse(decoded);

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
    if (request.user?.role !== Role.ADMIN) {
      throw new AuthRoleAccessRequiredError();
    }
    next();
  },
);
