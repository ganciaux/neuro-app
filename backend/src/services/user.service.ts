import { UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import { EmailAlreadyExistsError, UserDeletionFailedError } from '../errors/auth.errors';
import { logger } from '../logger/logger';
import { UserCreationFailedError, UserNotFoundError } from '../errors/user.errors';

const prisma = new PrismaClient();

export async function userExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  return !!user;
}

export async function userExistsById(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id } });
  return !!user;
}

export async function createUser(
  email: string,
  password: string,
  name: string = 'name',
  role: UserRole = UserRole.USER,
): Promise<User | null> {

  if (await userExists(email)) {
    throw new EmailAlreadyExistsError();
  }

  const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        passwordSalt: salt,
        name,
        role,
      },
    });

    return user;
  } catch (error) {
    logger.error(`Failed to create user: ${error}`);
    throw new UserCreationFailedError(email);
  }
}

export async function deleteUser(userId: string): Promise<User | null> {
  if (await userExistsById(userId)) {
    throw new UserNotFoundError(userId);
  }

  try {
    // Supprimer l'utilisateur
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error) {
    logger.error(`Failed to delete user: ${error}`);
    throw new UserDeletionFailedError(userId); // Lever une erreur spécifique
  }
}
