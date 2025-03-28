import { PrismaClient } from "@prisma/client";
import { UserService } from "../services/user.service";
import { PrismaUserRepository } from "../repositories/user/PrismaUserRepository";
import { Container } from "../container";
import { UserModel } from "../models/user.model";

// user.service.integration.spec.ts
describe('UserService Integration', () => {
    let prisma: PrismaClient;
    let service: UserService;

    beforeAll(async () => {
        prisma = new PrismaClient();
        await prisma.$connect();
        service = new UserService(new PrismaUserRepository(Container.getPrismaClient(),
            Container.getPrismaClient().user,
            UserModel.name,
            UserModel.defaultFields,
            UserModel.searchableFields));
    });

    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    it('should create and retrieve user', async () => {
        const created = await service.create('test@test.com', 'ValidPass123!', 'Test User', 'USER', true);

        const found = await service.findById(created.id);
        expect(found?.email).toBe('test@test.com');
    });
});