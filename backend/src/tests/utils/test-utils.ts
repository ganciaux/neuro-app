import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
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
  options?: {
    body?: object;
    files?: Array<{
      field: string;
      path: string;
    }>;
  }
): Promise<request.Response> {
  const req = request(server)
    [method](url)
    .set({
      Authorization: `Bearer ${user.token}`,
      'X-Request-ID': 'test-request-id',
    });

  if (options?.files) {
    for (const file of options.files) {
      req.attach(file.field, file.path);
    }

    if (options?.body && ['post', 'put', 'patch'].includes(method)) {
      for (const [key, value] of Object.entries(options.body)) {
        req.field(key, value);
      }
    }
    
    return req;
  }

  if (options?.body && ['post', 'put', 'patch'].includes(method)) {
    return req.send(options.body);
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

export function ensureTestUploadDir(uploadDir:string) {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

export function clearTestUploadDir(uploadDir:string) {
  if (fs.existsSync(uploadDir)) {
    fs.readdirSync(uploadDir).forEach(file => {
      const filePath = path.join(uploadDir, file);
      fs.rmSync(filePath, { force: true, recursive: true });
    });
  }
}

export function getTestFilePath(uploadDir:string, filename: string) {
  return path.join(uploadDir, filename);
}
