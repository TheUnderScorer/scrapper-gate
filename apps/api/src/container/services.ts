import {
  createAwsLogger,
  SqsMessageQueueClient,
} from '@scrapper-gate/backend/aws';
import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import {
  MessageQueue,
  MessageQueueClient,
} from '@scrapper-gate/backend/message-queue';
import { Logger } from '@scrapper-gate/shared/logger';
import { asClass, asValue, AwilixContainer } from 'awilix';
import { config } from 'aws-sdk';

export const setupServices = async (
  container: AwilixContainer,
  skipHealthCheck?: boolean
) => {
  const logger = container.resolve<Logger>('logger');

  logger.info('Setting up services...');

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
    awsRegion: asValue(process.env.AWS_REGION),
    awsAccessKeyId: asValue(process.env.AWS_ACCESS_KEY_ID),
    awsSecretAccessKey: asValue(process.env.AWS_SECRET_ACCESS_KEY),
    sqsEndpoint: asValue(process.env.AWS_SQS_ENDPOINT_URL),
    messageQueue: asClass(MessageQueue).scoped(),
    messageQueueClient: asClass(SqsMessageQueueClient).singleton(),
    messageQueueService: asClass(MessageQueueService).scoped(),
  });

  logger.info('Setting up aws...');

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
