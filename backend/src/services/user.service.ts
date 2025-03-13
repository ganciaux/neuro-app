import { UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import { EmailAlreadyExistsError } from '../errors/auth.errors';
import {
  InvalidUserIdError,
  UserCountFailedError,
  UserCreationFailedError,
  UserDeletionFailedError,
  UserFetchByEmailFailedError,
  UserFetchByIdFailedError,
  UserFetchFailedError,
  UserFindAllFailedError,
  UserNotFoundError,
} from '../errors/user.errors';
import { PrismaError } from '../errors/prisma.errors';
import { prisma } from '../config/database';

export function isValidUserId(userId: string): boolean {
  return userId.match(/^[0-9a-fA-F-]{36}$/) !== null;
}

export async function userExistsByEmail(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    return !!user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to check user existence by email', error.code, 500);
    } else {
      throw new UserFetchByEmailFailedError(email);
    }
  }
}

export async function userExistsById(id: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
    return !!user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to check user existence by id', error.code, 500);
    } else {
      throw new UserFetchByIdFailedError(id);
    }
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch user by email', error.code, 500);
    } else {
      throw new UserFetchByEmailFailedError(email);
    }
  }
}

export async function findUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch user by id', error.code, 500);
    } else {
      throw new UserFetchByIdFailedError(userId);
    }
  }
}

export async function findUserByIdWithSelect(
  userId: string,
  select: Record<string, boolean>,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select,
    });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch user by id', error.code, 500);
    } else {
      throw new UserFetchByIdFailedError(userId);
    }
  }
}

export async function findUser(criteria: { email?: string; id?: string }) {
  try {
    const where = criteria.id ? { id: criteria.id } : { email: criteria.email };
    const user = await prisma.user.findUnique({ where });
    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch user', error.code, 500);
    } else {
      throw new UserFetchFailedError(criteria.email || criteria.id || 'unknown');
    }
  }
}

export async function findAllUsers(offset: number = 0, limit: number = 10) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
      skip: offset,
      take: limit,
    });
    return users;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch total users count', error.code, 500);
    } else {
      throw new UserFindAllFailedError();
    }
  }
}

export async function getTotalUsersCount() {
  try {
    return await prisma.user.count();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Failed to fetch total users count', error.code, 500);
    } else {
      throw new UserCountFailedError();
    }
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string = 'name',
  role: UserRole = UserRole.USER,
): Promise<User> {
  if (await userExistsByEmail(email)) {
    throw new EmailAlreadyExistsError(email);
  }

  try {
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
    });

    return user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Faild to create user', error.code, 500);
    } else {
      throw new UserCreationFailedError(email);
    }
  }
}

export async function deleteUser(userId: string): Promise<User | null> {
  if (!isValidUserId(userId)) {
    throw new InvalidUserIdError();
  }

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
      throw new PrismaError('Faild to delete user', error.code, 500);
    } else {
      throw new UserDeletionFailedError(userId);
    }
  }
}
