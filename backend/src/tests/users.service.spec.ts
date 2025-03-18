
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { UserService } from '../services/user.service';
import { server } from '..';
import { logger } from '../logger/logger';
import { User } from '@prisma/client';
import { UserRole } from '../models/user.model';
import { UserUpdateFailedError } from '../errors/user.errors';
import { UserCreationFailedError } from '../errors/user.errors';
import { UserFetchByEmailFailedError } from '../errors/user.errors';

// Mock Prisma et bcrypt
jest.mock('../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('bcryptjs');

logger.info('users.service.spec: JEST: 🪪 User Service');

describe('UserService', () => {

  let userService:UserService;

  const mockUser = (user: Partial<User>) => ({
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    passwordSalt: 'salt',
    name: 'Test User',
    role: UserRole.USER,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...user,
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  beforeEach(() => {
    userService = UserService.getInstance();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks(); // Restaure les mocks
  });

  describe('Hello', () => {
    it('should return hello', () => {
      expect(userService.hello()).toBe('user.service: hello');
    });
  });

  describe('isValidUserId', () => {
    it('should return true for a valid UUID', () => {
      expect(userService.isValidUserId('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      expect(userService.isValidUserId('invalid-id')).toBe(false);
    });
  });

  // Tests for isValidEmail
  describe('isValidEmail', () => {
    it('should return true for a valid email', () => {
      expect(userService.isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for an invalid email', () => {
      expect(userService.isValidEmail('invalid-email')).toBe(false);
    });
  });

  // Tests for isPasswordStrongEnough
  describe('isPasswordStrongEnough', () => {
    it('should return true for a strong password', () => {
      expect(userService.isPasswordStrongEnough('Password1!')).toBe(true);
    });

    it('should return false for a weak password', () => {
      expect(userService.isPasswordStrongEnough('weak')).toBe(false);
    });
  });

  // Tests for userExistsByEmail
  describe('userExistsByEmail', () => {
    it('should return false for an invalid email', async () => {
      const result = await userService.userExistsByEmail('invalid-email');
      expect(result).toBe(false);
    });

    it('should return true if the user exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await userService.userExistsByEmail('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false if the user does not exist', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await userService.userExistsByEmail('test@example.com');
      expect(result).toBe(false);
    });

    it('should handle Prisma errors', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));
      await expect(userService.userExistsByEmail('test@example.com')).rejects.toThrow(
        UserFetchByEmailFailedError,
      );
    });
  });

  // Tests for createUser
  describe('createUser', () => {
    it('should throw an error for an invalid email', async () => {
      await expect(userService.createUser('invalid-email', 'Password1!')).rejects.toThrow(
        UserCreationFailedError,
      );
    });

    it('should throw an error for a weak password', async () => {
      await expect(userService.createUser('test@example.com', 'weak')).rejects.toThrow(
        UserCreationFailedError,
      );
    });

    it('should throw an error if the email is already in use', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      await expect(userService.createUser('test@example.com', 'Password1!')).rejects.toThrow(
        UserCreationFailedError,
      );
    });

    it('should create a user successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser({}));
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const user = await userService.createUser('test@example.com', 'Password1!');
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });
  });

  // Tests for updateUserPassword
  describe('updateUserPassword', () => {
    it('should throw an error for an invalid user ID', async () => {
      await expect(
        userService.updateUserPassword('invalid-id', 'currentPassword', 'newPassword'),
      ).rejects.toThrow(UserUpdateFailedError);
    });

    it('should throw an error if the current password is incorrect', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser({ passwordHash: 'hashedPassword' }),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.updateUserPassword('1', 'wrongPassword', 'newPassword'),
      ).rejects.toThrow(UserUpdateFailedError);
    });

    it('should update the password successfully', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(
        mockUser({ passwordHash: 'hashedPassword' }),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('newSalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser({}));

      const user = await userService.updateUserPassword('1', 'currentPassword', 'newPassword');
      expect(user).toBeDefined();
    });
  });

  /*
  // Tests for findUsersByRole
  describe('findUsersByRole', () => {
    it('should return users with the specified role', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser({ role: UserRole.ADMIN })]);
      const result = await userService.findUsersByRole(UserRole.ADMIN);
      expect(result.items.length).toBe(1);
      expect(result.items[0].role).toBe(UserRole.ADMIN);
    });
  });
  */
  // Tests for deactivateUser and reactivateUser
  describe('deactivateUser and reactivateUser', () => {
    it('should deactivate a user', async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser({ isActive: false }));
      const user = await userService.deactivateUser('1');
      expect(user.isActive).toBe(false);
    });

    it('should reactivate a user', async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser({ isActive: true }));
      const user = await userService.reactivateUser('1');
      expect(user.isActive).toBe(true);
    });
  });
});