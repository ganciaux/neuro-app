import request from 'supertest';
import bcrypt from 'bcryptjs';
import { PrismaClient, User } from '@prisma/client';
import { app, server } from '../index';
import { UserAuth, UserRole } from '../models/user.model';
import { logger } from '../logger/logger';
import { APP_ENV } from '../config/environment';

const prisma = new PrismaClient();

const API_BASE_PATH = '/api/v1';

beforeAll(async () => {
  logger.info('🛠️ Setting up before all tests...');
  await prisma.$connect();
  await cleanupDatabase();
  await setupDatabase();
});

beforeEach(async () => { });

afterEach(async () => { });

afterAll(async () => {
  logger.info('🔌 disconnect and close...');
  await prisma.$disconnect();
  server.close();
});

export async function createTestUser(email: string, password: string, name: string = "name", role: UserRole = UserRole.USER, token: boolean = true): Promise<UserAuth> {
  let authToken: string = "";
  const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      passwordSalt: salt,
      name,
      role,
    }
  })

  logger.info('create user: ', user);

  if (token) {
    authToken = await getAuthToken(email, password);
  }

  return { user, token: authToken };
}

export async function deleteTestUser(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    const user = await prisma.user.delete({
      where: { id: userId },
    });
  }
  return user;
}

export async function getAuthToken(email: string, password: string) {
  const res = await request(app)
    .post(`${API_BASE_PATH}/auth/login`)
    .send({ email, password });

  logger.info('get token user: ', user);

  return res.body.token;
}

export async function cleanupDatabase() {
  await prisma.user.deleteMany({});
}

export async function setupDatabase() {
  globalThis.user = {} as any;
  globalThis.admin = {} as any;

  globalThis.user.email = 'user@user.com'
  globalThis.user.password = 'passwordUser'
  globalThis.user.auth = await createTestUser(globalThis.user.email, globalThis.user.password, 'user', UserRole.USER);

  globalThis.admin.email = 'admin@admin.com'
  globalThis.admin.password = 'passwordAdmin'
  globalThis.admin.auth = await createTestUser(globalThis.admin.email, globalThis.admin.password, 'admin', UserRole.ADMIN);
}
