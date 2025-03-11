import { request, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../logger/logger';
import { UserCreateSchema } from '../schemas/user.schema';
import { UserCreateDTO } from '../dtos/user.dto';

const prisma = new PrismaClient();

const PASSWORD_SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS || 10);

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
    res.json(user);
  } catch (error) {
    logger.error(`Error:`, (error as Error).message)
    res.status(500).json({ message: 'Erreur serveur' });
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
    logger.error(`Error:`, (error as Error).message)
    response.status(500).json({error: 'Server error'});
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(users);
  } catch (error) {
    logger.error(`Error:`, (error as Error).message)
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = UserCreateSchema.parse(request.body);
    const { email, password, name, role }:UserCreateDTO = validatedData;
    const existingUser = await prisma.user.findUnique({where: { email }});

    if (existingUser) {
      res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
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

    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error:`, (error as Error).message)
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        role,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json(user);
  } catch (error) {
    logger.error(`Error:`, (error as Error).message)
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    logger.error(`Error:`, (error as Error).message)
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
