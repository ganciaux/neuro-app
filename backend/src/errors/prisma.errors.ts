import { AppError } from './app.error';

/**
 * Custom error class for Prisma-related errors.
 * - Extends `AppError`.
 * - Includes a Prisma error code for additional context.
 */
export class PrismaError extends AppError {
  /** The Prisma error code associated with the error. */
  public prismaCode: string;

  /**
   * Creates a new `PrismaError` instance.
   * @param message - The error message.
   * @param prismaCode - The Prisma error code.
   * @param statusCode - The HTTP status code (default: 500).
   */
  constructor(message: string, prismaCode: string, statusCode: number = 500) {
    super(message, statusCode);
    this.prismaCode = prismaCode;
  }
}
