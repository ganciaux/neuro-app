import { request, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';
import { APP_ENV } from '../config/environment';

const prisma = new PrismaClient();

export const getProfile = async (request: Request, response: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user?.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      response.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    response.json(user);
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({ message: 'Erreur serveur' });
  }
};

export async function getUserById(request: Request, response: Response) {
  const userId = request.params.id;

  if (!userId.match(/^[0-9a-fA-F-]{36}$/)) {
    response.status(400).json({ error: 'Invalid user ID format' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId  },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      response.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    response.json(user);
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({error: 'Server error'});
  }
}

export const getAllUsers = async (request: Request, response: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    response.json(users);
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const validatedData = UserCreateSchema.parse(request.body);
    const { email, password, name, role }:UserCreateDTO = validatedData;
    const existingUser = await prisma.user.findUnique({where: { email }});

    if (existingUser) {
      response.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        passwordSalt: salt,
        name,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    response.status(201).json(user);
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (request: Request, response: Response) => {
  try {
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

    response.json(user);
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  try {
    const userId = request.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      response.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    response.status(204).send();
  } catch (error) {
    logger.error(`[req:${request.requestId}]:`, error)
    response.status(500).json({ message: 'Erreur serveur' });
  }
};
