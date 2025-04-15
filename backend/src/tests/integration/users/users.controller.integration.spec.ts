import { PrismaClient, Role, User } from '@prisma/client';
import { Server } from 'http';
import { Container } from '../../../container';
import { authedRequest, unauthedRequest } from '../../utils/test-utils';
import {
  seedUsersTestData,
  startTestServer,
  stopTestServer,
  createUser,
} from '../../test-helpers';
import { SeededUsers } from '../../../models/user.model';
import { app } from '../../../config/server';
import { userFixture } from '../../fixtures/users';

const userRepository = Container.getUserRepository();

const API_BASE_PATH = '/api/v1/users';

describe('User Routes', () => {
  let user: User;
  let server: Server;
  let prisma: PrismaClient;
  let seededUsers: SeededUsers;

  beforeAll(async () => {
    ({ server, prisma } = await startTestServer(app));
  });

  beforeEach(async () => {
    seededUsers = await seedUsersTestData(prisma);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await stopTestServer(prisma, server);
  });

  describe(`GET ${API_BASE_PATH}/me`, () => {
    it('should get current user profile', async () => {
      const res = await authedRequest(
        server,
        seededUsers.user,
        'get',
        `${API_BASE_PATH}/me`,
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', seededUsers.user.email);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await unauthedRequest(server, 'get', `${API_BASE_PATH}/me`);
      expect(res.status).toBe(401);
    });
  });

  describe(`GET ${API_BASE_PATH}/:id`, () => {
    it('should return a user by ID (admin)', async () => {
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'get',
        `${API_BASE_PATH}/${seededUsers.admin.id}`,
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', seededUsers.admin.id);
    });

    it('should return 400 if user has bad ID (admin)', async () => {
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'get',
        `${API_BASE_PATH}/nonexistentid`,
      );
      expect(res.status).toBe(400);
    });

    it('should return 404 if user does not exist (admin)', async () => {
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'get',
        `${API_BASE_PATH}/c8cdf9ed-ef91-4203-942c-0d931157e1e1`,
      );
      expect(res.status).toBe(404);
    });
  });

  describe(`GET ${API_BASE_PATH}`, () => {
    it('should return all users when requested by an admin', async () => {
      const totalUsers = await userRepository.count();
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'get',
        `${API_BASE_PATH}`,
      );
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total).toBe(totalUsers);
    });

    it('should return 403 when a non-admin user tries to get all users', async () => {
      const res = await authedRequest(
        server,
        seededUsers.user,
        'get',
        `${API_BASE_PATH}`,
      );
      expect(res.status).toBe(403);
    });
  });

  describe(`POST ${API_BASE_PATH}`, () => {
    it('should create a new user if admin', async () => {
      const email = 'createByAdmin@example.com';
      const password = 'PasswordNew1.';
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'post',
        `${API_BASE_PATH}`,
        {
          email,
          password,
        });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe(email);
    });

    it('should return 403 if non-admin user tries to create a new user', async () => {
      const email = 'createByUser@example.com';
      const password = 'PasswordNew1.';
      const res = await authedRequest(
        server,
        seededUsers.user,
        'post',
        `${API_BASE_PATH}`,
        {
          email,
          password,
        });
      expect(res.status).toBe(403);
    });
  });

  describe(`PUT ${API_BASE_PATH}/:id`, () => {
    it('should update a user by ID if admin', async () => {
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'put',
        `${API_BASE_PATH}/${seededUsers.user.id}`,
        {
          name: 'name - update',
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'name - update');
    });

    it('should return 403 if non-admin user tries to update another user', async () => {
      const res = await authedRequest(
        server,
        seededUsers.user,
        'put',
        `${API_BASE_PATH}/${seededUsers.user.id}`,
        {
          name: 'name - update',
        });

      expect(res.status).toBe(403);
    });
  });

  describe(`DELETE ${API_BASE_PATH}/:id`, () => {

    it('should delete a user by ID if admin', async () => {
      const userFake = userFixture.build();
      const user = await createUser(prisma, userFake.email, userFake.name, Role.USER, userFake.password);
      const res = await authedRequest(
        server,
        seededUsers.admin,
        'delete',
        `${API_BASE_PATH}/${user.id}`,
      );

      expect(res.status).toBe(204);
    });

    it('should return 403 if non-admin user tries to delete a user', async () => {
      const userFake = userFixture.build();
      const user = await createUser(prisma, userFake.email, userFake.name, Role.USER, userFake.password);
      const res = await authedRequest(
        server,
        seededUsers.user,
        'delete',
        `${API_BASE_PATH}/${user.id}`,
      );

      expect(res.status).toBe(403);
    });
  });
});
