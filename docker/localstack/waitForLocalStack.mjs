import fetch from 'node-fetch';
import { sleep } from 'zx';
import ora from 'ora';

export async function waitForLocalStack(
  endpoint = process.env.AWS_S3_ENDPOINT
) {
  const healthEndpoint = `${endpoint}/health`;

  const spinner = ora(`Waiting for local services at ${endpoint} \n`).start();

  const reschedule = async () => {
    await sleep(5000);

    await checkLocalServices();
  };

  const checkLocalServices = async () => {
    try {
      const response = await fetch(healthEndpoint).then((resp) => resp.json());

      if (response?.services?.s3 === 'running') {
        spinner.succeed('Local services are running!');

        return;
      }

      return reschedule();
    } catch {
      return reschedule();
    }
  };

  return reschedule();
}
