import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient, Role, User } from "@prisma/client";
import { UserService } from "../services/user.service";
import { PrismaUserRepository } from "../repositories/user/PrismaUserRepository";
import { Container } from "../container";
import { UserModel, UserPublicDto } from "../models/user.model";

const envPath = path.resolve(process.cwd(), '.env.test');
dotenv.config({ path: envPath, override: true });

describe('UserService Integration', () => {
    let prisma: PrismaClient;
    let service: UserService;
    let email: string;
    let password: string;
    let name: string;
    let role: Role;
    let isActive: true;
    let user: User;
    let publicUser: UserPublicDto;
    let date: Date;

    beforeAll(async () => {
        service = new UserService(new PrismaUserRepository(Container.getPrismaClient(),
            Container.getPrismaClient().user,
            UserModel.name,
            UserModel.defaultFields,
            UserModel.searchableFields));

        date = new Date();
        email = 'test@test.com';
        password = 'Password-123';
        name = 'Test User';
        role = Role.USER;
        isActive = true;
    });

    it('should create and retrieve user', async () => {
        const created = await service.create(email, password, name, role, isActive);
        const found = await service.findById(created.id);
        expect(found?.email).toBe(email);
    });
});