import { User, Role } from '@prisma/client';
import { BaseFilterOptions } from '../common/types';
import { PublicSelect } from './utils.model';

/**
 * Represents a user object without sensitive information (e.g., password).
 */
export type UserPublic = Omit<User, 'passwordHash' | 'passwordSalt' | 'createdAt' | 'updatedAt'> 

export type UserPublicDto = UserPublic & {
  fullName: string;
  profileUrl?: string;
};

export const UserPublicSelect: PublicSelect<UserPublic> = {
  id: true,
  email: true,
  role: true,
  name: true,
  isActive: true
};

/**
 * Represents the payload of a JWT token for a user.
 */
export interface UserJWTPayload {
  /** Subject (user ID). */
  sub: string;
  /** User email. */
  email: string;
  /** User role. */
  role: Role;
  /** Issued at timestamp. */
  iat: number;
  /** Expiration timestamp. */
  exp: number;
}

/**
 * Represents the filter options for user queries.
 */
export interface UserFilterOptions extends BaseFilterOptions {
  /** Filter by user role. */
  role?: Role;
  /** Filter by active status. */
  isActive?: boolean;
  /** Filter by email. */
  email?: string;
  /** Filter by name. */
  name?: string;
}

/**
 * Represents the where input for user queries.
 */
export interface UserWhereInput {
  id?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents the order by input for user queries.
 */
export interface UserOrderByInput {
  email?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
}

export const UserOrderByFields: Record<keyof UserOrderByInput, boolean> = {
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true
};

/**
 * Represents test data for a user, including sensitive information.
 */
export interface UserTestData {
  /** Full user information from Prisma. */
  user: User;
  /** User email. */
  email: string;
  /** User password. */
  password: string;
  /** Authentication token. */
  token: string;
}