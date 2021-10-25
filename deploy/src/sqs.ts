import * as aws from '@pulumi/aws';
import { createItemName, onlyOnLocalEnv, onlyOnRealEnv } from './utils';

// Queue for running real browser scrappers
const chromiumSqs = new aws.sqs.Queue(createItemName('scrapper-chromium'), {
  fifoQueue: false,
  name: onlyOnLocalEnv(() => createItemName('scrapper-chromium')),
});
const chromiumSqsSsmParam = onlyOnRealEnv(
  () =>
    new aws.ssm.Parameter(createItemName('scrapper-chromium-queue'), {
      value: chromiumSqs.arn,
      type: 'String',
      name: createItemName('scrapper-chromium-queue'),
    })
);

// Queue used for local testing
const testSqs = onlyOnLocalEnv(
  () =>
    new aws.sqs.Queue(createItemName('message-queue-test'), {
      fifoQueue: true,
      name: createItemName('message-queue-test.fifo'),
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
