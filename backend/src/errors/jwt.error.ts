import { AppError } from './app.error';

export class JWTError extends AppError {
    constructor(message: string, statusCode: number, details?: any) {
        super(message, statusCode, details);
    }
}

/**
 * Error thrown when a JWT is not provided.
 * - Extends `AuthError`.
 * - Status code: 401 (Unauthorized).
 */
export class JWTNotProvidedError extends JWTError {
    constructor(message: string = 'JWT not provided') {
      super(message, 401); // 401 Unauthorized
    }
  }
  
  /**
   * Error thrown when a JWT is invalid.
   * - Extends `JWTError`.
   * - Status code: 401 (Unauthorized).
   */
  export class JWTInvalidError extends JWTError {
    constructor(message: string = 'Invalid JWT') {
      super(message, 401); // 401 Unauthorized
    }
  }
  
  /**
   * Error thrown when a JWT is expired.
   * - Extends `JWTError`.
   * - Status code: 401 (Unauthorized).
   */
  export class JWTExpiredError extends JWTError {
    constructor(message: string = 'JWT expired') {
      super(message, 401); // 401 Unauthorized
    }
  }