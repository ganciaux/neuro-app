import { logger } from '../logger/logger';

/**
 * Custom error class for application-specific errors.
 * - Extends the built-in `Error` class.
 * - Includes a status code, status, and operational flag.
 */
export class AppError extends Error {
  /** HTTP status code associated with the error. */
  statusCode: number;

  /** Status of the error ('fail' for 4xx, 'error' for 5xx). */
  status: string;

  /** Indicates whether the error is operational (expected) or not. */
  isOperational: boolean;

  /**
   * Creates a new `AppError` instance.
   * @param message - The error message.
   * @param statusCode - The HTTP status code.
   */
  constructor(message: string | undefined, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);

    // Log the error
    logger.error(`app.error: constructor: ${this}`);
  }
}
