import { Environment } from '@scrapper-gate/shared/common';
import { Logger } from '@scrapper-gate/shared/logger';
import { S3 } from 'aws-sdk';
import { createAwsLogger } from './awsLogger';

export interface CreateS3Dependencies {
  environment: Environment;
  logger: Logger;
}

export const createS3Client = ({ environment, logger }: CreateS3Dependencies) =>
  new S3({
    logger: createAwsLogger(logger),
    s3ForcePathStyle: environment === Environment.Development,
    endpoint:
      environment === Environment.Development
        ? 'http://localhost:4566'
        : undefined,
  });

export const getFileBaseUrl = ({
  environment,
}: Pick<CreateS3Dependencies, 'environment'>) =>
  environment === Environment.Development ? 'http://localhost:4566' : undefined;
