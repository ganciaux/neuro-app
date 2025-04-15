import { PrismaClient, Role} from '@prisma/client';
import { Server } from 'http';
import { unauthedRequest } from '../../utils/test-utils';
import {
  startTestServer,
  stopTestServer,
  createUser
} from '../../test-helpers';
import { app } from '../../../config/server';
import { userFixture } from '../../fixtures/users';

const API_BASE_PATH = '/api/v1/auth';

describe('Auth Routes', () => {
  let server: Server;
  let prisma: PrismaClient;
  
  beforeAll(async () => {
    ({ server, prisma } = await startTestServer(app));
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await stopTestServer(prisma, server);
  });

  describe(`POST ${API_BASE_PATH}/register`, () => {
    it('should register a new user', async () => {
      const user = userFixture.build();
      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/register`,
        {
          email: user.email,
          password: user.password,
          name: user.name,
        },
      );
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe(user.email);
    });

    it('should return 400 for duplicate email', async () => {
      const userFake = userFixture.build();
      const user = await createUser(prisma, userFake.email, userFake.name, Role.USER, userFake.password);
      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/register`,
        {
          email: userFake.email,
          password: userFake.password,
          name: userFake.name,
        });
      expect(res.status).toBe(409);
    });
  });

  describe(`POST ${API_BASE_PATH}/login`, () => {
    it('should login a user and return a token', async () => {
      const userFake = userFixture.build();
      const user = await createUser(prisma, userFake.email, userFake.name, Role.USER, userFake.password);
      const res = await unauthedRequest(
        server,
        'post',
        `${API_BASE_PATH}/login`,
        {
          email: userFake.email,
          password: userFake.password,
        },
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const userFake = userFixture.build();
      const user = await createUser(prisma, userFake.email, userFake.name, Role.USER, userFake.password);
      const res = await unauthedRequest(server,
        'post',
        `${API_BASE_PATH}/login`,
        {
          email: userFake.email,
          password: 'passwordWrong1.',
        },
      );
      expect(res.status).toBe(401);
    });
  });
});
