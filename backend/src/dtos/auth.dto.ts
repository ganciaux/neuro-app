import { z } from 'zod';
import { AuthLoginSchema, AuthRegisterSchema } from '../schemas/auth.schema';

export type AuthRegisterDTO = z.infer<typeof AuthRegisterSchema>;
export type AuthLoginDTO = z.infer<typeof AuthLoginSchema>;



