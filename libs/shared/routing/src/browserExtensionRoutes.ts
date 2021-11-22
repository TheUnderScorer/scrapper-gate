import { activeNodeQueryKey, returnUrlQueryKey } from './queryKeys';
import { paramRoute, RouteParams } from './route';
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

export interface PopupCodeEditorParams extends RouteParams {
  sessionId: string;
}

export const browserExtensionRoutes = {
  popup: {
    login: '/login',
    signUp: '/sign-up',
    welcome: '/',
    scrappers: '/scrappers/',
    scrapperRuns: '/scrapper-runs/',
    codeEditor: paramRoute<PopupCodeEditorParams>('/code-editor/:sessionId'),
  },
  content: {
    scrapper: paramRoute<ContentScrapperRouteParams>(
      `/scrapper/:scrapperId?drawerOpen=:drawerOpen&${activeNodeQueryKey}=:stepId&${returnUrlQueryKey}=:returnUrl`,
      {
        drawerOpen: true,
      }
    ),
    createScrapper: '/create-scrapper',
    scrapperRun: paramRoute<ScrapperRunResultRouteParams>(
      `/scrapper-run/:runId?drawerOpen=:drawerOpen&${returnUrlQueryKey}=:returnUrl`,
      {
        drawerOpen: true,
      }
    ),
  },
};
