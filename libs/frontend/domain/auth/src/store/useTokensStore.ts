import { logger } from '@scrapper-gate/shared/logger/console';
import { AuthTokens } from '@scrapper-gate/shared/schema';
import create from 'zustand';
import { PersistentTokensStorage } from '../types';

export interface TokensStore {
  tokens?: AuthTokens;
  setTokens: (tokens?: AuthTokens) => void;

  [key: string]: unknown;
}

export const makeUseTokenStore = (storage: PersistentTokensStorage) => {
  const store = create<TokensStore>((set) => ({
    tokens: undefined,
    setTokens: (tokens) => {
      set({
        tokens,
      });

      storage.set(tokens).catch(logger.error);
    },
  }));

  storage.get().then((tokens) => {
    logger.debug('Tokens from storage:', tokens);

    if (tokens) {
      store.setState({
        tokens,
      });
    }
  });

  return store;
};

export type UseTokenStoreHook = ReturnType<typeof makeUseTokenStore>;

export interface WithUseTokenStoreHook {
  useTokensStore: UseTokenStoreHook;
}
