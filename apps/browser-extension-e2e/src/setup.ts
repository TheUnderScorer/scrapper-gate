import { wait } from '@scrapper-gate/shared/common';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const extensionPath = path.join(
  __dirname,
  '../../../dist/apps/browser-extension'
);

let contextPaths: string[] = [];

beforeAll(async () => {
  if (global.browser) {
    return;
  }

  if (!fs.existsSync(extensionPath)) {
    throw new Error('Extension must be built before launching e2e tests!');
  }

  const { testPath } = expect.getState();
  const contextPath = testPath.split('/');

  contextPath.pop();

  const fullContextPath = path.join(...contextPath, '.ctx');

  contextPath.push(fullContextPath);

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

  console.log('e2e tests setup ready!');
});

afterEach(async () => {
  if (!global.browser) {
    return;
  }

  const pages = global.browser.pages();

  await Promise.all(pages.map((page) => page.close()));
});

afterAll(async () => {
  if (global.browser) {
    await global.browser.close();
  }

  contextPaths.forEach((path) => {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  });

  contextPaths = [];
});
