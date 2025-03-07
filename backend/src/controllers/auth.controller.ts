import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import {UserLoginDTO, UserRegisterDTO} from '../dtos/user.dto'
import { UserRegisterSchema } from '../schemas/user.schema';

export async function register(request: Request, response: Response) {
    try {
        const validatedData = UserRegisterSchema.parse(request.body);
        const { email, password, name }:UserRegisterDTO = validatedData;
        const user = await registerUser(email, password, name);
        response.status(201).json(user);
        return;
    } catch (error) {
        response.status(400).json({ error: (error as Error).message });
    }
}

export async function login(request: Request, response: Response) {
    try {
        const validatedData = UserRegisterSchema.parse(request.body);
        const { email, password }:UserLoginDTO = validatedData;
        const { token } = await loginUser(email, password);
        response.json({ token });
        return; 
    } catch (error) {
        response.status(401).json({ error: (error as Error).message });
    }
}
