import { Request, Response } from 'express';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';
import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserByIdWithSelect,
  isValidUserId,
} from '../services/user.service';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import {
  InvalidUserIdError,
  UserNotFoundError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { prisma } from '../config/database';

export const getProfile = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: getProfile: [req:${request.requestId}]: getProfile`);
    const userId = request.user?.id;

    if (!userId) {
      throw new UserNotFoundError();
    }

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    const user = await findUserByIdWithSelect(userId, {
      id: true,
      email: true,
      name: true,
      role: true,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

export const getUserById = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: getUserById: [req:${request.requestId}]: getUserById`);
    const userId = request.params.id;

    if (!isValidUserId(userId)) {
      throw new InvalidUserIdError();
    }

    const user = await findUserByIdWithSelect(userId, {
      id: true,
      email: true,
      name: true,
      role: true,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    response.json(user);
  },
);

export const getAllUsers = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: getAllUsers: [req:${request.requestId}]: getAllUsers`);
    const users = await findAllUsers();
    response.json(users);
  },
);

export const createUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: createUserHandler: [req:${request.requestId}]: createUserHandler`);
    const validatedData = UserCreateSchema.parse(request.body);
    const { email, password, name, role }: UserCreateDTO = validatedData;

    const user = await createUser(email, password, name, role);

    response.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  },
);

export const updateUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: updateUser: [req:${request.requestId}]: updateUser`);
    const userId = request.params.id;
    const { name, email, role } = request.body;

    if (!isValidUserId(userId)) {
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

export const deleteUserHandler = asyncHandler(
  async (request: Request, response: Response) => {
    logger.info(`user.controller: deleteUser: [req:${request.requestId}]: deleteUser`);
    const userId = request.params.id;

    const user = await deleteUser(userId);

    response.status(204).send();
  },
);
