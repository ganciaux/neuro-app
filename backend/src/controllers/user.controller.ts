import { Request, Response } from 'express';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';
import {
  createUser,
  findUserById,
  findUserByIdWithSelect,
} from '../services/user.service';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import {
  InvalidUserIdError,
  UserCreationFailedError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { prisma } from '../config/database';

export const getProfile = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: getProfile`);
    const userId = request.user?.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    const user = await findUserByIdWithSelect(userId, {
      id: true,
      email: true,
      name: true,
      role: true,
    });

    response.json(user);
  },
);

export const getUserById = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: getUserById`);
    const userId = request.params.id;

    if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
      throw new InvalidUserIdError();
    }

    const user = await findUserByIdWithSelect(userId, {
      id: true,
      email: true,
      name: true,
      role: true,
    });

    response.json(user);
  },
);

export const getAllUsers = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: getAllUsers`);
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    response.json(users);
  },
);

export const createUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: createUserHandler`);
    const validatedData = UserCreateSchema.parse(request.body);
    const { email, password, name, role }: UserCreateDTO = validatedData;

    const user = await createUser(email, password, name, role);

    if (!user) {
      throw new UserCreationFailedError(email);
    }

    response.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  },
);

export const updateUser = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: updateUser`);
    const userId = request.params.id;
    const { name, email, role } = request.body;

    if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
      throw new InvalidUserIdError();
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email, role },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new UserUpdateFailedError();
    }

    response.json(user);
  },
);

export const deleteUser = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`[req:${request.requestId}]: deleteUser`);
    const userId = request.params.id;

    if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
      throw new InvalidUserIdError();
    }

    // Vérifie que l'utilisateur existe avant de le supprimer
    await findUserById(userId);

    await prisma.user.delete({ where: { id: userId } });

    response.status(204).send();
  },
);
