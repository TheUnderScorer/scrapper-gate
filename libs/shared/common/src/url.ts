import { trimEndChar } from './text/text';

export const areUrlsEqual = (urlA: string, urlB: string) => {
  return trimEndChar(urlA, '/') === trimEndChar(urlB, '/');
};
