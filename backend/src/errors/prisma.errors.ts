import { AppError } from './app.error';

export class PrismaError extends AppError {
  public prismaCode: string;

  constructor(message: string, prismaCode: string, statusCode: number = 500) {
    super(message, statusCode);
    this.prismaCode = prismaCode;
  }
}
