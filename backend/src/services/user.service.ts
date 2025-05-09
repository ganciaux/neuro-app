import { Role, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  UserOrderByInput,
  UserPublicDto,
  UserQueryOptions,
} from '../models/user.model';
import { UserValidator } from '../validators/user.validator';
import { UserUpdateDTO } from '../dtos/user.dto';
import { PaginatedResult, PaginationOptions } from '../common/types';
import { IUserRepository } from '../repositories/user/IUserRepository';
import {
  UserEmailAlreadyExistsError,
  UserInvalidDataError,
  UserNotFoundError,
  UserPasswordIncorrectError,
} from '../errors/user.errors';
import { UserMapper } from '../mappers/UserMapper';

export class UserService {
  private toPublic = UserMapper.toPublic;
  private toPublicList = UserMapper.toPublicList;

  constructor(private userRepository: IUserRepository) {}

  /**
   * Validates new user data
   */
  protected validateNewUserData(email: string, password: string): boolean {
    if (!UserValidator.validateEmail(email)) {
      throw new UserInvalidDataError('Invalid email format');
    }

    if (!UserValidator.validatePasswordStrength(password)) {
      throw new UserInvalidDataError('Password is not strong enough');
    }

    return true;
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
    const isValid = this.validateNewUserData(email, password);

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
  toUserPublic(user: User): UserPublicDto {
    return this.toPublic(user);
  }

  toUserPublicList(users: User[]): UserPublicDto[] {
    return this.toPublicList(users);
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

  async findByIdWithFiles(userId: string) {
    const user = await this.userRepository.findById(userId);
    const files: File[] = [];
    //const files = await this.fileService.findAllForEntity('USER', userId);
    
    return {
      ...user,
      files,
    };
  }

  /**
   * Finds a user by user id
   */
  async findByIdToPublic(userId: string): Promise<UserPublicDto | null> {
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
    orderBy?: UserOrderByInput,
    paginationOptions?: Partial<PaginationOptions>,
    select?: any,
  ): Promise<PaginatedResult<User> | User[]> {
    return this.userRepository.findAll(orderBy, paginationOptions, select);
  }

  async findAllToPublic(
    orderBy?: UserOrderByInput,
    paginationOptions?: Partial<PaginationOptions>,
    select?: any,
  ): Promise<PaginatedResult<UserPublicDto> | UserPublicDto[]> {
    const users = await this.userRepository.find(
      undefined,
      undefined,
      undefined,
      paginationOptions,
      select,
      orderBy,
    );
    if (Array.isArray(users)) {
      return this.toUserPublicList(users);
    } else {
      return {
        ...users,
        data: this.toUserPublicList(users.data),
      };
    }
  }

  async search(
    queryOptions?: UserQueryOptions,
    orderBy?: UserOrderByInput,
    paginationOptions?: Partial<PaginationOptions>,
    select?: any,
  ): Promise<PaginatedResult<User> | User[]> {
    return this.userRepository.search(
      queryOptions,
      orderBy,
      paginationOptions,
      select,
    );
  }
}

/* test class to access protected methods */
export class TestableUserService extends UserService {
  public testValidateNewUserData(email: string, password: string): boolean {
    return this.validateNewUserData(email, password);
  }
}
