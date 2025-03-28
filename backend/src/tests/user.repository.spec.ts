import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import { PrismaUserRepository } from "../repositories/user/PrismaUserRepository";
import { UserModel } from "../models/user.model";

describe('UserRepository', () => {
    let repository: PrismaUserRepository;
    const prismaMock = mockDeep<PrismaClient>();

    beforeEach(() => {
        mockReset(prismaMock);
        repository = new PrismaUserRepository(
            prismaMock,
            prismaMock.user,
            UserModel.name,
            UserModel.defaultFields,
            UserModel.searchableFields,
        );
    });

    it('should find user by id', async () => {
        prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', name: 'Test User', createdAt: new Date(), updatedAt: new Date(), passwordHash: '123', passwordSalt: '123', role: 'USER', isActive: true });

        const user = await repository.findById('1');

        expect(user).toEqual({ id: '1', email: 'test@test.com', name: 'Test User', createdAt: new Date(), updatedAt: new Date(), passwordHash: '123', passwordSalt: '123', role: 'USER', isActive: true });
        expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
            where: { id: '1' }
        });
    });
});