import { z } from 'zod';

export const AuthLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email format.' }),
    password: z
        .string()
        .min(6, { message: 'The password must be at least 6 characters long.' }),
});

export const AuthRegisterSchema = z.object({
    email: z.string().email('Invalid email format.'),
    password: z
        .string()
        .min(6, 'The password must be at least 6 characters long.'),
});