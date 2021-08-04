import { paramRoute } from './route';
import { RunResultRouteParams, ScrapperRouteParams } from './types';

export interface DrawerRouteParams {
  drawerOpen?: boolean;
}

export interface ContentScrapperRouteParams
  extends ScrapperRouteParams,
    DrawerRouteParams {}

export interface ScrapperRunResultRouteParams
  extends RunResultRouteParams,
    DrawerRouteParams {}

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
      '/scrapper/:scrapperId?drawerOpen=:drawerOpen',
      {
        drawerOpen: true,
      }
    ),
    createScrapper: '/create-scrapper',
    scrapperRun: paramRoute<ScrapperRunResultRouteParams>(
      '/scrapper-run/:runId?drawerOpen=:drawerOpen',
      {
        drawerOpen: true,
      }
    ),
  },
};
