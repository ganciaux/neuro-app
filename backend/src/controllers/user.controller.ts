import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';
import { createUser } from '../services/user.service';
import { asyncHandler } from '../middlewares/asyncHandler.middleware';
import { AppError } from '../errors/app.error';

const prisma = new PrismaClient();

export const getProfile = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: getProfile`);
  const user = await prisma.user.findUnique({
    where: { id: request.user?.id },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  response.json(user);
});

export const getUserById = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: getUserById`);
  const userId = request.params.id;

  if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
    throw new AppError('Invalid user ID format', 404);
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  response.json(user);
});

export const getAllUsers = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: getAllUsers`);
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  response.json(users);
});

export const createUserHandler = asyncHandler(async (
  request: Request,
  response: Response,
) => {
  logger.info(`[req:${request.requestId}]: createUserHandler`);
  const validatedData = UserCreateSchema.parse(request.body);
  const { email, password, name, role }: UserCreateDTO = validatedData;

  const user = await createUser(email, password, name, role);

  if (!user) {
    throw new AppError(`Can't create user`, 400);
  }

  response.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

export const updateUser = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: updateUser`);
  const { name, email, role } = request.body;
  const userId = request.params.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      throw new AppError(`Can't update user`, 400);
    }

    response.json(user);
});

export const deleteUser = asyncHandler(async (request: Request, response: Response) => {
  logger.info(`[req:${request.requestId}]: deleteUser`);
  const userId = request.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userDeleted = await prisma.user.delete({
      where: { id: userId },
    });

    if (!userDeleted) {
      throw new AppError(`Can't delete user`, 400);
    }

    response.status(204).send();
});
