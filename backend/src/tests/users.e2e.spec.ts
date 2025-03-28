import request from 'supertest';
import { app } from '../index';
import { logger } from '../logger/logger';
import { createTestUser } from './setup';
import { UserTestData } from '../models/user.model';

const API_BASE_PATH = '/api/v1/users';

logger.info('users.e2e.spec: JEST: 🪪 User E2E');

describe.skip('User Routes', () => {
  /*
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

  describe(`GET ${API_BASE_PATH}`, () => {
    it('should return all users (admin)', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return all users (user)', async () => {
      const res = await request(app)
        .get(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`);

      expect(res.status).toBe(403);
    });
  });

  describe(`POST ${API_BASE_PATH}`, () => {
    it('should create a new user (admin)', async () => {
      const res = await request(app)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`)
        .send({
          email: 'newadmin@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');

      expect(res.body.email).toBe('newadmin@example.com');
    });

    it('should return 403 (user)', async () => {
      const res = await request(app)
        .post(`${API_BASE_PATH}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(403);
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

  describe(`PUT ${API_BASE_PATH}/:id`, () => {
    it('should update a user by ID (admin)', async () => {
      const res = await request(app)
        .put(`${API_BASE_PATH}/${globalThis.user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`)
        .send({
          name: 'name - update',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'name - update');
    });

    it('should update a user by ID (user)', async () => {
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
        'password',
        'delete',
        UserRole.USER,
        false,
      );
    });

    afterEach(async () => {
      await deleteUser(user.user.id);
    });

    it('should delete a user by ID (admin)', async () => {
      const res = await request(app)
        .delete(`${API_BASE_PATH}/${user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.admin.token}`);

      expect(res.status).toBe(204);
    });

    it('should return 403 (user)', async () => {
      const res = await request(app)
        .delete(`${API_BASE_PATH}/${user.user.id}`)
        .set('Authorization', `Bearer ${globalThis.user.token}`);

      expect(res.status).toBe(403);
    });
  });
  */
});
