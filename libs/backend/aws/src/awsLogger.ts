import { Logger as AppLogger } from '@scrapper-gate/shared/logger';
import { Logger } from 'aws-sdk/lib/config-base';

export const createAwsLogger = (logger: AppLogger): Logger => ({
  log: (...messages: unknown[]) => {
    messages.forEach((message) => {
      logger.info(message);
    });
  },
});
