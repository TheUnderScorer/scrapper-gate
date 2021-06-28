import {
  MessageQueueClient,
  SendMessageParams,
} from '@scrapper-gate/backend/message-queue';
import { Logger } from '@scrapper-gate/shared/logger';
import { SQS } from 'aws-sdk';
import { createAwsLogger } from './awsLogger';
import { extractQueueName } from './utils/extractQueueName';

export interface SqsMessageQueueClientDependencies {
  sqs: SQS;
  logger: Logger;
  sqsEndpoint?: string;
  awsRegion: string;
}

export class SqsMessageQueueClient implements MessageQueueClient {
  private readonly sqs: SQS;

  constructor(
    private readonly dependencies: SqsMessageQueueClientDependencies
  ) {
    this.sqs = new SQS({
      logger: createAwsLogger(dependencies.logger),
      endpoint: dependencies.sqsEndpoint,
      region: dependencies.awsRegion,
    });
  }

  async healthCheck(expectedQueueUrls: string[]) {
    let nextToken: string | undefined;

    const expectedQueueNames = expectedQueueUrls.map(extractQueueName);

    const seenNames = new Set<string>();

    do {
      const allQueues = await this.sqs
        .listQueues({
          NextToken: nextToken,
        })
        .promise();

      if (!allQueues.QueueUrls?.length) {
        throw new Error('No queues found.');
      }

      const existingQueueNames = allQueues.QueueUrls.map(extractQueueName);

      nextToken = allQueues.NextToken;

      expectedQueueNames.forEach((expectedUrl) => {
        if (existingQueueNames.includes(expectedUrl)) {
          seenNames.add(expectedUrl);
        }
      });
    } while (nextToken);

    if (seenNames.size !== expectedQueueUrls.length) {
      const seenNamesArray = Array.from(seenNames.values());
      const missingNames = expectedQueueNames.filter(
        (queueUrl) => !seenNamesArray.includes(queueUrl)
      );

      throw new Error(
        `Following queues does not exist: ${missingNames.join(', ')}`
      );
    }
  }

  async send({
    message,
    queueUrl,
    groupId,
  }: SendMessageParams<unknown>): Promise<void> {
    await this.sqs
      .sendMessage({
        MessageBody: JSON.stringify(message),
        MessageGroupId: groupId,
        QueueUrl: queueUrl,
      })
      .promise();
  }
}
