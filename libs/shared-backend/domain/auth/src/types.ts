import { Dictionary } from '@scrapper-gate/shared/common';

export interface TokenUserData {
  id: string;
}

export type TokenDecoder = (token: string) => Dictionary;

export const isTokenUserData = (data: unknown): data is TokenUserData => {
  return typeof data === 'object' && 'id' in data;
};
