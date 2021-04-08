import create from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthTokens } from '@scrapper-gate/shared/schema';

export interface TokensStore {
  tokens?: AuthTokens;
  setTokens: (tokens?: AuthTokens) => void;

  [key: string]: unknown;
}

export const useTokensStore = create<TokensStore>(
  persist(
    (set) => ({
      tokens: undefined,
      setTokens: (tokens) => {
        set({
          tokens,
        });
      },
    }),
    {
      name: 'tokensStore',
    }
  )
);
