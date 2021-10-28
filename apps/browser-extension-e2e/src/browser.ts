import { wait } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import fs from 'fs';
import path from 'path';
import { BrowserContext, chromium } from 'playwright';
import { v4 } from 'uuid';
import { createArtifactStream } from '../../../tests/utils/artifacts';

export const extensionPath = path.join(
  __dirname,
  '../../../dist/apps/browser-extension'
);

const browsers: Record<string, BrowserContext> = {};
const doCleanup = true;

export async function createBrowser() {
  const browserId = v4();

  const { currentTestName } = expect.getState();
  const contextsPath = path.resolve(__dirname, 'contexts');

  if (!fs.existsSync(contextsPath)) {
    fs.mkdirSync(contextsPath);
  }

  const fullContextPath = path.join(
    contextsPath,
    currentTestName.concat(browserId),
    '.ctx'
  );

  if (browsers[fullContextPath]) {
    return browsers[fullContextPath];
  }

  console.log(`Creating browser context: ${fullContextPath}`);

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

  browsers[fullContextPath] = ctx;

  ctx.on('page', (page) => {
    const pageId = v4();
    const logStream = createArtifactStream(
      `browser-${browserId}-page-${pageId}.log`
    );

    page.on('requestfailed', async (request) => {
      const response = await request.response();

      logger.error(
        `Request to ${request.url()} failed with status: ${response?.status()}. Reason: ${
          request.failure()?.errorText
        }`
      );
    });

    page.on('console', async (msg) => {
      try {
        const url = page.url();
        const args = await Promise.all(
          msg.args().map((arg) => arg.jsonValue())
        );

        const logs = args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg))
          .map((message) => `[${url}] - ${message}`)
          .join('\n');

        logStream.write(logs);
      } catch (error) {
        console.error('Failed to write logs: ', error);
      }
    });

    page.on('close', () => {
      logStream.close();
    });
  });

  // Wait for extensions to load
  await wait(1500);

  return ctx;
}

export async function cleanup() {
  if (!doCleanup) {
    return;
  }

  await Promise.all(
    Object.entries(browsers).map(async ([ctxPath, browser]) => {
      await browser.close();

      if (fs.existsSync(ctxPath)) {
        try {
          console.log(`Removing context: ${ctxPath}`);

          fs.unlinkSync(ctxPath);
        } catch (error) {
          console.error(`Failed to delete ${ctxPath}`, error);
        }
      }
    })
  );
}
