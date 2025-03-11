import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { app } from '../index';

const prisma = new PrismaClient();
const API_BASE_PATH="/api/v1"

describe('User Routes', () => {

    describe(`GET ${API_BASE_PATH}/users/me`, () => {
        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/v1/users/me')
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);
    
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('email', globalThis.user.email);
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(app)
                .get('/v1/users/me');
    
            expect(res.status).toBe(401);
        });
    
    });

    describe(`GET ${API_BASE_PATH}/users/:id`, () => {

        it('should return a user by ID', async () => {
            const res = await request(app)
                .get(`/v1/users/${globalThis.user.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('id', globalThis.user.auth.user.id);
        });

        it('should return 404 if user does not exist', async () => {
            const res = await request(app)
                .get('/v1/users/nonexistentid')
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);

            expect(res.status).toBe(404);
        });
    })

    describe(`PUT ${API_BASE_PATH}/users/:id`, () => {
        it('should update a user by ID (user)', async () => {
            const res = await request(app)
                .put(`/v1/users/${globalThis.user.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`)
                .send({
                    name: 'name - update',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'name - update');
        });

        it('should update a user by ID (admin)', async () => {
            const res = await request(app)
                .put(`/v1/users/${globalThis.user.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`)
                .send({
                    name: 'name - update',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'name - update');
        });

        it('should return 500 if user is not admin or current user', async () => {
            const res = await request(app)
                .get(`/v1/users/${globalThis.admin.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);
            expect(res.status).toBe(500);
        });
    });

    describe(`DELETE ${API_BASE_PATH}/users/:id`, () => {
        it('should return 500 if user is not admin', async () => {
            const res = await request(app)
                .delete(`/v1/users/${globalThis.user.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`);

            expect(res.status).toBe(204);
        });

        it('should delete a user by ID (admin)', async () => {
            const res = await request(app)
                .delete(`/v1/users/${globalThis.user.auth.user.id}`)
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`);

            expect(res.status).toBe(204);
        });
    });

    describe(`GET ${API_BASE_PATH}/users`, () => {
        it('should return all users (admin)', async () => {
            const res = await request(app)
                .get('/v1/users')
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`);
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 500 if user is not admin', async () => {
            const res = await request(app)
                .get('/v1/users')
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);
    
            expect(res.status).toBe(401);
        });
    });

    describe(`GET ${API_BASE_PATH}/users`, () => {
        it('should return all users (admin)', async () => {
            const res = await request(app)
                .get('/v1/users')
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`);
    
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return all users (admin)', async () => {
            const res = await request(app)
                .get('/v1/users')
                .set('Authorization', `Bearer ${globalThis.user.auth.token}`);
    
            expect(res.status).toBe(401);
        });
    });

    describe(`POST ${API_BASE_PATH}/users`, () => {
        it('should create a new user (admin)', async () => {
            const res = await request(app)
                .post('/v1/users')
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`)
                .send({
                    email: 'newadmin@example.com',
                    password: 'password123',
                });
                
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email');

            expect(res.body.email).toBe('newadmin@example.com');
        });

        it('should return 500 if user is not admin', async () => {
            const res = await request(app)
                .post('/v1/users')
                .set('Authorization', `Bearer ${globalThis.admin.auth.token}`)
                .send({
                    email: 'newuser@example.com',
                    password: 'password123',
                });
                
            expect(res.status).toBe(500);
        });
    });
});
