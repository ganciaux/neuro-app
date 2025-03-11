import { UserRole } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { logger } from '../logger/logger';
import { APP_ENV } from '../config/environment';

const prisma = new PrismaClient();

export async function createUser(
  email: string,
  password: string,
  name: string = 'name',
  role: UserRole = UserRole.USER,
): Promise<User | null> {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return null;
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
  });

  return user;
}

export async function deleteUser(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return null;
  }

  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
}
