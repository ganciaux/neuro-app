import { z } from 'zod';
import {
  UserCreateSchema,
} from '../schemas/user.schema';

export type UserCreateDTO = z.infer<typeof UserCreateSchema>;


