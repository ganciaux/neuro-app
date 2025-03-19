import { PrismaClient, User } from '@prisma/client';
import { PrismaUserRepository } from '../repositories/user/PrismaUserRepository';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { Container } from '../container';

// Mock PrismaClient
const prismaMock = mockDeep<PrismaClient>();

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;

  beforeEach(() => {
    mockReset(prismaMock);
    repository = new PrismaUserRepository(
      prismaMock,
      Container.getPrismaClient().user,
      'User',
      ['id', 'email', 'name', 'createdAt', 'updatedAt'],
      ['email', 'name'],
    );
  });

  it('should find a user by ID', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashedPassword',
      passwordSalt: 'salt',
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await repository.findById('1');

    expect(user).toEqual(mockUser);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should create a user', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashedPassword',
      passwordSalt: 'salt',
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.create.mockResolvedValue(mockUser);

    const newUser = await repository.create({
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: 'hashedPassword',
      passwordSalt: 'salt',
      role: 'USER',
      isActive: true,
    });

    expect(newUser).toEqual(mockUser);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedPassword',
        passwordSalt: 'salt',
        role: 'USER',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});
