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

export class EmailAlreadyExistsError extends AppError {
  constructor(email: string, message: string = 'Email already exists') {
    super(message, 409); // 409 Conflict
    this.message = `Email already exists ${email}`;
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(email: string, message: string = 'Invalid credentials') {
    super(message, 401); // 401 Unauthorized
    this.message = `Invalid credentials ${email}`;
  }
}

export class RegistrationFailedError extends AppError {
  constructor(email: string, message: string = 'Faild to register user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Faild to register user ${email}`;
  }
}
