import { browser } from 'webextension-polyfill-ts';

class BrowserLocalStorage {
  async set(key: string, value: unknown) {
    await browser.storage.local.set({
      [key]: value,
    });
  }

  async get(keys: string[]): Promise<Record<string, unknown>> {
    return browser.storage.local.get(keys);
  }
}

export const browserLocalStorage = new BrowserLocalStorage();
