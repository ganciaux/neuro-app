import { z } from 'zod';
import {
  UserLoginSchema,
  UserRegisterSchema,
  UserCreateSchema,
} from '../schemas/user.schema';

export type UserRegisterDTO = z.infer<typeof UserRegisterSchema>;

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;

export type UserLoginDTO = z.infer<typeof UserLoginSchema>;
