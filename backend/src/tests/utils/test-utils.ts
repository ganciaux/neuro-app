import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_ENV } from '../../config/environment';
import { User } from '@prisma/client';
import request from 'supertest';
import { Server } from 'http';

export function generateToken(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, APP_ENV.JWT_SECRET, {
    expiresIn: APP_ENV.JWT_EXPIRATION,
  });
}

export async function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return {
    hash,
    salt,
  };
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export function authedRequest(
  server: Server,
  user: { token: string },
  method: HttpMethod,
  url: string,
  body?: object,
): Promise<request.Response> {
  const req = request(server)
    [method](url)
    .set({
      Authorization: `Bearer ${user.token}`,
      'X-Request-ID': 'test-request-id',
    });

  if (body && ['post', 'put', 'patch'].includes(method)) {
    return req.send(body);
  }
  return req;
}

export function unauthedRequest(
  server: Server,
  method: HttpMethod,
  url: string,
  body?: object,
): Promise<request.Response> {
  const req = request(server)[method](url);
  if (body && ['post', 'put', 'patch'].includes(method)) {
    return req.send(body);
  }
  return req;
}
