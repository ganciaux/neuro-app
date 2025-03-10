import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
    const email="test@test.com";
    const password="passwordTest"

    describe('POST /v1/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/v1/auth/register')
                .send({
                    email,
                    password,
                    name: 'Test',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');

            expect(res.body.email).toBe("test@test.com");

            const user = await prisma.user.findUnique({ where: { email } });
            expect(user).not.toBeNull();
        });

        it('should return 400 for duplicate email', async () => {
            const res = await request(app)
                .post('/v1/auth/register')
                .send({
                    email,
                    password,
                });
        
            expect(res.status).toBe(400);
        });
    });

    describe('POST /v1/login', () => {
        it('should login a user and return a token', async () => {
            const res = await request(app)
                .post('/v1/auth/login')
                .send({
                    email,
                    password
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 401 for invalid credentials', async () => {
            const res = await request(app)
                .post('/v1/auth/login')
                .send({
                    email,
                    password: 'passwordWrong',
                });
        
            expect(res.status).toBe(401);
        });
    });

});

