import { AppError } from './app.error';

/**
 * Base class for all user-related errors.
 * Extends the `AppError` class.
 */
export class UserError extends AppError {
  constructor(message: string, statusCode: number, details?: any) {
    super(message, statusCode, details);
  }
}

/**
 * Error thrown when fetching a user by email fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserFetchByEmailFailedError extends AppError {
  constructor(
    email: string,
    message: string = 'Failed to fetch user by email',
  ) {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user by email ${email}`;
  }
}

/**
 * Error thrown when fetching a user by ID fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserFetchByIdFailedError extends AppError {
  constructor(id: string, message: string = 'Failed to fetch user by id') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user by id ${id}`;
  }
}

/**
 * Error thrown when fetching a user by criteria fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserFetchFailedError extends AppError {
  constructor(criteria: string, message: string = 'Failed to fetch user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user ${criteria}`;
  }
}

/**
 * Error thrown when a user email already exists.
 * - Extends `AppError`.
 * - Status code: 409 (Conflict).
 */
export class UserEmailAlreadyExistsError extends AppError {
  constructor(email: string, message: string = 'Email already exists') {
    super(message, 409); // 409 Conflict
    this.message = `Email already exists ${email}`;
  }
}

/**
 * Error thrown when user creation fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserCreationFailedError extends AppError {
  constructor(email: string, message: string = 'Failed to create user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to create user ${email}`;
  }
}

/**
 * Error thrown when user registration fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserRegisterFailedError extends AppError {
  constructor(email: string, message: string = 'Failed to register user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to register user ${email}`;
  }
}

/**
 * Error thrown when a user is not found by email.
 * - Extends `AppError`.
 * - Status code: 404 (Not Found).
 */
export class UserNotFoundEmailError extends AppError {
  constructor(email: string, message: string = 'User not found') {
    super(message, 404); // 404 Not Found
    this.message = `User not found ${email}`;
  }
}

/**
 * Error thrown when a user is not found.
 * - Extends `AppError`.
 * - Status code: 404 (Not Found).
 */
export class UserNotFoundError extends AppError {
  constructor(message: string = 'User not found') {
    super(message, 404); // 404 Not Found
  }
}

/**
 * Error thrown when fetching all users fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserFindAllFailedError extends AppError {
  constructor(message: string = 'Failed to get users') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to get users`;
  }
}

/**
 * Error thrown when counting users fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserCountFailedError extends AppError {
  constructor(message: string = 'Failed to count user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to count user`;
  }
}

/**
 * Error thrown when updating a user fails.
 * - Extends `AppError`.
 * - Status code: 400 (Bad Request).
 */
export class UserUpdateFailedError extends AppError {
  constructor(userId: string, message: string = 'Failed to update user') {
    super(message, 400); // 400 Bad Request
  }
}

/**
 * Error thrown when deleting a user fails.
 * - Extends `AppError`.
 * - Status code: 500 (Internal Server Error).
 */
export class UserDeletionFailedError extends AppError {
  constructor(userId: string, message: string = 'Failed to delete user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to delete user ${userId}`;
  }
}

/**
 * Error thrown when the user ID format is invalid.
 * - Extends `AppError`.
 * - Status code: 400 (Bad Request).
 */
export class InvalidUserIdError extends AppError {
  constructor(message: string = 'Invalid user ID format') {
    super(message, 400); // 400 Bad Request
  }
}
