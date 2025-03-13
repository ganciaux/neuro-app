import { Request, Response, NextFunction } from 'express';
import { registerUser, generateToken } from '../services/auth.service';
import { UserLoginDTO, UserRegisterDTO } from '../dtos/user.dto';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { logger } from '../logger/logger';

export const register = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    logger.info(`auth.controller: register: [req:${request.requestId}]: register`);
    const validatedData: UserRegisterDTO = UserRegisterSchema.parse(request.body);
    const { email, password } = validatedData;
    const user = await registerUser(email, password);
    response.status(201).json(user);
  }
);

export const login = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`auth.controller: login: [req:${request.requestId}]: login`);
    const validatedData = UserLoginSchema.parse(request.body);
    const { email, password }: UserLoginDTO = validatedData;
    const token = await generateToken(email, password);
    response.json({ token });
  }
);
