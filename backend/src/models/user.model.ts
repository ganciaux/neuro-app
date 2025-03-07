import { z } from 'zod';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }

  export interface UserAuthenticated {
    id: string;
    email: string;
    role: UserRole;
}

export type UserRegisterDTO = z.infer<typeof UserRegisterSchema>;

export type UserLoginDTO = z.infer<typeof UserLoginSchema>;