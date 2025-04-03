import request from 'supertest';
import { logger } from '../../../logger/logger';
import { app } from '../../../config/server';

const API_BASE_PATH = '/api/v1/auth';

logger.info('auth.e2e.spec: JEST: 🛡️ Auth E2E');

describe('Auth Routes', () => {
  let email: string;
  let password: string;
  let name: string;

  beforeEach(async () => {
    email = 'register@register.com';
    password = 'passwordRegister1.';
    name = 'register';
  });

  describe(`POST ${API_BASE_PATH}/register`, () => {
    it('should register a new user', async () => {
      const email = 'register@register.com';
      const password = 'passwordRegister1.';
      const res = await request(app).post(`${API_BASE_PATH}/register`).send({
        email,
        password,
        name
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email');
      expect(res.body.email).toBe(email);
    });

    it('should return 400 for duplicate email', async () => {
      const res = await request(app).post(`${API_BASE_PATH}/register`).send({
        email,
        password,
        name
      });

      expect(res.status).toBe(409);
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
        password: 'passwordWrong1.',
      });

      expect(res.status).toBe(401);
    });
  });
});
