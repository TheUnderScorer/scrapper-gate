import { pipe } from 'remeda';

export const extractScrapperIdFromRoute = (route: string) => {
  if (route.startsWith('/scrapper/')) {
    return pipe(
      route,
      (route) => route.split('?')[0],
      (path) => path.replace('/scrapper/', '')
    );
  }

  return '';
};
