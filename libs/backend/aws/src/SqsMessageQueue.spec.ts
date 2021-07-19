/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Message } from '@scrapper-gate/backend/message-queue';
import { wait } from '@scrapper-gate/shared/common';
import { createMockProxy } from 'jest-mock-proxy';
import { SqsMessageQueueClient } from './SqsMessageQueue.client';

const queueUrl = process.env.AWS_SQS_MESSAGE_TEST_QUEUE_URL!;

describe('SQS Message queue client', () => {
  let client: SqsMessageQueueClient;

  beforeEach(() => {
    client = new SqsMessageQueueClient({
      awsRegion: process.env.AWS_REGION!,
      logger: createMockProxy(),
      sqsEndpoint: process.env.AWS_SQS_ENDPOINT_URL,
    });
  });

  it('should send and receive message', async () => {
    const callback = jest.fn();

    const message: Message<{ test: boolean }> = {
      date: new Date().toISOString(),
      payload: {
        test: true,
      },
      traceId: '#trace_id',
    };

    const unsub = await client.receive({
      queueUrl,
      maxMessages: 1,
      ms: 2000,
      callback,
      removeAfter: true,
    });

    await client.send({
      message,
      queueUrl,
      groupId: 'test',
    });

    await wait(10000);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith([message]);

    await unsub();
  }, 1000000);
});
