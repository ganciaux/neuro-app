import request from 'supertest';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import {app, server} from '../index';
import { UserAuth, UserRole } from '../models/user.model';

const prisma = new PrismaClient();

const PASSWORD_SALT_ROUNDS = 10;

beforeAll(async () => {
  console.log('🛠️ Setting up before all tests...');
  await prisma.$connect();
  await cleanupDatabase();
  await setupDatabase();
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  console.log('🔌 disconnect and close...');
  await prisma.$disconnect();
  server.close();
});

export async function createTestUser(email: string, password: string, name: string="name", role:UserRole=UserRole.USER, token:boolean=true):Promise<UserAuth> {
  let authToken:string="";
  const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      passwordSalt: salt,
      name,
      role,
    }})
    
    if (token){
      authToken = await getAuthToken(email, password);
    }
    return {user, token: authToken};
}

export async function getAuthToken(email: string, password: string) {
  const res = await request(app)
      .post('/v1/auth/login')
      .send({ email, password });

  return res.body.token;
}

export async function cleanupDatabase() {
  await prisma.user.deleteMany({});
}

export async function setupDatabase() {
  globalThis.user = {} as any;
  globalThis.admin = {} as any;

  globalThis.user.email = 'user@user.com'
  globalThis.user.password ='passwordUser'
  globalThis.user.auth = await createTestUser(globalThis.user.email, globalThis.user.password, 'user', UserRole.USER);

  globalThis.admin.email = 'admin@admin.com'
  globalThis.admin.password =  'passwordAdmin'
  globalThis.admin.auth = await createTestUser(globalThis.admin.email, globalThis.admin.password, 'admin', UserRole.ADMIN);
}
