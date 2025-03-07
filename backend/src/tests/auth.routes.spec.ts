import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
    let authToken: string;
    beforeAll(async () => {
        
    });

    beforeEach(async () => {
        
    });

    afterAll(async () => {
        
    });

    it('should register a new user', async () => {
        const email=`test${Math.random()}@example.com`;
        const res = await request(app)
            .post('/v1/auth/register')
            .send({
                email ,
                password: 'password123',
                name: 'Test User',
            });

        expect(res.status).toBe(201);
        expect(res.body.email).toBe(email);

        const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
        expect(user).not.toBeNull();
    });

    it('should login a user and return a token', async () => {
        const res = await request(app)
            .post('/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token;
    });

});
