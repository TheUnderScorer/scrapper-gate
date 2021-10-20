import fs from 'fs';
import { apiHealthCheck } from './apiHealthCheck';
import { cleanup, extensionPath } from './browser';

jest.retryTimes(3);

beforeAll(async () => {
  await apiHealthCheck();

  if (!fs.existsSync(extensionPath)) {
    throw new Error('Extension must be built before launching e2e tests!');
  }
});

afterAll(async () => {
  await cleanup();
});
