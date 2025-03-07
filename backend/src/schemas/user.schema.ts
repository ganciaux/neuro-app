// Schéma Zod correspondant
import { z } from 'zod';

export const UserLoginSchema = z.object({
    email: z.string().email({ message: 'Adresse mail invalide' }),
    password: z.string().min(6, { message: 'Le mot de passe doit avoir au minimun 6 charactères' }),
});

export const UserRegisterSchema = z.object({
    email: z.string().email("Adresse mail invalide"),
    password: z.string().min(6, "Le mot de passe doit avoir au minimun 6 charactères"),
    name: z.string().optional(),
  });