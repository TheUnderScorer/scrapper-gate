import fetch from 'node-fetch';
import { logger } from '@nrwl/devkit';
import { sleep } from 'zx';

export async function waitForLocalStack(
  endpoint = process.env.AWS_S3_ENDPOINT
) {
  const start = performance.now();

  const reschedule = async () => {
    const now = performance.now();
    const diff = now - start;

    logger.error('No response so far...');
    logger.info(`Retrying (took ${diff} ms)`);

    await sleep(5000);

    await schedule();
  };

  const schedule = async () => {
    try {
      const response = await fetch(`${endpoint}/health`).then((resp) =>
        resp.json()
      );

      if (response?.services?.s3 === 'running') {
        logger.log('Local services are running!');

        return;
      }

      return reschedule();
    } catch {
      return reschedule();
    }
  };

  return reschedule();
}
