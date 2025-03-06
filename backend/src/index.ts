import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || '3000';
const app = express();
const prisma = new PrismaClient();

app.get('/', async (req, res) => {
    res.status(200).send('<h1>neuro backend is running</h1>');
});

prisma.$connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch((err) => console.error('❌ Database connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
