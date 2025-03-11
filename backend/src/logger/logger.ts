import * as winston from 'winston';
import * as fs from 'fs';
import { APP_ENV } from '../config/environment';

// Vérifier si le dossier logs existe
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Définition des transports avec un typage correct
const transports: winston.transport[] = [
  new winston.transports.File({ filename: 'logs/all.log' }),
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
];

if (APP_ENV.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

// Création du logger avec des types corrects
export const logger = winston.createLogger({
  level: APP_ENV.LOGGER_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    //winston.format.json(),
    winston.format.printf(
      (info) => `${info.timestamp} [${info.level}]: ${info.message}`,
    ),
  ),
  transports,
});
