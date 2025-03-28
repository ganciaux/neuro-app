import { IUserRepository } from "../repositories/user/IUserRepository";
import { UserService } from "../services/user.service";

// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    repositoryMock = {
      find: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      create: jest.fn(),
      existsById: jest.fn(),
      existsByEmail: jest.fn(),
      findByCriteria: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findByRole: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      findById: jest.fn()
    };
    service = new UserService(repositoryMock);
  });

  it('should enforce password complexity', async () => {
    await expect(
      service.create('test@test.com', '123', 'Test User', 'USER', true)
    ).rejects.toThrow('Password must be at least 6 characters long');
  });
});