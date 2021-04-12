import create from 'zustand';
import { AuthTokens } from '@scrapper-gate/shared/schema';

export interface TokensStore {
  tokens?: AuthTokens;
  setTokens: (tokens?: AuthTokens) => void;

  [key: string]: unknown;
}

export const useTokensStore = create<TokensStore>((set) => ({
  tokens: undefined,
  setTokens: (tokens) => {
    set({
      tokens,
    });
  },
}));
