import dotenv from 'dotenv';

dotenv.config();

interface AppEnv {
  NODE_ENV: string;
  NODE_ENV_LABEL: string;
  PORT: number;
  LOGGER_LEVEL: string;
  PASSWORD_SALT_ROUNDS: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  DATABASE_URL: string;
}

export const APP_ENV: AppEnv = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  NODE_ENV_LABEL: process.env.NODE_ENV_LABEL || 'dev1',
  PORT: parseInt(process.env.PORT || '3000', 10),
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'info',
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
  DATABASE_URL: process.env.DATABASE_URL || '',
};

// Validation des variables critiques en production
if (APP_ENV.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET est manquant dans les variables d'environnement",
    );
  }
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL est manquant dans les variables d'environnement",
    );
  }
}
