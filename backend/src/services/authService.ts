import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { UserRole } from '../models/user.model';

dotenv.config();
const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export async function registerUser(email: string, password: string, name:string='') {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            name,
            passwordHash: hashedPassword,
            passwordSalt: salt,
            role:UserRole.USER
        },
    });

    return { id: user.id, email: user.email };
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return { token };
}
