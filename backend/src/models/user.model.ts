import { Prisma } from "@prisma/client";

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserAuth={
  user:User,
  token:string
}

export interface UserJWT {
  id: string;
  iat: number;
  exp: number;
}

export type User = Prisma.UserGetPayload<{}>;