import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_ENV } from '../config/environment';
import { createUser, findUserByEmail } from './user.service';
import { logger } from '../logger/logger';
import { InvalidCredentialsError } from '../errors/auth.errors';
import { UserCreationFailedError } from '../errors/user.errors';

/**
 * Service for authentication.
 */
export async function registerUser(email: string, password: string):Promise<{id: string, email: string}> {
  logger.info(`auth.service: registerUser:`);
  
  const user = await createUser(email, password);

  if (!user) {
    throw new UserCreationFailedError(email);
  }
  return { id: user.id, email: user.email };
}

export async function generateToken(email: string, password: string):Promise<string> {
  logger.info(`auth.service: generateToken:`)

  const user = await findUserByEmail(email);

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
