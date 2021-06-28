import { last } from '@scrapper-gate/shared/common';

export const extractQueueName = (queueUrl: string) => last(queueUrl.split('/'));
