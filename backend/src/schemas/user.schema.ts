// Schéma Zod correspondant
import { z } from 'zod';
import { UserRole } from '../models/user.model';

const UserRoleSchema = z.nativeEnum(UserRole);

export const UserLoginSchema = z.object({
  email: z.string().email({ message: 'Adresse mail invalide' }),
  password: z
    .string()
    .min(6, { message: 'Le mot de passe doit avoir au minimun 6 charactères' }),
});

export const UserRegisterSchema = z.object({
  email: z.string().email('Adresse mail invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit avoir au minimun 6 charactères'),
});

export const UserCreateSchema = z.object({
  email: z.string().email('Adresse mail invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit avoir au minimun 6 charactères'),
  role: z.nativeEnum(UserRole, {
    errorMap: (issue, ctx) => {
      return { message: "Le rôle doit être soit 'USER' soit 'ADMIN'" };
    },
  }),
  name: z.string().optional(),
});
