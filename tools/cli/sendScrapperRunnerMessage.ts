import { SqsMessageQueueClient } from '@scrapper-gate/backend/aws';
import { MessageQueueService } from '@scrapper-gate/backend/domain/message-queue-service';
import { Message, MessageQueue } from '@scrapper-gate/backend/message-queue';
import { ScrapperRunnerMessagePayload } from '@scrapper-gate/shared/domain/scrapper';
import { logger } from '@scrapper-gate/shared/logger/console';
import { BrowserType, RunnerTrigger } from '@scrapper-gate/shared/schema';
import { config } from 'aws-sdk';
import yargs from 'yargs';

const args = yargs(process.argv)
  .option('scrapperId', {
    type: 'string',
    require: true,
  })
  .option('browserType', {
    type: 'string',
    require: true,
  }).argv;

async function main() {
  config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const client = new SqsMessageQueueClient({
    sqsEndpoint: process.env.SQS_ENDPOINT,
    logger,
    awsRegion: process.env.AWS_REGION!,
  });

  const messageQueue = new MessageQueue({
    logger,
    messageQueueClient: client,
  });

  const messageQueueService = new MessageQueueService({
    messageQueue,
    chromiumScraperQueueUrl: process.env.AWS_SQS_SCRAPPER_CHROMIUM_QUEUE_URL!,
    webkitScrapperQueueUrl: process.env.AWS_SQS_SCRAPPER_WEBKIT_QUEUE_URL!,
    mozillaScrapperQueueUrl: process.env.AWS_SQS_SCRAPPER_MOZILLA_QUEUE_URL!,
  });

  const message: Message<ScrapperRunnerMessagePayload> = {
    date: new Date().toISOString(),
    traceId: 'trace',
    payload: {
      runId: args.scrapperId!,
      trigger: RunnerTrigger.Manual,
    },
  };

  logger.info('Sending message...');

  await messageQueueService.sendToScrapperQueue(
    message,
    args.browserType as BrowserType
  );

  await messageQueue.commit();

  logger.info('Message sent.');
}

main().catch((error) => {
  console.error(error);

  process.exit(1);
});
