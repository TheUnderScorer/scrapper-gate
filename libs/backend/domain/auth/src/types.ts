import { Dictionary } from '@scrapper-gate/shared/common';

export interface TokenUserData {
  userId: string;
}

export type TokenDecoder = (token: string) => Dictionary;

export const isTokenUserData = (data: unknown): data is TokenUserData => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return typeof data === 'object' && 'userId' in data!;
};
