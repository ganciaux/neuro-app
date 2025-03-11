import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import { app, server } from '../index';
import { UserTest, UserRole } from '../models/user.model';
import { logger } from '../logger/logger';
import { createUser } from '../services/user.service';
import { generateToken } from '../services/auth.service';

const prisma = new PrismaClient();

beforeAll(async () => {
  logger.info('🛠️ Setting up before all tests...');
  await prisma.$connect();
  await cleanupDatabase();
  await setupDatabase();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  logger.info('🔌 disconnect and close...');
  await prisma.$disconnect();
  server.close();
});

export async function createTestUser(
  email: string,
  password: string,
  name: string = 'name',
  role: UserRole = UserRole.USER,
  token: boolean = true,
): Promise<UserTest> {
  let authToken: string = '';
  const user = await createUser(email, password, name, role);

  if (!user) {
    throw new Error('User not created');
  }

  if (token) {
    authToken = await generateToken(email, password);
  }

  return { user, email, password, token: authToken };
}

export async function cleanupDatabase() {
  await prisma.user.deleteMany({});
}

export async function setupDatabase() {
  globalThis.user = {} as any;
  globalThis.admin = {} as any;

  globalThis.user = await createTestUser(
    'user@user.com',
    'passwordUser',
    'user',
    UserRole.USER,
  );

  globalThis.admin = await createTestUser(
    'admin@admin.com',
    'passwordAdmin',
    'admin',
    UserRole.ADMIN,
  );
}
