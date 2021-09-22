import { wait } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { apiRoutes } from '@scrapper-gate/shared/routing';
import fs from 'fs';
import { request } from 'http';
import path from 'path';
import { chromium } from 'playwright';
import { URL } from 'url';

const extensionPath = path.join(
  __dirname,
  '../../../dist/apps/browser-extension'
);

let contextPaths: string[] = [];

async function apiHealthCheck() {
  if (!process.env.SERVER_URL) {
    throw new Error('SERVER_URL is missing in environment!');
  }

  const url = new URL(process.env.SERVER_URL);

  url.pathname = apiRoutes.health;

  return new Promise<void>((resolve, reject) => {
    request(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('Unable to connect to API.'));
      }

      resolve();
    }).end();
  });
}

beforeAll(async () => {
  await apiHealthCheck();

  if (!fs.existsSync(extensionPath)) {
    throw new Error('Extension must be built before launching e2e tests!');
  }
});

beforeEach(async () => {
  jest.retryTimes(3);

  if (global.browser) {
    return;
  }

  const { currentTestName } = expect.getState();
  const fullContextPath = path.resolve(
    __dirname,
    'contexts',
    currentTestName,
    '.ctx'
  );

  contextPaths.push(fullContextPath);

  const ctx = await chromium.launchPersistentContext(fullContextPath, {
    args: [
      // We use the smallest size we support both because we want to ensure functionality works there
      // and also because it improves test runtime to render fewer pixels, especially in environments
      // that can't hardware-accelerate rendering (eg, docker)
      '--window-size=320x240',
      // Required to work around https://github.com/GoogleChrome/puppeteer/pull/774
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-sandbox',
      // Causes crash dumps to be saved locally (in ${userDataDir}/Crashpad/reports)
      '--noerrdialogs',
      // Writes a verbose chrome log at ${userDataDir}/chrome_debug.log, useful for debugging page crashes
      '--enable-logging',
      '--v=1',
    ],
    headless: false,
  });

  await wait(2000);

  global.browser = ctx;

  ctx.on('page', (page) => {
    page.on('request', (request) => {
      logger.info(`Performing request to ${request.url()}`);
    });

    page.on('requestfailed', async (request) => {
      const response = await request.response();

      logger.error(
        `Request to ${request.url()} failed with status: ${response?.status()}`
      );
    });
  });

  console.log('e2e tests setup ready!');
});

afterAll(async () => {
  if (global.browser) {
    await global.browser.close();
  }

  contextPaths.forEach((path) => {
    if (fs.existsSync(path)) {
      try {
        fs.unlinkSync(path);
      } catch {
        /// Nothing here :0
      }
    }
  });

  contextPaths = [];
});
