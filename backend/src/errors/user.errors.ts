import { AppError } from './app.error';

export class UserFetchByEmailFailedError extends AppError {
  constructor(email: string, message: string = 'Failed to fetch user by email') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user by email ${email}`;
  }
}

export class UserFetchByIdFailedError extends AppError {
  constructor(id: string, message: string = 'Failed to fetch user by id') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user by id ${id}`;
  }
}

export class UserFetchFailedError extends AppError {
  constructor(criteria: string, message: string = 'Failed to fetch user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to fetch user ${criteria}`;
  }
}

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

export class UserFindAllFailedError extends AppError {
  constructor(message: string = 'Failed to get users') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to get users`;
  }
}

export class UserCountFailedError extends AppError {
  constructor(message: string = 'Failed to count user') {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to count user`;
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
