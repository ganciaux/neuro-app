import { Request, Response, NextFunction } from 'express';
import { registerUser, generateToken } from '../services/auth.service';
import { AuthLoginDTO, AuthRegisterDTO } from '../dtos/auth.dto';
import { AuthLoginSchema, AuthRegisterSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../middlewares/async.handler.middleware';
import { logger } from '../logger/logger';

export const register = asyncHandler(
  async (request: Request, response: Response, next: NextFunction) => {
    logger.info(`auth.controller: register: [req:${request.requestId}]: register`);
    const { email, password }: AuthRegisterDTO = AuthRegisterSchema.parse(request.body);
    const user = await registerUser(email, password);
    response.status(201).json(user);
  }
);

export const login = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`auth.controller: login: [req:${request.requestId}]: login`);
    const { email, password }:AuthLoginDTO = AuthLoginSchema.parse(request.body);
    const token = await generateToken(email, password);
    response.json({ token });
  }
);
