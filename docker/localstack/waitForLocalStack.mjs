import fetch from 'node-fetch';
import { sleep } from 'zx';
import ora from 'ora';

const validStatuses = ['running', 'available'];

class ServiceError extends Error {
  constructor(errorServices) {
    super(`Following services are not working correctly: ${errorServices}`);
  }
}

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

      const isReady = Object.values(response.services).every(service => validStatuses.includes(service));
      const errorServices = Object.entries(response.services).filter(([, status]) => status === 'error').map(([service]) => service);

      if (errorServices.length) {
        throw new ServiceError(errorServices);
      }

      if (isReady) {
        spinner.succeed('Local services are running!');

        return;
      }

      return reschedule();
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }

      return reschedule();
    }
  };

  return reschedule();
}
