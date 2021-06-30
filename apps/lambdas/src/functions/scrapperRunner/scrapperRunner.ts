import type { SQSEvent } from 'aws-lambda';

export const scrapperRunner = async (event: SQSEvent) => {
  console.log(event);
};
