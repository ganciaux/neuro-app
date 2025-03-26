import { AppError } from './app.error';

/**
 * Base class for all authentication-related errors.
 * Extends the `AppError` class.
 */
export class AuthError extends AppError {
  constructor(message: string, statusCode: number, details?: any) {
    super(message, statusCode, details);
  }
}

/**
 * Error thrown when a JWT is not provided.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class JWTNotProvidedError extends AuthError {
  constructor(message: string = 'JWT not provided') {
    super(message, 401); // 401 Unauthorized
  }
}

/**
 * Error thrown when a JWT is invalid.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class JWTInvalidError extends AuthError {
  constructor(message: string = 'Invalid JWT') {
    super(message, 401); // 401 Unauthorized
  }
}

/**
 * Error thrown when a JWT is expired.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class JWTExpiredError extends AuthError {
  constructor(message: string = 'JWT expired') {
    super(message, 401); // 401 Unauthorized
  }
}

/**
 * Error thrown when a specific role is required to access a resource.
 * - Extends `AuthError`.
 * - Status code: 403 (Forbidden).
 */
export class RoleAccessRequiredError extends AuthError {
  constructor(message: string = 'Role access required') {
    super(message, 403); // 403 Forbidden
  }
}

/**
 * Error thrown when invalid credentials are provided.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401); // 401 Unauthorized
    this.message = `Invalid credentials`;
  }
}

/**
 * Error thrown when user registration fails.
 * - Extends `AuthError`.
 * - Status code: 500 (Internal Server Error).
 */
export class RegistrationFailedError extends AuthError {
  constructor(email: string, message: string = 'Failed to register user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to register user ${email}`;
  }
}
