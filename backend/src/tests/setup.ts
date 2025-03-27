import request from 'supertest';
import { app, server } from '../index';
import { UserTestData } from '../models/user.model';
import { logger } from '../logger/logger';
import { prisma } from '../config/database';
import { Container } from '../container';
import { Role } from '@prisma/client';

const userService = Container.getUserService();
const authService = Container.getAuthService();

beforeAll(async () => {
  logger.info('setup: JEST: 🛠️ Setting up before all tests');
  await prisma.$connect();
  await cleanupDatabase();
  //await setupDatabase();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  logger.info('setup: JEST: 🔌 disconnect and close');
  await prisma.$disconnect();
  server.close();
});

export async function createTestUser(
  email: string,
  password: string,
  name: string = 'name',
  role: Role = Role.USER,
  token: boolean = true,
): Promise<UserTestData> {
  let authToken: string = '';
  const user = await userService.create(email, password, name, role, false);

  if (!user) {
    throw new Error('User not created');
  }

  if (token) {
    authToken = await authService.generateToken(email, password);
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
    'passwordUser1.',
    'user',
    Role.USER,
  );

  globalThis.admin = await createTestUser(
    'admin@admin.com',
    'passwordAdmin1.',
    'admin',
    Role.ADMIN,
  );
}
