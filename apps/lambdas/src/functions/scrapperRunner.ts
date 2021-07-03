import type { SQSEvent } from 'aws-lambda';

console.log('Scrapper runner start...');

export const scrapperRunner = async (event: SQSEvent) => {
  console.log('Received message');
  console.log(event);
};
