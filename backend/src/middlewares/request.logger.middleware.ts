import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const start = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - start;
    const requestId = request.requestId || '<none>';
    try {
      logger.info(`request.logger.middleware: requestLogger: [${requestId}]: duration=${duration}ms`);
      logger.info(`request.logger.middleware: requestLogger: [${requestId}]: statusCode=${response.statusCode}`);
      logger.info(
        `request.logger.middleware: requestLogger: [${requestId}]: headers=${JSON.stringify(maskSensitiveHeaders(request.headers))}`,
      );
      logger.info(
        `request.logger.middleware: requestLogger: [${requestId}]: body=${JSON.stringify(maskSensitiveData(request.body))}`,
      );
    } catch (error) {
      logger.error(`request.logger.middleware: requestLogger: [${requestId}]: Can't log request ${JSON.stringify(error)}`);
    }
  });

  next();
}

function maskSensitiveHeaders(
  headers: Record<string, string | string[] | undefined>,
): Record<string, string | string[] | undefined> {
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
  const maskedHeaders = { ...headers };

  sensitiveHeaders.forEach((header) => {
    if (maskedHeaders[header]) {
      maskedHeaders[header] = '*****';
    }
  });

  return maskedHeaders;
}

function maskSensitiveData(body: Record<string, any>): Record<string, any> {
  const sensitiveFields = ['password', 'token', 'creditCard'];
  const maskedBody = { ...body };

  sensitiveFields.forEach((field) => {
    if (maskedBody[field]) {
      maskedBody[field] = '*****';
    }
  });

  return maskedBody;
}
