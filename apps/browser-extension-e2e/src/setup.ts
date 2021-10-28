import fs from 'fs';
import { apiHealthCheck } from './apiHealthCheck';
import { cleanup, extensionPath } from './browser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).setImmediate = (cb: any) => setTimeout(cb, 1);

console.log('Starting E2E tests...');

jest.retryTimes(3);

beforeAll(async () => {
  apiHealthCheck().catch(console.error);

  if (!fs.existsSync(extensionPath)) {
    throw new Error('Extension must be built before launching e2e tests!');
  }
});

afterEach(async () => {
  await cleanup();
});
