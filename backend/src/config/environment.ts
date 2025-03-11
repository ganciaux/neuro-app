import dotenv from 'dotenv';

dotenv.config();

export const APP_ENV = {
    NODE_ENV: process.env.NODE_ENV || 'dev',
    NODE_ENV_LABEL: process.env.NODE_ENV_LABEL || 'dev',
    PORT: process.env.PORT || '3000',
    LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'info',
    PASSWORD_SALT_ROUNDS: Number(process.env.PASSWORD_SALT_ROUNDS || 10),
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    DATABASE_URL: process.env.DATABASE_URL || '',
};
