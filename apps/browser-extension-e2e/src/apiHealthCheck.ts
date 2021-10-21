import { apiRoutes } from '@scrapper-gate/shared/routing';
import { request } from 'http';
import { URL } from 'url';

export async function apiHealthCheck() {
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';

  if (!serverUrl) {
    console.warn('SERVER_URL is missing in environment');
  }

  const url = new URL(serverUrl);

  url.pathname = apiRoutes.health;

  console.log(`Performing health check at: ${url.toString()}`);

  return new Promise<void>((resolve, reject) => {
    request(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Unable to connect to API.'));
      }

      resolve();
    }).end();
  });
}
