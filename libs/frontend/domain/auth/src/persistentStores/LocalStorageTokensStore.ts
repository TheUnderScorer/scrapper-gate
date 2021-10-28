import { PersistentTokensStorage } from '../types';

const key = 'sg_tokens';

export const localStorageTokensStore: PersistentTokensStorage = {
  set: async (tokens) => {
    localStorage.setItem(key, tokens ? JSON.stringify(tokens) : '');
  },
  get: async () => {
    const result = localStorage.getItem(key);

    return result ? JSON.parse(result) : undefined;
  },
};
