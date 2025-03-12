import { AppError } from "./app.error";

export class UserCreationFailedError extends AppError {
  constructor(email: string, message: string = "Failed to create user") {
    super(message, 500); // 500 Internal Server Error
    this.message = `Failed to create user ${email}`;
  }
}

export class UserNotFoundError extends AppError {
  constructor(email: string, message: string = "User not found") {
    super(message, 404); // 404 Not Found
    this.message = `User not found ${email}`;
  }
}
