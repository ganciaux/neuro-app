import { UserPrisma, UserPublic, userPublicSelect, UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import {
  UserCountFailedError,
  UserCreationFailedError,
  UserDeletionFailedError,
  UserFetchByEmailFailedError,
  UserFetchByIdFailedError,
  UserFetchFailedError,
  UserFindAllFailedError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import { PrismaError } from '../errors/prisma.errors';
import { prisma } from '../config/database';

export function isValidUserId(userId: string): boolean {
  return userId.match(/^[0-9a-fA-F-]{36}$/) !== null;
}

/**
 * Service for user management.
 */
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

export async function findUserByEmail(email: string):Promise<UserPrisma|null> {
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

export async function findUserById(userId: string):Promise<UserPrisma|null> {
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

export async function findUserPublicById(
  userId: string
):Promise<UserPublic|null> {
  return await findUserByIdWithSelect(userId, userPublicSelect) as UserPublic | null;
}

export async function findUserByIdWithSelect(
  userId: string,
  select: Record<string, boolean>,
):Promise<Partial<UserPrisma>|null> {
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

export async function findUser(criteria: { email?: string; id?: string }):Promise<UserPrisma|null> {
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

export async function findAllUsers(offset: number = 0, limit: number = 10):Promise<UserPublic[]> {
  try {
    const users = await prisma.user.findMany({
      select: userPublicSelect,
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

export async function getTotalUsersCount():Promise<number> {
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
): Promise<UserPrisma|null> {

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

export async function updateUser(userId: string, data: Partial<UserPrisma>): Promise<UserPrisma | null> {

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return updatedUser;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new PrismaError('Faild to update user', error.code, 500);
    } else {
      throw new UserUpdateFailedError(userId);
    }
  }
}

export async function deleteUser(userId: string): Promise<UserPrisma | null> {
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

export function toUserPublic(user: UserPrisma): UserPublic {
  const { passwordHash, passwordSalt, ...userPublic } = user;
  return userPublic;
}