import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_ENV } from '../config/environment';
import { logger } from '../logger/logger';
import { AuthCredentialsError } from '../errors/auth.errors';
import { UserCreationFailedError } from '../errors/user.errors';
import { UserService } from './user.service';
import { Role } from '@prisma/client';
export class AuthService {
  constructor(private userService: UserService) { }

  async registerUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string }> {
    const user = await this.userService.create(
      email,
      password,
      '',
      Role.USER,
      true,
    );
    logger.debug(`auth.service: registerUser:`);
    if (!user) {
      throw new UserCreationFailedError(email);
    }

    return { id: user.id, email: user.email };
  }

  async generateToken(
    email: string,
    password: string,
  ): Promise<string> {
    logger.debug(`auth.service: generateToken:`);
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new AuthCredentialsError(email);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AuthCredentialsError(email);
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
