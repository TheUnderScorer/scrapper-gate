import { paramRoute, RouteParams } from './route';
import { RunResultRouteParams } from './types';

export interface ContentScrapperRouteParams extends RouteParams {
  scrapperId?: string;
  drawerOpen?: boolean;
}

export interface ScrapperRunResultRouteParams extends RunResultRouteParams {
  drawerOpen?: boolean;
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
    scrapperRun: paramRoute<ScrapperRunResultRouteParams>(
      '/scrapper-run/:runId?drawerOpen=:drawerOpen'
    ),
  },
};
