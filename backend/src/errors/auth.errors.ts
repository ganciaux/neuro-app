import { AppError } from './app.error';

export class JWTNotProvidedError extends AppError {
  constructor(message: string = 'JWT not provided') {
    super(message, 401); // 401 Unauthorized
  }
}

export class JWTInvalidError extends AppError {
  constructor(message: string = 'Invalid JWT') {
    super(message, 401); // 401 Unauthorized
  }
}

export class JWTExpiredError extends AppError {
  constructor(message: string = 'JWT expired') {
    super(message, 401); // 401 Unauthorized
  }
}

export class RoleAccessRequiredError extends AppError {
  constructor(message: string = 'Role access required') {
    super(message, 403); // 403 Forbidden
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401); // 401 Unauthorized
    this.message = `Invalid credentials`;
  }
}

export class RegistrationFailedError extends AppError {
  constructor(email: string, message: string = 'Faild to register user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Faild to register user ${email}`;
  }
}

