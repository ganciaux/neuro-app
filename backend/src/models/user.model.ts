import { Prisma } from '@prisma/client';
import { BaseFilterOptions } from '../services/base.service';

/**
 * Enum representing user roles.
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * Represents the full user model from Prisma.
 */
export type UserPrisma = Prisma.UserGetPayload<{}>;

/**
 * Represents a user object without sensitive information (e.g., password).
 */
export type UserPublic = Omit<UserPrisma, 'passwordHash' | 'passwordSalt'>;

/**
 * Represents the keys of the `UserPublic` type.
 */
type UserPublicKeys = keyof UserPublic;

/**
 * Object used to select public user fields in Prisma queries.
 */
export const userPublicSelect: Record<UserPublicKeys, boolean> = {
  id: true,
  email: true,
  role: true,
  name: true,
  isActive: true,
  createdAt: false,
  updatedAt: false,
};

/**
 * Represents the filter options for user queries.
 */
export interface UserFilterOptions extends BaseFilterOptions {
  /** Filter by user role. */
  role?: UserRole;
  /** Filter by active status. */
  isActive?: boolean;
  /** Filter by email. */
  email?: string;
  /** Filter by name. */
  name?: string;
}
/**
 * Represents a user object with an authentication token.
 */
export interface UserWithAuthToken {
  /** Public user information. */
  user: UserPublic;
  /** Authentication token. */
  token: string;
}

/**
 * Represents test data for a user, including sensitive information.
 */
export interface UserTestData {
  /** Full user information from Prisma. */
  user: UserPrisma;
  /** User email. */
  email: string;
  /** User password. */
  password: string;
  /** Authentication token. */
  token: string;
}

/**
 * Represents the payload of a JWT token for a user.
 */
export interface UserJWTPayload {
  /** Subject (user ID). */
  sub: string;
  /** User email. */
  email: string;
  /** User role. */
  role: UserRole;
  /** Issued at timestamp. */
  iat: number;
  /** Expiration timestamp. */
  exp: number;
}
