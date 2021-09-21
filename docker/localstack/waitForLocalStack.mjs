import fetch from 'node-fetch';
import { logger } from '@nrwl/devkit';
import { sleep } from 'zx';

export async function waitForLocalStack(endpoint = process.env.AWS_S3_ENDPOINT) {
  const schedule = async () => {
    await sleep(1000);

    try {
      const response = await fetch(`${endpoint}/health`).then((resp) =>
        resp.json()
      );

      if (response?.services?.s3 === 'running') {
        logger.log('Local services are running!');

        return;
      }

      return schedule();
    } catch {
      return schedule();
    }
  };

  return schedule();
}
