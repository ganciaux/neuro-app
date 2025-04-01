import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath, override: true });

import { server } from '../index';
import { UserTestData } from '../models/user.model';
import { logger } from '../logger/logger';
import { prisma } from '../config/database';
import { Container } from '../container';
import { Role } from '@prisma/client';
import { UserCreationFailedError } from '../errors/user.errors';

const userService = Container.getUserService();
const authService = Container.getAuthService();

beforeAll(async () => {
  logger.info('setup: JEST: 🛠️ Setting up before all tests');
  await databaseCleanup();
  await databaseSetup();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  await databaseCleanup();
  logger.info('setup: JEST: 🔌 disconnect and close');
  server.close();
});

export async function createTestUser(
  email: string,
  password: string,
  name: string = 'name',
  role: Role = Role.USER,
  token: boolean = true,
  isActive: boolean = true,
): Promise<UserTestData> {
  let authToken: string = '';
  const user = await userService.create(email, password, name, role, isActive);

  if (!user) {
    throw new UserCreationFailedError(email);
  }

  if (token) {
    authToken = await authService.generateToken(email, password);
  }

  return { user, email, password, token: authToken };
}

export async function databaseCleanup() {
  logger.info('setup: JEST: cleaning database');
  await prisma.user.deleteMany({});
}

export async function databaseSetup() {
  logger.info('setup: JEST: setting up database');
  globalThis.user = {} as any;
  globalThis.admin = {} as any;

  globalThis.user = await createTestUser(
    'user@user.com',
    'passwordUser1.',
    'user',
    Role.USER,
    true,
    true,
  );

  globalThis.admin = await createTestUser(
    'admin@admin.com',
    'passwordAdmin1.',
    'admin',
    Role.ADMIN,
    true,
    true,
  );
}
