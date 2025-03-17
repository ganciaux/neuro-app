import { Prisma, User } from '@prisma/client';
import {
  BaseService,
  BaseFilterOptions,
  PaginationOptions,
  PaginatedResult,
} from './base.service';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import { APP_ENV } from '../config/environment';
import {
  UserCreationFailedError,
  UserFetchByEmailFailedError,
  UserFetchByIdFailedError,
  UserFetchFailedError,
  UserUpdateFailedError,
} from '../errors/user.errors';
import {
  UserFilterOptions,
  UserPublic,
  userPublicSelect,
  UserRole,
} from '../models/user.model';

/**
 * Service for managing users
 */
class UserService extends BaseService<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserOrderByWithRelationInput,
  UserFilterOptions
> {
  private static instance: UserService;
  private static readonly USER_ID_REGEX = /^[0-9a-fA-F-]{36}$/;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Constructor for the UserService class
   */ 
  private constructor() {
    super(
      prisma,
      prisma.user,
      'User',
      ['name', 'email', 'role', 'createdAt', 'updatedAt'],
      ['name', 'email'], // Fields for search
    );
  }

  /**
   * Static method to get the singleton instance of the service
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Checks if a user ID is valid
   */
  isValidUserId(userId: string): boolean {
    return !!userId && UserService.USER_ID_REGEX.test(userId);
  }

  /**
   * Validates an email address
   */
  isValidEmail(email: string): boolean {
    return !!email && UserService.EMAIL_REGEX.test(email);
  }

  /**
   * Checks if a password is strong enough
   */
  isPasswordStrongEnough(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Overrides the buildFilter method to add user-specific filters
   */
  protected buildFilter(options?: UserFilterOptions): Prisma.UserWhereInput {
    const filter = super.buildFilter(options) as Prisma.UserWhereInput;

    if (!options) return filter;

    if (options.role !== undefined) {
      filter.role = options.role;
    }

    if (options.isActive !== undefined) {
      filter.isActive = options.isActive;
    }

    return filter;
  }

  /**
   * Checks if a user exists by email
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    if (!this.isValidEmail(email)) {
      return false;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      return !!user;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to check user existence by email',
        UserFetchByEmailFailedError,
        email,
      );
    }
  }

  /**
   * Finds a user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    if (!this.isValidEmail(email)) {
      return null;
    }

    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to fetch user by email',
        UserFetchByEmailFailedError,
        email,
      );
    }
  }

  /**
   * Finds public user data by ID
   */
  async findUserPublicById(userId: string): Promise<UserPublic | null> {
    if (!this.isValidUserId(userId)) {
      return null;
    }

    try {
      return (await prisma.user.findUnique({
        where: { id: userId },
        select: userPublicSelect,
      })) as UserPublic | null;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to fetch user by id',
        UserFetchByIdFailedError,
        userId,
      );
    }
  }

  /**
   * Finds a user by criteria
   */
  async findUser(criteria: {
    email?: string;
    id?: string;
  }): Promise<User | null> {
    if (
      (criteria.id && !this.isValidUserId(criteria.id)) ||
      (criteria.email && !this.isValidEmail(criteria.email))
    ) {
      return null;
    }

    if (!criteria.id && !criteria.email) {
      return null;
    }

    try {
      const where = criteria.id
        ? { id: criteria.id }
        : { email: criteria.email };
      return await prisma.user.findUnique({ where });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to fetch user',
        UserFetchFailedError,
        criteria.email || criteria.id || 'unknown',
      );
    }
  }

  /**
   * Finds all users with public data only
   */
  async findAllPublic(
    paginationOptions?: Partial<PaginationOptions>,
    filterOptions?: UserFilterOptions,
  ): Promise<PaginatedResult<UserPublic>> {
    return this.findAll(
      paginationOptions,
      filterOptions,
      userPublicSelect,
    ) as Promise<PaginatedResult<UserPublic>>;
  }

  /**
   * Validates new user data
   */
  private validateNewUserData(email: string, password: string): void {
    if (!this.isValidEmail(email)) {
      throw new UserCreationFailedError(
        email || 'invalid',
        'Invalid email format',
      );
    }

    if (!password || !this.isPasswordStrongEnough(password)) {
      throw new UserCreationFailedError(
        email,
        'Password must be at least 6 characters long',
      );
    }
  }

  /**
   * Creates a new user
   */
  async createUser(
    email: string,
    password: string,
    name: string = '',
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    this.validateNewUserData(email, password);

    try {
      // Check if the user already exists
      const userExists = await this.userExistsByEmail(email);
      if (userExists) {
        throw new UserCreationFailedError(email, 'Email already in use');
      }

      const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          passwordSalt: salt,
          name: name || email.split('@')[0], // Use the local part of the email if name is not provided
          role,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof UserCreationFailedError) {
        throw error;
      }

      this.handlePrismaError(
        error,
        'Failed to create user',
        UserCreationFailedError,
        email,
      );
    }
  }

  /**
   * Securely updates a user (excludes sensitive fields)
   */
  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    if (!this.isValidUserId(userId)) {
      throw new UserUpdateFailedError(userId, 'Invalid user ID format');
    }

    try {
      // Check if the user exists
      const user = await this.findById(userId);
      if (!user) {
        throw new UserUpdateFailedError(userId, 'User not found');
      }

      if (data.email) {
        const userExists = await this.userExistsByEmail(data.email);
        if (userExists) {
          throw new UserCreationFailedError(data.email, 'Email already in use');
        }
      }

      // Prevent updating sensitive fields
      const { id, createdAt, passwordHash, passwordSalt, ...updateData } = data;

      return await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to update user',
        UserUpdateFailedError,
        userId,
      );
    }
  }

  /**
   * Updates a user's password
   */
  async updateUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
    if (!this.isValidUserId(userId)) {
      throw new UserUpdateFailedError(userId, 'Invalid user ID format');
    }

    if (!currentPassword) {
      throw new UserUpdateFailedError(userId, 'Current password is required');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new UserUpdateFailedError(
        userId,
        'Password must be at least 6 characters long',
      );
    }

    try {
      // Check if the user exists
      const user = await this.findById(userId);
      if (!user) {
        throw new UserUpdateFailedError(userId, 'User not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );
      if (!isCurrentPasswordValid) {
        throw new UserUpdateFailedError(userId, 'Current password is incorrect');
      }

      const salt = await bcrypt.genSalt(APP_ENV.PASSWORD_SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      return await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: hashedPassword,
          passwordSalt: salt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Failed to update user password',
        UserUpdateFailedError,
        userId,
      );
    }
  }

  /**
   * Converts a full user to a public version
   */
  toUserPublic(user: User): UserPublic {
    const { passwordHash, passwordSalt, ...userPublic } = user;
    return userPublic;
  }

  /**
   * Verifies if a password matches a user's password
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user || !password) return false;

    try {
      return await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
      return false;
    }
  }

  /**
   * Finds users by role
   */
  async findUsersByRole(
    role: UserRole,
    pagination?: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<UserPublic>> {
    return this.findAllPublic(pagination, { role });
  }

  /**
   * Searches users by search term (name or email)
   */
  async searchUsers(
    searchTerm: string,
    pagination?: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<UserPublic>> {
    return this.findAllPublic(pagination, { searchTerm });
  }

  /**
   * Deactivates a user (soft delete)
   */
  async deactivateUser(userId: string): Promise<User> {
    if (!this.isValidUserId(userId)) {
      throw new UserUpdateFailedError(userId, 'Invalid user ID format');
    }

    return this.updateUser(userId, { isActive: false });
  }

  /**
   * Reactivates a user
   */
  async reactivateUser(userId: string): Promise<User> {
    if (!this.isValidUserId(userId)) {
      throw new UserUpdateFailedError(userId, 'Invalid user ID format');
    }

    return this.updateUser(userId, { isActive: true });
  }
}

// Create a singleton instance of the service
const userService = UserService.getInstance();

// Export service methods
export const {
  // Methods inherited from BaseService
  findAll,
  findById,
  getCount,

  // UserService-specific methods
  isValidUserId,
  isValidEmail,
  isPasswordStrongEnough,
  userExistsByEmail,
  findUserByEmail,
  findUserPublicById,
  findUser,
  findAllPublic,
  createUser,
  updateUser,
  updateUserPassword,
  delete: deleteUser,
  toUserPublic,
  verifyPassword,
  findUsersByRole,
  searchUsers,
  deactivateUser,
  reactivateUser,
} = userService;
