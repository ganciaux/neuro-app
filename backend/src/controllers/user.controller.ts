import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export async function getUserById(request: Request, response: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.params.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!user) {
      response.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
}

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
