import request from 'supertest';
import { PrismaClient, User } from '@prisma/client';
import { Server } from 'http';
import { logger } from '../../../logger/logger';
import { Container } from '../../../container';
import { authedRequest, unauthedRequest } from '../../utils/test-utils';
import { seedUsersTestData, startTestApp, stopTestApp } from '../../test-helpers';
import { SeededUsers } from '../../../models/user.model';
import { app } from '../../../config/server';

const userRepository = Container.getUserRepository();

const API_BASE_PATH = '/api/v1/users';

logger.info('users.e2e.spec: JEST: 🪪 User E2E');

describe('User Routes', () => {
  let server: Server;
  let prisma: PrismaClient;
  let seededUsers: SeededUsers;

  beforeAll(async () => {
    ({ server, prisma } = await startTestApp(app));
    seededUsers = await seedUsersTestData(prisma);
  });

  afterAll(async () => {
    await stopTestApp(server, prisma);
  });
  
  describe(`GET ${API_BASE_PATH}/me`, () => {
    it('should get current user profile', async () => {
      const res = await authedRequest(server, seededUsers.user, 'get', `${API_BASE_PATH}/me`);
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

      const res = await request(server)
        .get(`${API_BASE_PATH}/${seededUsers.admin.id}`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`);

        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', seededUsers.admin.id);
    });

    it('should return 400 if user has bad ID (admin)', async () => {
      const res = await request(server)
        .get(`${API_BASE_PATH}/nonexistentid`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`);

      expect(res.status).toBe(400);
    });

    it('should return 404 if user does not exist (admin)', async () => {
      const res = await request(server)
        .get(`${API_BASE_PATH}/c8cdf9ed-ef91-4203-942c-0d931157e1e1`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`);

      expect(res.status).toBe(404);
    });
  });
  
  describe(`GET ${API_BASE_PATH}`, () => {
    it('should return all users when requested by an admin', async () => {
      const totalUsers = await userRepository.count();
      const res = await request(server)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total	).toBe(totalUsers);
    });

    it('should return 403 when a non-admin user tries to get all users', async () => {
      const res = await request(server)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${seededUsers.user.token}`);

      expect(res.status).toBe(403);
    });
  });
  

  describe(`POST ${API_BASE_PATH}`, () => {
    it('should create a new user if admin', async () => {
      const email = 'createByAdmin@example.com';
      const password = 'PasswordNew1.';
      const res = await request(server)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`)
        .send({
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
      const res = await request(server)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${seededUsers.user.token}`)
        .send({
          email,
          password,
        });

      expect(res.status).toBe(403);
    });
  });
  

  describe(`PUT ${API_BASE_PATH}/:id`, () => {
    it('should update a user by ID if admin', async () => {
      const res = await request(server)
        .put(`${API_BASE_PATH}/${seededUsers.user.id}`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`)
        .send({
          name: 'name - update',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'name - update');
    });

    it('should return 403 if non-admin user tries to update another user', async () => {
      const res = await request(server)
        .put(`${API_BASE_PATH}/${seededUsers.user.id}`)
        .set('Authorization', `Bearer ${seededUsers.user.token}`)
        .send({
          name: 'name - update',
        });

      expect(res.status).toBe(403);
    });
  });
  
  describe(`DELETE ${API_BASE_PATH}/:id`, () => {
    let user: User;

    beforeEach(async () => {
     user={} as User;
    });

    it('should delete a user by ID if admin', async () => {
      const res = await request(server)
        .delete(`${API_BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${seededUsers.admin.token}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 if non-admin user tries to delete a user', async () => {
      const res = await request(server)
        .delete(`${API_BASE_PATH}/${user.id}`)
        .set('Authorization', `Bearer ${seededUsers.user.token}`);

      expect(res.status).toBe(403);
    });
  });
  
});
