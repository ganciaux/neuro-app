import request from 'supertest';
import { app } from '../../config/server';
import { logger } from '../../logger/logger';
import { createTestUser } from '../setup';
import { UserTestData } from '../../models/user.model';
import { Role } from '@prisma/client';
import { Container } from '../../container';

const userRepository = Container.getUserRepository();

const API_BASE_PATH = '/api/v1/users';

logger.info('users.e2e.spec: JEST: 🪪 User E2E');

describe('User Routes', () => {
  describe(`GET ${API_BASE_PATH}/me`, () => {
    it('should get current user profile', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}/me`)
        .set('Authorization', `Bearer ${globalThis.user.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', globalThis.user.email);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get(`${API_BASE_PATH}/me`);

      expect(res.status).toBe(401);
    });
  });

  describe(`GET ${API_BASE_PATH}/:id`, () => {
    it('should return a user by ID (admin)', async () => {

      const res = await request(app)
        .get(`${API_BASE_PATH}/${globalThis.admin.user.id}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id', globalThis.admin.user.id);
    });

    it('should return 400 if user has bad ID (admin)', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}/nonexistentid`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(400);
    });

    it('should return 404 if user does not exist (admin)', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}/c8cdf9ed-ef91-4203-942c-0d931157e1e1`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(404);
    });
  });
  
  describe(`GET ${API_BASE_PATH}`, () => {
    it('should return all users when requested by an admin', async () => {
      const totalUsers = await userRepository.count();
      const res = await request(app)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.total	).toBe(totalUsers);
    });

    it('should return 403 when a non-admin user tries to get all users', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`);

      expect(res.status).toBe(403);
    });
  });
  

  describe(`POST ${API_BASE_PATH}`, () => {
    it('should create a new user if admin', async () => {
      const email = 'createByAdmin@example.com';
      const password = 'PasswordNew1.';
      const res = await request(app)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`)
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
      const res = await request(app)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`)
        .send({
          email,
          password,
        });

      expect(res.status).toBe(403);
    });
  });
  

  describe(`PUT ${API_BASE_PATH}/:id`, () => {
    it('should update a user by ID if admin', async () => {
      const res = await request(app)
        .put(`${API_BASE_PATH}/${globalThis.user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`)
        .send({
          name: 'name - update',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'name - update');
    });

    it('should return 403 if non-admin user tries to update another user', async () => {
      const res = await request(app)
        .put(`${API_BASE_PATH}/${globalThis.user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`)
        .send({
          name: 'name - update',
        });

      expect(res.status).toBe(403);
    });
  });
  
  describe(`DELETE ${API_BASE_PATH}/:id`, () => {
    let user: UserTestData;

    beforeEach(async () => {
      user = await createTestUser(
        'delete@delete.com',
        'PasswordDelete1.',
        'delete',
        Role.USER,
        false,
      );
    });

    it('should delete a user by ID if admin', async () => {
      const res = await request(app)
        .delete(`${API_BASE_PATH}/${user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 if non-admin user tries to delete a user', async () => {
      const res = await request(app)
        .delete(`${API_BASE_PATH}/${user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`);

      expect(res.status).toBe(403);
    });
  });
  
});
