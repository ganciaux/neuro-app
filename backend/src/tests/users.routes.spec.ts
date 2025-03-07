import request from 'supertest';
import {app, server} from '../index'; // Assurez-vous que l'application est correctement exportée
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User Routes', () => {
    
    beforeAll(async () => {});

    it('should get current user profile', async () => {});
   
    afterAll(async () => {
        //await prisma.$disconnect(); 
        //await server.close();
    });
});