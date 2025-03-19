import request from 'supertest';
import { app, server } from '../index';
import { UserTestData, UserRole } from '../models/user.model';
import { logger } from '../logger/logger';
import { generateToken } from '../services/auth.service';
import { prisma } from '../config/database';
import { Container } from '../container';

const userService = Container.getUserService();

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
  role: UserRole = UserRole.USER,
  token: boolean = true,
): Promise<UserTestData> {
  let authToken: string = '';
  const user = await userService.create(email, password, name, role, false);

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
    'passwordUser1.',
    'user',
    UserRole.USER,
  );

  globalThis.admin = await createTestUser(
    'admin@admin.com',
    'passwordAdmin1.',
    'admin',
    UserRole.ADMIN,
  );
}
