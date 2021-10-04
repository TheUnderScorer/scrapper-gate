import { pipe } from 'remeda';

export const extractIdFromPathname = (pathStart: string) => (route: string) => {
  if (route.startsWith(pathStart)) {
    return pipe(
      route,
      (route) => route.split('?')[0],
      (path) => path.replace(pathStart, '')
    );
  }

  return '';
};
