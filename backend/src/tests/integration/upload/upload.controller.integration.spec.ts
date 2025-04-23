import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { authedRequest, clearTestUploadDir, ensureTestUploadDir } from '../../utils/test-utils';
import {
  seedUsersTestData,
  startTestServer,
  stopTestServer,
} from '../../test-helpers';
import { SeededUsers } from '../../../models/user.model';
import { app } from '../../../config/server';
import { APP_ENV } from '../../../config/environment';

const API_BASE_PATH = '/api/v1/upload';
const TEST_UPLOAD_FOLDER = `${APP_ENV.TEST_UPLOAD_FOLDER}`;

describe('FileService Integration', () => {
  const testFilePath = path.join(__dirname, '../../fixtures/test-image.jpg');
  let server: Server;
  let prisma: PrismaClient;
  let seededUsers: SeededUsers;

  beforeAll(async () => {
    ensureTestUploadDir(TEST_UPLOAD_FOLDER);
    ({ server, prisma } = await startTestServer(app));
  });

  beforeEach(async () => {
    seededUsers = await seedUsersTestData(prisma);
  });

  afterEach(async () => {
    clearTestUploadDir(TEST_UPLOAD_FOLDER);
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    clearTestUploadDir(TEST_UPLOAD_FOLDER);
    await stopTestServer(prisma, server);
  });

  it('should upload a single file successfully', async () => {
    const entityId = randomUUID();
    const type = 'user';
    const res = await authedRequest(
      server,
      seededUsers.user,
      'post',
      `${API_BASE_PATH}`,  {body: {type, entityId}, files: [{ field: 'file', path: testFilePath }],
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'File uploaded successfully');
    expect(res.body).toHaveProperty('type', type);
    expect(res.body).toHaveProperty('entityId', entityId);
    expect(res.body).toHaveProperty('file');
    expect(res.body.file).toHaveProperty('originalName', 'test-image.jpg');
    expect(res.body.file).toHaveProperty('mimeType', 'image/jpeg');
    //expect(res.body.file).toHaveProperty('path', path.join(TEST_UPLOAD_FOLDER, 'user/1/test-image.jpg'));
    //expect(res.body.file).toHaveProperty('url', `http://localhost:3000/uploads/user/1/test-image.jpg`);

    const filePath = path.join(TEST_UPLOAD_FOLDER, res.body.file.filename);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });

});
