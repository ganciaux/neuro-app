import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import { createUser } from './user.service';
import { logger } from '../logger/logger';
import { UserCreationFailedError, UserNotFoundError } from '../errors/user.errors';
import { InvalidCredentialsError } from '../errors/auth.errors';

const prisma = new PrismaClient();

export async function registerUser(email: string, password: string) {
  logger.info(`authService: registerUser`);
  const user = await createUser(email, password);
  if (!user) {
    throw new UserCreationFailedError(email);
  }
  return { id: user.id, email: user.email };
}

export async function generateToken(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UserNotFoundError(email);

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new InvalidCredentialsError(email);

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, APP_ENV.JWT_SECRET, { 
    expiresIn: APP_ENV.JWT_EXPIRATION
  });

  return token;
}
