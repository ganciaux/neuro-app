import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';
import { APP_ENV } from '../config/environment';
import { ZodError } from 'zod';
import { PrismaError } from '../errors/prisma.errors';
import { UserError } from '../errors/user.errors';
import { AuthError } from '../errors/auth.errors';
import { JWTError } from '../errors/jwt.error';

export function handleProcessErrors() {
  process.on('uncaughtException', (error) => {
    logger.error('errorHandler: handleProcessErrors: Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('errorHandler: handleProcessErrors: Unhandled Promise Rejection:', { reason });
  });

  process.on('SIGINT', async () => {
    logger.error(`errorHandler: handleProcessErrors: 🛑 SIGINT received. Closing server...`);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.error(`errorHandler: handleProcessErrors: 🛑 SIGTERM received. Closing server...`);
    process.exit(0);
  });
}

const sendErrorDev = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: sendErrorDev: [${request.requestId}]: sendErrorDev:`);
  let { status, statusCode } = error as any;

  response.status(statusCode ?? 500).json({
    status: status ?? 'error',
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: sendErrorProd: [${request.requestId}]: sendErrorProd:`);
  response.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(`errorHandler: errorHandler: [${request.requestId}]: ${error}`);

  if (APP_ENV.NODE_ENV === 'dev') {
    sendErrorDev(error, request, response);
  } else {
    if (error instanceof ZodError) {
      response.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors: error.errors,
      });
    } else if (error instanceof PrismaError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        prismaCode: error.prismaCode,
      });
    } else if (error instanceof UserError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details,
      });
    } else if (error instanceof AuthError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details,
      });
    } else if (error instanceof JWTError) {
      response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        details: error.details,
      });
    } else {
      sendErrorProd(error, request, response);
    }
  }

  next();
};
