import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

type UserPublic = Pick<User, 'id' | 'email' | 'role'>;

export type UserWithToken = {
  user: UserPublic;
  token: string;
};

export type UserTest = {
  user: User;
  email: string;
  password: string;
  token: string;
};

export interface UserJWT {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
