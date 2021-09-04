import { Logger } from '@scrapper-gate/shared/logger';
import { config } from 'aws-sdk';
import { createAwsLogger } from './awsLogger';

export interface ConfigureAwsDependencies {
  logger: Logger;
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
}

export const configureAws = ({
  awsAccessKeyId,
  awsSecretAccessKey,
  awsRegion,
  logger,
}: ConfigureAwsDependencies) => {
  logger.info(`Setting up aws for region ${awsRegion}...`);

  config.update({
    logger: createAwsLogger(logger),
    region: awsRegion,
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });

  logger.info('AWS setup completed.');
};
