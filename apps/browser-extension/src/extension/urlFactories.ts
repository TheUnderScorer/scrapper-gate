import { browser } from 'webextension-polyfill-ts';

export const createContentPageUrl = (path: string) =>
  browser.extension.getURL(`index.html#${path}`);
