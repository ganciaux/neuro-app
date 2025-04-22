import { PrismaClient, Role, User } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';
import { createMockPrisma, createMockUser, createUser, createUserWithPasswordAndToken, seedUsersTestData, withPasswordAndToken } from '../../test-helpers';
import { UserWithPasswordAndToken } from '../../../models/user.model';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('User Helpers', () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let mockUser: User;
  
  beforeEach(() => {
    prismaMock = createMockPrisma();
    mockUser = createMockUser();
    prismaMock.user.create.mockResolvedValue(mockUser);
  });

  it('should create a user', async () => {
    const user = await createUser(prismaMock, mockUser.email, mockUser.name, mockUser.role, 'password');
    expect(user).toEqual(mockUser);
  });

  it('should create a user with password and token', async () => {
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    const user = await createUserWithPasswordAndToken(prismaMock, mockUser.email, mockUser.name, mockUser.role, 'password');
    expect(user).toMatchObject(mockUser);
    expect(user.token).toEqual("mock-token");
    expect(user.password).toEqual("password");
  });

  it("Shoud generate a token", () => {
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    const user: UserWithPasswordAndToken = withPasswordAndToken(mockUser, 'password');
    expect(user.token).toEqual("mock-token");
  });

  it("should create seed users", async () => {
    (jwt.sign as jest.Mock).mockReturnValue('mock-token');
    const users = await seedUsersTestData(prismaMock);
    expect(users).toHaveProperty('admin');
    expect(users).toHaveProperty('user');
    expect(users.admin.token).toEqual("mock-token");
    expect(users.user.token).toEqual("mock-token");
  });
});