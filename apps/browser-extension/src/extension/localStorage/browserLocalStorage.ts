/* eslint-disable no-console */

class ChromeLocalStorage {
  async set(key: string, value: any) {
    return new Promise<void>((resolve, reject) => {
      try {
        chrome.storage.local.set(
          {
            [key]: value,
          },
          () => resolve()
        );
      } catch (e) {
        console.error(e);

        reject(e);
      }
    });
  }

  async get(keys: string[]): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(keys, (values) => {
          resolve(values);
        });
      } catch (e) {
        console.error(e);

        reject(e);
      }
    });
  }
}

export const browserLocalStorage = new ChromeLocalStorage();
