import { logger } from '@scrapper-gate/frontend/logger';

declare function importScripts(path: string): void;

try {
  logger.info('Booting background...');
  // eslint-disable-next-line no-restricted-globals,@typescript-eslint/no-explicit-any
  (self as any).window = self;
  importScripts('backgroundMain.js');

  logger.debug('Background loaded');
} catch (e) {
  console.error(e);
}
