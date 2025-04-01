import request from 'supertest';
import { app } from '../index';
import { logger } from '../logger/logger';

const API_BASE_PATH = '/api/v1/auth';

logger.info('aut.e2e.spec: JEST: 🛡️ Auth E2E');

describe.skip('Auth Routes', () => {
  let email: string;
  let password: string;

  beforeAll(async () => {
    email = 'test@test.com';
    password = 'passwordTest';
  });

  describe(`TODO`, () => {
    it('TODO', async () => {
    });
  });

  /*
  describe(`POST ${API_BASE_PATH}/register`, () => {
    it('should register a new user', async () => {
      const res = await request(app).post(`${API_BASE_PATH}/register`).send({
        email,
        password,
        name: 'Test',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');

      expect(res.body.email).toBe('test@test.com');

      const user = await prisma.user.findUnique({ where: { email } });
      expect(user).not.toBeNull();
    });

    it('should return 400 for duplicate email', async () => {
      const res = await request(app).post(`${API_BASE_PATH}/register`).send({
        email,
        password,
      });

      expect(res.status).toBe(400);
    });
  });

  describe(`POST ${API_BASE_PATH}/login`, () => {
    it('should login a user and return a token', async () => {
      const res = await request(app).post(`${API_BASE_PATH}/login`).send({
        email,
        password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app).post(`${API_BASE_PATH}/login`).send({
        email,
        password: 'passwordWrong',
      });

      expect(res.status).toBe(401);
    });
  });
  */
});
