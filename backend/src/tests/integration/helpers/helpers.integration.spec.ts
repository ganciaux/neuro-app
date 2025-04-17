// tests/integration/utils/request.test.ts
import { Request, Response } from 'express';
import express from 'express';
import { Server } from 'http';
import { authedRequest, unauthedRequest } from '../../utils/test-utils';
import { startTestServer } from '../../test-helpers';
import { stopTestServer } from '../../test-helpers';
import { app } from '../../../config/server';
import { PrismaClient } from '@prisma/client';

describe('Request Helpers', () => {
    let server: Server;
    let prisma: PrismaClient;
    
    beforeAll(async () => {
      ({ server, prisma } = await startTestServer(app));
    });
  
    afterAll(async () => {
      await stopTestServer(prisma, server);
    });

  beforeAll(() => {
    app.get('/protected', (req: Request, res: Response) => {
      if (!req.headers.authorization) {
        res.status(401).send();
      } else {
        res.status(200).send({ success: true });
      }
    });
    app.post('/echo', (req: Request, res: Response) => {
      res.status(200).send(req.body);
    });
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  describe('authedRequest', () => {
    it('should send authorized requests', async () => {
      const response = await authedRequest(server, { token: 'valid-token' }, 'get', '/protected');
      expect(response.status).toBe(200);
    });
  });

  describe('unauthedRequest', () => {
    it('should send unauthorized requests', async () => {
      const response = await unauthedRequest(server, 'post', '/echo', { test: 'value' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ test: 'value' });
    });
  });
});