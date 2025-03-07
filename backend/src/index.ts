import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import listEndpoints from 'express-list-endpoints'

dotenv.config();

const PORT = process.env.PORT || '3000';
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(routes);

app.get('/routes', (req, res) => {
    const endpoints = listEndpoints(app);
    res.json(endpoints);
  });

prisma.$connect()
    .then(() => {
        console.log(process.env.ENV)
        console.log('✅ Connected to PostgreSQL')

    })
    .catch((err) => console.error('❌ Database connection error:', err));

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, server };