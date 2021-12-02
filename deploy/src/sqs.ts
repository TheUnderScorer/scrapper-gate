import * as aws from '@pulumi/aws';
import { createItemName, onlyOnLocalEnv, onlyOnRealEnv } from './utils';

// Queue for running real browser scrappers
const chromiumQueue = 'scrapper-chromium';
const chromiumSqs = new aws.sqs.Queue(createItemName(chromiumQueue), {
  fifoQueue: false,
  name: onlyOnLocalEnv(() => createItemName(chromiumQueue)),
});
const chromiumSqsSsmParam = onlyOnRealEnv(
  () =>
    new aws.ssm.Parameter(createItemName(`${chromiumQueue}-queue`), {
      value: chromiumSqs.arn,
      type: 'String',
      name: createItemName(`${chromiumQueue}-queue`),
    })
);

// Queue used for local testing
const testQueue = 'message-queue-test';
const testSqs = onlyOnLocalEnv(
  () =>
    new aws.sqs.Queue(createItemName(testQueue), {
      fifoQueue: true,
      name: createItemName(`${testQueue}.fifo`),
    })
);

export const queues = {
  chromium: {
    arn: chromiumSqs.arn,
    ssmArn: chromiumSqsSsmParam?.arn,
    url: chromiumSqs.url,
  },
  test: {
    arn: testSqs?.arn,
    url: testSqs?.url,
  },
};
