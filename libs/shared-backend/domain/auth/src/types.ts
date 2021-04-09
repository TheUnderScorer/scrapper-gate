import { Dictionary } from '@scrapper-gate/shared/common';

export interface TokenUserData {
  userId: string;
}

export type TokenDecoder = (token: string) => Dictionary;

export const isTokenUserData = (data: unknown): data is TokenUserData => {
  return typeof data === 'object' && 'userId' in data;
};
