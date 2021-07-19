import { paramRoute } from './route';

export interface ContentScrapperRouteParams {
  scrapperId?: string;
  drawerOpen?: boolean;

  [key: string]: string | number | boolean | undefined;
}

export const browserExtensionRoutes = {
  popup: {
    login: '/login',
    signUp: '/sign-up',
    welcome: '/',
    scrappers: '/scrappers/',
    scrapperResults: '/scrapper-results/',
  },
  content: {
    scrapper: paramRoute<ContentScrapperRouteParams>(
      '/scrapper/:scrapperId?drawerOpen=:drawerOpen'
    ),
    createScrapper: '/create-scrapper',
  },
};
