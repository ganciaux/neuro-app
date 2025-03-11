import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { UserRole } from '../models/user.model';
import { APP_ENV } from '../config/environment';

const prisma = new PrismaClient();

export async function registerUser(
  email: string,
  password: string,
  name: string = '',
) {
  const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      passwordSalt: salt,
      role: UserRole.USER,
    },
  });

  return { id: user.id, email: user.email };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id }, APP_ENV.JWT_SECRET, { expiresIn: '1h' });

  return { token };
}
