import { Logger } from '@scrapper-gate/shared/logger';

export const logger: Logger = {
  error: console.error,
  info: console.log,
  // TODO Helper function for checking env
  debug: (...args) => {
    return console.log('[DEBUG] ', ...args);
  },
  fatal: console.error,
  warn: console.warn,
};
