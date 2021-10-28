import { forEachObj } from 'remeda';

const parseKeys = (
  keys: string | string[] | Record<string, any> | null | undefined
) => {
  let parsedKeys: string[] = [];

  if (typeof keys === 'string') {
    parsedKeys = [keys];
  } else if (Array.isArray(keys)) {
    parsedKeys = keys;
  } else if (typeof keys === 'object') {
    parsedKeys = Object.keys(keys as object);
  }

  if (!parsedKeys.length) {
    throw new TypeError('Failed to parse keys.');
  }

  return parsedKeys;
};

export const mockBrowserStorage = () => {
  const store = new Map<string, unknown>();

  const setupMocks = () => {
    mockBrowser.storage.local.get.mock(async (keys) => {
      const parsedKeys = parseKeys(keys);

      return parsedKeys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: store.get(key),
        }),
        {}
      );
    });

    mockBrowser.storage.local.set.mock(async (obj) => {
      forEachObj.indexed(obj, (value, key) => {
        store.set(key, value);
      });
    });
  };

  setupMocks();

  return {
    store,
    setupMocks,
  };
};
