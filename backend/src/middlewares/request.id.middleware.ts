import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger/logger';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const requestId = uuidv4();
  request.requestId = requestId;
  response.setHeader('X-Request-ID', requestId);
  logger.info(`Request [${requestId}]: start`);
  logger.info(`Request [${requestId}]: method=[${request.method}]`);
  logger.info(`Request [${requestId}]: url=${request.originalUrl}`);
  next();
}
