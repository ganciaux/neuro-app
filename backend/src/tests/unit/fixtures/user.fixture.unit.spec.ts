import { PrismaClient, Role, User } from '@prisma/client';
import { userFixture } from '../../fixtures/users';
import { DeepMockProxy } from 'jest-mock-extended';
import { createMockPrisma, createMockUser } from '../../test-helpers';

describe('User Fixtures', () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let mockUser: User;
  
  beforeEach(() => {
    prismaMock = createMockPrisma();
    mockUser = createMockUser();
    prismaMock.user.create.mockResolvedValue(mockUser);
  });

  it('should generate valid user data', () => {
    const user = userFixture.build();
    expect(user.email).toMatch(/@.+\..+/);
    expect(user.password).toMatch(/[A-Z]/);
    expect(user.password).toMatch(/[0-9]/);
    expect(user.password).toMatch(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
  });

  it('should apply overrides correctly', () => {
    const admin = userFixture.build({ role: Role.ADMIN, email: 'admin@example.com', name: 'Admin User', password: 'AdminPass123!', isActive: true });
    expect(admin.role).toBe(Role.ADMIN);
    expect(admin.email).toBe('admin@example.com');
    expect(admin.name).toBe('Admin User');
    expect(admin.password).toBe('AdminPass123!');
    expect(admin.isActive).toBe(true);
  });

  it('should generate unique emails', () => {
    const user1 = userFixture.build();
    const user2 = userFixture.build();
    expect(user1.email).not.toBe(user2.email);
  });

  it('should create a user with a unique email', async () => {
    prismaMock.user.create.mockResolvedValue(mockUser);
    const user = await userFixture.create(prismaMock);
    expect(user).toEqual(mockUser);
  });

});