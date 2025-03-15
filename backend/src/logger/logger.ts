import util from 'util';
import winston from 'winston';
import type { TransformableInfo } from 'logform'; // Correct
import * as fs from 'fs';
import { APP_ENV } from '../config/environment';

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

/**
 * Custom log format function.
 * - Formats log messages with timestamps and log levels.
 * - Supports splat (additional arguments) in log messages.
 * @param info - Log information object.
 * @returns Formatted log message.
 */
const customFormatFunction = (info: TransformableInfo): string => {
  const splat = info[Symbol.for('splat')] as Array<any> | undefined;
  const message = util.format(info.message, ...(splat ?? []));
  return `${info.timestamp} [${info.level}]: ${message}`;
};

/**
 * Winston transport configurations.
 * - Logs to `logs/all.log` for all levels.
 * - Logs to `logs/error.log` for errors only.
 * - Adds console logging in non-production environments.
 */
const transports: winston.transport[] = [
  new winston.transports.File({ filename: 'logs/all.log' }),
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
];

// Add console logging in non-production environments
if (APP_ENV.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(customFormatFunction),
      ),
    }),
  );
}

/**
 * Winston logger instance.
 * - Logs to files and optionally to the console.
 * - Uses a custom format for log messages.
 */
export const logger = winston.createLogger({
  level: APP_ENV.LOGGER_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(customFormatFunction),
  ),
  transports,
});
