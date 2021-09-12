import {
  createAwsLogger,
  createS3Client,
  setupAwsContainer,
  SqsMessageQueueClient,
} from '@scrapper-gate/backend/aws';
import { FilesService } from '@scrapper-gate/backend/domain/files';
import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import {
  MessageQueue,
  MessageQueueClient,
} from '@scrapper-gate/backend/message-queue';
import { Logger } from '@scrapper-gate/shared/logger';
import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import { config } from 'aws-sdk';

export const setupServices = async (
  container: AwilixContainer,
  skipHealthCheck?: boolean
) => {
  const logger = container.resolve<Logger>('logger');

  logger.info('Setting up services...');

  setupAwsContainer(container);

  container.register({
    chromiumScraperQueueUrl: asValue(
      process.env.AWS_SQS_SCRAPPER_CHROMIUM_QUEUE_URL
    ),
    mozillaScrapperQueueUrl: asValue(
      process.env.AWS_SQS_SCRAPPER_MOZILLA_QUEUE_URL
    ),
    webkitScrapperQueueUrl: asValue(
      process.env.AWS_SQS_SCRAPPER_WEBKIT_QUEUE_URL
    ),
    messageQueue: asClass(MessageQueue).scoped(),
    messageQueueClient: asClass(SqsMessageQueueClient).singleton(),
    messageQueueService: asClass(MessageQueueService).scoped(),
    filesService: asClass(FilesService).scoped(),
    s3: asFunction(createS3Client).scoped(),
  });

  logger.info('Setting up aws...');

  container.resolve('configureAws');

  config.update({
    logger: createAwsLogger(container.resolve<Logger>('logger')),
    region: container.resolve('awsRegion'),
    accessKeyId: container.resolve('awsAccessKeyId'),
    secretAccessKey: container.resolve('awsSecretAccessKey'),
  });

  if (!skipHealthCheck) {
    logger.info('Performing message queue health check...');

    const messageQueueService = container.resolve<MessageQueueService>(
      'messageQueueService'
    );
    const messageQueueClient =
      container.resolve<MessageQueueClient>('messageQueueClient');

    await messageQueueClient.healthCheck(messageQueueService.queueUrls);
  }

  logger.info('Services ready.');
};
