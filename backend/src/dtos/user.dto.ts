import { z } from 'zod';
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';

export type UserRegisterDTO = z.infer<typeof UserRegisterSchema>;

export type UserLoginDTO = z.infer<typeof UserLoginSchema>;