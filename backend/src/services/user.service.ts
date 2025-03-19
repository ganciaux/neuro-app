import { User } from '@prisma/client';
import { UserFilterOptions, UserPublic, UserRole } from '../models/user.model';
import { IUserRepository } from '../repositories/user/IUserRepository';
import { UserValidator } from '../validators/user.validator';
import bcrypt from 'bcryptjs';
import { UserUpdateDTO } from '../dtos/user.dto';
import { PaginationOptions } from '../common/types';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Checks if a user ID is valid
   */
  isValidUserId(userId: string): boolean {
    return !!userId && UserValidator.validateUserId(userId);
  }

  /**
   * Validates an email address
   */
  isValidEmail(email: string): boolean {
    return !!email && UserValidator.validateEmail(email);
  }

  /**
   * Checks if a password is strong enough
   */
  isPasswordStrongEnough(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    return strongPasswordRegex.test(password);
  }

  async existsById(userId: string): Promise<boolean> {
    return !!this.userRepository.findById(userId);
  }
  /**
   * Validates new user data
   */
  private validateNewUserData(email: string, password: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!this.isPasswordStrongEnough(password)) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  /**
   * Creates a new user
   */
  async create(
    email: string,
    password: string,
    name: string = '',
    role: UserRole,
    isActive: boolean,
  ): Promise<User> {
    this.validateNewUserData(email, password);

    const userExists = await this.userRepository.existsByEmail(email);
    if (userExists) {
      throw new Error('Email already in use');
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
    if (!this.isValidUserId(userId)) {
      throw new Error('Invalid user ID');
    }

    return this.userRepository.update(userId, data);
  }

  /**
   * Delete a user
   */
  async delete(userId: string): Promise<User> {
    if (!this.isValidUserId(userId)) {
      throw new Error('Invalid user ID');
    }

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
    if (!this.isValidUserId(userId)) {
      throw new Error('Invalid user ID');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
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
    const { passwordHash, passwordSalt, ...userPublic } = user;
    return userPublic as UserPublic;
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
    filterOptions?: UserFilterOptions,
  ) {
    const users = await this.userRepository.findAll(
      paginationOptions,
      filterOptions,
    );
    return users;
  }
}
