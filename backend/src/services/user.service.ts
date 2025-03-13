import { UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import { EmailAlreadyExistsError } from '../errors/auth.errors';
import {
  UserCreationFailedError,
  UserDeletionFailedError,
  UserNotFoundError,
} from '../errors/user.errors';
import { PrismaError } from '../errors/prisma.errors';
import { prisma } from '../config/database';

export async function userExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  return !!user;
}

export async function userExistsById(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id } });
  return !!user;
}

export async function findUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}

export async function findUserByIdWithSelect(
  userId: string,
  select: Record<string, boolean>,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select,
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  return user;
}

export async function createUser(
  email: string,
  password: string,
  name: string = 'name',
  role: UserRole = UserRole.USER,
): Promise<User | null> {
  if (await userExists(email)) {
    throw new EmailAlreadyExistsError(email);
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Database error', error.code, 400);
    } else {
      throw new UserCreationFailedError(email);
    }
  }
}

export async function deleteUser(userId: string): Promise<User | null> {
  if (await userExistsById(userId)) {
    throw new UserNotFoundError(userId);
  }
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    return deletedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Database error', error.code, 400);
    } else {
      throw new UserDeletionFailedError(userId);
    }
  }
}
