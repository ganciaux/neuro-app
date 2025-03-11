import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import {UserLoginDTO, UserRegisterDTO} from '../dtos/user.dto'
import { UserLoginSchema, UserRegisterSchema } from '../schemas/user.schema';
import { logger } from '../logger/logger';
import { Prisma } from '@prisma/client';

export async function register(request: Request, response: Response) {
    try {
        const validatedData = UserRegisterSchema.parse(request.body);
        const { email, password, name }:UserRegisterDTO = validatedData;
        const user = await registerUser(email, password, name);
        response.status(201).json(user);
        return;
    } catch (error) {
        logger.error(`Error:`, (error as Error).message)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
              response.status(400).json({ error: "Cet email est déjà utilisé." });
              return;
            }
          }

        response.status(500).json({ error: 'Erreur serveur' });
    }
}

export async function login(request: Request, response: Response) {
    try {
        const validatedData = UserLoginSchema.parse(request.body);
        const { email, password }:UserLoginDTO = validatedData;
        const { token } = await loginUser(email, password);
        response.json({ token });
        return; 
    } catch (error) {
        logger.error(`Error:`, (error as Error).message)
        response.status(401).json({ error: "Can't loggin" });
    }
}
