import { PrismaClient, Role, User } from '@prisma/client';
import { Express } from 'express';
import { Server } from 'http';
import { generateToken, hashPassword } from './utils/test-utils';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { SeededUsers, UserWithToken } from '../models/user.model';

import { APP_ENV } from '../../src/config/environment';

export default async () => {
  if (APP_ENV.NODE_ENV !== 'test') {
    throw new Error('⚠️ Test helpers must use NODE_ENV=test !');
  }
};

export function createMockPrisma(): DeepMockProxy<PrismaClient> {
  return mockDeep<PrismaClient>();
}

export const createUser = async (
  prisma: PrismaClient,
  email: string,
  role: Role,
  password: string,
  isActive: boolean = true,
): Promise<User> => {
  const { hash, salt } = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      role,
      passwordHash: hash,
      passwordSalt: salt,
      isActive,
    },
  });
};

export const createUserWithToken = async (
  prisma: PrismaClient,
  email: string,
  role: Role,
  password: string,
  isActive: boolean = true,
): Promise<User> => {
  const user = await createUser(prisma, email, role, password, isActive);
  return withToken(user);
};

export const withToken = (user: User): UserWithToken => {
  return {
    ...user,
    token: generateToken(user),
  };
};

export const seedUsersTestData = async (
  prisma: PrismaClient,
): Promise<SeededUsers> => {
  const [adminUser, regularUser] = await Promise.all([
    createUser(prisma, 'admin@test.com', Role.ADMIN, 'PasswordAdmin1.'),
    createUser(prisma, 'user@test.com', Role.USER, 'PasswordUser1.'),
  ]);
  return {
    admin: withToken(adminUser),
    user: withToken(regularUser),
  };
};

export async function startE2EServer(
  app: Express,
): Promise<{ server: Server; prisma: PrismaClient }> {
  const server = app.listen(0);
  const prisma = await startTestPrisma();
  return { server, prisma };
}

export async function startTestPrisma() {
  const prisma = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
  });
  await prisma.$connect();
  return prisma;
}

export const stopE2EServer = async (prisma: PrismaClient, server: Server) => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
        return reject(err);
      }
      resolve();
    });
  });

  await stopTestPrisma(prisma);
};

export const stopTestPrisma = async (prisma: PrismaClient) => {
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$disconnect();
};

export const cleanNodeJsResources = async () => {
  ['http', 'https'].forEach((module) => {
    const agent = require(module).globalAgent;
    agent.destroy();
    agent.sockets = {};
    agent.requests = {};
  });

  jest.useFakeTimers();
  jest.clearAllTimers();

  if (global.gc) global.gc();
};
