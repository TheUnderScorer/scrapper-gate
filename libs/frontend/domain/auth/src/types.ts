import { AuthTokens, Maybe } from '@scrapper-gate/shared/schema';

export interface PersistentTokensStorage {
  set: (tokens?: AuthTokens) => Promise<void>;
  get: () => Promise<Maybe<AuthTokens>>;
}
