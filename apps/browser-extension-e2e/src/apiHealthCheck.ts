import { apiRoutes } from '@scrapper-gate/shared/routing';
import { request } from 'http';
import { URL } from 'url';

export async function apiHealthCheck() {
  const url = new URL(process.env.SERVER_URL || 'http://localhost:3001');

  url.pathname = apiRoutes.health;

  console.log(`Performing health check at: ${url.toString()}`);

  return new Promise<void>((resolve, reject) => {
    const req = request(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Unable to connect to API.'));
      }

      req.end();

      resolve();
    }).setTimeout(50000);

    req.on('error', (error) => {
      reject(error);
    });
  });
}
