import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';
import { AppError } from '../errors/app.error';
import { APP_ENV } from '../config/environment';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function handleProcessErrors() {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Promise Rejection:', { reason });
  });

  process.on('SIGINT', async () => {
    logger.info(`errorHandler: 🛑 SIGINT received. Closing server...`);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info(`errorHandler: 🛑 SIGTERM received. Closing server...`);
    process.exit(0);
  });
}

export const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

export const handleJWTExpiredError = () =>
  new AppError('Invalid token. Your token has expired', 401);

export const handlePrismaUniqueConstraintViolation = (err:Prisma.PrismaClientKnownRequestError) =>
  new AppError('Cant insert value', 400);

const sendErrorDev = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: [${request.requestId}]: sendErrorDev: ${error}`);
  let { status, statusCode } = error as any;

    response.status(statusCode ?? 500).json({
      status: status ?? 'error',
      message: error.message,
      stack: error.stack,
      error
    });
}

const sendErrorProd = (error: Error, request: Request, response: Response) => {
  logger.error(`errorHandler: [${request.requestId}]: sendErrorProd: ${error}`);
  response.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

export const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {

  logger.error(`errorHandler: [${request.requestId}]: ${error}`);
  
  if (APP_ENV.NODE_ENV === "dev") {
    sendErrorDev(error, request, response);
  } else{
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        handlePrismaUniqueConstraintViolation(error);
        return;
      }
    }

    sendErrorProd(error, request, response);
  }

  next();
};
