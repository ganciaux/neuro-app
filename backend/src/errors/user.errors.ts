import { AppError } from './app.error';

export class UserCreationFailedError extends AppError {
  constructor(email: string, message: string = 'Failed to create user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to create user ${email}`;
  }
}

export class UserRegisterFailedError extends AppError {
  constructor(email: string, message: string = 'Failed to register user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to register user ${email}`;
  }
}

export class UserNotFoundEmailError extends AppError {
  constructor(email: string, message: string = 'User not found') {
    super(message, 404); // 404 Not Found
    this.message = `User not found ${email}`;
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string = 'User not found') {
    super(message, 404); // 404 Not Found
  }
}

export class UserDeletionFailedError extends AppError {
  constructor(userId: string, message: string = 'Failed to delete user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to delete user ${userId}`;
  }
}

export class InvalidUserIdError extends AppError {
  constructor(message: string = 'Invalid user ID format') {
    super(message, 400); // 400 Bad Request
  }
}

export class UserUpdateFailedError extends AppError {
  constructor(message: string = 'Failed to update user') {
    super(message, 400); // 400 Bad Request
  }
}
