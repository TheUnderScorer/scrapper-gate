import { Logger } from '@scrapper-gate/shared/logger';

export const logger: Logger = {
  error: console.error,
  info: console.log,
  // TODO Helper function for checking en
  debug: (msg, args) => {
    return console.log(msg, args);
  },
  fatal: console.error,
  warn: console.warn,
};
