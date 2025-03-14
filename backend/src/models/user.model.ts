import { Prisma } from '@prisma/client';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserPrisma = Prisma.UserGetPayload<{}>;

export type UserPublic = Omit<UserPrisma, 'passwordHash' | 'passwordSalt'>;

type UserPublicKeys = keyof UserPublic;

export const userPublicSelect: Record<UserPublicKeys, boolean> = {
  id: true,
  email: true,
  role: true,
  name: true,
  createdAt: false,
  updatedAt: false
};

export interface UserWithAuthToken {
  user: UserPublic;
  token: string;
};

export interface UserTestData {
  user: UserPrisma;
  email: string;
  password: string;
  token: string;
};

export interface UserJWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
