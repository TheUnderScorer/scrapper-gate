import create from 'zustand';
import { AuthTokens } from '@scrapper-gate/shared/domain/auth';
import { persist } from 'zustand/middleware';

export interface TokensStore {
  tokens?: AuthTokens;
  setTokens: (tokens?: AuthTokens) => void;

  [key: string]: unknown;
}

export const useTokensStore = create<TokensStore>(
  persist(
    (set, get) => ({
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
