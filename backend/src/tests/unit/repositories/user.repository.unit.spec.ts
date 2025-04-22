import { PrismaClient, Role, User } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import { PrismaUserRepository } from '../../../repositories/user/PrismaUserRepository';
import { UserModel } from '../../../models/user.model';
import { createMockPrisma, createMockUser } from '../../test-helpers';
import { PaginatedResult } from '../../../common/types';

describe('UserRepository', () => {
  let repository: PrismaUserRepository;
  let mockUser: User;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    jest.resetAllMocks();
    prismaMock = createMockPrisma();
    repository = new PrismaUserRepository(
      prismaMock,
      prismaMock.user,
      UserModel.name,
      UserModel.defaultFields,
      UserModel.searchableFields,
    );

    mockUser = createMockUser();
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
  });

  afterEach(() => {});

  it('should find user by email', async () => {
    const user = await repository.findByEmail(mockUser.email);
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
    expect(user).toEqual(mockUser);
  });

  it('should find user by id', async () => {
    const user = await repository.findById(mockUser.id);
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
    expect(user).toEqual(mockUser);
  });

  it('should find user by criteria (email)', async () => {
    const user = await repository.findByCriteria({ email: mockUser.email });
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUser.email },
    });
    expect(user).toEqual(mockUser);
  });

  it('should find user by criteria (id)', async () => {
    const user = await repository.findByCriteria({ id: mockUser.id });
    expect(prismaMock.user.findUnique).toHaveBeenCalled();
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: mockUser.id },
    });
    expect(user).toEqual(mockUser);
  });

  it('should find all users', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const users = await repository.findAll();

    expect(users).toEqual([mockUser]);
  });

  it('should find users by role', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const users = await repository.findByRole(Role.USER);

    expect(users).toEqual([mockUser]);
  });

  it('should search users', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const users = await repository.search({ email: mockUser.email });

    expect(users).toEqual([mockUser]);
  });

  it('should create user', async () => {
    prismaMock.user.create.mockResolvedValue(mockUser);

    const user = await repository.create(mockUser);

    expect(user).toEqual(mockUser);
  });

  it('should update user', async () => {
    prismaMock.user.update.mockResolvedValue(mockUser);

    const user = await repository.update(mockUser.id, mockUser);

    expect(user).toEqual(mockUser);
  });

  it('should delete user', async () => {
    prismaMock.user.delete.mockResolvedValue(mockUser);

    const user = await repository.delete(mockUser.id);
  });

  it('should count users', async () => {
    prismaMock.user.count.mockResolvedValue(1);

    const count = await repository.count();

    expect(count).toEqual(1);
  });

  it('should find users by pagination', async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);
    prismaMock.user.count.mockResolvedValue(1);

    const result = await repository.findAll(undefined, {
      page: 1,
      pageSize: 10,
    });

    expect(prismaMock.user.findMany).toHaveBeenCalled();
    expect(prismaMock.user.count).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(false);
    expect(result).toHaveProperty('data');
    expect((result as PaginatedResult<User>).data).toEqual([mockUser]);
  });

  it('should return paginated result when pagination is enabled', async () => {
    const paginatedResult: PaginatedResult<User> = {
      data: [mockUser],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };

    prismaMock.user.count.mockResolvedValue(1);
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const result = await repository.findAll(undefined, {
      page: 1,
      pageSize: 10,
    });

    expect(prismaMock.user.findMany).toHaveBeenCalled();
    expect(prismaMock.user.count).toHaveBeenCalled();

    expect(Array.isArray(result)).toBe(false);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('pageSize');
    expect(result).toHaveProperty('totalPages');
  });
});
