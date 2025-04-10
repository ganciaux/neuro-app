import { PrismaClient, Role} from '@prisma/client';
import { Server } from 'http';
import { unauthedRequest } from '../../utils/test-utils';
import {
  startE2EServer,
  stopE2EServer,
  createUser
} from '../../test-helpers';
import { app } from '../../../config/server';

const API_BASE_PATH = '/api/v1/auth';

describe('Auth Routes', () => {
  let email: string;
  let password: string;
  let name: string;

  let server: Server;
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    ({ server, prisma } = await startE2EServer(app));
  });

  beforeEach(async () => {
    email = 'register@register.com';
    password = 'passwordRegister1.';
    name = 'register';
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await stopE2EServer(prisma, server);
  });

  describe(`POST ${API_BASE_PATH}/register`, () => {
    it('should register a new user', async () => {
      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/register`,
        {
          email,
          password,
          name,
        },
      );

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe(email);
    });

    it('should return 400 for duplicate email', async () => {
      const user = await createUser(prisma, email, Role.USER, password);

      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/register`,
        {
          email,
          password,
          name,
        });

      expect(res.status).toBe(409);
    });
  });

  describe(`POST ${API_BASE_PATH}/login`, () => {
    it('should login a user and return a token', async () => {
      await createUser(prisma, email, Role.USER, password);

      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/login`,
        {
          email,
          password,
        },
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      await createUser(prisma, email, Role.USER, password);

      const res = await unauthedRequest(server,
        'post',
        `${API_BASE_PATH}/login`,
        {
          email,
          password: 'passwordWrong1.',
        },
      );

      expect(res.status).toBe(401);
    });
  });
});
