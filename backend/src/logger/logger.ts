import util from 'util';
import winston from 'winston';
import type { TransformableInfo } from 'logform'; // Correct
import * as fs from 'fs';
import { APP_ENV } from '../config/environment';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const customFormatFunction = (info: TransformableInfo): string => {
  const splat = info[Symbol.for('splat')] as Array<any> | undefined;
  const message = util.format(info.message, ...(splat ?? []));
  return `${info.timestamp} [${info.level}]: ${message}`;
};

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
        winston.format.printf(customFormatFunction),
      ),
    }),
  );
}

export const logger = winston.createLogger({
  level: APP_ENV.LOGGER_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    //winston.format.json(),
    winston.format.printf(customFormatFunction),
  ),
  transports,
});
