import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { UserOrderByInput, UserPublic } from '../models/user.model';
import { UserValidator } from '../validators/user.validator';
import { UserUpdateDTO } from '../dtos/user.dto';
import { PaginatedResult, PaginationOptions } from '../common/types';
import { IUserRepository } from '../repositories/user/IUserRepository';
import { UserEmailAlreadyExistsError, UserInvalidDataError, UserNotFoundError, UserPasswordIncorrectError } from '../errors/user.errors';
import { UserMapper } from '../mappers/UserMapper';

export class UserService {
  private toPublic = UserMapper.toPublic
  
  constructor(private userRepository: IUserRepository) {}

  /**
   * Validates new user data
   */
  private validateNewUserData(email: string, password: string): void {
    if (!UserValidator.validateEmail(email)) {
      throw new UserInvalidDataError('Invalid email format');
    }

    if (UserValidator.validatePasswordStrength(password)) {
      throw new UserInvalidDataError('Password must be at least 6 characters long');
    }
  }

  async existsById(userId: string): Promise<boolean> {
    return this.userRepository.existsById(userId);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepository.existsByEmail(email);
  }

  /**
   * Creates a new user
   */
  async create(
    email: string,
    password: string,
    name: string = '',
    role: Role,
    isActive: boolean,
  ): Promise<User> {
    this.validateNewUserData(email, password);

    const userExists = await this.userRepository.existsByEmail(email);
    if (userExists) {
      throw new UserEmailAlreadyExistsError('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return this.userRepository.create({
      email,
      name,
      passwordHash: hashedPassword,
      passwordSalt: salt,
      role,
      isActive,
    });
  }

  /**
   * Updates a user
   */
  async update(userId: string, data: Partial<UserUpdateDTO>): Promise<User> {
    return this.userRepository.update(userId, data);
  }

  /**
   * Delete a user
   */
  async delete(userId: string): Promise<User> {
    return this.userRepository.delete(userId);
  }

  /**
   * Updates a user's password
   */
  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UserPasswordIncorrectError('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return this.userRepository.update(userId, {
      passwordHash: hashedPassword,
      passwordSalt: salt,
    });
  }

  /**
   * Converts a user to a public version
   */
  toUserPublic(user: User): UserPublic {
    return this.toPublic(user);
  }

  /**
   * Verifies if a password matches a user's password
   */
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  /**
   * Deactivates a user
   */
  async deactivate(userId: string): Promise<User> {
    return this.userRepository.update(userId, { isActive: false });
  }

  /**
   * Reactivates a user
   */
  async reactivate(userId: string): Promise<User> {
    return this.userRepository.update(userId, { isActive: true });
  }

  /**
   * Finds a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Finds a user by user id
   */
  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  /**
   * Finds a user by user id
   */
  async findByIdToPublic(userId: string): Promise<UserPublic | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return null;
    }
    return this.toUserPublic(user);
  }

  /**
   * Finds all users
   */
  async findAll(
    paginationOptions?: Partial<PaginationOptions>,
    orderBy?: UserOrderByInput,
    select?: any,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(
      paginationOptions,
      orderBy,
      select,
    );
  }
}
