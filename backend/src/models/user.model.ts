import { User, Role } from '@prisma/client';
import { QueryOptions, StringFields } from '../common/types';
import { PublicSelect } from './utils.model';
import { prisma } from '../config/database';

/**
 * Represents a user object without sensitive information (e.g., password).
 */
export type UserPublic = Omit<
  User,
  'passwordHash' | 'passwordSalt' | 'createdAt' | 'updatedAt'
>;

export type UserPublicDto = UserPublic & {
  fullName: string;
  profileUrl?: string;
};

export const UserPublicSelect: PublicSelect<UserPublic> = {
  id: true,
  email: true,
  role: true,
  name: true,
  isActive: true,
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
export interface UserQueryOptions extends QueryOptions {
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

export const UserModel = {
  name: 'User' as const,

  allFields: Object.keys(prisma.user.fields) as Array<keyof User>,

  defaultFields: [
    'id',
    'email',
    'name',
    'createdAt',
    'updatedAt',
  ] as const satisfies Array<keyof User>,

  searchableFields: ['email', 'name'] as const satisfies Array<
    StringFields<User>
  >,

  relations: [] as const,
};

export type UserOptions = {
  email?: string;
  name?: string;
  role?: Role;
  password?: string;
  isActive?: boolean;
};

export type UserFixtureOptions = {
  email: string;
  name: string;
  role: Role;
  password: string;
  isActive: boolean;
};

export type UserWithPasswordAndToken = User & {
  token: string;
  password: string;
};

export interface SeededUsers {
  admin: UserWithPasswordAndToken;
  user: UserWithPasswordAndToken;
}

/**
 * Represents the fields of a user.
 */
export type UserField = keyof User;

/**
 * Represents the default fields of a user.
 */
export type UserDefaultField = (typeof UserModel.defaultFields)[number];
export type UserSearchableField = (typeof UserModel.searchableFields)[number];
