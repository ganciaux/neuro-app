import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: { id: true, email: true, name: true, role: true }
        });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
       

export async function getUserById(request: Request, response: Response) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: request.params.id },
            select: { id: true, email: true, createdAt: true }
        });

        if (!user){
            response.status(404).json({ error: 'Utilisateur non trouvé' });
            return;
        } 

        response.json(user);
    } catch (error) {
        response.status(500).json({ error: (error as Error).message });
    }
}

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};