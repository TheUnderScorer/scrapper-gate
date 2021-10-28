import {
  makeUseTokenStore,
  PersistentTokensStorage,
} from '@scrapper-gate/frontend/domain/auth';
import browser from 'webextension-polyfill';

const storage: PersistentTokensStorage = {
  set: async (tokens) => {
    await browser.storage.local.set({
      tokens: tokens ?? null,
    });
  },
  get: async () =>
    browser.storage.local.get('tokens').then((result) => result.tokens),
};

export const useTokensStore = makeUseTokenStore(storage);
