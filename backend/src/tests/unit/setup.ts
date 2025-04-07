// tests/unit/setup.ts
import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../../repositories/user/IUserRepository';

export const userRepositoryMock = {
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  existsById: jest.fn(),
  existsByEmail: jest.fn(),
  findByCriteria: jest.fn(),
  findByEmail: jest.fn(),
  findAll: jest.fn(),
  findByRole: jest.fn(),
  search: jest.fn(),
} as jest.Mocked<IUserRepository>;

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    genSalt: jest.fn((rounds: number) => Promise.resolve('mockedSalt')),
    hash: jest.fn((data: string, salt: string) =>
      Promise.resolve('mockedHash'),
    ),
    compare: jest.fn((data: string, encrypted: string) =>
      Promise.resolve(true),
    ),
  },
}));

export const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

beforeEach(() => {
  jest.clearAllMocks();
});
