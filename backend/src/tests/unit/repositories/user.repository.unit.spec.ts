import { Role, User } from '@prisma/client';
import { mockReset } from 'jest-mock-extended';
import { PrismaUserRepository } from '../../../repositories/user/PrismaUserRepository';
import { UserModel } from '../../../models/user.model';
import { prismaMock } from '../../test-helpers';

describe('UserRepository', () => {
  let repository: PrismaUserRepository;
  let mockUser: User;
  let date: Date;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReset(prismaMock);
    repository = new PrismaUserRepository(
      prismaMock,
      prismaMock.user,
      UserModel.name,
      UserModel.defaultFields,
      UserModel.searchableFields,
    );

    date = new Date();
    mockUser = {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      createdAt: date,
      updatedAt: date,
      passwordHash: 'mockedHashedPassword',
      passwordSalt: 'mockedSalt',
      role: Role.USER,
      isActive: true,
    };
  });

  it('should find user by id', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await repository.findById(mockUser.id);

    expect(user).toEqual(mockUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
