import browser from 'webextension-polyfill';

export const getPopupUrl = (path: string) =>
  browser.runtime.getURL(`index.html#${path}`);
