import { URL } from 'url';
import { readManifest } from './manifest';

export const getExtensionUrl = async (path = '') => {
  const [worker] = await global.browser.serviceWorkers();

  return new URL(worker.url().replace('/background.js', '').concat(path));
};

export const getPopupUrl = async () => {
  const manifest = await readManifest();

  return getExtensionUrl(`/${manifest.action.default_popup}`);
};
