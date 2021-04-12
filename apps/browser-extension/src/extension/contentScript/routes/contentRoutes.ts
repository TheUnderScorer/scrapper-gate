import {
  ManageScrapperParams,
  ManageScrapperScreen,
  ManageScrapperStepParams,
} from './types';

interface ViewResultParams {
  resultId?: string;
  drawerOpen?: boolean;
}

export const contentRoutes = {
  createScrapper: () => '/create-scrapper',
  manageScrapper({
    id = '',
    screen = ManageScrapperScreen.Steps,
    drawerOpen = false,
  }: ManageScrapperParams = {}) {
    if (id) {
      return `/manage-scrapper/${id}/${screen}?drawerOpen=${
        drawerOpen ? 1 : 0
      }`;
    }

    return `/manage-scrapper/:id`;
  },
  manageScrapperStep: ({
    scrapperId,
    stepId,
    drawerOpen = true,
  }: ManageScrapperStepParams = {}) => {
    if (!scrapperId || !stepId) {
      return `/manage-scrapper/:id/manage-step/:stepId`;
    }

    return `/manage-scrapper/${scrapperId}/manage-step/${stepId}?drawerOpen=${
      drawerOpen ? 1 : 0
    }`;
  },
  viewResult: ({
    resultId = '',
    drawerOpen = false,
  }: ViewResultParams = {}) => {
    if (!resultId) {
      return `/result/:resultId`;
    }

    return `/result/${resultId}?contentDrawer=${drawerOpen ? 1 : 0}`;
  },
};

export const allManageScrapperScreenPaths = Object.values(
  ManageScrapperScreen
).map((screen) => `${contentRoutes.manageScrapper()}/${screen}`);
