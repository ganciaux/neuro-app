// src/tests/test-helpers.ts
import { PrismaClient, Role } from '@prisma/client';
import { Express } from 'express';
import { Server } from 'http';
import { generateToken, hashPassword } from './utils/test-utils';
import { mockDeep } from 'jest-mock-extended';
import { SeededUsers } from '../models/user.model';

export const prismaMock = mockDeep<PrismaClient>();

export const seedUsersTestData = async (prisma: PrismaClient): Promise<SeededUsers> => {
  const { hash: passwordHashAdmin, salt: passwordSaltAdmin } = await hashPassword('PasswordAdmin1.');
  const { hash: passwordHashUser, salt: passwordSaltUser } = await hashPassword('PasswordUser1.');
  
const [admin, user] = await Promise.all([ 
    prisma.user.create({
      data: {
        email: 'admin@test.com',
        role: Role.ADMIN,
        passwordHash: passwordHashAdmin,
        passwordSalt: passwordSaltAdmin,
        isActive: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@test.com',
        role: Role.USER,
        passwordHash: passwordHashUser,
        passwordSalt: passwordSaltUser,
        isActive: true
      }
    })
  ]);

  return {
    admin: { ...admin, token: generateToken(admin) },
    user: { ...user, token: generateToken(user) },
  };
};

export async function startTestApp(app: Express): Promise<{ server: Server, prisma: PrismaClient }> {
  const server = app.listen(0);
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL }
    }
  });
  await prisma.$connect();
  
  return { server, prisma };
}

export async function stopTestApp(server: Server, prisma: PrismaClient) {
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
  await prisma.$disconnect();
  server.close();
}

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