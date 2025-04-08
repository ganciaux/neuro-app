import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Represents the application environment variables.
 */
interface AppEnv {
  /** The current environment (e.g., 'dev', 'production'). */
  NODE_ENV: string;
  /** A label for the current environment (e.g., 'dev1'). */
  NODE_ENV_LABEL: string;
  /** The port on which the server will run. */
  PORT: number;
  /** The logging level (e.g., 'info', 'debug'). */
  LOGGER_LEVEL: string;
  /** The number of salt rounds for password hashing. */
  PASSWORD_SALT_ROUNDS: number;
  /** The secret key for JWT token generation. */
  JWT_SECRET: string;
  /** The expiration time for JWT tokens (in seconds). */
  JWT_EXPIRATION: number;
  /** The connection URL for the database. */
  DATABASE_URL: string;
}

/**
 * Application environment variables with default values.
 */
export const APP_ENV: AppEnv = {
  NODE_ENV: process.env.NODE_ENV || 'dev',
  NODE_ENV_LABEL: process.env.NODE_ENV_LABEL || 'dev1',
  PORT: parseInt(process.env.PORT || '3000', 10),
  LOGGER_LEVEL: process.env.LOGGER_LEVEL || 'info',
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRATION: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
};

// Validate required environment variables in production
if (APP_ENV.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in the environment variables');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('JWT_SECRET is missing in the environment variables');
  }
}
