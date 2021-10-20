import { BrowserContext } from 'playwright';
import { URL } from 'url';
import { readManifest } from './manifest';

export const getExtensionUrl = (browser: BrowserContext, path = '') => {
  const [worker] = browser.serviceWorkers();

  return new URL(worker.url().replace('/background.js', '').concat(path));
};

export const getPopupUrl = async (browser: BrowserContext) => {
  const manifest = await readManifest();

  return getExtensionUrl(browser, `/${manifest.action.default_popup}`);
};
