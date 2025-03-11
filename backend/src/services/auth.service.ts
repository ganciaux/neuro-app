import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { APP_ENV } from '../config/environment';
import { createUser } from './user.service';

const prisma = new PrismaClient();

export async function registerUser(email: string, password: string) {
  const user = await createUser(email, password);
  if (!user) throw new Error('Failed to create user');
  return { id: user.id, email: user.email };
}

export async function generateToken(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, APP_ENV.JWT_SECRET, { expiresIn: '1h' });

  return token;
}
