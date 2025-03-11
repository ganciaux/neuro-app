import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import listEndpoints from 'express-list-endpoints'
import routes from './routes';
import { logger } from './logger/logger';
import { requestLogger } from './middlewares/request.logger.middleware';
import { Server } from 'http';

dotenv.config();

const PORT = process.env.PORT || '3000';
const NODE_ENV = process.env.NODE_ENV || 'dev'

const prisma = new PrismaClient();

const app = express();
let server: Server;

function setupExpress() {
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);
    app.use(routes);

    if (NODE_ENV==="dev"){
        app.get('/routes', (req, res) => {
            const endpoints = listEndpoints(app);
            res.json(endpoints);
        });
    }
}

function startServer() {
    server = app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
    
}

prisma.$connect()
    .then(() => {
        logger.info(process.env.NODE_ENV_LABEL)
        logger.info('✅ Connected to PostgreSQL')
        setupExpress()
        startServer()
    })
    .catch((err) => {
        logger.error('❌ Database connection error:', err)
        process.exit(1);
    });

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
});
    
process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason });
});

export { app, server };