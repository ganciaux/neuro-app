import { AppError } from "./app.error";

export class EmailAlreadyExistsError extends AppError {
    constructor(message: string = "Email already exists") {
      super(message, 409); // 409 Conflict
    }
  }
  
  export class InvalidCredentialsError extends AppError {
    constructor(email: string, message: string = "Invalid credentials") {
      super(message, 401); // 401 Unauthorized
      this.message = `Invalid credentials ${email}`;
    }
  }