import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_ENV } from '../config/environment';
import { logger } from '../logger/logger';
import { InvalidCredentialsError } from '../errors/auth.errors';
import { UserCreationFailedError } from '../errors/user.errors';
import { UserRole } from '../models/user.model';
import { UserService } from './user.service';

export class AuthService {
  constructor(private userService: UserService) {}

  async registerUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string }> {
    const user = await this.userService.create(
      email,
      password,
      '',
      UserRole.USER,
      true,
    );
    logger.info(`auth.service: registerUser:`);
    if (!user) {
      throw new UserCreationFailedError(email);
    }

    return { id: user.id, email: user.email };
  }

  async generateToken(
    email: string,
    password: string,
  ): Promise<string> {
    logger.info(`auth.service: generateToken:`);
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError(email);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new InvalidCredentialsError(email);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, APP_ENV.JWT_SECRET, {
      expiresIn: APP_ENV.JWT_EXPIRATION,
    });

    return token;
  }
}
