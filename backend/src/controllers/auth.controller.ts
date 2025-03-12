import { Request, Response } from 'express';
import { registerUser, generateToken } from '../services/auth.service';
import { UserLoginDTO, UserRegisterDTO } from '../dtos/user.dto';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { logger } from '../logger/logger';
import { EmailAlreadyExistsError } from '../errors/auth.errors';
import { Prisma } from '@prisma/client';
import { userExists } from '../services/user.service';

export const register = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: register`);
  try {
    const validatedData = UserRegisterSchema.parse(request.body);
    const { email, password }: UserRegisterDTO = validatedData;

    if (await userExists(email)) {
      throw new EmailAlreadyExistsError();
    }

    const user = await registerUser(email, password);
    response.status(201).json(user);
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      response.status(409).json({ message: error.message });
    } else {
      throw error; // Transmettre l'erreur à asyncHandler
    }
  }
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: login`);
  const validatedData = UserLoginSchema.parse(request.body);
  const { email, password }: UserLoginDTO = validatedData;
  const token = await generateToken(email, password);
  response.json({ token });
});
