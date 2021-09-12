import { asFunction, asValue, AwilixContainer } from 'awilix';
import { configureAws } from './configureAws';
import { getFileBaseUrl } from './s3';

export const setupAwsContainer = (container: AwilixContainer) => {
  container.register({
    awsRegion: asValue(process.env.AWS_REGION),
    awsAccessKeyId: asValue(process.env.AWS_ACCESS_KEY_ID),
    awsSecretAccessKey: asValue(process.env.AWS_SECRET_ACCESS_KEY),
    sqsEndpoint: asValue(process.env.AWS_SQS_ENDPOINT_URL),
    fileBaseUrl: asFunction(getFileBaseUrl).singleton(),
    configureAws: asFunction(configureAws),
  });
};
