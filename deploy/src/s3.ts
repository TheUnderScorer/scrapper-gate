import * as aws from '@pulumi/aws';
import { createItemName, onlyOnLocalEnv, onlyOnRealEnv } from './utils';

// Bucket for storing scrapper screenshots
const bucket = new aws.s3.Bucket(createItemName('scrapper-screenshots'), {
  bucket: onlyOnLocalEnv(() => createItemName('scrapper-screenshots')),
  forceDestroy: onlyOnLocalEnv(() => true),
});
const ssmParameter = onlyOnRealEnv(
  () =>
    new aws.ssm.Parameter(createItemName('screenshots-bucket-name'), {
      value: bucket.id,
      type: 'String',
      name: createItemName('screenshots-bucket-name'),
    })
);

export const bucketData = {
  id: bucket.id,
  bucket: bucket.bucket,
  ssmArn: ssmParameter?.arn,
};
