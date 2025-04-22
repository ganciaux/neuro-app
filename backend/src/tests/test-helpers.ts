import { PrismaClient, Role, User } from '@prisma/client';
import { Express } from 'express';
import { Server } from 'http';
import { generateToken, hashPassword } from './utils/test-utils';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { SeededUsers, UserWithPasswordAndToken } from '../models/user.model';

const date = new Date();

import { APP_ENV } from '../../src/config/environment';

export default async () => {
  if (APP_ENV.NODE_ENV !== 'test') {
    throw new Error('⚠️ Test helpers must use NODE_ENV=test !');
  }
};

export function createMockPrisma(): DeepMockProxy<PrismaClient> {
  return mockDeep<PrismaClient>();
}

export function createMockUser(): User {
  return {
    id: '1',
    email: 'test@test.com',
    name: 'Test User',
    createdAt: date,
    updatedAt: date,
    passwordHash: 'mockedHashedPassword',
    passwordSalt: 'mockedSalt',
    role: Role.USER,
    isActive: true,
  } 
}

export const createUser = async (
  prisma: PrismaClient,
  email: string,
  name: string,
  role: Role,
  password: string,
  isActive: boolean = true,
): Promise<User> => {
  const { hash, salt } = await hashPassword(password);

  return prisma.user.create({
    data: {
      email,
      name,
      role,
      passwordHash: hash,
      passwordSalt: salt,
      isActive,
    },
  });
};

export const createUserWithPasswordAndToken = async (
  prisma: PrismaClient,
  email: string,
  name: string,
  role: Role,
  password: string,
  isActive: boolean = true,
): Promise<UserWithPasswordAndToken> => {
  const user = await createUser(prisma, email, name, role, password, isActive);
  return withPasswordAndToken(user, password);
};

export const withPasswordAndToken = (
  user: User,
  password: string,
): UserWithPasswordAndToken => {
  return {
    ...user,
    token: generateToken(user),
    password,
  };
};

export const seedUsersTestData = async (
  prisma: PrismaClient,
): Promise<SeededUsers> => {
  const adminPassword = 'PasswordAdmin1.';
  const userPassword = 'PasswordUser1.';
  const [adminUser, regularUser] = await Promise.all([
    createUser(prisma, 'admin@test.com', 'Admin', Role.ADMIN, adminPassword),
    createUser(prisma, 'user@test.com', 'User', Role.USER, userPassword),
  ]);
  return {
    admin: withPasswordAndToken(adminUser, adminPassword),
    user: withPasswordAndToken(regularUser, userPassword),
  };
};

export async function startTestServer(
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

export const stopTestServer = async (prisma: PrismaClient, server: Server) => {
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
