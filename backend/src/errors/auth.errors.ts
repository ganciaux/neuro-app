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
 * Error thrown when a specific role is required to access a resource.
 * - Extends `AuthError`.
 * - Status code: 403 (Forbidden).
 */
export class AuthRoleAccessRequiredError extends AuthError {
  constructor(message: string = 'Role access required') {
    super(message, 403); // 403 Forbidden
  }
}

/**
 * Error thrown when invalid credentials are provided.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class AuthCredentialsError extends AuthError {
  constructor(message: string = 'Invalid credentials') {
    super(message, 401); // 401 Unauthorized
    this.message = `Invalid credentials`;
  }
}

