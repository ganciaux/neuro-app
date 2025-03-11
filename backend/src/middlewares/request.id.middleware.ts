import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
    namespace Express {
      interface Request {
        requestId?: string;
      }
    }
  }

export function requestIdMiddleware(request: Request, response: Response, next: NextFunction) {
  const requestId = uuidv4();
  request.requestId = requestId;
  response.setHeader('X-Request-ID', requestId);
  next();
}
