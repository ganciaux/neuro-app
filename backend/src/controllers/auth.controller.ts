import { Request, Response, NextFunction } from 'express';
import { registerUser, generateToken } from '../services/auth.service';
import { UserLoginDTO, UserRegisterDTO } from '../dtos/user.dto';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { logger } from '../logger/logger';
import { EmailAlreadyExistsError } from '../errors/auth.errors';
import { userExists } from '../services/user.service';

export const register = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    logger.info(`[req:${request.requestId}]: register`);
    let email: string = '';
    let password: string = '';

    try {
      const validatedData: UserRegisterDTO = UserRegisterSchema.parse(
        request.body,
      );
      ({ email, password } = validatedData);

      const user = await registerUser(email, password);
      response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },
);

export const login = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: login`);
    const validatedData = UserLoginSchema.parse(request.body);
    const { email, password }: UserLoginDTO = validatedData;
    const token = await generateToken(email, password);
    response.json({ token });
  },
);
