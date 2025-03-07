import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import listEndpoints from 'express-list-endpoints'

dotenv.config();

const PORT = process.env.PORT || '3000';
const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // Pour parser le JSON

app.use(routes);

// Lister les routes disponibles
app.get('/routes', (req, res) => {
    const endpoints = listEndpoints(app);
    res.json(endpoints);
  });

prisma.$connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch((err) => console.error('❌ Database connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
